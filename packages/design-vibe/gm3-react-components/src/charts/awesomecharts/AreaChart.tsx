import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext.tsx';

declare const Chart: any; // Chart.js is from CDN

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const hexToRgba = (hex: string, alpha: number): string => {
    if (typeof hex !== 'string' || !hex.startsWith('#')) return hex;
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    } else { return hex; }
    if (isNaN(r) || isNaN(g) || isNaN(b)) { return hex; }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// --- Custom Tooltip from ChartBar.tsx ---
const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = 'var(--color-surface)';
    tooltipEl.style.borderRadius = '0px';
    tooltipEl.style.padding = '12px';
    tooltipEl.style.border = '1px solid var(--color-outline-variant)';
    tooltipEl.style.color = 'var(--color-on-surface)';
    tooltipEl.style.opacity = '0.9';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';
    tooltipEl.style.fontFamily = "'Roboto', sans-serif";
    tooltipEl.style.minWidth = '220px';

    const table = document.createElement('table');
    table.style.margin = '0px';
    table.style.width = '100%';

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = (context: any) => {
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = '0';
    return;
  }

  const reversedDataPoints = [...(tooltip.dataPoints || [])].reverse();
  const reversedLabelColors = [...(tooltip.labelColors || [])].reverse();

  const titleLines = tooltip.title || [];
  
  const tableHead = document.createElement('thead');

  titleLines.forEach((title: string) => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = 'none';

    const th = document.createElement('th');
    th.colSpan = 2;
    th.style.borderWidth = '0';
    th.style.textAlign = 'left';
    th.style.fontWeight = '500';
    th.style.fontSize = '14px';
    th.style.padding = '0 0 8px 0';
    const text = document.createTextNode(title);

    th.appendChild(text);
    tr.appendChild(th);
    tableHead.appendChild(tr);
  });

  const tableBody = document.createElement('tbody');
  reversedDataPoints.forEach((dataPoint: any, i: number) => {
    const colors = reversedLabelColors[i];
    const seriesLabel = dataPoint.dataset.label;
    
    // Modified formatting for non-currency data
    const rawData = dataPoint.raw;
    let formattedValue;
    if (typeof rawData === 'number' || !isNaN(parseFloat(rawData))) {
      formattedValue = parseFloat(rawData).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    } else {
      formattedValue = dataPoint.formattedValue;
    }

    const tr = document.createElement('tr');
    tr.style.backgroundColor = 'inherit';
    tr.style.borderWidth = '0';

    const td1 = document.createElement('td');
    td1.style.borderWidth = '0';
    td1.style.padding = '3px 0';
    td1.style.display = 'flex';
    td1.style.alignItems = 'center';
    td1.style.fontSize = '12px';
    td1.style.color = 'var(--color-on-surface-variant)';

    const pointStyle = dataPoint.dataset.pointStyle;
    if (pointStyle && pointStyle.tagName === 'IMG') {
        const img = pointStyle.cloneNode() as HTMLImageElement;
        img.style.marginRight = '8px';
        img.style.verticalAlign = 'middle';
        td1.appendChild(img);
    } else {
        const span = document.createElement('span');
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.borderWidth = '0px';
        span.style.marginRight = '8px';
        span.style.height = '10px';
        span.style.width = '10px';
        span.style.borderRadius = '50%';
        span.style.display = 'inline-block';
        td1.appendChild(span);
    }
    
    td1.appendChild(document.createTextNode(seriesLabel));
    
    const td2 = document.createElement('td');
    td2.style.borderWidth = '0';
    td2.style.padding = '3px 0';
    td2.style.textAlign = 'right';
    td2.style.fontWeight = '500';
    td2.style.fontSize = '12px';
    td2.style.paddingLeft = '24px';
    td2.appendChild(document.createTextNode(formattedValue));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tableBody.appendChild(tr);
  });

  const tableRoot = tooltipEl.querySelector('table');
  while (tableRoot.firstChild) {
    tableRoot.firstChild.remove();
  }
  tableRoot.appendChild(tableHead);
  tableRoot.appendChild(tableBody);

  // --- POSITIONING: This part handles the interaction and placement ---
  const { offsetLeft: canvasLeft, offsetTop: canvasTop } = chart.canvas;
  const tooltipWidth = tooltipEl.offsetWidth;
  const tooltipHeight = tooltipEl.offsetHeight;
  const { caretX, caretY } = tooltip;
  
  const CURSOR_GAP = 15;

  let top = canvasTop + caretY + CURSOR_GAP;
  let left = canvasLeft + caretX + CURSOR_GAP;

  const canvasRect = chart.canvas.getBoundingClientRect();
  
  // Check right boundary collision
  if ((canvasRect.left + caretX + CURSOR_GAP + tooltipWidth) > window.innerWidth) {
    left = canvasLeft + caretX - tooltipWidth - CURSOR_GAP;
  }

  // Check bottom boundary collision
  if ((canvasRect.top + caretY + CURSOR_GAP + tooltipHeight) > window.innerHeight) {
    top = canvasTop + caretY - tooltipHeight - CURSOR_GAP;
  }
  
  tooltipEl.style.opacity = '0.9';
  tooltipEl.style.left = `${left}px`;
  tooltipEl.style.top = `${top}px`;
  tooltipEl.style.transform = ''; // Clear any previous transforms
};


