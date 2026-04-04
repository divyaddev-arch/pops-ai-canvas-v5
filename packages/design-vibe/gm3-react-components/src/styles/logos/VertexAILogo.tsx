
import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

/**
 * A custom SVG icon component for the 'Vertex AI' graphic.
 */
export const VertexAILogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" className={cn("w-6 h-6", className)} {...props}>
        <path fill="#616161" d="M20 13.9a.75.75 0 00-1-.16l-7 5.14v.22a.72.72 0 110 1.43.74.74 0 00.45-.15L19.86 15a.76.76 0 00.14-1.1z"></path>
        <path fill="#757575" d="M12 20.53a.72.72 0 110-1.43v-.22l-7-5.14A.75.75 0 004 15.17a.73.73 0 00.44.15z"></path>
        <path fill="#424242" d="M12 18.34a1.47 1.47 0 101.47 1.47A1.47 1.47 0 0012 18.34zm0 2.19a.72.72 0 010-1.44.72.72 0 010 1.44z"></path>
        <path fill="#757575" d="M6 6.11a.75.75 0 01-.75-.75V3.48a.75.75 0 011.5 0v1.88a.76.76 0 01-.75.75z"></path>
        <circle cx="5.98" cy="12" r=".76" fill="#757575"></circle>
        <circle cx="5.98" cy="9.79" r=".76" fill="#757575"></circle>
        <circle cx="5.98" cy="7.57" r=".76" fill="#757575"></circle>
        <path fill="#424242" d="M18 8.31a.76.76 0 01-.75-.76V5.67a.75.75 0 011.5 0v1.88a.75.75 0 01-.75.76z"></path>
        <circle cx="18.02" cy="12.01" r=".76" fill="#424242"></circle>
        <circle cx="18.02" cy="9.77" r=".76" fill="#424242"></circle>
        <circle cx="18.02" cy="3.48" r=".76" fill="#424242"></circle>
        <path fill="#616161" d="M12 15a.74.74 0 01-.75-.75v-1.9a.75.75 0 011.5 0v1.88A.74.74 0 0112 15z"></path>
        <circle cx="12" cy="16.45" r=".76" fill="#616161"></circle>
        <circle cx="12" cy="10.14" r=".76" fill="#616161"></circle>
        <circle cx="12" cy="7.92" r=".76" fill="#616161"></circle>
        <path fill="#424242" d="M15 10.54a.75.75 0 01-.75-.75V7.91a.75.75 0 011.5 0v1.88a.74.74 0 01-.75.75z"></path>
        <circle cx="15.01" cy="5.69" r=".76" fill="#424242"></circle>
        <circle cx="15.01" cy="14.19" r=".76" fill="#424242"></circle>
        <circle cx="15.01" cy="11.98" r=".76" fill="#424242"></circle>
        <circle cx="8.99" cy="14.19" r=".76" fill="#757575"></circle>
        <circle cx="8.99" cy="7.92" r=".76" fill="#757575"></circle>
        <circle cx="8.99" cy="5.69" r=".76" fill="#757575"></circle>
        <path fill="#757575" d="M9 12.73a.74.74 0 01-.76-.73v-1.9a.75.75 0 011.5 0v1.2a.75.75 0 01-.74.73z"></path>
    </svg>
);
