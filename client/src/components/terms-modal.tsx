import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  open: boolean;
  onAccept: () => void;
}

export default function TermsModal({ open, onAccept }: TermsModalProps) {
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    if (agreed) {
      localStorage.setItem('fedpack-terms-accepted', 'true');
      onAccept();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="glass-morphism border-glass-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Welcome to FedPack
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Please read and accept our terms and privacy policy to continue using our service.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-64 w-full rounded-md">
          <div className="p-4 text-gray-300 text-sm space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Terms of Service</h4>
              <p>
                By using FedPack, you agree to our tracking service terms. We provide package 
                tracking information from multiple carriers worldwide for informational purposes only.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-2">Privacy Policy</h4>
              <p>
                We collect and process tracking numbers you provide to deliver our tracking service. 
                We do not store personal information and tracking data is processed securely through 
                our API partners.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-2">Data Usage</h4>
              <p>
                Tracking information is retrieved from shipping carriers and third-party APIs. 
                We are not responsible for the accuracy or completeness of tracking data provided 
                by external sources.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Service Availability</h4>
              <p>
                Our service is provided "as-is" and we make no guarantees about availability, 
                accuracy, or completeness of tracking information. Use at your own discretion.
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox 
            id="terms" 
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
          />
          <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleAccept}
            disabled={!agreed}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
          >
            Continue to FedPack
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}