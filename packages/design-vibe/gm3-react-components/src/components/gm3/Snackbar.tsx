"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { Icon } from '../Icons';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface SnackbarProps {
  open: boolean;
  onClose: () => void;
  message: React.ReactNode;
  actionLabel?: string;
  onActionClick?: () => void;
  showDismiss?: boolean;
  duration?: number;
  twoLine?: boolean;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  open,
  onClose,
  message,
  actionLabel,
  onActionClick,
  showDismiss = false,
  twoLine = false,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleClose = () => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
    }
    onClose();
  };

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsClosing(false);
      
      if (duration !== Infinity) {
        timerRef.current = window.setTimeout(() => {
          onClose();
        }, duration);
      }
    } else {
      setIsClosing(true);
      const animationTimer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(animationTimer);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [open, duration, onClose]);

  const handleActionClick = () => {
    onActionClick?.();
    handleClose();
  };

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
        "flex justify-between",
        "bg-inverse-surface text-inverse-on-surface rounded-[8px] shadow-elevation-3",
        "min-w-[288px] max-w-[512px] w-[calc(100%-32px)] sm:w-auto",
        twoLine ? 'min-h-[68px]' : 'h-[48px]',
        (open && !isClosing) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      <div className={cn(
        "body-medium flex-1",
        twoLine ? 'pl-[16px] pr-4 py-4' : 'pl-[16px] pr-4 py-[14px] truncate self-center'
      )}>
        {message}
      </div>
      <div className={cn(
        "flex items-center flex-shrink-0 pr-[3px]",
        twoLine ? 'self-end pb-1' : 'self-center'
      )}>
        {actionLabel && onActionClick && (
          <Button
            variant="text"
            size="small"
            onClick={handleActionClick}
            className="!text-inverse-primary !label-large tracking-normal !px-3 mr-1.5"
          >
            {actionLabel}
          </Button>
        )}
        {showDismiss && (
          <IconButton
            variant="standard"
            size="small"
            onClick={handleClose}
            aria-label="Dismiss"
            className="!text-inverse-on-surface"
          >
            <Icon>close</Icon>
          </IconButton>
        )}
      </div>
    </div>,
    document.body
  );
};
