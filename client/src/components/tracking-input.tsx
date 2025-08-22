import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, History, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPackage, bulkImportPackages } from "@/lib/tracking-api";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/simple-translation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useLocation } from "wouter";

interface TrackingInputProps {
	onTrackingResult?: (trackingNumber: string) => void;
}

export default function TrackingInput({ onTrackingResult }: TrackingInputProps) {
	const [trackingNumber, setTrackingNumber] = useState("");
	const [title, setTitle] = useState("");
	const [isBulkOpen, setIsBulkOpen] = useState(false);
	const [bulkText, setBulkText] = useState("");
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const [, navigate] = useLocation();

	const trackMutation = useMutation({
		mutationFn: async () => {
			if (!trackingNumber.trim()) {
				throw new Error("Please enter a tracking number");
			}
			
			return createPackage({
				trackingNumber: trackingNumber.trim(),
				title: title.trim() || `Package ${trackingNumber.slice(-8)}`,
			});
		},
		onSuccess: (data) => {
			toast({
				title: "Package Added",
				description: `Now tracking ${data.trackingNumber}`,
			});
			queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
			setTrackingNumber("");
			setTitle("");
			onTrackingResult?.(data.trackingNumber);
		},
		onError: (error) => {
			toast({
				title: "Tracking Failed",
				description: error instanceof Error ? error.message : "Failed to track package",
				variant: "destructive",
			});
		},
	});

	const bulkMutation = useMutation({
		mutationFn: async (trackingNumbers: string[]) => {
			return bulkImportPackages({ trackingNumbers });
		},
		onSuccess: (pkgs) => {
			toast({ title: "Bulk Import Complete", description: `${pkgs.length} packages added` });
			queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
			setBulkText("");
			setIsBulkOpen(false);
		},
		onError: () => {
			toast({ title: "Bulk Import Failed", description: "Could not import packages", variant: "destructive" });
		},
	});

	const handleBulkImport = () => {
		const numbers = bulkText
			.split(/\r?\n|,|;|\s+/)
			.map(n => n.trim())
			.filter(n => n.length >= 8);
		if (numbers.length === 0) {
			toast({ title: "No valid tracking numbers", description: "Paste one per line or separated by commas" });
			return;
		}
		bulkMutation.mutate(numbers);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		trackMutation.mutate();
	};

	return (
		<div className="max-w-2xl mx-auto animate-slide-up">
			<div className="glass-morphism rounded-2xl p-8 mb-8">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1">
							<Input
								type="text"
								placeholder={t("Enter tracking number...")}
								value={trackingNumber}
								onChange={(e) => setTrackingNumber(e.target.value)}
								className="w-full px-6 py-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
							/>
						</div>
					</div>
					
					<div className="flex-1">
						<Input
							type="text"
							placeholder={t("Package title (optional)...")}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-6 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
						/>
					</div>

					<Button
						type="submit"
						disabled={trackMutation.isPending}
						className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold ripple-effect animate-glow"
					>
						{trackMutation.isPending ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
								{t("Tracking...")}
							</>
						) : (
							<>
								<Search className="mr-2 h-4 w-4" />
								{t("Track Package")}
							</>
						)}
					</Button>
				</form>
				
				{/* Quick actions */}
				<div className="flex flex-wrap gap-3 mt-6 justify-center">
					<Button variant="ghost" className="glass-button px-4 py-2 rounded-lg text-white text-sm" onClick={() => setIsBulkOpen(true)}>
						<Upload className="mr-2 h-4 w-4" />
						Bulk Import
					</Button>
				</div>
			</div>

			<Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
				<DialogContent className="glass-morphism border-glass-border text-white">
					<DialogHeader>
						<DialogTitle>Bulk Import</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<p className="text-sm text-gray-300">Paste tracking numbers (one per line, comma or space separated).</p>
						<textarea
							className="w-full h-48 p-4 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="1Z999AA10123456784\n9400111899223857481519\nEE123456789US"
							value={bulkText}
							onChange={(e) => setBulkText(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button onClick={handleBulkImport} disabled={bulkMutation.isPending} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
							{bulkMutation.isPending ? 'Importing...' : 'Import'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
