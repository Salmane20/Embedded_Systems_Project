import React from 'react';

interface ToggleProps {
  isChecked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Toggle: React.FC<ToggleProps> = ({
  isChecked,
  onChange,
  label,
  leftLabel,
  rightLabel,
  disabled = false,
  size = 'md'
}) => {
  const handleChange = () => {
    if (!disabled) {
      onChange(!isChecked);
    }
  };
  
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7'
  };
  
  const thumbSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const translateClasses = {
    sm: 'translate-x-4',
    md: 'translate-x-5',
    lg: 'translate-x-7'
  };
  
  return (
    <div className="flex items-center">
      {leftLabel && (
        <span className="mr-2 text-sm text-gray-700">{leftLabel}</span>
      )}
      
      <button
        type="button"
        className={`
          ${sizeClasses[size]} 
          relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${isChecked ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={handleChange}
        disabled={disabled}
        aria-pressed={isChecked}
      >
        <span className="sr-only">{label || 'Toggle'}</span>
        <span
          className={`
            ${isChecked ? translateClasses[size] : 'translate-x-0'} 
            pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${thumbSizeClasses[size]}
          `}
        />
      </button>
      
      {rightLabel && (
        <span className="ml-2 text-sm text-gray-700">{rightLabel}</span>
      )}
      
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
      )}
    </div>
  );
};

export default Toggle;