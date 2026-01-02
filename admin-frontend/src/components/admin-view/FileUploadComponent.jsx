import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BASE_URL, Header } from "@/config";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { File, Upload, X } from "lucide-react";
import UploadOverlay from "./UploadOverlay";
import { Badge } from "../ui/badge";
import { useSettingsContext } from "@/Context/SettingsContext";
import ReactPlayer from "react-player";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const FileUploadComponent = ({
  maxFiles = 5,
  tag,
  sizeTag,
  onSetImageUrls,
  isLoading,
  setIsLoading,
  onReset,
  onRemovingImages,
}) => {
  const { checkAndCreateToast } = useSettingsContext();
  const [files, setFiles] = useState([]); // Array of selected files
  const [loadingStates, setLoadingStates] = useState([]); // Loading state per file
  const [isUploadReady, setIsUploadReady] = useState(false); // To control when upload starts
  const dropzoneRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles = [...files];
    const newLoadingStates = [...loadingStates];

    // Limit the number of files to the maxFiles count
    for (let i = 0; i < selectedFiles.length; i++) {
      if (newFiles.length < maxFiles) {
        newFiles.push(selectedFiles[i]);
        newLoadingStates.push(false); // Set loading state to false initially
      }
    }

    // Update state
    setFiles(newFiles);
    setLoadingStates(newLoadingStates);
    setIsUploadReady(true); // Set ready to upload when new files are selected
  };

  // Function to handle the upload of multiple files (both image and video)
  const handleUploadFiles = async () => {
    if (files.length === 0) return;

    setIsLoading(true);
    const formData = new FormData();

    // Append each file to the FormData object
    files.forEach((file) => {
      formData.append("my_files[]", file);
    });

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/admin/upload-image-all`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );

      const urls = res.data?.results || [];
      updateUploadedFileUrls(urls);
      checkAndCreateToast("success", "Files uploaded successfully");
    } catch (error) {
      if (error.response) {
        console.log("Error Status Code:", error.response.status);
        console.log("Error Data:", error.response.data);
        checkAndCreateToast(
          "error",
          "Error uploading files: " + error.response.data.message
        );
      } else {
        console.log("Error Message:", error.message);
        checkAndCreateToast("error", "Error uploading files: " + error.message);
      }
      updateUploadedFileUrls([]);
    } finally {
      setIsLoading(false);
      setLoadingStates(Array(files.length).fill(false)); // Reset loading states
    }
  };

  // Function to update uploaded file URLs
  const updateUploadedFileUrls = (urls) => {
    const newFiles = [...files];
    urls.forEach((url, index) => {
      newFiles[index] = { ...newFiles[index], url }; // Attach URL to file
    });
    setFiles(newFiles);
    // console.log("Upload Image Urls: ",newFiles);
    onSetImageUrls(newFiles); // Notify parent about the updated file URLs
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1); // Remove file from array
    setFiles(newFiles);

    const newLoadingStates = [...loadingStates];
    newLoadingStates.splice(index, 1); // Remove loading state for the file
    setLoadingStates(newLoadingStates);
    if (onRemovingImages) {
      onRemovingImages(index);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.add("bg-gray-200");
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove("bg-gray-200");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove("bg-gray-200");
    }

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileChange({ target: { files: droppedFiles } });
    }
  };

  useEffect(() => {
    if (onReset) {
      setFiles([]);
      setLoadingStates([]);
      setIsUploadReady(false); // Reset the upload state when reset is triggered
    }
  }, [onReset]);

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      <div className="flex justify-between w-full items-center">
        <Label className="text-sm font-medium text-gray-700">
          Selected Files: <span className="text-primary font-bold">{files.filter((file) => file !== "").length}</span> / {maxFiles}
        </Label>
        {isLoading && (
          <Badge variant="secondary" className="animate-pulse text-blue-600 bg-blue-50">
            Uploading...
          </Badge>
        )}
      </div>

      <div
        ref={dropzoneRef}
        className="group relative w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:border-primary hover:bg-primary/5 bg-muted/30"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(e) => {
          e.stopPropagation();
          document.getElementById(`file-upload-${tag}-${sizeTag}`).click();
        }}
      >
        <input
          style={{ display: "none" }}
          type="file"
          id={`file-upload-${tag}-${sizeTag}`}
          accept=".jpg, .jpeg, .png, .gif, .mp4, .mov, .avi, .mkv, .webp"
          multiple
          onChange={handleFileChange}
          onClick={(event) => event.stopPropagation()}
          disabled={files.length >= maxFiles}
        />
        <div className="flex flex-col items-center gap-3 text-center p-4 transition-transform duration-300 group-hover:scale-105">
          <div className="p-3 bg-background rounded-full shadow-sm ring-1 ring-border group-hover:ring-primary/50 transition-all">
            <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Drag & Drop or Click to Upload
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: Images & Videos (Max {maxFiles} files)
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="w-full flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group flex-shrink-0 w-40 h-40 rounded-xl overflow-hidden border border-border bg-background shadow-sm hover:shadow-md transition-all snap-center"
            >
              {file?.type?.startsWith("video/") ? (
                <ReactPlayer
                  url={file.url || URL.createObjectURL(file)}
                  type={file.type}
                  width="100%"
                  height="100%"
                  className="object-cover"
                  controls={false}
                  muted
                  playing={false}
                />
              ) : (
                <LazyLoadImage
                  effect="blur"
                  useIntersectionObserver
                  loading="lazy"
                  src={file.url || URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  placeholder={
                    <div className="w-full h-full bg-muted animate-pulse" />
                  }
                />
              )}

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-lg hover:scale-110 transition-transform"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Loading Overlay */}
              {loadingStates[index] && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-xs font-medium text-primary">Uploading...</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isUploadReady && files.length > 0 && (
        <Button
          onClick={handleUploadFiles}
          className="w-full btn-primary shadow-lg hover:shadow-xl transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              <span>Upload {files.length} File{files.length !== 1 ? 's' : ''}</span>
            </>
          )}
        </Button>
      )}

      <UploadOverlay isUploading={isLoading} />
    </div>
  );
};

export default FileUploadComponent;
