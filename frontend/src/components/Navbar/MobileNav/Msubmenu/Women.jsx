import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import {
  Indian_FusionWear, Western_Wear, Shop_Occassion,
  WFootwear, Sports_ActiveWear, Lingerie_Sleepwear,
  Beauty_Personal_Care,
} from '../../NavbarSub';

const MWoMen = ({ WoMen, fun1, fun2 }) => {
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
    <div className={`w-full ${WoMen}`}>
      <SubMenuItem
        title="Indian & Fusion Wear"
        isActive={activeSection === 'Indian'}
        onClick={() => toggleSection('Indian')}
      >
        {Indian_FusionWear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <LinkItem title="Belts, Scarves & More" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Watches & Wearables" onClick={() => { fun1(); fun2(); }} />

      <SubMenuItem
        title="Western Wear"
        isActive={activeSection === 'Western'}
        onClick={() => toggleSection('Western')}
      >
        {Western_Wear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Shop By Occasion"
        isActive={activeSection === 'Occasion'}
        onClick={() => toggleSection('Occasion')}
      >
        {Shop_Occassion.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <LinkItem title="Plus Size" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Maternity" onClick={() => { fun1(); fun2(); }} />
      <LinkItem title="Sunglasses & Frames" onClick={() => { fun1(); fun2(); }} />

      <SubMenuItem
        title="Footwear"
        isActive={activeSection === 'Footwear'}
        onClick={() => toggleSection('Footwear')}
      >
        {WFootwear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Sports & Active Wear"
        isActive={activeSection === 'Sports'}
        onClick={() => toggleSection('Sports')}
      >
        {Sports_ActiveWear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Lingerie & Sleepwear"
        isActive={activeSection === 'Lingerie'}
        onClick={() => toggleSection('Lingerie')}
      >
        {Lingerie_Sleepwear.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>

      <SubMenuItem
        title="Beauty & Personal Care"
        isActive={activeSection === 'Beauty'}
        onClick={() => toggleSection('Beauty')}
      >
        {Beauty_Personal_Care.map((data, index) => (
          <LinkItem key={index} title={data.title} onClick={() => { fun1(); fun2(); }} />
        ))}
      </SubMenuItem>
    </div>
  );
};

export default MWoMen;