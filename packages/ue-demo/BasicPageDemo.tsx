import React from 'react';
import { DefaultTopAppBar } from '../ue/DefaultTopAppBar';
import { Button, ContextualAppBar } from '../ue/index';

export const BasicPageDemo = () => {
  const actions = [
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
    <div className="flex flex-col h-screen bg-[#F8FAFD]">
      <DefaultTopAppBar actions={actions} />
    </div>
  );
};

export default BasicPageDemo;
