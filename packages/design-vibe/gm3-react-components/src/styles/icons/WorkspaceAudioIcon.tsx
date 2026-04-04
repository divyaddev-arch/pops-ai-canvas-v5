import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const WorkspaceAudioIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const { mode } = useTheme();

    if (mode === 'dark') {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM7.2 18C6.54 18 6 17.46 6 16.8V12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12V16.8C18 17.46 17.46 18 16.8 18H14V14H16V12C16 9.79 14.21 8 12 8C9.79 8 8 9.79 8 12V14H10V18H7.2Z" fill="#E57373"/>
            </svg>
        );
    }
    
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM7.2 18C6.54 18 6 17.46 6 16.8V12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12V16.8C18 17.46 17.46 18 16.8 18H14V14H16V12C16 9.79 14.21 8 12 8C9.79 8 8 9.79 8 12V14H10V18H7.2Z" fill="#D93025"/>
        </svg>
    );
};