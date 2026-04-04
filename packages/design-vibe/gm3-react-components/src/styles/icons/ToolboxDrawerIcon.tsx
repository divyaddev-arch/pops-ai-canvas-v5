import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const ToolboxDrawerIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)} {...props}>
            <path d="M9.5 8C9.5 7.17157 8.82843 6.5 8 6.5C7.17157 6.5 6.5 7.17157 6.5 8C6.5 8.82843 7.17157 9.5 8 9.5V11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8C11 9.65685 9.65685 11 8 11V9.5C8.82843 9.5 9.5 8.82843 9.5 8Z" fill="currentColor"/>
            <path d="M15.5 16C15.5 15.1716 16.1716 14.5 17 14.5C17.8284 14.5 18.5 15.1716 18.5 16C18.5 16.8284 17.8284 17.5 17 17.5V19C18.6569 19 20 17.6569 20 16C20 14.3431 18.6569 13 17 13C15.3431 13 14 14.3431 14 16C14 17.6569 15.3431 19 17 19V17.5C16.1716 17.5 15.5 16.8284 15.5 16Z" fill="currentColor"/>
            <rect x="13" y="7" width="7" height="2" rx="1" fill="currentColor"/>
            <rect width="7" height="2" rx="1" transform="matrix(-1 0 0 1 12 15)" fill="currentColor"/>
        </svg>
    );
};
