
import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '../Icons';
import { Button } from './Button';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- MenuItemsPortal (Internal Component from USER'S REFERENCE) ---
interface MenuItemsPortalProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode[];
  menuPosition: 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right';
}

const MenuItemsPortal: React.FC<MenuItemsPortalProps> = ({ anchorEl, onClose, children, menuPosition }) => {
    const [position, setPosition] = useState<{ top?: number; left?: number; bottom?: number; right?: number; } | null>(null);

    useLayoutEffect(() => {
        const timerId = setTimeout(() => {
            if (anchorEl) {
                const rect = anchorEl.getBoundingClientRect();
                const pos: any = {};
                if (menuPosition.startsWith('bottom')) {
                    pos.top = rect.bottom;
                } else { // top
                    pos.bottom = window.innerHeight - rect.top;
                }
                if (menuPosition.endsWith('left')) {
                    pos.left = rect.left;
                } else { // right
                    pos.right = window.innerWidth - rect.right;
                }
                setPosition(pos);
            }
        }, 0);
        return () => clearTimeout(timerId);
    }, [anchorEl, menuPosition]);
    
    const isBottom = menuPosition.startsWith('bottom');
    const isLeft = menuPosition.endsWith('left');
    
    const dynamicStyle: React.CSSProperties = {
        visibility: position ? 'visible' : 'hidden',
    };
    if (position) {
        if (isBottom) dynamicStyle.top = `${position.top! + 8}px`;
        else dynamicStyle.bottom = `${position.bottom! + 8}px`;

        if (isLeft) dynamicStyle.left = `${position.left}px`;
        else dynamicStyle.right = `${position.right}px`;
    }

    return ReactDOM.createPortal(
        <>
            <div onClick={onClose} aria-hidden="true" className="fixed inset-0 z-40 bg-scrim/30 animate-fade-in" />
            <div className={cn("fixed z-50 flex flex-col gap-1", isLeft ? 'items-start' : 'items-end')} style={dynamicStyle}>
                {React.Children.map(children, (child, index) => {
                    if (!React.isValidElement(child)) return null;
                    const el = child as React.ReactElement<any>;
                    const originalOnClick = el.props.onClick;
                    return React.cloneElement(el, {
                        key: index,
                        onClick: () => { originalOnClick?.(); onClose(); },
                        className: cn(el.props.className, 'transition-[transform,opacity] duration-300 ease-emphasized-decelerate', isBottom ? 'animate-slide-down-fade-in' : 'animate-slide-up-fade-in'),
                        style: { ...el.props.style, animationDelay: `${50 + index * 30}ms` },
                    });
                })}
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 150ms ease-out forwards; }
                @keyframes slide-up-fade-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slide-up-fade-in { animation: slide-up-fade-in 400ms both; }
                @keyframes slide-down-fade-in { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slide-down-fade-in { animation: slide-down-fade-in 400ms both; }
            `}</style>
        </>,
        document.body
    );
};


// Component Definition
type SplitFabVariant = 'surface' | 'primary' | 'secondary' | 'tertiary';
type SplitFabSize = 'small' | 'medium';

export interface SplitFabProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  variant?: SplitFabVariant;
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  icon: React.ReactNode;
  disabled?: boolean;
  flat?: boolean;
  size?: SplitFabSize;
  openIcon?: React.ReactNode;
  menuPosition?: 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right';
  onMenuToggle?: (isOpen: boolean) => void;
}

const variantStyles = {
  surface: { button: 'bg-surface-container-high text-primary' },
  primary: { button: 'bg-primary-container text-on-primary-container' },
  secondary: { button: 'bg-secondary-container text-on-secondary-container' },
  tertiary: { button: 'bg-tertiary-container text-on-tertiary-container' },
};

const sizeStyles = {
  medium: {
    height: 'h-[56px]',
    mainButtonPadding: 'px-4',
    dropdown: 'w-[56px]',
    icon: 'text-2xl',
    label: 'label-large',
    gap: 'gap-2',
    iconContainer: 'w-6 h-6',
  },
  small: {
    height: 'h-[40px]',
    mainButtonPadding: 'px-4',
    dropdown: 'w-[40px]',
    icon: 'text-[20px]',
    label: 'label-large',
    gap: 'gap-2',
    iconContainer: 'w-5 h-5',
  },
};

export const SplitFab = React.forwardRef<HTMLDivElement, SplitFabProps>(
  ({ variant = 'surface', label, onClick, icon, children, disabled = false, flat = false, size = 'medium', openIcon, menuPosition = 'bottom-left', className, onMenuToggle, ...props }, ref) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const mainButtonRef = useRef<HTMLButtonElement>(null);
    const [initialWidth, setInitialWidth] = useState<number | null>(null);

    const processedChildren = useMemo(() => {
        return React.Children.map(children, (child) => {
            if (React.isValidElement(child) && (child.type as any).displayName === 'Button') {
                return React.cloneElement(child as React.ReactElement<any>, { size });
            }
            return child;
        });
    }, [children, size]);

    const childrenArray = React.Children.toArray(processedChildren).filter(React.isValidElement);

    const toggleMenu = () => {
        const nextState = !isMenuOpen;
        setIsMenuOpen(nextState);
        onMenuToggle?.(nextState);
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
        onMenuToggle?.(false);
    };
    
    const combinedRef = (node: HTMLDivElement | null) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if(ref) ref.current = node;
    }
    
    useEffect(() => {
        if (mainButtonRef.current && initialWidth === null) {
            setTimeout(() => {
                if (mainButtonRef.current) {
                    setInitialWidth(mainButtonRef.current.offsetWidth);
                }
            }, 50);
        }
    }, [initialWidth]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeMenu();
        };
        if (isMenuOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMenuOpen]);
    
    const styles = variantStyles[variant as keyof typeof variantStyles] || variantStyles.surface;
    const sizeStyle = sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.medium;
    const finalOpenIcon = openIcon ?? <Icon>close</Icon>;

    const sizedIcon = React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, {
        className: cn((icon as React.ReactElement<any>).props.className, sizeStyle.icon, 'filled-icon')
    }) : null;
    
    const buttonBaseClasses = 'relative flex items-center justify-center focus:outline-none';
    const buttonVariantClasses = disabled ? 'bg-on-surface-12 text-on-surface-38' : styles.button;
    
    const closedShadowClasses = !disabled && !flat && 'shadow-elevation-3 group-hover:shadow-elevation-4';
    const openShadowClasses = !disabled && !flat && 'shadow-elevation-3 hover:shadow-elevation-4';

    const openColorClass = '!bg-primary !text-on-primary';
    const dropdownIconSize = sizeStyle.icon;

    return (
      <div
        ref={combinedRef}
        className={cn(
            'relative inline-flex items-center gap-[2px] group',
            className
        )}
        {...props}
      >
        <button
          ref={mainButtonRef}
          onClick={onClick}
          style={{
              width: isMenuOpen ? 0 : (initialWidth ? `${initialWidth}px` : undefined),
              paddingLeft: isMenuOpen ? 0 : undefined,
              paddingRight: isMenuOpen ? 0 : undefined,
              opacity: isMenuOpen ? 0 : 1,
          }}
          className={cn(
            buttonBaseClasses,
            buttonVariantClasses,
            closedShadowClasses,
            sizeStyle.height,
            sizeStyle.label,
            sizeStyle.mainButtonPadding,
            sizeStyle.gap,
            'overflow-hidden',
            !disabled && 'button--state-layer cursor-pointer',
            'inline-flex items-center',
            'transition-all duration-medium2 ease-standard',
            'rounded-l-large',
            'rounded-tr-extra-small rounded-br-extra-small',
            !isMenuOpen && 'hover:rounded-tr-medium hover:rounded-br-medium',
          )}
          disabled={disabled}
          aria-label={label}
        >
          {sizedIcon && <span className={cn('inline-flex items-center justify-center', sizeStyle.iconContainer)}>{sizedIcon}</span>}
          <span className={cn('whitespace-nowrap')}>{label}</span>
        </button>

        <button
          onClick={toggleMenu}
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className={cn(
            buttonBaseClasses,
            'transition-[transform,opacity,background-color,border-radius] duration-medium2 ease-standard',
            sizeStyle.height,
            isMenuOpen
              ? cn(
                  openColorClass,
                  sizeStyle.dropdown,
                  '!rounded-extra-large', // Open state corner radius
                  openShadowClasses,
                )
              : cn(
                  buttonVariantClasses,
                  closedShadowClasses,
                  sizeStyle.dropdown,
                  'rounded-r-large',
                  'rounded-tl-extra-small rounded-bl-extra-small hover:rounded-tl-medium hover:rounded-bl-medium',
                ),
            !disabled && 'button--state-layer cursor-pointer'
          )}
          disabled={disabled}
        >
          <div className={cn("relative flex items-center justify-center overflow-hidden", sizeStyle.iconContainer)}>
            <div className={cn('absolute transition-all duration-medium2 ease-standard', isMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100')}>
                <Icon className={dropdownIconSize}>expand_more</Icon>
            </div>
            <div className={cn('absolute transition-all duration-medium2 ease-standard', isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0')}>
                {React.isValidElement(finalOpenIcon) ? React.cloneElement(finalOpenIcon as React.ReactElement<any>, { className: cn((finalOpenIcon as React.ReactElement<any>).props.className, dropdownIconSize) }) : finalOpenIcon}
            </div>
          </div>
        </button>

        {isMenuOpen && <MenuItemsPortal anchorEl={containerRef.current} onClose={closeMenu} menuPosition={menuPosition}>{childrenArray as any}</MenuItemsPortal>}
      </div>
    );
  }
);
SplitFab.displayName = 'SplitFab';
