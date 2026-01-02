import { useState, Fragment } from 'react';
import UploadMultipleImagesArray from './UploadMultipleImages';
import UploadFeatureImagesArray from './UploadFeatureImagesArray';
import FileUploadComponent from './FileUploadComponent';
import { Button } from '../ui/button';

const ColorToggleViewComponent = ({
  selectedColorArray,
  color,
  sizeTag,
  handelSetImagesByColor,
  isLoading,
  setIsLoading
}) => {
  const [viewMore, setViewMore] = useState(false);  // State to toggle visibility

  const toggleViewMore = (e) => {
    e.preventDefault();
    setViewMore((prevState) => !prevState);  // Toggle the viewMore state
  };

  return (
    <div className="w-full">
      {selectedColorArray.find((s) => s.id === color.id)?.quantity > 0 && (
        <Fragment>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm text-gray-700">Add Images For Color</span>
          </div>

          {/* View More / View Less Button */}
          {viewMore && (
            <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <FileUploadComponent
                maxFiles={5}
                tag={color.id}
                sizeTag={sizeTag}
                onSetImageUrls={(e) => {
                  console.log('Image Urls: ', e);
                  // Handle image URLs here, specific to the color
                  handelSetImagesByColor(e, color);
                }}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          )}

          {/* Toggle button */}
          <div className="w-full flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMore}
              className="w-full sm:w-auto min-w-[120px]"
            >
              {viewMore ? 'Hide Images' : 'Add/Show Images'}
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
};


export default ColorToggleViewComponent