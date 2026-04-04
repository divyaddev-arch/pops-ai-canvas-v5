import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: string; // The name of the icon, e.g., "settings"
  filled?: boolean;
  /** 
   * Explicit size for the icon. 
   * Can be a number (pixels) or a string (e.g., "1.5rem").
   * This will override any default sizing applied by parent components via CSS.
   */
  size?: number | string;
}

/**
 * A component to render Google Material Symbols.
 * Find icons at https://fonts.google.com/icons
 */
export const Icon: React.FC<IconProps> = ({ 
  children, 
  className, 
  filled = false, 
  size,
  style,
  ...props 
}) => {
  // Use inline style for size to ensure it wins over parent-injected classes
  const iconStyle: React.CSSProperties = {
    ...style,
    ...(size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : {}),
  };

  return (
    <span
      className={cn(
        "material-symbols-outlined align-middle leading-none select-none shrink-0", 
        filled && "filled-icon",
        className
      )}
      style={iconStyle}
      aria-hidden="true"
      {...props}
    >
      {children}
    </span>
  );
};
