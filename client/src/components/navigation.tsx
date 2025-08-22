import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import LanguageSelector from "@/components/language-selector";

export default function Navigation() {
  return (
    <nav className="relative z-50 glass-morphism border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse-glow">
                <Package className="text-white text-lg" />
              </div>
              <h1 className="text-2xl font-bold text-white">FedPack</h1>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}
