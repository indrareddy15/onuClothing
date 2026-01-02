import React, { useState } from 'react';

function Popover({ children, open, onOpenChange, ...props }) {
  const [isOpen, setIsOpen] = useState(open || false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onOpenChange) onOpenChange(newState);
  };

  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, onToggle: handleToggle })
      )}
    </div>
  );
}

function PopoverTrigger({ children, onToggle, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center ${className}`}
      onClick={onToggle}
      {...props}
    >
      {children}
    </button>
  );
}

function PopoverContent({ children, isOpen, className = '', align = 'center', ...props }) {
  if (!isOpen) return null;

  const alignClasses = {
    center: 'left-1/2 transform -translate-x-1/2',
    start: 'left-0',
    end: 'right-0'
  };

  return (
    <div
      className={`absolute top-full mt-2 z-50 w-72 rounded-md border bg-white p-4 shadow-lg ${alignClasses[align]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function PopoverAnchor({ children, className = '', ...props }) {
  return (
    <div className={`inline-block ${className}`} {...props}>
      {children}
    </div>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
