import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUpload from '@/components/admin-view/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addFeaturesImage, addMultipleImages, delFeatureImage, getFeatureImage, updateFeatureHeader, updateFeatureImageIndex } from '@/store/common-slice';
import { capitalizeFirstLetterOfEachWord } from '@/config';
import { X, Menu, Plus, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import FileUploadComponent from '@/components/admin-view/FileUploadComponent';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import ReactPlayer from 'react-player';
import { Badge } from '@/components/ui/badge';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const allPositions = [
	'Wide Screen Section- 1',
	'Wide Screen Section- 2',
	'Wide Screen Section- 4',
	'Wide Screen Section- 5',
	'Wide Screen Section- 6',
	'Wide Screen Section- 7',
	'Wide Screen Section- 8',
	'Wide Screen Section- 9',
	'Wide Screen Section- 10',
	'Wide Screen Section- 11',
	'Small Screen Section- 1',
	'Small Screen Section- 3',
	'Small Screen Section- 4',
	'Small Screen Section- 5'
];

const AdminHomeFeatures = () => {
	const dispatch = useDispatch();
	const { toast } = useToast();
	const { featuresList } = useSelector(state => state.common);
	const [filteredList, setFilteredList] = useState([]);
	const [isConfirmDeleteWindow, setIsConfirmDeleteWindow] = useState(false);
	const [resetImageUpload, setResetImageUpload] = useState(false);
	const [toggleBulkUpload, setToggleBulkUpload] = useState(true);
	const [imageLoading, setImageLoading] = useState(false);

	const [imageFile, setImageFile] = useState('');
	const [imageUrls, setImageUrls] = useState('');
	const [imageUrlsCategory, setImageUrlsCategory] = useState('');
	const [imageHeader, setImageHeader] = useState('');
	const [currentImageCategoryName, setCurrentImageCategoryName] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');

	const [multipleImages, setMultipleImages] = useState([]);
	const [deletingImageCategory, setDeletingImageCategory] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [updatingFeature, setUpdatingFeature] = useState(null);

	const updateHeader = async () => {
		try {
			if (!imageUrlsCategory) {
				toast({
					title: 'Please select a category to upload or Update.',
					variant: 'destructive',
				});
				return;
			}
			const response = await dispatch(
				updateFeatureHeader({ CategoryType: imageUrlsCategory, Header: imageHeader })
			);
			if (!response) {
				throw new Error('Failed to add image');
			}
			toast({
				title: 'Header Updated Successfully',
				variant: 'default',
			});
			setImageHeader('');
		} catch (error) {
			console.error('Error during file upload:', error);
			toast({
				title: 'Header Update Failed',
				variant: 'destructive',
			});
		} finally {
			dispatch(getFeatureImage());
			setIsModalOpen(false);
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
				addFeaturesImage({ url, CategoryType: imageUrlsCategory, Header: imageHeader || '' })
			);
			if (!response) {
				throw new Error('Failed to add image');
			}
			toast({
				title: 'Upload Successful',
				variant: 'default',
			});
			setImageHeader('');
			setImageFile('');
		} catch (error) {
			console.error('Error during file upload:', error);
			toast({
				title: 'Image Failed Upload',
				variant: 'destructive',
			});
		} finally {
			dispatch(getFeatureImage());
			setIsModalOpen(false);
		}
	};

	const HandleMultipleImagesUpload = async () => {
		try {
			if (multipleImages.length <= 0) {
				toast({
					title: 'Please select at least one image to upload.',
					variant: 'destructive',
				});
				return;
			}
			const response = await dispatch(addMultipleImages({ images: multipleImages, CategoryType: imageUrlsCategory, Header: imageHeader || '' }));
			if (!response) {
				throw new Error('Failed to add multiple images');
			}
			toast({
				title: 'Upload Successful',
				variant: 'default',
			});
			setImageHeader('');
			setImageFile('');
		} catch (error) {
			console.error('Error during file upload:', error);
			toast({
				title: 'Image Failed Upload',
				variant: 'destructive',
			});
		} finally {
			dispatch(getFeatureImage());
			setMultipleImages([]);
			setResetImageUpload(true);
			setTimeout(() => {
				setResetImageUpload(false);
			}, 100);
			setIsModalOpen(false);
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
			const response = await dispatch(delFeatureImage({ id: deletingImageCategory.itemId, imageIndex: deletingImageCategory.idx }));
			if (!response || !response.payload.Success) {
				throw new Error('Failed to delete image');
			}
			toast({
				title: 'Image Deleted Successfully',
				variant: 'default',
			});
		} catch (error) {
			console.error('Error deleting image:', error);
			toast({
				title: 'Image Failed Deleted',
				variant: 'destructive',
			});
		} finally {
			setDeletingImageCategory(null);
			dispatch(getFeatureImage());
			setIsConfirmDeleteWindow(false);
		}
	};

	const UpdateCategoryNameIndex = async (data) => {
		await dispatch(updateFeatureImageIndex(data));
		dispatch(getFeatureImage());
	};

	const handleSelectedCategory = (value) => {
		setSelectedCategory(value);
		setImageUrlsCategory(value);
	};

	useEffect(() => {
		if (featuresList && featuresList.length > 0) {
			setFilteredList(featuresList.filter(item => selectedCategory === '' || item.CategoryType === selectedCategory));
		}
	}, [featuresList, selectedCategory]);

	const HandleOpenIsModelOpen = () => {
		setUpdatingFeature(featuresList.find(item => selectedCategory === '' || item.CategoryType === selectedCategory));
		setImageHeader(featuresList.find(item => selectedCategory === '' || item.CategoryType === selectedCategory)?.Header);
		setIsModalOpen(true);
	};

	useEffect(() => {
		dispatch(getFeatureImage());
	}, [dispatch, resetImageUpload, multipleImages, imageUrlsCategory]);

	return (
		<div className="w-full space-y-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Home Features</h1>
					<p className="text-gray-600 mt-1">Manage homepage banners and feature sections</p>
				</div>
			</div>

			<Card>
				<CardContent className="p-6 space-y-6">
					<div className="flex flex-col md:flex-row gap-4 items-end">
						<div className="flex-1 space-y-2 w-full">
							<Label>Select Position</Label>
							<Select value={selectedCategory} onValueChange={handleSelectedCategory}>
								<SelectTrigger>
									<SelectValue placeholder="All Positions" />
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
							onClick={HandleOpenIsModelOpen}
							className="w-full md:w-auto"
						>
							<Plus className="w-4 h-4 mr-2" />
							Add Content
						</Button>
					</div>
					{!selectedCategory && (
						<p className="text-sm text-amber-600 font-medium">
							Please select a position to add new content.
						</p>
					)}
				</CardContent>
			</Card>

			<PopupModal
				isOpen={isModalOpen}
				setIsModelOpen={setIsModalOpen}
				toggleBulkUpload={toggleBulkUpload}
				setToggleBulkUpload={setToggleBulkUpload}
				imageFile={imageFile}
				setImageFile={setImageFile}
				imageLoading={imageLoading}
				setImageLoading={setImageLoading}
				multipleImages={multipleImages}
				setMultipleImages={setMultipleImages}
				imageUrls={imageUrls}
				setImageUrls={setImageUrls}
				imageHeader={imageHeader}
				setImageHeader={setImageHeader}
				handleImageUpload={handleImageUpload}
				updatingFeature={updatingFeature}
				HandleMultipleImagesUpload={HandleMultipleImagesUpload}
				imageUrlsCategory={imageUrlsCategory}
				updateHeader={updateHeader}
			/>

			<div className="space-y-8">
				{filteredList && filteredList.length > 0 ? (
					filteredList.map((item, index) => (
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
										UpdateCategoryNameIndex({ ...data, categoryType: item.CategoryType });
									}}
									setIsConfirmDeleteWindow={setIsConfirmDeleteWindow}
									setDeletingImageCategory={setDeletingImageCategory}
								/>
							</CardContent>
						</Card>
					))
				) : (
					<div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
						<ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
						<p>No content found for the selected position.</p>
					</div>
				)}
			</div>

			<Dialog open={isConfirmDeleteWindow} onOpenChange={setIsConfirmDeleteWindow}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete the image.
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

