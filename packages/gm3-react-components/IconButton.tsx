import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const iconButtonSizeStyles = {
    xsmall: {
        height: 'h-[32px]',
        width: { narrow: 'w-[28px]', default: 'w-[32px]', wide: 'w-[40px]' },
        iconSize: 'text-[20px]'
    },
    small: {
        height: 'h-[40px]',
        width: { narrow: 'w-[32px]', default: 'w-[40px]', wide: 'w-[52px]' },
        iconSize: 'text-[24px]'
    },
    medium: {
        height: 'h-[56px]',
        width: { narrow: 'w-[48px]', default: 'w-[56px]', wide: 'w-[72px]' },
        iconSize: 'text-[24px]'
    },
    large: {
        height: 'h-[96px]',
        width: { narrow: 'w-[64px]', default: 'w-[96px]', wide: 'w-[128px]' },
        iconSize: 'text-[32px]'
    },
    xlarge: {
        height: 'h-[136px]',
        width: { narrow: 'w-[104px]', default: 'w-[136px]', wide: 'w-[184px]' },
        iconSize: 'text-[40px]'
    }
};
export type IconButtonSize = keyof typeof iconButtonSizeStyles;
export type IconButtonWidth = 'narrow' | 'default' | 'wide';


const iconButtonVariantStyles = {
    standard: {
        base: 'text-on-surface-variant',
        disabled: 'disabled:text-on-surface-38'
    },
    filled: {
        base: 'bg-primary text-on-primary',
        disabled: 'disabled:bg-on-surface-10 disabled:text-on-surface-38'
    },
    tonal: {
        base: 'bg-secondary-container text-on-secondary-container',
        disabled: 'disabled:bg-on-surface-10 disabled:text-on-surface-38'
    },
    outlined: {
        base: 'border border-outline-variant text-on-surface-variant',
        disabled: 'disabled:border-outline-variant disabled:text-on-surface-38'
    }
}
export type IconButtonVariant = keyof typeof iconButtonVariantStyles;


export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: IconButtonSize;
    variant?: IconButtonVariant;
    width?: IconButtonWidth;
    onCheckedChange?: (checked: boolean) => void;
    checked?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ 
    children, 
    className, 
    size = 'small', 
    variant = 'standard', 
    width = 'default',
    onCheckedChange,
    checked,
    ...props 
}, ref) => {
    const sizeStyle = iconButtonSizeStyles[size as keyof typeof iconButtonSizeStyles] || iconButtonSizeStyles.small;
    const widthClass = sizeStyle.width[width as keyof typeof sizeStyle.width] || sizeStyle.width.default;
    const variantStyle = iconButtonVariantStyles[variant as keyof typeof iconButtonVariantStyles] || iconButtonVariantStyles.standard;

    const sizedChildren = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            const el = child as React.ReactElement<any>;
            return React.cloneElement(el, {
                className: cn(el.props.className, sizeStyle.iconSize)
            } as React.HTMLAttributes<HTMLElement>);
        }
        return child;
    });

    return (
        <button
            ref={ref}
            {...props}
            className={cn(
                'relative inline-flex items-center justify-center rounded-full overflow-hidden',
                'transition-[border-radius,background-color,color] duration-medium3 ease-standard focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                'disabled:pointer-events-none',
                !props.disabled && 'button--state-layer',
                sizeStyle.height,
                widthClass,
                variantStyle.base,
                variantStyle.disabled,
                className
            )}
        >
            {sizedChildren}
        </button>
    );
});
IconButton.displayName = 'IconButton';