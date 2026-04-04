import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface WavyProgressIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * An indeterminate progress indicator with a wavy animation.
 * Based on the GM3 WavyProgressIndicator.
 * https://source.corp.google.com/piper///depot/google3/java/com/google/android/libraries/material/compose/WavyProgressIndicator.kt
 */
export const WavyProgressIndicator: React.FC<WavyProgressIndicatorProps> = ({
    className,
    ...props
}) => {
    return (
        <div
            role="progressbar"
            aria-busy="true"
            className={cn('flex items-end justify-center gap-[4px] w-[20px] h-[12px]', className)}
            {...props}
        >
            <div className="w-[4px] h-[12px] bg-primary wavy-progress-indicator-rect wavy-progress-indicator-rect-1 rounded-full" />
            <div className="w-[4px] h-[12px] bg-primary wavy-progress-indicator-rect wavy-progress-indicator-rect-2 rounded-full" />
            <div className="w-[4px] h-[12px] bg-primary wavy-progress-indicator-rect wavy-progress-indicator-rect-3 rounded-full" />
        </div>
    );
};

WavyProgressIndicator.displayName = 'WavyProgressIndicator';