import React from "react";

type CTAButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
};

export default function CTAButton({ children, href = "#", className = "" }: CTAButtonProps) {
  const base = "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  return (
    <a
      href={href}
      className={`${base} bg-white text-axiom-text-primary hover:opacity-90 ${className}`}
      style={{ backgroundColor: '#ffffff' }}
    >
      {children}
    </a>
  );
}



