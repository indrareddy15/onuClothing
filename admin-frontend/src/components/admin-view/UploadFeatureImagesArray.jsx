import React, { useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import axios from 'axios';
import { BASE_URL } from '@/config';
const UploadFeatureImagesArray = ({ maxFiles = 4 ,onSetImageUrls,customeStyling = 'space-y-4',cateogryType}) => {
    console.log("Category Type: ", cateogryType);
    const [files, setFiles] = useState(Array(maxFiles).fill(null)); // Holds files for all slots
    const [uploadedImageUrls, setUploadedImageUrls] = useState(Array(maxFiles).fill(""));
    const [loadingStates, setLoadingStates] = useState(Array(maxFiles).fill(false)); // Loading state per file
    const inputRefs = useRef([]);

    const handleImageFileChange = async (index, e) => {
        e.preventDefault();
        e.stopPropagation();
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
        onSetImageUrls(newUrls,cateogryType);
    };

    const setLoadingState = (index, state) => {
        const newLoadingStates = [...loadingStates];
        newLoadingStates[index] = state;
        setLoadingStates(newLoadingStates);
    };

    const handleRemoveImage = (index) => {
        updateFile(index, null);
        updateUploadedImageUrl(index, "");
        if (inputRefs.current[index]) {
            inputRefs.current[index].value = "";
        }
    };

    return (
        <div className={customeStyling}>
            {files.map((file, index) => (
                <div key={index} className="w-full border-2 border-dashed rounded-md p-4">
                    <Input
                        id={`image-upload-${index}`}
                        type="file"
                        className="hidden"
                        ref={(el) => (inputRefs.current[index] = el)}
                        onChange={(e) => handleImageFileChange(index, e)}
                    />
                    {!file ? (
                        <Label
                            htmlFor={`image-upload-${index}`}
                            className="flex flex-col justify-center items-center h-32 cursor-pointer"
                        >
                            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">
                                Drag & drop or Click an Image to Upload
                            </span>
                        </Label>
                    ) : loadingStates[index] ? (
                        <Skeleton className="bg-gray-100 h-10" />
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileIcon className="w-10 h-10 text-muted" />
                                <p className="ml-2 text-sm font-medium">{file?.name}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-foreground"
                                onClick={() => handleRemoveImage(index)}
                            >
                                <XIcon className="w-4 h-4" />
                                <span className="sr-only">Remove File</span>
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default UploadFeatureImagesArray