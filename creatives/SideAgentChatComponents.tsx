import React from 'react';

// Common Icon interface
const Icon: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}>{children}</span>
);

// Common IconButton
const IconButton: React.FC<{ children: React.ReactNode; title?: string; onClick?: () => void }> = ({ children, title, onClick }) => (
  <button 
    onClick={onClick}
    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-[#444746]"
    title={title}
  >
    {children}
  </button>
);

/**
 * 1. PromptBlock: The styled box for user messages
 */
export const PromptBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-[#E3EEF6] text-[#1F1F1F] px-4 py-3.5 rounded-2xl max-w-[260px] self-end">
    <p className="text-base font-normal leading-6">{children}</p>
  </div>
);

/**
 * 2. ResponseHeader: Contains Avatar and Thinking Button
 */
export const ResponseHeader: React.FC<{ onClickThinking?: () => void }> = ({ onClickThinking }) => (
  <div className="w-[328px] h-[48px] flex items-center gap-[20px]" id="response-header">
    <div className="w-8 h-10 flex-shrink-0">
      <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.0002 17.3333V17.3449V17.3333C15.1248 17.3328 14.2579 17.5053 13.4493 17.8408C12.6408 18.1763 11.9064 18.6682 11.2885 19.2883L12.6452 21.3333L14.0485 22.0483C14.2871 21.7646 14.5863 21.5382 14.9241 21.3856C15.2619 21.233 15.6296 21.1582 16.0002 21.1666C17.0268 21.1666 17.9268 21.6949 18.2685 22.6233C18.6102 23.5516 18.4168 24.3933 17.8335 24.9999L16.0002 26.8333L12.9752 29.7883L9.83351 32.6666C7.64518 31.2266 5.33351 27.6916 5.33351 23.9999C5.34229 21.1728 6.46511 18.4631 8.45851 16.4583L7.34184 14.6749L5.64518 13.6133C4.27642 14.9742 3.19071 16.5928 2.45069 18.3755C1.71066 20.1582 1.33096 22.0698 1.33351 23.9999V24.0283C1.33351 29.8333 4.87684 33.6516 5.61851 34.3883C7.43684 36.1983 9.07684 37.3333 9.83351 37.3333C10.1162 37.333 10.3957 37.2736 10.6541 37.1588C10.9124 37.0439 11.1439 36.8763 11.3335 36.6666C11.3335 36.6666 19.2885 29.5433 19.3335 29.4999C21.0268 27.8666 22.6668 26.0366 22.6668 23.9999C22.6668 22.2318 21.9645 20.5361 20.7142 19.2859C19.464 18.0357 17.7683 17.3333 16.0002 17.3333Z" fill="#4285F4"/>
        <path d="M26.3751 13.6333C25.0131 12.2706 23.3959 11.1897 21.616 10.4522C19.8361 9.71468 17.9284 9.33508 16.0018 9.33508C14.0751 9.33508 12.1674 9.71468 10.3875 10.4522C8.60758 11.1897 6.99043 12.2706 5.62842 13.6333L8.46175 16.4666C10.4528 14.4707 13.1542 13.346 15.9733 13.3391C18.7925 13.3322 21.4993 14.4438 23.5001 16.43L25.7418 15.5783L26.3751 13.6333Z" fill="#34A853"/>
        <path d="M15.6121 32.8483L16.0004 32.5L12.9704 29.7833L12.6221 30.1133L15.6121 32.8483Z" fill="#185ABC"/>
        <path d="M25.7268 32.7582L23.5252 31.5149C23.0995 31.9297 22.6457 32.3145 22.1668 32.6666L16.0002 26.8449L14.1668 25.0116C13.8019 24.6106 13.5902 24.0937 13.5688 23.552C13.5475 23.0103 13.7179 22.4784 14.0502 22.0499C13.3835 21.3832 12.0768 20.0632 11.2968 19.2799C10.6751 19.8988 10.1817 20.6343 9.84477 21.4442C9.50786 22.2542 9.33412 23.1227 9.3335 23.9999C9.3335 25.9999 10.7935 27.6849 12.5002 29.3416C14.1252 30.9199 16.0002 32.5082 16.0002 32.5082L20.6668 36.6749C21.2485 37.1949 21.6668 37.3132 22.1668 37.3132C22.8052 37.3132 23.9235 36.7066 26.3702 34.3482C26.3718 34.3666 25.7185 32.7666 25.7268 32.7582Z" fill="#EA4335"/>
        <path d="M30.6671 24C30.6696 22.07 30.2898 20.1587 29.5498 18.3763C28.8098 16.5939 27.7241 14.9756 26.3554 13.615L23.5304 16.4483C24.5255 17.4379 25.3149 18.6147 25.8533 19.9107C26.3916 21.2068 26.6682 22.5966 26.6671 24C26.6726 25.3955 26.3989 26.778 25.8619 28.0661C25.3249 29.3541 24.5356 30.5217 23.5404 31.5L23.5254 31.515L26.3704 34.37C27.7327 33.0116 28.8134 31.3976 29.5507 29.6207C30.288 27.8438 30.6674 25.9388 30.6671 24.015V24Z" fill="#FBBC04"/>
      </svg>
    </div>
    <div className="h-12 flex items-center">
      <button 
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-[#444746] hover:bg-black/5 transition-colors"
      >
        <span>Show thinking</span>
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] text-[#444746]">
          <path d="M9 11.55L4.5 7.05L5.55 6L9 9.45L12.45 6L13.5 7.05L9 11.55Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </div>
);

/**
 * 4. SourcesButton: The 'Sources' dropdown button
 */
export const SourcesButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-1.5 pl-4 pr-3 py-2 text-sm font-medium text-[#444746] hover:bg-black/5 rounded-full transition-colors"
  >
    <span>Sources</span>
    <Icon>keyboard_arrow_down</Icon>
  </button>
);

/**
 * 5. FeedbackBar: Actions bar at bottom of response (thumbs, copy, options)
 */
export const FeedbackBar: React.FC<{
  onThumbUp?: () => void;
  onThumbDown?: () => void;
  onCopy?: () => void;
  onMore?: () => void;
}> = ({ onThumbUp, onThumbDown, onCopy, onMore }) => (
  <div className="flex items-center gap-0.5" id="feedback-actions-bar">
    <IconButton onClick={onThumbUp} title="Good response">
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <path d="M15 17H5.5V7L11.5 0.999999L12.1667 1.45833C12.4028 1.625 12.5833 1.84028 12.7083 2.10417C12.8333 2.35417 12.8681 2.61805 12.8125 2.89583L12.7917 3L12 7H17.5C17.9167 7 18.2708 7.14583 18.5625 7.4375C18.8542 7.72917 19 8.08333 19 8.5V9.6875C19 9.79861 18.9861 9.90278 18.9583 10C18.9444 10.0833 18.9167 10.1736 18.875 10.2708L16.3958 16.0833C16.2708 16.3611 16.0833 16.5833 15.8333 16.75C15.5833 16.9167 15.3056 17 15 17ZM7 15.5H15L17.5 9.6875V8.5H10.1667L11.1875 3.4375L7 7.625V15.5ZM7 7.625V8.5V10V15.5V7.625ZM5.5 7V8.5H2.5V15.5H5.5V17H1V7H5.5Z" fill="currentColor"/>
      </svg>
    </IconButton>
    <IconButton onClick={onThumbDown} title="Poor response">
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <path d="M5 3H14.5V13L8.5 19L7.83333 18.5417C7.59722 18.375 7.41667 18.1667 7.29167 17.9167C7.16667 17.6528 7.13194 17.3819 7.1875 17.1042L7.20833 17L8 13H2.5C2.08333 13 1.72917 12.8542 1.4375 12.5625C1.14583 12.2708 1 11.9167 1 11.5V10.3125C1 10.2014 1.00694 10.1042 1.02083 10.0208C1.04861 9.92361 1.08333 9.82639 1.125 9.72917L3.60417 3.91667C3.71528 3.63889 3.89583 3.41667 4.14583 3.25C4.40972 3.08333 4.69444 3 5 3ZM13 4.5H5L2.5 10.3125V11.5H9.83333L8.8125 16.5625L13 12.375V4.5ZM13 12.375V11.5V10V4.5V12.375ZM14.5 13V11.5H17.5V4.5H14.5V3H19V13H14.5Z" fill="currentColor"/>
      </svg>
    </IconButton>
    <IconButton onClick={onCopy} title="Copy text">
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <path d="M7.5 15C7.08333 15 6.72917 14.8542 6.4375 14.5625C6.14583 14.2708 6 13.9167 6 13.5V3.5C6 3.08333 6.14583 2.72917 6.4375 2.4375C6.72917 2.14583 7.08333 2 7.5 2H15.5C15.9167 2 16.2708 2.14583 16.5625 2.4375C16.8542 2.72917 17 3.08333 17 3.5V13.5C17 13.9167 16.8542 14.2708 16.5625 14.5625C16.2708 14.8542 15.9167 15 15.5 15H7.5ZM7.5 13.5H15.5V3.5H7.5V13.5ZM4.5 18C4.08333 18 3.72917 17.8542 3.4375 17.5625C3.14583 17.2708 3 16.9167 3 16.5V5H4.5V16.5H14V18H4.5ZM7.5 13.5V3.5V13.5Z" fill="currentColor"/>
      </svg>
    </IconButton>
    <IconButton onClick={onMore} title="More">
      <Icon>more_vert</Icon>
    </IconButton>
  </div>
);

/**
 * 6. CanvasControlCard: Card UI that references action hooks
 */
export const CanvasControlCard: React.FC<{ title: string; onClick?: () => void }> = ({ title, onClick }) => (
  <div 
    onClick={onClick}
    className="w-full bg-[#F8FAFD] p-3 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-[#F1F3F8] transition-colors border border-[#E8EAED]"
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 flex items-center justify-center bg-[#E8F0FE] rounded-lg text-[#0B57D0]">
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <path d="M3 20C2.45 20 1.975 19.8083 1.575 19.425C1.19167 19.025 1 18.55 1 18V4C1 3.45 1.19167 2.98333 1.575 2.6C1.975 2.2 2.45 2 3 2H4V0H6V2H14V0H16V2H17C17.55 2 18.0167 2.2 18.4 2.6C18.8 2.98333 19 3.45 19 4V10H17V8H3V18H10V20H3ZM3 6H17V4H3V6ZM3 6V4V6ZM16.5 21C16.4 21 16.3333 20.95 16.3 20.85C16.0333 19.8333 15.525 18.9583 14.775 18.225C14.0417 17.475 13.1667 16.9667 12.15 16.7C12.05 16.6667 12 16.6 12 16.5C12 16.3833 12.05 16.3167 12.15 16.3C13.1667 16.0333 14.0417 15.5333 14.775 14.8C15.525 14.05 16.0333 13.1667 16.3 12.15C16.3333 12.05 16.4 12 16.5 12C16.6167 12 16.6833 12.05 16.7 12.15C16.9833 13.1667 17.4917 14.05 18.225 14.8C18.9583 15.5333 19.8333 16.0333 20.85 16.3C20.95 16.3167 21 16.3833 21 16.5C21 16.6 20.95 16.6667 20.85 16.7C19.8333 16.9667 18.95 17.475 18.2 18.225C17.4667 18.9583 16.9667 19.8333 16.7 20.85C16.6833 20.95 16.6167 21 16.5 21Z" fill="currentColor"/>
        </svg>
      </div>
      <span className="text-base font-medium text-[#1F1F1F]">{title}</span>
    </div>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#444746]">
      <path d="M14 18L12.6 16.55L16.15 13H4V11H16.15L12.6 7.45L14 6L20 12L14 18Z" fill="currentColor"/>
    </svg>
  </div>
);

/**
 * 7. SuggestionChip: The prompt pointer pill
 */
export const SuggestionChip: React.FC<{ label: string; onClick?: () => void }> = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full max-w-[240px] border border-[#747775] rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-black/5 transition-colors text-left"
  >
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] text-[#0B57D0] flex-shrink-0">
      <path d="M11.25 14.25L10.2 13.1812L12.8813 10.5H5.625C4.6875 10.5 3.8875 10.175 3.225 9.525C2.575 8.8625 2.25 8.0625 2.25 7.125C2.25 6.1875 2.575 5.39375 3.225 4.74375C3.8875 4.08125 4.6875 3.75 5.625 3.75H6V5.25H5.625C5.1 5.25 4.65625 5.43125 4.29375 5.79375C3.93125 6.15625 3.75 6.6 3.75 7.125C3.75 7.65 3.93125 8.09375 4.29375 8.45625C4.65625 8.81875 5.1 9 5.625 9H12.8813L10.2 6.3L11.25 5.25L15.75 9.75L11.25 14.25Z" fill="currentColor"/>
    </svg>
    <span className="text-sm font-medium text-[#444746] truncate">{label}</span>
  </button>
);
