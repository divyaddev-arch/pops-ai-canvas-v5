import React from 'react';
import { Icon } from '../Icons';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- FAB Styles ---

const sizeStyles = {
  small: {
    container: 'w-[40px] h-[40px] rounded-[12px]',
    iconSize: 'text-2xl', // 24px
  },
  medium: { // This is the default FAB
    container: 'w-[56px] h-[56px] rounded-[16px]',
    iconSize: 'text-2xl', // 24px
  },
  large: {
    container: 'w-[96px] h-[96px] rounded-[28px]',
    iconSize: 'text-[36px]',
  },
};

const extendedSizeStyles = {
    container: 'h-[56px] rounded-[16px] px-4',
    label: 'label-large',
    iconSize: 'text-2xl', // 24px
    gap: 'gap-3',
};

const variantStyles = {
  surface: {
    base: 'bg-surface-container-high text-primary',
  },
  primary: {
    base: 'bg-primary-container text-on-primary-container',
  },
  secondary: {
    base: 'bg-secondary-container text-on-secondary-container',
  },
  tertiary: {
    base: 'bg-tertiary-container text-on-tertiary-container',
  },
};

export type FabSize = keyof typeof sizeStyles;
export type FabVariant = keyof typeof variantStyles;

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  size?: FabSize;
  variant?: FabVariant;
  flat?: boolean;
  expanded?: boolean;
}

export const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({
    icon,
    label,
    size = 'medium',
    variant = 'surface',
    className,
    disabled,
    flat = false,
    expanded = true,
    ...props
  }, ref) => {
    const isCollapsible = !!label;
    const sizeStyleObj = sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.medium;
    const styles = isCollapsible ? extendedSizeStyles : sizeStyleObj;
    const colorStyles = variantStyles[variant as keyof typeof variantStyles] || variantStyles.surface;

    const sizedIcon = React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement<any>, {
          className: cn((icon as React.ReactElement<any>).props.className, styles.iconSize, 'filled-icon'),
        })
      : null;

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out overflow-hidden',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary',
          
          // Enabled styles
          !disabled && colorStyles.base,
          !disabled && 'button--state-layer',
          !disabled && !flat && 'shadow-elevation-3 hover:shadow-elevation-4 focus:shadow-elevation-4 active:shadow-elevation-3',

          // Disabled styles
          'disabled:pointer-events-none',
          'disabled:bg-on-surface-12 disabled:text-on-surface-38 disabled:shadow-none',
          
          // Sizing and layout styles
          isCollapsible
            ? (expanded
                // Expanded state for collapsible FAB
                ? 'h-[56px] rounded-[16px] px-4 gap-3'
                // Collapsed state for collapsible FAB
                : 'w-[56px] h-[56px] rounded-[16px] p-0 gap-0'
              )
            // Regular non-collapsible FAB
            : sizeStyleObj.container,
          
          className
        )}
        {...props}
      >
        {sizedIcon}
        {isCollapsible && (
          <span
            className={cn(
              extendedSizeStyles.label,
              'transition-all duration-200 ease-in-out whitespace-nowrap',
              expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
            )}
            aria-hidden={!expanded}
          >
            {label}
          </span>
        )}
      </button>
    );
  }
);
FloatingActionButton.displayName = 'FloatingActionButton';
