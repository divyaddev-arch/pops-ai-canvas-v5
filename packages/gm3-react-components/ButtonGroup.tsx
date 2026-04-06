import React from 'react';
import { Button, type ButtonProps } from './Button';
import { ToggleButton, type ToggleButtonProps } from './ToggleButton';
import { Icon } from './Icons';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement<(ButtonProps | ToggleButtonProps) & { value?: string }> | React.ReactElement<(ButtonProps | ToggleButtonProps) & { value?: string }>[];
  variant?: 'standard' | 'segmented' | 'connected' | 'gm2-segmented';
  /** For 'connected', 'segmented', and 'standard' variants, determines selection behavior. */
  selectionMode?: 'single' | 'multiple';
  /** For 'connected', 'segmented', and 'standard' variants, the value(s) of the selected button(s). */
  value?: string | string[];
  /** For 'connected', 'segmented', and 'standard' variants, callback when selection changes. */
  onValueChange?: (value: string | string[]) => void;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className, variant = 'standard', selectionMode = 'single', value, onValueChange }) => {
  const childrenArray = React.Children.toArray(children);
  const count = childrenArray.length;

  if (variant === 'gm2-segmented') {
    return (
      <div className={cn("inline-flex border border-outline rounded-full overflow-hidden", className)}>
        {React.Children.map(childrenArray, (child, index) => {
          if (!React.isValidElement(child)) {
            return child;
          }
          const el = child as React.ReactElement<any>;

          const isSelected = el.props.value === value;
          const selectedStyle = isSelected ? { backgroundColor: 'rgba(var(--color-secondary-rgb), 0.28)' } : {};

          return (
            <>
              {index > 0 && <div className="w-px bg-outline" />}
              {React.cloneElement(el, {
                variant: 'text',
                size: 'xsmall', // Use xsmall for 32px height
                className: cn(
                  el.props.className,
                  '!rounded-none !transition-[background-color,color] !duration-medium3 !ease-standard no-state-layer',
                  // Apply selected/deselected styles as requested
                  isSelected
                    ? '!text-on-secondary-container' // Selected: text/icon color
                    : 'bg-surface !text-on-surface'                         // Deselected: bg and text color
                ),
                style: { ...el.props.style, ...selectedStyle },
                icon: isSelected ? <Icon className="text-2xl animate-check-in">check</Icon> : el.props.icon,
                onClick: () => onValueChange?.(el.props.value),
              })}
            </>
          );
        })}
      </div>
    );
  }

  if (variant === 'segmented') {
    return (
      <div className={cn("inline-flex items-center p-1 rounded-full bg-surface-container-high", className)}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) {
            return child;
          }
          const el = child as React.ReactElement<any>;

          const isSelected = el.props.value === value;

          const style = isSelected
            ? { ...el.props.style, color: 'var(--color-on-secondary-container)' }
            : { ...el.props.style, color: 'var(--color-on-surface)' };

          return React.cloneElement(el, {
            size: 'xxsmall',
            variant: 'text',
            style: style,
            className: cn(
              el.props.className,
              '!rounded-full !transition-colors !duration-200 !h-6 !leading-none',
              isSelected
                ? 'bg-secondary-container'
                : 'hover:bg-on-surface/10',
              'no-state-layer'
            ),
            onClick: () => onValueChange?.(el.props.value),
          });
        })}
      </div>
    );
  }

  if (variant === 'connected') {
    return (
        <div className={cn("inline-flex items-center gap-[2px]", className)} role="group">
            {React.Children.map(childrenArray, (child, index) => {
                if (!React.isValidElement(child)) return child;
                const el = child as React.ReactElement<any>;

                const isFirst = index === 0;
                const isLast = index === count - 1;

                const isSelected = selectionMode === 'single'
                    ? value === el.props.value
                    : Array.isArray(value) && value.includes(el.props.value);

                const handleClick = (newCheckedState: boolean) => {
                    if (!onValueChange || !el.props.value) return;
                    if (selectionMode === 'single') {
                        if (newCheckedState) {
                            onValueChange(el.props.value);
                        }
                    } else {
                        const currentValues = Array.isArray(value) ? (value as string[]) : [];
                        if (newCheckedState) {
                            onValueChange([...currentValues, el.props.value]);
                        } else {
                            onValueChange(currentValues.filter(v => v !== el.props.value));
                        }
                    }
                };

                const buttonSize = el.props.size || 'small';
                const innerRadius = buttonSize === 'small' ? '8px' : '4px';
                const outerRadius = '20px';

                const borderRadiusStyle: React.CSSProperties = {};
                if (count > 1) {
                    if (isSelected) {
                        borderRadiusStyle.borderRadius = outerRadius;
                    } else {
                        if (isFirst) {
                            borderRadiusStyle.borderTopLeftRadius = outerRadius;
                            borderRadiusStyle.borderBottomLeftRadius = outerRadius;
                            borderRadiusStyle.borderTopRightRadius = innerRadius;
                            borderRadiusStyle.borderBottomRightRadius = innerRadius;
                        } else if (isLast) {
                            borderRadiusStyle.borderTopRightRadius = outerRadius;
                            borderRadiusStyle.borderBottomRightRadius = outerRadius;
                            borderRadiusStyle.borderTopLeftRadius = innerRadius;
                            borderRadiusStyle.borderBottomLeftRadius = innerRadius;
                        } else {
                            borderRadiusStyle.borderRadius = innerRadius;
                        }
                    }
                }

                return React.cloneElement(el, {
                    onCheckedChange: handleClick,
                    checked: isSelected,
                    className: cn(
                        el.props.className,
                        'relative focus:z-10',
                        'no-state-layer',
                        'focus-visible:ring-0 focus-visible:ring-offset-0'
                    ),
                    style: { ...el.props.style, ...borderRadiusStyle },
                });
            })}
        </div>
    );
  }

  // Standard variant
  return (
    <div className={cn("inline-flex items-center gap-2", className)} role="group">
      {React.Children.map(childrenArray, (child) => {
        if (!React.isValidElement(child)) {
          return child;
        }
        const el = child as React.ReactElement<any>;

        const isSelected = selectionMode === 'single'
            ? value === el.props.value
            : Array.isArray(value) && value.includes(el.props.value);

        const handleClick = (newCheckedState: boolean) => {
            if (!onValueChange || !el.props.value) return;
            if (selectionMode === 'single') {
                if (newCheckedState) {
                    onValueChange(el.props.value);
                }
            } else {
                const currentValues = Array.isArray(value) ? (value as string[]) : [];
                if (newCheckedState) {
                    onValueChange([...currentValues, el.props.value]);
                } else {
                    onValueChange(currentValues.filter(v => v !== el.props.value));
                }
            }
        };

        return React.cloneElement(el, {
          onCheckedChange: handleClick,
          checked: isSelected,
        });
      })}
    </div>
  );
};