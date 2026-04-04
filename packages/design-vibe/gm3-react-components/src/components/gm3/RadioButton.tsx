import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked' | 'type'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * A Material Design Radio Button component.
 * It's recommended to pair this with a <label> for accessibility.
 */
export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(({
  checked,
  onChange,
  disabled = false,
  className,
  id,
  ...props
}, ref) => {
  return (
    <div className={cn(
      "relative inline-flex items-center justify-center w-[40px] h-[40px] rounded-full",
      className,
      // State layer for interaction feedback
      !disabled && "button--state-layer",
      // Color is controlled by text color for SVG's `currentColor`
      !disabled && (checked ? "text-primary" : "text-on-surface-variant"),
      disabled && "text-on-surface-38"
    )}>
      <input
        type="radio"
        id={id}
        ref={ref}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="absolute w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        {...props}
      />
      
      {/* Visual SVG Icon */}
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="w-[20px] h-[20px] pointer-events-none"
      >
        {/* Outer circle */}
        <circle
          cx="10"
          cy="10"
          r="9"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          className="transition-colors duration-150"
        />
        {/* Inner dot */}
        <circle
          cx="10"
          cy="10"
          r="5"
          fill="currentColor"
          className={cn(
            "transition-transform transform origin-center duration-150 ease-in-out",
            checked ? "scale-100" : "scale-0"
          )}
        />
      </svg>
    </div>
  );
});

RadioButton.displayName = "RadioButton";
