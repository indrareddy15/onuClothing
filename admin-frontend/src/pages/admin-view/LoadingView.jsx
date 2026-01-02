import React from 'react'

const LoadingView = () => {
	return (
		<div className="w-full min-h-screen justify-center flex items-center bg-opacity-40">
			<div className="w-12 h-12 border-4 border-t-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
		</div>
	)
}

export default LoadingView