const PopupModal = ({
	isOpen,
	setIsModelOpen,
	toggleBulkUpload,
	setToggleBulkUpload,
	imageFile,
	setImageFile,
	imageLoading,
	setImageLoading,
	multipleImages,
	setMultipleImages,
	imageUrls,
	setImageUrls,
	imageHeader,
	setImageHeader,
	handleImageUpload,
	updatingFeature,
	HandleMultipleImagesUpload,
	imageUrlsCategory,
	updateHeader
}) => {
	const resetImageUpload = () => {
		setImageFile(null);
		setImageUrls([]);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsModelOpen}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Manage Content</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{updatingFeature?.CategoryType && (
						<div className="bg-gray-50 border rounded-lg p-3 flex justify-between items-center">
							<span className="text-sm font-medium text-gray-600">Position</span>
							<Badge variant="outline">{updatingFeature.CategoryType}</Badge>
						</div>
					)}

					<div className="space-y-2">
						<Label>Section Header</Label>
						<div className="flex gap-2">
							<Input
								value={imageHeader}
								onChange={(e) => setImageHeader(e.target.value)}
								placeholder="Enter header text"
							/>
							<Button onClick={updateHeader} variant="outline">
								Update
							</Button>
						</div>
					</div>

					<div className="border rounded-lg p-4 space-y-4">
						<div className="flex items-center justify-between">
							<Label>Upload Media</Label>
							<div className="flex items-center gap-2">
								<Label className="text-xs font-normal text-gray-500">Bulk Upload</Label>
								<Input
									type="checkbox"
									checked={toggleBulkUpload}
									onChange={() => setToggleBulkUpload(!toggleBulkUpload)}
									className="w-4 h-4"
								/>
							</div>
						</div>

						{toggleBulkUpload ? (
							<div className="space-y-4">
								<FileUploadComponent
									maxFiles={10}
									tag={`home-carousal-upload`}
									sizeTag={`carousal-upload-${imageUrlsCategory}`}
									onSetImageUrls={(urlArray) => setMultipleImages(urlArray)}
									isLoading={imageLoading}
									onReset={resetImageUpload}
									setIsLoading={setImageLoading}
								/>
								<Button
									disabled={imageLoading || multipleImages.length === 0}
									onClick={HandleMultipleImagesUpload}
									className="w-full"
								>
									{imageLoading ? 'Uploading...' : `Upload ${multipleImages.length} Files`}
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								<ImageUpload
									file={imageFile}
									setFile={setImageFile}
									imageLoading={imageLoading}
									setImageLoading={setImageLoading}
									uploadedImageUrl={imageUrls}
									setUploadedImageUrl={setImageUrls}
									newStyling="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed flex items-center justify-center"
								/>
								<Button
									disabled={imageLoading || !imageUrls}
									onClick={() => handleImageUpload(imageUrls)}
									className="w-full"
								>
									{imageLoading ? 'Uploading...' : 'Upload File'}
								</Button>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

const GridImageView = ({ item, updateCategoryIndex, setIsConfirmDeleteWindow, setDeletingImageCategory }) => {
	const [loadingStates, setLoadingStates] = useState(item.Url.map(() => true));
	const videoRefs = useRef([]);
	const [items, setItems] = useState([]);

	const getFileType = useCallback((url) => {
		const fileExtension = url.split('.').pop().toLowerCase();
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

		updateCategoryIndex({ sourceIndex: source.index, destinationIndex: destination.index });
		const reorderedItems = Array.from(items);
		const [removed] = reorderedItems.splice(source.index, 1);
		reorderedItems.splice(destination.index, 0, removed);
		setItems(reorderedItems);
	};

	useEffect(() => {
		if (item) {
			setItems(item.Url);
		}
	}, [item]);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable" direction="horizontal">
				{(provided) => (
					<div
						className="flex flex-wrap gap-4"
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{items.length > 0 ? (
							items.map((url, index) => {
								if (!url) return null;
								const { isImage, isVideo } = getFileType(url);
								return (
									<Draggable key={index} draggableId={String(index)} index={index}>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className="relative group w-40 h-40 border bg-gray-50 rounded-lg overflow-hidden shrink-0"
											>
												{loadingStates[index] && (
													<div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
														<ImageIcon className="w-8 h-8 text-gray-400" />
													</div>
												)}

												{isImage ? (
													<LazyLoadImage
														src={url}
														effect="blur"
														className="w-full h-full object-cover"
														onLoad={() => handleMediaLoad(index)}
													/>
												) : isVideo ? (
													<ReactPlayer
														url={url}
														className="w-full h-full object-cover"
														width="100%"
														height="100%"
														controls={false}
														muted
														onReady={() => handleMediaLoad(index)}
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
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
								No media items in this section
							</div>
						)}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default AdminHomeFeatures;
