import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /**
   * The thickness of the divider in pixels.
   * @default 1
   */
  thickness?: number;
  /**
   * The indent of the divider from the start in pixels.
   * @default 0
   */
  indent?: number;
}

/**
 * A Material Design Divider. It's a thin line of separation between content.
 * https://m3.material../divider/overview
 */
export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, thickness = 1, indent = 0, style: customStyle, ...props }, ref) => {
    // The component is a horizontal rule.
    // We use a style tag to dynamically set height and margin,
    // as these are pixel-based values that can vary.
    const style: React.CSSProperties = {
      height: `${thickness}px`,
      // If there's an indent, we apply it as a margin.
      marginLeft: indent > 0 ? `${indent}px` : undefined,
      // The width should account for the indent.
      width: indent > 0 ? `calc(100% - ${indent}px)` : '100%',
    };

    return (
      <hr
        ref={ref}
        className={cn(
          'border-none bg-outline-variant w-full',
          className
        )}
        style={{ ...style, ...customStyle }}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
