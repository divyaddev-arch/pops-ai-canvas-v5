import React, { useState, useEffect } from 'react';
import { DatePickerHeader } from './DatePickerHeader';
import { DatePickerCalendar } from './DatePickerCalendar';
import { DatePickerYearSelector } from './DatePickerYearSelector';

export interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [displayDate, setDisplayDate] = useState(selectedDate);
  const [viewMode, setViewMode] = useState<'calendar' | 'year'>('calendar');
  
  useEffect(() => {
    // When selectedDate from the parent changes, update the month being displayed
    setDisplayDate(selectedDate);
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
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

  const selectedDateFormatted = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <>
      <p className="headline-large text-on-surface-variant mt-8 px-6">{selectedDateFormatted}</p>
      
      <div className="h-[364px]">
        {viewMode === 'calendar' ? (
            <>
                <DatePickerHeader
                    displayDate={displayDate}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onShowYearPicker={() => setViewMode('year')}
                />
                <DatePickerCalendar
                    displayDate={displayDate}
                    selectedDate={selectedDate}
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
    </>
  );
};
