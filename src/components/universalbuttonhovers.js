import React, { useState, useRef } from 'react';
import './universalbuttonhovers.css';

/**
 * Universal Button Hook for adding tactile in-place 3D pop-up physics
 */
export const useTactileButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const ref = useRef(null);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);
  const handleTouchStart = () => setIsPressed(true);
  const handleTouchEnd = () => setIsPressed(false);

  return {
    ref,
    isPressed,
    props: {
      ref,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      className: isPressed ? 'is-pressed' : ''
    }
  };
};

/**
 * Universal Button Component
 * - Hover: Smoothly pops up in 3D right in the SAME position (scale + shadow bloom)
 * - Press (Held): Compresses down in the same position as long as held
 */
export const UniversalButton = ({
  children,
  variant = 'primary', // 'primary' | 'glass' | 'nav' | 'blue'
  className = '',
  onClick,
  icon = null,
  iconPosition = 'right',
  sheen = true,
  as = 'button',
  href,
  ...rest
}) => {
  const { ref, props: tactileProps } = useTactileButton();
  const Component = href ? 'a' : as;

  return (
    <Component
      {...tactileProps}
      {...rest}
      ref={ref}
      href={href}
      onClick={onClick}
      className={`proven-universal-btn btn-${variant} ${tactileProps.className} ${className}`.trim()}
    >
      {sheen && <span className="proven-btn-sheen" aria-hidden="true" />}
      {icon && iconPosition === 'left' && <span className="proven-btn-icon">{icon}</span>}
      <span className="proven-btn-content">{children}</span>
      {icon && iconPosition === 'right' && <span className="proven-btn-icon">{icon}</span>}
    </Component>
  );
};

// Convenience Shorthands
export const PrimaryButton = (props) => <UniversalButton variant="primary" {...props} />;
export const GlassButton = (props) => <UniversalButton variant="glass" {...props} />;
export const NavButton = (props) => <UniversalButton variant="nav" {...props} />;
export const BlueButton = (props) => <UniversalButton variant="blue" {...props} />;

export default UniversalButton;
