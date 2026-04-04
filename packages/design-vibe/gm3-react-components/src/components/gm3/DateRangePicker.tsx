import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Button } from './Button';
import { DatePickerHeader } from './DatePickerHeader';
import { DateRangePickerCalendar } from './DateRangePickerCalendar';
import { DatePickerYearSelector } from './DatePickerYearSelector';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface DateRangePickerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (range: { startDate: Date | null, endDate: Date | null }) => void;
  initialRange?: { startDate: Date | null, endDate: Date | null };
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  open,
  onClose,
  onConfirm,
  initialRange,
}) => {
  const [startDate, setStartDate] = useState(initialRange?.startDate || null);
  const [endDate, setEndDate] = useState(initialRange?.endDate || null);
  const [displayDate, setDisplayDate] = useState(initialRange?.startDate || new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'year'>('calendar');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setStartDate(initialRange?.startDate || null);
      setEndDate(initialRange?.endDate || null);
      setDisplayDate(initialRange?.startDate || new Date());
      setViewMode('calendar');
      setIsVisible(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open, initialRange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      dialogRef.current?.focus();
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleConfirm = () => {
    onConfirm({ startDate, endDate });
    onClose();
  };
  
  const handleDateSelect = (date: Date) => {
    if (startDate && endDate) { // Full range selected, start new selection
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) { // Start date exists, need end date
      if (date < startDate) {
        setStartDate(date); // New date is before start, so it's the new start
      } else {
        setEndDate(date); // New date is after, so it's the end
      }
    } else { // No start date yet
      setStartDate(date);
      setEndDate(null);
    }
  };
  
  const handleYearSelect = (year: number) => {
    const newDisplayDate = new Date(displayDate);
    newDisplayDate.setFullYear(year);
    setDisplayDate(newDisplayDate);
    setViewMode('calendar');
  };

  const handlePrevMonth = () => {
      setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
      setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const headerText = `${formatDate(startDate) || 'Start'} → ${formatDate(endDate) || 'End'}`;

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50">
      <div
        onClick={onClose}
        className={cn(
            'absolute inset-0 bg-scrim transition-opacity duration-300',
            (open && !isClosing) ? 'opacity-30' : 'opacity-0'
        )}
        aria-hidden="true"
      />
      <div className="w-full h-full flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          className={cn(
            'relative flex flex-col w-[360px] bg-surface-container-high rounded-[28px] shadow-lg text-on-surface transition-all duration-300 ease-out',
            (open && !isClosing) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
        >
          <header className="px-6 pt-6 pb-2">
            <h2 className="body-medium text-on-surface-variant">Select range</h2>
            <p className="headline-large text-on-surface-variant mt-8">{headerText}</p>
          </header>
          
          <div className="h-[364px]">
            {viewMode === 'calendar' ? (
                <>
                    <DatePickerHeader
                        displayDate={displayDate}
                        onPrevMonth={handlePrevMonth}
                        onNextMonth={handleNextMonth}
                        onShowYearPicker={() => setViewMode('year')}
                    />
                    <DateRangePickerCalendar
                        displayDate={displayDate}
                        startDate={startDate}
                        endDate={endDate}
                        onDateSelect={handleDateSelect}
                    />
                </>
            ) : (
                <DatePickerYearSelector
                    selectedYear={displayDate.getFullYear()}
                    onYearSelect={handleYearSelect}
                />
            )}
          </div>

          <footer className="flex justify-end gap-2 p-6 pt-0">
            <Button variant="text" onClick={onClose}>Cancel</Button>
            <Button variant="text" onClick={handleConfirm} disabled={!startDate || !endDate}>OK</Button>
          </footer>
        </div>
      </div>
    </div>,
    document.body
  );
};