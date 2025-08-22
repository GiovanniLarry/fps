import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye } from "lucide-react";
import { Link } from "wouter";
import { getStatusColor, getStatusText } from "@/lib/tracking-api";
import type { Package } from "@shared/schema";

interface PackageCardProps {
  package: Package;
  onDelete?: (id: string) => void;
}

export default function PackageCard({ package: pkg, onDelete }: PackageCardProps) {
  const statusColorClass = getStatusColor(pkg.status || 'pending');
  const statusText = getStatusText(pkg.status || 'pending');

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
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

  return (
    <Card className="glass-morphism rounded-2xl hover:transform hover:scale-105 transition-all duration-300 animate-slide-up">
      <CardContent className="p-6">
        {/* Package image placeholder */}
        <div className="w-full h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-4 flex items-center justify-center">
          <div className="text-4xl text-white/60">📦</div>
        </div>
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-white font-semibold text-lg truncate">
              {pkg.title || `Package ${pkg.trackingNumber.slice(-8)}`}
            </h4>
            <p className="text-gray-300 text-sm truncate">{pkg.trackingNumber}</p>
          </div>
          <Badge className={`${statusColorClass} px-3 py-1 rounded-full text-white text-xs font-medium ${
            pkg.status === 'delivered' ? 'animate-pulse-glow' : ''
          }`}>
            {statusText}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Carrier:</span>
            <span className="text-white">{pkg.carrier || 'Auto-detecting...'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Expected:</span>
            <span className="text-white">{formatDate(pkg.estimatedDelivery)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Location:</span>
            <span className="text-white truncate">{pkg.destination || pkg.origin || 'Processing'}</span>
          </div>
        </div>
        
        {/* Progress bar for in-transit packages */}
        {pkg.status && ['pending', 'processing', 'in_transit', 'out_for_delivery'].includes(pkg.status) && (
          <div className="mt-4 mb-4">
            <div className="flex justify-between text-xs text-gray-300 mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Link href={`/package/${pkg.id}`} className="flex-1">
            <Button className="w-full glass-button py-3 rounded-xl text-white font-medium ripple-effect">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </Link>
          
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(pkg.id)}
              className="glass-button p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
