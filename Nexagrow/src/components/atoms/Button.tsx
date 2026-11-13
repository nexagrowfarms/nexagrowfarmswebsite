'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button spans full width */
  fullWidth?: boolean;
  /** Content to render inside the button */
  children: React.ReactNode;
}

/**
 * Reusable Button atom following the leaf theme.
 * Used across the application for consistent styling.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  style,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';
  
  const variantStyles = {
    primary: 'text-white shadow-lg',
    secondary: 'border-2',
    outline: 'border-2 bg-transparent',
    ghost: 'bg-transparent hover:bg-black/5',
  };

  const sizeStyles = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };

  const variantInlineStyles = variant === 'primary' ? {
    backgroundColor: 'var(--leaf-600)',
  } : variant === 'secondary' || variant === 'outline' ? {
    borderColor: 'var(--leaf-600)',
    color: 'var(--leaf-600)',
  } : {};

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full flex justify-center items-center' : ''} ${className}`}
      style={{ ...variantInlineStyles, ...style }}
      onMouseEnter={(e) => {
        if (variant === 'primary' && !props.disabled) {
          e.currentTarget.style.backgroundColor = 'var(--leaf-700)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--leaf-600)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
