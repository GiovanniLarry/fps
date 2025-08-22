import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PackageDetails from "@/pages/package-details";
import TermsModal from "@/components/terms-modal";
import ContactPage from "@/pages/contact";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/package/:id" component={PackageDetails} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const termsAccepted = localStorage.getItem('fedpack-terms-accepted');
    if (!termsAccepted) {
      setShowTerms(true);
    }
  }, []);

  const handleTermsAccept = () => {
    setShowTerms(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-slate-900 relative">
          {/* Background with animated gradient */}
          <div className="fixed inset-0 gradient-bg opacity-20"></div>
          <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 opacity-80"></div>
          
          <div className="relative z-10">
            <Router />
          </div>
          
          <TermsModal open={showTerms} onAccept={handleTermsAccept} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
