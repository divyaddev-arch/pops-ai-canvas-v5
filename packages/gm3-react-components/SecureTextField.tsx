import React, { useState } from 'react';
import { TextField, TextFieldProps } from './TextField';
import { Icon } from './Icons';
import { IconButton } from './IconButton';

// Omit props that will be controlled internally
export interface SecureTextFieldProps extends Omit<TextFieldProps, 'type' | 'trailingIcon'> {}

export const SecureTextField = React.forwardRef<HTMLInputElement, SecureTextFieldProps>((
  props,
  ref
) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const trailingIcon = (
    <IconButton
      type="button"
      size="small"
      onClick={togglePasswordVisibility}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      // Prevent the text field from losing focus when the icon is clicked
      onMouseDown={(e) => e.preventDefault()}
    >
      <Icon>{showPassword ? 'visibility_off' : 'visibility'}</Icon>
    </IconButton>
  );

  return (
    <TextField
      ref={ref}
      {...props}
      type={showPassword ? 'text' : 'password'}
      trailingIcon={trailingIcon}
    />
  );
});

SecureTextField.displayName = 'SecureTextField';
