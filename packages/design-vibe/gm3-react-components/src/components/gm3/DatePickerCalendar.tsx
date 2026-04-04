import React from 'react';
const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// Date helpers
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

interface DatePickerCalendarProps {
  displayDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
  displayDate,
  selectedDate,
  onDateSelect,
}) => {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const today = new Date();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const calendarDays: { day: number, month: number, year: number }[] = [];
  
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

  // Previous month's days
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({ day: daysInPrevMonth - firstDay + 1 + i, month: prevMonth, year: prevMonthYear });
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, month, year });
  }

  // Next month's days
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  const remainingCells = 42 - calendarDays.length; // 6 weeks * 7 days
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({ day: i, month: nextMonth, year: nextMonthYear });
  }
  
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="px-3 pb-3">
      <div className="grid grid-cols-7 text-center">
        {weekDays.map(day => (
          <div key={day} className="w-[48px] h-[48px] flex items-center justify-center body-medium text-on-surface-variant">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center">
        {calendarDays.map((item, index) => {
          const date = new Date(item.year, item.month, item.day);
          const isCurrentDisplayMonth = item.month === month;
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);

          return (
            <div key={index} className="w-[48px] h-[48px] flex items-center justify-center">
              <button
                onClick={() => onDateSelect(date)}
                className={cn(
                  'w-[40px] h-[40px] rounded-full body-large transition-colors duration-150',
                  'flex items-center justify-center relative',
                  isCurrentDisplayMonth && 'button--state-layer',
                  isSelected 
                    ? 'bg-primary text-on-primary' 
                    : isToday 
                      ? 'border border-primary text-primary' 
                      : isCurrentDisplayMonth 
                        ? 'text-on-surface'
                        : 'text-on-surface/40 pointer-events-none'
                )}
                aria-label={date.toDateString()}
                aria-pressed={isSelected}
              >
                {item.day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
