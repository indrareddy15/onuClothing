import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import {
  BedLinenFurnishing, Flooring, Bath,
  LampsLighting, HomeDécor, KitchenTable,
  Storage,
} from '../../NavbarSub.js';

const Mhome = ({ Mhome, fun1, fun2 }) => {
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
    <div className={`w-full ${Mhome}`}>
      <SubMenuItem
        title="Bed Linen & Furnishing"
        isActive={activeSection === 'BedLinen'}
        onClick={() => toggleSection('BedLinen')}
      >
        {BedLinenFurnishing.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Flooring"
        isActive={activeSection === 'Flooring'}
        onClick={() => toggleSection('Flooring')}
      >
        {Flooring.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Bath"
        isActive={activeSection === 'Bath'}
        onClick={() => toggleSection('Bath')}
      >
        {Bath.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <LinkItem title="Lamps & Lighting" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Home Décor" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Kitchen & Table" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Storage" onClick={() => { fun1(); fun2(); }} />
    </div>
  );
};

export default Mhome;