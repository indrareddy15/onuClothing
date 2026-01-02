import React from 'react';

function Avatar({ className = '', children, ...props }) {
  return (
    <div
      className={`relative flex w-8 h-8 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function AvatarImage({ className = '', src, alt, onLoadingStatusChange, ...props }) {
  const [imageStatus, setImageStatus] = React.useState('loading');

  const handleLoad = () => {
    setImageStatus('loaded');
    if (onLoadingStatusChange) onLoadingStatusChange('loaded');
  };

  const handleError = () => {
    setImageStatus('error');
    if (onLoadingStatusChange) onLoadingStatusChange('error');
  };

  if (imageStatus === 'error') {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`aspect-square w-full h-full object-cover ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
}

function AvatarFallback({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-gray-200 flex w-full h-full items-center justify-center rounded-full text-gray-600 font-medium ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
