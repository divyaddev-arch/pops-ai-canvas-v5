

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Icon } from '../Icons';
import { TextField } from './TextField';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- Constants from Material Spec ---
const TRACK_HEIGHT = 4; // px
const THUMB_DIAMETER = 20; // px
const TICK_DIAMETER_GM2 = 2; // px
const STATE_LAYER_DIAMETER = 40; // px

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number;
  onValueChange: (newValue: number) => void;
  onValueChangeFinished?: () => void;
  valueRange?: [number, number];
  steps?: number | number[];
  disabled?: boolean;
  variant?: 'default' | 'gm2';
  size?: 'xxsmall' | 'xsmall';
  withInput?: boolean;
  inputPrecision?: number;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  thumbColor?: string;
  hideValueLabel?: boolean;
  hideTicks?: boolean;
  thumbSize?: number;
  hideThumbUntilHover?: boolean;
  disableStateLayer?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

const GM2ValueLabel = ({ value, isVisible }: { value: number, isVisible: boolean }) => (
    <div className={cn(
        "absolute bottom-full left-1/2 -translate-x-1/2 mb-3 transition-opacity duration-150",
        isVisible ? 'opacity-100' : 'opacity-0'
    )}>
        <div className="relative w-7 h-7 flex items-center justify-center bg-primary rounded-full shadow-sm">
            <span className="label-medium text-on-primary">{value}</span>
            <div className="absolute -bottom-[3px] w-3 h-3 bg-primary transform rotate-45" />
        </div>
    </div>
);

