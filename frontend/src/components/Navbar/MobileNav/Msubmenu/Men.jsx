import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Topwear, indian_festive, bottomwear,
  Innerwear_Sleepwear, Footwear,
  Sports_Active_Wear, Gadgets, Fashion_Accessories,
} from '../../NavbarSub';

const MMen = ({ Men, fun1, fun2 }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleCategoryNavigation = (category, gender = 'men') => {
    const queryParams = new URLSearchParams();
    queryParams.set('category', category.toLowerCase());
    queryParams.set('gender', gender.toLowerCase());

    navigate(`/products?${queryParams.toString()}`);
    fun1(); // Close menu
  };

  const handleSubcategoryNavigation = (subcategory, category, gender = 'men') => {
    const queryParams = new URLSearchParams();
    queryParams.set('subcategory', subcategory.toLowerCase());
    queryParams.set('category', category.toLowerCase());
    queryParams.set('gender', gender.toLowerCase());

    navigate(`/products?${queryParams.toString()}`);
    fun1(); // Close menu
  };

  const SubMenuItem = ({ title, isActive, onClick, children }) => (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        {title}
        {isActive ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isActive && (
        <div className="bg-gray-50 pl-4 pb-2">
          {children}
        </div>
      )}
    </div>
  );

  const LinkItem = ({ title, onClick }) => (
    <button
      className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 transition-colors text-left"
      onClick={onClick}
    >
      {title}
    </button>
  );

  return (
    <div className={`w-full ${Men}`}>
      <SubMenuItem
        title="Topwear"
        isActive={activeSection === 'Topwear'}
        onClick={() => toggleSection('Topwear')}
      >
        {Topwear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => handleSubcategoryNavigation(data.title, 'Topwear')} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Indian & Festive Wear"
        isActive={activeSection === 'Indian'}
        onClick={() => toggleSection('Indian')}
      >
        {indian_festive.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => handleSubcategoryNavigation(data.title, 'Indian & Festive Wear')} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Bottomwear"
        isActive={activeSection === 'Bottomwear'}
        onClick={() => toggleSection('Bottomwear')}
      >
        {bottomwear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => handleSubcategoryNavigation(data.title, 'Bottomwear')} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Innerwear & Sleepwear"
        isActive={activeSection === 'Innerwear'}
        onClick={() => toggleSection('Innerwear')}
      >
        {Innerwear_Sleepwear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => handleSubcategoryNavigation(data.title, 'Innerwear & Sleepwear')} />
        ))}
      </SubMenuItem>

      <LinkItem title="Plus Size" onClick={() => handleCategoryNavigation('Plus Size')} />
      <LinkItem title="Footwear" onClick={() => handleCategoryNavigation('Footwear')} />
      <LinkItem title="Personal Care & Grooming" onClick={() => handleCategoryNavigation('Personal Care & Grooming')} />
      <LinkItem title="Sunglasses & Frames" onClick={() => handleCategoryNavigation('Sunglasses & Frames')} />
      <LinkItem title="Watches" onClick={() => handleCategoryNavigation('Watches')} />

      <SubMenuItem
        title="Sports & Active Wear"
        isActive={activeSection === 'Sports'}
        onClick={() => toggleSection('Sports')}
      >
        {Sports_Active_Wear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => handleSubcategoryNavigation(data.title, 'Sports & Active Wear')} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Gadgets"
        isActive={activeSection === 'Gadgets'}
        onClick={() => toggleSection('Gadgets')}
      >
        {Gadgets.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => handleSubcategoryNavigation(data.title, 'Gadgets')} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Fashion Accessories"
        isActive={activeSection === 'Fashion'}
        onClick={() => toggleSection('Fashion')}
      >
        {Fashion_Accessories.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => handleSubcategoryNavigation(data.title, 'Fashion Accessories')} />
        ))}
      </SubMenuItem>

      <LinkItem title="Bags & Backpacks" onClick={() => handleCategoryNavigation('Bags & Backpacks')} />
      <LinkItem title="Luggages & Trolleys" onClick={() => handleCategoryNavigation('Luggages & Trolleys')} />
    </div>
  );
};

export default MMen;