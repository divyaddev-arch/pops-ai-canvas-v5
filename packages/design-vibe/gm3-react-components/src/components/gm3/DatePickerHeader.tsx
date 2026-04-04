import React from 'react';
import { Icon } from '../Icons';
import { IconButton } from './IconButton';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

interface DatePickerHeaderProps {
  displayDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onShowYearPicker: () => void;
}

export const DatePickerHeader: React.FC<DatePickerHeaderProps> = ({
  displayDate,
  onPrevMonth,
  onNextMonth,
  onShowYearPicker,
}) => {
  const monthYearString = displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex items-center justify-between h-[52px] px-3">
      <button 
        onClick={onShowYearPicker} 
        className={cn(
          "flex items-center gap-1 title-large-emphasized text-on-surface-variant p-2 rounded-lg relative",
          "focus:outline-none button--state-layer"
        )}
      >
        {monthYearString}
        <Icon>arrow_drop_down</Icon>
      </button>
      <div className="flex">
        <IconButton variant="standard" onClick={onPrevMonth} aria-label="Previous month">
          <Icon>chevron_left</Icon>
        </IconButton>
        <IconButton variant="standard" onClick={onNextMonth} aria-label="Next month">
          <Icon>chevron_right</Icon>
        </IconButton>
      </div>
    </div>
  );
};