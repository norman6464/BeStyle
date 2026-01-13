/**
 * 汎用ボタンコンポーネント
 */

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-brand-500 to-brand-600 text-white 
    hover:from-brand-600 hover:to-brand-700 
    focus:ring-brand-500 
    disabled:from-brand-300 disabled:to-brand-400
    shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30
    active:scale-[0.98]
  `,
  secondary: `
    bg-gradient-to-r from-gray-600 to-gray-700 text-white 
    hover:from-gray-700 hover:to-gray-800 
    focus:ring-gray-500 
    disabled:from-gray-300 disabled:to-gray-400
    shadow-lg shadow-gray-500/20 hover:shadow-xl hover:shadow-gray-500/25
    active:scale-[0.98]
  `,
  outline: `
    border-2 border-brand-500 text-brand-600 
    hover:bg-brand-50 hover:border-brand-600 
    focus:ring-brand-500 
    disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-transparent
    active:scale-[0.98]
  `,
  ghost: `
    text-gray-600 
    hover:bg-gray-100/80 hover:text-gray-900
    focus:ring-gray-500 
    disabled:text-gray-300 disabled:hover:bg-transparent
    active:scale-[0.98]
  `,
  danger: `
    bg-gradient-to-r from-red-500 to-red-600 text-white 
    hover:from-red-600 hover:to-red-700 
    focus:ring-red-500 
    disabled:from-red-300 disabled:to-red-400
    shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30
    active:scale-[0.98]
  `,
  gradient: `
    bg-gradient-to-r from-brand-500 via-accent-500 to-brand-600 text-white
    hover:from-brand-600 hover:via-accent-600 hover:to-brand-700
    focus:ring-accent-500
    disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-300
    shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-accent-500/30
    active:scale-[0.98]
    bg-[length:200%_auto] animate-gradient-shift
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-base gap-2',
  lg: 'px-7 py-3.5 text-lg gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-xl
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:shadow-none
    transform-gpu
  `;

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
