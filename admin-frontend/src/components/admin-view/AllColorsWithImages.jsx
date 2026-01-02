import { fetchOptionsByType } from '@/store/common-slice';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import FileUploadComponent from './FileUploadComponent';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useSettingsContext } from '@/Context/SettingsContext';

const AllColorsWithImages = ({ OnChangeColorsActive }) => {
	const { checkAndCreateToast } = useSettingsContext();
	const dispatch = useDispatch();
	const [allColors, setAllColors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [colorOptions, setColorOptions] = useState([]);
	const [activeColorSelect, setActiveColorSelect] = useState(null);
	const [rest, setOnReset] = useState(false);

	// Fetch color options from the store on mount
	const fetchColorOptions = async () => {
		try {
			const data = await dispatch(fetchOptionsByType("color"));
			const colorData = data.payload?.result;
			setColorOptions(colorData?.map((s) => ({ id: s._id, label: s.value, name: s.name })) || []);
		} catch (error) {
			console.error("Error Fetching Color Options: ", error);
		}
	};

	// Remove color from the selected colors list
	const removeColorFromAllColors = (id) => {
		setAllColors(allColors.filter((color) => color.id !== id));
	};
	const handelSetActiveColorSelect = (color) => {
		if (activeColorSelect) {
			setActiveColorSelect({ ...activeColorSelect, id: color.id, label: color.label, name: color.name, images: color.images || [] });
		} else {
			setActiveColorSelect({ ...color, images: [] });
		}
	}
	// Add the selected color to the array
	const updateSelectedColorArray = (e) => {
		e.preventDefault();
		console.log("activeColorSelect", e);
		if (isLoading || !activeColorSelect || activeColorSelect?.images?.length === 0) {
			// checkAndCreateToast("error","Please select an image for the color.");
			console.log("Please select an image for the color.");
			return;
		}
		if (activeColorSelect) {
			const alreadyPresent = allColors.find((s) => s.id === activeColorSelect?.id);
			if (!alreadyPresent) {
				if (activeColorSelect.images !== null && activeColorSelect.images.length > 0) {
					setAllColors([...allColors, activeColorSelect]);
					setActiveColorSelect(null);
				}
			}
		}
	};

	// Notify parent component of color selection changes
	useEffect(() => {
		if (OnChangeColorsActive) {
			OnChangeColorsActive(allColors);
		}
	}, [allColors, OnChangeColorsActive]);

	// Fetch color options on component mount
	useEffect(() => {
		fetchColorOptions();
	}, [dispatch]);
	return (
		<Card className="w-full bg-background shadow-sm">
			<CardHeader className="pb-4 border-b">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<CardTitle className="text-xl font-bold flex items-center gap-2">
						All Colors
						<Badge variant="secondary" className="text-sm px-2 py-0.5">{allColors.length}</Badge>
					</CardTitle>
					<div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
						<span>Recommended Size:</span>
						<span className="font-bold text-foreground">3000px x 4000px</span>
						<span className="text-destructive">*</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-6 space-y-8">
				{allColors.length > 0 && (
					<div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory custom-scrollbar">
						{allColors.map((color, index) => {
							const active = color;
							return (
								<div key={index} className="flex-shrink-0 w-[280px] group relative border rounded-xl p-4 hover:shadow-md transition-all duration-300 bg-card snap-center">
									<div className="space-y-3">
										<div className="flex items-center justify-between gap-2">
											<Badge variant="outline" className="font-medium">{active?.name}</Badge>
											<Badge variant="secondary" className="text-xs">{active?.images.length} Images</Badge>
										</div>

										<div className="relative w-full h-32 rounded-lg border shadow-sm overflow-hidden bg-muted/20">
											<div
												className="absolute inset-0 w-full h-full opacity-20"
												style={{ backgroundColor: active?.label }}
											/>
											{active?.images?.[0] ? (
												<img
													src={active.images[0]}
													alt={active.name}
													className="absolute inset-0 w-full h-full object-cover"
												/>
											) : (
												<div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
													No Image
												</div>
											)}
										</div>

										<div className="text-xs text-muted-foreground font-mono truncate">
											{active?.label}
										</div>
									</div>

									<Button
										variant="destructive"
										size="icon"
										className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
										onClick={(e) => {
											e.preventDefault();
											removeColorFromAllColors(active.id)
										}}
									>
										<X className="w-3.5 h-3.5" />
									</Button>
								</div>
							)
						})}
					</div>
				)}

				<div className="rounded-xl border bg-muted/30 p-6 space-y-6">
					<div className="space-y-4">
						<Label className="text-base font-semibold">Add New Color</Label>
						<div className="flex flex-col sm:flex-row gap-4 items-start">
							<div className="relative flex-shrink-0">
								<div
									className="w-10 h-10 rounded-full border-2 border-background shadow-sm ring-1 ring-border"
									style={{
										backgroundColor: activeColorSelect?.label || "#ffffff",
									}}
								/>
							</div>
							<div className="flex-1 w-full">
								<Select
									value={activeColorSelect?.label}
									onValueChange={(e) => {
										const selectedOption = colorOptions.find(option => option.label === e);
										if (selectedOption) {
											console.log("Color Selected: ", selectedOption);
											handelSetActiveColorSelect(selectedOption);
										} else {
											setActiveColorSelect(null);
										}
									}}
								>
									<SelectTrigger className="w-full bg-background">
										<SelectValue placeholder="Select a color to add..." />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">None</SelectItem>
										{colorOptions.map((option, index) => (
											<SelectItem
												key={option.id || index}
												value={option.label}
											>
												<div className="flex items-center gap-3">
													<div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: option.label }}></div>
													<span className="font-medium">{option?.name || option?.label}</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{activeColorSelect && (
						<div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
							<div className="border-t pt-4">
								<Label className="font-medium mb-3 block">
									Upload Images for <span className="text-primary">{activeColorSelect?.name || activeColorSelect?.label}</span> <span className="text-destructive">*</span>
								</Label>
								<FileUploadComponent
									onRemovingImages={(index) => {
										console.log('Removing Images: ', index);
										setActiveColorSelect({ ...activeColorSelect, images: activeColorSelect.images.filter((_, i) => i !== index) });
									}}
									maxFiles={8}
									tag={activeColorSelect.id}
									sizeTag={'allColors'}
									onSetImageUrls={(files) => {
										console.log('Image Urls: ', files);
										setActiveColorSelect({ ...activeColorSelect, images: files });
									}}
									isLoading={isLoading}
									setIsLoading={setIsLoading}
									onReset={rest}
								/>
							</div>

							<div className="flex justify-end pt-2">
								<Button
									disabled={isLoading || !activeColorSelect || activeColorSelect?.images?.length === 0}
									className="w-full sm:w-auto min-w-[200px]"
									onClick={updateSelectedColorArray}
								>
									Add Color {activeColorSelect?.images?.length > 0 ? `(${activeColorSelect?.images?.length} images)` : ""}
								</Button>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};


export default AllColorsWithImages
