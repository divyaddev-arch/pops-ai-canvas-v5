"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Button } from './Button';
import { Icon } from './Icons';
import { Scrollbar } from './Scrollbar';
import { IconButton } from './IconButton';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  /** If true, the content area will not have padding and will stretch to fill available space. Useful for scrollable content. */
  fullWidthContent?: boolean;
  /** The visual style of the dialog. */
  variant?: 'basic' | 'full-screen';
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  icon,
  title,
  children,
  actions,
  fullWidthContent = false,
  variant = 'basic',
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => setIsVisible(false), 300); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      // Only steal focus once when first opening
      dialogRef.current?.focus();
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const SizedIcon = icon && React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, { className: cn((icon as React.ReactElement<any>).props.className, 'text-2xl text-secondary') })
    : null;

  if (!isVisible) return null;

  if (variant === 'full-screen') {
    return ReactDOM.createPortal(
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={cn(
          'fixed inset-0 z-50 bg-surface flex flex-col',
          'transition-transform duration-300 ease-out',
          (open && !isClosing) ? 'translate-y-0' : 'translate-y-full',
          className
        )}
      >
        <header className="h-[64px] flex-shrink-0 flex items-center px-2 border-b border-outline-variant">
          <IconButton onClick={onClose} aria-label="Close">
            <Icon>close</Icon>
          </IconButton>
          <h2 id="dialog-title" className="headline-small text-on-surface ml-2 flex-1 truncate">
            {title}
          </h2>
          <div className="mr-2">{actions}</div>
        </header>
        <main className="flex-1 min-h-0">
          <Scrollbar>
            <div className={cn(!fullWidthContent && 'p-6')}>
              {children}
            </div>
          </Scrollbar>
        </main>
      </div>,
      document.body
    );
  }

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
      <div className="w-full h-full flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "dialog-title" : undefined}
          className={cn(
            'relative flex flex-col w-full  max-h-[calc(100vh-64px)] bg-surface-container-high rounded-[28px] text-on-surface transition-all duration-300 ease-out',
            (open && !isClosing) ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
        >
          {/* Header */}
          {title && (
            <header className="px-6 pt-6 pb-0 text-center">
              {icon && <div className="mb-4 flex justify-center">{SizedIcon}</div>}
              <h2 id="dialog-title" className="headline-small text-on-surface">{title}</h2>
            </header>
          )}

          {/* Content */}
          <div className={cn(
            'flex-1 min-h-0',
            fullWidthContent ? (title ? 'mt-4' : '') : 'px-6 mt-4 overflow-y-auto scroll-thin'
          )}>
            {fullWidthContent
              ? <Scrollbar className="h-full">{children}</Scrollbar>
              : <div className="body-medium text-on-surface-variant">{children}</div>
            }
          </div>

          {/* Actions */}
          {actions && (
            <footer className="flex justify-end gap-2 p-6 pt-6">
              {actions}
            </footer>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
Dialog.displayName = "Dialog";
