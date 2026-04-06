
import React, { useState, useLayoutEffect } from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const variantStyles = {
    small: {
        height: 64,
        titleTypography: 'title-large',
    },
    'center-aligned': {
        height: 64,
        titleTypography: 'title-large',
    },
    medium: {
        height: 112,
        collapsedTitleTypography: 'title-large',
        expandedTitleTypography: 'headline-large',
    },
    large: {
        height: 152,
        collapsedTitleTypography: 'title-large',
        expandedTitleTypography: 'display-small',
    },
};

export interface AppBarMobileProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
    variant: 'small' | 'center-aligned' | 'medium' | 'large';
    title: React.ReactNode;
    navigationIcon?: React.ReactNode;
    actions?: React.ReactNode;
    scrollTargetRef?: React.RefObject<HTMLElement>;
}

export const AppBarMobile = React.forwardRef<HTMLElement, AppBarMobileProps>(({
    variant,
    title,
    navigationIcon,
    actions,
    scrollTargetRef,
    className,
    ...props
}, ref) => {
    const [collapseProgress, setCollapseProgress] = useState(0);

    const isCollapsible = variant === 'medium' || variant === 'large';
    const styles = (variantStyles[variant as keyof typeof variantStyles] || variantStyles.small) as any; // Cast to any to access dynamic properties

    useLayoutEffect(() => {
        const target = scrollTargetRef?.current;
        if (!target || !isCollapsible) {
            setCollapseProgress(0);
            return;
        }

        const handleScroll = () => {
            const scrollY = target.scrollTop;
            const collapseThreshold = styles.height - variantStyles.small.height;
            if (collapseThreshold <= 0) return;
            const progress = Math.min(scrollY / collapseThreshold, 1);
            setCollapseProgress(progress);
        };

        handleScroll();
        target.addEventListener('scroll', handleScroll, { passive: true });
        return () => target.removeEventListener('scroll', handleScroll);
    }, [scrollTargetRef, isCollapsible, styles.height]);
    
    const currentHeight = isCollapsible
        ? styles.height - (styles.height - variantStyles.small.height) * collapseProgress
        : styles.height;

    // Use surface-container for the collapsed color, as per M3 spec.
    const bgColor = collapseProgress > 0.95 ? 'bg-surface-container' : 'bg-surface';
    
    const collapsedTitle = isCollapsible && (
        <h1 className={cn(
            'truncate transition-opacity duration-150',
            styles.collapsedTitleTypography,
            // Fade in when collapse is more than halfway
            collapseProgress > 0.5 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}>
            {title}
        </h1>
    );

    const expandedTitle = isCollapsible && (
        <h1
            className={cn(
                'absolute bottom-4 left-4 truncate transition-opacity duration-150',
                styles.expandedTitleTypography
            )}
            // Fade out as collapse progresses
            style={{ opacity: 1 - collapseProgress, pointerEvents: collapseProgress > 0.5 ? 'none' : 'auto' }}
        >
            {title}
        </h1>
    );

    const nonCollapsibleTitle = !isCollapsible && (
        <h1 className={cn('truncate', styles.titleTypography)}>{title}</h1>
    );

    return (
        <header
            ref={ref}
            className={cn(
                'w-full text-on-surface transition-all duration-200 z-10',
                bgColor,
                collapseProgress > 0.9 ? 'shadow-sm' : 'shadow-none',
                className
            )}
            style={{ height: `${currentHeight}px` }}
            {...props}
        >
            <div className="relative w-full h-full">
                 {/* Top bar container - always 64px high and at the top */}
                <div className="absolute top-0 left-0 right-0 h-[64px] flex items-center px-1 text-on-surface">
                    <div className="flex-shrink-0">{navigationIcon}</div>
                    
                    {/* Title container */}
                    <div className={cn(
                        "flex-1 min-w-0",
                        // Handle centering for center-aligned variant
                        variant === 'center-aligned' && "text-center px-3",
                        // Handle left alignment for other variants
                        variant !== 'center-aligned' && navigationIcon && "ml-3",
                        variant !== 'center-aligned' && !navigationIcon && "ml-3" // Add margin even without nav icon for alignment
                    )}>
                        {nonCollapsibleTitle}
                        {collapsedTitle}
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-1">{actions}</div>
                </div>

                {/* Expanded title is outside the top bar flow, positioned at the bottom */}
                {expandedTitle}
            </div>
        </header>
    );
});

AppBarMobile.displayName = 'AppBarMobile';
