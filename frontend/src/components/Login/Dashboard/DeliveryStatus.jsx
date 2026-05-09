import React, { useState, useEffect } from "react";
import { Package, Truck, Plane, MapPin, CheckCircle2, Clock, Box } from "lucide-react";

const STEPS = [
	{ title: "Confirmed", label: "Confirmed", icon: <Package className="w-5 h-5 sm:w-6 sm:h-6" /> },
	{ title: "RTS", label: "Ready To Ship", icon: <Box className="w-5 h-5 sm:w-6 sm:h-6" /> },
	{ title: "Shipped", label: "Shipped", icon: <Plane className="w-5 h-5 sm:w-6 sm:h-6" /> },
	{ title: "OFD", label: "Out for Delivery", icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6" /> },
	{ title: "Delivered", label: "Delivered", icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> },
];

/** Map API / webhook labels to the step `label` strings used in this UI */
function normalizeStatusForDeliverySteps(raw) {
	if (!raw) return "";
	const s = String(raw).trim();
	const lower = s.toLowerCase();
	const aliases = {
		"order confirmed": "Confirmed",
		processing: "Confirmed",
		new: "Confirmed",
		invoiced: "Confirmed",
		"ready to ship": "Ready To Ship",
		"pickup scheduled": "Ready To Ship",
		"pickup booked": "Ready To Ship",
		shipped: "Shipped",
		"in transit": "Shipped",
		"picked up": "Shipped",
		"out for delivery": "Out for Delivery",
		ofd: "Out for Delivery",
		delivered: "Delivered",
		fulfilled: "Delivered",
	};
	if (aliases[lower]) return aliases[lower];
	const idx = STEPS.findIndex((step) => step.label.toLowerCase() === lower);
	if (idx >= 0) return STEPS[idx].label;
	return s;
}

const DeliveryStatus = ({ status, hiddenText, scans }) => {
	const steps = STEPS;

	const normalized = normalizeStatusForDeliverySteps(status);
	let currentStepIndex = steps.findIndex((step) => step.label === normalized);

	// Handle invalid status (i.e., not found in the steps array)
	if (currentStepIndex < 0) {
		currentStepIndex = -1; // Set to -1 if status is invalid
	}

	// State to trigger the animation on status change
	const [animatedStep, setAnimatedStep] = useState(0); // Initially set to 0 for animation
	const [currentWidth, setCurrentWidth] = useState(0); // Track the width of the progress bar

	useEffect(() => {
		// Trigger animation when status changes with a delay
		const timer = setTimeout(() => {
			setAnimatedStep(currentStepIndex); // Update the animated step index
			if (currentStepIndex !== -1) {
				setCurrentWidth((currentStepIndex / (steps.length - 1)) * 100); // Set the target width for valid status
			} else {
				setCurrentWidth(0); // Reset progress if status is invalid
			}
		}, 500); // Delay of 500ms before starting the animation

		return () => clearTimeout(timer); // Cleanup timeout on unmount or change
	}, [status, currentStepIndex]);

	return (
		<div className="w-full">
			<div className="w-full overflow-x-auto overflow-y-hidden scrollbar-none pb-4">
				<div className="flex items-center justify-between relative min-w-[300px] px-2 sm:px-4">
					{/* Progress Bar */}
					<div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 sm:left-8 sm:right-8 h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden">
						<div
							className={`h-full ${currentStepIndex === -1 ? "bg-muted" : "bg-primary"
								} transition-all duration-1000 ease-in-out`}
							style={{
								width: `${currentWidth}%`,
							}}
						></div>
					</div>

					{/* Steps */}
					{steps.map((step, index) => (
						<div key={index} className="flex flex-col items-center z-10 gap-2 sm:gap-3">
							<div
								className={`rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-in-out bg-background
									${currentStepIndex === -1
										? "border-muted text-muted-foreground"
										: index <= animatedStep
											? "border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] bg-primary/10"
											: "border-muted text-muted-foreground"
									} w-10 h-10 sm:w-14 sm:h-14`}
							>
								{step.icon}
							</div>
							{!hiddenText && (
								<p
									className={`text-[10px] sm:text-xs md:text-sm font-semibold text-center ${currentStepIndex === -1
										? "text-muted-foreground"
										: index <= animatedStep
											? "text-foreground"
											: "text-muted-foreground"
										}`}
								>
									{step.title}
								</p>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Detailed Timeline */}
			{scans && scans.length > 0 && (
				<div className="mt-8 pt-6 border-t border-border">
					<h4 className="font-semibold text-sm sm:text-base text-foreground mb-4 flex items-center gap-2">
						<Clock className="w-4 h-4 text-primary" />
						Tracking History
					</h4>
					<div className="max-h-[350px] overflow-y-auto pr-2 sm:pr-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
						<div className="relative ml-2 sm:ml-4 space-y-6 pt-2 pb-4">
						{/* Vertical line connecting steps */}
						<div className="absolute top-2 bottom-2 left-[5px] w-[2px] bg-border"></div>

						{scans.map((scan, index) => {
							const isLatest = index === scans.length - 1;
							return (
								<div key={index} className="relative pl-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 group">
									{/* Dot */}
									<span className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ring-4 ring-background z-10 transition-colors ${isLatest ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]' : 'bg-muted-foreground/30 group-hover:bg-primary/50'
										}`}></span>

									<div className="flex flex-col">
										<span className={`text-sm sm:text-base font-semibold ${isLatest ? 'text-primary' : 'text-foreground'}`}>
											{scan.activity || scan.status}
										</span>
										{scan.location && (
											<span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
												<MapPin className="w-3 h-3" />
												{scan.location}
											</span>
										)}
									</div>
									<div className="text-xs sm:text-sm text-muted-foreground bg-muted/40 px-2 py-1 rounded-md w-fit sm:text-right mt-1 sm:mt-0 font-medium">
										{new Date(scan.date).toLocaleString(undefined, {
											weekday: 'short', month: 'short', day: 'numeric',
											hour: '2-digit', minute: '2-digit'
										})}
									</div>
								</div>
							);
						})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DeliveryStatus;
