import React, { Fragment, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChevronRight, Minus, PencilRuler, Plus, Check, RefreshCw, Layers } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchOptionsByType } from "@/store/common-slice";
import AllColorsWithImages from "./AllColorsWithImages";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useSettingsContext } from "@/Context/SettingsContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SizeSelector = ({ sizeType = "clothingSize", OnChange, initialSizes = [], initialColors = [], productId = "" }) => {
	const { checkAndCreateToast } = useSettingsContext();
	const dispatch = useDispatch();

	// Options from backend
	const [sizeOptions, setSizeOptions] = useState([]);
	const [colorOptions, setColorOptions] = useState([]);

	// Component State
	const [selectedSizes, setSelectedSizes] = useState([]);
	const [availableColors, setAvailableColors] = useState([]); // Selected colors with images
	const [matrix, setMatrix] = useState([]);
	const [isInitialized, setIsInitialized] = useState(false);
	const [selectedFilterColor, setSelectedFilterColor] = useState("");

	// Bulk action values
	const [bulkStock, setBulkStock] = useState("");
	const [skuPrefix, setSkuPrefix] = useState("");

	// Sync selectedFilterColor when availableColors changes
	useEffect(() => {
		if (availableColors && availableColors.length > 0) {
			const currentExists = availableColors.find(c => (c.id || c._id) === selectedFilterColor);
			if (!currentExists) {
				setSelectedFilterColor(availableColors[0].id || availableColors[0]._id);
			}
		} else {
			setSelectedFilterColor("");
		}
	}, [availableColors, selectedFilterColor]);

	// Keep OnChange callback in a ref to prevent infinite re-render loops
	const onChangeRef = React.useRef(OnChange);
	useEffect(() => {
		onChangeRef.current = OnChange;
	}, [OnChange]);

	// Memoize color callback to prevent AllColorsWithImages from triggering infinite render loops
	const handleColorsChange = React.useCallback((changedColors) => {
		setAvailableColors(changedColors);
	}, []);

	// 1. Fetch available options from DB
	const fetchSizeOptions = async () => {
		try {
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
			console.error("Error Fetching Color Options: ", error);
		}
	};

	useEffect(() => {
		fetchSizeOptions();
		fetchColorOptions();
	}, [dispatch, sizeType]);

	// 2. Initialize from initialSizes (Edit Mode)
	useEffect(() => {
		if (initialSizes && initialSizes.length > 0 && !isInitialized) {
			const sizesSet = new Set();
			const initialMatrix = [];
			
			initialSizes.forEach((s) => {
				sizesSet.add(s.label);
				if (s.colors) {
					s.colors.forEach((c) => {
						initialMatrix.push({
							sizeLabel: s.label,
							colorId: c.id || c._id,
							colorLabel: c.label,
							colorName: c.name,
							sku: c.sku || "",
							quantity: c.quantity || 0,
							images: c.images || []
						});
					});
				}
			});
			setSelectedSizes(Array.from(sizesSet));
			setMatrix(initialMatrix);
			setIsInitialized(true);
		}
	}, [initialSizes, isInitialized]);

	// If no initialSizes, mark as initialized immediately
	useEffect(() => {
		if (!initialSizes || initialSizes.length === 0) {
			setIsInitialized(true);
		}
	}, [initialSizes]);

	// 3. Keep Matrix Synced with selected sizes and colors
	useEffect(() => {
		if (!isInitialized) return;

		setMatrix((prevMatrix) => {
			const newMatrix = [];
			selectedSizes.forEach((size) => {
				availableColors.forEach((color) => {
					// Check if combination already exists in the previous matrix state
					const existing = prevMatrix.find(
						(m) => m.sizeLabel === size && m.colorId === (color.id || color._id)
					);
					if (existing) {
						newMatrix.push({
							...existing,
							colorName: color.name || existing.colorName,
							colorLabel: color.label || existing.colorLabel,
							images: color.images || existing.images
						});
					} else {
						// Autogenerate default SKU
						const cleanProductId = productId ? productId.trim().toUpperCase() : "PROD";
						const cleanColor = color.name ? color.name.trim().toUpperCase().replace(/\s+/g, "") : "COLOR";
						const cleanSize = size.trim().toUpperCase();
						const generatedSku = `${cleanProductId}-${cleanColor}-${cleanSize}`;

						newMatrix.push({
							sizeLabel: size,
							colorId: color.id || color._id,
							colorLabel: color.label,
							colorName: color.name,
							sku: generatedSku,
							quantity: 0,
							images: color.images || []
						});
					}
				});
			});
			return newMatrix;
		});
	}, [selectedSizes, availableColors, productId, isInitialized]);

	// 4. Transform Matrix back to Database Nested Structure & Call OnChange
	useEffect(() => {
		if (isInitialized) {
			const nestedStructure = serializeMatrix(matrix);
			if (onChangeRef.current) {
				onChangeRef.current(nestedStructure);
			}
		}
	}, [matrix, isInitialized]);

	const serializeMatrix = (flatMatrix) => {
		// Group rows by sizeLabel
		const sizeGroups = {};
		flatMatrix.forEach((row) => {
			if (!sizeGroups[row.sizeLabel]) {
				sizeGroups[row.sizeLabel] = [];
			}
			sizeGroups[row.sizeLabel].push(row);
		});

		// Build nested array format
		return Object.keys(sizeGroups).map((sizeLabel, sIndex) => {
			const rows = sizeGroups[sizeLabel];
			const sizeTotalStock = rows.reduce((sum, r) => sum + Number(r.quantity || 0), 0);

			const colors = rows.map((r, cIndex) => ({
				id: cIndex + 1,
				label: r.colorLabel,
				name: r.colorName,
				sku: r.sku,
				quantity: Number(r.quantity || 0),
				images: r.images
			}));

			return {
				id: sIndex + 1,
				label: sizeLabel,
				quantity: sizeTotalStock,
				colors: colors
			};
		});
	};

	// 5. Size Selection handler
	const toggleSizeSelection = (sizeLabel) => {
		setSelectedSizes((prev) =>
			prev.includes(sizeLabel)
				? prev.filter((s) => s !== sizeLabel)
				: [...prev, sizeLabel]
		);
	};

	// 6. Matrix Row change handlers
	const handleMatrixQuantityChange = (sizeLabel, colorId, value) => {
		const parsedValue = parseInt(value, 10);
		const quantity = !isNaN(parsedValue) && parsedValue >= 0 ? parsedValue : 0;

		setMatrix((prev) =>
			prev.map((m) =>
				m.sizeLabel === sizeLabel && m.colorId === colorId
					? { ...m, quantity }
					: m
			)
		);
	};

	const handleMatrixSkuChange = (sizeLabel, colorId, sku) => {
		setMatrix((prev) =>
			prev.map((m) =>
				m.sizeLabel === sizeLabel && m.colorId === colorId
					? { ...m, sku }
					: m
			)
		);
	};

	// 7. Bulk Actions
	const handleApplyBulkStock = (e) => {
		e.preventDefault();
		const stock = parseInt(bulkStock, 10);
		if (isNaN(stock) || stock < 0) {
			checkAndCreateToast("error", "Please enter a valid stock quantity");
			return;
		}

		setMatrix((prev) =>
			prev.map((m) =>
				m.colorId === selectedFilterColor ? { ...m, quantity: stock } : m
			)
		);
		checkAndCreateToast("success", `Applied quantity ${stock} to all variations of the selected color`);
		setBulkStock("");
	};

	const handleRegenerateSKUs = (e) => {
		e.preventDefault();
		const prefix = skuPrefix.trim().toUpperCase();
		if (!prefix) {
			checkAndCreateToast("error", "Please enter a SKU prefix or product ID");
			return;
		}

		setMatrix((prev) =>
			prev.map((m) => {
				if (m.colorId !== selectedFilterColor) return m;
				const cleanColor = m.colorName ? m.colorName.trim().toUpperCase().replace(/\s+/g, "") : "COLOR";
				const cleanSize = m.sizeLabel.trim().toUpperCase();
				return {
					...m,
					sku: `${prefix}-${cleanColor}-${cleanSize}`
				};
			})
		);
		checkAndCreateToast("success", "Regenerated SKUs for the selected color");
	};

	const filteredMatrix = matrix.filter((row) => row.colorId === selectedFilterColor);

	return (
		<div className="space-y-8 w-full">
			{/* Color Selection Palette & Image Uploads */}
			<div className="w-full">
				<AllColorsWithImages
					initialColors={initialColors}
					OnChangeColorsActive={handleColorsChange}
				/>
			</div>

			{/* Size Multi-Select Toggle Cards */}
			<Card className="w-full bg-background shadow-sm border">
				<CardHeader className="pb-4 border-b">
					<CardTitle className="text-xl font-bold flex items-center gap-2">
						<PencilRuler className="w-5 h-5 text-gray-500" />
						Select Applicable Sizes
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Click size badges below to activate size variations for this product.
					</p>
				</CardHeader>
				<CardContent className="pt-6">
					{sizeOptions.length === 0 ? (
						<div className="text-sm text-muted-foreground animate-pulse">Loading size options...</div>
					) : (
						<div className="flex flex-wrap gap-3">
							{sizeOptions.map((opt) => {
								const active = selectedSizes.includes(opt.label);
								return (
									<button
										key={opt.id}
										onClick={(e) => {
											e.preventDefault();
											toggleSizeSelection(opt.label);
										}}
										className={`px-5 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all flex items-center gap-2 ${
											active
												? "border-primary bg-primary text-primary-foreground shadow-sm scale-105"
												: "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
										}`}
									>
										{opt.label}
										{active && <Check className="w-4 h-4 shrink-0" />}
									</button>
								);
							})}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Variant Matrix Table */}
			{matrix.length > 0 && (
				<Card className="w-full bg-background shadow-sm border overflow-hidden">
					<CardHeader className="pb-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<CardTitle className="text-xl font-bold flex items-center gap-2">
								<Layers className="w-5 h-5 text-gray-500" />
								Variant Matrix Grid
							</CardTitle>
							<p className="text-sm text-muted-foreground mt-1">
								Manage SKU and stock levels for all variations in a unified table.
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<Badge variant="secondary" className="px-3 py-1 text-xs font-semibold">
								{selectedSizes.length} Sizes Selected
							</Badge>
							<Badge variant="secondary" className="px-3 py-1 text-xs font-semibold">
								{availableColors.length} Colors Selected
							</Badge>
						</div>
					</CardHeader>

					<CardContent className="pt-6">
						{/* Color Filter Dropdown */}
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 mb-6">
							<div className="flex items-center gap-3 w-full sm:w-auto">
								<span className="text-sm font-bold text-gray-700 whitespace-nowrap">Editing Color Variant:</span>
								<Select
									value={selectedFilterColor}
									onValueChange={(val) => setSelectedFilterColor(val)}
								>
									<SelectTrigger className="w-full sm:w-[220px] bg-background">
										<SelectValue placeholder="Select Color" />
									</SelectTrigger>
									<SelectContent>
										{availableColors.map((color) => (
											<SelectItem key={color.id || color._id} value={color.id || color._id}>
												<div className="flex items-center gap-2">
													<div
														className="w-4 h-4 rounded-full border shadow-sm"
														style={{ backgroundColor: color.label }}
													/>
													<span>{color.name || color.label}</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="text-xs text-muted-foreground font-medium">
								Displaying {filteredMatrix.length} variations for the selected color.
							</div>
						</div>

						{/* Bulk Operations Bar */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-xl border border-dashed mb-6">
							{/* Bulk Stock */}
							<div className="flex items-center gap-2 w-full">
								<span className="text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Bulk Quantity:</span>
								<Input
									type="number"
									min="0"
									placeholder="Set qty for all..."
									value={bulkStock}
									onChange={(e) => setBulkStock(e.target.value)}
									className="bg-white max-w-[150px] h-9"
								/>
								<Button size="sm" onClick={handleApplyBulkStock} className="h-9">Apply</Button>
							</div>

							{/* Bulk SKUs */}
							<div className="flex items-center gap-2 w-full md:justify-end">
								<span className="text-xs font-bold text-gray-600 uppercase whitespace-nowrap">SKU Prefix:</span>
								<Input
									type="text"
									placeholder={productId || "Enter prefix..."}
									value={skuPrefix}
									onChange={(e) => setSkuPrefix(e.target.value)}
									className="bg-white max-w-[180px] h-9"
								/>
								<Button size="sm" variant="outline" onClick={handleRegenerateSKUs} className="h-9 flex items-center gap-1">
									<RefreshCw className="w-3.5 h-3.5" />
									Regenerate
								</Button>
							</div>
						</div>

						{/* Grid Table */}
						<div className="overflow-x-auto border rounded-xl bg-white shadow-inner">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Size</th>
										<th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Color</th>
										<th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU Code *</th>
										<th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Qty</th>
										<th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Images</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100">
									{filteredMatrix.map((row, idx) => (
										<tr key={idx} className="hover:bg-gray-50/50 transition-colors">
											<td className="px-6 py-4 whitespace-nowrap">
												<Badge variant="outline" className="px-2.5 py-1 text-sm font-bold bg-muted/20">
													{row.sizeLabel}
												</Badge>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-2.5">
													<div
														className="w-5 h-5 rounded-full border shadow-sm shrink-0"
														style={{ backgroundColor: row.colorLabel }}
													/>
													<span className="text-sm font-semibold text-gray-700">
														{row.colorName || row.colorLabel}
													</span>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<Input
													type="text"
													value={row.sku}
													onChange={(e) => handleMatrixSkuChange(row.sizeLabel, row.colorId, e.target.value)}
													className="max-w-[240px] h-9 font-mono text-sm bg-transparent border-gray-200 hover:border-gray-300 focus-visible:bg-white"
													required
													placeholder="SKU-CODE"
												/>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-2 bg-muted/20 p-0.5 rounded-lg border w-fit">
													<Button
														variant="ghost"
														size="icon"
														onClick={(e) => {
															e.preventDefault();
															handleMatrixQuantityChange(row.sizeLabel, row.colorId, row.quantity - 1);
														}}
														className="h-8 w-8 rounded-md hover:bg-white"
														disabled={row.quantity <= 0}
													>
														<Minus className="w-3.5 h-3.5" />
													</Button>
													<Input
														type="number"
														min="0"
														value={row.quantity}
														onChange={(e) => handleMatrixQuantityChange(row.sizeLabel, row.colorId, e.target.value)}
														className="w-16 text-center border-none h-8 p-0 bg-transparent focus-visible:ring-0 font-semibold font-mono"
													/>
													<Button
														variant="ghost"
														size="icon"
														onClick={(e) => {
															e.preventDefault();
															handleMatrixQuantityChange(row.sizeLabel, row.colorId, row.quantity + 1);
														}}
														className="h-8 w-8 rounded-md hover:bg-white"
													>
														<Plus className="w-3.5 h-3.5" />
													</Button>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right">
												<Badge variant="secondary" className="px-2.5 py-1 text-xs">
													{row.images?.length || 0} Images
												</Badge>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default SizeSelector;
