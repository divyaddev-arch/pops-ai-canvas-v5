import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext.tsx';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- TYPES ---
export interface WaterfallChartDataItem {
    label: string;
    value: number;
    type: "start" | "change" | "subtotal" | "total";
}

export interface WaterfallChartProps {
  data: WaterfallChartDataItem[];
  className?: string;
  colors: string[];
}

// --- HOOKS ---
const useResizeObserver = (ref: React.RefObject<HTMLElement>) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    useEffect(() => {
        const observeTarget = ref.current;
        if (!observeTarget) return;

        const resizeObserver = new ResizeObserver(entries => {
            if (!Array.isArray(entries) || !entries.length) return;
            const entry = entries[0];
            setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
        });

        resizeObserver.observe(observeTarget);
        return () => resizeObserver.unobserve(observeTarget);
    }, [ref]);
    return dimensions;
};


// --- TOOLTIP COMPONENT ---
const Tooltip = ({ activeItem, position }: { activeItem: any | null, position: { x: number, y: number }}) => {
    if (!activeItem) return null;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div 
            className="absolute p-3 bg-surface rounded-sm border border-outline-variant shadow-lg pointer-events-none transition-opacity duration-100"
            style={{ 
                left: position.x, 
                top: position.y,
                transform: 'translate(-50%, -110%)',
            }}
        >
            <p className="body-small text-on-surface-variant whitespace-nowrap">{activeItem.label}</p>
            <p className="body-medium text-on-surface whitespace-nowrap">Current Value: {formatCurrency(activeItem.endValue)}</p>
            {activeItem.type === 'change' && (
                <p className={cn(
                    "body-medium whitespace-nowrap",
                    activeItem.value >= 0 ? 'text-error' : 'text-primary'
                )}>
                    Change: {formatCurrency(activeItem.value)}
                </p>
            )}
        </div>
    );
};

// --- HELPERS ---
const splitLabelIntoLines = (label: string): string[] => {
    const words = label.split(' ');
    const numWords = words.length;

    if (numWords <= 1) {
        return [label];
    }
    
    if (numWords === 2) {
        return [words[0], words[1]];
    }

    if (numWords >= 5) {
        const part = Math.floor(numWords / 4);
        if (part === 0) return [label];
        const line1 = words.slice(0, part).join(' ');
        const line2 = words.slice(part, 2 * part).join(' ');
        const line3 = words.slice(2 * part, 3 * part).join(' ');
        const line4 = words.slice(3 * part).join(' ');
        return [line1, line2, line3, line4].filter(Boolean);
    }
    
    if (numWords > 2) {
        const midPoint = Math.ceil(numWords / 2);
        return [
            words.slice(0, midPoint).join(' '),
            words.slice(midPoint).join(' ')
        ];
    }

    return [label];
};


