import React from 'react';
const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// Date helpers
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

interface DateRangePickerCalendarProps {
  displayDate: Date;
  startDate: Date | null;
  endDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export const DateRangePickerCalendar: React.FC<DateRangePickerCalendarProps> = ({
  displayDate,
  startDate,
  endDate,
  onDateSelect,
}) => {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const calendarDays: { day: number, month: number, year: number }[] = [];
  
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({ day: daysInPrevMonth - firstDay + 1 + i, month: prevMonth, year: prevMonthYear });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, month, year });
  }

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({ day: i, month: nextMonth, year: nextMonthYear });
  }
  
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="px-3 pb-3">
      <div className="grid grid-cols-7 text-center">
        {weekDays.map((day, i) => (
          <div key={i} className="w-[48px] h-[48px] flex items-center justify-center body-medium text-on-surface-variant">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center">
        {calendarDays.map((item, index) => {
          const date = new Date(item.year, item.month, item.day, 12); // Use noon to avoid timezone issues
          const isCurrentDisplayMonth = item.month === month;

          const isStartDate = isSameDay(date, startDate);
          const isEndDate = isSameDay(date, endDate);
          const isEndpoint = isStartDate || isEndDate;
          const isInRange = startDate && endDate && date > startDate && date < endDate;

          const dayOfWeek = date.getDay();
          const isRangeStartEdge = isStartDate || (isInRange && dayOfWeek === 0);
          const isRangeEndEdge = isEndDate || (isInRange && dayOfWeek === 6);

          return (
            <div
              key={index}
              className={cn(
                "w-[48px] h-[40px] flex items-center justify-center my-1",
                isCurrentDisplayMonth && (isInRange || isEndpoint) && startDate && endDate && 'bg-primary-container',
                isCurrentDisplayMonth && isRangeStartEdge && 'rounded-l-full',
                isCurrentDisplayMonth && isRangeEndEdge && 'rounded-r-full',
                isStartDate && isEndDate && 'rounded-full'
              )}
            >
              <button
                onClick={() => onDateSelect(date)}
                className={cn(
                  'w-[40px] h-[40px] rounded-full body-large transition-colors duration-150',
                  'flex items-center justify-center relative',
                  isCurrentDisplayMonth && !isEndpoint && 'button--state-layer',
                  isEndpoint
                    ? 'bg-primary text-on-primary'
                    : isCurrentDisplayMonth
                      ? 'text-on-surface'
                      : 'text-on-surface/40 pointer-events-none'
                )}
                aria-label={date.toDateString()}
                aria-pressed={isEndpoint}
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