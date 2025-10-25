import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'yellow' | 'white';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export default function Button({ 
  children, 
  variant = 'white', 
  size = 'md',
  href,
  onClick,
  className = "",
  disabled = false
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'yellow':
        return 'bg-axiom-yellow-button text-axiom-text-primary hover:bg-axiom-yellow-hover';
      case 'white':
      default:
        return 'bg-white text-axiom-text-primary hover:bg-axiom-bg-graph-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'md':
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const baseStyles = `inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${getVariantStyles()} ${getSizeStyles()}`;
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyles} ${disabledStyles} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
}
