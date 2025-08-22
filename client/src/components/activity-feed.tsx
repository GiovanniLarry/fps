import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Truck, Package as PackageIcon, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPackages } from "@/lib/tracking-api";

export default function ActivityFeed() {
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['/api/packages'],
    queryFn: () => getPackages(),
  });

  const getActivityIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <Check className="text-white" />;
      case 'in_transit':
        return <Truck className="text-white" />;
      case 'exception':
        return <AlertCircle className="text-white" />;
      default:
        return <PackageIcon className="text-white" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 animate-pulse-glow';
      case 'in_transit':
        return 'bg-gradient-to-r from-blue-500 to-cyan-600';
      case 'exception':
        return 'bg-gradient-to-r from-red-500 to-pink-600';
      default:
        return 'bg-gradient-to-r from-yellow-500 to-orange-600';
    }
  };

  const getActivityDescription = (pkg: any) => {
    const status = pkg.status?.toLowerCase();
    switch (status) {
      case 'delivered':
        return `${pkg.title || 'Package'} delivered to ${pkg.destination || 'destination'}`;
      case 'in_transit':
        return `${pkg.title || 'Package'} departed from ${pkg.origin || 'facility'}`;
      case 'processing':
        return `${pkg.title || 'Package'} label created, package processing`;
      default:
        return `${pkg.title || 'Package'} status updated`;
    }
  };

  const getTimeAgo = (date: Date | string | null) => {
    if (!date) return 'Recently';
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="glass-morphism rounded-2xl p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 rounded-xl animate-pulse">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const recentPackages = packages
    .filter(pkg => pkg.lastUpdate)
    .sort((a, b) => new Date(b.lastUpdate!).getTime() - new Date(a.lastUpdate!).getTime())
    .slice(0, 5);

  return (
    <div className="glass-morphism rounded-2xl p-6">
      <div className="space-y-4">
        {recentPackages.length === 0 ? (
          <div className="text-center py-8">
            <PackageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300">No recent activity</p>
            <p className="text-gray-400 text-sm">Start tracking packages to see updates here</p>
          </div>
        ) : (
          recentPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white hover:bg-opacity-5 transition-all cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(pkg.status || 'pending')}`}>
                {getActivityIcon(pkg.status || 'pending')}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">
                  Package {pkg.trackingNumber} {pkg.status?.toLowerCase() === 'delivered' ? 'delivered' : 'updated'}
                </h4>
                <p className="text-gray-300 text-sm">
                  {getActivityDescription(pkg)}
                </p>
              </div>
              <div className="text-gray-400 text-sm">
                {getTimeAgo(pkg.lastUpdate)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
