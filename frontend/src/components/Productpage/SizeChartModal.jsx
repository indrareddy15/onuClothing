import React from 'react';
import { Ruler } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";

const SizeChartModal = ({ sizeChartData }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm" className="h-auto p-0 text-gray-500 hover:text-gray-900 hover:bg-transparent">
					<Ruler className="w-4 h-4 mr-1" />
					<span className="text-xs font-semibold underline">SIZE CHART</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Size Chart</DialogTitle>
				</DialogHeader>
				<div className="mt-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Size</TableHead>
								<TableHead>Chest (in)</TableHead>
								<TableHead>Waist (in)</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sizeChartData?.map((item, index) => (
								<TableRow key={index}>
									<TableCell className="font-medium">{item.size}</TableCell>
									<TableCell>{item.chest}</TableCell>
									<TableCell>{item.waist}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default SizeChartModal;