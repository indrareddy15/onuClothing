import { Circle } from "lucide-react";

const LoadingOverlay = ({ isLoading }) => {
    if (!isLoading) return null;
  
    return (
		<div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
			<div className="flex justify-center items-center">
				<Circle size={50} className="animate-spin text-gray-700 text-[40px]" />
			</div>
		</div>
    );
};
export default LoadingOverlay