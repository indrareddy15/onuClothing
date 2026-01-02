import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import {
  Boys_Clothing, Girls_Clothing, KFootwear,
  Toys, Infants,
} from '../../NavbarSub.js';

const MKids = ({ MKids, fun1, fun2 }) => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
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
    <div className={`w-full ${MKids}`}>
      <SubMenuItem
        title="Boys Clothing"
        isActive={activeSection === 'Boys'}
        onClick={() => toggleSection('Boys')}
      >
        {Boys_Clothing.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Girls Clothing"
        isActive={activeSection === 'Girls'}
        onClick={() => toggleSection('Girls')}
      >
        {Girls_Clothing.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Footwear"
        isActive={activeSection === 'Footwear'}
        onClick={() => toggleSection('Footwear')}
      >
        {KFootwear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Toys"
        isActive={activeSection === 'Toys'}
        onClick={() => toggleSection('Toys')}
      >
        {Toys.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Infants"
        isActive={activeSection === 'Infants'}
        onClick={() => toggleSection('Infants')}
      >
        {Infants.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>
    </div>
  );
};

export default MKids;