const ValueLabel = ({ value, isVisible }: { value: number, isVisible: boolean }) => (
    <div className={cn(
        "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 transition-opacity duration-150 pointer-events-none select-none",
        isVisible ? 'opacity-100' : 'opacity-0',
        "h-[44px] px-[15px] bg-inverse-surface rounded-full flex items-center justify-center shadow-sm"
    )}>
        <span className="label-large text-inverse-on-surface">{value}</span>
    </div>
);

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(({
  value,
  onValueChange,
  onValueChangeFinished,
  valueRange = [0, 1],
  steps = 0,
  disabled = false,
  variant = 'default',
  size = 'xxsmall',
  className,
  withInput = false,
  inputPrecision,
  activeTrackColor,
  inactiveTrackColor,
  thumbColor,
  hideValueLabel = false,
  hideTicks = false,
  thumbSize = THUMB_DIAMETER,
  hideThumbUntilHover = false,
  disableStateLayer = false,
  onCheckedChange,
  checked,
  ...props
}, ref) => {
  const [min, max] = valueRange;
  const range = max - min;
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const isGm2 = variant === 'gm2';
  const isSizeXSmall = !isGm2 && size === 'xsmall';
  const isSizeXXSmall = !isGm2 && size === 'xxsmall';
  const inset = isGm2 ? 4 : 6;
  const isSteppedArray = Array.isArray(steps);
  
  const valueToPercent = useCallback((val: number) => {
    if (range === 0) return 0;
    return ((val - min) / range) * 100;
  }, [min, range]);

  const stepValue = useMemo(() => {
    if (isSteppedArray || steps === 0) {
      return range / 20; // Default keyboard step for array or continuous
    }
    return range / (steps as number);
  }, [steps, isSteppedArray, range]);

  const snapToStep = useCallback((val: number) => {
    if (steps === 0) return val;
    if (isSteppedArray) {
        return (steps as number[]).reduce((a, b) => Math.abs(b - val) < Math.abs(a - val) ? b : a);
    }
    const numSteps = steps as number;
    const stepSize = range / numSteps;
    const snappedValue = min + Math.round((val - min) / stepSize) * stepSize;
    return Math.max(min, Math.min(max, snappedValue));
  }, [steps, isSteppedArray, min, max, range]);
  
  const updateValueFromPosition = useCallback((clientX: number) => {
      if (!sliderRef.current || disabled) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const positionInSlider = clientX - rect.left;
      const effectiveWidth = rect.width - inset * 2;
      const positionInTrack = positionInSlider - inset;

      if (effectiveWidth <= 0) return;

      const percent = Math.max(0, Math.min(100, (positionInTrack / effectiveWidth) * 100));
      const newValueRaw = min + (percent / 100) * range;
      onValueChange(snapToStep(newValueRaw));
  }, [disabled, min, range, onValueChange, snapToStep, inset]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => updateValueFromPosition(e.clientX);
    const handleTouchMove = (e: TouchEvent) => updateValueFromPosition(e.touches[0].clientX);

    const handleMouseUp = () => {
      setIsDragging(false);
      onValueChangeFinished?.();
    };
    const handleTouchEnd = () => {
      setIsDragging(false);
      onValueChangeFinished?.();
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging, updateValueFromPosition, onValueChangeFinished]);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      updateValueFromPosition(clientX);
      setIsDragging(true);
      thumbRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    let newValue: number | undefined;
    const clampedValue = snapToStep(value);

    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      if (isSteppedArray) {
        const currentIndex = (steps as number[]).indexOf(clampedValue);
        if (currentIndex > 0) newValue = (steps as number[])[currentIndex - 1];
      } else {
        newValue = value - stepValue;
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      if (isSteppedArray) {
        const currentIndex = (steps as number[]).indexOf(clampedValue);
        if (currentIndex < (steps as number[]).length - 1) newValue = (steps as number[])[currentIndex + 1];
      } else {
        newValue = value + stepValue;
      }
    } else if (e.key === 'Home') {
      newValue = isSteppedArray ? (steps as number[])[0] : min;
    } else if (e.key === 'End') {
      newValue = isSteppedArray ? (steps as number[])[(steps as number[]).length - 1] : max;
    }

    if (newValue !== undefined) {
      e.preventDefault();
      onValueChange(snapToStep(newValue));
      onValueChangeFinished?.();
    }
  };

  const clampedValue = Math.max(min, Math.min(max, value));
  const percent = valueToPercent(clampedValue);

  const sliderElement = (
    <div
      ref={sliderRef}
      className={cn(
        "relative w-full flex items-center h-11",
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        !withInput && className // only apply className here if not wrapped
      )}
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
      onMouseEnter={() => !disabled && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {isGm2 ? (
        <>
          {/* Track */}
          <div
            className={cn(
                'w-full rounded-full',
                disabled ? 'bg-on-surface/12' : (inactiveTrackColor ? '' : 'bg-surface-container-high')
            )}
            style={{ height: `${TRACK_HEIGHT}px`, backgroundColor: disabled ? undefined : inactiveTrackColor }}
          >
            {/* Active Track */}
            <div
                className={cn(
                    'h-full rounded-full',
                    disabled ? 'bg-on-surface-38' : (activeTrackColor ? '' : 'bg-primary')
                )}
                style={{ width: `${percent}%`, backgroundColor: disabled ? undefined : activeTrackColor }}
            />
          </div>

          {/* Ticks */}
          {!hideTicks && ((typeof steps === 'number' && steps > 0) || (Array.isArray(steps) && steps.length > 0)) && (
            <div className="absolute h-full flex items-center" style={{ left: `${inset}px`, right: `${inset}px` }}>
                {isSteppedArray ? (
                    (steps as number[]).map((stepValue, i) => {
                        const tickPercent = valueToPercent(stepValue);
                        const isActive = tickPercent <= percent;
                        return (
                            <div
                                key={i}
                                className={cn(
                                    'absolute rounded-full',
                                     disabled 
                                        ? isActive ? 'bg-surface' : 'bg-on-surface-38'
                                        : isActive ? 'bg-on-primary' : 'bg-on-surface-variant',
                                )}
                                style={{
                                    width: `${TICK_DIAMETER_GM2}px`,
                                    height: `${TICK_DIAMETER_GM2}px`,
                                    left: `calc(${tickPercent}% - ${TICK_DIAMETER_GM2 / 2}px)`,
                                }}
                            />
                        );
                    })
                ) : (
                    Array.from({ length: (steps as number) + 1 }).map((_, i) => {
                        const tickPercent = (i / (steps as number)) * 100;
                        const isActive = tickPercent <= percent;
                        return (
                            <div
                                key={i}
                                className={cn(
                                    'absolute rounded-full',
                                     disabled 
                                        ? isActive ? 'bg-surface' : 'bg-on-surface-38'
                                        : isActive ? 'bg-on-primary' : 'bg-on-surface-variant',
                                )}
                                style={{
                                    width: `${TICK_DIAMETER_GM2}px`,
                                    height: `${TICK_DIAMETER_GM2}px`,
                                    left: `calc(${tickPercent}% - ${TICK_DIAMETER_GM2 / 2}px)`,
                                }}
                            />
                        );
                    })
                )}
            </div>
          )}

          {/* Thumb */}
          <button
            ref={thumbRef}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={clampedValue}
            aria-orientation="horizontal"
            aria-disabled={disabled}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 focus:outline-none"
            style={{ left: `calc(${inset}px + (100% - ${inset * 2}px) * ${percent / 100})` }}
          >
            {!hideValueLabel && <GM2ValueLabel value={Math.round(clampedValue)} isVisible={isDragging || isHovering} />}
            {/* State Layer */}
            <div className={cn("relative rounded-full flex items-center justify-center", !disableStateLayer && "button--state-layer")} style={{ width: `${STATE_LAYER_DIAMETER}px`, height: `${STATE_LAYER_DIAMETER}px`}}>
                 {/* Thumb circle */}
                <div
                    className={cn(
                        'rounded-full shadow-sm',
                        'transition-opacity',
                        disabled ? 'bg-on-surface-38' : (thumbColor ? '' : 'bg-primary'),
                        hideThumbUntilHover && !isHovering && !isDragging && 'opacity-0'
                    )}
                    style={{ width: `${thumbSize}px`, height: `${thumbSize}px`, backgroundColor: disabled ? undefined : thumbColor}}
                />
            </div>
          </button>
        </>
      ) : (
        <>
          {/* Track Container */}
          <div className={cn(
              "relative w-full flex items-center",
              isSizeXSmall ? 'h-[16px]' : 'h-[4px]'
            )}>
            {/* Active Track */}
            <div className={cn(
              'absolute left-0',
              isSizeXSmall ? 'h-[16px]' : 'h-[4px]',
              isSizeXXSmall ? 'rounded-full' : 'rounded-l-[8px] rounded-r-[2px]',
              disabled ? 'bg-on-surface-38' : (activeTrackColor ? '' : 'bg-primary')
            )} style={{ width: `calc(${inset}px + (100% - ${inset * 2}px) * ${percent / 100} - 8px)`, backgroundColor: disabled ? undefined : activeTrackColor }} />
            {/* Inactive Track */}
            <div className={cn(
              'absolute right-0',
              isSizeXSmall ? 'h-[16px]' : 'h-[4px]',
              isSizeXXSmall ? 'rounded-full' : 'rounded-l-[2px] rounded-r-[8px]',
              disabled ? 'bg-on-surface/12' : (inactiveTrackColor ? '' : 'bg-surface-container-highest')
            )} style={{ width: `calc(${inset}px + (100% - ${inset * 2}px) * ${(100 - percent) / 100} - 8px)`, backgroundColor: disabled ? undefined : inactiveTrackColor }} />
            {/* Ticks */}
            {!hideTicks && ((typeof steps === 'number' && steps > 0) || (Array.isArray(steps) && steps.length > 0)) && (
              <div className="absolute h-full flex items-center inset-y-0 pointer-events-none" style={{ left: `${inset}px`, right: `${inset}px` }}>
                  {isSteppedArray ? (
                      (steps as number[]).map((stepValue, i) => {
                          const tickPercent = valueToPercent(stepValue);
                          const isActive = tickPercent <= percent;
                          return (
                              <div
                                  key={i}
                                  className={cn(
                                      'absolute rounded-full',
                                      isSizeXXSmall ? 'w-[2px] h-[2px]' : 'w-[4px] h-[4px]',
                                      disabled
                                        ? isActive ? 'bg-surface' : 'bg-on-surface-38'
                                        : isActive ? 'bg-on-primary' : 'bg-on-surface-variant'
                                  )}
                                  style={{
                                      left: `calc(${tickPercent}% - ${isSizeXXSmall ? 1 : 2}px)`,
                                  }}
                              />
                          );
                      })
                  ) : (
                      Array.from({ length: (steps as number) + 1 }).map((_, i) => {
                          const tickPercent = (i / (steps as number)) * 100;
                          const isActive = tickPercent <= percent;
                          return (
                              <div
                                  key={i}
                                  className={cn(
                                      'absolute rounded-full',
                                      isSizeXXSmall ? 'w-[2px] h-[2px]' : 'w-[4px] h-[4px]',
                                      disabled
                                        ? isActive ? 'bg-surface' : 'bg-on-surface-38'
                                        : isActive ? 'bg-on-primary' : 'bg-on-surface-variant'
                                  )}
                                  style={{
                                      left: `calc(${tickPercent}% - ${isSizeXXSmall ? 1 : 2}px)`,
                                  }}
                              />
                          );
                      })
                  )}
              </div>
            )}
          </div>

          {/* Thumb */}
          <button
            ref={thumbRef}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={clampedValue}
            aria-orientation="horizontal"
            aria-disabled={disabled}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-10 flex items-center justify-center rounded-full focus:outline-none",
               isSizeXSmall ? 'h-12' : 'h-10'
            )}
            style={{ left: `calc(${inset}px + (100% - ${inset * 2}px) * ${percent / 100})` }}
          >
            {!hideValueLabel && <ValueLabel value={Math.round(clampedValue)} isVisible={isDragging} />}
            {/* Visual Thumb Line with its own state layer */}
            <div className={cn(
              'relative rounded-full transition-all duration-150',
              isSizeXSmall ? 'h-[44px]' : 'h-[24px]',
              isDragging ? 'w-[2px]' : 'w-[4px]',
              disabled ? 'bg-on-surface-38' : (thumbColor ? '' : 'bg-primary'),
              !disabled && !disableStateLayer && "button--state-layer text-on-primary"
            )} style={{ backgroundColor: disabled ? undefined : thumbColor }} />
          </button>
        </>
      )}
    </div>
  );
  
  if (withInput) {
    const [inputValue, setInputValue] = useState(
      inputPrecision !== undefined ? value.toFixed(inputPrecision) : String(value)
    );
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Update input text when slider is dragged, but not when input has focus
        if (document.activeElement !== inputRef.current) {
            const displayValue = inputPrecision !== undefined ? value.toFixed(inputPrecision) : String(value);
            setInputValue(displayValue);
        }
    }, [value, inputPrecision]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const rawValue = e.target.value;
        setInputValue(rawValue);

        if (rawValue === '' || rawValue === '-' || rawValue.endsWith('.')) {
            return; // Allow partial input
        }
        
        const numValue = parseFloat(rawValue);
        if (!isNaN(numValue)) {
            const clampedNum = Math.max(min, Math.min(max, numValue));
            if (value !== clampedNum) {
                onValueChange(clampedNum);
            }
        }
    };

    const handleInputBlur = () => {
        const numValue = parseFloat(inputValue);
        let finalValue = isNaN(numValue) ? min : Math.max(min, Math.min(max, numValue));
        const snapped = snapToStep(finalValue);

        onValueChange(snapped);
        const displayValue = inputPrecision !== undefined ? snapped.toFixed(inputPrecision) : String(snapped);
        setInputValue(displayValue);
        onValueChangeFinished?.();
    };
    
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleInputBlur();
            (e.target as HTMLInputElement).blur();
        }
    };
    return (
      <div className={cn("flex items-center gap-6 w-full", className)}>
        <div className="flex-1">
          {sliderElement}
        </div>
        <TextField
          ref={inputRef}
          variant="filled-minimal"
          noLabel
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          label="Value"
          disabled={disabled}
          className="!w-24 [&>div]:!h-11 [&_input]:!py-2"
          type="text"
          inputMode="decimal"
          supportingText={undefined}
        />
      </div>
    );
  }

  return sliderElement;
});
Slider.displayName = 'Slider';