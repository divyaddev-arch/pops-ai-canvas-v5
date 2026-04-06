import React, { useState } from 'react';
import { Header } from './Header';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface ExpansionPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  initiallyExpanded?: boolean;
  headerVariant?: 'floating' | 'full-width';
  hideTopBorder?: boolean;
  hideBottomBorder?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const ExpansionPanel = React.forwardRef<HTMLDivElement, ExpansionPanelProps>(({
  title,
  children,
  headerActions,
  initiallyExpanded = false,
  headerVariant = 'floating',
  hideTopBorder = false,
  hideBottomBorder = false,
  className,
  isExpanded: controlledIsExpanded,
  onToggleExpand: controlledOnToggleExpand,
  ...props
}, ref) => {
  const [internalIsExpanded, setInternalIsExpanded] = useState(initiallyExpanded);

  const isControlled = controlledIsExpanded !== undefined;
  const isExpanded = isControlled ? controlledIsExpanded : internalIsExpanded;

  const toggleExpand = () => {
    if (isControlled) {
      controlledOnToggleExpand?.();
    } else {
      setInternalIsExpanded(prev => !prev);
    }
  };


  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden flex flex-col",
        headerVariant === 'floating'
          ? "border border-outline-variant rounded-xl"
          : cn(
              "border-outline-variant",
              !hideTopBorder && "border-t",
              !hideBottomBorder && "border-b"
          ),
        isExpanded && "flex-1 min-h-0",
        className
      )}
      {...props}
    >
      <Header
        variant={headerVariant}
        title={title}
        isExpanded={isExpanded}
        onToggleExpand={toggleExpand}
        className="flex-shrink-0"
      >
        {headerActions}
      </Header>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-medium4 ease-standard bg-surface flex-1 min-h-0",
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
        aria-hidden={!isExpanded}
      >
        <div className="overflow-hidden min-h-0">
            {children}
        </div>
      </div>
    </div>
  );
});

ExpansionPanel.displayName = 'ExpansionPanel';