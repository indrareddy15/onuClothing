import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { sendAddressFormData, removeAddressFormData, fetchAddressFormData, updateAddressFormElementIndex } from '@/store/common-slice';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

const StrictModeDroppable = ({ children, ...props }) => {
	const [enabled, setEnabled] = useState(false);
	useEffect(() => {
		const animation = requestAnimationFrame(() => setEnabled(true));
		return () => {
			cancelAnimationFrame(animation);
			setEnabled(false);
		};
	}, []);
	if (!enabled) {
		return null;
	}
	return <Droppable {...props}>{children}</Droppable>;
};

const AdminAddressPage = () => {
	const dispatch = useDispatch();
	const { toast } = useToast();
	const { addressFormFields } = useSelector(state => state.common);
	const [formData, setFormData] = useState({
		label: '',
		name: '',
		type: 'text',
		placeholder: '',
		required: false,
		options: [] // For select inputs
	});

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	useEffect(() => {
		dispatch(fetchAddressFormData());
	}, [dispatch]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	const handleSelectChange = (value) => {
		setFormData(prev => ({
			...prev,
			type: value
		}));
	};

	const handleAddField = async () => {
		if (!formData.label || !formData.name) {
			toast({
				title: 'Label and Name are required',
				variant: 'destructive',
			});
			return;
		}

		try {
			await dispatch(sendAddressFormData(formData));
			setFormData({
				label: '',
				name: '',
				type: 'text',
				placeholder: '',
				required: false,
				options: []
			});
			toast({
				title: 'Field added successfully',
				variant: 'default',
			});
			dispatch(fetchAddressFormData());
		} catch (error) {
			console.error("Error adding field:", error);
			toast({
				title: 'Failed to add field',
				variant: 'destructive',
			});
		}
	};

	const handleDeleteField = (id) => {
		setDeleteId(id);
		setOpenDeleteDialog(true);
	};

	const confirmDeleteField = async () => {
		if (!deleteId) return;

		try {
			await dispatch(removeAddressFormData({ id: deleteId }));
			toast({
				title: 'Field deleted successfully',
				variant: 'default',
			});
			dispatch(fetchAddressFormData());
		} catch (error) {
			console.error("Error deleting field:", error);
			toast({
				title: 'Failed to delete field',
				variant: 'destructive',
			});
		} finally {
			setOpenDeleteDialog(false);
			setDeleteId(null);
		}
	};

	const onDragEnd = async (result) => {
		if (!result.destination) return;
		if (result.source.index === result.destination.index) return;

		try {
			const response = await dispatch(updateAddressFormElementIndex({
				sourceIndex: result.source.index,
				destinationIndex: result.destination.index
			}));

			if (response?.payload?.Success) {
				toast({
					title: "Field reordered successfully",
					variant: "default",
				});
				dispatch(fetchAddressFormData());
			} else {
				throw new Error(response?.payload?.message || "Reordering failed");
			}
		} catch (error) {
			console.error("Error reordering fields:", error);
			toast({
				title: 'Failed to reorder fields',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="w-full space-y-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Address Form Customization</h1>
					<p className="text-gray-600 mt-1">Manage the fields displayed in the customer address form</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Add New Field Form */}
				<Card className="lg:col-span-1 h-fit">
					<CardHeader>
						<CardTitle>Add New Field</CardTitle>
						<CardDescription>Create a new input field for the address form</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="label">Label</Label>
							<Input
								id="label"
								name="label"
								value={formData.label}
								onChange={handleInputChange}
								placeholder="e.g., Phone Number"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="name">Field Name (Unique)</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="e.g., phoneNumber"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="type">Input Type</Label>
							<Select value={formData.type} onValueChange={handleSelectChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="text">Text</SelectItem>
									<SelectItem value="number">Number</SelectItem>
									<SelectItem value="email">Email</SelectItem>
									<SelectItem value="textarea">Text Area</SelectItem>
									<SelectItem value="select">Select Dropdown</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="placeholder">Placeholder</Label>
							<Input
								id="placeholder"
								name="placeholder"
								value={formData.placeholder}
								onChange={handleInputChange}
								placeholder="e.g., Enter your phone number"
							/>
						</div>

						<div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
							<Label htmlFor="required" className="cursor-pointer">Required Field</Label>
							<Switch
								id="required"
								checked={formData.required}
								onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
							/>
						</div>

						<Button onClick={handleAddField} className="w-full">
							<Plus className="w-4 h-4 mr-2" />
							Add Field
						</Button>
					</CardContent>
				</Card>

				{/* Manage Fields List */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Manage Fields</CardTitle>
						<CardDescription>Drag and drop to reorder fields</CardDescription>
					</CardHeader>
					<CardContent>
						<DragDropContext onDragEnd={onDragEnd}>
							<StrictModeDroppable droppableId="address-fields">
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className="rounded-md border"
									>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="w-[50px]"></TableHead>
													<TableHead>Label</TableHead>
													<TableHead>Name</TableHead>
													<TableHead>Type</TableHead>
													<TableHead>Required</TableHead>
													<TableHead className="text-right">Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{addressFormFields && addressFormFields.length > 0 ? (
													addressFormFields.map((field, index) => {
														const isObject = typeof field === 'object' && field !== null;
														const fieldId = isObject ? (field._id || field.name) : field;
														const fieldLabel = isObject ? (field.label || field.name) : field;
														const fieldName = isObject ? field.name : field;
														const fieldType = isObject ? field.type : 'text';
														const fieldRequired = isObject ? field.required : false;

														if (!fieldId) return null;

														return (
															<Draggable key={String(fieldId)} draggableId={String(fieldId)} index={index}>
																{(provided) => (
																	<TableRow
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		className="bg-white"
																	>
																		<TableCell>
																			<div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600">
																				<GripVertical className="w-5 h-5" />
																			</div>
																		</TableCell>
																		<TableCell className="font-medium">{fieldLabel}</TableCell>
																		<TableCell className="text-gray-500">{fieldName}</TableCell>
																		<TableCell>
																			<Badge variant="outline" className="capitalize">{fieldType}</Badge>
																		</TableCell>
																		<TableCell>
																			{fieldRequired ? (
																				<Badge variant="default" className="bg-green-600 hover:bg-green-700">Yes</Badge>
																			) : (
																				<Badge variant="secondary">No</Badge>
																			)}
																		</TableCell>
																		<TableCell className="text-right">
																			<Button
																				variant="ghost"
																				size="icon"
																				className="text-red-500 hover:text-red-700 hover:bg-red-50"
																				onClick={() => handleDeleteField(fieldId)}
																			>
																				<Trash2 className="w-4 h-4" />
																			</Button>
																		</TableCell>
																	</TableRow>
																)}
															</Draggable>
														);
													})
												) : (
													<TableRow>
														<TableCell colSpan={6} className="text-center py-8 text-gray-500">
															No address fields configured. Add one to get started.
														</TableCell>
													</TableRow>
												)}
												{provided.placeholder}
											</TableBody>
										</Table>
									</div>
								)}
							</StrictModeDroppable>
						</DragDropContext>
					</CardContent>
				</Card>
			</div>

			<Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete the address field.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmDeleteField}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AdminAddressPage;
