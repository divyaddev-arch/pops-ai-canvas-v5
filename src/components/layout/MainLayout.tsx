import React from 'react';
import { SideNav } from '../../../packages/design-vibe/ue';
import { AI_CANVAS_THEME } from '../../constants/theme';

interface MainLayoutProps {
  children: React.ReactNode;
  destinations: any[];
  secondarySections?: any[];
  onRailClick: (item: any) => void;
  onDrawerItemClick: (item: any) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  destinations,
  secondarySections,
  onRailClick,
  onDrawerItemClick,
}) => {
  return (
    <div 
      className="flex h-screen w-full overflow-hidden"
      style={{ backgroundColor: AI_CANVAS_THEME.colors.background }}
    >
      {/* Systemic Sidebar: No borders, fixed width, transparent background */}
      <aside 
        className="h-full shrink-0 z-40"
        style={{ width: AI_CANVAS_THEME.dimensions.sidebarWidth }}
      >
        <SideNav 
          destinations={destinations}
          secondarySections={secondarySections}
          id="main-sidenav"
          fabIcon="auto_awesome"
          className="!bg-transparent"
          onDestinationClick={onRailClick}
          onItemClick={onDrawerItemClick}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {children}
      </main>
    </div>
  );
};
