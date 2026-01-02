import React, { useState, useEffect } from "react";

const DeliveryStatus = ({ status, hiddenText }) => {
	const steps = [
		{ title: "Confirmed", label: "Confirmed", icon: "📦" },
		{ title: "RTS", label: "Ready To Ship", icon: "🚚" },
		{ title: "Shipped", label: "Shipped", icon: "✈️" },
		{ title: "OFD", label: "Out for Delivery", icon: "📬" },
		{ title: "Delivered", label: "Delivered", icon: "✅" },
	];

	let currentStepIndex = steps.findIndex((step) => step.label === status);

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
		<div className="rounded-lg mb-2 px-2 w-full">
			<div className="w-full overflow-hidden">
				<div className="flex items-center justify-between relative overflow-hidden">
					{/* Progress Bar */}
					<div className="absolute top-1/3 -translate-y-1/3 left-5 right-4 sm:left-4 sm:right-3 md:left-6 md:right-5 h-1 bg-muted rounded-md">
						<div
							className={`h-0.5 md:h-1 ${currentStepIndex === -1 ? "bg-muted" : "bg-green-600"
								} transition-all duration-1000 ease-in-out`}
							style={{
								width: `${currentWidth}%`, // Animate width from 0 to target value
							}}
						></div>
					</div>

					{/* Steps */}
					{steps.map((step, index) => (
						<div key={index} className="flex flex-col items-center z-10 overflow-hidden">
							<div
								className={`flex flex-col items-center justify-center text-primary-foreground font-bold shadow-md transition-all duration-500 ease-in-out text-sm sm:text-lg`}
							>
								<div
									className={`rounded-full flex items-center justify-center ${currentStepIndex === -1
										? "bg-muted"
										: index <= animatedStep
											? "bg-green-400"
											: "bg-muted"
										} w-10 h-10 transform transition-transform duration-500 ease-in-out`}
								>
									{step.icon}
								</div>
								{!hiddenText && (
									<p
										className={`mt-2 text-xs font-semibold ${currentStepIndex === -1
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
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default DeliveryStatus;
