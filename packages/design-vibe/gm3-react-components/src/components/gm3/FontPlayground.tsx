import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card } from './Card';
import { Slider } from './Slider';
import { Icon } from '../Icons';
import { Tooltip } from './Tooltip';
import { ToggleButton } from './ToggleButton';
import { TextField } from './TextField';
import { IconButton } from './IconButton';
import { ExposedDropdownMenu } from './ExposedDropdownMenu';
import { MenuItem } from './Menu';
import { Button } from './Button';
import { Divider } from './Divider';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- Types ---
interface FontAxis {
  tag: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

type FontName = 'Google Sans' | 'Google Sans Text' | 'Google Sans Flex' | 'Google Sans Code' | 'Roboto' | 'Roboto Flex';

interface FontDefinition {
    name: FontName;
    family: string;
    isVariable: boolean;
    axes?: FontAxis[];
}

type FontSettings = {
  [key:string]: number;
};

// --- Constants ---
const FONT_DEFINITIONS: FontDefinition[] = [
    { name: 'Google Sans', family: "'Google Sans', sans-serif", isVariable: false },
    { name: 'Google Sans Text', family: "'Google Sans Text', sans-serif", isVariable: false },
    { name: 'Google Sans Code', family: "'Google Sans Mono', monospace", isVariable: false },
    { name: 'Roboto', family: "'Roboto', sans-serif", isVariable: false },
    { name: 'Google Sans Flex', family: "'Google Sans Flex', sans-serif", isVariable: true, axes: [
        { tag: 'wght', label: 'Weight', min: 100, max: 1000, step: 1, defaultValue: 400 },
        { tag: 'wdth', label: 'Width', min: 25, max: 151, step: 1, defaultValue: 100 },
        { tag: 'slnt', label: 'Slant', min: -10, max: 0, step: 1, defaultValue: 0 },
        { tag: 'GRAD', label: 'Grade', min: 0, max: 100, step: 1, defaultValue: 0 },
        { tag: 'ROND', label: 'Roundness', min: 0, max: 100, step: 1, defaultValue: 0 },
    ]},
    { name: 'Roboto Flex', family: "'Roboto Flex', sans-serif", isVariable: true, axes: [
        { tag: 'wght', label: 'Weight', min: 100, max: 1000, step: 1, defaultValue: 400 },
        { tag: 'wdth', label: 'Width', min: 25, max: 151, step: 1, defaultValue: 100 },
        { tag: 'slnt', label: 'Slant', min: -10, max: 0, step: 1, defaultValue: 0 },
        { tag: 'GRAD', label: 'Grade', min: 0, max: 100, step: 1, defaultValue: 0 },
    ]}
];


// --- Main Component ---
export const FontPlayground: React.FC = () => {
    const [selectedFont, setSelectedFont] = useState<FontName>('Google Sans Flex');
    const [fontSize, setFontSize] = useState(24);
    const [letterSpacing, setLetterSpacing] = useState(0);
    const [lineHeight, setLineHeight] = useState(1.5);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    
    const currentFont = useMemo(() => {
        return FONT_DEFINITIONS.find(font => font.name === selectedFont)!;
    }, [selectedFont]);

    const initialSettings = useMemo(() => {
        if (!currentFont.isVariable || !currentFont.axes) return {};
        return currentFont.axes.reduce((acc, axis) => {
            acc[axis.tag] = axis.defaultValue;
            return acc;
        }, {} as FontSettings);
    }, [currentFont]);
    
    const [fontSettings, setFontSettings] = useState<FontSettings>(initialSettings);
    
    // Reset state when font changes
    useEffect(() => {
        setFontSettings(initialSettings);
        setFontSize(currentFont.isVariable ? initialSettings['opsz'] ?? 24 : 24);
        setLetterSpacing(0);
        setLineHeight(1.5);
        setIsBold(false);
        setIsItalic(false);
    }, [currentFont, initialSettings]);

    const handleSettingChange = useCallback((axisTag: string, value: number) => {
        setFontSettings(prevSettings => ({
            ...prevSettings,
            [axisTag]: value,
        }));
    }, []);

    const handleReset = useCallback(() => {
        setFontSettings(initialSettings);
        setFontSize(currentFont.isVariable ? initialSettings['opsz'] ?? 24 : 24);
        setLetterSpacing(0);
        setLineHeight(1.5);
        setIsBold(false);
        setIsItalic(false);
    }, [initialSettings, currentFont]);
    
    const [copied, setCopied] = useState(false);

    const cssStyle: React.CSSProperties = useMemo(() => {
        const style: React.CSSProperties = {
            fontFamily: currentFont.family,
            fontSize: `${fontSize}px`,
            letterSpacing: `${letterSpacing}em`,
            lineHeight: lineHeight,
        };

        if (currentFont.isVariable) {
            const settingsWithoutOpsz = { ...fontSettings };
            delete settingsWithoutOpsz['opsz'];
            style.fontVariationSettings = Object.entries(settingsWithoutOpsz)
                .map(([tag, value]) => `'${tag}' ${value}`)
                .join(', ');
        } else {
            style.fontWeight = isBold ? 'bold' : 'normal';
            style.fontStyle = isItalic ? 'italic' : 'normal';
        }

        return style;
    }, [currentFont, fontSettings, fontSize, letterSpacing, lineHeight, isBold, isItalic]);

    const cssCode = useMemo(() => {
        let css = `font-family: ${currentFont.family};
font-size: ${fontSize}px;
letter-spacing: ${letterSpacing.toFixed(2)}em;
line-height: ${lineHeight.toFixed(2)};`;

        if (currentFont.isVariable) {
            const settingsWithoutOpsz = { ...fontSettings };
            delete settingsWithoutOpsz['opsz'];
            const roundedFontSettings = Object.entries(settingsWithoutOpsz)
                .map(([tag, value]) => `'${tag}' ${Math.round(value)}`)
                .join(', ');
            css += `
font-variation-settings: "${roundedFontSettings}";`;
        } else {
            css += `
font-weight: ${isBold ? 'bold' : 'normal'};
font-style: ${isItalic ? 'italic' : 'normal'};`;
        }
        return css;
    }, [currentFont, fontSettings, fontSize, letterSpacing, lineHeight, isBold, isItalic]);
    
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(cssCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [cssCode]);

    const weightAxis = useMemo(() => 
        currentFont.isVariable ? currentFont.axes?.find(a => a.tag === 'wght') : undefined,
    [currentFont]);

    const otherAxes = useMemo(() =>
        currentFont.isVariable ? (currentFont.axes?.filter(a => a.tag !== 'wght') ?? []) : [],
    [currentFont]);

    const orderedAxes = useMemo(() => {
        const order = ['wdth', 'GRAD', 'slnt', 'ROND'];
        return otherAxes.sort((a, b) => {
            const indexA = order.indexOf(a.tag);
            const indexB = order.indexOf(b.tag);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }, [otherAxes]);


    return (
        <Card variant="outlined" className="p-0 w-full" responsiveLayoutThreshold={800}>
            {({ isVertical }) => (
                <div className={cn("flex", isVertical ? "flex-col" : "flex-row")}>
                    {/* --- Controls Section --- */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <ExposedDropdownMenu
                                variant="filled-minimal"
                                value={selectedFont}
                                onValueChange={(v) => setSelectedFont(v as FontName)}
                                label="Font Family"
                                className="w-full !max-w-[240px]"
                                containerClassName="!bg-surface-container-highest"
                            >
                                {FONT_DEFINITIONS.map(font => (
                                    <MenuItem key={font.name} headline={font.name} />
                                ))}
                            </ExposedDropdownMenu>
                            <Button variant="text" onClick={handleReset}>Reset</Button>
                        </div>

                        {/* --- Regular Values --- */}
                        {!currentFont.isVariable && (
                            <div className="flex gap-2">
                                <ToggleButton checked={isBold} onCheckedChange={setIsBold} icon={<Icon>format_bold</Icon>}>Bold</ToggleButton>
                                <ToggleButton checked={isItalic} onCheckedChange={setIsItalic} icon={<Icon>format_italic</Icon>}>Italic</ToggleButton>
                            </div>
                        )}
                        
                        <div>
                            <label className="body-medium text-on-surface-variant">Font size</label>
                            <Slider withInput value={fontSize} onValueChange={setFontSize} valueRange={[8, 144]} steps={(144 - 8)} hideValueLabel hideTicks />
                        </div>

                        {weightAxis && (
                            <div>
                                <label className="body-medium text-on-surface-variant">{weightAxis.label}</label>
                                <Slider
                                    withInput
                                    value={fontSettings[weightAxis.tag] || weightAxis.defaultValue}
                                    onValueChange={(v) => handleSettingChange(weightAxis.tag, v)}
                                    valueRange={[weightAxis.min, weightAxis.max]}
                                    steps={(weightAxis.max - weightAxis.min) / weightAxis.step}
                                    hideValueLabel
                                    hideTicks
                                />
                            </div>
                        )}
                        
                        <div>
                            <label className="body-medium text-on-surface-variant">Line height</label>
                            <Slider withInput value={lineHeight} onValueChange={setLineHeight} valueRange={[1, 2.5]} steps={(2.5 - 1) / 0.01} hideValueLabel hideTicks inputPrecision={2} />
                        </div>
                        
                        <div>
                            <label className="body-medium text-on-surface-variant">Letter spacing</label>
                            <Slider withInput value={letterSpacing} onValueChange={setLetterSpacing} valueRange={[-0.1, 0.2]} steps={(0.2 - (-0.1)) / 0.01} hideValueLabel hideTicks inputPrecision={2} />
                        </div>
                        
                        {/* --- Flex Variables --- */}
                        {orderedAxes.length > 0 && <Divider className="my-2" />}

                        {orderedAxes.map(axis => (
                            <div key={axis.tag}>
                                <label className="body-medium text-on-surface-variant">{axis.label}</label>
                                <Slider
                                    withInput
                                    value={fontSettings[axis.tag] || axis.defaultValue}
                                    onValueChange={(v) => handleSettingChange(axis.tag, v)}
                                    valueRange={[axis.min, axis.max]}
                                    steps={(axis.max - axis.min) / axis.step}
                                    hideValueLabel
                                    hideTicks
                                />
                            </div>
                        ))}
                    </div>

                    <div className={cn("bg-outline-variant", isVertical ? "h-px w-auto my-0" : "h-auto w-px mx-0 my-4")} />

                    {/* --- Preview & Code Section --- */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                        <div className="flex-grow flex items-center justify-center bg-surface-container rounded-lg p-4 min-h-[200px]">
                            <p className="text-center text-4xl" style={cssStyle}>The quick brown fox jumps over the lazy dog.</p>
                        </div>
                        <div className="mt-6">
                            <h3 className="title-medium text-on-surface mb-2">CSS output</h3>
                             <TextField
                                variant="filled-minimal"
                                value={cssCode}
                                onChange={() => {}}
                                readOnly
                                multiline
                                noLabel
                                label="CSS output"
                                className="w-full !max-w-none"
                                inputClassName="!font-google-code"
                                trailingIcon={
                                    <Tooltip content={copied ? 'Copied!' : 'Copy CSS'}>
                                        <IconButton size="xsmall" onClick={handleCopy} aria-label="Copy CSS">
                                            <Icon>{copied ? 'check' : 'content_copy'}</Icon>
                                        </IconButton>
                                    </Tooltip>
                                }
                            />
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};