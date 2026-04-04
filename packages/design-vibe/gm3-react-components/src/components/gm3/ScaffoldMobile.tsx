import React from 'react';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export enum FabPosition {
  End = 'End',
  Center = 'Center',
}

export interface ScaffoldProps extends React.HTMLAttributes<HTMLDivElement> {
  topBar?: React.ReactNode;
  bottomBar?: React.ReactNode;
  snackbarHost?: React.ReactNode;
  floatingActionButton?: React.ReactNode;
  floatingActionButtonPosition?: FabPosition;
  children: React.ReactNode; // The main content
}

export const Scaffold = React.forwardRef<HTMLDivElement, ScaffoldProps>(({
  topBar,
  bottomBar,
  snackbarHost,
  floatingActionButton,
  floatingActionButtonPosition = FabPosition.End,
  children,
  className,
  ...props
}, ref) => {

  const fabPositionClasses = {
    [FabPosition.End]: 'right-4', // 16px
    [FabPosition.Center]: 'left-1/2 -translate-x-1/2',
  };

  // Default BottomAppBar height is 80px. FAB is 16px above it. 80 + 16 = 96px (6rem -> bottom-24).
  // Without BottomAppBar, FAB is 16px from the edge (1rem -> bottom-4).
  const fabBottomClass = bottomBar ? 'bottom-24' : 'bottom-4';

  return (
    <div ref={ref} className={cn("relative h-full w-full flex flex-col bg-background", className)} {...props}>
      {topBar && <header className="flex-shrink-0 z-10">{topBar}</header>}
      
      <main className="flex-1 min-h-0 relative">
        <div className="absolute inset-0">
            {children}
        </div>
      </main>

      {bottomBar && <footer className="flex-shrink-0 z-10">{bottomBar}</footer>}

      {floatingActionButton && (
        <div className={cn(
            "absolute z-20",
            fabBottomClass,
            fabPositionClasses[floatingActionButtonPosition]
        )}>
          {floatingActionButton}
        </div>
      )}

      {/* The Snackbar component uses a portal, so this is just a slot for it in the component tree. */}
      {snackbarHost}

    </div>
  );
});

Scaffold.displayName = 'Scaffold';