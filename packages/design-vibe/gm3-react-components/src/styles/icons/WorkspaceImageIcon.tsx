import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const WorkspaceImageIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const { mode } = useTheme();
    
    if (mode === 'dark') {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
                <path fillRule="evenodd" clipRule="evenodd" d="M21 19V5C21 3.895 20.105 3 19 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19ZM8.5 13.5L11 16.505L14.5 12L19 18H5L8.5 13.5Z" fill="#E57373"/>
            </svg>
        );
    }
    
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M21 19V5C21 3.895 20.105 3 19 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19ZM8.5 13.5L11 16.505L14.5 12L19 18H5L8.5 13.5Z" fill="#DB4437"/>
        </svg>
    );
};