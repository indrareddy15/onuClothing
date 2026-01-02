import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import {
  Makeup, SkincareBathBody, Haircare,
  Fragrances, HairStraightener, MenGrooming,
  BeautyGiftMakeupSet,
} from '../../NavbarSub.js';

const Mbeauty = ({ Mbeauty, fun1, fun2 }) => {
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
    <div className={`w-full ${Mbeauty}`}>
      <SubMenuItem
        title="Makeup"
        isActive={activeSection === 'Makeup'}
        onClick={() => toggleSection('Makeup')}
      >
        {Makeup.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <LinkItem title="Skincare, Bath & Body" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Haircare" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Fragrances" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Appliances" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Men's Grooming" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Beauty Gift & Makeup Set" onClick={() => { fun1(); fun2(); }} />
    </div>
  );
};

export default Mbeauty;