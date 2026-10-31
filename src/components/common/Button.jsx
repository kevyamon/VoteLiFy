import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon = null,
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm';

  const variants = {
    primary:
      'bg-brand-red hover:bg-brand-red-hover text-white focus:ring-brand-red/50 shadow-glow/30',
    secondary:
      'bg-brand-blue hover:bg-brand-blue-hover text-white focus:ring-brand-blue/50',
    outline:
      'border-2 border-slate-200 hover:border-slate-300 text-content-body hover:bg-surface-subtle focus:ring-slate-300',
    ghost:
      'text-content-body hover:bg-surface-subtle hover:text-content-title shadow-none focus:ring-slate-200',
    danger:
      'bg-status-danger hover:bg-red-700 text-white focus:ring-status-danger/50',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]', // Garantit la zone tactile 44px
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[48px]',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
