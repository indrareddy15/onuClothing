import React, { useEffect, useState } from "react";
import { fetchOptionsByType } from "@/store/common-slice";
import { useDispatch } from "react-redux";

const ColorPresetsCreator = () => {
	const dispatch = useDispatch();
	const [colorOptions, setColorOptions] = useState([]);
	
	console.log("Color Preset Selector: Mounted");
	const fetchColorOptions = async () => {
		try {
			const data = await dispatch(fetchOptionsByType("color"));
			const colorData = data.payload?.result;
			console.log("Color Preset Selector colorOptions: ",colorData)
			setColorOptions(colorData?.map((s) => ({ id: s._id, label: s.value,name:s.name })) || []);
		} catch (error) {
			console.error("Error Fetching Size Options: ", error);
		}
	};
	useEffect(()=>{
		fetchColorOptions();
	},[])

	return (
		<div className="p-4 mx-auto w-full bg-gray-100">
			{/* Add Color Button */}
			<div className="mt-6 flex justify-center items-center space-y-3 flex-col">
				<button
					disabled={isLoading}
					className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 focus:outline-none"
					onClick={(e) => {
					}}
				>
					Add Color For Size:
				</button>
			</div>
		
			
		</div>
	);
	  
};

export default ColorPresetsCreator
