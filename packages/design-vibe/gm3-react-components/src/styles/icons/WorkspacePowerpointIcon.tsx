
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const WorkspacePowerpointIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const { mode } = useTheme();

    if (mode === 'dark') {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9.8 13.4V17H8V7H12.3C13.83 7 14.45 7.3 15.1 7.89C15.75 8.48 16 9.26 16 10.23C16 11.25 15.74 12.03 15.1 12.58C14.46 13.13 13.8 13.4 12.3 13.4H9.8ZM9.8 12H12.1C12.76 12 13.27 11.81 13.6 11.5C13.93 11.2 14.1 10.75 14.1 10.25C14.1 9.72 13.92 9.35 13.6 9C13.28 8.65 12.9 8.4 12.22 8.4H9.8V12Z" fill="#FF8A65"/>
            </svg>
        );
    }
    
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9.8 13.4V17H8V7H12.3C13.83 7 14.45 7.3 15.1 7.89C15.75 8.48 16 9.26 16 10.23C16 11.25 15.74 12.03 15.1 12.58C14.46 13.13 13.8 13.4 12.3 13.4H9.8ZM9.8 12H12.1C12.76 12 13.27 11.81 13.6 11.5C13.93 11.2 14.1 10.75 14.1 10.25C14.1 9.72 13.92 9.35 13.6 9C13.28 8.65 12.9 8.4 12.22 8.4H9.8V12Z" fill="#FD7541"/>
        </svg>
    );
};
