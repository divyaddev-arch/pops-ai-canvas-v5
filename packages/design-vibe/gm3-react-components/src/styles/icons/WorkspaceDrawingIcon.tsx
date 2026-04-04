import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const WorkspaceDrawingIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const { mode } = useTheme();

    if (mode === 'dark') {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM18 18H12V12.21C11.34 12.82 10.47 13.2 9.5 13.2C7.46 13.2 5.8 11.54 5.8 9.5C5.8 7.46 7.46 5.8 9.5 5.8C11.54 5.8 13.2 7.46 13.2 9.5C13.2 10.47 12.82 11.34 12.21 12H18V18Z" fill="#E57373"/>
            </svg>
        );
    }
    
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM18 18H12V12.21C11.34 12.82 10.47 13.2 9.5 13.2C7.46 13.2 5.8 11.54 5.8 9.5C5.8 7.46 7.46 5.8 9.5 5.8C11.54 5.8 13.2 7.46 13.2 9.5C13.2 10.47 12.82 11.34 12.21 12H18V18Z" fill="#D93025"/>
        </svg>
    );
};