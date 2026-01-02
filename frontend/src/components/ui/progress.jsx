import React from 'react';

function Progress({ className = '', value = 0, ...props }) {
  const progressValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
      {...props}
    >
      <div
        className="h-full bg-gray-900 transition-all duration-300 ease-in-out"
        style={{ width: `${progressValue}%` }}
      />
    </div>
  );
}

export { Progress };
