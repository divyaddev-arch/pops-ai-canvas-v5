import React, { useState } from 'react';
import { Icon } from '../Icons';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

type HeaderVariant = 'canvas' | 'floating' | 'full-width' | 'nav';

const variantStyles = {
  canvas: {
    container: 'h-[65px] pl-[20px] pr-[12px]',
    title: 'title-small',
  },
  floating: {
    container: 'h-[40px] pl-[20px] pr-[15px]',
    title: 'title-small',
  },
  'full-width': {
    container: 'h-[40px] pl-[20px] pr-[15px]',
    title: 'title-small',
  },
  nav: {
    container: 'h-[32px] pl-[12px] pr-[0px]',
    title: 'label-large',
  }
};

export interface HeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  variant: HeaderVariant;
  title: React.ReactNode;
  children?: React.ReactNode; // For actions
  centerActions?: React.ReactNode;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(({
  variant,
  title,
  children,
  centerActions,
  isExpanded,
  onToggleExpand,
  className,
  onCheckedChange,
  checked,
  ...props
}, ref) => {
  const [isChildHovered, setIsChildHovered] = useState(false);
  const styles = variantStyles[variant as keyof typeof variantStyles] || variantStyles.canvas;
  const isNav = variant === 'nav';
  const isExpandableHeader = variant === 'floating' || variant === 'full-width';
  const isExpandable = isExpandableHeader && !!onToggleExpand;

  const Component = isExpandable ? 'button' : 'header';

  const commonProps = {
    ...props,
    ref: ref as any,
    className: cn(
      'w-full flex items-center text-on-surface',
      styles.container,
      !isNav && 'bg-surface',
      // A non-expandable header gets a bottom border unless it's a nav header.
      // An expandable header's border is managed by its parent (e.g., ExpansionPanel).
      !isExpandable && !isNav && 'border-b border-outline-variant',
      isExpandable && 'text-left focus:outline-none relative',
      className
    ),
    ...(isExpandable && { onClick: onToggleExpand, 'aria-expanded': isExpanded }),
  };

  return React.createElement(Component, commonProps,
    <>
      <div className="flex-1 flex items-center gap-4 min-w-0">
        <div className={cn("flex items-center gap-2 min-w-0", isExpandable && 'mr-4')}>
            {variant === 'canvas' && <Icon className="text-[20px] text-on-surface-variant flex-shrink-0">code_blocks</Icon>}
            <div className={cn('truncate', styles.title)}>
                {title}
            </div>
        </div>
        {centerActions && (
            <div className="flex items-center gap-[8px] flex-shrink-0">
                {centerActions}
            </div>
        )}
      </div>

      <div className="flex items-center gap-[12px] flex-shrink-0 ml-4">
        {children && (
          <div
            className="flex items-center gap-2"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onMouseEnter={() => setIsChildHovered(true)}
            onMouseLeave={() => setIsChildHovered(false)}
          >
            {children}
          </div>
        )}
        {isExpandable && (
          <Icon className={cn('transition-transform duration-200 text-on-surface-variant', isExpanded && 'rotate-180')}>
            expand_more
          </Icon>
        )}
      </div>
    </>
  );
});

Header.displayName = 'Header';
