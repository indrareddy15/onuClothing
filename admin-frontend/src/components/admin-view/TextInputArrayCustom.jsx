import React, { useState } from 'react'
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { XIcon } from 'lucide-react';

const TextInputArrayCustom = ({onChange,defualt = []}) => {
	const [bulletPoints, setBulletPoints] = useState(defualt);

	const handleInputChange = (index, value) => {
		const updatedPoints = [...bulletPoints];
		updatedPoints[index] = value;
		setBulletPoints(updatedPoints);
		const filletedData = bulletPoints.filter(b => b !== '');
		if (onChange) {
			onChange(filletedData);
		}
	};

	const addBulletPoint = () => {
		setBulletPoints([...bulletPoints, '']);
		const filletedData = bulletPoints.filter(b => b !== '');
		if (onChange) {
			onChange(filletedData);
		}
	};

	const removeBulletPoint = (index) => {
		const updatedPoints = bulletPoints.filter((_, i) => i !== index);
			setBulletPoints(updatedPoints);
			const filletedData = bulletPoints.filter(b => b !== '');
		if (onChange) {
			onChange(filletedData);
		}
	};

	return (
		<form className="w-full h-auto justify-start items-center flex flex-col gap-y-9">
		{bulletPoints && bulletPoints.length > 0 && bulletPoints.map((point, index) => (
			<div key={index} style={{ marginBottom: "10px" }} className="justify-center items-center flex flex-col space-y-2">
				<div className="justify-center items-center max-w-full h-auto">
					<Label className="flex gap-5 flex-row justify-between items-center">
						<span className="text-center font-bold">Point:</span>
						<Textarea
							value={point}
							onChange={(e) =>
								handleInputChange(index, e.target.value)
							}
							placeholder="Enter Data"
							rows="2"
							required
							className="border p-2 rounded-md"
						/>
					</Label>
				</div>
				<Button
					type="button"
					className="w-auto justify-center items-center flex-row flex h-auto"
					onClick={() => removeBulletPoint(index)}
				>
					Remove Point <XIcon className="w-full h-full" />
				</Button>
			</div>
		))}
		<Button
			type="button"
			className="bg-slate-800 font-bold justify-center items-center w-full space-x-8 h-auto p-2"
			onClick={addBulletPoint}
		>
			Add Point
		</Button>
		</form>
	);
}

export default TextInputArrayCustom
