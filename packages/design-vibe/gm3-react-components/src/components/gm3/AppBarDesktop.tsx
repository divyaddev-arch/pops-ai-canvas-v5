import React from 'react';
import { Icon } from '../Icons';
import { IconButton } from './IconButton';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface AppBarDesktopProps extends React.HTMLAttributes<HTMLElement> {
    logo?: React.ReactNode;
    title?: string;
    searchPlaceholder?: string;
    avatar?: React.ReactNode;
    navigationIcon?: React.ReactNode;
}

export const AppBarDesktop = React.forwardRef<HTMLElement, AppBarDesktopProps>(({
    logo,
    title,
    searchPlaceholder = "Search",
    avatar,
    navigationIcon,
    className,
    ...props
}, ref) => {
    const outlineIconStyle = { fontVariationSettings: "'FILL' 0" };

    return (
        <header
            ref={ref}
            className={cn(
                'sticky top-0 z-10 h-[64px] w-full bg-surface-container-low flex items-center px-4 text-on-surface',
                className
            )}
            {...props}
        >
            {/* Left Section */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {navigationIcon || (
                    <IconButton aria-label="Main menu">
                        <Icon className="text-on-surface-variant" style={outlineIconStyle}>menu</Icon>
                    </IconButton>
                )}
                <div className="flex items-center gap-2">
                    {logo}
                    {title && <span className="text-2xl text-[#444746] font-normal">{title}</span>}
                </div>
            </div>

            {/* Center Search Section */}
            <div className="flex-1 flex justify-center min-w-[200px] ml-[83px] mr-4">
                <div className="w-full max-w-[720px]">
                     <div className="relative h-12 w-full bg-surface-container-high rounded-3xl flex items-center group focus-within:bg-surface transition-all duration-200">
                        <div className="pl-2 pr-2">
                            <IconButton variant="standard" aria-label="Search" className="!text-on-surface-variant">
                                <Icon style={outlineIconStyle}>search</Icon>
                            </IconButton>
                        </div>
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="flex-1 h-full bg-transparent outline-none body-large text-on-surface placeholder:text-on-surface-variant"
                        />
                        <div className="pr-2 pl-2">
                            <IconButton variant="standard" aria-label="Search options" className="!text-on-surface-variant">
                                <Icon style={outlineIconStyle}>tune</Icon>
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-2">
                <IconButton aria-label="Support">
                    <Icon className="text-on-surface-variant" style={outlineIconStyle}>help_outline</Icon>
                </IconButton>
                <IconButton aria-label="Settings">
                    <Icon className="text-on-surface-variant" style={outlineIconStyle}>settings</Icon>
                </IconButton>
                <IconButton aria-label="Google apps">
                    <Icon className="text-on-surface-variant" style={outlineIconStyle}>apps</Icon>
                </IconButton>
                <div className="ml-2">
                    {avatar}
                </div>
            </div>
        </header>
    );
});

AppBarDesktop.displayName = 'AppBarDesktop';
