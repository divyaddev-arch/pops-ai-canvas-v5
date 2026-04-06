import React, { useState, useRef, useEffect } from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

interface TimeInputProps {
  value: number;
  onValueChange: (value: number) => void;
  onClick: () => void;
  selected: boolean;
  'aria-label': string;
}

export const TimeInput: React.FC<TimeInputProps> = ({ value, onValueChange, onClick, selected, 'aria-label': ariaLabel }) => {
  const [inputValue, setInputValue] = useState(String(value).padStart(2, '0'));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(String(value).padStart(2, '0'));
  }, [value]);

  useEffect(() => {
    if (selected) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [selected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '').slice(-2);
    setInputValue(rawValue);

    if (rawValue.length > 0) {
      const numValue = parseInt(rawValue, 10);
      if (!isNaN(numValue)) {
        onValueChange(numValue);
      }
    }
  };

  const handleBlur = () => {
    // Format on blur
    setInputValue(String(value).padStart(2, '0'));
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative w-[96px] h-[80px] rounded-lg transition-colors cursor-text",
        selected ? 'bg-primary-container' : 'bg-surface-container-highest hover:bg-on-surface/5'
      )}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label={ariaLabel}
        className="w-full h-full bg-transparent text-center outline-none display-large text-on-surface"
      />
    </div>
  );
};
