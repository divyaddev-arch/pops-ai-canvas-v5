import React, { useRef, useEffect, useImperativeHandle } from 'react';
import { Icon } from './Icons';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked' | 'type'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
}

/**
 * A Material Design Checkbox component.
 * It's recommended to pair this with a <label> for accessibility.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  className,
  id,
  ...props
}, ref) => {
  const localRef = useRef<HTMLInputElement>(null);

  // Allow parent to access the input element ref
  useImperativeHandle(ref, () => localRef.current!, []);

  // The native input's `indeterminate` property must be set via JavaScript
  useEffect(() => {
    if (localRef.current) {
      localRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={cn(
      "relative inline-flex items-center justify-center w-[40px] h-[40px] rounded-full",
      className,
      // State layer classes moved to the container. The ripple color for unchecked
      // now correctly matches the border color.
      !disabled && "button--state-layer",
      !disabled && (checked || indeterminate) ? "text-primary" : "text-on-surface-variant"
    )}>
      <input
        type="checkbox"
        id={id}
        ref={localRef}
        checked={checked && !indeterminate}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="absolute w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        aria-checked={indeterminate ? 'mixed' : checked}
        {...props}
      />
      {/* Visual Box: Renders the checkmark and box. It has pointer-events-none so clicks pass through. */}
      <div className={cn(
        "w-[18px] h-[18px] rounded-sm border-2 flex items-center justify-center transition-colors duration-100 pointer-events-none relative",
        // Disabled States
        disabled && (checked || indeterminate) && "bg-on-surface-38 border-transparent",
        disabled && !(checked || indeterminate) && "border-on-surface-38",
        // Enabled States
        !disabled && (checked || indeterminate) && "bg-primary border-primary",
        !disabled && !(checked || indeterminate) && "border-on-surface-variant",
      )}>
        {(checked || indeterminate) && (
          <Icon className={cn(
            "text-[24px]",
            disabled ? "text-surface" : "text-on-primary"
          )}>
            {indeterminate ? 'remove' : 'check_small'}
          </Icon>
        )}
      </div>
    </div>
  );
});
Checkbox.displayName = "Checkbox";
