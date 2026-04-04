import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- NavigationRailItem ---
export interface NavigationRailItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  alwaysShowLabel?: boolean;
}

export const NavigationRailItem = React.forwardRef<HTMLButtonElement, NavigationRailItemProps>(
  ({ icon, label, selected = false, disabled = false, alwaysShowLabel = false, onClick, className, ...props }, ref) => {
    
    const iconColor = disabled
      ? 'text-on-surface-38'
      : selected
        ? 'text-on-secondary-container'
        : 'text-on-surface-variant';
        
    const labelColor = disabled
      ? 'text-on-surface-38'
      : selected
        ? 'text-on-surface'
        : 'text-on-surface-variant';
    
    const SizedIcon = React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement<any>, {
          className: cn('text-2xl transition-colors', (icon as React.ReactElement<any>).props.className, iconColor),
        })
      : null;

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'relative w-full min-w-fit px-3 h-[56px] flex flex-col items-center justify-center gap-1 rounded-[16px]',
          'focus:outline-none disabled:pointer-events-none',
          !disabled && (selected ? 'cursor-default' : 'cursor-pointer button--state-layer'),
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'w-[56px] h-[32px] rounded-full flex items-center justify-center transition-colors',
            selected && !disabled ? 'bg-secondary-container' : 'bg-transparent'
          )}
        >
          {SizedIcon}
        </div>
        <span
          className={cn(
            'label-medium overflow-hidden whitespace-nowrap transition-[max-height,opacity] duration-150 ease-out',
            labelColor,
            (selected || alwaysShowLabel) ? 'opacity-100 max-h-[48px]' : 'opacity-0 max-h-0'
          )}
        >
          {label}
        </span>
      </button>
    );
  }
);
NavigationRailItem.displayName = 'NavigationRailItem';


// --- NavigationRail ---
export interface NavigationRailProps extends React.HTMLAttributes<HTMLElement> {
    header?: React.ReactNode;
}

export const NavigationRail = React.forwardRef<HTMLElement, NavigationRailProps>(
  ({ header, children, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          'w-fit h-full bg-surface flex flex-col items-center pt-3',
          className
        )}
        {...props}
      >
        {header && <div className="mb-3 flex-shrink-0">{header}</div>}
        <div className="flex-1 min-h-0 flex flex-col items-center gap-3 w-full">
            {children}
        </div>
      </nav>
    );
  }
);
NavigationRail.displayName = 'NavigationRail';
