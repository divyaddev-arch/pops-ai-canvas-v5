import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: React.ReactNode;
  compact?: boolean;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(({
  checked,
  onCheckedChange,
  icon,
  disabled = false,
  compact = false,
  className,
  ...props
}, ref) => {

  const trackW = compact ? 'w-[40px]' : 'w-[52px]';
  const trackH = compact ? 'h-[24px]' : 'h-[32px]';
  const thumbUncheckedSize = compact ? 'w-[12px] h-[12px]' : 'w-[16px] h-[16px]';
  const thumbCheckedSize = compact ? 'w-[18px] h-[18px]' : 'w-[24px] h-[24px]';
  const stateLayerSize = compact ? 'w-[32px] h-[32px]' : 'w-[40px] h-[40px]';
  const translateX = compact ? 'translate-x-[16px]' : 'translate-x-[24px]';
  const stateLayerLeft = compact ? -4 : -8;
  const iconSize = compact ? 'text-[12px]' : 'text-[16px]';

  const trackClasses = cn(
    trackW, trackH, 'rounded-full border-2 transition-colors duration-200 ease-in-out',
    disabled
      ? (checked
          ? 'bg-on-surface-12 border-transparent'
          : 'bg-transparent border-on-surface-12')
      : (checked
          ? 'bg-primary border-transparent'
          : 'bg-surface-container-highest border-outline')
  );

  const thumbClasses = cn(
    'flex items-center justify-center rounded-full transition-all duration-200 ease-in-out',
    checked ? thumbCheckedSize : thumbUncheckedSize,
    disabled
      ? (checked ? 'bg-surface' : 'bg-on-surface-38')
      : (checked ? 'bg-on-primary' : 'bg-outline')
  );

  const iconClasses = cn(
    'transition-opacity duration-100',
    'flex items-center justify-center',
    checked ? 'opacity-100' : 'opacity-0',
    disabled && checked ? 'text-on-surface-38' : 'text-on-primary-container'
  );

  const SizedIcon = icon && React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, { className: cn((icon as React.ReactElement<any>).props.className, iconSize) })
    : null;

  return (
    <button
      ref={ref}
      role="switch"
      type="button"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative p-0 shrink-0 focus:outline-none',
        trackW, trackH, 'rounded-full',
        'disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {/* Track */}
      <div className={trackClasses} />

      {/* Thumb and state layer container */}
      <div className={cn(
          'absolute top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center',
          stateLayerSize,
          'transition-transform duration-200 ease-in-out',
          'transform',
          checked ? translateX : (compact ? 'translate-x-0' : 'translate-x-[4px]'),
          !disabled && 'button--state-layer',
          !disabled && (checked ? 'text-primary' : 'text-on-surface-variant')
      )} style={{ left: `${stateLayerLeft}px` }}>
        <div className={thumbClasses}>
          {icon && (
            <div className={iconClasses}>
              {SizedIcon}
            </div>
          )}
        </div>
      </div>
    </button>
  );
});

Switch.displayName = 'Switch';
