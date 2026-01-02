import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { IoClose } from "react-icons/io5";
const AdminTagInput = ({defaultTags,OnSubmit,isEditing = false}) => {
	// State to store the tags
	const [tags, setTags] = useState(defaultTags || []);
	const [input, setInput] = useState(''); // State for the input field

	// Function to add a new tag
	const addTag = () => {
		if (input && !tags.includes(input)) {
			setTags([...tags, input]);
			setInput(''); // Clear input after adding
		}

	};

	// Function to remove a tag
	const removeTag = (tagToRemove) => {
		setTags(tags.filter(tag => tag !== tagToRemove));
	};
	useEffect(()=> {
		if(OnSubmit){
			OnSubmit(tags);
		}
	},[tags])
	console.log("default Tags",isEditing)
	return (
		<div className="w-full justify-between items-center mx-auto p-4">
			{
				isEditing && <div className="flex flex-wrap gap-2">
					{/* Input field for tags */}
					<Input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && addTag()} // Add tag on Enter key press
						className="border px-4 py-2 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
						placeholder="Add a tag"
					/>

					{/* Button to add the tag */}
					<Button
						onClick={addTag}
						className="text-white px-4 py-2 rounded-lg"
					>
						Add
					</Button>
				</div>
			}
			

			{/* Display the tags */}
			<div className="flex flex-wrap gap-2 mt-4">
				{tags.map((tag, index) => (
					<div
						key={index}
						className="bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2"
					>
						<span>{tag}</span>
						{
							isEditing && <button
								onClick={() => removeTag(tag)}
								className="text-white hover:text-gray-200 p-1 rounded-full transition-colors"
							>
								<IoClose size={20} />
							</button>
						}
						
					</div>
				))}
			</div>
		</div>
	);
};

export default AdminTagInput;
