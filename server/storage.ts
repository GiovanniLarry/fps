import { type User, type InsertUser, type Package, type InsertPackage, type TrackingEvent, type InsertTrackingEvent } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPackage(id: string): Promise<Package | undefined>;
  getPackageByTrackingNumber(trackingNumber: string): Promise<Package | undefined>;
  getAllPackages(userId?: string): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, updates: Partial<Package>): Promise<Package | undefined>;
  deletePackage(id: string): Promise<boolean>;
  
  getTrackingEvents(packageId: string): Promise<TrackingEvent[]>;
  createTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private packages: Map<string, Package>;
  private trackingEvents: Map<string, TrackingEvent>;

  constructor() {
    this.users = new Map();
    this.packages = new Map();
    this.trackingEvents = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPackage(id: string): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async getPackageByTrackingNumber(trackingNumber: string): Promise<Package | undefined> {
    return Array.from(this.packages.values()).find(
      (pkg) => pkg.trackingNumber === trackingNumber,
    );
  }

  async getAllPackages(userId?: string): Promise<Package[]> {
    const packages = Array.from(this.packages.values());
    if (userId) {
      return packages.filter(pkg => pkg.userId === userId);
    }
    return packages;
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = randomUUID();
    const pkg: Package = {
      ...insertPackage,
      id,
      title: insertPackage.title || null,
      userId: insertPackage.userId || null,
      carrier: null,
      status: "pending",
      origin: null,
      destination: null,
      estimatedDelivery: null,
      lastUpdate: new Date(),
      trackingData: null,
      isActive: true,
      createdAt: new Date(),
    };
    this.packages.set(id, pkg);
    return pkg;
  }

  async updatePackage(id: string, updates: Partial<Package>): Promise<Package | undefined> {
    const existingPackage = this.packages.get(id);
    if (!existingPackage) return undefined;
    
    const updatedPackage = { ...existingPackage, ...updates, lastUpdate: new Date() };
    this.packages.set(id, updatedPackage);
    return updatedPackage;
  }

  async deletePackage(id: string): Promise<boolean> {
    return this.packages.delete(id);
  }

  async getTrackingEvents(packageId: string): Promise<TrackingEvent[]> {
    return Array.from(this.trackingEvents.values()).filter(
      (event) => event.packageId === packageId,
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createTrackingEvent(insertEvent: InsertTrackingEvent): Promise<TrackingEvent> {
    const id = randomUUID();
    const event: TrackingEvent = {
      ...insertEvent,
      id,
      description: insertEvent.description || null,
      location: insertEvent.location || null,
      createdAt: new Date(),
    };
    this.trackingEvents.set(id, event);
    return event;
  }
}

export const storage = new MemStorage();
