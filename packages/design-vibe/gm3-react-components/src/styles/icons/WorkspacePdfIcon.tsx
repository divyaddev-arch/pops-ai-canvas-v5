import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const WorkspacePdfIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const { mode } = useTheme();

    if (mode === 'dark') {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
                <path fillRule="evenodd" clipRule="evenodd" d="M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3ZM8 11.5H7V10.5H8V11.5ZM9.5 11.5C9.5 12.33 8.83 13 8 13H7V15H5.5V9H8C8.83 9 9.5 9.67 9.5 10.5V11.5ZM17 10.5H19.5V9H15.5V15H17V13H18.5V11.5H17V10.5ZM14.5 13.5C14.5 14.33 13.83 15 13 15H10.5V9H13C13.83 9 14.5 9.67 14.5 10.5V13.5ZM13 13.5H12V10.5H13V13.5Z" fill="#E57373"/>
                <mask id="mask0_1013_116481" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="3" y="3" width="18" height="18">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3ZM8 11.5H7V10.5H8V11.5ZM9.5 11.5C9.5 12.33 8.83 13 8 13H7V15H5.5V9H8C8.83 9 9.5 9.67 9.5 10.5V11.5ZM17 10.5H19.5V9H15.5V15H17V13H18.5V11.5H17V10.5ZM14.5 13.5C14.5 14.33 13.83 15 13 15H10.5V9H13C13.83 9 14.5 9.67 14.5 10.5V13.5ZM13 13.5H12V10.5H13V13.5Z" fill="white"/>
                </mask>
                <g mask="url(#mask0_1013_116481)"></g>
            </svg>
        );
    }
    
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3ZM8 11.5H7V10.5H8V11.5ZM9.5 11.5C9.5 12.33 8.83 13 8 13H7V15H5.5V9H8C8.83 9 9.5 9.67 9.5 10.5V11.5ZM17 10.5H19.5V9H15.5V15H17V13H18.5V11.5H17V10.5ZM14.5 13.5C14.5 14.33 13.83 15 13 15H10.5V9H13C13.83 9 14.5 9.67 14.5 10.5V13.5ZM13 13.5H12V10.5H13V13.5Z" fill="#EA4335"/>
            <mask id="mask0_1013_116223" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="3" y="3" width="18" height="18">
                <path fillRule="evenodd" clipRule="evenodd" d="M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3ZM8 11.5H7V10.5H8V11.5ZM9.5 11.5C9.5 12.33 8.83 13 8 13H7V15H5.5V9H8C8.83 9 9.5 9.67 9.5 10.5V11.5ZM17 10.5H19.5V9H15.5V15H17V13H18.5V11.5H17V10.5ZM14.5 13.5C14.5 14.33 13.83 15 13 15H10.5V9H13C13.83 9 14.5 9.67 14.5 10.5V13.5ZM13 13.5H12V10.5H13V13.5Z" fill="white"/>
            </mask>
            <g mask="url(#mask0_1013_116223)"></g>
        </svg>
    );
};