import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const WorkspaceMyMapIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const { mode } = useTheme();

    if (mode === 'dark') {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
                <path fillRule="evenodd" clipRule="evenodd" d="M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5ZM12 7C14.2067 7 16 8.74059 16 10.8824C16 13.7941 12 18 12 18C12 18 8 13.7941 8 10.8824C8 8.74059 9.79333 7 12 7ZM12 9.58824C11.2667 9.58824 10.6667 10.1706 10.6667 10.8824C10.6667 11.5941 11.2667 12.1765 12 12.1765C12.74 12.1765 13.3333 11.5941 13.3333 10.8824C13.3333 10.1706 12.7333 9.58824 12 9.58824Z" fill="#E57373"/>
            </svg>
        );
    }
    
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
            <path fillRule="evenodd" clipRule="evenodd" d="M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5ZM12 7C14.2067 7 16 8.74059 16 10.8824C16 13.7941 12 18 12 18C12 18 8 13.7941 8 10.8824C8 8.74059 9.79333 7 12 7ZM12 9.58824C11.2667 9.58824 10.6667 10.1706 10.6667 10.8824C10.6667 11.5941 11.2667 12.1765 12 12.1765C12.74 12.1765 13.3333 11.5941 13.3333 10.8824C13.3333 10.1706 12.7333 9.58824 12 9.58824Z" fill="#C5221F"/>
        </svg>
    );
};