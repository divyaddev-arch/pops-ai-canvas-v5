import React, { useState, useRef } from 'react';
import { Icon } from '../Icons';
import { Menu, MenuItem } from './Menu';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

type SplitButtonVariant = 'elevated' | 'filled' | 'tonal' | 'outlined';
type SplitButtonSize = 'medium' | 'compact';

export interface SplitButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  variant: SplitButtonVariant;
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  size?: SplitButtonSize;
}

const variantStyles = {
  elevated: {
    button: 'bg-surface-container-low text-primary shadow-elevation-1',
    disabled: 'shadow-none bg-on-surface-10 text-on-surface-38',
  },
  filled: {
    button: 'bg-primary text-on-primary',
    disabled: 'shadow-none bg-on-surface-10 text-on-surface-38',
  },
  tonal: {
    button: 'bg-secondary-container text-on-secondary-container',
    disabled: 'shadow-none bg-on-surface-10 text-on-surface-38',
  },
  outlined: {
    button: 'border border-outline-variant text-primary',
    disabled: 'border border-[rgba(var(--color-on-surface-rgb),0.12)] text-on-surface-38',
  },
};

const sizeStyles = {
    medium: {
        height: 'h-[40px]',
        mainPadding: 'px-4',
        dropdownWidth: 'w-[40px]',
        iconSize: 'text-[20px]',
        label: 'label-large',
        iconContainer: 'w-[20px] h-[20px]',
        dropdownIconSize: 'text-[22px]',
    },
    compact: {
        height: 'h-[32px]',
        mainPadding: 'px-3',
        dropdownWidth: 'w-[32px]',
        iconSize: 'text-[20px]',
        label: 'label-large',
        iconContainer: 'w-[20px] h-[20px]',
        dropdownIconSize: 'text-[20px]',
    }
};

export const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  ({ variant, label, onClick, icon, children, disabled = false, size = 'medium', className, ...props }, ref) => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const dropdownRef = useRef<HTMLButtonElement>(null);
    const isMenuOpen = Boolean(menuAnchor);

    const handleMenuClick = () => setMenuAnchor(dropdownRef.current);
    const handleMenuClose = () => setMenuAnchor(null);
    
    const styles = variantStyles[variant as keyof typeof variantStyles] || variantStyles.filled;
    const sizeStyle = sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.medium;

    const sizedIcon = icon && React.isValidElement(icon) ? React.cloneElement((icon as React.ReactElement<any>), {
        className: cn((icon as React.ReactElement<any>).props.className, sizeStyle.iconSize)
    }) : null;

    const menuItems = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            const el = child as React.ReactElement<any>;
            if (child.type === MenuItem || el.props.role === 'menuitem') {
                const originalOnClick = el.props.onClick;
                return React.cloneElement(el, {
                    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                        originalOnClick?.(e);
                        handleMenuClose();
                    }
                });
            }
        }
        return child;
    });
    
    const buttonBaseClasses = 'relative flex items-center justify-center transition-all duration-200 focus:outline-none';
    const buttonVariantClasses = disabled ? styles.disabled : styles.button;

    return (
      <div
        ref={ref}
        className={cn(
            'relative inline-flex items-center gap-[2px]',
            className
        )}
        {...props}
      >
        <button
          onClick={onClick}
          className={cn(
            buttonBaseClasses,
            buttonVariantClasses,
            'gap-2',
            sizeStyle.height,
            sizeStyle.mainPadding,
            sizeStyle.label,
            'rounded-l-extra-large rounded-tr-extra-small rounded-br-extra-small hover:rounded-tr-medium hover:rounded-br-medium',
            !disabled && 'button--state-layer'
          )}
          disabled={disabled}
          aria-label={label}
        >
          {sizedIcon && <span className={cn('inline-flex items-center justify-center', sizeStyle.iconContainer)}>{sizedIcon}</span>}
          <span>{label}</span>
        </button>

        <button
          ref={dropdownRef}
          onClick={handleMenuClick}
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
          aria-label="Open menu"
          className={cn(
            buttonBaseClasses,
            buttonVariantClasses,
            sizeStyle.height,
            sizeStyle.dropdownWidth,
            'rounded-r-extra-large',
            isMenuOpen
              ? 'rounded-tl-medium rounded-bl-medium'
              : 'rounded-tl-extra-small rounded-bl-extra-small hover:rounded-tl-medium hover:rounded-bl-medium',
            !disabled && 'button--state-layer'
          )}
          disabled={disabled}
        >
          <Icon className={cn('transition-transform duration-200', sizeStyle.dropdownIconSize, isMenuOpen && 'rotate-180')}>
            expand_more
          </Icon>
        </button>

        <Menu
          anchorEl={menuAnchor}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {menuItems}
        </Menu>
      </div>
    );
  }
);
SplitButton.displayName = 'SplitButton';