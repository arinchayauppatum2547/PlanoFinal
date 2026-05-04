import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'dark' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  icon,
  className = ''
}: ButtonProps) {
  const baseStyles = "font-['Inter:Semi_Bold',sans-serif] font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2";

  const variantStyles = {
    primary: 'bg-[#b0e04f] text-black hover:bg-[#9dca3f]',
    secondary: 'bg-white/70 text-[#006055] border border-[rgba(0,96,85,0.2)] hover:bg-white/90',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
    success: 'bg-[#006055] text-white hover:bg-[#005047]',
    dark: 'bg-[#1e5a4d] text-white hover:bg-[#006055]',
    ghost: 'bg-transparent text-[#006055] hover:bg-[rgba(0,96,85,0.1)]'
  };

  const sizeStyles = {
    small: 'px-3 py-2 text-[13px]',
    medium: 'px-4 py-3 text-[15px]',
    large: 'px-6 py-3.5 text-[15px]'
  };

  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
