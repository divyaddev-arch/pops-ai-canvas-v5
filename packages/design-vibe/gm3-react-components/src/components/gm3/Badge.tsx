import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({
  children,
  className,
  ...props
}, ref) => {
  const hasContent = children != null;

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'bg-error text-on-error',
        hasContent ? 'h-[16px] min-w-[16px] px-[4px]' : 'h-[6px] w-[6px]',
        className
      )}
      {...props}
    >
      {hasContent && <span className="label-small">{children}</span>}
    </div>
  );
});

Badge.displayName = 'Badge';
