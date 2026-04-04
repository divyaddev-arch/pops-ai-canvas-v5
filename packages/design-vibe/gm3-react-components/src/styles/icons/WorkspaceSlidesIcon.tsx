
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const WorkspaceSlidesIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const { mode } = useTheme();

    if (mode === 'dark') {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
                <path fillRule="evenodd" clipRule="evenodd" d="M19 3H5.00001C3.90001 3 3.01001 3.9 3.01001 5V19C3.01001 20.1 3.90001 21 5.00001 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 16H5.00001V8H19V16Z" fill="#FFEA82"/>
            </svg>
        );
    }

    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M19 3H5.00001C3.90001 3 3.01001 3.9 3.01001 5V19C3.01001 20.1 3.90001 21 5.00001 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 16H5.00001V8H19V16Z" fill="#F4B400"/>
        </svg>
    );
};
