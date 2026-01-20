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
      {/* <SubMenuItem
        title="Topwear"
        isActive={activeSection === 'Topwear'}
        onClick={() => toggleSection('Topwear')}
      >
        {Topwear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => handleCategoryNavigation('Topwear')} />
        ))}
      </SubMenuItem> */}

      {/* <SubMenuItem
        title="Indian & Festive Wear"
        isActive={activeSection === 'Indian'}
        onClick={() => toggleSection('Indian')}
      >
        {indian_festive.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem> */}

      {/* <SubMenuItem
        title="Bottomwear"
        isActive={activeSection === 'Bottomwear'}
        onClick={() => toggleSection('Bottomwear')}
      >
        {bottomwear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => handleCategoryNavigation('Bottomwear')} />
        ))}
      </SubMenuItem> */}

      {/* <SubMenuItem
        title="Innerwear & Sleepwear"
        isActive={activeSection === 'Innerwear'}
        onClick={() => toggleSection('Innerwear')}
      >
        {Innerwear_Sleepwear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem> */}

      {/* <LinkItem title="Plus Size" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Footwear" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Personal Care & Grooming" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Sunglasses & Frames" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Watches" onClick={() => { fun1(); fun2(); }} /> */}
      {/* 
      <SubMenuItem
        title="Sports & Active Wear"
        isActive={activeSection === 'Sports'}
        onClick={() => toggleSection('Sports')}
      >
        {Sports_Active_Wear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem> */}

      {/* <SubMenuItem
        title="Gadgets"
        isActive={activeSection === 'Gadgets'}
        onClick={() => toggleSection('Gadgets')}
      >
        {Gadgets.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem> */}

      {/* <SubMenuItem
        title="Fashion Accessories"
        isActive={activeSection === 'Fashion'}
        onClick={() => toggleSection('Fashion')}
      >
        {Fashion_Accessories.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem> */}

      {/* <LinkItem title="Bags & Backpacks" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Luggages & Trolleys" onClick={() => { fun1(); fun2(); }} /> */}
    </div>
  );
};

export default MMen;