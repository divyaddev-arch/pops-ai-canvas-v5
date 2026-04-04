import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface LinearProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The value of the progress indicator, from 0 to 1.
     * If not provided, the indicator will be in an indeterminate state.
     */
    value?: number;
    /**
     * The thickness of the progress bar in pixels.
     * @default 4
     */
    thickness?: number;
}

/**
 * A linear progress indicator that represents determinate or indeterminate progress.
 * https://m3.material.io/components/progress-indicators/overview
 */
export const LinearProgress: React.FC<LinearProgressProps> = ({
    value,
    thickness = 4,
    className,
    ...props
}) => {
    const isDeterminate = value !== undefined;
    const clampedValue = isDeterminate ? Math.max(0, Math.min(1, value)) : 0;

    return (
        <div
            role="progressbar"
            aria-valuenow={isDeterminate ? clampedValue * 100 : undefined}
            aria-valuemin={isDeterminate ? 0 : undefined}
            aria-valuemax={isDeterminate ? 100 : undefined}
            aria-busy={!isDeterminate}
            className={cn(
                'relative w-full overflow-hidden rounded-full',
                className
            )}
            style={{ height: `${thickness}px` }}
            {...props}
        >
            {isDeterminate ? (
                <div className="w-full h-full flex items-center">
                    {/* Active Track */}
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-in-out rounded-full"
                        style={{ width: `${clampedValue * 100}%` }}
                    />
                    {/* Gap */}
                    {clampedValue > 0 && clampedValue < 1 && (
                        <div style={{ width: '4px' }} className="h-full flex-shrink-0" />
                    )}
                    {/* Inactive Track */}
                    {clampedValue < 1 && (
                        <div
                            className="h-full bg-[#C2E7FF] flex-1 transition-all duration-300 ease-in-out rounded-full"
                        />
                    )}
                </div>
            ) : (
                <div className="absolute inset-0 bg-primary/20">
                    <div className="linear-progress-bar linear-progress-bar-1" />
                    <div className="linear-progress-bar linear-progress-bar-2" />
                </div>
            )}
        </div>
    );
};