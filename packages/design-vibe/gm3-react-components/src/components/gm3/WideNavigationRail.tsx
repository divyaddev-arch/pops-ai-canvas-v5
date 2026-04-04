import React from 'react';
import { Icon } from '../Icons';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- WideNavigationRailItem ---
export interface WideNavigationRailItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  badge?: React.ReactNode;
}

export const WideNavigationRailItem = React.forwardRef<HTMLButtonElement, WideNavigationRailItemProps>(
  ({ icon, label, selected = false, disabled = false, badge, onClick, className, ...props }, ref) => {

    const finalIcon = (selected && React.isValidElement(icon) && icon.type === Icon)
        ? React.cloneElement(icon as React.ReactElement<any>, { className: cn((icon as React.ReactElement<any>).props.className, 'filled-icon') })
        : icon;

    const SizedIcon = React.isValidElement(finalIcon)
      ? React.cloneElement(finalIcon as React.ReactElement<any>, {
          className: cn('text-2xl transition-colors', (finalIcon as React.ReactElement<any>).props.className),
        })
      : null;

    const contentColor = disabled ? 'text-on-surface-38' : selected ? 'text-on-secondary-container' : 'text-on-surface';
    const iconColor = disabled ? 'text-on-surface-38' : selected ? 'text-on-secondary-container' : 'text-on-surface-variant';
    const badgeColor = disabled ? 'text-on-surface-38' : selected ? 'text-on-secondary-container' : 'text-on-surface-variant';

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'relative w-full h-[56px] flex items-center px-4 gap-3 rounded-full text-left',
          'focus:outline-none disabled:pointer-events-none',
          !disabled && (selected ? 'cursor-default' : 'cursor-pointer button--state-layer'),
          selected && !disabled && 'bg-secondary-container',
          className
        )}
        {...props}
      >
        <div className={cn(iconColor)}>
          {SizedIcon}
        </div>
        <span className={cn('flex-1 truncate label-large', contentColor)}>
          {label}
        </span>
        {badge && (
            <span className={cn('label-large', badgeColor)}>
                {badge}
            </span>
        )}
      </button>
    );
  }
);
WideNavigationRailItem.displayName = 'WideNavigationRailItem';


// --- WideNavigationRail ---
export interface WideNavigationRailProps extends React.HTMLAttributes<HTMLElement> {
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export const WideNavigationRail = React.forwardRef<HTMLElement, WideNavigationRailProps>(
  ({ header, children, footer, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          'w-[360px] h-full bg-surface-container flex flex-col',
          className
        )}
        {...props}
      >
        {header && <div className="pt-4 px-4 flex-shrink-0">{header}</div>}
        <div className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto scroll-thin">
            {children}
        </div>
        {footer && <div className="pb-4 px-4 flex-shrink-0">{footer}</div>}
      </nav>
    );
  }
);
WideNavigationRail.displayName = 'WideNavigationRail';
