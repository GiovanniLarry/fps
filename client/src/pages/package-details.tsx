import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Truck, MapPin, Clock, RefreshCw } from "lucide-react";
import Navigation from "@/components/navigation";
import { getPackage } from "@/lib/tracking-api";
import { getStatusColor, getStatusText } from "@/lib/tracking-api";

export default function PackageDetails() {
  const params = useParams<{ id: string }>();
  const packageId = params.id!;

  const { data: pkg, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/packages', packageId],
    queryFn: () => getPackage(packageId),
  });

  const handleViewOnMap = () => {
    if (pkg?.trackingData?.coordinates) {
      const coords = pkg.trackingData.coordinates;
      // Open Google Maps with origin, destination, and current location
      let mapUrl = "https://www.google.com/maps/dir/";
      
      if (coords.origin?.lat && coords.origin?.lng) {
        mapUrl += `${coords.origin.lat},${coords.origin.lng}/`;
      }
      
      if (coords.destination?.lat && coords.destination?.lng) {
        mapUrl += `${coords.destination.lat},${coords.destination.lng}`;
      } else if (coords.current?.lat && coords.current?.lng) {
        mapUrl += `${coords.current.lat},${coords.current.lng}`;
      }
      
      window.open(mapUrl, '_blank');
    } else {
      // Fallback: search for tracking number on Google Maps
      window.open(`https://www.google.com/maps/search/${pkg?.trackingNumber}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass-morphism rounded-2xl p-8 animate-pulse">
            <div className="h-8 bg-gray-600 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass-morphism rounded-2xl p-8 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Package Not Found</h2>
            <p className="text-gray-300 mb-6">The package you're looking for doesn't exist or has been removed.</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusColorClass = getStatusColor(pkg.status || 'pending');
  const statusText = getStatusText(pkg.status || 'pending');

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Not available';
    return new Date(date).toLocaleString();
  };

  const getProgressPercentage = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 10;
      case 'processing': return 25;
      case 'in_transit': return 60;
      case 'out_for_delivery': return 90;
      case 'delivered': return 100;
      default: return 10;
    }
  };

  const progress = getProgressPercentage(pkg.status || 'pending');

  const trackingSteps = [
    { status: 'pending', label: 'Order Placed', active: progress >= 10 },
    { status: 'processing', label: 'Processing', active: progress >= 25 },
    { status: 'in_transit', label: 'In Transit', active: progress >= 60 },
    { status: 'out_for_delivery', label: 'Out for Delivery', active: progress >= 90 },
    { status: 'delivered', label: 'Delivered', active: progress >= 100 },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="glass-button rounded-lg text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {pkg.title || `Package ${pkg.trackingNumber.slice(-8)}`}
              </h1>
              <p className="text-gray-300">{pkg.trackingNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className={`${statusColorClass} px-4 py-2 rounded-full text-white font-medium ${
              pkg.status === 'delivered' ? 'animate-pulse-glow' : ''
            }`}>
              {statusText}
            </Badge>
            <Button
              onClick={() => refetch()}
              variant="ghost"
              size="icon"
              className="glass-button rounded-lg text-white"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Package Information */}
          <Card className="glass-morphism border-glass-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="h-5 w-5" />
                Package Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-gray-300 text-sm font-medium">Tracking Number</h4>
                  <p className="text-white font-mono text-sm break-all">{pkg.trackingNumber}</p>
                </div>
                <div>
                  <h4 className="text-gray-300 text-sm font-medium">Carrier</h4>
                  <p className="text-white">{pkg.trackingData?.carrier || 'Auto-detecting...'}</p>
                </div>
                <div>
                  <h4 className="text-gray-300 text-sm font-medium">Origin</h4>
                  <p className="text-white">{pkg.trackingData?.origin || 'Not available'}</p>
                </div>
                <div>
                  <h4 className="text-gray-300 text-sm font-medium">Destination</h4>
                  <p className="text-white">{pkg.trackingData?.destination || 'Not available'}</p>
                </div>
                <div>
                  <h4 className="text-gray-300 text-sm font-medium">Estimated Delivery</h4>
                  <p className="text-white">{pkg.trackingData?.estimatedDelivery || 'Not available'}</p>
                </div>
                <div>
                  <h4 className="text-gray-300 text-sm font-medium">Last Update</h4>
                  <p className="text-white">{pkg.trackingData?.lastUpdate || formatDate(pkg.createdAt)}</p>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Shipping Progress</h4>
                <div className="space-y-4">
                  {trackingSteps.map((step, index) => (
                    <div key={step.status} className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.active 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                          : 'bg-gray-600'
                      }`}>
                        {step.active ? (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        ) : (
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${step.active ? 'text-white' : 'text-gray-400'}`}>
                          {step.label}
                        </div>
                      </div>
                      {step.active && index < trackingSteps.length - 1 && (
                        <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 flex-1"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card className="glass-morphism border-glass-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tracking Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pkg.trackingData?.events && Array.isArray(pkg.trackingData.events) && pkg.trackingData.events.length > 0 ? (
                <div className="space-y-4">
                  {pkg.trackingData.events.map((event: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{event.description || event.status}</div>
                        <div className="text-gray-300 text-sm">{event.location || 'Location not available'}</div>
                        <div className="text-gray-400 text-sm">{formatDate(event.timestamp || event.time)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">No tracking events available yet</p>
                  <p className="text-gray-400 text-sm">Check back later for updates</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button 
            className="glass-button px-6 py-3 rounded-lg text-white"
            onClick={() => handleViewOnMap()}
          >
            <MapPin className="mr-2 h-4 w-4" />
            View on Map
          </Button>
          <Button 
            className="glass-button px-6 py-3 rounded-lg text-white"
            onClick={() => refetch()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
        </div>
      </div>
    </div>
  );
}
