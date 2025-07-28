// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  title, 
  hover = false,
  padding = 'normal',
  className = '',
  onClick,
  ...props 
}) => {
  const paddingStyles = {
    small: { padding: '12px' },
    normal: { padding: '20px' },
    large: { padding: '24px' }
  };

  const baseStyles = {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: hover ? 'all 0.2s ease' : 'none',
    cursor: onClick ? 'pointer' : 'default',
    ...paddingStyles[padding]
  };

  const hoverStyles = hover ? {
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)'
  } : {};

  const handleMouseEnter = (e) => {
    if (hover) {
      Object.assign(e.currentTarget.style, hoverStyles);
    }
  };

  const handleMouseLeave = (e) => {
    if (hover) {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  };

  return (
    <div
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      {...props}
    >
      {title && (
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          margin: '0 0 16px 0'
        }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;