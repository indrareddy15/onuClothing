import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addNewOption, deleteOption, fetchAllOptions, setConvenienceFees, updateColorName, updateOptionActive } from '@/store/common-slice';
import { ChevronRight, Trash2, Plus, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

const AdminOptions = () => {
	const { toast } = useToast();
	const { AllOptions, convenienceFees } = useSelector(state => state.common);
	const [currentUpdatingColorNameData, setUpdatingColorNameData] = useState(null);
	const [isUpdateEnabled, setIsUpdateEnabled] = useState(false);

	const dispatch = useDispatch();
	const [convenienceFeesAmount, setConvenienceFeesAmount] = useState(0)
	const [category, setCategory] = useState('');
	const [subcategory, setSubcategory] = useState('');
	const [color, setColor] = useState('#000000');
	const [clothingWearSize, setClothingWearSize] = useState('');
	const [gender, setGender] = useState('');

	const [categories, setCategories] = useState([]);
	const [subcategories, setSubcategories] = useState([]);
	const [colors, setColors] = useState([]);
	const [clothingWearSizes, setClothingWearSizes] = useState([]);
	const [genders, setGenders] = useState([]);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteData, setDeleteData] = useState(null);

	const handleAddOption = async (type, value) => {
		if (value.trim() === '') return;
		await dispatch(addNewOption({ type, value }));
		dispatch(fetchAllOptions());
		switch (type) {
			case 'category':
				setCategory('');
				break;
			case 'subcategory':
				setSubcategory('');
				break;
			case 'color':
				setColor('#000000');
				break;
			case 'clothingSize':
				setClothingWearSize('');
				break;
			case 'gender':
				setGender('');
				break;
			default:
				break;
		}
		toast({
			title: `Added New ${type}`,
			variant: 'default',
		});
	};

	const handleRemoveOption = (type, value) => {
		setDeleteData({ type, value });
		setOpenDeleteDialog(true);
	};

	const confirmDeleteOption = async () => {
		if (!deleteData) return;

		await dispatch(deleteOption({ type: deleteData.type, value: deleteData.value.value }));
		dispatch(fetchAllOptions());
		setOpenDeleteDialog(false);
		setDeleteData(null);
	};

	const handleToggleShowOptionInProducts = async (type, value, checked) => {
		console.log("Toggle show option in products: ", type, value, checked);
		await dispatch(updateOptionActive({ type: type, value: value.value, isActive: checked }))
		toast({
			title: `Updated visibility for ${value.value}`,
			variant: 'default',
		});
		dispatch(fetchAllOptions());
	}

	const handleUpdateColorName = async () => {
		if (currentUpdatingColorNameData) {
			console.log("Update color name: ", { type: currentUpdatingColorNameData.type, value: currentUpdatingColorNameData.value.value, name: currentUpdatingColorNameData?.name })
			await dispatch(updateColorName({ type: currentUpdatingColorNameData.type, value: currentUpdatingColorNameData.value.value, name: currentUpdatingColorNameData?.name }));
			dispatch(fetchAllOptions());
			toast({
				title: `Updated Color Name: ${currentUpdatingColorNameData?.type}`,
				variant: 'default',
			});
			setUpdatingColorNameData(null);
			setIsUpdateEnabled(false);
		} else {
			toast({
				title: `Set a New Name to Update`,
				variant: 'default', // or info
			});
		}
	}

	useEffect(() => {
		dispatch(fetchAllOptions());
	}, [dispatch]);

	useEffect(() => {
		setAllOptions();
	}, [AllOptions, dispatch]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [])

	const setAllOptions = () => {
		if (AllOptions && AllOptions.length > 0) {
			setCategories(AllOptions.filter(item => item.type === 'category'));
			setSubcategories(AllOptions.filter(item => item.type === 'subcategory'));
			setColors(AllOptions.filter(item => item.type === 'color') || []);
			setClothingWearSizes(AllOptions.filter(item => item.type === 'clothingSize'));
			setGenders(AllOptions.filter(item => item.type === 'gender'));
		}
	};

	const updateConvenienceFees = async () => {
		try {
			await dispatch(setConvenienceFees({ convenienceFees: convenienceFeesAmount || 0 }));
			setConvenienceFeesAmount(0);
			toast({
				title: "Convenience Fees Updated",
				variant: 'default',
			});
		} catch (error) {
			console.error("Failed to set convenience: ", error);
			toast({
				title: "Failed to update fees",
				variant: 'destructive',
			});
		}
	}

	return (
		<div className="w-full space-y-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Product Options</h1>
					<p className="text-gray-600 mt-1">Manage categories, sizes, colors, and other attributes</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Create Options Form */}
				<Card className="h-fit">
					<CardHeader>
						<CardTitle>Create New Option</CardTitle>
						<CardDescription>Add new attributes to your store</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<div className="p-4 bg-gray-50 rounded-lg border space-y-3">
								<Label className="text-base font-semibold">Convenience Fees</Label>
								<div className="flex gap-2">
									<Input
										type="number"
										value={convenienceFeesAmount}
										onChange={(e) => setConvenienceFeesAmount(e.target.value)}
										placeholder="Enter amount"
									/>
									<Button onClick={updateConvenienceFees}>Update</Button>
								</div>
								<p className="text-sm text-gray-500">Current Fee: <span className="font-bold text-green-600">₹{convenienceFees}</span></p>
							</div>

							<Separator />

							<div className="space-y-2">
								<Label>Product Category</Label>
								<div className="flex gap-2">
									<Input
										value={category}
										onChange={(e) => setCategory(e.target.value)}
										placeholder="e.g., Clothing, Accessories"
									/>
									<Button onClick={() => handleAddOption('category', category)} size="icon">
										<Plus className="w-4 h-4" />
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Product Subcategory</Label>
								<div className="flex gap-2">
									<Input
										value={subcategory}
										onChange={(e) => setSubcategory(e.target.value)}
										placeholder="e.g., T-Shirts, Jeans"
									/>
									<Button onClick={() => handleAddOption('subcategory', subcategory)} size="icon">
										<Plus className="w-4 h-4" />
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Product Color</Label>
								<div className="flex gap-2 items-center">
									<div className="relative w-12 h-10 overflow-hidden rounded-md border shadow-sm">
										<input
											type="color"
											value={color}
											onChange={(e) => setColor(e.target.value)}
											className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
										/>
									</div>
									<Input
										value={color}
										onChange={(e) => setColor(e.target.value)}
										placeholder="#000000"
										className="font-mono"
									/>
									<Button onClick={() => handleAddOption('color', color)} size="icon">
										<Plus className="w-4 h-4" />
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Clothing Size</Label>
								<div className="flex gap-2">
									<Input
										value={clothingWearSize}
										onChange={(e) => setClothingWearSize(e.target.value)}
										placeholder="e.g., S, M, L, XL"
									/>
									<Button onClick={() => handleAddOption('clothingSize', clothingWearSize)} size="icon">
										<Plus className="w-4 h-4" />
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Product Gender</Label>
								<div className="flex gap-2">
									<Input
										value={gender}
										onChange={(e) => setGender(e.target.value)}
										placeholder="e.g., Men, Women, Unisex"
									/>
									<Button onClick={() => handleAddOption('gender', gender)} size="icon">
										<Plus className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Manage Options List */}
				<Card className="h-fit">
					<CardHeader>
						<CardTitle>Manage Options</CardTitle>
						<CardDescription>View and manage existing attributes</CardDescription>
					</CardHeader>
					<CardContent>
						<Accordion type="single" collapsible className="w-full">
							<AccordionItem value="categories">
								<AccordionTrigger>
									Product Categories ({categories.length})
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
										{categories.map((item, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
												<div className="flex items-center gap-3">
													<Checkbox
														checked={item?.isActive || false}
														onCheckedChange={(checked) => handleToggleShowOptionInProducts('category', item, checked)}
													/>
													<span className="text-sm font-medium">{item?.value}</span>
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
													onClick={() => handleRemoveOption('category', item)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="subcategories">
								<AccordionTrigger>
									Product Subcategories ({subcategories.length})
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
										{subcategories.map((item, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
												<div className="flex items-center gap-3">
													<Checkbox
														checked={item?.isActive || false}
														onCheckedChange={(checked) => handleToggleShowOptionInProducts('subcategory', item, checked)}
													/>
													<span className="text-sm font-medium">{item?.value}</span>
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
													onClick={() => handleRemoveOption('subcategory', item)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="genders">
								<AccordionTrigger>
									Product Genders ({genders.length})
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
										{genders.map((item, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
												<div className="flex items-center gap-3">
													<Checkbox
														checked={item?.isActive || false}
														onCheckedChange={(checked) => handleToggleShowOptionInProducts('gender', item, checked)}
													/>
													<span className="text-sm font-medium">{item?.value}</span>
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
													onClick={() => handleRemoveOption('gender', item)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="clothingSizes">
								<AccordionTrigger>
									Clothing Sizes ({clothingWearSizes.length})
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
										{clothingWearSizes.map((item, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
												<div className="flex items-center gap-3">
													<Checkbox
														checked={item?.isActive || false}
														onCheckedChange={(checked) => handleToggleShowOptionInProducts('clothingSize', item, checked)}
													/>
													<span className="text-sm font-medium">{item?.value}</span>
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
													onClick={() => handleRemoveOption('clothingSize', item)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="colors">
								<AccordionTrigger>
									Colors ({colors.length})
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
										{colors.map((item, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
												<div className="flex items-center gap-3 flex-1">
													<div
														className="w-8 h-8 rounded-full border shadow-sm shrink-0"
														style={{ backgroundColor: item?.value }}
													/>
													<div className="flex-1">
														<Input
															value={
																currentUpdatingColorNameData && currentUpdatingColorNameData.value && currentUpdatingColorNameData.value._id === item._id
																	? currentUpdatingColorNameData?.name
																	: item?.name || ''
															}
															onChange={(e) => {
																setUpdatingColorNameData({ type: 'color', value: item, name: e.target.value });
																setIsUpdateEnabled(true);
															}}
															placeholder="Color Name"
															className="h-8 text-sm"
														/>
													</div>
													{currentUpdatingColorNameData && currentUpdatingColorNameData.value._id === item._id && isUpdateEnabled && (
														<Button size="sm" onClick={handleUpdateColorName} className="h-8">
															Save
														</Button>
													)}
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
													onClick={() => handleRemoveOption('color', item)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</CardContent>
				</Card>
			</div>

			<Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete the option.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmDeleteOption}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AdminOptions;
