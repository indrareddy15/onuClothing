import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dropdown = ({ items, GetAdminSideBarMenuIcon }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const toggleItems = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-full" onClick={(e) => {
            e.preventDefault();
            toggleItems();
        }}>
            <div className={`flex justify-between items-center px-3 py-2.5 rounded-md transition-all duration-200 cursor-pointer ${isOpen ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
                <div className="flex items-center gap-3">
                    <GetAdminSideBarMenuIcon id={items.id} />
                    <span className='text-base font-semibold'>{items?.label || "No Label"}</span>
                </div>
                <ChevronRight className={`transition-all ${isOpen ? "rotate-90" : ""} duration-300`} size={18} />
            </div>

            {isOpen && (
                <div className="w-full mt-1 ml-9">
                    {items?.dropDownView.map((d, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(d?.path);
                            }}
                            className={`flex w-full text-left px-3 py-2 rounded-md mb-1 transition-all duration-200 ${window.location.href.includes(d?.path)
                                    ? "bg-gray-500 text-gray-50"
                                    : "hover:bg-gray-300 text-gray-700"
                                }`}
                        >
                            <span className="text-sm font-normal">{d?.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
