import React, { useState, useRef, useLayoutEffect } from "react";
import { Icon } from './Icons';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

// --- Tab ---
export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean; // Injected by TabRow
  icon?: React.ReactNode;
  label?: React.ReactNode;
  badge?: React.ReactNode;
  tabRef?: React.Ref<HTMLButtonElement>;
  size?: "standard" | "compact";
  // onClick is handled by TabRow
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      selected,
      icon,
      label,
      badge,
      disabled,
      className,
      tabRef,
      size = "standard",
      ...props
    },
    ref,
  ) => {
    const hasIcon = !!icon;
    const hasLabel = !!label;

    const sizeStyles = {
      standard: {
        container:
          hasIcon && hasLabel ? "h-[64px] flex-col gap-1" : "h-[48px] gap-2",
        padding: "px-4",
        font: "label-large",
        iconSize: "text-2xl",
        minWidth: "min-w-[90px]",
      },
      compact: {
        container: "h-[28px] flex-row gap-2",
        padding: "px-3",
        font: "label-large",
        iconSize: "text-[20px]",
        minWidth: "min-w-[60px]",
      },
    };

    const styles = sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.standard;

    const SizedIcon =
      hasIcon && React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any>, {
          className: cn((icon as React.ReactElement<any>).props.className, styles.iconSize),
        })
        : icon;

    const combinedRef = (instance: HTMLButtonElement | null) => {
      // Handle outer ref from forwardRef
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
      // Handle inner ref from props
      if (typeof tabRef === "function") {
        tabRef(instance);
      } else if (tabRef) {
        (tabRef as React.MutableRefObject<HTMLButtonElement | null>).current =
          instance;
      }
    };

    return (
      <button
        ref={combinedRef}
        role="tab"
        aria-selected={selected}
        disabled={disabled}
        className={cn(
          "relative flex items-center justify-center flex-1 max-w-[360px]",
          "transition-colors duration-200",
          "focus:outline-none",
          !disabled && "button--state-layer",
          styles.container,
          styles.padding,
          styles.minWidth,
          selected ? "text-primary" : "text-on-surface-variant",
          disabled && "text-on-surface-38 pointer-events-none",
          className,
        )}
        {...props}
      >
        {hasIcon && (
          <div className="relative">
            {SizedIcon}
            {badge && (
              <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                {badge}
              </div>
            )}
          </div>
        )}
        {hasLabel && !hasIcon && (
          <>
            <span className={cn(styles.font, "truncate")}>{label}</span>
            {badge && <div className="ml-[0px]">{badge}</div>}
          </>
        )}
        {hasLabel && hasIcon && (
          <span className={cn(styles.font, "truncate")}>{label}</span>
        )}
      </button>
    );
  },
);
Tab.displayName = "Tab";

// --- TabRow ---
export interface TabRowProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedTabIndex: number;
  onTabChange: (index: number) => void;
  children: React.ReactNode;
  indicatorClassName?: string;
}

export const TabRow = React.forwardRef<HTMLDivElement, TabRowProps>(
  (
    {
      selectedTabIndex,
      onTabChange,
      children,
      className,
      indicatorClassName,
      ...props
    },
    ref,
  ) => {
    const tabRowRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const childTabs = React.Children.toArray(children).filter(
      React.isValidElement,
    );

    useLayoutEffect(() => {
      const calculateIndicator = () => {
        const selectedTabNode = tabRefs.current[selectedTabIndex];
        const tabRowNode = tabRowRef.current;
        if (selectedTabNode && tabRowNode) {
          setIndicatorStyle({
            left: selectedTabNode.offsetLeft,
            width: selectedTabNode.offsetWidth,
          });
        }
      };

      // A timeout is used to ensure this runs after the browser has painted,
      // which can be important for web fonts affecting tab widths.
      const timerId = setTimeout(calculateIndicator, 50);

      window.addEventListener("resize", calculateIndicator);

      return () => {
        clearTimeout(timerId);
        window.removeEventListener("resize", calculateIndicator);
      };
    }, [selectedTabIndex, childTabs.length]);

    return (
      <div
        ref={tabRowRef}
        role="tablist"
        className={cn(
          "relative flex border-b border-outline-variant",
          className,
        )}
        {...props}
      >
        {childTabs.map((child, index) =>
          React.cloneElement(child as React.ReactElement<TabProps>, {
            key: index,
            tabRef: (el: HTMLButtonElement | null) => {
              tabRefs.current[index] = el;
            },
            selected: selectedTabIndex === index,
            onClick: () => onTabChange(index),
          }),
        )}
        <div
          className={cn(
            "absolute bottom-0 h-[3px] bg-primary rounded-t-[3px] transition-all duration-300 ease-in-out",
            indicatorClassName,
          )}
          style={indicatorStyle}
        />
      </div>
    );
  },
);
TabRow.displayName = "TabRow";
