
"use client";

import React, { useState, useId, useRef, useLayoutEffect, useEffect, ChangeEvent, KeyboardEvent, FocusEvent, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Icon } from '../Icons';
import { Menu, MenuItem } from './Menu';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'onChange' | 'supportingText'> {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  label: string;
  supportingText?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children?: React.ReactNode;
  isError?: boolean;
  disabled?: boolean;
  variant?: 'outlined' | 'filled' | 'filled-minimal';
  noLabel?: boolean;
  multiline?: boolean;
  autoGrow?: boolean;
  labelBgClass?: string;
  containerClassName?: string;
  inputClassName?: string;
  editorId?: string;
}

export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(({
  value,
  onChange,
  label,
  supportingText,
  leadingIcon,
  trailingIcon,
  children,
  isError = false,
  disabled = false,
  className,
  variant = 'outlined',
  noLabel = false,
  multiline = false,
  autoGrow = true,
  labelBgClass,
  containerClassName,
  inputClassName = 'body-large text-on-surface',
  editorId,
  ...props
}, ref) => {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  useImperativeHandle(ref, () => localRef.current!);

  const resize = () => {
    if (multiline && autoGrow && localRef.current) {
      const textarea = localRef.current;
      textarea.style.height = 'auto'; 
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useLayoutEffect(() => {
    resize();
  }, [value, multiline, autoGrow]);

  useEffect(() => {
    const textarea = localRef.current;
    if (multiline && autoGrow && textarea) {
      const handleResize = () => requestAnimationFrame(resize);
      document.fonts.ready.then(handleResize);
      const observer = new ResizeObserver(handleResize);
      observer.observe(textarea);
      window.addEventListener('load', handleResize);
      return () => {
        observer.disconnect();
        window.removeEventListener('load', handleResize);
      };
    }
  }, [multiline, autoGrow]); 

  const isMenu = React.Children.count(children) > 0;
  const isMenuOpen = Boolean(menuAnchor) && isMenu;

  const handleMenuOpen = (e: React.MouseEvent) => {
    if (!disabled) {
      e.stopPropagation();
      setMenuAnchor(containerRef.current);
    }
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const hasValue = value != null && value !== '';
  const _isFocused = isFocused || isMenuOpen;
  
  // Logic: The label should always be present unless explicitly disabled.
  // It floats if there is a value, focus, or a placeholder (to avoid overlap).
  const isLabelFloating = !noLabel && (hasValue || _isFocused || !!props.placeholder);
  const showLabel = !noLabel;

  const isOutlined = variant === 'outlined';
  const isFilled = variant === 'filled';
  const isFilledMinimal = variant === 'filled-minimal';
  
  const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true);
    props.onFocus?.(e as any);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    props.onBlur?.(e as any);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      (e.currentTarget as HTMLElement).blur();
    }
    if (isMenu && (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown')) {
        e.preventDefault();
        setMenuAnchor(containerRef.current);
    }
    props.onKeyDown?.(e as any);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange?.(e);
  };
  
  const labelColor = disabled ? 'text-on-surface-38' : isError ? 'text-error' : _isFocused ? 'text-primary' : 'text-on-surface-variant';
  const supportingTextColor = disabled ? 'text-on-surface-38' : isError ? 'text-error' : 'text-on-surface-variant';
  const iconColor = disabled ? 'text-on-surface-38' : 'text-on-surface-variant';

  const outlinedBorderColor = disabled ? 'border-on-surface-38' : isError ? 'border-error' : _isFocused ? 'border-primary' : 'border-outline-variant';
  const outlinedBorderWidth = (_isFocused || isError) && !disabled ? 'border-2' : 'border';

  const filledBgColor = disabled ? 'bg-on-surface-12' : 'bg-surface-container-high hover:bg-surface-container-highest';
  const filledUnderlineColor = disabled ? 'border-on-surface-38' : isError ? 'border-error' : 'border-on-surface-variant';
  const filledUnderlineWidth = (_isFocused || isError) && !disabled ? 'border-b-2' : 'border-b';

  const finalTrailingIcon = isMenu 
    ? <Icon className={cn('transition-transform duration-200', isMenuOpen && 'rotate-180')}>arrow_drop_down</Icon>
    : trailingIcon;
  
  const processMenuItems = (nodes: React.ReactNode): React.ReactNode[] => {
    return (React.Children.map(nodes, child => {
        if (!React.isValidElement(child)) {
            return child;
        }
        const el = child as React.ReactElement<any>;

        const isMenuItem =
          (el.type as any).displayName === 'MenuItem' ||
          el.props.role === 'menuitem' ||
          (el.type as any).__isMenuItem;

        if (isMenuItem) {
            const originalOnClick = el.props.onClick;
            return React.cloneElement(el, {
                onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                    originalOnClick?.(e);
                    handleMenuClose();
                }
            });
        }
        if (el.props.children) {
            return React.cloneElement(el, {
                children: processMenuItems(el.props.children)
            });
        }
        return child;
    }) ?? []);
  };

  const menuItems = isMenu ? processMenuItems(children) : null;
  
  const isScrollable = multiline && !autoGrow;
  const hitAreaRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | undefined>(undefined);
  const isInitialMount = useRef(true);

  const [isDragging, setIsDragging] = useState(false);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);

  const updateScrollbar = useCallback(() => {
    if (!isScrollable || !localRef.current || !hitAreaRef.current) return false;

    const { scrollTop, scrollHeight, clientHeight } = localRef.current;
    const hitAreaEl = hitAreaRef.current;
    
    const hasScroll = scrollHeight > clientHeight;
    const PADDING = 8;

    if (hasScroll) {
      const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 20);
      const hitAreaHeight = thumbHeight + PADDING * 2;
      const scrollableDist = clientHeight - hitAreaHeight;
      const scrollRatio = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
      const hitAreaY = scrollRatio * scrollableDist;

      hitAreaEl.style.height = `${hitAreaHeight}px`;
      hitAreaEl.style.transform = `translateY(${hitAreaY}px)`;
    }
    
    hitAreaEl.style.display = hasScroll ? 'block' : 'none';
    return hasScroll;
  }, [isScrollable]);

  const showAndSetHideTimer = useCallback(() => {
    if (!updateScrollbar() || isInitialMount.current) return;

    setIsScrollbarVisible(true);
    clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = window.setTimeout(() => {
      if (!isDragging) setIsScrollbarVisible(false);
    }, 1500);
  }, [isDragging, updateScrollbar]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !localRef.current) return;
      e.preventDefault();
      const contentEl = localRef.current;
      const scrollRatio = contentEl.scrollHeight / contentEl.clientHeight;
      contentEl.scrollTop += e.movementY * scrollRatio;
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        showAndSetHideTimer();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, showAndSetHideTimer]);

  useEffect(() => {
    const contentEl = localRef.current;
    if (contentEl && isScrollable) {
      const resizeObserver = new ResizeObserver(updateScrollbar);
      resizeObserver.observe(contentEl);
      
      contentEl.addEventListener('scroll', showAndSetHideTimer, { passive: true });
      updateScrollbar();

      const timer = setTimeout(() => { isInitialMount.current = false; }, 500);

      return () => {
        resizeObserver.disconnect();
        contentEl.removeEventListener('scroll', showAndSetHideTimer);
        clearTimeout(scrollTimeoutRef.current);
        clearTimeout(timer);
      };
    }
  }, [isScrollable, showAndSetHideTimer, updateScrollbar]);
  
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    clearTimeout(scrollTimeoutRef.current);
    setIsScrollbarVisible(true);
  };
  
  const handleThumbMouseEnter = () => clearTimeout(scrollTimeoutRef.current);

  const handleThumbMouseLeave = () => {
    if (!isDragging) showAndSetHideTimer();
  };

  const inputClasses = cn(
    'block w-full bg-transparent outline-none transition-colors placeholder:text-outline',
    'disabled:text-on-surface-38 caret-primary',
    leadingIcon ? 'pl-[52px]' : 'pl-[16px]',
    finalTrailingIcon
      ? (isScrollable ? 'pr-[68px]' : 'pr-[52px]')
      : (isScrollable ? 'pr-[16px]' : 'pr-[16px]'),
    isScrollable && 'custom-scrollbar-content'
  );
  
  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <div
        ref={containerRef}
        onClick={isMenu ? handleMenuOpen : undefined}
        className={cn(
          "relative transition-colors duration-200",
          !multiline && "h-[56px]",
          multiline && !autoGrow && "h-full",
          (isFilled || isFilledMinimal) && filledBgColor,
          isFilled && "rounded-t-[8px]",
          isFilledMinimal && "rounded-[8px] overflow-hidden",
          isMenu && !disabled && "cursor-pointer",
          containerClassName
        )}
      >
        {isOutlined && (
          <div className={cn(
            'absolute inset-0 rounded-[8px] border pointer-events-none transition-colors duration-200',
            outlinedBorderColor,
            outlinedBorderWidth,
            isScrollable && 'overflow-hidden'
          )}></div>
        )}

        {leadingIcon && (
          <div
            className={cn("absolute left-[12px] top-[16px] pointer-events-none flex items-center justify-center", iconColor)}
            style={{ width: '24px', height: '24px' }}
          >
            {leadingIcon}
          </div>
        )}

        {showLabel && (
          <label
            htmlFor={id}
            className={cn(
              'absolute pointer-events-none origin-top-left transition-all duration-200 ease-out',
              labelColor,
              isLabelFloating
                ? cn('body-small', isOutlined ? 'top-[-6px]' : 'top-[8px]')
                : 'body-large top-1/2 -translate-y-1/2',
              isLabelFloating
                ? (leadingIcon
                    ? 'left-[52px]'
                    : 'left-[16px]')
                : (leadingIcon ? 'left-[52px]' : 'left-[16px]'),
              isLabelFloating && isOutlined && cn(labelBgClass || 'bg-surface', 'px-1 -translate-x-1'),
            )}
          >
            {label}
          </label>
        )}
        
        <InputComponent
          ref={localRef}
          id={id}
          value={value ?? ''}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={props.placeholder || (noLabel ? label : '')}
          readOnly={isMenu}
          rows={multiline ? 1 : undefined}
          className={cn(
            inputClasses,
            inputClassName,
            isOutlined && 'rounded-[8px]',
            isFilled && 'rounded-t-[8px]',
            isFilledMinimal && 'rounded-[8px]',
            multiline ? cn('py-4 resize-none', !autoGrow && 'h-full') : (
              isOutlined
                ? 'h-full py-4'
                : isLabelFloating
                  ? (hasValue ? 'pt-[23px] pb-[8px]' : 'pt-[24px] pb-[7px]')
                  : 'py-4'
            )
          )}
          {...props}
        />
        
        {finalTrailingIcon && (
          <div
            onMouseDown={(e) => e.preventDefault()}
            className={cn(
              "absolute right-[8px]",
              multiline ? "top-[8px]" : "top-0 h-full flex items-center",
              iconColor
            )}
          >
            {finalTrailingIcon}
          </div>
        )}
        
        {isScrollable && (
          <div
            ref={hitAreaRef}
            onMouseDown={handleThumbMouseDown}
            onMouseEnter={handleThumbMouseEnter}
            onMouseLeave={handleThumbMouseLeave}
            className={cn(
              'group absolute z-10 cursor-pointer flex',
              'transition-opacity duration-150',
              isScrollbarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
              'top-0 w-[12px] py-2 flex-col items-end h-full',
              finalTrailingIcon ? 'right-[52px]' : 'right-[1px]'
            )}
          >
            <div
              className={cn(
                'rounded-full transition-colors duration-150',
                'bg-on-surface-16 group-hover:bg-on-surface-38',
                isDragging && '!bg-on-surface-38',
                'w-[8px] h-full'
              )}
            />
          </div>
        )}

        {isFilled && !multiline && (
          <div className={cn(
            "absolute bottom-0 left-0 right-0 pointer-events-none transition-all duration-200",
            filledUnderlineColor,
            filledUnderlineWidth
          )}></div>
        )}

        {isFilledMinimal && isError && !disabled && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-error pointer-events-none" />
        )}
      </div>

      {supportingText !== undefined && (
        <div className={cn("pt-1 px-[16px] label-small min-h-[16px]", supportingTextColor)}>
          {supportingText || ' '}
        </div>
      )}

      {isMenu && (
        <Menu
            anchorEl={menuAnchor}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {processMenuItems(children)}
        </Menu>
      )}
    </div>
  );
});
TextField.displayName = 'TextField';
