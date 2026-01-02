import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { useToast } from "@/hooks/use-toast";

const BulletPointItem = ({ point, index, onUpdate, onRemove }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editValues, setEditValues] = useState({ header: point.header, body: point.body });

	const handleSave = () => {
		onUpdate(index, "header", editValues.header);
		onUpdate(index, "body", editValues.body);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditValues({ header: point.header, body: point.body });
		setIsEditing(false);
	};

	return (
		<div className="grid gap-4 md:grid-cols-[1fr,2fr,auto] items-start">
			{isEditing ? (
				<>
					<Input
						value={editValues.header}
						onChange={(e) => setEditValues({ ...editValues, header: e.target.value })}
						className="bg-background"
					/>
					<Textarea
						value={editValues.body}
						onChange={(e) => setEditValues({ ...editValues, body: e.target.value })}
						rows={1}
						className="bg-background resize-none min-h-[40px]"
					/>
					<div className="flex gap-1">
						<Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={handleSave}>
							<Check className="w-4 h-4" />
						</Button>
						<Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleCancel}>
							<X className="w-4 h-4" />
						</Button>
					</div>
				</>
			) : (
				<>
					<div className="py-2 px-2 text-sm font-medium">{point.header}</div>
					<div className="py-2 px-2 text-sm text-muted-foreground">{point.body}</div>
					<div className="flex gap-1">
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8 text-muted-foreground hover:text-primary"
							onClick={() => setIsEditing(true)}
						>
							<Pencil className="w-3.5 h-3.5" />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
							onClick={onRemove}
						>
							<Trash2 className="w-3.5 h-3.5" />
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

const BulletPointsForm = ({ onChange, defaultPoinst = [] }) => {
	const [bulletPoints, setBulletPoints] = useState(defaultPoinst);
	const [newPoint, setNewPoint] = useState({ header: "", body: "" });
	const { toast } = useToast();

	useEffect(() => {
		if (defaultPoinst && defaultPoinst.length > 0) {
			setBulletPoints(defaultPoinst);
		}
	}, [defaultPoinst]);

	const handleInputChange = (index, field, value) => {
		const updatedPoints = [...bulletPoints];
		updatedPoints[index][field] = value;
		setBulletPoints(updatedPoints);
		const filletedData = updatedPoints.filter(b => b.header !== '' && b.body !== "");
		if (onChange) {
			onChange(filletedData);
		}
	};

	const handleNewPointChange = (field, value) => {
		setNewPoint(prev => ({ ...prev, [field]: value }));
	};

	const addBulletPoint = () => {
		if (!newPoint.header.trim() || !newPoint.body.trim()) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Please fill in both Header and Description"
			});
			return;
		}
		const updatedPoints = [...bulletPoints, newPoint];
		setBulletPoints(updatedPoints);
		setNewPoint({ header: "", body: "" });

		if (onChange) {
			onChange(updatedPoints);
		}
	};

	const removeBulletPoint = (index) => {
		const updatedPoints = bulletPoints.filter((_, i) => i !== index);
		setBulletPoints(updatedPoints);
		const filletedData = updatedPoints.filter(b => b.header !== '' && b.body !== "");
		if (onChange) {
			onChange(filletedData);
		}
	};

	return (
		<div className="space-y-8">
			{/* Add New Bullet Point Section */}
			<div className="space-y-4 p-4 border rounded-xl bg-muted/20">
				<h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Add New Highlight</h3>
				<div className="grid gap-4 md:grid-cols-[1fr,2fr,auto] items-end">
					<div className="space-y-2">
						<Label className="text-xs font-medium">Header</Label>
						<Input
							value={newPoint.header}
							onChange={(e) => handleNewPointChange("header", e.target.value)}
							placeholder="e.g., Premium Material"
							className="bg-background"
						/>
					</div>
					<div className="space-y-2">
						<Label className="text-xs font-medium">Description</Label>
						<Textarea
							value={newPoint.body}
							onChange={(e) => handleNewPointChange("body", e.target.value)}
							placeholder="Describe the feature..."
							rows={1}
							className="bg-background resize-none min-h-[40px]"
						/>
					</div>
					<div className="pb-0.5">
						<Button
							type="button"
							onClick={addBulletPoint}
							className="bg-black hover:bg-gray-800 text-white shadow-md"
						>
							<Plus className="w-4 h-4 mr-2" />
							Add
						</Button>
					</div>
				</div>
			</div>

			{/* List Section */}
			{bulletPoints.length > 0 && (
				<div className="space-y-2">
					<div className="grid grid-cols-[1fr,2fr,auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
						<div>Header</div>
						<div>Description</div>
						<div className="w-[70px]">Actions</div>
					</div>

					<div className={`${bulletPoints.length > 3 ? 'max-h-[400px] overflow-y-auto custom-scrollbar' : ''} space-y-2 pr-2`}>
						{bulletPoints.map((point, index) => (
							<Card key={index} className="group hover:border-primary/50 transition-colors">
								<CardContent className="p-3">
									<BulletPointItem
										point={point}
										index={index}
										onUpdate={(idx, field, val) => handleInputChange(idx, field, val)}
										onRemove={() => removeBulletPoint(index)}
									/>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default BulletPointsForm;
