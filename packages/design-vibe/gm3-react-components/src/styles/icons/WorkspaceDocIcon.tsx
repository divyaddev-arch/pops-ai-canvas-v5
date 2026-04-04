
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

/**
 * A custom SVG icon for a Google Workspace Doc.
 */
export const WorkspaceDocIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    const { mode } = useTheme();

    if (mode === 'dark') {
        return (
            <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={cn("w-6 h-6", className)}
                {...props}
            >
                <path 
                    fillRule="evenodd" 
                    clipRule="evenodd" 
                    d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17.01 9H7V7H17.01V9ZM17.01 13H7V11H17.01V13ZM14.01 17H7V15H14.01V17Z" 
                    fill="#8AB4F8"
                />
            </svg>
        );
    }
    
    return (
        <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={cn("w-6 h-6", className)}
            {...props}
        >
            <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17.01 9H7V7H17.01V9ZM17.01 13H7V11H17.01V13ZM14.01 17H7V15H14.01V17Z" 
                fill="#4285F4"
            />
        </svg>
    );
};
