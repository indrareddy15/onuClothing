import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const CustomSelect = ({ controlItems, setChangeData,defaultValue = ""}) => {
    const[inputValue,setInputValue] = useState('')
    const[value,setValue] = useState('')
    const handelSetActiveValue = (e)=>{
        // setChangeData(e.target.value);
        setValue(e);
        setInputValue(e);
    }
    useEffect(()=>{
        // console.log("Value: ",value,inputValue);
        setChangeData(value || inputValue)
    },[value,inputValue])

    return (
    <div className="space-y-4">
        <Select onValueChange={handelSetActiveValue} value={value}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md">
                <SelectValue placeholder={controlItems.label || defaultValue || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
                {controlItems?.options?.length > 0 &&
                    controlItems.options.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                            {option.label}
                        </SelectItem>
                    ))}
            </SelectContent>
        </Select>
    </div>
    );
  };

export default CustomSelect