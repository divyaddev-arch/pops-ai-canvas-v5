import { useState } from 'react';
import { TextField, IconButton, Icon, SendIcon } from './GM3';

export const PromptInput = ({ id, onSend }: { id?: string; onSend?: (prompt: string) => void }) => {
  const [prompt, setPrompt] = useState('');

  const handleSend = () => {
    if (prompt.trim() && onSend) {
      onSend(prompt);
      setPrompt('');
    }
  };

  const isPromptEmpty = !prompt.trim();

  return (
    <div className="w-full max-w-[830px] p-0.5 rounded-2xl bg-gradient-to-br from-[#4285F4] via-[#9B72CB] to-[#D96570] shadow-[0_4px_4px_rgba(0,0,0,0.25)] font-google-sans-text" id={id}>
      <div className="relative bg-[#F0F4F9] rounded-[15px] p-6 flex flex-col min-h-[174px]" id={`${id}-inner`}>
        <TextField
          multiline
          autoGrow
          noLabel
          variant="filled-minimal"
          label="Prompt"
          placeholder="Describe your project..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="w-full flex-grow !max-w-none font-google-sans-text"
          containerClassName="flex-grow !bg-transparent"
          inputClassName="bg-transparent border-none focus:ring-0 focus:outline-none outline-none p-0 text-base text-[#444746] placeholder:text-[#444746] h-full resize-none font-google-sans-text"
          id="prompt-input-text-field-1"/>
        <div className="flex justify-end items-center mt-4 space-x-1" id="prompt-input-div-3">
          <IconButton 
            id="prompt-input-icon-button-3" 
            disabled={isPromptEmpty}
            onClick={handleSend}
          >
            <SendIcon id="prompt-input-send-icon-1" className={isPromptEmpty ? 'opacity-38' : ''} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
