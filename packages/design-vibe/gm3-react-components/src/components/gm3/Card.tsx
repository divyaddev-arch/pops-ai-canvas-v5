import React, { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * A utility function to combine class names.
 * @param classes - A list of class names.
 * @returns A string of combined class names.
 */
const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const cardStyles = {
    elevated: {
        base: "bg-surface-container-low shadow-elevation-1",
        interactive: "hover:shadow-elevation-2",
    },
    filled: {
        base: "bg-surface-variant text-on-surface-variant",
        interactive: "", // Interactive state handled by ::after pseudo-element
    },
    outlined: {
        base: "bg-surface border border-outline-variant",
        interactive: "", // Interactive state handled by ::after pseudo-element
    },
};

type CardVariant = keyof typeof cardStyles;

const borderRadiusStyles = {
    'extra-small': 'rounded-extra-small',
    'small': 'rounded-small',
    'medium': 'rounded-medium',
    'large': 'rounded-large',
    'extra-large': 'rounded-extra-large',
};

type CardBorderRadius = keyof typeof borderRadiusStyles;

// Use Omit to avoid clashes with the underlying element's props
type CardBaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'children'> & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'>;

export interface CardProps extends CardBaseProps {
  variant: CardVariant;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode | (({ isVertical }: { isVertical: boolean }) => React.ReactNode);
  responsiveLayoutThreshold?: number;
  borderRadius?: CardBorderRadius;
  editorId?: string;
}

export const Card = React.forwardRef<HTMLDivElement | HTMLButtonElement, CardProps>(
  ({ variant, onClick, className, children, responsiveLayoutThreshold, borderRadius = 'medium', editorId, ...props }, ref) => {
    const isInteractive = !!onClick;
    const Component = isInteractive ? 'button' : 'div';
    const styles = cardStyles[variant as keyof typeof cardStyles] || cardStyles.elevated;

    const [element, setElement] = useState<HTMLDivElement | HTMLButtonElement | null>(null);
    // Default to vertical. This provides a better "mobile-first" render, and ensures
    // the initial width is dictated by the container, not by wide content that might overflow.
    const [isVertical, setIsVertical] = useState(true);

    const combinedRef = useCallback((node: HTMLDivElement | HTMLButtonElement | null) => {
      setElement(node);
      // Forward the ref to the parent component
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    useEffect(() => {
      if (!responsiveLayoutThreshold || !element) {
        // If responsiveness is not configured, default to horizontal layout.
        if (!responsiveLayoutThreshold) {
          setIsVertical(false);
        }
        return;
      }

      const observer = new ResizeObserver(entries => {
        const entry = entries[0];
        if (entry) {
          setIsVertical(entry.contentRect.width < responsiveLayoutThreshold);
        }
      });
      observer.observe(element);

      // Perform an initial check as observer may not fire immediately
      const initialWidth = element.getBoundingClientRect().width;
      if (initialWidth > 0) {
        setIsVertical(initialWidth < responsiveLayoutThreshold);
      }

      return () => observer.disconnect();
    }, [element, responsiveLayoutThreshold]);

    const renderedChildren = typeof children === 'function' ? children({ isVertical }) : children;
    
    const componentProps = {
        ...props,
        ref: combinedRef,
        className: cn(
            "relative block transition-shadow duration-200 text-left",
            borderRadiusStyles[borderRadius],
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary",
            styles.base,
            isInteractive && "cursor-pointer",
            isInteractive && "card--interactive",
            isInteractive && styles.interactive,
            className
        ),
        ...(isInteractive && { onClick }),
    };

    return React.createElement(Component, componentProps, renderedChildren);
  }
);
Card.displayName = 'Card';