import React from 'react';
import { UnifiedLayout } from '../ue/UnifiedLayout';
import { HomePage } from '../ue/HomePage';
import { ChatView } from '../ue/ChatView';

export const UnifiedLayoutDemo = () => {
  const [activeId, setActiveId] = React.useState('home');
  const [activeDrawerItemId, setActiveDrawerItemId] = React.useState('');

  const renderContent = () => {
    if (activeId === 'home') {
      return <HomePage userName="Elisa" />;
    }
    
    if (activeId === 'new-chat') {
      return <ChatView userName="Elisa" systemInstruction="You are a helpful platform assistant for the Pops AI Canvas project. Answer quickly and politely." />;
    }
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-[#444746]" id="placeholder-content">
        <h1 className="text-2xl font-normal mb-2 capitalize">Page: {activeId}</h1>
        {activeDrawerItemId && (
          <p className="text-sm">Section: <span className="font-medium">{activeDrawerItemId}</span></p>
        )}
        <p className="text-sm text-[#444746]/60 mt-4">This is placeholder content for testing navigation.</p>
      </div>
    );
  };

  return (
    <div className="w-full min-h-full border border-[#E3E3E3] rounded-lg">
      <UnifiedLayout
        activeId={activeId}
        activeDrawerItemId={activeDrawerItemId}
        onSelect={(id, drawerItemId) => {
          setActiveId(id);
          setActiveDrawerItemId(drawerItemId || '');
        }}
        userName="Elisa"
      >
        {renderContent()}
      </UnifiedLayout>
    </div>
  );
};

export default UnifiedLayoutDemo;
