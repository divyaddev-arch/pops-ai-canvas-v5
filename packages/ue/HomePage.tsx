import React from 'react';

interface HomePageProps {
  userName?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ userName = 'Elisa' }) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-6 space-y-10 font-google-sans" id="homepage-content">
      {/* Welcome Section */}
      <div className="space-y-1" id="welcome-section">
        <h1 className="text-2xl font-medium bg-gradient-to-r from-[#078EFB] to-[#AC87EB] bg-clip-text text-transparent">
          Hello, {userName}
        </h1>
        <p className="text-4xl font-normal text-[#1F1F1F]">
          How can I help today?
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center w-full max-w-3xl h-14 bg-white rounded-full border border-[#E1E3E5] shadow-sm px-4" id="search-section">
        <div className="flex-1 flex items-center gap-3 pl-2">
          <span className="text-[#444746] text-base">Search or ask a question</span>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#BBE2FF] to-[#D0D9FF] text-[#1F1F1F] rounded-full px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
            <g clipPath="url(#clip0_10053_32192)">
              <path d="M8 14.4C7.93333 14.4 7.87778 14.3778 7.83333 14.3333C7.78889 14.2889 7.75556 14.2333 7.73333 14.1667C7.55556 13.4667 7.27778 12.7944 6.9 12.15C6.53333 11.4944 6.1 10.9111 5.6 10.4C5.08889 9.88889 4.50556 9.45 3.85 9.08333C3.20556 8.71667 2.53333 8.44444 1.83333 8.26667C1.76667 8.24444 1.71111 8.21111 1.66667 8.16667C1.62222 8.12222 1.6 8.06667 1.6 8C1.6 7.93333 1.62222 7.87778 1.66667 7.83333C1.71111 7.78889 1.76667 7.75556 1.83333 7.73333C2.53333 7.55556 3.20556 7.28333 3.85 6.91667C4.49444 6.55 5.07778 6.11111 5.6 5.6C6.11111 5.1 6.55 4.52222 6.91667 3.86667C7.28333 3.21111 7.55556 2.53333 7.73333 1.83333C7.75556 1.76667 7.78889 1.71111 7.83333 1.66667C7.87778 1.62222 7.93333 1.6 8 1.6C8.06667 1.6 8.12222 1.62222 8.16667 1.66667C8.21111 1.71111 8.24444 1.76667 8.26667 1.83333C8.44444 2.53333 8.71667 3.21111 9.08333 3.86667C9.45 4.51111 9.88889 5.08889 10.4 5.6C10.9111 6.11111 11.4889 6.55 12.1333 6.91667C12.7889 7.28333 13.4667 7.55556 14.1667 7.73333C14.2333 7.75556 14.2889 7.78889 14.3333 7.83333C14.3778 7.87778 14.4 7.93333 14.4 8C14.4 8.06667 14.3778 8.12222 14.3333 8.16667C14.2889 8.21111 14.2333 8.24444 14.1667 8.26667C13.4667 8.44444 12.7889 8.71667 12.1333 9.08333C11.4778 9.45 10.9 9.88889 10.4 10.4C9.88889 10.9222 9.45 11.5056 9.08333 12.15C8.71667 12.7944 8.44444 13.4667 8.26667 14.1667C8.24444 14.2333 8.21111 14.2889 8.16667 14.3333C8.12222 14.3778 8.06667 14.4 8 14.4Z" fill="#1F1F1F" />
            </g>
            <defs>
              <clipPath id="clip0_10053_32192">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Ask My Google
        </button>
      </div>

      {/* Canvas Control Card */}
      <div className="w-full max-w-3xl bg-gradient-to-r from-[#BBE2FF] to-[#D0D9FF] rounded-2xl p-6 space-y-4" id="control-card">
        <div className="flex items-center gap-2 text-[#1F1F1F] text-sm font-medium">
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
            <g clipPath="url(#clip0_10053_32197)">
              <path d="M10 18C10.0833 18 10.1528 17.9722 10.2083 17.9167C10.2639 17.8611 10.3056 17.7917 10.3333 17.7083C10.5556 16.8333 10.9028 15.9931 11.375 15.1875C11.8333 14.3681 12.375 13.6389 13 13C13.6389 12.3611 14.3681 11.8125 15.1875 11.3542C15.9931 10.8958 16.8333 10.5556 17.7083 10.3333C17.7917 10.3056 17.8611 10.2639 17.9167 10.2083C17.9722 10.1528 18 10.0833 18 10C18 9.91667 17.9722 9.84722 17.9167 9.79167C17.8611 9.73611 17.7917 9.69444 17.7083 9.66667C16.8333 9.44444 15.9931 9.10417 15.1875 8.64583C14.3819 8.1875 13.6528 7.63889 13 7C12.3611 6.375 11.8125 5.65278 11.3542 4.83333C10.8958 4.01389 10.5556 3.16667 10.3333 2.29167C10.3056 2.20833 10.2639 2.13889 10.2083 2.08333C10.1528 2.02778 10.0833 2 10 2C9.91667 2 9.84722 2.02778 9.79167 2.08333C9.73611 2.13889 9.69444 2.20833 9.66667 2.29167C9.44444 3.16667 9.10417 4.01389 8.64583 4.83333C8.1875 5.63889 7.63889 6.36111 7 7C6.36111 7.63889 5.63889 8.1875 4.83333 8.64583C4.01389 9.10417 3.16667 9.44444 2.29167 9.66667C2.20833 9.69444 2.13889 9.73611 2.08333 9.79167C2.02778 9.84722 2 9.91667 2 10C2 10.0833 2.02778 10.1528 2.08333 10.2083C2.13889 10.2639 2.20833 10.3056 2.29167 10.3333C3.16667 10.5556 4.01389 10.8958 4.83333 11.3542C5.65278 11.8125 6.375 12.3611 7 13C7.63889 13.6528 8.1875 14.3819 8.64583 15.1875C9.10417 15.9931 9.44444 16.8333 9.66667 17.7083C9.69444 17.7917 9.73611 17.8611 9.79167 17.9167C9.84722 17.9722 9.91667 18 10 18Z" fill="#1F1F1F" />
            </g>
            <defs>
              <clipPath id="clip0_10053_32197">
                <rect width="20" height="20" fill="white" transform="matrix(-1 0 0 1 20 0)" />
              </clipPath>
            </defs>
          </svg>
          My Google can do more than you imagine
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="bg-white rounded-full px-4 py-2 text-sm font-medium text-[#0B57D0] hover:bg-[#F8FAFD] transition-colors">
            Book vacation
          </button>
          <button className="bg-white rounded-full px-4 py-2 text-sm font-medium text-[#0B57D0] hover:bg-[#F8FAFD] transition-colors">
            Send a peer bonus
          </button>
          <button className="bg-white rounded-full px-4 py-2 text-sm font-medium text-[#0B57D0] hover:bg-[#F8FAFD] transition-colors">
            Explore other roles
          </button>
          <button className="bg-white rounded-full px-4 py-2 text-sm font-medium text-[#0B57D0] hover:bg-[#F8FAFD] transition-colors">
            Complete tasks
          </button>
        </div>
      </div>

      {/* Announcements */}
      <div className="space-y-4" id="announcements-section">
        <h2 className="text-base font-medium text-[#1F1F1F]">Announcements</h2>
        <div className="w-full max-w-3xl bg-[#E9EEF6] rounded-2xl p-4 flex gap-4 items-start">
          <div className="w-6 h-6 flex-shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <path d="M7.5 3C8.38333 3 9.20833 3.15833 9.975 3.475C10.7417 3.79167 11.4167 4.23333 12 4.8C12.5833 4.23333 13.2583 3.79167 14.025 3.475C14.7917 3.15833 15.6167 3 16.5 3C18.3 3 19.8333 3.63333 21.1 4.9C22.3667 6.16667 23 7.7 23 9.5C23 10.4 22.825 11.25 22.475 12.05L21.1 14.1L16.6 18.6C16.0167 19.1833 15.325 19.65 14.525 20C13.7417 20.3333 12.9 20.5 12 20.5C11.1 20.5 10.25 20.3333 9.45 20C8.66667 19.65 7.98333 19.1833 7.4 18.6L2.9 14.1C2.31667 13.5167 1.85 12.8333 1.5 12.05C1.16667 11.25 1 10.4 1 9.5C1 7.7 1.63333 6.16667 2.9 4.9C4.16667 3.63333 5.7 3 7.5 3Z" fill="#0B57D0" />
            </svg>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-[#1F1F1F]">Benefits enrollment is open</h3>
            </div>
            <p className="text-sm text-[#444746]">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.
            </p>
            <div className="flex justify-end pt-2">
              <button className="bg-[#0B57D0] text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-[#0842A0] transition-colors">
                Start enrolling
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-4" id="tasks-section">
        <div className="flex justify-between items-center max-w-3xl">
          <h2 className="text-base font-medium text-[#1F1F1F]">Your HR tasks</h2>
          <button className="text-[#444746] hover:bg-[#F1F3F4] rounded-full p-2">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <path d="M12 8C12.55 8 13 7.55 13 7C13 6.45 12.55 6 12 6C11.45 6 11 6.45 11 7C11 7.55 11.45 8 12 8ZM12 13C12.55 13 13 12.55 13 12C13 11.45 12.55 11 12 11C11.45 11 11 11.45 11 12C11 12.55 11.45 13 12 13ZM12 18C12.55 18 13 17.55 13 17C13 16.45 12.55 16 12 16C11.45 16 11 16.45 11 17C11 17.55 11.45 18 12 18Z" fill="#444746" opacity="0.6" />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="w-full max-w-3xl bg-white rounded-2xl border border-[#C4C7C5] overflow-hidden">
          {/* Filters */}
          <div className="flex items-center gap-4 p-4 border-b border-[#C4C7C5]">
            <div className="flex bg-[#E9EEF6] rounded-full p-1 text-xs font-medium">
              <button className="bg-white text-[#004A77] rounded-full px-4 py-1.5 shadow-sm">All (10)</button>
              <button className="text-[#444746] px-4 py-1.5 hover:bg-[#F1F3F4] rounded-full">Personal (3)</button>
              <button className="text-[#444746] px-4 py-1.5 hover:bg-[#F1F3F4] rounded-full">Manager (7)</button>
            </div>
            <div className="flex-1"></div>
            <button className="border border-[#C4C7C5] rounded-lg px-3 py-1.5 text-xs font-medium text-[#444746] flex items-center gap-1 hover:bg-[#F1F3F4]">
              Status
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M8 10L4 6H12L8 10Z" fill="#444746" /></svg>
            </button>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-[#C4C7C5]">
            {/* Row 1 */}
            <div className="flex items-center p-4 text-sm hover:bg-[#F8FAFD]">
              <div className="flex-1 font-medium text-[#1F1F1F]">Complete your 2026 benefits enrollment</div>
              <div className="w-32 text-[#B3261E] font-medium text-xs">Action required</div>
              <div className="w-32 text-[#444746] text-xs">Due Oct 24, 2026</div>
            </div>
            {/* Row 2 */}
            <div className="flex items-center p-4 text-sm hover:bg-[#F8FAFD]">
              <div className="flex-1 font-medium text-[#1F1F1F]">Approve Q3 compensation changes</div>
              <div className="w-32 text-[#B3261E] font-medium text-xs">Action required</div>
              <div className="w-32 text-[#444746] text-xs">Due Oct 15, 2026</div>
            </div>
            {/* Row 3 */}
            <div className="flex items-center p-4 text-sm hover:bg-[#F8FAFD]">
              <div className="flex-1 font-medium text-[#1F1F1F]">Submit performance self-reflection</div>
              <div className="w-32 text-[#0B57D0] font-medium text-xs">In progress</div>
              <div className="w-32 text-[#444746] text-xs">Due Nov 01, 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
