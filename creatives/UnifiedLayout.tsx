import React from 'react';
import { DefaultTopAppBar } from '../packages/ue/DefaultTopAppBar';
import { NavigationRail } from '../packages/ue/NavigationRail';
import { HomePage } from '../packages/ue/HomePage';
import { SideAgent } from './SideAgent';
import { DivyaCareerPage } from './DivyaCareerPage';

interface UnifiedLayoutProps {
  children?: React.ReactNode;
  activeId?: string;
  activeDrawerItemId?: string;
  onSelect?: (id: string, drawerItemId?: string) => void;
  userName?: string;
  userEmail?: string;
  showAgent?: boolean;
  systemInstructions?: string;
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ 
  children,
  activeId: propActiveId,
  activeDrawerItemId: propActiveDrawerItemId,
  onSelect,
  userName = 'Divya',
  userEmail,
  showAgent = true,
  systemInstructions
}) => {
  const [internalActiveId, setInternalActiveId] = React.useState('growth');
  const [internalActiveDrawerItemId, setInternalActiveDrawerItemId] = React.useState('career');
  const [isAgentVisible, setIsAgentVisible] = React.useState(showAgent);

  const activeId = propActiveId !== undefined ? propActiveId : internalActiveId;
  const activeDrawerItemId = propActiveDrawerItemId !== undefined ? propActiveDrawerItemId : internalActiveDrawerItemId;

  const handleSelect = (id: string, drawerItemId?: string) => {
    if (onSelect) {
      onSelect(id, drawerItemId);
    } else {
      setInternalActiveId(id);
      if (drawerItemId) {
        setInternalActiveDrawerItemId(drawerItemId);
      } else {
        setInternalActiveDrawerItemId('');
      }
    }
  };

  const renderContent = () => {
    if (children) {
      return children;
    }
    
    if (activeId === 'home') {
      return <HomePage userName={userName} />;
    }

    if (activeId === 'growth' && activeDrawerItemId === 'career') {
      return <DivyaCareerPage userName={userName} userEmail={userEmail} />;
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#5F6368] w-full py-20">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Page Under Construction</h1>
          <p className="text-[#80868B]">The page for '{activeId}' / '{activeDrawerItemId || 'overview'}' is not yet available.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFD] font-google-sans" id="unified-layout">
      <div className="sticky top-0 z-30 bg-[#F8FAFD]">
        <DefaultTopAppBar 
          userInitial={userName?.[0] || 'D'} 
          userName={userName}
          userEmail={userEmail}
          actions={[
            {
              id: 'spark',
              onClick: () => setIsAgentVisible(!isAgentVisible)
            }
          ]}
        />
      </div>
      
      {/* Body: Two columns */}
      <div className="flex flex-1 relative h-[calc(100vh-64px)] overflow-hidden" id="layout-body">
        
        {/* Column 1: Content (Side Nav + Main Content) */}
        <div className="flex-1 flex min-h-0 z-10" id="content-container">
          <NavigationRail 
            activeId={activeId}
            activeDrawerItemId={activeDrawerItemId}
            onSelect={handleSelect}
          />
          <main className="flex-1 p-6 flex flex-col overflow-y-auto" id="main-content">
            {renderContent()}
          </main>
        </div>
        
        {/* Column 2: Side Agent */}
        <div 
          className={`flex-none border-l border-[#C4C7C5] bg-white flex flex-col transition-all duration-300 ease-in-out ${isAgentVisible ? 'w-[360px]' : 'w-0 border-l-0'}`}
          style={{ overflow: 'hidden' }}
        >
          <div className="w-[360px] h-full">
            <SideAgent userName={userName} systemInstructions={systemInstructions} />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default UnifiedLayout;
