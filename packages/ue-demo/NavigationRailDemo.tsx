import React from 'react';
import { NavigationRail } from '../ue/NavigationRail';

export const NavigationRailDemo = () => {
  const [activeId, setActiveId] = React.useState('benefits');

  return (
    <div className="w-full h-full flex font-google-sans relative overflow-hidden">
      {/* Navigation Rail */}
      <NavigationRail 
        activeId={activeId} 
        onSelect={(id) => setActiveId(id)}
        onFabClick={() => alert('FAB Clicked!')}
      />
      
      {/* Main Content Area */}
      <div className="flex-grow p-8 bg-white">
        <h2 className="text-2xl font-medium mb-4">Content Area</h2>
        <p className="text-[#444746] mb-4">
          Current Active Destination: <span className="font-bold text-[#004A77]">{activeId}</span>
        </p>
        
        <div className="border border-[#E3E3E3] rounded-lg p-6 bg-[#F8FAFD]">
          <p className="text-sm text-[#444746]">
            This is a mock content area. In a full app, switching destinations in the rail would change the content shown here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavigationRailDemo;
