import React, { useState, useRef, useEffect } from 'react';
import { Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

function InputOTP({
  className = '',
  containerClassName = '',
  maxLength = 6,
  value = '',
  onChange,
  disabled = false,
  variant = 'outlined', // 'outlined' | 'standard'
  ...props
}) {
  const [otp, setOtp] = useState(value.split(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    setOtp(value.split(''));
  }, [value]);

  const handleInputChange = (index, val) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (onChange) {
      onChange(newOtp.join(''));
    }

    if (val && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const getVariantStyles = () => {
    if (variant === 'standard') {
      return 'border-0 border-b-2 border-gray-300 rounded-none focus:border-gray-900 focus:ring-0 bg-transparent';
    }
    return 'border border-gray-300 rounded-md focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20';
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 sm:gap-3 w-full',
        disabled && 'opacity-50',
        containerClassName
      )}
      {...props}
    >
      {Array.from({ length: maxLength }, (_, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index] || ''}
          onChange={e => handleInputChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          disabled={disabled}
          className={cn(
            'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-base sm:text-lg md:text-xl font-semibold outline-none transition-all',
            getVariantStyles(),
            disabled && 'cursor-not-allowed',
            className
          )}
        />
      ))}
    </div>
  );
}

function InputOTPGroup({ className = '', children, ...props }) {
  return (
    <div
      className={`flex items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function InputOTPSlot({ className = '', value = '', isActive = false, ...props }) {
  return (
    <div
      className={`relative flex h-9 w-9 items-center justify-center border border-gray-300 text-sm transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md ${isActive ? 'border-gray-900 ring-2 ring-gray-900/20 z-10' : ''} ${className}`}
      {...props}
    >
      {value}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-900 h-4 w-px" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ className = '', ...props }) {
  return (
    <div className={`flex items-center justify-center ${className}`} role="separator" {...props}>
      <Minus className="w-4 h-4" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
