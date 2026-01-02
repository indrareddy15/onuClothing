import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BulletPointView = ({ points, onUpdate }) => {
	const [editingIndex, setEditingIndex] = useState(null);
	const [editValues, setEditValues] = useState({ header: '', body: '' });

	if (!points || points.length === 0) return null;

	const handleEditClick = (index, point) => {
		setEditingIndex(index);
		setEditValues({ header: point.header, body: point.body });
	};

	const handleCancelEdit = () => {
		setEditingIndex(null);
		setEditValues({ header: '', body: '' });
	};

	const handleSaveEdit = (index) => {
		if (onUpdate) {
			const updatedPoints = [...points];
			updatedPoints[index] = editValues;
			onUpdate(updatedPoints);
		}
		setEditingIndex(null);
	};

	return (
		<Card className="w-full">
			<CardHeader className="pb-3 border-b">
				<CardTitle className="text-lg font-medium text-muted-foreground flex items-center gap-2">
					<CheckCircle2 className="w-5 h-5" />
					Product Highlights
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<div className={`${points.length > 3 ? 'max-h-[300px] overflow-y-auto custom-scrollbar' : ''}`}>
					<div className="divide-y">
						{points.map((point, index) => (
							<div key={index} className="grid grid-cols-[1fr,2fr,auto] gap-4 p-4 hover:bg-muted/20 transition-colors items-start">
								{editingIndex === index ? (
									<>
										<Input
											value={editValues.header}
											onChange={(e) => setEditValues({ ...editValues, header: e.target.value })}
											className="font-semibold text-sm"
										/>
										<Textarea
											value={editValues.body}
											onChange={(e) => setEditValues({ ...editValues, body: e.target.value })}
											className="text-sm min-h-[60px]"
										/>
										<div className="flex gap-1">
											<Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleSaveEdit(index)}>
												<Check className="w-4 h-4" />
											</Button>
											<Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleCancelEdit}>
												<X className="w-4 h-4" />
											</Button>
										</div>
									</>
								) : (
									<>
										<div className="font-semibold text-sm text-foreground pt-1">
											{point.header}
										</div>
										<div className="text-sm text-muted-foreground leading-relaxed pt-1">
											{point.body}
										</div>
										<Button
											size="icon"
											variant="ghost"
											className="h-8 w-8 text-muted-foreground hover:text-primary"
											onClick={() => handleEditClick(index, point)}
										>
											<Pencil className="w-3.5 h-3.5" />
										</Button>
									</>
								)}
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default BulletPointView;
