import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const WorkspaceSheetsIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const { mode } = useTheme();

    if (mode === 'dark') {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
                <path fillRule="evenodd" clipRule="evenodd" d="M19 3H5C3.9 3 3.01 3.9 3.01 5L3 8V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 11H11V19H9V11H5V9H9V5H11V9H19V11Z" fill="#81C784"/>
            </svg>
        );
    }
    
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M19 3H5C3.9 3 3.01 3.9 3.01 5L3 8V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 11H11V19H9V11H5V9H9V5H11V9H19V11Z" fill="#34A853"/>
        </svg>
    );
};
