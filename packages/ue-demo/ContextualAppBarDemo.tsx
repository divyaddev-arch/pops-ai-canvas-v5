import React from 'react';
import { ContextualAppBar } from '../ue/ContextualAppBar';

export const ContextualAppBarDemo = () => {
  const contextualActions = [
    {
      id: 'settings',
      hasDropdown: true,
      dropdownClassName: '!bg-[#F0F4F9] w-[200px]',
      dropdownContent: (close: () => void) => (
        <div>
          <div className="flex items-center px-4 py-3 hover:bg-black/5 cursor-pointer" onClick={() => { alert('Item 1 clicked'); close(); }}>
            <span className="text-base text-[#1F1F1F]">Sample Menu Item 1</span>
          </div>
          <div className="flex items-center px-4 py-3 hover:bg-black/5 cursor-pointer" onClick={() => { alert('Item 2 clicked'); close(); }}>
            <span className="text-base text-[#1F1F1F]">Sample Menu Item 2</span>
          </div>
          <div className="flex items-center px-4 py-3 hover:bg-black/5 cursor-pointer" onClick={() => { alert('Item 3 clicked'); close(); }}>
            <span className="text-base text-[#1F1F1F]">Sample Menu Item 3</span>
          </div>
          <div className="border-b border-[#C4C7C5] my-1"></div>
          <div className="flex items-center px-4 py-3 hover:bg-black/5 cursor-pointer" onClick={() => { alert('Item 4 clicked'); close(); }}>
            <span className="text-base text-[#1F1F1F]">Sample Menu Item 4</span>
          </div>
        </div>
      )
    },
    {
      id: 'help',
      hasDropdown: true,
      dropdownClassName: '!bg-[#F0F4F9] w-[200px]',
      dropdownContent: (close: () => void) => (
        <div>
          <div className="flex items-center px-4 py-3 hover:bg-black/5 cursor-pointer" onClick={() => { alert('Help clicked'); close(); }}>
            <span className="text-base text-[#1F1F1F]">Help</span>
          </div>
          <div className="flex items-center px-4 py-3 hover:bg-black/5 cursor-pointer" onClick={() => { alert('Education clicked'); close(); }}>
            <span className="text-base text-[#1F1F1F]">Educational content</span>
          </div>
          <div className="flex items-center px-4 py-3 hover:bg-black/5 cursor-pointer" onClick={() => { alert('About clicked'); close(); }}>
            <span className="text-base text-[#1F1F1F]">About team</span>
          </div>
          <div className="border-b border-[#C4C7C5] my-1"></div>
          <div className="flex items-center px-4 py-3 hover:bg-black/5 cursor-pointer" onClick={() => { alert('Feedback clicked'); close(); }}>
            <span className="text-base text-[#1F1F1F]">Send feedback</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="border border-[#E3E3E3] rounded-lg overflow-hidden">
        <ContextualAppBar
          title="Example Contextual Bar"
          onBackClick={() => alert('Back clicked')}
          actions={contextualActions}
        />
      </div>
    </div>
  );
};

export default ContextualAppBarDemo;
