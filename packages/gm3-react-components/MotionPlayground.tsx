import React, { useState, useMemo, useCallback } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { duration, easing } from '../gm3-styles';
import { TextField } from './TextField';
import { Tooltip } from './Tooltip';
import { Icon } from './Icons';
import { IconButton } from './IconButton';
import { ExposedDropdownMenu } from './ExposedDropdownMenu';
import { MenuItem } from './Menu';
import { Slider } from './Slider';
import { ButtonGroup } from './ButtonGroup';
import { ToggleButton } from './ToggleButton';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');
const toKebabCase = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

type AnimationProperty = 'position' | 'opacity' | 'size' | 'color';

const easingOrder: (keyof typeof easing)[] = [
    'standard', 'standardAccelerate', 'standardDecelerate',
    'emphasized', 'emphasizedAccelerate', 'emphasizedDecelerate',
    'standardSpringDecelerate', 'standardSpringAccelerate', 'emphasizedSpringDecelerate', 'emphasizedSpringAccelerate'
];

export const MotionPlayground = () => {
    const [toggled, setToggled] = useState(false);
    const [currentEasing, setCurrentEasing] = useState<keyof typeof easing>('standard');
    const [currentProperty, setCurrentProperty] = useState<AnimationProperty>('position');
    const [currentDuration, setCurrentDuration] = useState<keyof typeof duration>('long1');
    const [durationMs, setDurationMs] = useState(duration[currentDuration]);
    const [copied, setCopied] = useState(false);
    
    const durationValues = useMemo(() => Object.values(duration), []);

    const durationClass = `duration-${toKebabCase(currentDuration)}`;
    const easingClass = `ease-${toKebabCase(currentEasing)}`;
    
    const previewContainerClasses = cn(
        'w-full relative h-24',
        currentProperty !== 'position' && 'flex items-center justify-center'
    );
    
    const animatedElementClasses = cn(
        'w-16 h-16 bg-primary rounded-lg',
        'transition-all',
        durationClass,
        easingClass,
        // position-specific styles
        currentProperty === 'position' && 'absolute top-1/2 -translate-y-1/2',
        currentProperty === 'position' && (toggled ? 'left-[calc(100%-4rem)]' : 'left-0'),
        // other property styles
        currentProperty === 'opacity' && (toggled ? 'opacity-20' : 'opacity-100'),
        currentProperty === 'size' && (toggled ? 'scale-[2.5]' : 'scale-50'),
        currentProperty === 'color' && (toggled ? 'bg-tertiary' : 'bg-primary')
    );

    const promptValues = useMemo(() => `property: ${currentProperty}
easing: ${toKebabCase(currentEasing)}
duration: ${toKebabCase(currentDuration)}`, [currentProperty, currentEasing, currentDuration]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(promptValues).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [promptValues]);
    
    const handleDurationDropdownChange = (value: string) => {
        const key = Object.keys(duration).find(k => toKebabCase(k) === value.split(' ')[0]) as keyof typeof duration;
        if (key) {
            setCurrentDuration(key);
            setDurationMs(duration[key]);
        }
    };

    const handleSliderChange = (ms: number) => {
        setDurationMs(ms);
        const durationKey = (Object.keys(duration) as Array<keyof typeof duration>).find(key => duration[key] === ms);
        if (durationKey && durationKey !== currentDuration) {
            setCurrentDuration(durationKey);
        }
    };
    
    return (
        <Card variant="outlined" className="p-0 w-full" responsiveLayoutThreshold={600}>
            {({ isVertical }) => (
                <main className={cn("flex", isVertical ? "flex-col" : "flex-row")}>
                    {/* --- Controls Section --- */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col">
                        <div className="space-y-6 flex-grow">
                            <ButtonGroup
                                variant="connected"
                                selectionMode="single"
                                value={currentProperty}
                                onValueChange={(v) => setCurrentProperty(v as AnimationProperty)}
                            >
                                <ToggleButton variant="tonal" value="position">Position</ToggleButton>
                                <ToggleButton variant="tonal" value="size">Size</ToggleButton>
                                <ToggleButton variant="tonal" value="opacity">Opacity</ToggleButton>
                                <ToggleButton variant="tonal" value="color">Color</ToggleButton>
                            </ButtonGroup>
                            <ExposedDropdownMenu
                                variant="filled-minimal"
                                value={toKebabCase(currentEasing)}
                                onValueChange={(kebabValue) => {
                                    const camelKey = Object.keys(easing).find(key => toKebabCase(key) === kebabValue);
                                    if (camelKey) setCurrentEasing(camelKey as keyof typeof easing);
                                }}
                                label="Easing"
                                className="w-full !max-w-none"
                                containerClassName="!bg-surface-container-highest"
                            >
                                {easingOrder.map(key => (
                                    <MenuItem key={key} headline={toKebabCase(key)} />
                                ))}
                            </ExposedDropdownMenu>
                            <div className="space-y-1">
                                <ExposedDropdownMenu
                                    variant="filled-minimal"
                                    value={`${toKebabCase(currentDuration)} (${duration[currentDuration]}ms)`}
                                    onValueChange={handleDurationDropdownChange}
                                    label="Duration"
                                    className="w-full !max-w-none"
                                    containerClassName="!bg-surface-container-highest"
                                >
                                    {Object.entries(duration).map(([key, value]) => (
                                        <MenuItem key={key} headline={`${toKebabCase(key)} (${value}ms)`} />
                                    ))}
                                </ExposedDropdownMenu>
                                <Slider
                                    size="xxsmall"
                                    value={durationMs}
                                    onValueChange={handleSliderChange}
                                    valueRange={[50, 1000]}
                                    steps={durationValues}
                                    hideValueLabel
                                />
                            </div>
                        </div>
                         <Button size="medium" variant="tonal" onClick={() => setToggled(p => !p)} className="w-full justify-center mt-8">
                            Animate {currentProperty}
                         </Button>
                    </div>

                    <div className={cn("bg-outline-variant", isVertical ? "h-px w-auto my-0" : "h-auto w-px mx-0 my-4")} />

                    {/* --- Preview & Code Section --- */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col">
                        <div className="flex-grow flex items-center justify-center min-h-[150px]">
                            <div className={previewContainerClasses}>
                                 <div className={animatedElementClasses} />
                            </div>
                        </div>
                         <div className="mt-8">
                            <h3 className="title-medium text-on-surface mb-2">Prompt values</h3>
                            <TextField
                                variant="filled-minimal"
                                value={promptValues}
                                onChange={() => {}}
                                readOnly
                                multiline
                                noLabel
                                label="Prompt values"
                                className="w-full !max-w-none"
                                trailingIcon={
                                    <Tooltip content={copied ? 'Copied!' : 'Copy prompt values'}>
                                        <IconButton size="xsmall" onClick={handleCopy} aria-label="Copy prompt values">
                                            <Icon>{copied ? 'check' : 'content_copy'}</Icon>
                                        </IconButton>
                                    </Tooltip>
                                }
                            />
                        </div>
                    </div>
                </main>
            )}
        </Card>
    );
};
