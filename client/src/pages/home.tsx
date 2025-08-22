import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Globe, Clock, Shield, Users, Package } from "lucide-react";
import Navigation from "@/components/navigation";
import TrackingInput from "@/components/tracking-input";
import PackageCard from "@/components/package-card";
import ActivityFeed from "@/components/activity-feed";
import FloatingActionButton from "@/components/floating-action-button";
import { getPackages, deletePackage } from "@/lib/tracking-api";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/simple-translation";

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['/api/packages'],
    queryFn: () => getPackages(),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      toast({
        title: "Package Removed",
        description: "Package has been removed from tracking",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove package",
        variant: "destructive",
      });
    },
  });

  const handleDeletePackage = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              {t("Track Your")} <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{t("Packages")}</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 animate-slide-up">
              {t("Monitor your shipments in real-time with our advanced tracking system")}
            </p>
            
            <TrackingInput />
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="glass-morphism rounded-xl p-6 text-center animate-float">
                <div className="text-3xl font-bold text-white mb-2">847+</div>
                <div className="text-gray-300 text-sm">Carriers Supported</div>
              </div>
              <div className="glass-morphism rounded-xl p-6 text-center animate-float" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-300 text-sm">Uptime</div>
              </div>
              <div className="glass-morphism rounded-xl p-6 text-center animate-float" style={{ animationDelay: '0.4s' }}>
                <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                <div className="text-gray-300 text-sm">Packages Tracked</div>
              </div>
              <div className="glass-morphism rounded-xl p-6 text-center animate-float" style={{ animationDelay: '0.6s' }}>
                <div className="text-3xl font-bold text-white mb-2">100+</div>
                <div className="text-gray-300 text-sm">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Packages Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-white">{t("Active Packages")}</h3>
            <Button 
              className="glass-button px-6 py-3 rounded-lg text-white"
              onClick={() => {
                const trackingInput = document.querySelector('input[placeholder*="tracking"]') as HTMLInputElement;
                if (trackingInput) {
                  trackingInput.focus();
                  trackingInput.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("Add Package")}
            </Button>
          </div>
          
          {/* Package Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-morphism rounded-2xl p-6 animate-pulse">
                  <div className="w-full h-32 bg-gray-600 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16">
              <div className="glass-morphism rounded-2xl p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-4">{t("No Packages Yet")}</h4>
                <p className="text-gray-300 mb-6">{t("Start tracking your first package to see it here")}</p>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  onClick={() => {
                    const trackingInput = document.querySelector('input[placeholder*="tracking"]') as HTMLInputElement;
                    if (trackingInput) {
                      trackingInput.focus();
                      trackingInput.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("Track Package")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <div key={pkg.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <PackageCard package={pkg} onDelete={handleDeletePackage} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-6">{t("Powerful Features")}</h3>
            <p className="text-xl text-gray-300">{t("Everything you need to track packages efficiently")}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Coverage",
                description: "Track packages from 847+ carriers across 220+ countries worldwide",
                gradient: "from-blue-500 to-purple-600",
              },
              {
                icon: TrendingUp,
                title: "Real-time Updates",
                description: "Get instant notifications and live tracking updates as your package moves",
                gradient: "from-emerald-500 to-cyan-600",
              },
              {
                icon: Clock,
                title: "Mobile Optimized",
                description: "Beautiful responsive design that works perfectly on all devices",
                gradient: "from-pink-500 to-rose-600",
              },
              {
                icon: TrendingUp,
                title: "Analytics",
                description: "Detailed insights and analytics about your shipping patterns",
                gradient: "from-amber-500 to-orange-600",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your tracking data is encrypted and protected with enterprise-grade security",
                gradient: "from-indigo-500 to-purple-600",
              },
              {
                icon: Users,
                title: "Multi-Language",
                description: "Support for multiple languages with real-time translation capabilities",
                gradient: "from-teal-500 to-green-600",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="glass-morphism rounded-2xl p-8 text-center hover:transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-4">{feature.title}</h4>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-white">Recent Activity</h3>
            <Button className="glass-button px-6 py-3 rounded-lg text-white">
              View All
            </Button>
          </div>
          
          <ActivityFeed />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 border-t border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">FedPack</h1>
              </div>
              <p className="text-gray-300">The most advanced package tracking platform for modern logistics.</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/recent-searches" className="hover:text-white transition-colors">Recent Searches</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Package Tracking</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-glass-border pt-8 mt-8 text-center">
            <p className="text-gray-300">© 2025 FedPack. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <FloatingActionButton />
    </div>
  );
}
