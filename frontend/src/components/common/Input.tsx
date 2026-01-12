/**
 * 汎用入力コンポーネント
 */

import React, { forwardRef, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'floating';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      variant = 'default',
      className = '',
      id,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // フローティングラベルバリアント
    if (variant === 'floating') {
      return (
        <div className={`${fullWidth ? 'w-full' : ''}`}>
          <div className="relative">
            <input
              ref={ref}
              id={inputId}
              placeholder=" "
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`
                peer w-full px-4 pt-6 pb-2 text-sm
                bg-gray-50 border-2 rounded-xl
                transition-all duration-200 ease-out
                placeholder-transparent
                focus:outline-none focus:bg-white
                disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
                ${
                  hasError
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                }
                ${className}
              `}
              {...props}
            />
            <label
              htmlFor={inputId}
              className={`
                absolute left-4 top-4 text-sm transition-all duration-200 ease-out pointer-events-none
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-xs peer-focus:font-medium
                peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs
                ${
                  hasError
                    ? 'text-red-500 peer-focus:text-red-600'
                    : 'text-gray-500 peer-focus:text-brand-600'
                }
              `}
            >
              {label}
            </label>
          </div>
          {(error || helperText) && (
            <p className={`mt-2 text-sm flex items-center gap-1.5 ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
              {hasError && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {error || helperText}
            </p>
          )}
        </div>
      );
    }

    // フィルドバリアント
    if (variant === 'filled') {
      return (
        <div className={`${fullWidth ? 'w-full' : ''}`}>
          {label && (
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
          )}
          <div className="relative group">
            {leftIcon && (
              <div className={`
                absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none
                transition-colors duration-200
                ${isFocused ? 'text-brand-500' : 'text-gray-400'}
              `}>
                {leftIcon}
              </div>
            )}
            <input
              ref={ref}
              id={inputId}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`
                block w-full rounded-xl border-0
                bg-gray-100 transition-all duration-200 ease-out
                focus:outline-none focus:bg-white focus:ring-2
                disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60
                ${leftIcon ? 'pl-12' : 'pl-4'}
                ${rightIcon ? 'pr-12' : 'pr-4'}
                py-3.5 text-sm
                ${
                  hasError
                    ? 'ring-2 ring-red-500 bg-red-50 focus:ring-red-500'
                    : 'focus:ring-brand-500'
                }
                ${className}
              `}
              {...props}
            />
            {rightIcon && (
              <div className={`
                absolute inset-y-0 right-0 pr-4 flex items-center
                transition-colors duration-200
                ${isFocused ? 'text-brand-500' : 'text-gray-400'}
              `}>
                {rightIcon}
              </div>
            )}
          </div>
          {(error || helperText) && (
            <p className={`mt-2 text-sm flex items-center gap-1.5 ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
              {hasError && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {error || helperText}
            </p>
          )}
        </div>
      );
    }

    // デフォルトバリアント
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className={`
              absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none
              transition-colors duration-200
              ${isFocused ? 'text-brand-500' : 'text-gray-400'}
            `}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              block w-full rounded-xl border-2
              bg-white transition-all duration-200 ease-out
              focus:outline-none focus:ring-4
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
              ${leftIcon ? 'pl-12' : 'pl-4'}
              ${rightIcon ? 'pr-12' : 'pr-4'}
              py-3 text-sm
              ${
                hasError
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-gray-200 hover:border-gray-300 focus:border-brand-500 focus:ring-brand-500/10'
              }
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className={`
              absolute inset-y-0 right-0 pr-4 flex items-center
              transition-colors duration-200
              ${isFocused ? 'text-brand-500' : 'text-gray-400'}
            `}>
              {rightIcon}
            </div>
          )}
          {/* フォーカス時のボーダーグロー */}
          <div className={`
            absolute inset-0 rounded-xl pointer-events-none
            transition-opacity duration-200
            ${isFocused && !hasError ? 'opacity-100' : 'opacity-0'}
          `} style={{
            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)'
          }} />
        </div>
        {(error || helperText) && (
          <p className={`mt-2 text-sm flex items-center gap-1.5 animate-fade-in ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
            {hasError && (
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
