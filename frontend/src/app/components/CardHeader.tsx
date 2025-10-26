"use client";

import React from "react";

type CardHeaderProps = {
  children: React.ReactNode;
  variant?: 'dark' | 'yellow' | 'blue';
  className?: string;
};

export default function CardHeader({
  children,
  variant = 'dark',
  className = ""
}: CardHeaderProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'yellow':
        return 'bg-axiom-yellow-button text-axiom-text-primary';
      case 'blue':
        return 'bg-axiom-graph-blue text-white';
      case 'dark':
      default:
        return 'bg-axiom-dark-button text-white';
    }
  };

  return (
    <div className={`px-8 py-4 rounded-t-3xl ${getVariantStyles()} ${className}`}>
      {children}
    </div>
  );
}

