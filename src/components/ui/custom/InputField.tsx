
import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, User, AlertTriangle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  validation?: {
    isValid: boolean;
    message?: string;
    showValidation: boolean;
  };
}

const InputField = ({
  label,
  error,
  icon,
  showPasswordToggle = false,
  validation,
  className,
  ...props
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  useEffect(() => {
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [error]);

  const inputType = showPasswordToggle 
    ? (showPassword ? 'text' : 'password') 
    : props.type;

  return (
    <div className="mb-4">
      <label 
        htmlFor={props.id} 
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className={cn(
        "relative",
        shake && "animate-shake"
      )}>
        <input
          ref={inputRef}
          {...props}
          type={inputType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "input-field",
            error && "input-field-error",
            className
          )}
        />
        
        {/* Icon */}
        {icon && (
          <div className={cn(
            "input-icon left-3 transition-opacity",
            isFocused ? "opacity-100" : "opacity-50"
          )}>
            {icon}
          </div>
        )}
        
        {/* Validation Icon */}
        {validation && validation.showValidation && (
          <div className={cn(
            "input-icon transition-all duration-300",
            validation.isValid ? "text-green-500 animate-scale-in" : "text-yellow-500 animate-shake"
          )}>
            {validation.isValid ? (
              <Check size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}
          </div>
        )}
        
        {/* Password Toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="input-icon focus:outline-none"
          >
            {showPassword ? (
              <EyeOff size={18} className="animate-rotate-90" />
            ) : (
              <Eye size={18} className="animate-rotate-90" />
            )}
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-1 text-sm text-red-600 animate-slide-in-down flex items-center gap-1.5">
          <AlertTriangle size={14} className="animate-pulse" />
          {error}
        </div>
      )}
      
      {/* Validation Message */}
      {validation && validation.showValidation && validation.message && !error && (
        <div className={cn(
          "mt-1 text-sm flex items-center gap-1.5 animate-slide-in-down",
          validation.isValid ? "text-green-600" : "text-yellow-600"
        )}>
          {validation.isValid ? <Check size={14} /> : <AlertTriangle size={14} />}
          {validation.message}
        </div>
      )}
    </div>
  );
};

export default InputField;
