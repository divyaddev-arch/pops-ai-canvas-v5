import React from 'react';
import { IconButton, IconButtonProps } from './IconButton';
import { Icon } from './Icons';
import { CircularProgressIndicator } from './CircularProgressIndicator';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface SubmitButtonProps extends Omit<IconButtonProps, 'onClick' | 'variant'> {
  loading: boolean;
  /** The progress for determinate loading, from 0 to 1. */
  progress?: number;
  /** Called when the user clicks the button to initiate the submission. */
  onSubmit: () => void;
  /** Called when the user clicks the button while it is in the loading state to cancel. */
  onCancel: () => void;
  /** The visual style of the button. */
  variant?: 'filled' | 'surface';
}

export const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ loading, progress, onSubmit, onCancel, variant = 'filled', className, ...props }, ref) => {
    const isDeterminate = progress !== undefined;

    const handleClick = () => {
      if (loading) {
        onCancel();
      } else {
        onSubmit();
      }
    };

    const variantConfig: { variant: IconButtonProps['variant'], customClassName?: string } = { variant: 'standard' };

    if (variant === 'surface') {
      // Use standard for base states (focus, disabled), but override colors.
      variantConfig.variant = 'standard';
      variantConfig.customClassName = loading
        ? 'bg-primary-10 text-primary'
        : 'bg-surface-container-high text-on-surface';
    } else { // default 'filled'
      variantConfig.variant = loading ? 'tonal' : 'filled';
    }
    
    return (
      <IconButton
        ref={ref}
        variant={variantConfig.variant}
        onClick={handleClick}
        aria-label={loading ? 'Cancel submission' : 'Submit'}
        className={cn(variantConfig.customClassName, className)}
        {...props}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CircularProgressIndicator
                size={40}
                strokeWidth={3}
                value={isDeterminate ? progress * 100 : undefined}
                isIndeterminate={!isDeterminate}
                secondaryClassName={isDeterminate ? 'hidden' : undefined}
              />
            </div>
          )}
          <Icon className={cn(
            'filled-icon',
            // Move send icon slightly to the right for better visual alignment
            !loading && 'translate-x-[1px]'
          )}>{loading ? 'stop' : 'send'}</Icon>
        </div>
      </IconButton>
    );
  }
);
SubmitButton.displayName = 'SubmitButton';