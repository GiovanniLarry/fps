import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function FloatingActionButton() {
  const handleWhatsAppContact = () => {
    const phoneNumber = "+12723638722"; // FedPack Shipping WhatsApp number
    const message = encodeURIComponent("Hi! I need help with package tracking on FedPack. Can you assist me?");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        onClick={handleWhatsAppContact}
        className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center text-white text-xl hover:transform hover:scale-110 transition-all duration-300 animate-glow ripple-effect"
        title="Contact WhatsApp Support"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
