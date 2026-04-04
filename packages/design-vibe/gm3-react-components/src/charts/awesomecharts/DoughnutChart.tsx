import React, { useRef, useEffect, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext.tsx';
import { themes } from '../../styles/colors-themes-gm3.ts';

declare global {
    interface Window {
        Chart: any;
    }
}

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = 'var(--color-surface)';
    tooltipEl.style.borderRadius = '0px';
    tooltipEl.style.boxShadow = 'var(--shadow-elevation-2)';
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
  
  const dataPoint = tooltip.dataPoints[0];
  const label = dataPoint.label;
  const value = dataPoint.raw;
  const dataset = dataPoint.dataset;
  const colors = tooltip.labelColors[0];

  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : value;

  const tableHead = document.createElement('thead');
  const titleTr = document.createElement('tr');
  titleTr.style.borderBottom = 'none';
  const titleTh = document.createElement('th');
  titleTh.colSpan = 2;
  titleTh.style.borderWidth = '0';
  titleTh.style.textAlign = 'left';
  titleTh.style.fontWeight = '500';
  titleTh.style.fontSize = '14px';
  titleTh.style.padding = '0 0 8px 0';
  titleTh.appendChild(document.createTextNode(dataset.label || ''));
  titleTr.appendChild(titleTh);
  tableHead.appendChild(titleTr);

  const tableBody = document.createElement('tbody');
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
  
  const pointStyle = dataset.pointStyle?.[dataPoint.dataIndex];
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
  td1.appendChild(document.createTextNode(label));

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

  const tableRoot = tooltipEl.querySelector('table');
  while (tableRoot.firstChild) {
    tableRoot.firstChild.remove();
  }
  tableRoot.appendChild(tableHead);
  tableRoot.appendChild(tableBody);

  const { offsetLeft: canvasLeft, offsetTop: canvasTop } = chart.canvas;
  const tooltipWidth = tooltipEl.offsetWidth;
  const tooltipHeight = tooltipEl.offsetHeight;
  const { caretX, caretY } = tooltip;
  
  const CURSOR_GAP = 15;
  let top = canvasTop + caretY + CURSOR_GAP;
  let left = canvasLeft + caretX + CURSOR_GAP;
  const canvasRect = chart.canvas.getBoundingClientRect();
  
  if ((canvasRect.left + caretX + CURSOR_GAP + tooltipWidth) > window.innerWidth) {
    left = canvasLeft + caretX - tooltipWidth - CURSOR_GAP;
  }
  if ((canvasRect.top + caretY + CURSOR_GAP + tooltipHeight) > window.innerHeight) {
    top = canvasTop + caretY - tooltipHeight - CURSOR_GAP;
  }
  
  tooltipEl.style.opacity = '0.9';
  tooltipEl.style.left = `${left}px`;
  tooltipEl.style.top = `${top}px`;
  tooltipEl.style.transform = '';
};


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

export interface DoughnutChartProps {
  data: any;
  options?: any;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, options, title, subtitle, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<any>(null);
    const { themeKey, mode } = useTheme();

    useEffect(() => {
        if (!canvasRef.current || typeof window.Chart === 'undefined') return;
        if (chartRef.current) chartRef.current.destroy();

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        
        const currentTheme = themes[themeKey][mode];
        const textColor = currentTheme['--color-on-surface-variant'];

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'nearest',
                intersect: true,
            },
            onHover: (event: any, elements: any, chart: any) => {
                chart.canvas.style.cursor = elements.length ? 'pointer' : 'default';
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    align: 'start',
                    onHover: (event: any, legendItem: any, legend: any) => {
                        legend.chart.canvas.style.cursor = 'pointer';
                    },
                    onLeave: (event: any, legendItem: any, legend: any) => {
                        legend.chart.canvas.style.cursor = 'default';
                    },
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 16,
                        boxHeight: 16,
                        padding: 20,
                        boxPadding: 4,
                        generateLabels: (chart: any) => {
                            const original = window.Chart.overrides.doughnut.plugins.legend.labels.generateLabels;
                            const labels = original.call(this, chart);
                            const legendTextColor = chart.options.plugins.legend.labels.color;

                            labels.forEach((label: any, i: number) => {
                                const dataset = chart.data.datasets[0];
                                label.pointStyle = dataset.pointStyle[i];
                                
                                const meta = chart.getDatasetMeta(0);
                                if (meta.data[i] && meta.data[i].hidden) {
                                    if (label.pointStyle instanceof HTMLImageElement && label.pointStyle.src.startsWith('data:image/svg+xml;base64,')) {
                                        try {
                                            const base64 = label.pointStyle.src.split(',')[1];
                                            const svgString = atob(base64);
                                            const newSvgString = svgString.replace('<path ', '<path opacity="0.5" ');
                                            const newImg = new Image();
                                            newImg.src = 'data:image/svg+xml;base64,' + btoa(newSvgString);
                                            label.pointStyle = newImg;
                                        } catch (e) { console.error("Error modifying SVG for legend", e); }
                                    }
                                    if (typeof legendTextColor === 'string') {
                                        label.fontColor = hexToRgba(legendTextColor, 0.5);
                                    }
                                }
                            });

                            return labels;
                        }
                    }
                },
                tooltip: {
                    enabled: false,
                    external: externalTooltipHandler,
                }
            },
            cutout: '60%',
        };
        
        const mergedOptions = { ...defaultOptions, ...options };

        chartRef.current = new window.Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: mergedOptions,
            plugins: []
        });
        
        const chart = chartRef.current;
        if (chart) {
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
    }, [data, options, mode, themeKey]);

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {(title || subtitle) && (
                <div className="px-6 pt-6 pb-4">
                    {title && <h3 className="title-medium text-on-surface">{title}</h3>}
                    {subtitle && <p className="body-medium text-on-surface-variant">{subtitle}</p>}
                </div>
            )}
            <div className="flex-1 min-h-0 relative px-6 pb-6">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};
DoughnutChart.displayName = 'DoughnutChart';