// --- MAIN COMPONENT ---
export const WaterfallChart = React.forwardRef<HTMLDivElement, WaterfallChartProps>(({ data, className, colors }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { width, height } = useResizeObserver(containerRef);
    const { palette } = useTheme();
    const [activeItem, setActiveItem] = useState<any | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [animateIn, setAnimateIn] = useState(false);
    const [animateLines, setAnimateLines] = useState(false);

    useEffect(() => {
        setAnimateLines(false);
        setAnimateIn(false);
        const lineTimer = setTimeout(() => {
            setAnimateLines(true);
        }, 50);
        const barTimer = setTimeout(() => {
            setAnimateIn(true);
        }, 250); 
        return () => {
            clearTimeout(lineTimer);
            clearTimeout(barTimer);
        };
    }, [data]);

    const { items, minY, maxY, yTicks } = useMemo(() => {
        let runningTotal = 0;
        const processedItems = data.map(item => {
            const startValue = runningTotal;
            let endValue;

            if (item.type === 'start' || item.type === 'subtotal' || item.type === 'total') {
                runningTotal = item.value;
                endValue = item.value;
            } else { // change
                runningTotal += item.value;
                endValue = runningTotal;
            }
            return { ...item, startValue, endValue };
        });

        const allValues = processedItems.flatMap(d => [d.startValue, d.endValue]);
        const dataMinY = Math.min(...allValues, 0);
        const dataMaxY = Math.max(...allValues, 0);

        let niceMinY = 0;
        let niceMaxY = 4;
        let step = 1;

        const range = dataMaxY - dataMinY;

        if (range > 0) {
            const tickCount = 5;
            const rawStep = range / tickCount;
            const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
            const rescaledStep = rawStep / magnitude;

            if (rescaledStep > 5) step = 10 * magnitude;
            else if (rescaledStep > 2) step = 5 * magnitude;
            else if (rescaledStep > 1) step = 2 * magnitude;
            else step = magnitude;

            niceMinY = Math.floor(dataMinY / step) * step;
            niceMaxY = Math.ceil(dataMaxY / step) * step;
        }

        const ticks: number[] = [];
        if (step > 0) {
            for (let y = niceMinY; y <= niceMaxY; y += step) {
                ticks.push(y);
            }
        }
        
        return {
            items: processedItems,
            minY: niceMinY,
            maxY: niceMaxY,
            yTicks: ticks,
        };
    }, [data]);
    
    const { chartHeight, chartWidth, margins, yScale, bandWidth, stepWidth } = useMemo(() => {
        const longestYTickLabel = yTicks.reduce((longest, tick) => {
            const label = tick.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
            return label.length > longest.length ? label : longest;
        }, '');

        const charWidth = 7;
        const newLeftMargin = Math.max(20, longestYTickLabel.length * charWidth + 20);

        const margins = { top: 40, right: 20, bottom: 80, left: newLeftMargin };
        const chartWidth = Math.max(0, width - margins.left - margins.right);
        const chartHeight = Math.max(0, height - margins.top - margins.bottom);

        const domain = maxY - minY;
        const yScaleFunc = (value: number) => {
            if (domain === 0) return chartHeight;
            return chartHeight - ((value - minY) / domain) * chartHeight;
        };

        const stepWidth = data.length > 0 ? chartWidth / data.length : 0;
        const bandWidth = Math.max(20, Math.min(95, stepWidth * 0.6));
        
        return { chartHeight, chartWidth, margins, yScale: yScaleFunc, bandWidth, stepWidth };
    }, [width, height, minY, maxY, data, yTicks]);
    
    const showVerticalGridLines = false; 

    const handleMouseOver = useCallback((item: any, event: React.MouseEvent) => {
        const barRect = (event.target as SVGElement).getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();
        setActiveItem(item);
        setTooltipPosition({
            x: barRect.left - containerRect.left + barRect.width / 2,
            y: barRect.top - containerRect.top
        });
    }, []);
    
    const handleMouseOut = useCallback(() => {
        setActiveItem(null);
    }, []);

    return (
        <div ref={containerRef} className={cn("relative w-full h-full", className)}>
            <svg width="100%" height="100%">
                <g transform={`translate(${margins.left}, ${margins.top})`}>
                    
                    {showVerticalGridLines && items.map((item, index) => {
                        const x = stepWidth * index + stepWidth / 2;
                        return (
                            <line
                                key={`vline-${index}`}
                                x1={x}
                                y1={0}
                                x2={x}
                                y2={chartHeight}
                                stroke={palette['--color-outline-variant']}
                                strokeWidth={1}
                            />
                        );
                    })}

                    {yTicks.map((tick, i) => (
                        <g key={i}>
                            <line
                                x1={0}
                                x2={chartWidth}
                                y1={yScale(tick)}
                                y2={yScale(tick)}
                                stroke={palette['--color-outline-variant']}
                                strokeWidth={1}
                            />
                            <text
                                x={-10}
                                y={yScale(tick) + 3}
                                textAnchor="end"
                                fill={palette['--color-on-surface-variant']}
                                style={{ fontSize: '12px' }}
                            >
                                {tick.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </text>
                        </g>
                    ))}

                     <line
                        x1={0}
                        y1={yScale(0)}
                        x2={chartWidth}
                        y2={yScale(0)}
                        stroke={palette['--color-outline-variant']}
                        strokeWidth={1}
                    />


                    {/* Connector Lines */}
                    {items.map((item, index) => {
                        const prevItem = index > 0 ? items[index - 1] : null;
                        if (!prevItem) return null;

                        const x_prev_left = stepWidth * (index - 1) + (stepWidth - bandWidth) / 2;
                        const x_curr_right = stepWidth * index + (stepWidth - bandWidth) / 2 + bandWidth;
                        const y = yScale(prevItem.endValue);

                        return (
                            <line
                                key={`line-${index}`}
                                x1={x_prev_left}
                                y1={y}
                                x2={x_curr_right}
                                y2={y}
                                stroke={palette['--color-outline-variant']}
                                strokeDasharray="2 2"
                                strokeWidth={1}
                                className={cn(
                                    'transition-opacity duration-medium2 ease-standard-decelerate',
                                    animateLines ? 'opacity-100' : 'opacity-0'
                                )}
                            />
                        );
                    })}

                    {/* Bars and Labels */}
                    {items.map((item, index) => {
                        const x = stepWidth * index + (stepWidth - bandWidth) / 2;

                        let y, height, fill;
                        const zeroLine = yScale(0);

                        if (item.type === 'subtotal' || item.type === 'total') {
                            fill = colors[0]; // blue
                        } else if (item.value >= 0) { // start or positive change (charge)
                            fill = colors[1]; // red
                        } else { // negative change (reduction)
                            fill = colors[2]; // green
                        }

                        if (item.type === 'start' || item.type === 'subtotal' || item.type === 'total') {
                            const barTop = yScale(item.value);
                            y = Math.min(barTop, zeroLine);
                            height = Math.abs(barTop - zeroLine);
                        } else { // 'change'
                            y = yScale(Math.max(item.startValue, item.endValue));
                            height = Math.abs(yScale(item.startValue) - yScale(item.endValue));
                        }
                        
                        const labelX = x + bandWidth / 2;
                        const labelY = chartHeight + 25;
                        const labelLines = splitLabelIntoLines(item.label);

                        let transformOrigin: string;
                        if (item.type === 'change') {
                            transformOrigin = item.value >= 0 ? 'bottom' : 'top';
                        } else {
                            transformOrigin = 'bottom';
                        }

                        return (
                            <g key={item.label + index}>
                                <rect
                                    x={x}
                                    y={y}
                                    width={bandWidth}
                                    height={height}
                                    fill={fill}
                                    onMouseOver={(e) => handleMouseOver(item, e)}
                                    onMouseOut={handleMouseOut}
                                    className={cn(
                                        'transition-transform duration-extra-long1 ease-emphasized-decelerate',
                                        animateIn ? 'scale-y-100' : 'scale-y-0'
                                    )}
                                    style={{
                                        transformOrigin: transformOrigin
                                    }}
                                />
                                
                                <text
                                    x={x + bandWidth / 2}
                                    y={y - 8}
                                    textAnchor="middle"
                                    fill={palette['--color-on-surface-variant']}
                                    style={{ fontSize: '12px' }}
                                >
                                    {item.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </text>
                                
                                <text
                                    x={labelX}
                                    y={labelY}
                                    textAnchor="middle"
                                    fill={palette['--color-on-surface-variant']}
                                    style={{ fontSize: '12px' }}
                                >
                                    {labelLines.map((line, i) => (
                                        <tspan key={i} x={labelX} dy={i === 0 ? 0 : '1.2em'}>{line}</tspan>
                                    ))}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
            <Tooltip activeItem={activeItem} position={tooltipPosition} />
        </div>
    );
});
WaterfallChart.displayName = 'WaterfallChart';