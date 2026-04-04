import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { TimeInput } from './TimeInput';
import { Clock } from './Clock';
import { Button } from './Button';
import { Icon } from '../Icons';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

type TimePickerPeriod = 'am' | 'pm';

export interface TimePickerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (time: { hour: number, minute: number }) => void;
  initialTime?: { hour: number, minute: number }; // 24-hour format
}

export const TimePicker: React.FC<TimePickerProps> = ({
  open,
  onClose,
  onConfirm,
  initialTime = { hour: new Date().getHours(), minute: new Date().getMinutes() },
}) => {
  const [hour, setHour] = useState(initialTime.hour);
  const [minute, setMinute] = useState(initialTime.minute);
  const [period, setPeriod] = useState<TimePickerPeriod>(initialTime.hour >= 12 ? 'pm' : 'am');
  const [displayMode, setDisplayMode] = useState<'hour' | 'minute'>('hour');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // Reset to initial time when opening
      setHour(initialTime.hour);
      setMinute(initialTime.minute);
      setPeriod(initialTime.hour >= 12 ? 'pm' : 'am');
      setDisplayMode('hour');
      setIsVisible(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => setIsVisible(false), 300); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [open, initialTime]);

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

  const handleHourChange = (newHour: number) => {
    const new24hHour = period === 'pm' && newHour !== 12 ? newHour + 12 : (period === 'am' && newHour === 12 ? 0 : newHour);
    setHour(new24hHour);
  };

  const handleMinuteChange = (newMinute: number) => {
    setMinute(newMinute);
  };

  const handlePeriodChange = (newPeriod: TimePickerPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod === 'pm' && hour < 12) {
      setHour(hour + 12);
    } else if (newPeriod === 'am' && hour >= 12) {
      setHour(hour - 12);
    }
  };

  const handleConfirm = () => {
    onConfirm({ hour, minute });
    onClose();
  };

  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50">
      {/* Scrim */}
      <div
        onClick={onClose}
        className={cn(
            'absolute inset-0 bg-scrim transition-opacity duration-300',
            (open && !isClosing) ? 'opacity-30' : 'opacity-0'
        )}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="w-full h-full flex items-center justify-center">
        <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="time-picker-title"
            className={cn(
                'relative flex flex-col w-[328px] bg-surface-container-high rounded-[28px] shadow-lg text-on-surface transition-all duration-300 ease-out',
                (open && !isClosing) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            )}
        >
            <header className="px-6 pt-6 pb-3">
                <h2 id="time-picker-title" className="body-medium text-on-surface-variant">Select time</h2>
                <div className="flex items-center justify-center gap-3 mt-8">
                    <TimeInput
                        value={displayHour}
                        onValueChange={handleHourChange}
                        onClick={() => setDisplayMode('hour')}
                        selected={displayMode === 'hour'}
                        aria-label="hour"
                    />
                    <span className="display-large -mb-2">:</span>
                    <TimeInput
                        value={minute}
                        onValueChange={handleMinuteChange}
                        onClick={() => setDisplayMode('minute')}
                        selected={displayMode === 'minute'}
                        aria-label="minute"
                    />
                    <div className="flex flex-col border border-outline-variant rounded-full h-[80px] w-[52px] overflow-hidden">
                        <button
                            onClick={() => handlePeriodChange('am')}
                            className={cn(
                                'flex-1 label-large transition-colors',
                                period === 'am' ? 'bg-tertiary-container text-on-tertiary-container' : 'hover:bg-on-surface/5'
                            )}
                        >
                            AM
                        </button>
                         <button
                            onClick={() => handlePeriodChange('pm')}
                            className={cn(
                                'flex-1 label-large transition-colors border-t border-outline-variant',
                                period === 'pm' ? 'bg-tertiary-container text-on-tertiary-container' : 'hover:bg-on-surface/5'
                            )}
                        >
                            PM
                        </button>
                    </div>
                </div>
            </header>
            
            <div className="flex items-center justify-center py-3">
                <Clock
                    mode={displayMode}
                    hour={hour}
                    minute={minute}
                    onHourChange={handleHourChange}
                    onMinuteChange={handleMinuteChange}
                    onHourSelectFinished={() => setDisplayMode('minute')}
                />
            </div>

            <footer className="flex justify-end gap-2 p-6 pt-3">
                <Button variant="text" onClick={onClose}>Cancel</Button>
                <Button variant="text" onClick={handleConfirm}>OK</Button>
            </footer>
        </div>
      </div>
    </div>,
    document.body
  );
};