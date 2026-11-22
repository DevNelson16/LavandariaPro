import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-card border border-gray-200 bg-surface shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;