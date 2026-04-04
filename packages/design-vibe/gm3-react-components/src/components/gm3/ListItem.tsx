import React from 'react';
import { Checkbox } from './Checkbox';
import { RadioButton } from './RadioButton';
import { Switch } from './Switch';
import { Icon } from '../Icons';
import { IconButton } from './IconButton';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface ListItemSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  compact?: boolean;
  disabled?: boolean;
}

export interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  headline: React.ReactNode;
  overline?: React.ReactNode;
  supportingText?: React.ReactNode;
  leadingContent?: React.ReactNode;
  trailingContent?: React.ReactNode;
  disabled?: boolean;
  variant?: 'default' | 'compact' | 'nav-desktop' | 'nav-desktop-compact' | 'nav-mobile';
  selected?: boolean;
  /**
   * If true, the selected item will have fully rounded corners,
   * creating a "pill" shape. This is typically used for navigation items.
   * @default false
   */
  selectedRounded?: boolean;
  /**
   * Provides a Switch as the trailing element.
   * This is a convenience prop and will override `trailingContent`.
   */
  trailingSwitch?: ListItemSwitchProps;
  /**
   * Renders the nav item in a collapsed state (icon only).
   * Only applies to 'nav' and 'nav-compact' variants.
   * @default false
   */
  navCollapsed?: boolean;
  /** If true, text content will not be truncated with an ellipsis. */
  disableTruncation?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
};

/**
 * A Material Design List Item component.
 * https://m3.material.io/components/lists/overview
 */
