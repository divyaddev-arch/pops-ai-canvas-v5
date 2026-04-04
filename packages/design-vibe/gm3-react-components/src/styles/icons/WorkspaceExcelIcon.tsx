import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const WorkspaceExcelIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const { mode } = useTheme();

    if (mode === 'dark') {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
                <g clipPath="url(#clip0_1013_116476)">
                    <path d="M19 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V5C21 3.895 20.105 3 19 3ZM16.2 17H14.2L12 13.2L9.8 17H7.8L11 12L7.8 7H9.8L12 10.8L14.2 7H16.2L13 12L16.2 17Z" fill="#81C784"/>
                </g>
                <defs>
                    <clipPath id="clip0_1013_116476)">
                        <rect width="24" height="24" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        );
    }
    
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
            <g clipPath="url(#clip0_1013_116210)">
                <path d="M19 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V5C21 3.895 20.105 3 19 3ZM16.2 17H14.2L12 13.2L9.8 17H7.8L11 12L7.8 7H9.8L12 10.8L14.2 7H16.2L13 12L16.2 17Z" fill="#34A853"/>
            </g>
            <defs>
                <clipPath id="clip0_1013_116210)">
                    <rect width="24" height="24" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    );
};