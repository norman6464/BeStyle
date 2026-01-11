/**
 * テキストエリアコンポーネント
 */

import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  showCount?: boolean;
  maxLength?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      showCount = false,
      maxLength,
      className = '',
      id,
      value,
      ...props
    },
    ref
  ) => {
    const textAreaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={textAreaId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={textAreaId}
            value={value}
            maxLength={maxLength}
            className={`
              block w-full rounded-lg border transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-gray-100 disabled:cursor-not-allowed
              px-4 py-2.5 text-sm resize-none
              ${
                hasError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        <div className="flex justify-between mt-1">
          <div>
            {(error || helperText) && (
              <p className={`text-sm ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
                {error || helperText}
              </p>
            )}
          </div>
          {showCount && maxLength && (
            <p
              className={`text-sm ${
                currentLength >= maxLength ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
