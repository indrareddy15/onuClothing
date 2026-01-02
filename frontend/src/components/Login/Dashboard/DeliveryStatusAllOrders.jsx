import React, { useState, useEffect } from 'react';
import { PackageCheck, Truck, Plane, MapPin, CheckCircle } from 'lucide-react';

const DeliveryStatusAllOrders = ({ status, hiddenText }) => {
	const steps = [
		{ title: 'Confirmed', label: "Confirmed", icon: PackageCheck },
		{ title: 'RTS', label: "Ready To Ship", icon: Truck },
		{ title: 'Shipped', label: "Shipped", icon: Plane },
		{ title: 'OFD', label: "Out for Delivery", icon: MapPin },
		{ title: 'Delivered', label: "Delivered", icon: CheckCircle },
	];

	let currentStepIndex = steps.findIndex((step) => step.label === status);

	if (currentStepIndex < 0) {
		currentStepIndex = -1;
	}

	const [animatedStep, setAnimatedStep] = useState(0);
	const [currentWidth, setCurrentWidth] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => {
			setAnimatedStep(currentStepIndex);
			if (currentStepIndex !== -1) {
				setCurrentWidth((currentStepIndex / (steps.length - 1)) * 100);
			} else {
				setCurrentWidth(0);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [status, currentStepIndex]);

	return (
		<div className="w-full py-2">
			<div className="relative">
				{/* Progress Bar Background */}
				<div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 rounded-full" />

				{/* Active Progress Bar */}
				<div
					className="absolute top-1/2 left-0 h-1 bg-green-400 -translate-y-1/2 rounded-full transition-all duration-1000 ease-in-out"
					style={{ width: `${currentWidth}%` }}
				/>

				{/* Steps */}
				<div className="relative flex justify-between items-center">
					{steps.map((step, index) => {
						const isActive = index <= animatedStep;
						const isCompleted = index < animatedStep;
						const Icon = step.icon;

						return (
							<div key={index} className="flex flex-col items-center">
								<div
									className={`
										w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 bg-card
										${isActive
											? 'border-green-400 text-green-600 scale-110'
											: 'border-muted text-muted-foreground'
										}
										${isCompleted ? 'bg-green-400 text-white border-green-400' : ''}
									`}
								>
									<Icon className="w-4 h-4" />
								</div>

								{!hiddenText && (
									<span
										className={`
											mt-2 text-xs font-medium transition-colors duration-300
											${isActive ? 'text-foreground' : 'text-muted-foreground'}
										`}
									>
										{step.title}
									</span>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default DeliveryStatusAllOrders;
