// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseStyles = {
    border: 'none',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const variants = {
    primary: {
      backgroundColor: disabled ? '#9ca3af' : '#2563eb',
      color: 'white'
    },
    secondary: {
      backgroundColor: disabled ? '#f3f4f6' : '#f3f4f6',
      color: disabled ? '#9ca3af' : '#374151'
    },
    success: {
      backgroundColor: disabled ? '#9ca3af' : '#16a34a',
      color: 'white'
    }
  };

  const sizes = {
    small: { padding: '6px 12px', fontSize: '13px' },
    medium: { padding: '10px 16px', fontSize: '14px' },
    large: { padding: '12px 24px', fontSize: '16px' }
  };

  const buttonStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size]
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={buttonStyles}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;