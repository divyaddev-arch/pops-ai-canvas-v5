import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CircularProgressIndicator } from './CircularProgressIndicator';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const PULL_THRESHOLD = 100; // The distance in px to pull before a refresh is triggered.
const REFRESHING_OFFSET = 60; // The distance in px the content will be offset while refreshing.
const PULL_RESISTANCE = 0.5; // A factor to make the pull feel "heavier".

export interface PullToRefreshProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
  className?: string;
}

export const PullToRefresh = React.forwardRef<HTMLDivElement, PullToRefreshProps>(
  ({ isRefreshing, onRefresh, children, className }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const scrollableRef = useRef<HTMLElement | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const [pullDistance, setPullDistance] = useState(0);

    useEffect(() => {
        if (contentRef.current && contentRef.current.firstElementChild) {
            scrollableRef.current = contentRef.current.firstElementChild as HTMLElement;
        }
    }, [children]);


    const handlePullStart = useCallback((clientY: number) => {
      if (isRefreshing || (scrollableRef.current && scrollableRef.current.scrollTop > 0)) {
        return;
      }
      setIsDragging(true);
      startY.current = clientY;
      setPullDistance(0);
    }, [isRefreshing]);

    const handlePullMove = useCallback((clientY: number) => {
      if (!isDragging) return;
      const distance = clientY - startY.current;
      if (distance >= 0) { // Only allow pulling down
        setPullDistance(distance);
      }
    }, [isDragging]);

    const handlePullEnd = useCallback(() => {
      if (!isDragging) return;
      setIsDragging(false);

      if (pullDistance > PULL_THRESHOLD) {
        onRefresh();
      }
      setPullDistance(0);
    }, [isDragging, pullDistance, onRefresh]);

    // Touch event handlers
    const onTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            handlePullStart(e.touches[0].clientY);
        }
    };
    const onTouchMove = (e: React.TouchEvent) => {
        if(isDragging && pullDistance > 0 && e.touches.length === 1){
            // This is important to prevent the browser's default pull-to-refresh action or scrolling.
            e.preventDefault();
            handlePullMove(e.touches[0].clientY);
        }
    };
    const onTouchEnd = handlePullEnd;

    // Mouse event handlers
    const onMouseDown = (e: React.MouseEvent) => handlePullStart(e.clientY);

    useEffect(() => {
      const onMouseMove = (e: MouseEvent) => handlePullMove(e.clientY);
      const onMouseUp = () => handlePullEnd();
      
      if (isDragging) {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      }
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
    }, [isDragging, handlePullMove, handlePullEnd]);

    const effectivePullDistance = isDragging ? pullDistance * PULL_RESISTANCE : 0;
    const contentOffset = isRefreshing ? REFRESHING_OFFSET : effectivePullDistance;
    const progress = Math.min(1, pullDistance / PULL_THRESHOLD);

    return (
      <div
        ref={ref}
        className={cn("relative", isDragging && 'select-none cursor-grab', className)}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div
          aria-hidden={!isRefreshing && progress === 0}
          className="absolute top-[-40px] left-0 right-0 flex justify-center pointer-events-none transition-transform duration-300"
          style={{
            opacity: isRefreshing ? 1 : progress,
            transform: `translateY(${contentOffset}px) scale(${isRefreshing ? 1 : progress})`,
          }}
        >
          <div className="bg-surface-container-high rounded-full shadow-lg p-1">
            <CircularProgressIndicator
              size={40}
              strokeWidth={3}
              isIndeterminate={isRefreshing}
              value={isRefreshing ? undefined : progress * 100}
              className="text-primary"
              secondaryClassName="text-primary/20"
            />
          </div>
        </div>

        <div
          ref={contentRef}
          className={cn(
            // Apply transition only when not actively dragging to allow smooth snapping back/forth
            !isDragging && 'transition-transform duration-300 ease-out'
          )}
          style={{ transform: `translateY(${contentOffset}px)` }}
        >
          {children}
        </div>
      </div>
    );
  }
);
PullToRefresh.displayName = 'PullToRefresh';
