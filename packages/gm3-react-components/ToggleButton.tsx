import React from 'react';
import { Icon } from './Icons';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export type ToggleButtonVariant =
  'standard' | 'filled' | 'tonal' | 'outlined' |
  'gm2-standard' | 'gm2-filled' | 'gm2-tonal' | 'gm2-outlined';

export type ToggleButtonSize = 'xsmall' | 'small';

const sizeStyles = {
  xsmall: {
    container: 'h-[32px]',
    iconOnly: 'w-[32px]',
    padding: 'px-3',
    gap: 'gap-1',
    iconSize: 'text-[20px]',
  },
  small: {
    container: 'h-[40px]',
    iconOnly: 'w-[40px]',
    padding: 'px-4',
    gap: 'gap-2',
    iconSize: 'text-2xl',
  }
};

const modernVariantStyles = {
  standard: {
    unchecked: 'text-on-surface-variant',
    checked: 'text-primary',
    disabled: 'text-on-surface-38',
  },
  filled: {
    unchecked: 'bg-surface-container text-on-surface-variant',
    checked: 'bg-primary text-on-primary',
    disabled: 'bg-on-surface-12 text-on-surface-38',
  },
  tonal: {
    unchecked: 'bg-secondary-container text-on-secondary-container',
    checked: 'bg-secondary text-on-secondary',
    disabled: 'bg-on-surface-12 text-on-surface-38',
  },
  outlined: {
    base: 'border',
    unchecked: 'border-outline-variant text-on-surface-variant',
    checked: 'bg-inverse-surface text-inverse-on-surface border-transparent',
    disabled: 'border-on-surface-12 text-on-surface-38',
  },
};

const gm2VariantStyles = {
  standard: {
    base: 'border-transparent',
    unchecked: 'text-on-surface-variant',
    checked: 'bg-secondary-container text-on-secondary-container',
    disabledUnchecked: 'text-on-surface-38',
    disabledChecked: 'bg-on-surface-12 text-on-surface-38',
  },
  filled: {
    base: 'border-transparent',
    unchecked: 'bg-surface-container-highest text-primary',
    checked: 'bg-primary text-on-primary',
    disabledUnchecked: 'bg-on-surface-12 text-on-surface-38',
    disabledChecked: 'bg-on-surface-12 text-on-surface-38',
  },
  tonal: {
    base: 'border-transparent',
    unchecked: 'bg-surface-container-highest text-on-surface-variant',
    checked: 'bg-secondary-container text-on-secondary-container',
    disabledUnchecked: 'bg-on-surface-12 text-on-surface-38',
    disabledChecked: 'bg-on-surface-12 text-on-surface-38',
  },
  outlined: {
    base: 'border',
    unchecked: 'border-outline-variant text-on-surface-variant',
    checked: 'border-transparent bg-secondary-container text-on-secondary-container',
    disabledUnchecked: 'border-on-surface-12 text-on-surface-38',
    disabledChecked: 'border-transparent bg-on-surface-12 text-on-surface-38',
  },
};

export interface ToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  variant?: ToggleButtonVariant;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  icon?: React.ReactNode;
  children?: React.ReactNode; // For label
  size?: ToggleButtonSize;
}

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(({
  variant = 'standard',
  checked,
  onCheckedChange,
  icon,
  children,
  size = 'small',
  className,
  disabled = false,
  ...props
}, ref) => {
  const isGm2 = variant.startsWith('gm2-');

  if (isGm2) {
    const gm2Variant = variant.substring(4) as keyof typeof gm2VariantStyles;
    const styles = gm2VariantStyles[gm2Variant] || gm2VariantStyles.standard;

    return (
      <button
        ref={ref}
        onClick={() => onCheckedChange?.(!checked)}
        disabled={disabled}
        aria-pressed={checked}
        className={cn(
          'relative w-[40px] h-[40px] inline-flex items-center justify-center rounded-full overflow-hidden',
          'transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:pointer-events-none',
          !disabled && 'button--state-layer',

          styles.base,
          disabled
            ? (checked ? styles.disabledChecked : styles.disabledUnchecked)
            : (checked ? styles.checked : styles.unchecked),

          className
        )}
        {...props}
      >
        {React.Children.map(icon, child =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, {
              className: cn((child as React.ReactElement<any>).props.className, 'text-2xl', checked && 'filled-icon')
            })
            : child
        )}
      </button>
    );
  }

  // --- Modern Variants ---
  const modernVariant = variant as keyof typeof modernVariantStyles;
  const styles = modernVariantStyles[modernVariant] || modernVariantStyles.standard;
  const hasLabel = children != null;
  const sizeStyle = sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.small;

  const finalIcon = checked && React.isValidElement(icon) && icon.type === Icon
    ? React.cloneElement(icon as React.ReactElement<any>, { className: cn((icon as React.ReactElement<any>).props.className, 'filled-icon') })
    : icon;

  const sizedIcon = finalIcon && React.isValidElement(finalIcon)
    ? React.cloneElement(finalIcon as React.ReactElement<any>, {
      className: cn((finalIcon as React.ReactElement<any>).props.className, sizeStyle.iconSize)
    })
    : finalIcon;

  return (
    <button
      ref={ref}
      onClick={() => onCheckedChange?.(!checked)}
      disabled={disabled}
      aria-pressed={checked}
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center overflow-hidden label-large',
        // Animation
        'transition-all duration-medium3 ease-standard',
        // Accessibility & Interaction
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'disabled:pointer-events-none',
        // State-based radius
        checked
          ? 'rounded-[12px]'
          : (size === 'small' ? 'rounded-[20px]' : 'rounded-[16px]'),
        // State layer
        !disabled && 'button--state-layer',

        // Sizing
        sizeStyle.container,
        hasLabel ? sizeStyle.padding : sizeStyle.iconOnly,
        hasLabel && sizeStyle.gap,

        // Variant Styles
        'base' in styles && (styles as any).base, // For border
        disabled ? styles.disabled : (checked ? styles.checked : styles.unchecked),
        disabled && modernVariant === 'outlined' && 'border-on-surface-12',

        className
      )}
      {...props}
    >
      {sizedIcon}
      {children && <span className="truncate">{children}</span>}
    </button>
  );
});

ToggleButton.displayName = 'ToggleButton';