import React, { useState, useEffect } from 'react';
import { Divider } from './Divider';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode; // The text content
  actions?: React.ReactNode;
  showDivider?: boolean;
  variant?: 'full-width' | 'floating';
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(({
  open,
  icon,
  children,
  actions,
  showDivider = true,
  variant = 'full-width',
  className,
  ...props
}, ref) => {
  const [isRendered, setIsRendered] = useState(open);

  useEffect(() => {
    if (open) {
      setIsRendered(true);
    } else {
      // Wait for animation to finish before removing from DOM
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 300); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!isRendered) {
    return null;
  }
  
  const isFloating = variant === 'floating';
  const shouldShowDivider = showDivider && !isFloating;
  const isMultiLineLayout = !!icon;

  const SizedIcon = icon && React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, { className: cn((icon as React.ReactElement<any>).props.className, 'text-2xl') })
    : icon;


  return (
    <div
      ref={ref}
      className={cn(
        'w-full bg-surface-container transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden',
        open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
        isFloating && 'rounded-2xl',
        className
      )}
      role="status"
      {...props}
    >
        {isMultiLineLayout ? (
            // Multi-line layout with icon (responsive for compact, medium, and expanded windows)
            <>
              <div
                className={cn(
                  'flex flex-col lg:flex-row lg:items-center',
                  'pl-4 lg:pl-6 pr-2',
                  'pt-6 pb-2 lg:py-3'
                )}
              >
                {/* Icon & Text content */}
                <div
                  className={cn(
                    'flex-1 flex items-center',
                    'gap-4 lg:gap-8',
                  )}
                >
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary text-on-primary">
                    {SizedIcon}
                  </div>
                  <div className="flex-1 body-medium text-on-surface">
                    {children}
                  </div>
                </div>

                {/* Actions */}
                {actions && (
                  <div
                    className={cn(
                      'flex justify-end gap-2 flex-shrink-0',
                      'pt-2 lg:pt-0',
                      'lg:ml-[38px]'
                    )}
                  >
                    {actions}
                  </div>
                )}
              </div>
              {shouldShowDivider && <Divider />}
            </>
        ) : (
            // One-line layout without icon (responsive for compact, medium, and expanded windows)
            <>
                <div className="flex items-center pl-4 lg:pl-6 pr-2 py-3">
                    <div className="flex-1 body-medium text-on-surface mr-9 lg:mr-[90px]">
                      {children}
                    </div>
                    {actions && (
                      <div className="flex-shrink-0 flex items-center gap-2">
                        {actions}
                      </div>
                    )}
                </div>
                {shouldShowDivider && <Divider />}
            </>
        )}
    </div>
  );
});

Banner.displayName = 'Banner';
