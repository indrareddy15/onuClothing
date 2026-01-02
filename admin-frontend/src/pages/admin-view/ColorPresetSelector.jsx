import React, { Fragment, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp, Minus, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import FileUploadComponent from "@/components/admin-view/FileUploadComponent";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
const ColorPresetSelector = ({ colorOptions, sizeTag, sizeTitle, OnChange, editingMode = false, initialColors = [] }) => {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [optionsArray, setOptionsArray] = useState([]);
	const [selectedColorArray, setSelectedColorArray] = useState([]);

	useEffect(() => {
		if (initialColors && initialColors.length > 0) {
			setSelectedColorArray(initialColors);
			setOptionsArray(initialColors);
			setShowMore(initialColors.map((_, i) => ({ id: i, value: false })));
		}
	}, [initialColors]);

	// const [viewMoreState, setViewMoreState] = useState({}); // State to track view more per color ID
	const handelSetImagesByColor = (allImages, color) => {
		if (isLoading) return;
		setSelectedColorArray(selectedColorArray.map((s) => s.id === color.id ? { ...s, images: allImages } : s));
		if (OnChange) {
			OnChange(selectedColorArray);
			// console.log("Color Images Image Urls:  ",selectedColorArray);
		}

	}
	const handleIncrement = (e, color, action) => {
		if (isLoading) return;
		e.preventDefault();
		const alreadyPresent = selectedColorArray.find((s) => s.id === color.id)
		if (action === "increment") {
			// If the size is not already in the array, add it
			if (alreadyPresent === undefined) {
				setSelectedColorArray((prev) => [...prev, color]);
			}
			// Otherwise, increment the quantity of the existing size
			setSelectedColorArray((prev) =>
				prev.map((s) =>
					s.id === color.id ? { ...s, quantity: s.quantity + 1 } : s
				)
			);

		} else {
			// If the size is already in the array and its quantity is more than 1, decrement the quantity
			setSelectedColorArray((prev) =>
				prev.map((s) =>
					s.id === color.id
						? { ...s, quantity: s.quantity - 1 }
						: s
				).filter((s) => s.quantity >= 0) // Remove items with zero quantity
			);
		}
		// console.log("Selected Size Array: ",selectedSizeArray);
		if (OnChange) {
			OnChange(selectedColorArray);
			// console.log("Color Images Image Urls:  ",selectedColorArray);
		}
	};
	const handleChangeSKU = (e, color) => {
		if (isLoading) return;
		const value = e.target.value;
		setSelectedColorArray((prev) =>
			prev.map((c) =>
				c.id === color.id ? { ...c, sku: value } : c
			)
		);
		if (OnChange) {
			OnChange(selectedColorArray);
			// console.log("Color Images Image Urls:  ",selectedColorArray);
		}
	}

	const handleChangeQuantity = (e, color) => {
		if (isLoading) return;
		const value = parseInt(e.target.value, 10);
		if (!isNaN(value) && value >= 0) {
			setSelectedColorArray((prev) =>
				prev.map((c) =>
					c.id === color.id ? { ...c, quantity: value } : c
				)
			);
		} else {
			setSelectedColorArray((prev) =>
				prev.map((c) =>
					c.id === color.id ? { ...c, quantity: 0 } : c
				)
			);
		}
		if (OnChange) {
			OnChange(selectedColorArray);
			// console.log("Color Images Image Urls:  ",selectedColorArray);
		}
	};
	const changeColorLabel = (id, selectedColor) => {
		// console.log("Color Label: ",label,id);

		setOptionsArray(optionsArray.map((s) => s.id === id ? { ...s, label: selectedColor.label, name: selectedColor.name, images: selectedColor.images } : s));
		setSelectedColorArray(selectedColorArray.map((s) => s.id === id ? { ...s, label: selectedColor.label, name: selectedColor.name, images: selectedColor.images } : s));
		if (OnChange) {
			OnChange(selectedColorArray);
		}
	}
	useEffect(() => {
		if (isLoading) return;
		if (selectedColorArray.length > 0) {
			if (optionsArray.length === 0) {
				setSelectedColorArray([]);
			} else {
				for (const item of selectedColorArray) {
					const isInOptions = optionsArray.find((s) => s.id === item.id);
					if (!isInOptions) {
						setSelectedColorArray(selectedColorArray.filter((s) => s.id !== item.id));
						// setViewMoreState([...viewMoreState,{id:item.id,viewMore:false}]);
						// setViewMoreState()
					}
				}
			}
		}
		OnChange(selectedColorArray);
		// console.log("Color Images Image Urls:  ",selectedColorArray);

	}, [selectedColorArray, setSelectedColorArray, optionsArray]);

	// Toggle function to toggle the view more state for specific color
	const [showMore, setShowMore] = useState([]);

	const toggleShowMore = (e, index) => {
		e.preventDefault();
		setShowMore((prev) =>
			prev.map((item, idx) =>
				idx === index ? { ...item, value: !item.value } : item
			)
		);
	};
	// console.log("colorOptions: ",colorOptions)

	return (
		<Card className="w-full border-0 shadow-none sm:border sm:shadow-sm bg-transparent sm:bg-card">
			<CardHeader className="px-0 sm:px-6 pb-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<CardTitle className="text-lg font-semibold">Color Configuration</CardTitle>
						<p className="text-sm text-muted-foreground">Manage colors, SKUs, and quantities for <span className="font-medium text-foreground">{sizeTitle}</span></p>
					</div>
					<Badge variant="secondary" className="h-8 px-3">
						{selectedColorArray.length} Selected
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="px-0 sm:px-6 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
				{/* Selected Colors Preview */}
				{selectedColorArray.length > 0 && (
					<div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border border-dashed">
						{selectedColorArray.map((color, index) => (
							<div key={index} className="group relative">
								<div className="w-10 h-10 rounded-full border-2 border-background shadow-sm ring-1 ring-border transition-transform group-hover:scale-110" style={{ backgroundColor: color?.label }}></div>
								<div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-10 pointer-events-none">
									{color?.name || color?.label}
								</div>
							</div>
						))}
					</div>
				)}

				{/* Color Options List */}
				<div className="space-y-4">
					{optionsArray?.map((color, i) => (
						<Fragment key={`color_${i}`}>
							<div className={`rounded-xl border transition-all duration-300 ${showMore[i]?.value ? "bg-card shadow-md border-primary/20 ring-1 ring-primary/10" : "bg-card/50 hover:bg-card hover:shadow-sm"}`}>
								<div className="flex items-center justify-between p-4">
									<div className="flex items-center gap-4">
										<Button
											variant="ghost"
											size="icon"
											disabled={isLoading}
											onClick={(e) => toggleShowMore(e, i)}
											className={`rounded-full hover:bg-muted transition-transform duration-300 ${showMore[i]?.value ? "rotate-90 bg-muted" : ""}`}
										>
											<ChevronRight className="w-5 h-5" />
										</Button>

										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-full border shadow-sm" style={{ backgroundColor: color?.label }}></div>
											<div className="flex flex-col">
												<span className="font-medium text-sm">{color?.name || color?.label}</span>
												<span className="text-xs text-muted-foreground">
													{selectedColorArray.find(s => s.id === color.id)?.sku || "No SKU"} • Qty: {selectedColorArray.find(s => s.id === color.id)?.quantity || 0}
												</span>
											</div>
										</div>
									</div>

									<Button
										variant="ghost"
										size="sm"
										disabled={isLoading}
										onClick={(e) => {
											e.preventDefault();
											setOptionsArray(optionsArray.filter((s) => s.id !== color.id));
										}}
										className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
									>
										<X className="w-4 h-4" />
									</Button>
								</div>

								{/* Expanded Details */}
								{showMore[i]?.value && (
									<div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 fade-in duration-300">
										<div className="pt-4 border-t space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label className="text-xs font-medium text-muted-foreground">Color Preset</Label>
													<Select
														disabled={isLoading}
														value={color.label}
														onValueChange={(value) => {
															if (value === 'none') {
																toast({
																	title: `Please select a Valid Color Preset before adding colors Which Is Not = ${value}`,
																	variant: "default", // or info
																});
																return;
															}
															const selectedOption = colorOptions.find((option) => option.label === value);
															if (selectedOption) {
																changeColorLabel(color.id, selectedOption);
															}
														}}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select Color" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="none">None</SelectItem>
															{colorOptions.map((option) => (
																<SelectItem
																	key={option.id}
																	value={option.label}
																>
																	<div className="flex items-center gap-2">
																		<div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: option.label }}></div>
																		<span>{option?.name || option?.label}</span>
																	</div>
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>

												<div className="space-y-2">
													<Label className="text-xs font-medium text-muted-foreground">SKU Code</Label>
													<Input
														disabled={isLoading}
														type='text'
														value={selectedColorArray.find((s) => s.id === color.id)?.sku || ""}
														onChange={(e) => handleChangeSKU(e, color)}
														placeholder="Enter SKU"
														className="font-mono"
													/>
												</div>
											</div>

											<div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
												<Label className="text-sm font-medium">Quantity Available</Label>
												<div className="flex items-center gap-3 bg-background p-1 rounded-lg border shadow-sm">
													<Button
														variant="ghost"
														size="icon"
														disabled={isLoading}
														onClick={(e) => handleIncrement(e, color, "decrement")}
														className="h-8 w-8 rounded-md hover:bg-muted"
													>
														<Minus className="w-4 h-4" />
													</Button>

													<Input
														disabled={isLoading}
														type="number"
														value={selectedColorArray.find((c) => c.id === color.id)?.quantity || 0}
														onChange={(e) => handleChangeQuantity(e, color)}
														className="w-20 text-center border-none h-8 focus-visible:ring-0 p-0"
														min="0"
													/>

													<Button
														variant="ghost"
														size="icon"
														disabled={isLoading}
														onClick={(e) => handleIncrement(e, color, "increment")}
														className="h-8 w-8 rounded-md hover:bg-muted"
													>
														<Plus className="w-4 h-4" />
													</Button>
												</div>
											</div>

											{/* Image Upload Section */}
											{editingMode && selectedColorArray.find((s) => s.id === color.id)?.quantity > 0 && (
												<div className="pt-4 border-t border-dashed">
													<div className="flex items-center gap-2 mb-4">
														<span className="font-medium text-sm">Product Images</span>
														<Badge variant="outline" className="text-xs">
															{selectedColorArray.find(s => s.id === color.id)?.images?.length || 0} Uploaded
														</Badge>
													</div>
													<FileUploadComponent
														maxFiles={8}
														tag={color.id}
														sizeTag={sizeTag}
														onSetImageUrls={(e) => {
															console.log("Image Urls: ", e);
															handelSetImagesByColor(e, color);
														}}
														isLoading={isLoading}
														setIsLoading={setIsLoading}
													/>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						</Fragment>
					))}
				</div>

				{/* Add Color Button */}
				<div className="pt-2">
					<Button
						disabled={isLoading}
						variant="outline"
						className="w-full border-dashed border-2 h-12 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
						onClick={(e) => {
							e.preventDefault();
							setShowMore((prev) => [...prev, { id: optionsArray.length, value: true }]);
							setOptionsArray([
								...optionsArray,
								{ id: optionsArray.length + 1, label: "#ffffff", quantity: 0 },
							]);
						}}
					>
						<Plus className="w-4 h-4 mr-2" />
						Add New Color Variant
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
export default ColorPresetSelector;
