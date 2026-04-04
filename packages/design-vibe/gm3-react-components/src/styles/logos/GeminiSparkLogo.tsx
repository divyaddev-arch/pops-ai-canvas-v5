
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

/**
 * A custom SVG icon component for the 'Gemini spark' graphic.
 */
export const GeminiSparkLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const { themeKey } = useTheme();
    const isGreyscale = themeKey === 'greyscale';

    const gradId = isGreyscale ? "gemini_spark_grad_greyscale" : "gemini_spark_grad_simple";
    
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={cn("w-6 h-6", className)}
            {...props}
        >
            <defs>
                 {isGreyscale ? (
                    <linearGradient id={gradId} x1="3.5" y1="20.5" x2="20.5" y2="3.5" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#888"></stop>
                        <stop offset="100%" stopColor="#E0E0E0"></stop>
                    </linearGradient>
                 ) : (
                    <linearGradient id={gradId} x1="3.5" y1="20.5" x2="20.5" y2="3.5" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="rgb(52,107,241)"></stop>
                        <stop offset="22%" stopColor="rgb(50,121,248)"></stop>
                        <stop offset="45%" stopColor="rgb(49,134,255)"></stop>
                        <stop offset="72%" stopColor="rgb(64,147,255)"></stop>
                        <stop offset="99%" stopColor="rgb(79,160,255)"></stop>
                    </linearGradient>
                 )}
            </defs>
            <path 
                fill={`url(#${gradId})`}
                d="M12 22C11.9 22 11.8083 21.9667 11.725 21.9C11.6417 21.8333 11.5833 21.75 11.55 21.65C11.2667 20.5333 10.8417 19.4833 10.275 18.5C9.70833 17.5167 9.01667 16.6167 8.2 15.8C7.38333 14.9833 6.48333 14.2917 5.5 13.725C4.51667 13.1583 3.46667 12.7333 2.35 12.45C2.25 12.4167 2.16667 12.3583 2.1 12.275C2.03333 12.1917 2 12.1 2 12C2 11.9 2.03333 11.8083 2.1 11.725C2.16667 11.6417 2.25 11.5833 2.35 11.55C3.46667 11.2667 4.51667 10.8417 5.5 10.275C6.48333 9.70833 7.38333 9.01667 8.2 8.2C9.01667 7.38333 9.70833 6.48333 10.275 5.5C10.8417 4.51667 11.2667 3.46667 11.55 2.35C11.5833 2.25 11.6417 2.16667 11.725 2.1C11.8083 2.03333 11.9 2 12 2C12.1 2 12.1833 2.03333 12.25 2.1C12.3333 2.16667 12.3917 2.25 12.425 2.35C12.725 3.46667 13.1583 4.51667 13.725 5.5C14.2917 6.48333 14.9833 7.38333 15.8 8.2C16.6167 9.01667 17.5167 9.70833 18.5 10.275C19.4833 10.8417 20.5333 11.2667 21.65 11.55C21.75 11.5833 21.8333 11.6417 21.9 11.725C21.9667 11.8083 22 11.9 22 12C22 12.1 21.9667 12.1917 21.9 12.275C21.8333 12.3583 21.75 12.4167 21.65 12.45C20.5333 12.7333 19.4833 13.1583 18.5 13.725C17.5167 14.2917 16.6167 14.9833 15.8 15.8C14.9833 16.6167 14.2917 17.5167 13.725 18.5C13.1583 19.4833 12.7333 20.5333 12.45 21.65C12.4167 21.75 12.3583 21.8333 12.275 21.9C12.1917 21.9667 12.1 22 12 22Z"
            />
        </svg>
    );
};
