import React from 'react';
import { BasicPageDemo } from '../ue-demo/BasicPageDemo';
import { ContextualAppBarDemo } from '../ue-demo/ContextualAppBarDemo';
import { NavigationRailDemo } from '../ue-demo/NavigationRailDemo';
import { ContextualAppBar } from './ContextualAppBar';
import { UnifiedLayoutDemo } from '../ue-demo/UnifiedLayoutDemo';
import { SideAgent } from './SideAgent';

export const Gallery = () => {
  const [activeItem, setActiveItem] = React.useState('DemoPage');

  const menuItems = [
    { id: 'DemoPage', name: 'Demo Page (ue-demo)' },
    { id: 'ContextualAppBar', name: 'Contextual App Bar' },
    { id: 'NavigationRail', name: 'Navigation Rail' },
    { id: 'UnifiedLayout', name: 'Unified Layout' },
    { id: 'SideAgent', name: 'Side Agent' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFD] font-google-sans">
      {/* Left Panel / Sidebar */}
      <div className="w-64 bg-white border-r border-[#E3E3E3] flex flex-col">
        <div className="p-6 border-b border-[#E3E3E3]">
          <h1 className="text-xl font-medium text-[#1F1F1F]">UE Gallery</h1>
        </div>
        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeItem === item.id
                      ? 'bg-[#E8F0FE] text-[#0B57D0]'
                      : 'text-[#444746] hover:bg-black/5'
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Right Panel / Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {activeItem === 'DemoPage' && (
          <div className="w-full h-full overflow-auto">
            <BasicPageDemo />
          </div>
        )}
        {activeItem === 'ContextualAppBar' && (
          <div className="w-full h-full overflow-auto">
            <ContextualAppBarDemo />
          </div>
        )}
        {activeItem === 'NavigationRail' && (
          <div className="w-full h-full overflow-auto">
            <NavigationRailDemo />
          </div>
        )}
        {activeItem === 'UnifiedLayout' && (
          <div className="w-full h-full overflow-auto">
            <UnifiedLayoutDemo />
          </div>
        )}
        {activeItem === 'SideAgent' && (
          <div className="w-full h-full flex items-center justify-center bg-[#F0F4F9] p-6">
            <SideAgent />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
