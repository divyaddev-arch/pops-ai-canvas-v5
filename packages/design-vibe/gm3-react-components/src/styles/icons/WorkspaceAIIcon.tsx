import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

/**
 * A custom SVG icon for a Google Workspace AI.
 */
export const WorkspaceAIIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const { mode } = useTheme();

    if (mode === 'dark') {
        return (
            <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={cn("w-6 h-6", className)}
                {...props}
            >
                <path d="M9.14 12.67H11.36L10.25 9.78L9.14 12.67ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12.64 16L11.87 14H8.63L7.86 16H6.5L9.57 8H10.93L14 16H12.64ZM16.5 16H15V10.5H16.5V16ZM15.75 9.5C15.34 9.5 15 9.16 15 8.75C15 8.34 15.34 8 15.75 8C16.16 8 16.5 8.34 16.5 8.75C16.5 9.16 16.16 9.5 15.75 9.5Z" fill="#FFB74D"/>
            </svg>
        );
    }

    return (
        <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={cn("w-6 h-6", className)}
            {...props}
        >
            <path 
                d="M9.14 12.67H11.36L10.25 9.78L9.14 12.67ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12.64 16L11.87 14H8.63L7.86 16H6.5L9.57 8H10.93L14 16H12.64ZM16.5 16H15V10.5H16.5V16ZM15.75 9.5C15.34 9.5 15 9.16 15 8.75C15 8.34 15.34 8 15.75 8C16.16 8 16.5 8.34 16.5 8.75C16.5 9.16 16.16 9.5 15.75 9.5Z" 
                fill="#FA7B17"
            />
        </svg>
    );
};