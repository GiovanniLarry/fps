import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPackageSchema } from "@shared/schema";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Package tracking routes
  app.get("/api/packages", async (req, res) => {
    try {
      const { userId } = req.query;
      const packages = await storage.getAllPackages(userId as string);
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  app.get("/api/packages/:id", async (req, res) => {
    try {
      const pkg = await storage.getPackage(req.params.id);
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch package" });
    }
  });

  app.post("/api/packages", async (req, res) => {
    try {
      const validatedData = insertPackageSchema.parse(req.body);
      const pkg = await storage.createPackage(validatedData);
      
      // Trigger tracking data fetch
      trackPackageAsync(pkg.trackingNumber);
      
      res.status(201).json(pkg);
    } catch (error) {
      res.status(400).json({ error: "Invalid package data" });
    }
  });

  app.post("/api/packages/bulk", async (req, res) => {
    try {
      const { userId, trackingNumbers } = req.body;
      const results = [];
      for (const tn of trackingNumbers) {
        const pkg = await storage.createPackage({ userId, trackingNumber: tn });
        trackPackageAsync(tn);
        results.push(pkg);
      }
      res.status(201).json(results);
    } catch (error) {
      res.status(400).json({ error: "Bulk import failed" });
    }
  });

  app.delete("/api/packages/:id", async (req, res) => {
    try {
      const success = await storage.deletePackage(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete package" });
    }
  });

  // Track specific package using 17track API
  app.post("/api/track/:trackingNumber", async (req, res) => {
    try {
      const trackingNumber = req.params.trackingNumber;
      const trackingData = await fetchTrackingData(trackingNumber);
      
      // Update package in storage
      const existingPackage = await storage.getPackageByTrackingNumber(trackingNumber);
      if (existingPackage) {
        await storage.updatePackage(existingPackage.id, {
          carrier: trackingData.carrier,
          status: trackingData.status,
          origin: trackingData.origin,
          destination: trackingData.destination,
          trackingData: trackingData.events,
        });
      }
      
      res.json(trackingData);
    } catch (error) {
      console.error("Tracking error:", error);
      res.status(500).json({ error: "Failed to fetch tracking data" });
    }
  });

  // Get tracking events for a package
  app.get("/api/packages/:id/events", async (req, res) => {
    try {
      const events = await storage.getTrackingEvents(req.params.id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tracking events" });
    }
  });

  // Translation API using LibreTranslate
  const allowedLangs = ["en", "fr", "es", "de", "zh"];

  app.post("/api/translate", async (req, res) => {
    const { text, targetLang, targetLanguage } = req.body;
    const lang = targetLang || targetLanguage;
    if (!text || !lang) {
      return res.status(400).json({ error: "Missing text or targetLang" });
    }
    if (!allowedLangs.includes(lang)) {
      return res.status(400).json({ error: "Unsupported language" });
    }
    try {
      const response = await axios.post("https://libretranslate.de/translate", {
        q: text,
        source: "auto",
        target: lang,
        format: "text"
      });
      res.json({ translatedText: response.data.translatedText });
    } catch (error) {
      res.status(500).json({ error: "Translation failed" });
    }
  });

  // Batch translation endpoint to translate many strings at once
  app.post("/api/translate/batch", async (req, res) => {
    const { texts, targetLang, targetLanguage } = req.body as {
      texts?: string[];
      targetLang?: string;
      targetLanguage?: string;
    };
    const lang = targetLang || targetLanguage;

    if (!texts || !Array.isArray(texts) || texts.length === 0 || !lang) {
      return res
        .status(400)
        .json({ error: "Missing texts array or targetLang" });
    }
    if (!allowedLangs.includes(lang)) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    try {
      const endpoints = [
        "https://libretranslate.de/translate",
        "https://translate.argosopentech.com/translate",
        "https://libretranslate.com/translate",
      ];

      async function translateWithFallback(q: string): Promise<string> {
        for (const url of endpoints) {
          try {
            const response = await axios.post(
              url,
              { q, source: "auto", target: lang, format: "text" },
              { timeout: 15000 },
            );
            const translated = response.data?.translatedText as string | undefined;
            if (translated) return translated;
          } catch (_err) {
            // try next endpoint
          }
        }
        return q; // fallback to original on failure
      }

      const maxBatchSize = 20;
      const results: string[] = [];

      for (let i = 0; i < texts.length; i += maxBatchSize) {
        const batch = texts.slice(i, i + maxBatchSize);
        const batchTranslations = await Promise.all(batch.map((q) => translateWithFallback(q)));
        results.push(...batchTranslations);
      }

      res.json({ translations: results });
    } catch (error) {
      res.status(500).json({ error: "Batch translation failed" });
    }
  });

  // Ship24 Webhook endpoint
  app.post("/api/webhook/ship24", async (req, res) => {
    try {
      const webhookSecret = "whs_qZpQdD1aAnxoOWpeY5RwwbQ6EHGOsX";
      const signature = req.headers['x-ship24-signature'];
      
      // In a real implementation, you would verify the webhook signature here
      console.log("Ship24 webhook received:", req.body);
      
      const { trackingNumber, data } = req.body;
      
      if (trackingNumber && data) {
        // Update package data in storage based on webhook
        const packages = await storage.getPackages();
        const packageToUpdate = packages.find((pkg: any) => pkg.trackingNumber === trackingNumber);
        
        if (packageToUpdate) {
          packageToUpdate.trackingData = data;
          packageToUpdate.status = mapShip24Status(data?.shipment?.statusMilestone);
          
          // In a real implementation, you would update the storage here
          console.log("Package updated from webhook:", packageToUpdate);
        }
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // Store recent searches in memory for demo (replace with DB in production)
  const recentSearches: { [userId: string]: string[] } = {};

  app.get("/api/recent-searches", async (req, res) => {
    const userId = req.query.userId as string;
    res.json(recentSearches[userId] || []);
  });

  app.post("/api/recent-searches", async (req, res) => {
    const { userId, trackingNumber } = req.body;
    if (!recentSearches[userId]) recentSearches[userId] = [];
    if (!recentSearches[userId].includes(trackingNumber)) {
      recentSearches[userId].unshift(trackingNumber);
      if (recentSearches[userId].length > 10) recentSearches[userId].pop();
    }
    res.json({ success: true });
  });

  app.get("/api/activity", async (req, res) => {
    try {
      const { userId } = req.query;
      // Example: get last 10 events for user's packages
      const pkgs = await storage.getAllPackages(userId as string);
      let events: any[] = [];
      for (const pkg of pkgs) {
        const pkgEvents = await storage.getTrackingEvents(pkg.id);
        events = events.concat(pkgEvents.map((e: any) => ({ ...e, trackingNumber: pkg.trackingNumber })));
      }
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      res.json(events.slice(0, 10));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Validate tracking number format
function isValidTrackingNumber(trackingNumber: string): boolean {
  // Remove spaces and make uppercase
  const cleaned = trackingNumber.replace(/\s/g, '').toUpperCase();
  
  // Common tracking number patterns
  const patterns = [
    /^1Z[0-9A-Z]{16}$/,           // UPS
    /^[0-9]{12}$/,                // FedEx Express (12 digits)
    /^[0-9]{14}$/,                // FedEx Ground (14 digits) 
    /^[0-9]{20}$/,                // USPS (20 digits)
    /^[0-9]{22}$/,                // USPS (22 digits)
    /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/, // International (EE123456789US)
    /^[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}$/, // Generic 16 digits with optional spaces
    /^[A-Z0-9]{8,40}$/           // Generic alphanumeric 8-40 chars
  ];
  
  // Check if it matches any pattern
  return patterns.some(pattern => pattern.test(cleaned)) && cleaned.length >= 8;
}

async function fetchTrackingData(trackingNumber: string) {
  const apiKey = "apik_Qub4oxgadnIZxrTFPeQ8L0yIoSs07l9Cs";
  
  // Validate tracking number format first
  if (!isValidTrackingNumber(trackingNumber)) {
    throw new Error('Invalid tracking number format. Please check your tracking number and try again.');
  }
  
  try {
    // Ship24 API integration - create tracker
    const response = await axios.post('https://api.ship24.com/public/v1/trackers', {
      trackingNumber: trackingNumber
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const trackingData = response.data.data;
    if (!trackingData) {
      throw new Error('Tracking number not found. Please verify your tracking number is correct.');
    }

    // Get tracking results with enhanced data
    const resultsResponse = await axios.get(`https://api.ship24.com/public/v1/trackers/${trackingData.tracker.trackerId}/results`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const results = resultsResponse.data.data;
    const trackingInfo = results.trackings?.[0];
    const shipment = trackingInfo?.shipment;
    const events = trackingInfo?.events || [];

    // Calculate estimated delivery
    let estimatedDelivery = "Not available";
    if (shipment?.estimatedDeliveryDate) {
      estimatedDelivery = new Date(shipment.estimatedDeliveryDate).toLocaleDateString();
    } else if (events.length > 0) {
      // Estimate based on last event + typical delivery time
      const lastEvent = events[events.length - 1];
      const lastDate = new Date(lastEvent.eventDateTime);
      lastDate.setDate(lastDate.getDate() + 3); // Add 3 days as estimate
      estimatedDelivery = lastDate.toLocaleDateString();
    }

    // Get last update timestamp
    const lastUpdate = events.length > 0 
      ? new Date(events[events.length - 1].eventDateTime).toLocaleString()
      : new Date().toLocaleString();

    return {
      trackingNumber,
      carrier: shipment?.courier?.name || "Auto-detecting...",
      status: mapShip24Status(shipment?.statusMilestone),
      origin: shipment?.origin?.address?.addressLine1 || shipment?.origin?.address?.countryName || "Not available",
      destination: shipment?.destination?.address?.addressLine1 || shipment?.destination?.address?.countryName || "Not available",
      estimatedDelivery,
      lastUpdate,
      coordinates: {
        origin: {
          lat: shipment?.origin?.address?.latitude,
          lng: shipment?.origin?.address?.longitude
        },
        destination: {
          lat: shipment?.destination?.address?.latitude,
          lng: shipment?.destination?.address?.longitude
        },
        current: events.length > 0 ? {
          lat: events[events.length - 1].location?.latitude,
          lng: events[events.length - 1].location?.longitude
        } : null
      },
      events: events.map((event: any) => ({
        timestamp: event.eventDateTime,
        location: event.location?.address?.addressLine1 || event.location?.address?.countryName || "Unknown location",
        description: event.eventName || event.eventDescription || "Package processed",
        status: event.statusMilestone || "in_transit"
      }))
    };
  } catch (error: any) {
    console.warn("Ship24 API failed:", error);
    
    // Check if it's a validation error (don't provide fallback data)
    if (error.message?.includes('Invalid tracking number') || error.message?.includes('not found')) {
      throw error; // Re-throw validation errors
    }
    
    // For API connectivity issues, provide limited fallback with clear indication
    if (error.response?.status === 401 || error.response?.status === 404) {
      throw new Error('This tracking number does not exist in our system. Please check the number and try again.');
    }
    
    // For other API issues, provide fallback but indicate it's limited data
    const now = new Date();
    const estimatedDate = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
    
    return {
      trackingNumber,
      carrier: "Auto-detecting...",
      status: "pending",
      origin: "Processing Center",
      destination: "Delivery Address", 
      estimatedDelivery: estimatedDate.toLocaleDateString(),
      lastUpdate: now.toLocaleString(),
      coordinates: {
        origin: null,
        destination: null,
        current: null
      },
      events: [
        {
          timestamp: now.toISOString(),
          location: "Processing Center",
          description: "Package information received (Limited data due to API connectivity)",
          status: "info_received"
        }
      ]
    };
  }
}

function mapShip24Status(statusMilestone: string): string {
  if (!statusMilestone) return "pending";
  
  const status = statusMilestone.toLowerCase();
  if (status.includes('delivered')) return "delivered";
  if (status.includes('out_for_delivery') || status.includes('out for delivery')) return "out_for_delivery";
  if (status.includes('in_transit') || status.includes('transit')) return "in_transit";
  if (status.includes('exception') || status.includes('failed')) return "exception";
  return "in_transit";
}

async function trackPackageAsync(trackingNumber: string) {
  try {
    await fetchTrackingData(trackingNumber);
  } catch (error) {
    console.error("Background tracking failed:", error);
  }
}
