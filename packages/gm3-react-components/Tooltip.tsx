import React, { useState, useEffect, useRef, useLayoutEffect, useId, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Button } from './Button';
import { useTheme } from './ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- Constants from Material Spec ---
const ENTER_DELAY = 500; // ms
const EXIT_DELAY = 150; // ms to allow moving mouse from anchor to tooltip
const VIEWPORT_MARGIN = 8; // px
const TOOLTIP_GAP = 6; // px, space between anchor and tooltip

// --- TooltipPopup (Internal Component) ---
interface TooltipPopupProps {
  anchorEl: HTMLElement;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  content: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  isRich: boolean;
  className?: string;
  id: string;
}

const TooltipPopup: React.FC<TooltipPopupProps> = ({
  anchorEl,
  content,
  title,
  actions,
  isRich,
  className,
  id,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { themeKey, mode, themes } = useTheme();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dynamicStyles, setDynamicStyles] = useState<React.CSSProperties>({
      visibility: 'hidden',
      opacity: 0,
  });

  const hexToRgb = (hex: string): string | null => {
    if (!hex || !hex.startsWith('#') || hex.length !== 7) return null;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : `${r}, ${g}, ${b}`;
  };

  useLayoutEffect(() => {
    const timerId = setTimeout(() => {
        if (!anchorEl || !tooltipRef.current) return;

        const tooltipNode = tooltipRef.current;
        const anchorRect = anchorEl.getBoundingClientRect();
        const tooltipRect = tooltipNode.getBoundingClientRect();
        const { innerHeight: vpHeight, innerWidth: vpWidth } = window;

        let top = anchorRect.bottom + TOOLTIP_GAP;
        if (top + tooltipRect.height > vpHeight - VIEWPORT_MARGIN) {
            top = anchorRect.top - tooltipRect.height - TOOLTIP_GAP;
        }

        let left = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;
        if (left < VIEWPORT_MARGIN) {
            left = VIEWPORT_MARGIN;
        } else if (left + tooltipRect.width > vpWidth - VIEWPORT_MARGIN) {
            left = vpWidth - tooltipRect.width - VIEWPORT_MARGIN;
        }
        
        const richThemeStyles: Record<string, string> = {};
        if (isRich) {
            const oppositeMode = mode === 'light' ? 'dark' : 'light';
            const currentTheme = themes[themeKey];
            if (currentTheme) {
                const oppositePalette = currentTheme[oppositeMode];
                const currentPalette = currentTheme[mode];
                Object.assign(richThemeStyles, oppositePalette);
                richThemeStyles['--color-inverse-surface'] = currentPalette['--color-inverse-surface'];
                richThemeStyles['--color-inverse-on-surface'] = currentPalette['--color-inverse-on-surface'];
                const primaryRgb = hexToRgb(oppositePalette['--color-primary']);
                if (primaryRgb) richThemeStyles['--color-primary-rgb'] = primaryRgb;
                const secondaryRgb = hexToRgb(oppositePalette['--color-secondary']);
                if (secondaryRgb) richThemeStyles['--color-secondary-rgb'] = secondaryRgb;
                const onSurfaceRgb = hexToRgb(oppositePalette['--color-on-surface']);
                if (onSurfaceRgb) richThemeStyles['--color-on-surface-rgb'] = onSurfaceRgb;
            }
        }

        setDynamicStyles({
            ...richThemeStyles,
            top,
            left,
            visibility: 'visible',
            opacity: 1,
        });
    }, 0);

    return () => clearTimeout(timerId);
  }, [anchorEl, isRich, mode, themeKey, themes]);
  
  const richTooltipContent = (
      <div className="flex flex-col">
          <div className="flex flex-col px-4 pt-3 pb-1 gap-1">
              {title && <h3 className="text-sm font-medium text-[#444746] leading-[20px]">{title}</h3>}
              <div className="text-sm text-[#444746] leading-[20px]">{content}</div>
          </div>
          {actions && <div className="flex px-1 h-12 items-center">{actions}</div>}
      </div>
  );

  const plainTooltipContent = <div className="body-medium">{content}</div>;

  return ReactDOM.createPortal(
    <div
      ref={tooltipRef}
      id={id}
      role="tooltip"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={dynamicStyles}
      className={cn(
          'fixed z-50 transition-opacity duration-150',
          isRich 
              ? 'bg-[#F0F4F9] text-[#444746] rounded-[12px] shadow-[0px_2px_6px_2px_rgba(0,0,0,0.15),0px_1px_2px_0px_rgba(0,0,0,0.30)] w-[312px]'
              : 'bg-inverse-surface text-inverse-on-surface rounded-[4px] shadow-elevation-1 py-2 px-4 max-w-[240px]',
          className
      )}
    >
        {isRich ? richTooltipContent : plainTooltipContent}
    </div>,
    document.body
  );
};

// --- Tooltip (Public API) ---
export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  rich?: boolean;
  className?: string;
  id?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  title,
  actions,
  rich = false,
  className,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const tooltipId = id || useId();

  const setAnchorRef = useCallback((node: HTMLElement | null) => {
    setAnchorEl(node);
  }, []);

  const handleOpen = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, ENTER_DELAY);
  };

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, EXIT_DELAY);
  };

  const cancelClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const anchor = React.cloneElement(children as React.ReactElement<any>, {
    ref: setAnchorRef,
    onMouseEnter: handleOpen,
    onMouseLeave: handleClose,
    onFocus: handleOpen,
    onBlur: handleClose,
    'aria-describedby': isOpen ? tooltipId : undefined,
  });

  return (
    <>
      {anchor}
      {isOpen && anchorEl && (
        <TooltipPopup
          anchorEl={anchorEl}
          onClose={handleClose}
          onMouseEnter={cancelClose}
          onMouseLeave={handleClose}
          content={content}
          title={title}
          actions={actions}
          isRich={rich}
          className={className}
          id={tooltipId}
        />
      )}
    </>
  );
};
