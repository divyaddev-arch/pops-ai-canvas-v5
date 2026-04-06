import React, { useRef, useLayoutEffect } from 'react';
import { Scrollbar, type ScrollbarRef } from './Scrollbar';
const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

interface DatePickerYearSelectorProps {
  selectedYear: number;
  onYearSelect: (year: number) => void;
}

export const DatePickerYearSelector: React.FC<DatePickerYearSelectorProps> = ({
  selectedYear,
  onYearSelect,
}) => {
  const scrollRef = useRef<ScrollbarRef>(null);
  const selectedYearRef = useRef<HTMLButtonElement>(null);

  const years = Array.from({ length: 201 }, (_, i) => new Date().getFullYear() - 100 + i);

  useLayoutEffect(() => {
    // A timeout is used to ensure the scroll happens after the element is fully rendered and visible.
    const timer = setTimeout(() => {
        if (selectedYearRef.current) {
            selectedYearRef.current.scrollIntoView({ block: 'center' });
        }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[312px] w-full">
      <Scrollbar ref={scrollRef}>
        <div className="grid grid-cols-3 gap-2 p-3">
          {years.map(year => {
            const isSelected = year === selectedYear;
            return (
              <button
                key={year}
                ref={isSelected ? selectedYearRef : null}
                onClick={() => onYearSelect(year)}
                className={cn(
                  'h-[52px] w-full flex items-center justify-center rounded-full transition-colors',
                  isSelected
                    ? 'bg-primary text-on-primary title-large'
                    : 'text-on-surface-variant body-large relative hover:bg-on-surface/5 button--state-layer'
                )}
              >
                {year}
              </button>
            );
          })}
        </div>
      </Scrollbar>
    </div>
  );
};