export const ListItem = React.forwardRef<HTMLElement, ListItemProps>(
  ({
    headline,
    overline,
    supportingText,
    leadingContent,
    trailingContent,
    disabled = false,
    variant = 'default',
    selected = false,
    selectedRounded = false,
    trailingSwitch,
    navCollapsed = false,
    disableTruncation = false,
    className,
    onClick,
    onCheckedChange,
    checked,
    ...props
  }, ref) => {
    const finalLeadingContent = (selected && React.isValidElement(leadingContent) && leadingContent.type === Icon)
        ? React.cloneElement(leadingContent as React.ReactElement<any>, { className: cn((leadingContent as React.ReactElement<any>).props.className, 'filled-icon') })
        : leadingContent;

    const hasTrailingSwitch = !!trailingSwitch;
    let finalTrailingContent = trailingContent;

    if (hasTrailingSwitch) {
        finalTrailingContent = (
            <Switch
                checked={trailingSwitch.checked}
                onCheckedChange={trailingSwitch.onCheckedChange}
                compact={trailingSwitch.compact}
                disabled={disabled || trailingSwitch.disabled}
            />
        );
    }

    const handleItemClick = (e: React.MouseEvent<HTMLElement>) => {
        onClick?.(e);

        if (hasTrailingSwitch && !trailingSwitch.disabled) {
            if ((e.target as HTMLElement).closest('[role="switch"]')) {
                return;
            }
            trailingSwitch.onCheckedChange(!trailingSwitch.checked);
        }
    };

    const hasInteractiveInLeading = React.isValidElement(finalLeadingContent) && (
        finalLeadingContent.type === Checkbox ||
        finalLeadingContent.type === RadioButton ||
        finalLeadingContent.type === Switch
    );
    const hasInteractiveInTrailing = React.isValidElement(finalTrailingContent) && (
        finalTrailingContent.type === Checkbox || 
        finalTrailingContent.type === RadioButton ||
        finalTrailingContent.type === Switch
    );

    const isInteractive = !!onClick || hasTrailingSwitch;
    const hasInteractiveChild = hasInteractiveInLeading || hasInteractiveInTrailing || hasTrailingSwitch;

    // A button cannot contain another button or interactive element like a switch or checkbox.
    // If we have an interactive child, we must use a non-button container (li).
    const Component = (isInteractive && !hasInteractiveChild) ? 'button' : 'li';

    if (variant === 'nav-desktop' || variant === 'nav-desktop-compact' || variant === 'nav-mobile') {
      const isMobile = variant === 'nav-mobile';
      const isCompact = variant === 'nav-desktop-compact';

      let heightClass: string, labelClass: string, paddingStyle: React.CSSProperties, transitionClass: string;

      if (isMobile) {
          heightClass = navCollapsed ? 'h-[32px]' : 'h-[56px]';
          labelClass = 'body-large';
          // When collapsed, center icon in a 56px wide space. When expanded, use more padding on the left.
          paddingStyle = navCollapsed
              ? { padding: '0 18px' }
              : { paddingLeft: '18px', paddingRight: '12px' };
          transitionClass = 'transition-[height,padding] duration-300 ease-in-out';
      } else { // Desktop variants
          heightClass = isCompact ? 'h-[36px]' : 'h-[48px]';
          labelClass = isCompact ? 'label-medium' : 'body-large';
          paddingStyle = navCollapsed
              ? { padding: '0 18px' }
              : { padding: '0 12px' };
          transitionClass = 'transition-[padding] duration-300 ease-in-out';
      }

      const SizedIcon = ({ icon }: { icon: React.ReactNode }) => {
        if (!icon || !React.isValidElement(icon)) return icon;

        const isMaterialIcon = icon.type === Icon;
        const iconEl = icon as React.ReactElement<any>;

        if (isMaterialIcon) {
            // Font icons are sized with font-size
            return React.cloneElement(iconEl, { className: cn(iconEl.props.className, 'text-[20px]') });
        } else {
            // SVGs are sized with explicit, important width/height to avoid subpixel/override issues
            const existingClasses = iconEl.props.className?.split(' ').filter((c: string) => !c.startsWith('w-') && !c.startsWith('h-')) || [];
            return React.cloneElement(iconEl, { className: cn(...existingClasses, '!w-[20px]', '!h-[20px]') });
        }
      }

      const contentColor = disabled ? 'text-on-surface-38' : selected ? 'text-on-secondary-container' : 'text-on-surface';
      const leadingIconColor = disabled ? 'text-on-surface-38' : selected ? 'text-on-secondary-container' : 'text-on-surface-variant';

      // Nav mobile parent container
      return (
        <Component
          ref={ref as any}
          onClick={handleItemClick}
          {...(Component === 'button' ? { disabled } : {})}
          className={cn(
            'relative flex items-center text-left rounded-full overflow-hidden',
            heightClass,
            'disabled:pointer-events-none',
            isInteractive && !disabled && 'cursor-pointer button--state-layer',
            selected && !disabled && 'bg-secondary-container',
            'focus:outline-none',
            transitionClass,
            'w-full',
            className
          )}
          style={{ ...props.style, ...paddingStyle }}
          {...props}
        >
          {/* Nav mobile icon & label container */}
          <div className="flex items-center w-full">
            {finalLeadingContent && (
              <div className={cn(leadingIconColor, 'shrink-0', isInteractive && hasInteractiveInLeading && 'pointer-events-none')}>
                <SizedIcon icon={finalLeadingContent} />
              </div>
            )}
            <div className={cn(
              'flex items-center justify-between min-w-0 overflow-hidden',
              'transition-all duration-200 ease-in-out',
              navCollapsed 
                ? 'opacity-0 w-0 ml-0' 
                : 'opacity-100 flex-1 ml-3'
            )}>
              <div className={cn('flex-1', !disableTruncation && 'truncate', labelClass, contentColor)}>
                  {headline}
              </div>
              {finalTrailingContent && (
                  <div className={cn(
                      'ml-2 label-medium shrink-0',
                      disabled ? 'text-on-surface-38' : 'text-on-surface-variant',
                      selected && !disabled && 'text-on-secondary-container',
                      isInteractive && hasInteractiveInTrailing && 'pointer-events-none'
                  )}>
                  {finalTrailingContent}
                  </div>
              )}
            </div>
          </div>
        </Component>
      );
    }

    if (variant === 'compact') {
      const SizedIcon = ({ icon }: { icon: React.ReactNode }) => {
        if (!icon || !React.isValidElement(icon)) return icon;

        const isMaterialIcon = icon.type === Icon;
        const iconEl = icon as React.ReactElement<any>;

        if (isMaterialIcon) {
            // Font icons are sized with font-size
            return React.cloneElement(iconEl, { className: cn(iconEl.props.className, 'text-2xl') });
        } else {
            // SVGs are sized with explicit, important width/height to avoid subpixel/override issues
            const existingClasses = iconEl.props.className?.split(' ').filter((c: string) => !c.startsWith('w-') && !c.startsWith('h-')) || [];
            return React.cloneElement(iconEl, { className: cn(...existingClasses, '!w-[24px]', '!h-[24px]') });
        }
      }

      return (
        <Component
          ref={ref as any}
          onClick={handleItemClick}
          {...(Component === 'button' ? { disabled } : {})}
          className={cn(
            'relative w-full flex items-center px-3 gap-3 h-12 text-left',
            'disabled:pointer-events-none',
            isInteractive && !disabled && 'cursor-pointer button--state-layer text-on-surface',
            'focus:outline-none',
            className
          )}
          {...props}
        >
          {finalLeadingContent && (
            <div className={cn(disabled ? 'text-on-surface-38' : 'text-on-surface-variant', isInteractive && hasInteractiveInLeading && 'pointer-events-none')}>
              <SizedIcon icon={finalLeadingContent} />
            </div>
          )}
          <div className={cn('flex-1 body-large', !disableTruncation && 'truncate', disabled ? 'text-on-surface-38' : 'text-on-surface')}>
            {headline}
          </div>
          {finalTrailingContent && (
            <div className={cn('label-large', disabled ? 'text-on-surface-38' : 'text-on-surface-variant', isInteractive && hasInteractiveInTrailing && 'pointer-events-none')}>
              {finalTrailingContent}
            </div>
          )}
        </Component>
      );
    }

    const hasOverline = overline != null;
    const hasSupporting = supportingText != null;
    
    const isThreeLine = hasOverline && hasSupporting;
    const isTwoLine = !isThreeLine && (hasOverline || hasSupporting);
    const isOneLine = !isThreeLine && !isTwoLine;

    const heightClass =
      isThreeLine ? 'h-[88px]' :
      isTwoLine ? 'h-[72px]' :
      isOneLine && finalLeadingContent ? 'h-[56px]' :
      'h-[48px]';

    const contentColor = disabled ? 'text-on-surface-38' : selected ? 'text-on-secondary-container' : 'text-on-surface';
    const variantColor = disabled ? 'text-on-surface-38' : selected ? 'text-on-secondary-container' : 'text-on-surface-variant';

    return (
      <Component
        ref={ref as any}
        onClick={handleItemClick}
        {...(Component === 'button' ? { disabled } : {})}
        className={cn(
          'relative w-full flex items-center px-4 gap-4 text-left',
          heightClass,
          disabled && 'pointer-events-none',
          isInteractive && 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-background focus-visible:ring-primary',
          isInteractive && !disabled && 'button--state-layer',
          selected && !disabled && 'bg-secondary-container',
          selectedRounded && 'rounded-full',
          className
        )}
        {...props}
      >
        {finalLeadingContent && (
          <div className={cn('relative', variantColor, isInteractive && hasInteractiveInLeading && 'pointer-events-none')}>
            {finalLeadingContent}
          </div>
        )}

        <div className="relative flex-1 flex flex-col justify-center min-w-0">
          {overline && (
            <div className={cn('label-small', !disableTruncation && 'truncate', variantColor)}>
              {overline}
            </div>
          )}
          <div className={cn('body-large', !disableTruncation && 'truncate', contentColor)}>
            {headline}
          </div>
          {supportingText && (
            <div className={cn('body-medium', !disableTruncation && 'truncate', variantColor)}>
              {supportingText}
            </div>
          )}
        </div>

        {finalTrailingContent && (
          <div className={cn('relative', variantColor, isInteractive && hasInteractiveInTrailing && 'pointer-events-none')}>
            {finalTrailingContent}
          </div>
        )}
      </Component>
    );
  }
);

ListItem.displayName = 'ListItem';
