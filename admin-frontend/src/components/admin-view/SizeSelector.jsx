import React, { Fragment, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ColorPresetSelector from "@/pages/admin-view/ColorPresetSelector";
import { ChevronRight, Minus, PencilRuler, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchOptionsByType } from "@/store/common-slice";
import AllColorsWithImages from "./AllColorsWithImages";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useSettingsContext } from "@/Context/SettingsContext";

const SizeSelector = ({ sizeType, OnChange, initialSizes = [] }) => {
	const { checkAndCreateToast } = useSettingsContext();
	const [sizeOptions, setSizeOptions] = useState([]);
	const [colorOptions, setColorOptions] = useState([]);
	const [optionsArray, setOptionsArray] = useState([]);
	const [selectedSizeArray, setSelectedSizeArray] = useState([]);
	const [showMore, setShowMore] = useState([]);
	const dispatch = useDispatch();
	const [availableColors, setAvailableColors] = useState([]);

	// Sync with initialSizes
	useEffect(() => {
		if (initialSizes && initialSizes.length > 0) {
			setSelectedSizeArray(initialSizes);
			setOptionsArray(initialSizes);
			setShowMore(initialSizes.map((_, i) => ({ id: i, value: false })));
		}
	}, [initialSizes]);

	// Handle Increment and Decrement of Quantity
	const handleIncrement = (size, action) => {
		const alreadyPresent = selectedSizeArray.find((s) => s.id === size.id);
		if (action === "increment") {
			if (alreadyPresent === undefined) {
				setSelectedSizeArray((prev) => [...prev, { ...size, quantity: 1 }]);
			} else {
				setSelectedSizeArray((prev) =>
					prev.map((s) =>
						s.id === size.id ? { ...s, quantity: s.quantity + 1 } : s
					)
				);
			}
		} else {
			setSelectedSizeArray((prev) =>
				prev
					.map((s) =>
						s.id === size.id ? { ...s, quantity: s.quantity - 1 } : s
					)
					.filter((s) => s.quantity > 0) // Remove sizes with zero quantity
			);
		}

		if (OnChange) {
			OnChange(selectedSizeArray);
		}
	};

	// Handle Manual Quantity Input
	const handleChangeQuantity = (e, size) => {
		e.preventDefault();
		const value = parseInt(e.target.value, 10);
		if (!isNaN(value) && value >= 0) {
			setSelectedSizeArray((prev) =>
				prev.map((s) =>
					s.id === size.id ? { ...s, quantity: value } : s
				)
			);
		} else {
			setSelectedSizeArray((prev) =>
				prev.map((s) =>
					s.id === size.id ? { ...s, quantity: 0 } : s
				)
			);
		}
		if (OnChange) {
			OnChange(selectedSizeArray);
		}
	};

	const changeSizeLabel = (id, label) => {
		if (label === 'none') {
			checkAndCreateToast("error", `Please select a Valid Size, Which Is Not = ${label}`)
			return;
		}
		setOptionsArray((prev) =>
			prev.map((s) => (s.id === id ? { ...s, label: label } : s))
		);
		setSelectedSizeArray((prev) =>
			prev.map((s) => (s.id === id ? { ...s, label: label } : s))
		);
	};

	const handelSetImagesByColor = (size, colorsArray) => {
		setSelectedSizeArray((prev) =>
			prev.map((s) =>
				s.id === size.id ? { ...s, colors: colorsArray } : s
			)
		);
	};

	// Effect to sync selected sizes with options
	useEffect(() => {
		if (selectedSizeArray.length > 0) {
			if (optionsArray.length === 0) {
				// If optionsArray is cleared but selectedSizeArray has items (e.g. from initial load), 
				// we might want to keep them or sync. 
				// But here logic seems to be: optionsArray is the source of truth for "added" sizes rows.
				// If initialSizes sets both, we are good.
			} else {
				for (const item of selectedSizeArray) {
					const isInOptions = optionsArray.find((s) => s.id === item.id);
					if (!isInOptions) {
						setSelectedSizeArray((prev) =>
							prev.filter((s) => s.id !== item.id)
						);
					}
				}
			}
		}
		if (OnChange) {
			// OnChange(selectedSizeArray); // Avoid infinite loop if OnChange triggers parent re-render passing new initialSizes
			// Only call OnChange if user interaction happens, or rely on parent to handle initial state.
			// But here we are just syncing internal state.
		}
	}, [selectedSizeArray, setSelectedSizeArray, optionsArray]);

	const fetchSizeOptions = async () => {
		try {
			console.log("Fetching Size Options: ", sizeType);
			const data = await dispatch(fetchOptionsByType(sizeType));
			const sizeData = data.payload?.result;
			setSizeOptions(sizeData?.map((s) => ({ id: s.value.toLowerCase(), label: s.value })) || []);
		} catch (error) {
			console.error("Error Fetching Size Options: ", error);
		}
	};

	const fetchColorOptions = async () => {
		try {
			const data = await dispatch(fetchOptionsByType("color"));
			const colorData = data.payload?.result;
			setColorOptions(colorData?.map((s) => ({ id: s._id, label: s.value, name: s.name })) || []);
		} catch (error) {
			console.error("Error Fetching Size Options: ", error);
		}
	};

	useEffect(() => {
		if (sizeType) {
			fetchSizeOptions();
			fetchColorOptions();
		}
	}, [dispatch, sizeType]);

	// Toggle the "Show More" for a specific index
	const toggleShowMore = (e, index) => {
		e.preventDefault();
		setShowMore((prev) =>
			prev.map((item, idx) =>
				idx === index ? { ...item, value: !item.value } : item
			)
		);
	};

	const handleAddSize = (e) => {
		e.preventDefault();
		setShowMore((prev) => [...prev, { id: optionsArray.length, value: false }]);
		setOptionsArray([
			...optionsArray,
			{ id: optionsArray.length + 1, label: `New Size`, quantity: 1 },
		]);
	};
	// console.log("Availbale Options Array: ", availableColors);
	// console.log("All Options Array: ", colorOptions);
	return (
		<div className="space-y-8 w-full">
			{/* Global Color Palette Section */}
			<div className="w-full">
				<AllColorsWithImages
					OnChangeColorsActive={(changedFiles) => {
						setAvailableColors(changedFiles);
					}}
				/>
			</div>

			<Card className="w-full bg-background shadow-sm">
				<CardHeader className="pb-4 border-b">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<CardTitle className="text-xl font-bold flex items-center gap-2">
								<PencilRuler className="w-5 h-5" />
								Size Variants
							</CardTitle>
							<p className="text-sm text-muted-foreground">
								Configure sizes and assign specific colors/images to each size.
							</p>
						</div>
						{selectedSizeArray.length > 0 && (
							<div className="flex flex-wrap gap-2 max-w-[50%] justify-end">
								{selectedSizeArray.map((size, index) => (
									<Badge key={index} variant="secondary" className="px-2 py-1 text-xs">
										{size?.label || size?.id}
										<span className="ml-1.5 opacity-50">({size.quantity})</span>
									</Badge>
								))}
							</div>
						)}
					</div>
				</CardHeader>

				<CardContent className="pt-6 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
					{optionsArray.length === 0 && (
						<div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
							<div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
								<PencilRuler className="w-6 h-6 text-muted-foreground" />
							</div>
							<h3 className="text-lg font-medium text-foreground">No Sizes Added</h3>
							<p className="text-sm text-muted-foreground mb-4">Start by adding a size variant to your product.</p>
							<Button onClick={handleAddSize} variant="outline">
								<Plus className="w-4 h-4 mr-2" />
								Add First Size
							</Button>
						</div>
					)}

					<div className="space-y-4">
						{optionsArray.map((size, i) => (
							<Fragment key={size.id}>
								<div className={`rounded-xl border transition-all duration-300 ${showMore[i]?.value ? "bg-card shadow-md border-primary/20 ring-1 ring-primary/10" : "bg-card hover:bg-muted/20"}`}>
									<div className="flex items-center justify-between p-4">
										<div className="flex items-center gap-4">
											<Button
												variant="ghost"
												size="icon"
												onClick={(e) => toggleShowMore(e, i)}
												className={`rounded-full hover:bg-muted transition-transform duration-300 ${showMore[i]?.value ? "rotate-90 bg-muted" : ""}`}
											>
												<ChevronRight className="w-5 h-5" />
											</Button>

											<div className="flex items-center gap-3">
												<Badge variant="outline" className="text-base px-3 py-1 min-w-[3rem] justify-center">
													{size?.label}
												</Badge>
												<div className="flex flex-col">
													<span className="text-xs text-muted-foreground">
														Quantity: {selectedSizeArray.find(s => s.id === size.id)?.quantity || 0}
													</span>
												</div>
											</div>
										</div>

										<Button
											variant="ghost"
											size="sm"
											onClick={(e) => {
												e.preventDefault();
												setOptionsArray(optionsArray.filter((s) => s.id !== size.id));
											}}
											className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
										>
											<span className="hidden sm:inline mr-2">Remove</span>
											<Minus className="w-4 h-4 sm:hidden" />
										</Button>
									</div>

									{/* Expanded Content */}
									{showMore[i]?.value && (
										<div className="px-4 pb-6 pt-0 animate-in slide-in-from-top-2 fade-in duration-300">
											<div className="pt-4 border-t space-y-6">
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="space-y-2">
														<Label className="text-sm font-medium">Size Label</Label>
														<Select
															value={size.label}
															onValueChange={(value) => {
																changeSizeLabel(size.id, value);
															}}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select Size" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="none">None</SelectItem>
																{sizeOptions.map((option) => (
																	<SelectItem key={option.id} value={option.label}>
																		{option.label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</div>

													<div className="space-y-2">
														<Label className="text-sm font-medium">Total Quantity</Label>
														<div className="flex items-center gap-3 bg-muted/30 p-1 rounded-lg border shadow-sm w-fit">
															<Button
																variant="ghost"
																size="icon"
																onClick={(e) => {
																	e.preventDefault();
																	handleIncrement(size, 'decrement');
																}}
																className="h-9 w-9 rounded-md hover:bg-background hover:shadow-sm"
															>
																<Minus className="w-4 h-4" />
															</Button>
															<Input
																type="number"
																value={selectedSizeArray.find((s) => s.id === size.id)?.quantity || 0}
																onChange={(e) => handleChangeQuantity(e, size)}
																className="w-20 text-center border-none h-9 focus-visible:ring-0 p-0 bg-transparent font-mono font-medium"
																min="0"
															/>
															<Button
																variant="ghost"
																size="icon"
																onClick={(e) => {
																	e.preventDefault();
																	handleIncrement(size, 'increment');
																}}
																className="h-9 w-9 rounded-md hover:bg-background hover:shadow-sm"
															>
																<Plus className="w-4 h-4" />
															</Button>
														</div>
													</div>
												</div>

												<div className="pt-4 border-t border-dashed">
													<ColorPresetSelector
														sizeTitle={size.label}
														colorOptions={availableColors}
														sizeTag={size.id}
														OnChange={(e) => handelSetImagesByColor(size, e)}
														editingMode={true}
														initialColors={size.colors}
													/>
												</div>

												{selectedSizeArray.length === 0 && (
													<div className="bg-amber-50 text-amber-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
														<div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
														Set quantity greater than 0 to enable color configuration.
													</div>
												)}
											</div>
										</div>
									)}
								</div>
							</Fragment>
						))}
					</div>

					{optionsArray.length > 0 && (
						<div className="pt-4 flex justify-center">
							<Button
								className="w-full sm:w-auto min-w-[200px] btn-primary shadow-lg hover:shadow-xl transition-all"
								onClick={handleAddSize}
							>
								<Plus className="mr-2 w-4 h-4" />
								Add Another Size
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default SizeSelector;