export interface AreaChartNewProps {
  data: any;
  options?: any;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ChartAreaNew: React.FC<AreaChartNewProps> = ({ data, options, title, subtitle, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<any>(null);
    const { palette } = useTheme();

    useEffect(() => {
        if (!canvasRef.current) return;
        if (chartRef.current) chartRef.current.destroy();

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        
        const currentTheme = palette;
        const textColor = currentTheme['--color-on-surface-variant'];
        const gridColor = currentTheme['--color-outline-variant'];
        
        const processedData = {
            ...data,
            datasets: data.datasets.map((dataset: any) => ({
                ...dataset,
                originalBorderColor: dataset.borderColor,
            }))
        };

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            onHover: (event: any, elements: any, chart: any) => {
                chart.canvas.style.cursor = elements.length ? 'pointer' : 'default';
            },
            onClick: (e: any, elements: any, chart: any) => {
                if (elements.length === 0) return;
                
                const element = elements[0];
                const index = element.datasetIndex;

                const metas = chart.data.datasets.map((_: any, i: number) => chart.getDatasetMeta(i));

                let visibleCount = 0;
                metas.forEach((meta: any) => {
                    if (!meta.hidden) {
                        visibleCount++;
                    }
                });

                const isOnlyOneVisible = visibleCount === 1 && !metas[index].hidden;

                if (isOnlyOneVisible) {
                    metas.forEach((meta: any) => {
                        meta.hidden = false;
                    });
                } else {
                    metas.forEach((meta: any, i: number) => {
                        meta.hidden = i !== index;
                    });
                }
                chart.update();
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    align: 'start',
                    reverse: true,
                    onHover: (event: any, legendItem: any, legend: any) => {
                        legend.chart.canvas.style.cursor = 'pointer';
                    },
                    onLeave: (event: any, legendItem: any, legend: any) => {
                        legend.chart.canvas.style.cursor = 'default';
                    },
                    onClick: (e: any, legendItem: any, legend: any) => {
                        const chart = legend.chart;
                        const index = legendItem.datasetIndex;
                        const metas = chart.data.datasets.map((_: any, i: number) => chart.getDatasetMeta(i));

                        let visibleCount = 0;
                        metas.forEach((meta: any) => {
                            if (!meta.hidden) {
                                visibleCount++;
                            }
                        });

                        const isOnlyOneVisible = visibleCount === 1 && !metas[index].hidden;

                        if (isOnlyOneVisible) {
                            metas.forEach((meta: any) => {
                                meta.hidden = false;
                            });
                        } else {
                            metas.forEach((meta: any, i: number) => {
                                meta.hidden = i !== index;
                            });
                        }
                        chart.update();
                    },
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 16,
                        boxHeight: 16,
                        padding: 20,
                        boxPadding: 4,
                        generateLabels: (chart: any) => {
                            const defaultLabels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            const legendTextColor = chart.options.plugins.legend.labels.color;

                            return defaultLabels.map((label: any) => {
                                const meta = chart.getDatasetMeta(label.datasetIndex);
                                if (meta.hidden) {
                                    const newLabel = { ...label };
                                    newLabel.hidden = false; // Prevents strikethrough

                                    const dataset = chart.data.datasets[label.datasetIndex];
                                    const originalColor = dataset.originalBorderColor || dataset.borderColor;
                                    
                                    if (newLabel.pointStyle && newLabel.pointStyle instanceof HTMLImageElement && newLabel.pointStyle.src.startsWith('data:image/svg+xml;base64,')) {
                                        try {
                                            const base64 = newLabel.pointStyle.src.split(',')[1];
                                            const svgString = atob(base64);
                                            const newSvgString = svgString.replace('<path ', '<path opacity="0.5" ');
                                            const newImg = new Image();
                                            newImg.src = 'data:image/svg+xml;base64,' + btoa(newSvgString);
                                            newLabel.pointStyle = newImg;
                                        } catch (e) { console.error("Error modifying SVG for legend", e); }
                                    } else if (typeof originalColor === 'string') {
                                        newLabel.fillStyle = hexToRgba(originalColor, 0.5);
                                    }

                                    if (typeof legendTextColor === 'string') {
                                        (newLabel as any).fontColor = hexToRgba(legendTextColor, 0.5);
                                    }
                                    return newLabel;
                                }
                                return label;
                            });
                        }
                    }
                },
                tooltip: {
                    enabled: false,
                    external: externalTooltipHandler,
                }
            },
            scales: {
                x: {
                    position: 'top',
                    grid: {
                        display: true,
                        drawOnChartArea: false,
                        color: gridColor,
                    },
                    ticks: {
                        color: textColor,
                        mirror: true
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    grid: {
                        color: gridColor,
                    },
                    ticks: {
                        color: textColor,
                    },
                }
            },
            elements: {
                point: {
                    radius: 0,
                    hoverRadius: 5,
                }
            },
        };
        
        const mergedOptions = { ...defaultOptions, ...options };

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: processedData,
            options: mergedOptions,
        });
        
        const chart = chartRef.current;
        if (chart) {
            chart.options.scales.x.ticks.color = textColor;
            chart.options.scales.x.grid.color = gridColor;
            chart.options.scales.y.ticks.color = textColor;
            chart.options.scales.y.grid.color = gridColor;
            if (chart.options.plugins?.legend?.labels) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            chart.update('none');
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data, options, palette]);

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {(title || subtitle) && (
                <div className="px-6 py-4">
                    {title && <h3 className="title-medium text-on-surface">{title}</h3>}
                    {subtitle && <p className="body-medium text-on-surface-variant">{subtitle}</p>}
                </div>
            )}
            <div className="flex-1 min-h-0 relative">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};
ChartAreaNew.displayName = 'ChartAreaNew';