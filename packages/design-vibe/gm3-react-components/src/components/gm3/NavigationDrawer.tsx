import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ListItem } from './ListItem';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- NavigationDrawerItem ---
export interface NavigationDrawerItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  selected?: boolean;
}

export const NavigationDrawerItem = React.forwardRef<HTMLButtonElement, NavigationDrawerItemProps>(
  ({ label, icon, badge, selected = false, disabled = false, className, ...props }, ref) => {

    const SizedIcon = React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement<any>, { className: cn((icon as React.ReactElement<any>).props.className, 'text-2xl') })
      : icon;

    const badgeContent = badge ? (
        <span className="label-large">{badge}</span>
    ) : null;

    return (
      <ListItem
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        role="menuitem"
        headline={<span className="label-large truncate">{label}</span>}
        leadingContent={SizedIcon}
        trailingContent={badgeContent}
        selected={selected}
        selectedRounded={true}
        disabled={disabled}
        className={className}
        {...props}
      />
    );
  }
);
NavigationDrawerItem.displayName = 'NavigationDrawerItem';


// --- DrawerHeader ---
export const DrawerHeader: React.FC<{ children: React.ReactNode, className?: string, id?: string }> = ({ children, className, id }) => (
    <div className={cn("h-[56px] flex items-center px-4", className)} id={id}>
        <h2 className="title-small-emphasized text-on-surface-variant">{children}</h2>
    </div>
);

// --- DrawerSectionLabel ---
export const DrawerSectionLabel: React.FC<{ children: React.ReactNode, className?: string, id?: string }> = ({ children, className, id }) => (
    <div className={cn("h-[56px] flex items-center px-4", className)} id={id}>
        <h3 className="label-large-emphasized text-on-surface-variant">{children}</h3>
    </div>
);


// --- ModalNavigationDrawer ---
export interface ModalNavigationDrawerProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export const ModalNavigationDrawer: React.FC<ModalNavigationDrawerProps> = ({ open, onClose, children, className }) => {
    const drawerRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (open) {
            setIsVisible(true);
            setIsClosing(false);
        } else {
            setIsClosing(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300); // match transition duration
            return () => clearTimeout(timer);
        }
    }, [open]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        // Use a document listener for Escape key to close even if focus is outside
        if (open) {
            document.addEventListener('keydown', handleKeyDown);
            const firstItem = drawerRef.current?.querySelector<HTMLButtonElement>('button:not([disabled])');
            // Timeout to allow drawer to become visible before focusing
            setTimeout(() => firstItem?.focus(), 100);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose]);
    
    if (!isVisible) return null;

    // This component is now rendered inside a relative container.
    // It uses absolute positioning to overlay its parent.
    return (
        <div className="absolute inset-0 z-50 pointer-events-none">
            {/* Scrim */}
            <div
                onClick={onClose}
                className={cn(
                    'absolute inset-0 bg-scrim transition-opacity duration-300',
                    (open && !isClosing) ? 'opacity-30 pointer-events-auto' : 'opacity-0'
                )}
                aria-hidden="true"
            />

            {/* Drawer */}
            <nav
                ref={drawerRef}
                className={cn(
                    'absolute top-0 left-0 bottom-0 w-[360px] bg-surface-container-low shadow-elevation-1',
                    'flex flex-col py-3 transition-transform duration-300 ease-in-out',
                    (open && !isClosing) ? 'translate-x-0 pointer-events-auto' : '-translate-x-full',
                    className
                )}
                aria-modal="true"
                role="dialog"
            >
                <div className="flex-1 overflow-y-auto scroll-thin px-3">
                  {children}
                </div>
            </nav>
        </div>
    );
};
ModalNavigationDrawer.displayName = 'ModalNavigationDrawer';