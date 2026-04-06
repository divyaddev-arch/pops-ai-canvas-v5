import React, { useState, useEffect, useRef, useCallback } from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const CLOCK_SIZE = 256;
const CENTER = CLOCK_SIZE / 2;
const OUTER_RADIUS = 96;
const INNER_RADIUS = 64;
const NUMBER_RADIUS = 20;

interface ClockProps {
  mode: 'hour' | 'minute';
  hour: number; // 24-hour format
  minute: number;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  onHourSelectFinished?: () => void;
}

export const Clock: React.FC<ClockProps> = ({
  mode,
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  onHourSelectFinished,
}) => {
  const clockRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  const getAngle = useCallback((value: number, type: 'hour' | 'minute') => {
    const total = type === 'hour' ? 12 : 60;
    return (value / total) * 360 - 90;
  }, []);

  const getPositionFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    if (!clockRef.current) return { x: 0, y: 0 };
    const rect = clockRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const updateFromPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getPositionFromEvent(e);
    const dx = x - CENTER;
    const dy = y - CENTER;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (mode === 'hour') {
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isInner = dist < (INNER_RADIUS + OUTER_RADIUS) / 2;
      let newHour = Math.round(angle / 30);
      if (newHour === 0) newHour = 12;
      
      const isPm = hour >= 12;
      if (isInner) {
        if (newHour === 12) { // 12 on inner circle is 00 hours
          onHourChange(isPm ? 12 : 0);
        } else {
          onHourChange(isPm ? newHour + 12 : newHour);
        }
      } else { // Outer circle
        if (isPm && newHour !== 12) {
          onHourChange(newHour + 12);
        } else if (!isPm && newHour === 12) { // 12 AM is 00 hours
          onHourChange(0);
        } else {
          onHourChange(newHour);
        }
      }
    } else { // minute
      let newMinute = Math.round(angle / 6);
      if (newMinute === 60) newMinute = 0;
      onMinuteChange(newMinute);
    }
  }, [mode, hour, onHourChange, onMinuteChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateFromPosition(e);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setIsDragging(false);
      if (mode === 'hour') {
        onHourSelectFinished?.();
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) updateFromPosition(e as any);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) updateFromPosition(e as any);
    };
    const handleMouseUpGlobal = () => {
      if (isDragging) {
        setIsDragging(false);
        if (mode === 'hour') {
            onHourSelectFinished?.();
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleMouseUpGlobal);
    window.addEventListener('touchend', handleMouseUpGlobal);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
      window.removeEventListener('touchend', handleMouseUpGlobal);
    };
  }, [isDragging, updateFromPosition, mode, onHourSelectFinished]);


  const renderNumbers = () => {
    const numbers: { value: number, label: string, radius: number }[] = [];
    if (mode === 'hour') {
      for (let i = 1; i <= 12; i++) {
        numbers.push({ value: i, label: String(i), radius: OUTER_RADIUS }); // Outer ring for 1-12
      }
    } else {
      for (let i = 0; i < 12; i++) {
        const value = i * 5;
        numbers.push({ value, label: value === 0 ? '00' : String(value), radius: OUTER_RADIUS });
      }
    }

    return numbers.map(({ value, label, radius }) => {
      const angle = getAngle(value, mode === 'hour' ? 'hour' : 'minute');
      const x = CENTER + radius * Math.cos(angle * Math.PI / 180) - NUMBER_RADIUS;
      const y = CENTER + radius * Math.sin(angle * Math.PI / 180) - NUMBER_RADIUS;
      
      const isSelected = mode === 'hour' ? value === hour12 : value === minute;

      return (
        <div
          key={value}
          className={cn(
            'absolute w-10 h-10 flex items-center justify-center rounded-full body-large transition-colors',
            isSelected
              ? 'bg-primary text-on-primary'
              : 'text-on-surface'
          )}
          style={{ left: x, top: y }}
        >
          {label}
        </div>
      );
    });
  };

  const handAngle = mode === 'hour' ? getAngle(hour12, 'hour') : getAngle(minute, 'minute');
  const isInnerRingHour = mode === 'hour' && (hour === 0 || hour > 12);
  const handLength = mode === 'hour' ? (isInnerRingHour ? INNER_RADIUS : OUTER_RADIUS) : OUTER_RADIUS;

  return (
    <div
      ref={clockRef}
      className="relative rounded-full bg-surface-container"
      style={{ width: CLOCK_SIZE, height: CLOCK_SIZE }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={(e) => { e.preventDefault(); setIsDragging(true); updateFromPosition(e); }}
    >
      {/* Center dot */}
      <div className="absolute w-1.5 h-1.5 bg-primary rounded-full" style={{ left: CENTER - 3, top: CENTER - 3 }} />
      
      {/* Hand */}
      <div
        className="absolute origin-bottom"
        style={{
          left: CENTER - 1,
          top: CENTER - handLength,
          height: handLength,
          transform: `rotate(${handAngle}deg)`,
          width: '2px',
          backgroundColor: 'var(--color-primary)',
          transition: 'transform 200ms ease-out, height 200ms ease-out',
        }}
      >
        <div className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full border-2 border-primary bg-primary" />
      </div>

      {renderNumbers()}
    </div>
  );
};
