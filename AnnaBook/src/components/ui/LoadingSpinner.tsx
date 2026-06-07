import React from 'react';
import type { LoadingSpinnerProps, LoadingSpinnerSize } from '../../types';

const sizeClass = (size: LoadingSpinnerSize) =>
  typeof size === 'number' ? '' : `ui-spinner--${size}`;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  variant = 'primary',
  label,
  overlay = false,
  className = '',
}) => {
  const modifier = sizeClass(size);
  const variantClass = `ui-spinner--variant-${variant}`;

  const svgStyle =
    typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <div
      className={`ui-spinner-container ${overlay ? 'ui-spinner--overlay' : ''}`.trim()}
      role={overlay ? 'status' : 'status'}
      aria-live="polite"
    >
      <div
        className={`ui-spinner ${modifier} ${variantClass} ${className}`.trim()}
        aria-label={label ?? 'Loading'}
      >
        <svg viewBox="0 0 50 50" style={svgStyle} aria-hidden="true" focusable="false">
          <circle className="ui-spinner__circle" cx="25" cy="25" r="20" />
        </svg>
        {label ? <span className="ui-spinner__label">{label}</span> : null}
      </div>
    </div>
  );
};

export default LoadingSpinner;
