// src/components/ui/Button.jsx - 修復版本
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  onClick,
  type = 'button',
  style = {},
  ...props 
}) => {
  const baseStyles = {
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    textDecoration: 'none',
    fontFamily: 'inherit'
  };

  const variants = {
    primary: {
      backgroundColor: disabled ? '#9ca3af' : '#3b82f6',
      color: 'white',
      border: '1px solid transparent'
    },
    secondary: {
      backgroundColor: disabled ? '#f9fafb' : '#f3f4f6',
      color: disabled ? '#9ca3af' : '#374151',
      border: '1px solid #d1d5db'
    },
    success: {
      backgroundColor: disabled ? '#9ca3af' : '#16a34a',
      color: 'white',
      border: '1px solid transparent'
    },
    danger: {
      backgroundColor: disabled ? '#f9fafb' : '#fef2f2',
      color: disabled ? '#9ca3af' : '#dc2626',
      border: '1px solid #fecaca'
    },
    outline: {
      backgroundColor: 'transparent',
      color: disabled ? '#9ca3af' : '#6b7280',
      border: '1px solid #d1d5db'
    }
  };

  const sizes = {
    small: { 
      padding: '6px 12px', 
      fontSize: '12px',
      minHeight: '32px'
    },
    medium: { 
      padding: '10px 16px', 
      fontSize: '14px',
      minHeight: '40px'
    },
    large: { 
      padding: '12px 24px', 
      fontSize: '16px',
      minHeight: '48px'
    }
  };

  const buttonStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    ...style // 允許外部覆蓋樣式
  };

  const handleMouseEnter = (e) => {
    if (!disabled) {
      switch (variant) {
        case 'primary':
          e.target.style.backgroundColor = '#2563eb';
          break;
        case 'secondary':
          e.target.style.backgroundColor = '#e5e7eb';
          e.target.style.borderColor = '#9ca3af';
          break;
        case 'success':
          e.target.style.backgroundColor = '#15803d';
          break;
        case 'danger':
          e.target.style.backgroundColor = '#fee2e2';
          e.target.style.borderColor = '#f87171';
          break;
        case 'outline':
          e.target.style.backgroundColor = '#f9fafb';
          e.target.style.borderColor = '#9ca3af';
          break;
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      // 重置到原始樣式
      Object.assign(e.target.style, buttonStyles);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={buttonStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;