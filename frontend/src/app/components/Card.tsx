"use client";

import React from "react";
import CardHeader from "./CardHeader";

type CardProps<T extends React.ElementType = "div"> = {
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  headerVariant?: 'dark' | 'yellow' | 'blue';
  as?: T;
  className?: string;
};

export default function Card<T extends React.ElementType = "div">({ 
  title, 
  children, 
  footer, 
  header,
  headerVariant = 'dark',
  as, 
  className = "" 
}: CardProps<T>) {
  const Tag = (as || "div") as React.ElementType;
  
  return (
    <Tag className={`rounded-3xl overflow-hidden ${className}`} style={{ backgroundColor: '#f5f3f2' }}>
      {header && (
        <CardHeader variant={headerVariant}>
          {header}
        </CardHeader>
      )}
      <div className="p-8">
        {title ? (
          <h3 className="text-2xl font-semibold text-axiom-text-primary mb-4">{title}</h3>
        ) : null}
        <div className="text-lg text-axiom-text-light">{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </Tag>
  );
}

export function CardLink({ href = "#", children }: { href?: string; children: React.ReactNode }) {
  return (
    <a href={href} className="font-semibold" style={{ color: '#ffffff' }}>
      {children}
    </a>
  );
}


