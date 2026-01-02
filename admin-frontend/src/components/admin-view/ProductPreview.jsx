import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import BulletPointView from './BulletPointView';
import { ChevronUp, Edit, Eye, ImageUpIcon, Minus, MinusCircleIcon, Plus, PlusCircleIcon, X, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { addProductsFromElement, BASE_URL, formattedSalePrice, Header } from '@/config';
import SizeSelector from './SizeSelector';
import ColorPresetSelector from '@/pages/admin-view/ColorPresetSelector';
import { useDispatch } from 'react-redux';
import { fetchOptionsByType } from '@/store/common-slice';
import { getProductsById } from '@/store/admin/product-slice';
import BulletPointsForm from './BulletPointsForm';
import FileUploadComponent from './FileUploadComponent';
import CustomSelect from './CustomSelect';
import RatingDataView from './RatingDataView';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '../ui/dialog';
import { useSettingsContext } from '@/Context/SettingsContext';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import AdminTagInput from './AdminTagInput';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
const ProductPreview = ({
	categories,
	genders,
	subcategories,
	productDataId,
	togglePopUp,
	OnDelete,
	UpdateEditedData,
	setCurrentPreviewProduct,
}) => {
	const { checkAndCreateToast } = useSettingsContext();
	const [isRatingModalOpen, setRatingIsModalOpen] = useState(false);

	const [isConfirmDeleteWindow, setIsConfirmDeleteWindow] = useState(false);
	const [productData, setProductData] = useState(null);
	const [isEditing, setIsEditing] = useState(false);  // New state for editing mode
	const dispatch = useDispatch();

	const fetchProductData = async () => {
		try {
			if (!productDataId) return;
			const response = await dispatch(getProductsById(productDataId));
			setProductData(response?.payload?.result || null);
		} catch (error) {
			console.error("Error Fetching Product Data: ", error);
			checkAndCreateToast("error", "Failed to fetch product data!");
		}
	};
	const addRatingForProduct = async (ratingData) => {
		try {
			if (!productDataId) return;
			if (!ratingData) return;
			const response = await axios.post(`${BASE_URL}/admin/product/add-rating`, { productId: productDataId, ratingData }, Header());
			console.log("Rating Added: ", response.data);
			checkAndCreateToast("success", "Rating added successfully!");
			setRatingIsModalOpen(false);
			fetchProductData();
		} catch (error) {
			console.error("Error Adding Rating: ", error);
			checkAndCreateToast("error", "Failed to add rating!");
		}
	}
	const removeRatingForProduct = async (ratingDataId) => {
		try {
			if (!productDataId) return;
			if (!ratingDataId) return;
			const response = await axios.patch(`${BASE_URL}/admin/product/remove-rating`, { productId: productDataId, ratingId: ratingDataId }, Header());
			console.log("Rating Added: ", response.data);
			checkAndCreateToast("success", "Rating Removed successfully!");
			setRatingIsModalOpen(false);
			fetchProductData();
		} catch (error) {
			console.error("Error Removing Rating: ", error);
			checkAndCreateToast("error", "Failed to removing rating!");
		}
	}

	useEffect(() => {
		if (productDataId) {
			fetchProductData();
		}
	}, [dispatch, productDataId]);
	console.log("Product Data: ", productData);

	// Handle input changes
	const handleInputChange = (e, field) => {
		setProductData({
			...productData,
			[field]: e.target.value,
		});
	};
	const specialCategory = { options: addProductsFromElement.find(e => e.name === "specialCategory").options };
	const gendersOptions = { options: genders.map(category => ({ id: category.value.toLowerCase(), label: category.value })) }
	const categoryOptions = { options: categories.map(category => ({ id: category.value.toLowerCase(), label: category.value })) }
	const subcategoriesOptions = { options: subcategories.map(sub => ({ id: sub.value.toLowerCase(), label: sub.value })) }

	return <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
		<DialogTitle>Product Details</DialogTitle>
		<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
			<div className="relative flex flex-col gap-2 w-full sm:w-auto">
				<span>ProductId: {productData?.productId}</span>

				<h2 className="text-2xl font-bold">
					{isEditing ? (
						<Input
							type="text"
							placeholder="Enter Product Title"
							value={productData?.title}
							onChange={(e) => handleInputChange(e, 'title')}
							className="text-2xl font-bold w-full sm:w-auto"
						/>
					) : (
						`Title: ${productData?.title}`
					)}
				</h2>

				<h3 className="text-xl font-normal">
					{isEditing ? (
						<Input
							type="text"
							placeholder="Enter Short Title"
							value={productData?.shortTitle}
							onChange={(e) => handleInputChange(e, 'shortTitle')}
							className="text-xl font-normal w-full sm:w-auto"
						/>
					) : (
						`Short Title: ${productData?.shortTitle}`
					)}
				</h3>
			</div>
		</div>

		<div className="flex flex-col w-full space-x-4">
			<h3 className="font-semibold">All Sizes</h3>
			{productData && productData?.size && productData?._id && (
				<SizeDisplay
					productId={productData?._id}
					SizesArray={productData?.size}
					OnRefresh={() => {
						fetchProductData();
					}}
				/>
			)}

			{/* Product Details Section */}
			<div className="col-span-10 px-2 rounded-lg">
				<div className="mb-6 space-y-4">
					<div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4">
						<h3 className="font-extrabold text-gray-700 text-lg mr-3">Descriptions:</h3>
						{isEditing ? (
							<Textarea
								type="text"
								rows={4}
								value={productData?.description}
								placeholder='Enter product description'
								onChange={(e) => handleInputChange(e, 'description')}
								className="text-lg w-full sm:w-2/3 font-medium text-gray-600 border-2"
							/>
						) : (
							<p className="text-lg text-center md:text-right font-medium text-gray-600">
								{productData?.description}
							</p>
						)}
					</div>
					<div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4">
						<h3 className="font-extrabold text-gray-700 text-lg mr-3">Brand:</h3>
						{isEditing ? (
							<Input
								type="text"
								value={productData?.brand}
								placeholder='Enter product brand'
								onChange={(e) => handleInputChange(e, 'brand')}
								className="text-lg w-full sm:w-2/3 font-medium text-gray-600 border-2"
							/>
						) : (
							<p className="text-lg text-center md:text-right font-medium text-gray-600">
								{productData?.brand}
							</p>
						)}
					</div>

					{/* Specification */}
					<div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4">
						<h3 className="font-extrabold text-gray-700 text-lg mr-3">Specification:</h3>
						{isEditing ? (
							<Textarea
								type="text"
								rows={4}
								value={productData?.specification}
								placeholder='Enter product specification'
								onChange={(e) => handleInputChange(e, 'specification')}
								className="text-lg w-full sm:w-2/3 font-medium text-gray-600 border-2"
							/>
						) : (
							<p className="text-lg font-medium text-gray-600">
								{productData?.specification}
							</p>
						)}
					</div>


					{/* Care Instructions */}
					<div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4">
						<h3 className="font-extrabold text-gray-700 text-lg mr-3">Care Instructions:</h3>
						{isEditing ? (
							<Textarea
								type="text"
								rows={4}
								value={productData?.careInstructions}
								placeholder='Enter product CareInstructions'
								onChange={(e) => handleInputChange(e, 'careInstructions')}
								className="text-lg w-full sm:w-2/3 font-medium text-gray-600 border-2"
							/>
						) : (
							<p className="text-lg font-medium text-gray-600">
								{productData?.careInstructions}
							</p>
						)}
					</div>

					{/* GST, SKU, HSN, Price, Sale Price */}
					{['gst', 'hsn'].map((field) => (
						<div key={field} className="flex flex-col sm:flex-row justify-between items-center border-b pb-4">
							<h3 className="font-extrabold text-gray-700 text-lg mr-3 uppercase">{field}:</h3>
							{isEditing ? (
								<Input
									type="text"
									value={productData?.[field]}
									onChange={(e) => handleInputChange(e, field)}
									className="text-lg w-full sm:w-2/3 text-yellow-600 border-2"
								/>
							) : (
								<p className="text-lg font-medium text-yellow-600">{productData?.[field]}</p>
							)}
						</div>
					))}

					{/* Price and Sale Price */}
					{['price', 'salePrice'].map((field) => (
						<div key={field} className="flex flex-col sm:flex-row justify-between items-center border-b pb-4">
							<h3 className="font-extrabold text-gray-700 text-lg mr-3 uppercase">{field}:</h3>
							{isEditing ? (
								<Input
									type="number"
									value={productData?.[field]}
									onChange={(e) => handleInputChange(e, field)}
									placeholder={`Enter ${field}`}
									className="text-lg w-full sm:w-2/3 font-medium text-green-600 border-2"
								/>
							) : (
								<p className="text-lg font-medium text-green-600">₹ {formattedSalePrice(productData?.[field])}</p>
							)}
						</div>
					))}

					{/* Additional Info Section */}
					<div className="mb-6 space-y-4">
						<div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4">
							<h3 className="font-extrabold text-gray-700 text-lg mr-3">Material:</h3>
							{isEditing ? (
								<Textarea
									type="text"
									rows={4}
									value={productData?.material}
									onChange={(e) => handleInputChange(e, 'material')}
									className="text-lg w-full sm:w-2/3 text-gray-600"
								/>
							) : (
								<p className="text-lg text-gray-600">{productData?.material}</p>
							)}
						</div>
					</div>
					<div className="flex justify-between items-center border-b pb-4">
						<h3 className="font-extrabold text-gray-700 text-lg mr-3 uppercase">Subcategory:</h3>
						{isEditing ? (
							<div className='w-2/3'>
								<CustomSelect defaultValue={productData?.subCategory} controlItems={subcategoriesOptions} setChangeData={(e) => {
									console.log("Changed category", e);
									handleInputChange({ target: { value: e } }, "subCategory")
								}} />
							</div>
						) : (
							<p className="text-lg text-gray-600">{productData?.subCategory}</p>
						)}
					</div>
					<div className="flex justify-between items-center border-b pb-4">
						<h3 className="font-extrabold text-gray-700 text-lg mr-3 uppercase">Gender:</h3>
						{isEditing ? (
							<div className='w-2/3'>
								<CustomSelect defaultValue={productData?.gender} controlItems={gendersOptions} setChangeData={(e) => {
									console.log("Changed category", e);
									handleInputChange({ target: { value: e } }, "gender")
								}} />
							</div>
						) : (
							<p className="text-lg text-gray-600">{productData?.gender}</p>
						)}
					</div>
					<div className="flex justify-between items-center border-b pb-4">
						<h3 className="font-extrabold text-gray-700 text-lg mr-3 uppercase">Category:</h3>

						{isEditing ? (
							<div className='w-2/3'>
								<CustomSelect defaultValue={productData?.category} controlItems={categoryOptions} setChangeData={(e) => {
									handleInputChange({ target: { value: e } }, "category")
								}} />
							</div>
						) : (
							<p className="text-lg text-gray-600">{productData?.category}</p>
						)}
					</div>
					<div className="flex justify-between items-center border-b pb-4">
						<h3 className="font-extrabold text-gray-700 text-lg mr-3 uppercase">Special Category:</h3>
						{isEditing ? (
							<div className='w-2/3'>
								<CustomSelect defaultValue={productData?.specialCategory} controlItems={specialCategory} setChangeData={(selectedItems) => {
									handleInputChange({ target: { value: selectedItems } }, "specialCategory")
								}} />
							</div>
						) : (
							<p className="text-lg text-gray-600">{productData?.specialCategory}</p>
						)}
					</div>
					<div className="flex w-full justify-between items-center border-b pb-4">
						<div className='space-x-3 justify-between flex flex-row'>
							<h3 className="font-extrabold text-gray-700 text-lg mr-3 uppercase">Average Rating: </h3>
							<Edit onClick={() => {
								setRatingIsModalOpen(true);
							}} className='cursor-pointer' />
						</div>
						<p className="text-lg text-gray-600">
							{productData?.averageRating}
						</p>
					</div>
					<div className='justify-center items-start space-y-2 flex flex-col'>
						<Label className={"text-base text-gray-700"}>Dynamic-Data (Non-Editing)</Label>
						<div className="flex w-full flex-col sm:flex-row justify-between items-center border-b pb-4">
							<h3 className="font-extrabold text-gray-700 text-lg mr-3">Discounted Percentage:</h3>
							<p className="text-lg font-medium text-gray-600">
								{productData?.DiscountedPercentage}
							</p>
						</div>
						<div className="flex w-full flex-col sm:flex-row justify-between items-center border-b pb-4">
							<h3 className="font-extrabold text-gray-600 text-lg mr-3 uppercase">Total Stock:</h3>
							<p className="text-lg font-medium text-gray-600">
								{productData?.totalStock}
							</p>
						</div>
						<div className="flex w-full flex-col sm:flex-row justify-between items-center border-b pb-4">
							<h3 className="font-extrabold text-gray-600 text-lg mr-3 uppercase">Total Product Sold Amount:</h3>
							<p className="text-lg font-medium text-gray-600">
								{productData?.TotalSoldAmount}
							</p>
						</div>
						<div className="flex w-full flex-col justify-center items-center border-b pb-4">
							<h3 className="font-extrabold text-gray-600 text-lg mr-3 uppercase">Tags:</h3>
							{
								productData && productData.tags && <AdminTagInput defaultTags={productData?.tags} OnSubmit={(tag) => {
									handleInputChange({ target: { value: tag } }, 'tags')
								}} isEditing={isEditing} />
							}

						</div>
					</div>
					<div className='justify-center items-start space-y-2 flex flex-col'>
						<Label className={"text-base text-gray-700"}>Dimensions (Logistics)</Label>
						{['width', 'height', 'length', 'weight', 'breadth'].map((field) => (
							<div key={field} className="flex w-full flex-col sm:flex-row justify-between items-center border-b pb-4">
								<h3 className="font-extrabold text-gray-700 text-lg mr-3 uppercase">{field}:</h3>
								{isEditing ? (
									<Input
										type="number"
										value={productData?.[field]}
										onChange={(e) => handleInputChange(e, field)}
										placeholder={`Enter ${field}`}
										className="text-lg w-full sm:w-2/3 font-medium border-2"
									/>
								) : (
									<p className="text-lg font-medium text-gray-600">{formattedSalePrice(productData?.[field])} {field !== 'weight' ? "cm" : 'kg'}</p>
								)}
							</div>
						))}
					</div>

				</div>
				{/* Bullet Points */}
				<div className="mb-6 space-y-4">
					{isEditing ? (
						<BulletPointsForm
							defaultPoinst={productData?.bulletPoints}
							onChange={(e) => {
								setProductData({
									...productData,
									bulletPoints: e,
								});
							}}
						/>
					) : (
						productData?.bulletPoints && productData?.bulletPoints.length > 0 && (
							<BulletPointView points={productData?.bulletPoints} />
						)
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row justify-between w-full p-4 px-6 mt-8">
					<Button
						className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
						onClick={() => {
							if (isEditing) {
								UpdateEditedData(productData._id, productData);
							}
							setIsEditing(!isEditing); // Toggle editing state
							setCurrentPreviewProduct && setCurrentPreviewProduct(null);
						}}
					>
						{isEditing ? 'Save Product' : 'Edit Product'}
					</Button>
					{isEditing && (
						<Button
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
							onClick={() => {
								setIsEditing(!isEditing); // Toggle editing state
							}}
						>
							Cancel Edit
						</Button>
					)}

					<Button
						className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
						onClick={() => {
							setIsConfirmDeleteWindow(!isConfirmDeleteWindow);
						}}
					>
						Remove Product
					</Button>
				</div>
			</div>
		</div>
		<Dialog open={isConfirmDeleteWindow} onOpenChange={setIsConfirmDeleteWindow}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete the product.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => setIsConfirmDeleteWindow(false)}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={() => {
						OnDelete(productData._id);
						togglePopUp();
						if (setCurrentPreviewProduct) {
							setCurrentPreviewProduct(null);
						}
						setIsConfirmDeleteWindow(false);
					}}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
		<Dialog open={isRatingModalOpen} onOpenChange={() => setRatingIsModalOpen(false)}>
			<RatingDataView
				isOpen={isRatingModalOpen}
				onClose={() => {
					setRatingIsModalOpen(false)
				}}
				ratings={productData?.Rating || []}
				onDeleteRating={(ratingDataId) => {
					removeRatingForProduct(ratingDataId)
				}}
				addNewRating={(data) => {
					// console.log("New Rating: ", data);
					// OnRating(productId, data);
					addRatingForProduct(data);
				}}

			/>
		</Dialog>
	</DialogContent>;
};

const SizeDisplay = ({ productId, SizesArray, OnRefresh }) => {
	const { checkAndCreateToast } = useSettingsContext();
	const [isFileUploadPopUpOpen, setIsFileUploadPopUpOpen] = useState(false);
	const [activeSelectedSize, setActiveSelectedSize] = useState(null);
	const [activeSelectedColor, setActiveSelectedColor] = useState(null);
	const [activeImageColorSize, setActiveImageColorSize] = useState(null);

	const [isConfirmDeleteWindow, setIsConfirmDeleteWindow] = useState(false);
	const [sizeDeletingData, setSizeDeletingData] = useState(null);
	const [colorDeletingData, setColorDeletingData] = useState(null)
	const [toggleEditColor, setToggleEditColorsColor] = useState(null);
	const [toggleAddNewSize, setToggleAddNewSize] = useState(false);
	// State variables
	const [isLoading, setIsLoading] = useState(false);
	const [newSize, setNewSize] = useState(null);
	const [updatingColors, setUpdatingColors] = useState([]);
	const [selectedColorImages, setSelectedColorImages] = useState([]);
	const [colorOptions, setColorOptions] = useState([]);
	const [updatingSKU, setUpdatingSKU] = useState({ sizeId: '', colorId: '', sku: '' });
	// State for size quantities
	const [sizeQuantities, setSizeQuantities] = useState(
		SizesArray.reduce((acc, size) => {
			acc[size._id] = size.quantity;
			size.colors.forEach(color => {
				acc[`${size._id}-${color._id}`] = color.quantity || 0;
			});
			return acc;
		}, {})
	);

	// Toast for displaying messages
	const dispatch = useDispatch();

	// Fetch color options on component mount
	useEffect(() => {
		fetchColorOptions();
	}, [dispatch]);

	// API call to fetch color options
	const fetchColorOptions = async () => {
		setIsLoading(true);
		try {
			const data = await dispatch(fetchOptionsByType("color"));
			const colorData = data.payload?.result;
			setColorOptions(colorData?.map((s) => ({ _id: s._id, label: s.value, name: s.name })) || []);
		} catch (error) {
			console.error("Error Fetching Size Options: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle size quantity change
	const handleSizeQuantityChange = async (sizeId, change) => {
		setSizeQuantities(prevQuantities => {
			const newQuantity = prevQuantities[sizeId] + change;
			putHandleUpdateSizeQuantity(sizeId, newQuantity, 'size');
			return {
				...prevQuantities,
				[sizeId]: Math.max(0, newQuantity) // Ensure quantity is not negative
			};
		});
	};

	// Handle color quantity change within a size
	const handleColorQuantityChange = (sizeId, colorId, change) => {
		const id = `${sizeId}-${colorId}`;
		setSizeQuantities(prevQuantities => {
			const newQuantity = prevQuantities[id] + change;
			putHandleUpdateSizeColorQuantity(sizeId, colorId, newQuantity, 'reduce');
			return {
				...prevQuantities,
				[id]: Math.max(0, newQuantity) // Ensure quantity is not negative
			};
		});
	};
	const HandleUpdateColorSKU = async (e) => {
		e.preventDefault();
		if (!updatingSKU) {
			console.log("Updating SKU: ", updatingSKU);
			checkAndCreateToast("error", "No Sku Changed!")
			return
		}
		setIsLoading(true);
		if (!productId) return;
		try {
			const response = await axios.patch(`${BASE_URL}/admin/product/update/updateColorSku`, {
				productId,
				sizeId: updatingSKU.sizeId,
				colorId: updatingSKU.colorId,
				sku: updatingSKU.sku,
			}, Header());
			console.log(` Quantity Updated:`, response.data);
			checkAndCreateToast("success", "SKU Updated Successfully");
			setUpdatingSKU(null);
		} catch (error) {
			console.log(`Error Updating SKU:`, error);
			checkAndCreateToast("error", error.message);
		} finally {
			OnRefresh();
			setIsLoading(false);
		}
	}

	// API call to update size quantity
	const putHandleUpdateSizeQuantity = async (id, change, type) => {
		setIsLoading(true);
		if (!productId) return;
		try {
			// console.log(`${type} Quantity Updated:`, response.data);
			const response = await axios.patch(`${BASE_URL}/admin/product/update/updateSizeStock`, {
				productId,
				sizeId: id,
				updatedAmount: change,
			}, Header());
			console.log(`${type} Quantity Updated:`, response.data);
			checkAndCreateToast("success", "Quantity Updated Successfully");
		} catch (error) {
			console.log(`Error Updating ${type} Quantity:`, error);
			checkAndCreateToast("success", `Error Updating ${type} Quantity `)
		} finally {
			OnRefresh();
			setIsLoading(false);
		}
	};


	// Handle adding new color to size
	const handleAddNewColor = async (sizeId, colors) => {
		setIsLoading(true);
		if (!productId) return;
		try {
			const response = await axios.patch(`${BASE_URL}/admin/product/update/addNewColorToSize`, {
				productId,
				sizeId: sizeId,
				colors: colors,
			}, Header());
			console.log(`Quantity Updated:`, response.data);
			setUpdatingColors([]);
			checkAndCreateToast("success", "New Color Added Successfully");
			// toast({ title: "New Color Added", message: "New Color Added Successfully", type: "success" });
		} catch (error) {
			console.log(`Error Updating Quantity:`, error.message);
			checkAndCreateToast("error", error.message);
			// toast({ title: "Error Updating Quantity", message: error.message, type: "error" });
		} finally {
			setIsLoading(false);
			OnRefresh();
			setUpdatingColors(null);
			setToggleEditColorsColor(null);
			setToggleAddNewSize(false);
		}
	};

	// Handle adding new size
	const handleAddNewSize = async (size) => {
		setIsLoading(true);
		if (newSize === null) return;
		if (!productId || !size) return;
		try {
			const response = await axios.patch(`${BASE_URL}/admin/product/update/addNewSizeStock`, {
				productId,
				size: size
			}, Header());
			console.log(`New Size Added:`, response.data);
			setUpdatingColors([]);
			setNewSize(null);
			setToggleEditColorsColor(null);
			setToggleAddNewSize(false);
			checkAndCreateToast("success", "New Size Added Successfully");
		} catch (error) {
			console.log(`Error Updating Quantity:`, error);
			checkAndCreateToast("error", error.message);
		} finally {
			OnRefresh();
			setIsLoading(false);
			setUpdatingColors([]);
			setNewSize(null);
			setToggleEditColorsColor(null);
			setToggleAddNewSize(false);
		}
	};

	// API call to update color quantity
	const putHandleUpdateSizeColorQuantity = async (sizeId, colorId, change, type) => {
		setIsLoading(true);
		try {
			if (!productId) return;
			const response = await axios.patch(`${BASE_URL}/admin/product/update/updateColorStock`, {
				productId,
				sizeId,
				colorId,
				updatedAmount: change,
			}, Header());
			console.log(`${type} Quantity Updated:`, response.data);
			checkAndCreateToast("success", "Quantity Updated Successfully");
		} catch (error) {
			console.log(`Error Updating ${type} Quantity:`, error);
			checkAndCreateToast("error", error.message);
		} finally {
			OnRefresh();
			setIsLoading(false);
		}
	};

	// Handle color click (to show selected color's images)
	const handleColorClick = (images) => {
		setSelectedColorImages(images);
	};

	const handelRemoveColor = async (sizeId, colorId) => {
		setIsLoading(true);
		try {
			const response = await axios.patch(`${BASE_URL}/admin/product/update/removeColorFromSize`, {
				productId,
				sizeId,
				colorId
			}, Header());
			console.log(`Color Removed:`, response.data);
			// toast("Color Removed Successfully","success");
			checkAndCreateToast("success", "Color Removed Successfully");
		} catch (error) {
			console.log(`Error Removing Color:`, error);
			checkAndCreateToast("error", "Error Removing Color");
		} finally {
			setIsLoading(false);
			OnRefresh();
			setToggleAddNewSize(false);
			setColorDeletingData(null);
		}
	}
	// Helper function to determine if the quantity is low
	const isLowQuantity = (quantity) => {
		const LOW_QUANTITY_THRESHOLD = 5; // Define your threshold
		return quantity <= LOW_QUANTITY_THRESHOLD;
	};
	const isCriticalQuantity = (quantity) => {
		const CRITICAL_QUANTITY_THRESHOLD = 2; // Define your threshold
		return quantity <= CRITICAL_QUANTITY_THRESHOLD;
	};
	const handelRemoveSize = async (sizeId) => {
		setIsLoading(true);
		try {
			const response = await axios.patch(`${BASE_URL}/admin/product/update/removeSizeFromProduct`, {
				productId,
				sizeId
			}, Header());
			console.log(`Size Removed: `, response.data);
			// toast("Size Removed Successfully","success");
			checkAndCreateToast("success", "Size Removed Successfully");
		} catch (error) {
			console.log(`Error Removing Size:`, error);
			checkAndCreateToast("error", "Error Removing Size");
			// toast({title:"Error Removing Size",message:error.message,type:"error"});
		} finally {
			setIsLoading(false);
			OnRefresh();
			setToggleAddNewSize(false);
			setSizeDeletingData(null);
		}
	}
	// console.log("SizesArray: ",sizeQuantities);
	useEffect(() => {
		console.log("SizesArray: ", SizesArray);
		setSizeQuantities(
			SizesArray.reduce((acc, size) => {
				acc[size._id] = size.quantity;
				size.colors.forEach(color => {
					acc[`${size._id}-${color._id}`] = color.quantity || 0;
				});
				return acc;
			}, {})
		);
	}, [SizesArray])
	// Render a warning icon for low quantity
	const renderLowQuantityIndicator = (quantity) => {
		if (isLowQuantity(quantity) && !isCriticalQuantity(quantity)) {
			return (
				<span className="text-yellow-500 animate-bounce" title="Low Quantity">
					<AlertTriangle className="w-5 h-5" />
				</span>
			);
		}
		return null;
	};
	const renderCriticalQuantityIndicator = (quantity) => {
		if (isCriticalQuantity(quantity)) {
			return (
				<span className="text-red-500 animate-bounce" title="Critical Quantity">
					<AlertTriangle className="w-5 h-5" />
				</span>
			);
		}
		return null;
	};
	const updateImageImageBuyColorId = async (colorId, sizeId, imagesArray) => {
		setIsLoading(true);
		try {
			const response = await axios.patch(`${BASE_URL}/admin/product/update/updateImages`, {
				productId,
				sizeId,
				colorId,
				images: imagesArray
			}, Header());
			console.log(`Image Updated: `, response?.data?.result);
			const updatedImages = response?.data?.result
			setActiveImageColorSize(sizeId);
			setSelectedColorImages(updatedImages);
			checkAndCreateToast("success", "Image Updated Successfully");
			// toast("Image Updated Successfully","success");
		} catch (error) {
			checkAndCreateToast("error", "Image Updated Failed");
			console.error("Error updating: ", error);
			// toast("Image Updated Failed","error");
		} finally {
			setIsLoading(false);
			setActiveSelectedColor(null);
			setActiveSelectedSize(null);
			if (OnRefresh) {
				OnRefresh();
			}
		}
	}

	return (
		<div className="min-w-full m-1 flex flex-col gap-7">
			{/* Container for the button to toggle New Size */}
			<div className="flex justify-center items-center gap-4">
				<Button
					disabled={isLoading}
					onClick={() => setToggleAddNewSize(!toggleAddNewSize)}
					className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-md flex items-center gap-2"
				>
					{/* Toggle between the Plus and Minus icon based on the state */}
					{toggleAddNewSize ? (
						<Fragment>
							<MinusCircleIcon className="h-5 w-5" />
							<span className="text-sm">Hide New Size</span> {/* Optional text for additional context */}
						</Fragment>
					) : (
						<Fragment>
							<PlusCircleIcon className="h-5 w-5" />
							<span className="text-sm">New Size</span> {/* Optional text for additional context */}
						</Fragment>
					)}
				</Button>
			</div>

			{/* Conditionally render Size Selector */}
			{toggleAddNewSize && <SizeSelector
				sizeType={"clothingSize"}
				OnChange={(e) => { setNewSize(e.length > 0 ? e : null); }}
			/>}

			{/* New Size Button */}
			{toggleAddNewSize && newSize && (
				<Button
					disabled={!newSize}
					onClick={() => handleAddNewSize(newSize)}
					className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-md"
				>
					Update New Size
				</Button>
			)}

			{/* Loop through Sizes */}
			{SizesArray && SizesArray.length > 0 && SizesArray.map((size, i) => (
				<div key={i} className="border p-4 rounded-md shadow-md w-full relative flex flex-col gap-4">

					{/* Size Info */}
					<h2 className="text-xl w-fit font-semibold text-gray-800 flex justify-center gap-2 items-center">Size: <span className='text-lg text-gray-700 text-left'>{size.label}</span>  <span className='animate-bounce'>{renderLowQuantityIndicator(sizeQuantities[size._id])} {renderCriticalQuantityIndicator(sizeQuantities[size._id])}</span></h2>
					<p className="text-sm text-gray-500">Quantity: {sizeQuantities[size._id]}</p>

					{/* Color Edit Button */}
					<div className="flex justify-end items-center gap-4">
						<Button
							disabled={isLoading}
							onClick={() => {
								if (toggleEditColor) {
									setToggleEditColorsColor(null);
								} else {
									setToggleEditColorsColor(size?._id);
								}
							}}
							className={`bg-black hover:bg-gray-700 p-2 rounded-md`}
						>
							Color <Edit size={20} />
						</Button>
					</div>

					{/* Color Preset Section */}
					<div className={`flex justify-center flex-col my-7 space-y-9 items-center ${toggleEditColor && toggleEditColor === size._id ? 'block' : 'hidden'}`}>
						<ColorPresetSelector
							colorOptions={colorOptions}
							sizeTag={size._id}
							sizeTitle={size.label}
							editingMode={true}
							OnChange={(e) => {
								setUpdatingColors({ sizeId: size._id, colors: e });
							}}
						/>

						{updatingColors && updatingColors.sizeId === size._id && (
							<div className={`flex justify-center items-center gap-4 ${updatingColors?.colors?.length > 0 ? 'block' : 'hidden'}`}>
								<Button
									disabled={updatingColors === null}
									onClick={() => {
										handleAddNewColor(updatingColors.sizeId, updatingColors.colors);
									}}
									className={`bg-green-500 text-white p-2 rounded-md ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
								>
									Update
								</Button>
							</div>
						)}
					</div>

					{/* Size Quantity Control */}
					<div className="flex items-center gap-2 mt-4 border justify-between border-gray-500 shadow-md rounded-md p-4 relative">
						<Label className='font-extrabold text-center text-gray-600'>{size.label}</Label>
						<div className='w-fit h-fit space-x-6'>
							<Button
								disabled={isLoading || sizeQuantities[size._id] <= 0}
								onClick={() => handleSizeQuantityChange(size._id, -1)}
								className="p-2 rounded-full"
							>
								<Minus />
							</Button>
							<Label className="text-lg text-gray-700 font-extrabold">Qty: {sizeQuantities[size._id]}</Label>
							<Button
								disabled={isLoading}
								onClick={() => handleSizeQuantityChange(size._id, 1)}
								className="p-2 rounded-full"
							>
								<Plus />
							</Button>
						</div>
					</div>

					{/* Remove Size Button */}
					<Button
						disabled={isLoading}
						onClick={() => {
							setSizeDeletingData({ sizeId: size._id });
							setIsConfirmDeleteWindow(!isConfirmDeleteWindow);
						}}
						className="absolute top-2 right-6 text-white p-2 rounded-full bg-red-700"
					>
						Delete Size: {size.label}
					</Button>

					{/* Color Options */}
					<div className="flex gap-4 mt-4 max-w-full overflow-x-auto justify-start items-start">
						{size && size.colors && size.colors.length > 0 && size.colors.map((color, index) => (
							<div
								key={index}
								className="relative flex flex-col items-center min-h-[200px] min-w-[260px] cursor-pointer justify-center border border-black gap-3 bg-neutral-50 p-4 rounded-md shadow-md"
							>
								<div className="flex justify-center space-x-2 items-center">
									<div
										className="w-10 h-10 rounded-full border-2"
										style={{ backgroundColor: color.label }}
									/>
									<Label className="text-sm text-gray-700 font-extrabold whitespace-nowrap">{color?.name}</Label>
								</div>
								<Label className="text-lg absolute top-2 left-0 text-black animate-bounce font-extrabold">
									{renderLowQuantityIndicator(sizeQuantities[`${size._id}-${color._id}`])}
									{renderCriticalQuantityIndicator(sizeQuantities[`${size._id}-${color._id}`])}
								</Label>
								<button onClick={(e) => {
									e.preventDefault();
									setActiveImageColorSize(size._id);
									handleColorClick(color?.images || []);
								}} className="text-lg absolute top-3 hover:scale-110 transition-all duration-500 ease-ease-in-out-expo left-10 text-black font-extrabold">
									<Eye />
								</button>

								{/* Color Quantity Control */}
								<div className="flex items-center px-3 min-w-fit justify-between border border-gray-600 rounded-lg space-x-4">
									<Button
										disabled={isLoading || sizeQuantities[`${size._id}-${color._id}`] <= 0}
										onClick={() => {
											handleColorQuantityChange(size._id, color._id, -1);
										}}
										className="bg-black p-2 rounded-full"
									>
										<Minus />
									</Button>
									<Label className="text-lg text-gray-700 font-extrabold whitespace-nowrap">
										Qty: {sizeQuantities[`${size._id}-${color._id}`]}
									</Label>
									<Button
										disabled={isLoading}
										onClick={() => {
											handleColorQuantityChange(size._id, color._id, 1);
										}}
										className="bg-black p-2 rounded-full"
									>
										<Plus />
									</Button>

									{/* File Upload Button with Icon */}
									<div className="p-2">
										<Button onClick={() => {
											setActiveSelectedColor(color._id);
											setActiveSelectedSize(size._id);
											setIsFileUploadPopUpOpen(!isFileUploadPopUpOpen);
											setSelectedColorImages([]);
										}} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-800">
											<ImageUpIcon />
										</Button>
									</div>
								</div>
								<Badge className='space-x-2 w-full flex justify-center items-center text-white font-bold text-lg py-2 px-2'>
									<Label>SKU:</Label>
									<Label>{color?.sku}</Label>
								</Badge>
								<Button

									onClick={() => {
										if (updatingSKU) {
											setUpdatingSKU(null);
										} else {
											setUpdatingSKU({ sizeId: size._id, colorId: color._id, sku: '' })
										}
									}}
									className="w-full py-2 text-center text-white font-extrabold bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200"
								>
									<span>Change SKU</span> <ChevronUp strokeWidth={5} className={`${updatingSKU && updatingSKU.sizeId === size._id && updatingSKU.colorId === color._id ? "rotate-180" : "rotate-0"} transition-all duration-300 ease-in-out`} />
								</Button>
								{
									updatingSKU && updatingSKU.sizeId === size._id && updatingSKU.colorId === color._id && <form onSubmit={HandleUpdateColorSKU} className="w-full flex flex-col items-center space-y-4 mt-4">
										<div className="w-full flex flex-row items-center space-x-2">
											<Input
												type="text"
												className="w-full h-10 px-3 text-gray-700 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
												value={updatingSKU?.sizeId === size?._id && updatingSKU?.colorId === color._id ? updatingSKU?.sku : ""}
												onChange={(e) => {
													setUpdatingSKU({ ...updatingSKU, sku: e.target.value });
												}}
												placeholder={`SKU number = ${size.label}-${color?.name}`}
											/>
											<Button
												type="submit"
												disabled={updatingSKU.sizeId !== size._id || updatingSKU.colorId !== color?._id || updatingSKU.sku === ''}
												onClick={HandleUpdateColorSKU}
												className="w-12 py-2 text-center px-3 text-white font-extrabold bg-black hover:bg-gray-800 rounded-md text-xs transition-all duration-200">
												<span>Update</span>
											</Button>
										</div>
									</form>
								}

								{/* Update SKU Form */}


								{/* Remove Color Button */}
								<Button
									disabled={isLoading}
									onClick={() => {
										setColorDeletingData({ sizeId: size._id, colorId: color._id });
										setIsConfirmDeleteWindow(!isConfirmDeleteWindow);
									}}
									className="text-white w-6 h-6 px-2 absolute top-2 right-2 bg-black p-2 rounded-full"
								>
									<X />
								</Button>
							</div>
						))}
					</div>


					{/* Image Preview Dialog */}
					<Dialog open={activeImageColorSize && activeImageColorSize === size?._id && selectedColorImages && selectedColorImages.length > 0} onOpenChange={() => {
						setActiveImageColorSize(null);
						setSelectedColorImages([]);
					}}>
						<ImagesPreview selectedColorImages={selectedColorImages} />
					</Dialog>
				</div>
			))}

			{/* Confirm Delete Popup */}
			<Dialog open={isConfirmDeleteWindow} onOpenChange={setIsConfirmDeleteWindow}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete the item.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => {
							setIsConfirmDeleteWindow(false);
							setColorDeletingData(null);
							setSizeDeletingData(null);
							setSelectedColorImages([]);
						}}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={() => {
							if (colorDeletingData) {
								handelRemoveColor(colorDeletingData.sizeId, colorDeletingData.colorId);
							}
							if (sizeDeletingData) {
								handelRemoveSize(sizeDeletingData.sizeId);
							}
							setIsConfirmDeleteWindow(false);
							setSelectedColorImages([]);
						}}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* File Upload Pop-Up Window */}
			<Dialog open={isFileUploadPopUpOpen} onOpenChange={() => {
				setActiveSelectedColor(null);
				setActiveSelectedSize(null);
				setIsFileUploadPopUpOpen(!isFileUploadPopUpOpen);
			}}>
				<FileUploadPopUpWindow
					sizeId={activeSelectedSize}
					colorId={activeSelectedColor}
					isOpen={isFileUploadPopUpOpen}
					onConfirm={(imageArray) => {
						updateImageImageBuyColorId(activeSelectedColor, activeSelectedSize, imageArray);
						setIsFileUploadPopUpOpen(!isFileUploadPopUpOpen);
					}}
				/>
			</Dialog>
		</div>

	);

};
const ImagesPreview = ({ selectedColorImages }) => {
	// Initialize loading states for each image/video item
	const [loadingStates, setLoadingStates] = useState(
		new Array(selectedColorImages.length).fill(true) // true means loading initially
	);

	// This function will update the loading state for a specific index
	const handleLoad = (index) => {
		setLoadingStates((prevStates) => {
			const newStates = [...prevStates];
			newStates[index] = false; // Mark as loaded
			return newStates;
		});
	};

	const handleVideoCanPlay = (index) => {
		setLoadingStates((prevStates) => {
			const newStates = [...prevStates];
			newStates[index] = false; // Mark video as loaded
			return newStates;
		});
	};

	const memoizedColorImages = useMemo(() => {
		return selectedColorImages.map((item, index) => {
			const isVideo = item?.url?.includes('video');
			const isLoading = loadingStates[index]; // Get the loading state for this item

			return (
				<div key={index} className="w-full h-44 relative">
					{/* Show spinner if the image/video is loading */}
					{isLoading && (
						<div className='w-full h-full absolute inset-0 z-10 justify-center bg-gray-100 animate-pulse flex items-center'>
							<div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
						</div>
					)}

					{/* Image or Video Component */}
					{isVideo ? (
						<video
							className="w-full h-full object-cover rounded-md border"
							controls
							src={item?.url}
							alt={`Color Video ${index + 1}`}
							onCanPlay={() => handleVideoCanPlay(index)} // Video on load event
							loading="lazy" // Lazy load videos
						>
							Your browser does not support the video tag.
						</video>
					) : (
						<LazyLoadImage
							effect="blur"
							useIntersectionObserver
							loading="lazy"
							wrapperProps={{
								// If you need to, you can tweak the effect transition using the wrapper style.
								style: { transitionDelay: "1s" },
							}}
							src={item?.url}
							alt={`Color Image ${index + 1}`}
							className="w-full h-full object-cover rounded-md border"
							onLoad={() => handleLoad(index)} // Image on load event
						/>
					)}
				</div>
			);
		});
	}, [selectedColorImages, loadingStates]); // Dependency on selectedColorImages and loadingStates

	return (
		<DialogContent>
			<DialogTitle>Images Preview</DialogTitle>
			<div className="grid grid-cols-4 gap-4">
				{memoizedColorImages}
			</div>
		</DialogContent>
	);
};
const FileUploadPopUpWindow = ({ sizeId, colorId, isOpen, onConfirm }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [imageArray, setImageArray] = useState([]);
	if (!isOpen) return null;
	return (
		<DialogContent>
			<DialogTitle>Upload Images New Images (Max : 8)</DialogTitle>
			<Label className={"font-normal text-gray-700 text-center text-xs"}>Image Size Should be: <span className='font-extrabold text-gray-600 text-sm'>(3000px x 4000px)</span><span className='text-blue-400 font-bold '>*</span> </Label>
			<div className="justify-between space-y-4 flex flex-col">
				<FileUploadComponent

					onRemovingImages={(index) => {
						setImageArray(imageArray.filter((_, i) => i !== index));
					}}
					maxFiles={8}
					tag={colorId}
					sizeTag={sizeId}
					onSetImageUrls={(e) => {
						setImageArray(e);
					}}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
				/>
				<Button
					disabled={isLoading || imageArray.length === 0}
					onClick={() => {
						onConfirm(imageArray);
					}}
					className="text-white px-4 py-2 rounded-lg hover:bg-gray-800 focus:outline-none"
				>
					{isLoading ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-black rounded-full animate-spin"></div> : <span>Upload ({imageArray.length})</span>}
				</Button>

			</div>
		</DialogContent>
	);
};


export default ProductPreview;
