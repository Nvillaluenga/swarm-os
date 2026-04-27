import React from 'react';

interface CardProps {
  children: React.ReactNode;
  shadowColor?: 'default' | 'neon' | 'error';
  bgHue?: 'default' | 'error';
  className?: string;
  noPadding?: boolean;
}

export default function Card({ children, shadowColor = 'default', bgHue = 'default', className = '', noPadding = false }: CardProps) {
  const shadowClass = {
    default: 'brutalist-shadow',
    neon: 'brutalist-shadow-neon',
    error: 'brutalist-shadow-error',
  }[shadowColor];

  const hueClass = {
    default: 'bg-secondary-container',
    error: 'bg-error-container',
  }[bgHue];

  return (
    <section className={`glass-panel border-4 border-primary relative overflow-hidden ${shadowClass} ${noPadding ? '' : 'p-6 flex flex-col gap-4'} ${className}`}>
      {/* Decorative BG Element */}
      <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-50 blur-3xl mix-blend-multiply ${hueClass}`}></div>
      <div className="z-10 flex flex-col h-full">
        {children}
      </div>
    </section>
  );
}
