import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { BASE_URL } from "@/config";

const UploadMultipleImagesArray = ({
	maxFiles = 4,
	onSetImageUrls,
	tag,
	sizeTag,
	customeStyling = 'space-y-4',
	isLoading,
	setIsLoading,
}) => {
	const [files, setFiles] = useState(Array(maxFiles).fill(null)); // Holds files for all slots
	const [uploadedImageUrls, setUploadedImageUrls] = useState(Array(maxFiles).fill(""));
	const [loadingStates, setLoadingStates] = useState(Array(maxFiles).fill(false)); // Loading state per file
	const inputRefs = useRef([]);
	const dropzoneRefs = useRef([]);

	const handleImageFileChange = async (index, e) => {
		e.preventDefault();
		try {

			const selectedFile = e.target.files?.[0];
			if (!selectedFile) return;

			updateFile(index, selectedFile);

			const url = await handleUploadImage(selectedFile, index);
			if (url) updateUploadedImageUrl(index, url);
		} catch (error) {
			console.error("Error during file upload:", error);
		}
	};

	const handleUploadImage = async (file, index) => {
		setLoadingState(index, true);
		try {
			const formData = new FormData();
			formData.append("my_file", file);

			const token = sessionStorage.getItem("token");
			const res = await axios.post(`${BASE_URL}/admin/upload-image`, formData, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${token}`,
					"Cache-Control": "no-cache, must-revalidate, proxy-revalidate",
				},
			});

			return res.data?.result || "";
		} catch (error) {
			console.error("Error while uploading image:", error);
		} finally {
			setLoadingState(index, false);
		}
	};

	const updateFile = (index, file) => {
		const newFiles = [...files];
		newFiles[index] = file;
		setFiles(newFiles);
	};

	const updateUploadedImageUrl = (index, url) => {
		const newUrls = [...uploadedImageUrls];
		newUrls[index] = url;
		setUploadedImageUrls(newUrls);
		onSetImageUrls(newUrls);
	};

	const setLoadingState = (index, state) => {
		const newLoadingStates = [...loadingStates];
		newLoadingStates[index] = state;
		setLoadingStates(newLoadingStates);
		setIsLoading(state);
	};

	const handleRemoveImage = (index) => {
		updateFile(index, null);
		updateUploadedImageUrl(index, "");
		if (inputRefs.current[index]) {
			inputRefs.current[index].value = "";
		}
	};

	// Drag and drop handlers
	const handleDragOver = (e, index) => {
		e.preventDefault();
		e.stopPropagation();
		if (dropzoneRefs.current[index]) {
			dropzoneRefs.current[index].classList.add('bg-gray-200');
		}
	};

	const handleDragLeave = (e, index) => {
		e.preventDefault();
		e.stopPropagation();
		if (dropzoneRefs.current[index]) {
			dropzoneRefs.current[index].classList.remove('bg-gray-200');
		}
	};

	const handleDrop = (e, index) => {
		e.preventDefault();
		e.stopPropagation();
		if (dropzoneRefs.current[index]) {
			dropzoneRefs.current[index].classList.remove('bg-gray-200');
		}

		const file = e.dataTransfer.files[0];
		if (file) {
			updateFile(index, file);
			handleUploadImage(file, index).then((url) => {
				if (url) updateUploadedImageUrl(index, url);
			});
		}
	};

	return (
		<div className={customeStyling}>
			<div className="flex items-center justify-between mb-4">
				<span className="text-sm font-medium text-gray-700">Images ({uploadedImageUrls.filter(i => i !== '').length}/{uploadedImageUrls.length})</span>
				{isLoading && <span className="text-sm text-blue-600 animate-pulse">Uploading...</span>}
			</div>

			<div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory custom-scrollbar">
				{files.map((file, index) => (
					<div
						key={index}
						className={`flex-shrink-0 w-40 h-40 relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors snap-center ${dropzoneRefs.current[index]?.classList.contains('bg-gray-200') ? 'bg-gray-100 border-gray-400' : 'border-gray-200 hover:bg-gray-50'
							}`}
						ref={(el) => (dropzoneRefs.current[index] = el)}
						onDragOver={(e) => handleDragOver(e, index)}
						onDragLeave={(e) => handleDragLeave(e, index)}
						onDrop={(e) => handleDrop(e, index)}
					>
						<input
							disabled={isLoading}
							id={`image-upload-${index}-${tag}-${sizeTag}`}
							type="file"
							className="hidden"
							ref={(el) => (inputRefs.current[index] = el)}
							onChange={(e) => handleImageFileChange(index, e)}
						/>

						{uploadedImageUrls[index] ? (
							<div className="relative w-full h-full group">
								<img
									src={uploadedImageUrls[index]}
									alt={`Product ${index + 1}`}
									className="w-full h-full object-cover rounded-lg"
								/>
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
									<Button
										variant="destructive"
										size="icon"
										className="absolute top-2 right-2 h-7 w-7 rounded-full"
										onClick={(e) => {
											e.stopPropagation();
											handleRemoveImage(index);
										}}
									>
										<XIcon className="w-3.5 h-3.5" />
									</Button>
								</div>
							</div>
						) : loadingStates[index] ? (
							<div className="flex flex-col items-center">
								<div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-2" />
								<span className="text-xs text-gray-500">Uploading...</span>
							</div>
						) : (
							<Label
								htmlFor={`image-upload-${index}-${tag}-${sizeTag}`}
								className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4 text-center"
							>
								<UploadCloudIcon className="w-8 h-8 text-gray-400 mb-2" />
								<span className="text-xs text-gray-500">Upload Image</span>
							</Label>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default UploadMultipleImagesArray;
