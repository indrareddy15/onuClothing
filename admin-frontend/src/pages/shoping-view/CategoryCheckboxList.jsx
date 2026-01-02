import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import React from 'react';

const CategoryCheckboxList = ({ selectedCategories, setSelectedCategories }) => {
    const categories = [
        { id: 'men', label: 'Men', },
        { id: 'women', label: 'Women', },
        { id: 'kids', label: 'Kids', },
        { id: 'watch', label: 'Watch', },
    ];

    // Handle checkbox change
    const handleChange = (id, checked) => {
        console.log(`Checkbox with id "${id}" is ${checked ? 'checked' : 'unchecked'}`);
        setSelectedCategories((prev) => ({
            ...prev,
            [id]: checked,
        }));
    };


    return (
        <div className="space-y-2">
            {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                        id={category.id}
                        checked={selectedCategories[category.id] || false}
                        onCheckedChange={(checked) => handleChange(category.id, checked)}
                    />
                    <Label htmlFor={category.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {category.label}
                    </Label>
                </div>
            ))}
        </div>
    );
};

export default CategoryCheckboxList;
