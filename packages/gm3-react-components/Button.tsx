import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- Button Size Variants ---
const sizeStyles: Record<string, { container: string, label: string, iconSize: string, iconContainerSize: string, padding: string, gap: string }> = {
  compact: {
    container: 'h-[28px]',
    label: 'label-small',
    iconSize: 'text-[16px]',
    iconContainerSize: 'w-[16px] h-[16px]',
    padding: 'px-2',
    gap: 'gap-1'
  },
  xxsmall: {
    container: 'h-[24px]',
    label: 'label-medium',
    iconSize: 'text-[18px]',
    iconContainerSize: 'w-[18px] h-[18px]',
    padding: 'px-3',
    gap: 'gap-1'
  },
  xsmall: {
    container: 'h-[32px]',
    label: 'label-large',
    iconSize: 'text-[20px]',
    iconContainerSize: 'w-[20px] h-[20px]',
    padding: 'px-3',
    gap: 'gap-1'
  },
  small: {
    container: 'h-[40px]',
    label: 'label-large',
    iconSize: 'text-[20px]',
    iconContainerSize: 'w-[20px] h-[20px]',
    padding: 'px-4',
    gap: 'gap-2'
  },
  medium: {
    container: 'h-[56px]',
    label: 'title-medium',
    iconSize: 'text-2xl',
    iconContainerSize: 'w-6 h-6',
    padding: 'px-6',
    gap: 'gap-2'
  },
  large: {
    container: 'h-[96px]',
    label: 'headline-small',
    iconSize: 'text-[32px]',
    iconContainerSize: 'w-[32px] h-[32px]',
    padding: 'px-12',
    gap: 'gap-3'
  },
  xlarge: {
    container: 'h-[136px]',
    label: 'headline-large',
    iconSize: 'text-[40px]',
    iconContainerSize: 'w-[40px] h-[40px]',
    padding: 'px-16',
    gap: 'gap-4'
  }
};

// Base styles are applied to all buttons
const baseStyles = 'relative inline-flex items-center justify-center transition-[border-radius,box-shadow,background-color,color] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary disabled:pointer-events-none overflow-hidden';

// Styles for each variant, including colors, shadows, and disabled states
const variantStyles = {
  elevated: 'bg-surface-container-low text-primary shadow-elevation-1 disabled:shadow-none disabled:bg-on-surface-10 disabled:text-on-surface-38',
  filled: 'bg-primary text-on-primary shadow-none hover:shadow-sm disabled:shadow-none disabled:bg-on-surface-10 disabled:text-on-surface-38',
  tonal: 'bg-secondary-container text-on-secondary-container shadow-none hover:shadow-sm disabled:shadow-none disabled:bg-on-surface-10 disabled:text-on-surface-38',
  outlined: 'border border-outline-variant text-primary shadow-none disabled:border-outline-variant disabled:text-on-surface-38',
  text: 'text-primary shadow-none disabled:text-on-surface-38',
  'gm2-raised': 'bg-surface text-primary shadow-elevation-1 hover:shadow-elevation-2 disabled:shadow-none disabled:bg-on-surface-10 disabled:text-on-surface-38',
  'gm2-filled': 'bg-primary text-on-primary shadow-elevation-1 hover:shadow-elevation-2 disabled:shadow-none disabled:bg-on-surface-10 disabled:text-on-surface-38',
  'gm2-outlined': 'border border-outline text-primary shadow-none disabled:border-on-surface-12 disabled:text-on-surface-38',
  'gm2-text': 'text-primary shadow-none disabled:text-on-surface-38',
};

type ButtonSize = 'compact' | 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text' | 'gm2-raised' | 'gm2-filled' | 'gm2-outlined' | 'gm2-text';
  icon?: React.ReactNode;
  size?: ButtonSize | string;
  editorId?: string;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant,
  icon,
  size = 'small',
  children,
  className,
  editorId,
  onCheckedChange,
  checked,
  ...props
}, ref) => {
  const styles = sizeStyles[size as keyof typeof sizeStyles] || sizeStyles['small'];
  const isGm2 = variant.startsWith('gm2-');

  const sizedIcon = icon && React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
      className: cn((icon as React.ReactElement<any>).props.className, styles.iconSize)
    })
    : null;

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        (variantStyles[variant as keyof typeof variantStyles] || variantStyles.filled),
        styles.container,
        styles.padding,
        styles.gap,
        !props.disabled && 'button--state-layer',
        isGm2 ? 'rounded-extra-small ease-standard duration-short4' : 'rounded-full ease-standard duration-medium3',
        className
      )}
      {...props}
    >
      {sizedIcon && <span className={cn('inline-flex items-center justify-center', styles.iconContainerSize)}>{sizedIcon}</span>}
      {children && <span className={cn('truncate', styles.label, isGm2 && 'uppercase')}>{children}</span>}
    </button>
  );
});
Button.displayName = 'Button';