import React from 'react';
import { Icon } from '../Icons';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'assist' | 'filter' | 'input' | 'suggestion' | 'in-line';
  elevated?: boolean;
  selected?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onTrailingIconClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(({
  label,
  variant = 'assist',
  elevated = false,
  selected = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  onTrailingIconClick,
  className,
  ...props
}, ref) => {
  const isFilter = variant === 'filter';
  const isInput = variant === 'input';
  const isAssistOrSuggestion = variant === 'assist' || variant === 'suggestion';
  const isInline = variant === 'in-line';

  // In filter chips, a checkmark is shown when selected
  const showCheck = isFilter && selected;
  const hasLeadingContent = !!leadingIcon || showCheck;
  const hasTrailingIcon = !!trailingIcon;

  const handleTrailingClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation(); // Prevent Chip's main onClick from firing
    onTrailingIconClick?.(e);
  };
  
  const SizedIcon = ({ icon }: { icon: React.ReactNode }) => {
    if (!icon || !React.isValidElement(icon)) return null;

    const isMaterialIcon = icon.type === Icon;

    let sizeClass: string;
    if (isInline) {
        // Use width/height for SVGs and font-size for font icons
        sizeClass = isMaterialIcon ? 'text-[16px]' : 'w-4 h-4';
    } else {
        sizeClass = isMaterialIcon ? 'text-[18px]' : 'w-[18px] h-[18px]';
    }

    return React.cloneElement(icon as React.ReactElement<any>, { className: cn((icon as React.ReactElement<any>).props.className, sizeClass) });
  }

  const leadingIconWithFilled = isInline && leadingIcon && React.isValidElement(leadingIcon) && leadingIcon.type === Icon
      ? React.cloneElement(leadingIcon as React.ReactElement<any>, { className: cn((leadingIcon as React.ReactElement<any>).props.className, 'filled-icon') })
      : leadingIcon;

  const chipClasses = cn(
    'relative inline-flex justify-center items-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary overflow-hidden',
    // --- Height, Radius, Font ---
    isInline 
      ? 'h-[18px] rounded-full label-large' 
      : 'h-[32px] rounded-[8px] label-large',
    // --- Padding & Spacing ---
    isInline
      ? cn(
          'gap-x-0.5', // 2px gap
          hasLeadingContent ? 'pl-[2px]' : 'pl-[4px]',
          hasTrailingIcon ? 'pr-[4px]' : 'pr-[4px]'
        )
      : cn('gap-x-2', hasLeadingContent ? 'pl-2' : 'pl-4', hasTrailingIcon ? 'pr-2' : 'pr-4'),
    // --- Disabled State ---
    disabled 
      ? 'text-on-surface-38 border border-on-surface-12 shadow-none'
      : 'button--state-layer',
    // --- Non-Disabled States ---
    !disabled && (
      (selected && (isFilter || isInput || isInline))
        ? 'bg-secondary-container text-on-secondary-container'
        : isInline
          ? 'bg-surface-container-high text-on-surface'
          : cn(
              isInput ? 'text-on-surface-variant' : 'text-on-surface',
              elevated
                ? 'bg-surface-container-low shadow-elevation-1'
                : 'border border-outline-variant'
            )
    ),
    className
  );
  
  const leadingIconColorClasses = cn(
    !disabled && !selected && isAssistOrSuggestion && "text-primary"
  );

  return (
    <button
      ref={ref}
      disabled={disabled}
      aria-pressed={isFilter || isInline ? selected : undefined}
      className={chipClasses}
      {...props}
    >
      {showCheck && <Icon className="text-[18px]">check</Icon>}
      
      {leadingIcon && (
        <span className={leadingIconColorClasses}>
          <SizedIcon icon={leadingIconWithFilled} />
        </span>
      )}
      
      <span className="truncate">{label}</span>
      
      {trailingIcon && (
        <span
          role={onTrailingIconClick ? 'button' : undefined}
          aria-label={onTrailingIconClick ? 'Remove' : undefined}
          onClick={onTrailingIconClick ? handleTrailingClick : undefined}
          className={cn(
            'flex items-center justify-center',
            onTrailingIconClick && 'cursor-pointer',
          )}
        >
          <SizedIcon icon={trailingIcon} />
        </span>
      )}
    </button>
  );
});

Chip.displayName = "Chip";