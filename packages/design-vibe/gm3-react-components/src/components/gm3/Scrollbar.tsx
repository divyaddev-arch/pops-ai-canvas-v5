import React, { useState, useEffect, useRef, useCallback, useImperativeHandle } from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface ScrollbarRef {
  scrollTo: (options: ScrollToOptions) => void;
  scrollToBottom: () => void;
  readonly element: HTMLDivElement | null;
}

export interface ScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
}

export const Scrollbar = React.forwardRef<ScrollbarRef, ScrollbarProps>(
  ({ children, className, orientation = 'vertical', ...props }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const hitAreaRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<number | undefined>(undefined);
    const isInitialMount = useRef(true);
    const ignoreScrollEvents = useRef(false);
    const ignoreScrollTimeout = useRef<number | undefined>(undefined);

    const [isDragging, setIsDragging] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    const isVertical = orientation === 'vertical';

    useImperativeHandle(ref, () => ({
      get element() {
        return contentRef.current;
      },
      scrollTo: (options: ScrollToOptions) => {
        if (contentRef.current) {
          ignoreScrollEvents.current = true;
          contentRef.current.scrollTo(options);
          clearTimeout(ignoreScrollTimeout.current);
          ignoreScrollTimeout.current = window.setTimeout(() => {
            ignoreScrollEvents.current = false;
          }, 150);
        }
      },
      scrollToBottom: () => {
        if (contentRef.current) {
          ignoreScrollEvents.current = true;
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
          clearTimeout(ignoreScrollTimeout.current);
          ignoreScrollTimeout.current = window.setTimeout(() => {
            ignoreScrollEvents.current = false;
          }, 150);
        }
      }
    }), []);

    const updateScrollbar = useCallback(() => {
        if (!contentRef.current || !hitAreaRef.current) return false;

        const {
            scrollTop, scrollHeight, clientHeight,
            scrollLeft, scrollWidth, clientWidth
        } = contentRef.current;
        
        const hitAreaEl = hitAreaRef.current;
        let hasScroll = false;
        
        const PADDING = 8;

        if (isVertical) {
            hasScroll = scrollHeight > clientHeight;
            if (hasScroll) {
              const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 20);
              const hitAreaHeight = thumbHeight + PADDING * 2;
              const scrollableDist = clientHeight - hitAreaHeight;
              const scrollRatio = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
              const hitAreaY = scrollRatio * scrollableDist;

              hitAreaEl.style.height = `${hitAreaHeight}px`;
              hitAreaEl.style.transform = `translateY(${hitAreaY}px)`;
            }
        } else {
            hasScroll = scrollWidth > clientWidth;
            if (hasScroll) {
              const thumbWidth = Math.max((clientWidth / scrollWidth) * clientWidth, 20);
              const hitAreaWidth = thumbWidth + PADDING * 2;
              const scrollableDist = clientWidth - hitAreaWidth;
              const scrollRatio = scrollWidth > clientWidth ? scrollLeft / (scrollWidth - clientWidth) : 0;
              const hitAreaX = scrollRatio * scrollableDist;

              hitAreaEl.style.width = `${hitAreaWidth}px`;
              hitAreaEl.style.transform = `translateX(${hitAreaX}px)`;
            }
        }
        
        hitAreaEl.style.display = hasScroll ? 'block' : 'none';
        return hasScroll;
    }, [isVertical]);

    const showAndSetHideTimer = useCallback(() => {
        if (!updateScrollbar()) return;

        if (isInitialMount.current) return;

        setIsVisible(true);
        clearTimeout(scrollTimeoutRef.current);

        scrollTimeoutRef.current = window.setTimeout(() => {
            if (!isDragging) {
              setIsVisible(false);
            }
        }, 1500);
    }, [isDragging, updateScrollbar]);

    const handleResize = useCallback(() => {
        updateScrollbar();
    }, [updateScrollbar]);

    const handleScroll = useCallback(() => {
        if (ignoreScrollEvents.current) {
            return;
        }
        showAndSetHideTimer();
    }, [showAndSetHideTimer]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !contentRef.current) return;
            e.preventDefault();
            const contentEl = contentRef.current;
            if (isVertical) {
                const scrollRatio = contentEl.scrollHeight / contentEl.clientHeight;
                contentEl.scrollTop += e.movementY * scrollRatio;
            } else {
                const scrollRatio = contentEl.scrollWidth / contentEl.clientWidth;
                contentEl.scrollLeft += e.movementX * scrollRatio;
            }
        };
        const handleMouseUp = () => {
            if (isDragging) {
              setIsDragging(false);
              // When dragging stops, restart the hide timer.
              showAndSetHideTimer();
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isVertical, showAndSetHideTimer]);

    useEffect(() => {
        const contentEl = contentRef.current;
        if (contentEl) {
            const resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(contentEl);
            // FIX: Explicitly cast child to Element as ResizeObserver.observe expects it.
            Array.from(contentEl.children).forEach(child => resizeObserver.observe(child as Element));
            
            contentEl.addEventListener('scroll', handleScroll, { passive: true });
            updateScrollbar();

            const timer = setTimeout(() => { isInitialMount.current = false; }, 500);

            return () => {
                resizeObserver.disconnect();
                if (contentEl) {
                  contentEl.removeEventListener('scroll', handleScroll);
                }
                clearTimeout(scrollTimeoutRef.current);
                clearTimeout(timer);
            };
        }
    }, [handleScroll, updateScrollbar, handleResize]);
    
    const handleThumbMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        clearTimeout(scrollTimeoutRef.current);
        setIsVisible(true);
    };
    
    const handleThumbMouseEnter = () => {
        // Keep scrollbar visible while hovered over the thumb
        clearTimeout(scrollTimeoutRef.current);
    };

    const handleThumbMouseLeave = () => {
        // When mouse leaves thumb, restart hide timer (if not dragging)
        if (!isDragging) {
            showAndSetHideTimer();
        }
    };

    return (
        <div
            className={cn("relative overflow-hidden flex", isVertical ? 'flex-col' : 'flex-row', className)}
            {...props}
        >
            <div
                ref={contentRef}
                className={cn(
                    'custom-scrollbar-content relative z-0 flex-1',
                    isVertical ? 'overflow-y-auto min-h-0' : 'overflow-x-auto min-w-0'
                )}
            >
                {children}
            </div>
            
            <div
              ref={hitAreaRef}
              onMouseDown={handleThumbMouseDown}
              onMouseEnter={handleThumbMouseEnter}
              onMouseLeave={handleThumbMouseLeave}
              className={cn(
                  'group absolute z-10 cursor-pointer flex',
                  'transition-opacity duration-150',
                  isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
                  isVertical
                    ? 'right-1 top-0 w-[12px] py-2 flex-col items-end'
                    : 'bottom-1 left-0 h-[12px] px-2 flex-row items-end'
              )}
            >
                <div
                    className={cn(
                        'rounded-full transition-colors duration-150',
                        'bg-on-surface-16 group-hover:bg-on-surface-38',
                        isDragging && '!bg-on-surface-38',
                        isVertical
                            ? 'w-[8px] h-full'
                            : 'h-[8px] w-full'
                    )}
                />
            </div>
        </div>
    );
  }
);
Scrollbar.displayName = 'Scrollbar';
