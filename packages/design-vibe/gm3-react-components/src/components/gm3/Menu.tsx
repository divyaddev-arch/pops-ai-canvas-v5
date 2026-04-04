
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { ListItem } from './ListItem';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- MenuItem ---
export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  headline: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Optional value to represent this item in select-like components. */
  value?: any;
}

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ headline, leadingIcon, trailingIcon, value, ...props }, ref) => {
    return (
      <ListItem
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        variant="compact"
        role="menuitem"
        headline={headline}
        leadingContent={leadingIcon}
        trailingContent={trailingIcon}
        disableTruncation={true}
        {...props}
      />
    );
  }
);
MenuItem.displayName = 'MenuItem';
(MenuItem as any).__isMenuItem = true;


// --- Menu ---
export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' | 'center' };
  transformOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' | 'center' };
  disableAutoFocus?: boolean;
}

export const Menu: React.FC<MenuProps> = ({
  anchorEl,
  open,
  onClose,
  children,
  className,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  disableAutoFocus = false,
  ...props
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [effectiveTransformOrigin, setEffectiveTransformOrigin] = useState(transformOrigin);
  const [scrollTick, setScrollTick] = useState(0);
  
  const originClasses = {
    'top-left': 'origin-top-left',
    'top-center': 'origin-top',
    'top-right': 'origin-top-right',
    'bottom-left': 'origin-bottom-left',
    'bottom-center': 'origin-bottom',
    'bottom-right': 'origin-bottom-right',
  };
  const transformOriginClassNameKey = `${effectiveTransformOrigin.vertical}-${effectiveTransformOrigin.horizontal}` as keyof typeof originClasses;

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setPosition(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !isVisible) return;
    const handleScroll = () => setScrollTick(t => t + 1);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [open, isVisible]);

  useLayoutEffect(() => {
    if (open && anchorEl && menuRef.current) {
      const anchorRect = anchorEl.getBoundingClientRect();
      const menuNode = menuRef.current;
      const viewport = { width: window.innerWidth, height: window.innerHeight };

      const menuWidth = menuNode.offsetWidth;
      const menuHeight = menuNode.offsetHeight;

      const PADDING = 6;
      const VIEWPORT_MARGIN = 8;

      let top: number;
      let left: number;
      let currentTransformOrigin = { ...transformOrigin };

      if (anchorOrigin.horizontal === 'left') left = anchorRect.left;
      else if (anchorOrigin.horizontal === 'right') left = anchorRect.right;
      else left = anchorRect.left + anchorRect.width / 2;

      if (currentTransformOrigin.horizontal === 'right') left -= menuWidth;
      else if (currentTransformOrigin.horizontal === 'center') left -= menuWidth / 2;
      
      if (anchorOrigin.vertical === 'bottom') top = anchorRect.bottom + PADDING;
      else top = anchorRect.top - PADDING;

      if (currentTransformOrigin.vertical === 'bottom') top -= menuHeight;

      if (top + menuHeight > viewport.height - VIEWPORT_MARGIN) {
        top = anchorRect.top - menuHeight - PADDING;
        currentTransformOrigin.vertical = 'bottom';
      }
      
      if (top < VIEWPORT_MARGIN) {
        top = VIEWPORT_MARGIN;
        currentTransformOrigin.vertical = 'top';
      }
      if (left + menuWidth > viewport.width - VIEWPORT_MARGIN) left = viewport.width - menuWidth - VIEWPORT_MARGIN;
      if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN;

      setPosition({ top, left });
      setEffectiveTransformOrigin(currentTransformOrigin);
    }
  }, [open, anchorEl, JSON.stringify(anchorOrigin), JSON.stringify(transformOrigin), isVisible, scrollTick]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);
  
  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <div
        ref={menuRef}
        role="menu"
        style={{
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          visibility: position ? 'visible' : 'hidden',
          opacity: position ? 1 : 0
        }}
        className={cn(
          'fixed z-50 py-2 bg-surface-container rounded-[4px] shadow-elevation-2 min-w-[112px] transition-[transform,opacity] duration-100 ease-in-out',
          (open && !isClosing && position) ? 'scale-100' : 'scale-95',
          originClasses[transformOriginClassNameKey],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>,
    document.body
  );
};
Menu.displayName = "Menu";
