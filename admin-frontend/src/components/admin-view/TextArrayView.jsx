import React from 'react'

const TextArrayView = ({points}) => {
  	return (
		<div className="w-full h-auto bg-white p-4 md:p-6 lg:p-8">
			{/* Main Header */}
			<h2 className="text-xl font-semibold text-gray-500 mb-6">Delivary Points</h2>
			{/* Body Section: Dynamically generated bullet points */}
			<div className="space-y-6">
				{points.map((point, index) => (
					<div key={index} className="flex flex-col space-y-2">
						<p className="text-gray-700 text-base">{point}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default TextArrayView
