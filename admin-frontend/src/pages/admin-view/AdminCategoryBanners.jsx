import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUpload from '@/components/admin-view/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addCategoryNameBanner, fetchAllCategoryNameBanners, fetchOptionsByType, removeCategoryBanners, updateCategoryNameBannerIndex } from '@/store/common-slice';
import { capitalizeFirstLetterOfEachWord } from '@/config';
import { X, Menu, Plus, Trash2, Image as ImageIcon, Video } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import ReactPlayer from 'react-player';
import { Badge } from '@/components/ui/badge';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';

const allPositions = [
    'WideScreen_Video',
    'MobileScreen_CategorySlider',
];

const AdminCategoryBanners = () => {
    const { CategoryNameBanners } = useSelector(state => state.common);
    const dispatch = useDispatch();
    const { toast } = useToast();

    // Boolean State
    const [isConfirmDeleteWindow, setIsConfirmDeleteWindow] = useState(false);
    const [resetImageUpload, setResetImageUpload] = useState(false);
    const [toggleBulkUpload, setToggleBulkUpload] = useState(true);
    const [imageLoading, setImageLoading] = useState(false);
    const [allProductsCategory, setAllProductsCategory] = useState([]);

    // String State
    const [imageFile, setImageFile] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [imageUrlsCategory, setImageUrlsCategory] = useState('');
    const [imageHeader, setImageHeader] = useState('');
    const [currentImageCategoryName, setCurrentImageCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Array State
    const [multipleImages, setMultipleImages] = useState([]);
    const [deletingImageCategory, setDeletingImageCategory] = useState(null);

    const [openModel, setOpenModel] = useState(false);

    useEffect(() => {
        dispatch(fetchAllCategoryNameBanners());
        fetchCategoryOptions();
    }, [dispatch, resetImageUpload, multipleImages, imageUrlsCategory]);

    const fetchCategoryOptions = async () => {
        try {
            const data = await dispatch(fetchOptionsByType("category"));
            const categoryData = data.payload?.result;
            setAllProductsCategory(categoryData?.map((s) => ({ id: s._id, label: s.value })) || []);
        } catch (error) {
            console.error("Error Fetching Category Options: ", error);
        }
    };

    const handleImageUpload = async (url) => {
        try {
            if (!imageUrlsCategory) {
                toast({
                    title: 'Please select a category to upload or Update.',
                    variant: 'destructive',
                });
                return;
            }
            const response = await dispatch(
                addCategoryNameBanner({ url: { url, name: currentImageCategoryName }, CategoryType: imageUrlsCategory, Header: imageHeader || '', })
            );
            if (!response) {
                throw new Error('Failed to add image');
            }
            toast({
                title: 'Upload Successful',
            });
            setImageHeader('');
            setImageFile('');
            setCurrentImageCategoryName('');
            dispatch(fetchAllCategoryNameBanners());
            setOpenModel(false);

        } catch (error) {
            console.error('Error during file upload:', error);
            toast({
                title: 'Image Failed Upload',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteImage = async () => {
        try {
            if (!deletingImageCategory) {
                toast({
                    title: 'Please select an image to delete.',
                    variant: 'destructive',
                });
                return;
            }
            const response = await dispatch(removeCategoryBanners({ id: deletingImageCategory.itemId, imageIndex: deletingImageCategory.idx }));
            if (!response || !response?.payload?.Success) {
                throw new Error('Failed to delete image');
            }
            toast({
                title: 'Image Deleted ' + response?.payload?.message,
            });
            dispatch(fetchAllCategoryNameBanners());
        } catch (error) {
            console.error('Error deleting image:', error);
            toast({
                title: 'Image Failed Deleted',
                variant: 'destructive',
            });
        } finally {
            setDeletingImageCategory(null);
            setIsConfirmDeleteWindow(false);
        }
    };

    const handleSelectedCategory = (value) => {
        setSelectedCategory(value);
        setImageUrlsCategory(value);
    };

    const UpdateCategoryNameIndex = (data) => {
        dispatch(updateCategoryNameBannerIndex(data));
    }

    let filteredItems = [];
    if (CategoryNameBanners && CategoryNameBanners.length > 0) {
        filteredItems = CategoryNameBanners.filter(
            item => selectedCategory === '' || item.CategoryType === selectedCategory
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Category Banners</h1>
                    <p className="text-gray-600 mt-1">Manage banners and videos for specific categories</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-2 w-full">
                            <Label>Select Position</Label>
                            <Select value={selectedCategory} onValueChange={handleSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Position" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_positions">All Positions</SelectItem>
                                    {allPositions.map((category, index) => (
                                        <SelectItem key={index} value={category}>
                                            {capitalizeFirstLetterOfEachWord(category)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            disabled={!selectedCategory || selectedCategory === 'all_positions'}
                            onClick={() => {
                                if (!selectedCategory) {
                                    toast({
                                        title: 'Please select a Position to create a New Image/Video',
                                        variant: 'destructive',
                                    });
                                    return;
                                }
                                setOpenModel(true)
                            }}
                            className="w-full md:w-auto"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Content
                        </Button>
                    </div>
                    {!selectedCategory && (
                        <p className="text-sm text-amber-600 font-medium">
                            Please select a position to view or add content.
                        </p>
                    )}
                </CardContent>
            </Card>

            <Dialog open={openModel} onOpenChange={setOpenModel}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Content</DialogTitle>
                    </DialogHeader>
                    <PopUpFormForHomeCategoryBanners
                        setImageHeader={setImageHeader}
                        imageHeader={imageHeader}
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        imageLoading={imageLoading}
                        setImageLoading={setImageLoading}
                        imageUrls={imageUrls}
                        setImageUrls={setImageUrls}
                        allProductsCategory={allProductsCategory}
                        currentImageCategoryName={currentImageCategoryName}
                        setCurrentImageCategoryName={setCurrentImageCategoryName}
                        handleImageUpload={handleImageUpload}
                        selectedCategory={selectedCategory}
                        setOpenModel={setOpenModel}
                    />
                </DialogContent>
            </Dialog>

            <div className="space-y-8">
                {filteredItems && filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {capitalizeFirstLetterOfEachWord(item.CategoryType)}
                                </CardTitle>
                                {item.Header && (
                                    <p className="text-sm text-gray-500">Header: {item.Header}</p>
                                )}
                            </CardHeader>
                            <CardContent>
                                <GridImageView
                                    item={item}
                                    updateCategoryIndex={(data) => {
                                        UpdateCategoryNameIndex({ ...data, categoryType: item.CategoryType })
                                    }}
                                    setIsConfirmDeleteWindow={setIsConfirmDeleteWindow}
                                    setDeletingImageCategory={setDeletingImageCategory}
                                />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    selectedCategory && (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No content found for the selected position.</p>
                        </div>
                    )
                )}
            </div>

            <Dialog open={isConfirmDeleteWindow} onOpenChange={setIsConfirmDeleteWindow}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the image/video.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmDeleteWindow(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => {
                            if (deletingImageCategory) {
                                handleDeleteImage();
                            }
                        }}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const PopUpFormForHomeCategoryBanners = ({
    setImageHeader,
    imageHeader,
    imageFile,
    setImageFile,
    imageLoading,
    setImageLoading,
    imageUrls,
    setImageUrls,
    allProductsCategory,
    currentImageCategoryName,
    setCurrentImageCategoryName,
    handleImageUpload,
    selectedCategory,
}) => {
    return (
        <div className="space-y-6 py-4">
            <div className="bg-gray-50 border rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Position</span>
                <Badge variant="outline">{selectedCategory}</Badge>
            </div>

            <div className="space-y-2">
                <Label>Header (Optional)</Label>
                <Input
                    type="text"
                    value={imageHeader}
                    onChange={(e) => setImageHeader(e.target.value)}
                    placeholder="Enter Header Text"
                />
            </div>

            <div className="space-y-2">
                <Label>Product Category Link</Label>
                <Select value={currentImageCategoryName} onValueChange={setCurrentImageCategoryName}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">All Categories</SelectItem>
                        {allProductsCategory.map((category, index) => (
                            <SelectItem key={index} value={category.label}>
                                {capitalizeFirstLetterOfEachWord(category.label)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-lg p-4 space-y-4">
                <Label>Upload Media</Label>
                <ImageUpload
                    file={imageFile}
                    setFile={setImageFile}
                    imageLoading={imageLoading}
                    setImageLoading={setImageLoading}
                    uploadedImageUrl={imageUrls}
                    setUploadedImageUrl={setImageUrls}
                    newStyling="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed flex items-center justify-center"
                />
            </div>

            <Button
                disabled={imageLoading || !imageUrls || !currentImageCategoryName}
                onClick={() => handleImageUpload(imageUrls)}
                className="w-full"
            >
                {imageLoading ? 'Uploading...' : 'Upload Content'}
            </Button>
        </div>
    )
}

const GridImageView = memo(({ item, updateCategoryIndex, setIsConfirmDeleteWindow, setDeletingImageCategory }) => {
    const [loadingStates, setLoadingStates] = useState(item.Url.map(() => true));
    const videoRefs = useRef([]);
    const [items, setItems] = useState([]);

    const getFileType = useCallback((url) => {
        const fileExtension = url?.url.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileExtension);
        return { isImage, isVideo };
    }, []);

    const handleMediaLoad = (index) => {
        setLoadingStates((prevState) => {
            const updatedStates = [...prevState];
            updatedStates[index] = false;
            return updatedStates;
        });
    };

    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;

        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, removed);

        setItems(reorderedItems);
        if (updateCategoryIndex) {
            updateCategoryIndex({ sourceIndex: source.index, destinationIndex: destination.index });
        }
    };

    useEffect(() => {
        if (item) {
            setItems(item.Url);
        }
    }, [item])

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
                {(provided) => (
                    <div
                        className='flex flex-wrap gap-4'
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {items.length > 0 ? (
                            items.map((url, index) => {
                                const { isImage, isVideo } = getFileType(url);

                                return (
                                    <Draggable key={index} draggableId={String(index)} index={index}>
                                        {(provided) => (
                                            <div
                                                className="relative group w-60 h-60 border bg-gray-50 rounded-lg overflow-hidden shrink-0"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {loadingStates[index] && (
                                                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                                                        <p className="text-xs text-gray-500">Loading...</p>
                                                    </div>
                                                )}

                                                <div className="absolute top-2 left-2 z-10 bg-black/50 text-white px-2 py-1 rounded text-xs truncate max-w-[140px]">
                                                    {url?.name}
                                                </div>

                                                {isImage ? (
                                                    <LazyLoadImage
                                                        src={url.url}
                                                        effect="blur"
                                                        className="w-full h-full object-cover"
                                                        onLoad={() => handleMediaLoad(index)}
                                                    />
                                                ) : isVideo ? (
                                                    <ReactPlayer
                                                        url={url.url}
                                                        className="w-full h-full object-cover"
                                                        width="100%"
                                                        height="100%"
                                                        controls={false}
                                                        muted
                                                        onReady={() => handleMediaLoad(index)}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        Unsupported
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full"
                                                        onClick={() => {
                                                            setIsConfirmDeleteWindow(true);
                                                            setDeletingImageCategory({ itemId: item._id, idx: index });
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })
                        ) : (
                            <div className="w-full py-8 text-center text-gray-500">
                                No content uploaded yet
                            </div>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
});

export default AdminCategoryBanners;
