
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { FloatingActionButton, type FabVariant } from './FloatingActionButton';
import { Icon } from './Icons';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- MenuItemsPortal (Internal Component) ---
interface MenuItemsPortalProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode[];
  menuPosition: 'top-right' | 'bottom-left' | 'bottom-right';
}

const MenuItemsPortal: React.FC<MenuItemsPortalProps> = ({ anchorEl, onClose, children, menuPosition }) => {
    const [position, setPosition] = useState<{ top?: number; left?: number; bottom?: number; right?: number; } | null>(null);

    useLayoutEffect(() => {
        // Defer position calculation to ensure layout is stable, preventing misalignment on first open.
        const timerId = setTimeout(() => {
            if (anchorEl) {
                const rect = anchorEl.getBoundingClientRect();
                if (menuPosition === 'bottom-left') {
                    setPosition({
                        top: rect.bottom,
                        left: rect.left,
                    });
                } else if (menuPosition === 'bottom-right') {
                    setPosition({
                        top: rect.bottom,
                        right: window.innerWidth - rect.right,
                    });
                } else { // default 'top-right'
                    setPosition({
                        bottom: window.innerHeight - rect.top,
                        right: window.innerWidth - rect.right,
                    });
                }
            }
        }, 0);

        return () => clearTimeout(timerId);
    }, [anchorEl, menuPosition]);
    
    const isBottom = menuPosition.startsWith('bottom-');
    
    const dynamicStyle: React.CSSProperties = {
        visibility: position ? 'visible' : 'hidden',
    };
    if (position) {
        if (isBottom && position.top !== undefined) {
            dynamicStyle.top = `${position.top + 8}px`;
            if (menuPosition === 'bottom-left' && position.left !== undefined) {
                dynamicStyle.left = `${position.left}px`;
            } else if (menuPosition === 'bottom-right' && position.right !== undefined) {
                dynamicStyle.right = `${position.right}px`;
            }
        } else if (!isBottom && position.bottom !== undefined && position.right !== undefined) {
            dynamicStyle.bottom = `${position.bottom + 8}px`; // Add gap for menu items above
            dynamicStyle.right = `${position.right}px`;
        }
    }


    return ReactDOM.createPortal(
        <>
            {/* Scrim */}
            <div
                onClick={onClose}
                aria-hidden="true"
                className="fixed inset-0 z-40 bg-scrim/30 animate-fade-in"
            />
            {/* Menu container */}
            <div
                className={cn(
                    "fixed z-50 flex flex-col gap-1",
                    menuPosition === 'bottom-left' ? 'items-start' : 'items-end'
                )}
                style={dynamicStyle}
            >
                {React.Children.map(children, (child, index) => {
                    if (!React.isValidElement(child)) return null;
                    const el = child as React.ReactElement<any>;

                    const originalOnClick = el.props.onClick;
                    return React.cloneElement(el, {
                        key: index,
                        onClick: () => {
                          originalOnClick?.();
                          onClose();
                        },
                        className: cn(
                            el.props.className,
                            'transition-[transform,opacity] duration-300 ease-emphasized-decelerate',
                            isBottom ? 'animate-slide-down-fade-in' : 'animate-slide-up-fade-in'
                        ),
                        style: {
                            ...el.props.style,
                            animationDelay: `${50 + index * 30}ms`,
                        },
                    });
                })}
            </div>
            <style>
            {`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 150ms ease-out forwards;
                }

                @keyframes slide-up-fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-up-fade-in {
                    animation: slide-up-fade-in 400ms both;
                }
                
                @keyframes slide-down-fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-down-fade-in {
                    animation: slide-down-fade-in 400ms both;
                }
            `}
            </style>
        </>,
        document.body
    );
};

// --- FabMenu (Public API) ---
export interface FabMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'icon'> {
  icon: React.ReactNode;
  openIcon?: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
  fabVariant?: FabVariant;
  label?: string;
  menuPosition?: 'top-right' | 'bottom-left' | 'bottom-right';
  flat?: boolean;
  size?: 'small' | 'medium';
}

const openStateColors: Record<FabVariant, string> = {
    surface: '!bg-primary !text-on-primary', // Surface FAB opens into primary
    primary: '!bg-primary !text-on-primary',
    secondary: '!bg-secondary !text-on-secondary',
    tertiary: '!bg-tertiary !text-on-tertiary',
};

export const FabMenu = React.forwardRef<HTMLDivElement, FabMenuProps>(
  ({ icon, openIcon, children, className, fabVariant = 'surface', label, menuPosition = 'top-right', flat = false, size = 'medium', ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const fabRef = useRef<HTMLButtonElement>(null);
    
    const processedChildren = useMemo(() => {
        return React.Children.map(children, (child) => {
            if (React.isValidElement(child) && (child.type as any).displayName === 'Button') {
                const buttonSize = size === 'small' ? 'small' : 'medium';
                return React.cloneElement(child as React.ReactElement<any>, { size: buttonSize });
            }
            return child;
        });
    }, [children, size]);

    const childrenArray = React.Children.toArray(processedChildren).filter(React.isValidElement);

    const toggleMenu = () => setIsOpen(p => !p);
    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeMenu();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const isExtended = !!label;

    const fabIconContent = (
      <div className={cn(
        "relative flex items-center justify-center overflow-hidden",
        isExtended ? "w-6 h-6" : "w-9 h-9"
      )}>
        <div className={cn(
            'absolute transition-all duration-300 ease-out',
            isOpen && openIcon ? 'opacity-0 -rotate-45 scale-50' : 'opacity-100 rotate-0 scale-100',
            isOpen && !openIcon && 'rotate-[135deg]'
        )}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, {className: cn((icon as React.ReactElement<any>).props.className, 'filled-icon')}) : icon}
        </div>
        {openIcon && (
            <div className={cn(
                'absolute transition-all duration-300 ease-out',
                isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-45 scale-50'
            )}>
                {React.isValidElement(openIcon) ? React.cloneElement(openIcon as React.ReactElement<any>, {className: cn((openIcon as React.ReactElement<any>).props.className, 'filled-icon')}) : openIcon}
            </div>
        )}
      </div>
    );
    
    const openColorClass = openStateColors[fabVariant];

    return (
      <div ref={ref} className={cn("relative z-30", className)} {...props}>
          <FloatingActionButton
            ref={fabRef}
            icon={fabIconContent}
            label={label}
            size={size}
            variant={fabVariant}
            flat={flat}
            onClick={toggleMenu}
            aria-haspopup="true"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className={cn(
                'transition-all ease-standard duration-medium3',
                 isOpen && !label && (size === 'medium' ? 'rounded-[30px]' : 'rounded-[20px]'),
                 isOpen && openColorClass
            )}
          />
        {isOpen && <MenuItemsPortal anchorEl={fabRef.current} onClose={closeMenu} menuPosition={menuPosition}>{childrenArray as any}</MenuItemsPortal>}
      </div>
    );
  }
);
FabMenu.displayName = 'FabMenu';
