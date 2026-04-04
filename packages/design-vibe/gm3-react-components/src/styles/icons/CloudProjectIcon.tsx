import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

/**
 * A custom SVG icon component for the 'Cloud project' graphic.
 */
export const CloudProjectIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={cn("w-6 h-6", className)}
            {...props}
        >
            <path d="M 15.835 17.985 L 13.27 13.536 L 15.835 9.0135 H 21 L 23.565 13.5285 L 21 17.985 H 15.835 ZM 6.035 24 L 3.47 19.551 L 6.035 15.0285 H 11.165 L 13.73 19.5435 L 11.165 24 H 6.035 ZM 6.035 11.976 L 3.47 7.527 L 6.035 3 H 11.165 L 13.73 7.5225 L 11.165 11.976 H 6.035 Z" />
        </svg>
    );
};