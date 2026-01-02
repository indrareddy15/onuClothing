import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const UploadOverlay = ({ isUploading }) => {
	if (!isUploading) return null;

	return (
		<div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200">
			<Card className="w-[300px] shadow-lg border-primary/20">
				<CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
					<div className="relative">
						<div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
						<div className="relative bg-background p-3 rounded-full border-2 border-primary/20">
							<Loader2 className="h-8 w-8 text-primary animate-spin" />
						</div>
					</div>

					<div className="space-y-1 text-center">
						<h3 className="font-semibold text-lg">Uploading Files</h3>
						<p className="text-sm text-muted-foreground">Please wait while we process your images...</p>
					</div>

					<div className="w-full max-w-[200px] h-1.5 bg-muted rounded-full overflow-hidden">
						<div className="h-full bg-primary animate-loading-bar" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default UploadOverlay;
