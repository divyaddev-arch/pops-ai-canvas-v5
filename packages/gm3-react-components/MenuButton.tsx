import React, { useState, useRef } from 'react';
import { Icon } from './Icons';
import { Menu, MenuItem } from './Menu';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

type MenuButtonVariant = 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text';

export interface MenuButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant: MenuButtonVariant;
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const baseStyles = 'relative inline-flex items-center justify-center h-[40px] rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary disabled:pointer-events-none overflow-hidden';

const variantStyles = {
  elevated: 'bg-surface-container-low text-primary shadow-elevation-1 disabled:shadow-none disabled:bg-on-surface-10 disabled:text-on-surface-38',
  filled: 'bg-primary text-on-primary shadow-none hover:shadow-sm disabled:shadow-none disabled:bg-on-surface-10 disabled:text-on-surface-38',
  tonal: 'bg-secondary-container text-on-secondary-container shadow-none hover:shadow-sm disabled:shadow-none disabled:bg-on-surface-10 disabled:text-on-surface-38',
  outlined: 'border border-outline-variant text-primary shadow-none disabled:border-[rgba(var(--color-on-surface-rgb),0.12)] disabled:text-on-surface-38',
  text: 'text-primary shadow-none disabled:text-on-surface-38',
};


export const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ variant, label, icon, children, disabled = false, className, ...props }, ref) => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const isMenuOpen = Boolean(menuAnchor);
    
    const combinedRef = (node: HTMLButtonElement | null) => {
        if (typeof ref === 'function') ref(node);
        else if(ref) ref.current = node;
        (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    }

    const handleMenuClick = () => setMenuAnchor(buttonRef.current);
    const handleMenuClose = () => setMenuAnchor(null);
    
    const styles = variantStyles[variant as keyof typeof variantStyles] || variantStyles.filled;
    const hasIcon = icon != null;

    const sizedIcon = hasIcon && React.isValidElement(icon) ? React.cloneElement((icon as React.ReactElement<any>), {
        className: cn((icon as React.ReactElement<any>).props.className, 'text-[20px]')
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

    return (
        <>
            <button
                ref={combinedRef}
                onClick={handleMenuClick}
                disabled={disabled}
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                className={cn(
                    baseStyles,
                    'label-large',
                    styles,
                    hasIcon ? 'pl-4 pr-[3px]' : 'pl-4 pr-[7px]',
                    'gap-0.5',
                    !disabled && 'button--state-layer',
                    variant === 'outlined' && disabled && 'border-transparent',
                    className
                )}
                {...props}
            >
                {sizedIcon && <span className="inline-flex items-center justify-center w-[20px] h-[20px]">{sizedIcon}</span>}
                <span className="leading-none ml-0.5">{label}</span>
                <Icon className={cn('transition-transform duration-200', isMenuOpen && 'rotate-180')}>
                    arrow_drop_down
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
        </>
    );
  }
);
MenuButton.displayName = 'MenuButton';