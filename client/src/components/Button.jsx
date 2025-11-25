// client/src/components/Button.jsx

import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const disabledClass = disabled ? "btn-disabled" : "";

  const handleClick = (e) => {
    if (!disabled && onClick) onClick(e);
  };

  return (
    <button
      className={`${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim()}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
