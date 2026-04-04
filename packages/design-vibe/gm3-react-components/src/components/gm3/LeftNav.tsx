import React from 'react';
import { Icon } from '../Icons';
import { Divider } from './Divider';
import { Scrollbar } from './Scrollbar';
import { ListItem, ListItemProps } from './ListItem';
import { Header } from './Header';
import { IconButton } from './IconButton';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- LeftNavItem ---
export interface LeftNavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  selected?: boolean;
  isExpanded?: boolean; // Injected by LeftNav
  isHighlighted?: boolean;
}

export const LeftNavItem = React.forwardRef<HTMLButtonElement, LeftNavItemProps>(
  ({ label, icon, badge, trailingIcon, selected = false, disabled = false, isExpanded = false, isHighlighted = false, className, ...props }, ref) => {
    
    const trailingContent = badge ?? trailingIcon;

    return (
      <ListItem
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        variant="nav-desktop-compact"
        headline={label}
        leadingContent={icon}
        trailingContent={trailingContent}
        selected={selected}
        disabled={disabled}
        navCollapsed={!isExpanded}
        className={cn(className, isHighlighted && 'ring-2 ring-primary ring-inset')}
        {...props}
      />
    );
  }
);
LeftNavItem.displayName = 'LeftNavItem';

// --- LeftNavSectionLabel ---
export interface LeftNavSectionLabelProps {
  children: React.ReactNode;
  isExpanded?: boolean; // Injected by LeftNav
  actions?: React.ReactNode;
}

export const LeftNavSectionLabel: React.FC<LeftNavSectionLabelProps> = ({ children, isExpanded, actions }) => {
  if (!isExpanded) {
    // Render a spacer to preserve vertical layout without showing the label or a divider.
    return <div className="h-[36px] mt-4" aria-hidden="true" />;
  }
  return (
    <div className="h-[36px] flex items-center w-full mt-4">
        <Header variant="nav" title={children} className="w-full">
            {actions}
        </Header>
    </div>
  );
};
LeftNavSectionLabel.displayName = 'LeftNavSectionLabel';

// --- LeftNav ---
export interface LeftNavProps extends React.HTMLAttributes<HTMLElement> {
    isExpanded: boolean;
    headerTitle: React.ReactNode;
    onToggleExpand: () => void;
    children: React.ReactNode;
    fab?: React.ReactNode;
    footer?: React.ReactNode;
    fixedFooter?: React.ReactNode;
    headerActions?: React.ReactNode;
    onHeaderTitleClick?: () => void;
    /** A slot for a search component, positioned above the main navigation items. */
    search?: React.ReactNode;
    /**
     * Whether to show a divider line above the fixed footer.
     * @default true
     */
    showFixedFooterDivider?: boolean;
    /**
     * Whether to show the built-in header with the title and menu button.
     * @default true
     */
    showHeader?: boolean;
}

export const LeftNav = React.forwardRef<HTMLElement, LeftNavProps>(({ isExpanded, headerTitle, onToggleExpand, fab, footer, fixedFooter, showFixedFooterDivider = true, showHeader = true, children, className, headerActions, onHeaderTitleClick, search, ...props }, ref) => {
    const headerContent = (
        <div className={cn(
            "h-[64px] flex items-center justify-between w-full transition-all duration-300 ease-in-out",
            isExpanded ? 'pl-[10px]' : 'pl-[16px]',
            'pr-2' // Consistent padding on the right
        )}>
            <div className="flex items-center flex-1 min-w-0">
                <IconButton
                    onClick={onToggleExpand}
                    aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
                >
                    <Icon>menu</Icon>
                </IconButton>
                <button
                    onClick={onHeaderTitleClick}
                    disabled={!onHeaderTitleClick || !isExpanded}
                    className={cn(
                        "text-[18px] leading-snug text-on-surface-variant truncate transition-all duration-300 ease-in-out text-left p-0 bg-transparent border-none",
                        isExpanded ? "opacity-100 ml-3 flex-1" : "opacity-0 w-0",
                        !onHeaderTitleClick ? "pointer-events-none" : "cursor-pointer"
                    )}
                    tabIndex={isExpanded ? 0 : -1}
                    aria-hidden={!isExpanded}
                >
                    {headerTitle}
                </button>
            </div>
            <div className={cn(
                "flex-shrink-0 transition-opacity duration-200 ease-in-out",
                isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}>
              {headerActions}
            </div>
        </div>
    );
    
    const processNavChildren = (nodes: React.ReactNode) => {
        return React.Children.toArray(nodes).map(child => {
            if (React.isValidElement(child)) {
                // Check if the child is one of the target components
                if (
                    (child.type as any).displayName === LeftNavItem.displayName ||
                    (child.type as any).displayName === LeftNavSectionLabel.displayName
                ) {
                    return React.cloneElement(child, { isExpanded } as any);
                }
            }
            return child;
        });
    };

    const childrenWithProps = processNavChildren(children);
    const fixedFooterWithProps = processNavChildren(fixedFooter);

    return (
        <nav
            ref={ref}
            className={cn(
                'bg-surface-container-low flex-shrink-0 h-full flex flex-col transition-[width] duration-300 ease-in-out overflow-hidden',
                isExpanded ? 'w-[256px]' : 'w-[72px]',
                className
            )}
            {...props}
        >
            {showHeader && headerContent}
            {fab && (
                <div className={cn(
                    "pt-2 mb-4 px-2 flex transition-all duration-300 ease-in-out",
                    isExpanded ? 'justify-start' : 'justify-center'
                )}>
                    {React.isValidElement<{ expanded: boolean }>(fab)
                        ? React.cloneElement(fab, { expanded: isExpanded })
                        : fab
                    }
                </div>
            )}
             {search && (
                <div className="px-2 mb-4">
                    {search}
                </div>
            )}
            <Scrollbar className="flex-1 min-h-0">
                <div className={cn(
                    "flex flex-col px-[8px] pb-3",
                    !isExpanded && "items-center"
                )}>
                    {childrenWithProps}
                </div>
            </Scrollbar>

            {fixedFooterWithProps && (
                <div className={cn(
                    "flex-shrink-0",
                    showFixedFooterDivider && "border-t border-outline-variant"
                )}>
                    <div className={cn(
                        "flex flex-col px-[8px] py-2",
                        !isExpanded && "items-center"
                    )}>
                        {fixedFooterWithProps}
                    </div>
                </div>
            )}
            
             {footer && (
                <div className={cn(
                    "flex-shrink-0 transition-opacity duration-200 ease-in-out",
                    isExpanded ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'
                )}>
                    {footer}
                </div>
            )}
        </nav>
    );
});
LeftNav.displayName = 'LeftNav';