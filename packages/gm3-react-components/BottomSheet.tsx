
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Scrollbar } from './Scrollbar';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showDragHandle?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  children,
  showDragHandle = true,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const position = useRef(0);
  const startY = useRef(0);

  // Effect to handle mounting/unmounting with animation
  useEffect(() => {
    let openTimer: number;
    let closeTimer: number;

    if (open) {
      setIsRendered(true);
      // Using setTimeout to allow the component to mount with initial styles (off-screen)
      // before applying the final styles (on-screen), triggering the transition.
      openTimer = window.setTimeout(() => {
        setIsShown(true);
      }, 10);
    } else {
      setIsShown(false);
      // Wait for the closing animation to finish before removing from DOM
      closeTimer = window.setTimeout(() => {
        setIsRendered(false);
      }, 400); // match animation duration
    }

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [open]);
  
  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startY.current = y - position.current;
    if (sheetRef.current) {
        sheetRef.current.style.transition = 'none';
    }
  }, []);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
      if (!isDragging || !sheetRef.current) return;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const newY = y - startY.current;
      // Clamp drag to only go downwards from the fully open state (y=0)
      position.current = Math.max(0, newY);
      sheetRef.current.style.transform = `translateY(${position.current}px)`;
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
      if (!isDragging || !sheetRef.current) return;
      setIsDragging(false);
      sheetRef.current.style.transition = 'transform 300ms ease-out';
      
      const sheetHeight = sheetRef.current.offsetHeight;
      
      // Snap logic: if dragged more than 1/3 down, close. Otherwise, snap back open.
      if (position.current > sheetHeight / 3) {
        onClose();
      } else {
        position.current = 0;
        sheetRef.current.style.transform = `translateY(0px)`;
      }
  }, [isDragging, onClose]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('touchmove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (open && !isDragging) {
      position.current = 0;
    }
  }, [open, isDragging]);

  if (!isRendered) return null;
  
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Scrim */}
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-scrim transition-opacity duration-300 pointer-events-auto',
          isShown ? 'opacity-30' : 'opacity-0'
        )}
      />
      
      {/* Sheet Container */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        className={cn(
            'fixed bottom-0 left-0 right-0 bg-surface-container-low rounded-t-[28px] shadow-lg flex flex-col max-h-[33.33vh] pointer-events-auto',
            'transition-transform duration-motion-slow ease-motion-slow',
            // Apply transform based on state, but not when dragging
            !isDragging && (isShown ? 'translate-y-0' : 'translate-y-full')
        )}
        style={isDragging ? { transform: `translateY(${position.current}px)` } : {}}
      >
        {showDragHandle && (
          <div 
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="w-full h-8 flex-shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <div className="w-8 h-1 bg-on-surface-variant/40 rounded-full" />
          </div>
        )}
        <Scrollbar className="flex-1 min-h-0">
          {children}
        </Scrollbar>
      </div>
    </div>,
    document.body
  );
};