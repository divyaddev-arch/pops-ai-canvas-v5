import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Button } from './Button';
import { DatePicker } from './DatePicker';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface DatePickerDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
}

export const DatePickerDialog: React.FC<DatePickerDialogProps> = ({
  open,
  onClose,
  onConfirm,
  initialDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSelectedDate(initialDate || new Date());
      setIsVisible(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open, initialDate]);

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
    onConfirm(selectedDate);
    onClose();
  };

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
            <h2 className="body-medium text-on-surface-variant">Select date</h2>
          </header>
          
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          <footer className="flex justify-end gap-2 p-6 pt-0">
            <Button variant="text" onClick={onClose}>Cancel</Button>
            <Button variant="text" onClick={handleConfirm}>OK</Button>
          </footer>
        </div>
      </div>
    </div>,
    document.body
  );
};
