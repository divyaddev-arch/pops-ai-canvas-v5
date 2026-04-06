import React from 'react';
import { Icon, IconButton } from './index';
import { Menu, MenuItem } from '../gm3-react-components/Menu';


export interface TopAppBarAction {
  id: string;
  icon?: string | React.ReactNode;
  label?: string;
  onClick?: () => void;
  hasDropdown?: boolean;
  dropdownContent?: (close: () => void) => React.ReactNode;
  dropdownClassName?: string;
}


interface DefaultTopAppBarProps {
  onSearch?: (query: string) => void;
  actions?: TopAppBarAction[];
  onProfileClick?: () => void;
  userInitial?: string;
  userName?: string;
  userEmail?: string;
}

export const DefaultTopAppBar: React.FC<DefaultTopAppBarProps> = ({
  onSearch,
  actions = [],
  onProfileClick,
  userInitial = "A",
  userName = "First Last",
  userEmail = "username@google.com"
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);



  const defaultActions: TopAppBarAction[] = [
    {
      id: 'help',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_2773)">
            <path d="M11.95 18C12.3 18 12.5917 17.8833 12.825 17.65C13.075 17.4 13.2 17.1 13.2 16.75C13.2 16.4 13.075 16.1083 12.825 15.875C12.5917 15.625 12.3 15.5 11.95 15.5C11.6 15.5 11.3 15.625 11.05 15.875C10.8167 16.1083 10.7 16.4 10.7 16.75C10.7 17.1 10.8167 17.4 11.05 17.65C11.3 17.8833 11.6 18 11.95 18ZM11.05 14.15H12.9C12.9 13.6 12.9583 13.1667 13.075 12.85C13.2083 12.5333 13.5667 12.1 14.15 11.55C14.5833 11.1167 14.925 10.7083 15.175 10.325C15.425 9.925 15.55 9.45 15.55 8.9C15.55 7.96667 15.2083 7.25 14.525 6.75C13.8417 6.25 13.0333 6 12.1 6C11.15 6 10.375 6.25 9.775 6.75C9.19167 7.25 8.78333 7.85 8.55 8.55L10.2 9.2C10.2833 8.9 10.4667 8.575 10.75 8.225C11.05 7.875 11.5 7.7 12.1 7.7C12.6333 7.7 13.0333 7.85 13.3 8.15C13.5667 8.43333 13.7 8.75 13.7 9.1C13.7 9.43333 13.6 9.75 13.4 10.05C13.2 10.3333 12.95 10.6 12.65 10.85C11.9167 11.5 11.4667 11.9917 11.3 12.325C11.1333 12.6583 11.05 13.2667 11.05 14.15ZM12 22C10.6167 22 9.31667 21.7417 8.1 21.225C6.88333 20.6917 5.825 19.975 4.925 19.075C4.025 18.175 3.30833 17.1167 2.775 15.9C2.25833 14.6833 2 13.3833 2 12C2 10.6167 2.25833 9.31667 2.775 8.1C3.30833 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31667 8.1 2.8C9.31667 2.26667 10.6167 2 12 2C13.3833 2 14.6833 2.26667 15.9 2.8C17.1167 3.31667 18.175 4.025 19.075 4.925C19.975 5.825 20.6833 6.88333 21.2 8.1C21.7333 9.31667 22 10.6167 22 12C22 13.3833 21.7333 14.6833 21.2 15.9C20.6833 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6917 15.9 21.225C14.6833 21.7417 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#444746"/>
          </g>
          <defs>
            <clipPath id="clip0_10784_2773">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      ),
      label: 'Help'
    },
    {
      id: 'settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_2778)">
            <path d="M9.25 22L8.85 18.8C8.63333 18.7167 8.425 18.6167 8.225 18.5C8.04167 18.3833 7.85833 18.2583 7.675 18.125L4.7 19.375L1.95 14.625L4.525 12.675C4.50833 12.5583 4.5 12.45 4.5 12.35C4.5 12.2333 4.5 12.1167 4.5 12C4.5 11.8833 4.5 11.775 4.5 11.675C4.5 11.5583 4.50833 11.4417 4.525 11.325L1.95 9.375L4.7 4.625L7.675 5.875C7.85833 5.74167 8.05 5.61667 8.25 5.5C8.45 5.38333 8.65 5.28333 8.85 5.2L9.25 2H14.75L15.15 5.2C15.3667 5.28333 15.5667 5.38333 15.75 5.5C15.95 5.61667 16.1417 5.74167 16.325 5.875L19.3 4.625L22.05 9.375L19.475 11.325C19.4917 11.4417 19.5 11.5583 19.5 11.675C19.5 11.775 19.5 11.8833 19.5 12C19.5 12.1167 19.5 12.2333 19.5 12.35C19.5 12.45 19.4833 12.5583 19.45 12.675L22.025 14.625L19.275 19.375L16.325 18.125C16.1417 18.2583 15.95 18.3833 15.75 18.5C15.55 18.6167 15.35 18.7167 15.15 18.8L14.75 22H9.25ZM11 20H12.975L13.325 17.35C13.8417 17.2167 14.3167 17.025 14.75 16.775C15.2 16.5083 15.6083 16.1917 15.975 15.825L18.45 16.85L19.425 15.15L17.275 13.525C17.3583 13.2917 17.4167 13.05 17.45 12.8C17.4833 12.5333 17.5 12.2667 17.5 12C17.5 11.7333 17.4833 11.475 17.45 11.225C17.4167 10.9583 17.3583 10.7083 17.275 10.475L19.425 8.85L18.45 7.15L15.975 8.2C15.6083 7.81667 15.2 7.5 14.75 7.25C14.3167 6.98333 13.8417 6.78333 13.325 6.65L13 4H11.025L10.675 6.65C10.1583 6.78333 9.675 6.98333 9.225 7.25C8.79167 7.5 8.39167 7.80833 8.025 8.175L5.55 7.15L4.575 8.85L6.725 10.45C6.64167 10.7 6.58333 10.95 6.55 11.2C6.51667 11.45 6.5 11.7167 6.5 12C6.5 12.2667 6.51667 12.525 6.55 12.775C6.58333 13.025 6.64167 13.275 6.725 13.525L4.575 15.15L5.55 16.85L8.025 15.8C8.39167 16.1833 8.79167 16.5083 9.225 16.775C9.675 17.025 10.1583 17.2167 10.675 17.35L11 20ZM12.05 15.5C13.0167 15.5 13.8417 15.1583 14.525 14.475C15.2083 13.7917 15.55 12.9667 15.55 12C15.55 11.0333 15.2083 10.2083 14.525 9.525C13.8417 8.84167 13.0167 8.5 12.05 8.5C11.0667 8.5 10.2333 8.84167 9.55 9.525C8.88333 10.2083 8.55 11.0333 8.55 12C8.55 12.9667 8.88333 13.7917 9.55 14.475C10.2333 15.1583 11.0667 15.5 12.05 15.5Z" fill="#444746"/>
          </g>
          <defs>
            <clipPath id="clip0_10784_2778">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      ),
      label: 'Settings'
    },
    {
      id: 'spark',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <g clipPath="url(#clip0_10784_2789)">
            <path d="M12 22C11.9 22 11.8083 21.9667 11.725 21.9C11.6417 21.8333 11.5833 21.75 11.55 21.65C11.2667 20.5333 10.8417 19.4833 10.275 18.5C9.70833 17.5167 9.01667 16.6167 8.2 15.8C7.38333 14.9833 6.48333 14.2917 5.5 13.725C4.51667 13.1583 3.46667 12.7333 2.35 12.45C2.25 12.4167 2.16667 12.3583 2.1 12.275C2.03333 12.1917 2 12.1 2 12C2 11.9 2.03333 11.8083 2.1 11.725C2.16667 11.6417 2.25 11.5833 2.35 11.55C3.46667 11.2667 4.51667 10.8417 5.5 10.275C6.48333 9.70833 7.38333 9.01667 8.2 8.2C9.01667 7.38333 9.70833 6.48333 10.275 5.5C10.8417 4.51667 11.2667 3.46667 11.55 2.35C11.5833 2.25 11.6417 2.16667 11.725 2.1C11.8083 2.03333 11.9 2 12 2C12.1 2 12.1833 2.03333 12.25 2.1C12.3333 2.16667 12.3917 2.25 12.425 2.35C12.725 3.46667 13.1583 4.51667 13.725 5.5C14.2917 6.48333 14.9833 7.38333 15.8 8.2C16.6167 9.01667 17.5167 9.70833 18.5 10.275C19.4833 10.8417 20.5333 11.2667 21.65 11.55C21.75 11.5833 21.8333 11.6417 21.9 11.725C21.9667 11.8083 22 11.9 22 12C22 12.1 21.9667 12.1917 21.9 12.275C21.8333 12.3583 21.75 12.4167 21.65 12.45C20.5333 12.7333 19.4833 13.1583 18.5 13.725C17.5167 14.2917 16.6167 14.9833 15.8 15.8C14.9833 16.6167 14.2917 17.5167 13.725 18.5C13.1583 19.4833 12.7333 20.5333 12.45 21.65C12.4167 21.75 12.3583 21.8333 12.275 21.9C12.1917 21.9667 12.1 22 12 22Z" fill="#444746"/>
          </g>
          <defs>
            <clipPath id="clip0_10784_2789">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      ),
      label: 'Spark'
    }
  ];

  const allActions = [...defaultActions];
  if (actions) {
    actions.forEach(action => {
      const index = allActions.findIndex(a => a.id === action.id);
      if (index >= 0) {
        allActions[index] = { ...allActions[index], ...action };
      } else {
        allActions.push(action);
      }
    });
  }

  return (
    <div className="w-full h-16 bg-[#F8FAFD] flex items-center justify-between pl-[28px] pr-4 font-google-sans" id="cee-basic-app-bar">
      {/* Product Lockup */}
      <div className="flex items-center gap-3 w-[256px]" id="product-lockup">
        {/* Logo */}
        <div className="w-10 h-10" id="product-logo">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.0001 11.6667V11.6813V11.6667C18.9058 11.6661 17.8222 11.8817 16.8115 12.3011C15.8008 12.7205 14.8829 13.3354 14.1105 14.1105L15.8063 16.6667L17.5605 17.5605C17.8588 17.2059 18.2328 16.9229 18.655 16.7321C19.0773 16.5414 19.5369 16.4478 20.0001 16.4584C21.2834 16.4584 22.4084 17.1188 22.8355 18.2792C23.2626 19.4396 23.0209 20.4917 22.2918 21.2501L20.0001 23.5417L16.2188 27.2355L12.2918 30.8334C9.55635 29.0334 6.66676 24.6146 6.66676 20.0001C6.67774 16.4661 8.08126 13.079 10.573 10.573L9.17718 8.34381L7.05635 7.01672C5.34541 8.71791 3.98827 10.7411 3.06324 12.9694C2.1382 15.1978 1.66358 17.5873 1.66676 20.0001V20.0355C1.66676 27.2917 6.09593 32.0646 7.02301 32.9855C9.29593 35.248 11.3459 36.6667 12.2918 36.6667C12.6452 36.6664 12.9946 36.5921 13.3175 36.4486C13.6404 36.305 13.9297 36.0955 14.1668 35.8334C14.1668 35.8334 24.1105 26.9292 24.1668 26.8751C26.2834 24.8334 28.3334 22.5459 28.3334 20.0001C28.3334 17.7899 27.4555 15.6703 25.8927 14.1075C24.3299 12.5447 22.2102 11.6667 20.0001 11.6667Z" fill="#4285F4"/>
            <path d="M32.9687 7.0417C31.2662 5.33838 29.2448 3.98719 27.0199 3.06531C24.7951 2.14344 22.4104 1.66895 20.0021 1.66895C17.5938 1.66895 15.2091 2.14344 12.9842 3.06531C10.7594 3.98719 8.73792 5.33838 7.0354 7.0417L10.5771 10.5834C13.0659 8.08847 16.4426 6.68254 19.9665 6.67395C23.4905 6.66536 26.8741 8.05481 29.375 10.5375L32.1771 9.47295L32.9687 7.0417Z" fill="#34A853"/>
            <path d="M19.5146 31.0605L20 30.6251L16.2125 27.2292L15.7771 27.6417L19.5146 31.0605Z" fill="#185ABC"/>
            <path d="M32.1584 30.9479L29.4063 29.3937C28.8743 29.9122 28.307 30.3933 27.7084 30.8333L20.0001 23.5562L17.7084 21.2646C17.2523 20.7633 16.9876 20.1173 16.9609 19.4401C16.9342 18.7629 17.1473 18.098 17.5626 17.5625C16.7292 16.7291 15.0959 15.0791 14.1209 14.1C13.3438 14.8736 12.727 15.793 12.3058 16.8054C11.8847 17.8178 11.6675 18.9034 11.6667 20C11.6667 22.5 13.4917 24.6062 15.6251 26.6771C17.6563 28.65 20.0001 30.6354 20.0001 30.6354L25.8334 35.8437C26.5605 36.4937 27.0834 36.6416 27.7084 36.6416C28.5063 36.6416 29.9042 35.8833 32.9626 32.9354C32.9647 32.9583 32.148 30.9583 32.1584 30.9479Z" fill="#EA4335"/>
            <path d="M38.3333 20C38.3365 17.5876 37.8618 15.1985 36.9368 12.9704C36.0117 10.7424 34.6546 8.7196 32.9438 7.0188L29.4125 10.5605C30.6564 11.7975 31.6432 13.2684 32.3161 14.8885C32.989 16.5086 33.3347 18.2458 33.3333 20C33.3403 21.7444 32.9981 23.4726 32.3269 25.0826C31.6557 26.6927 30.669 28.1522 29.425 29.375L29.4062 29.3938L32.9625 32.9625C34.6653 31.2645 36.0163 29.2471 36.9379 27.0259C37.8596 24.8048 38.3338 22.4236 38.3333 20.0188V20Z" fill="#FBBC04"/>
          </svg>
        </div>
        {/* Title */}
        <span className="text-[22px] font-normal text-[#1F1F1F]">My Google</span>
      </div>



      {/* Right-side Actions */}
      <div className="flex items-center gap-2 w-[216px] justify-end pr-5" id="right-side-actions">
        {/* Dynamic Actions */}
        {allActions.map((action) => (
          <div key={action.id} className="relative">
            <IconButton
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                setAnchorEl(e.currentTarget);
                setActiveDropdown(activeDropdown === action.id ? null : action.id);
                action.onClick?.();
              }}
              title={action.label}
              className="text-[#444746]"
              id={`action-${action.id}`}
            >
              {action.icon && (typeof action.icon === 'string' ? <Icon>{action.icon}</Icon> : action.icon)}
            </IconButton>
            
            {/* Dropdown Menu (GM3 Style) */}
            {action.hasDropdown && action.dropdownContent && (
              <Menu
                anchorEl={anchorEl}
                open={activeDropdown === action.id}
                onClose={() => setActiveDropdown(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                className={`!transition-none !scale-100 ${action.dropdownClassName || ''}`}
              >
                {action.dropdownContent(() => setActiveDropdown(null))}
              </Menu>
            )}

          </div>
        ))}



        {/* Profile Menu */}
        <div className="relative">
          <div 
            className="relative cursor-pointer ml-2" 
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              setAnchorEl(e.currentTarget);
              setActiveDropdown(activeDropdown === 'profile' ? null : 'profile');
            }}
            id="profile-menu"
          >
            {/* Avatar */}
            <div className="w-8 h-8 bg-[#0B57D0] rounded-full flex items-center justify-center text-white text-base font-medium">
              {userInitial}
            </div>
            
            {/* Dropdown Arrow with background and shadow */}
            <div className="absolute top-[16px] left-[24px] w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-[0_1px_3px_1px_rgba(0,0,0,0.15),0_1px_2px_0_rgba(0,0,0,0.30)]">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-[#444746]">
                <g clipPath="url(#clip0_10784_2796)">
                  <path d="M8 10L4 6H12L8 10Z" fill="#444746"/>
                </g>
                <defs>
                  <clipPath id="clip0_10784_2796">
                    <rect width="16" height="16" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          
          {/* Profile Dropdown (GM3 Style) */}
          <Menu
            anchorEl={anchorEl}
            open={activeDropdown === 'profile'}
            onClose={() => setActiveDropdown(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            className="!bg-[#E9EEF6] !rounded-[28px] w-[258px] !transition-none !scale-100"
          >
            <div className="py-4">
              {/* User Info */}
              <div className="flex flex-col items-center px-6 mb-2">
                <div className="flex items-center w-full mb-3">
                  <div className="w-8 h-8 bg-[#0B57D0] rounded-full flex items-center justify-center text-white text-base font-medium mr-3 flex-shrink-0">
                    {userInitial}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-[#1F1F1F] truncate">{userName}</span>
                    <span className="text-xs text-[#444746] truncate">{userEmail}</span>
                  </div>
                </div>
                <button className="w-full border border-[#747775] rounded-lg py-1.5 flex items-center justify-center text-sm font-medium text-[#444746] hover:bg-black/5 transition-colors">
                  <span>Manage Moma profile</span>
                  <Icon className="text-base ml-2">open_in_new</Icon>
                </button>
              </div>
              
              {/* Privacy Policy */}
              <div className="border-t border-[#C4C7C5] mt-3 mb-1"></div>
              <div className="flex items-center px-6 py-3 hover:bg-black/5 cursor-pointer transition-colors">
                <Icon className="text-[#444746] mr-3">shield</Icon>
                <span className="text-sm font-medium text-[#1F1F1F]">Employee Privacy Policy</span>
              </div>
              
              {/* User Agreement */}
              <div className="border-t border-[#C4C7C5] my-1"></div>
              <div className="flex items-center px-6 py-3 hover:bg-black/5 cursor-pointer transition-colors">
                <Icon className="text-[#444746] mr-3">description</Icon>
                <span className="text-sm font-medium text-[#1F1F1F]">User agreement</span>
              </div>
              
              {/* Switch Accounts */}
              <div className="border-t border-[#C4C7C5] my-1"></div>
              <div className="flex justify-center pt-3 pb-1">
                <button className="border border-[#747775] rounded-full px-6 py-2 text-sm font-medium text-[#0B57D0] hover:bg-black/5 transition-colors">
                  Switch accounts
                </button>
              </div>
            </div>
          </Menu>
        </div>


      </div>
    </div>
  );
};

export default DefaultTopAppBar;
