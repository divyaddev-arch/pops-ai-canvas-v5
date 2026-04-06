
import React from 'react';
import { TextField, TextFieldProps } from './TextField';
import { MenuItem, MenuItemProps } from './Menu';

export interface ExposedDropdownMenuProps extends Omit<TextFieldProps, 'children' | 'onChange' | 'value' | 'readOnly'> {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const ExposedDropdownMenu = React.forwardRef<HTMLInputElement, ExposedDropdownMenuProps>(({
  value,
  onValueChange,
  children,
  label,
  ...props
}, ref) => {
  const menuItems = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    const el = child as React.ReactElement<any>;

    const originalOnClick = el.props.onClick;
    return React.cloneElement(el, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const nextValue = el.props.value !== undefined
          ? el.props.value
          : (typeof el.props.headline === 'string' ? el.props.headline : '');

        onValueChange(String(nextValue));
        if (originalOnClick) originalOnClick(e);
      }
    });
  });

  return (
    <TextField
      ref={ref}
      value={value}
      onChange={() => { }}
      label={label}
      readOnly
      {...props}
    >
      {menuItems}
    </TextField>
  );
});

ExposedDropdownMenu.displayName = 'ExposedDropdownMenu';
