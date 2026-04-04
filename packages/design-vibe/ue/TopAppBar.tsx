"use client";

import React, { useState } from 'react';
import { IconButton, Icon, Menu, MenuItem, Tooltip } from '@my-google-project/gm3-react-components';

export const UEManifest = {
  name: "TopAppBar",
  description: "Highly customizable top navigation bar with dynamic actions, menus, and visual toggles.",
  properties: [
    { id: "title", label: "Title", type: "string", default: "My Google" },
    { id: "logoIcon", label: "Logo Icon", type: "icon", default: "cloud" },
    { id: "logoAsset", label: "Logo Asset (URL)", type: "asset" },
    { id: "showMenu", label: "Show Menu Icon", type: "boolean", default: true },
    { id: "showBack", label: "Show Back Button", type: "boolean", default: false },
    { id: "backPath", label: "Back Route Path", type: "string", default: "Page01" },
    { id: "showSearch", label: "Show Search Bar", type: "boolean", default: true },
    { id: "searchPlaceholder", label: "Search Placeholder", type: "string", default: "Search" },
    {
      id: "actions",
      label: "Right Side Actions",
      type: "list",
      itemSchema: [
        { id: "id", label: "ID", type: "hidden" },
        { id: "icon", label: "Icon Name", type: "icon" },
        { id: "label", label: "Tooltip/Aria Label", type: "string" },
        { 
          id: "menuItems", 
          label: "Menu Items (Optional)", 
          type: "list",
          itemSchema: [
            { id: "headline", label: "Item Label", type: "string" },
            { id: "path", label: "Route Path", type: "string" }
          ]
        }
      ]
    },
    { id: "avatarInitial", label: "Avatar Initial", type: "string", default: "A" }
  ]
};

export interface TopAppBarAction {
  id: string;
  icon: string | React.ReactNode;
  label: string;
  menuItems?: Array<{ headline: string; path?: string }>;
}

export interface TopAppBarProps {
  id?: string;
  title?: string;
  logoIcon?: string | React.ReactNode;
  logoAsset?: string;
  showMenu?: boolean;
  showBack?: boolean;
  backPath?: string;
  onBackClick?: () => void;
  onMenuClick?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  actions?: TopAppBarAction[];
  onActionClick?: (actionId: string) => void;
  avatarInitial?: string;
  onProfileClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  logoSlot?: React.ReactNode;
  presenceSlot?: React.ReactNode;
  className?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  id = "ue-top-app-bar",
  title = "My Google",
  logoIcon,
  logoAsset,
  showMenu = true,
  showBack = false,
  backPath = "Page01",
  onBackClick,
  onMenuClick,
  showSearch = true,
  searchPlaceholder = "Search",
  onSearchChange,
  actions = [],
  onActionClick,
  avatarInitial = "A",
  onProfileClick,
  logoSlot,
  presenceSlot,
  className
}) => {
  const [menuAnchors, setMenuAnchors] = useState<Record<string, HTMLElement | null>>({});

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>, actionId: string) => {
    if (onActionClick) {
      onActionClick(actionId);
    }
    setMenuAnchors(prev => ({ ...prev, [actionId]: event.currentTarget }));
  };

  const handleMenuClose = (actionId: string) => {
    setMenuAnchors(prev => ({ ...prev, [actionId]: null }));
  };

  const handleNavigate = (path?: string) => {
    if (path) {
      window.location.hash = `#/${path}`;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  const handleBackClickInternal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onBackClick) {
      onBackClick();
    } else {
      handleNavigate(backPath);
    }
  };

  const logo = logoAsset ? (
    <img id={`${id}-logo-asset`} src={logoAsset} alt="Logo" className="w-8 h-8 object-contain" />
  ) : logoSlot ? (
    <div id={`${id}-logo-slot`}>{logoSlot}</div>
  ) : (
    <div id={`${id}-product-lockup-content`} className="flex items-center gap-3">
      <div id={`${id}-product-logo`} className="w-10 h-10 flex items-center justify-center">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
          <path d="M20.0001 11.6667V11.6813V11.6667C18.9058 11.6661 17.8222 11.8817 16.8115 12.3011C15.8008 12.7205 14.8829 13.3354 14.1105 14.1105L15.8063 16.6667L17.5605 17.5605C17.8588 17.2059 18.2328 16.9229 18.655 16.7321C19.0773 16.5414 19.5369 16.4478 20.0001 16.4584C21.2834 16.4584 22.4084 17.1188 22.8355 18.2792C23.2626 19.4396 23.0209 20.4917 22.2918 21.2501L20.0001 23.5417L16.2188 27.2355L12.2918 30.8334C9.55635 29.0334 6.66676 24.6146 6.66676 20.0001C6.67774 16.4661 8.08126 13.079 10.573 10.573L9.17718 8.34381L7.05635 7.01672C5.34541 8.71791 3.98827 10.7411 3.06324 12.9694C2.1382 15.1978 1.66358 17.5873 1.66676 20.0001V20.0355C1.66676 27.2917 6.09593 32.0646 7.02301 32.9855C9.29593 35.248 11.3459 36.6667 12.2918 36.6667C12.6452 36.6664 12.9946 36.5921 13.3175 36.4486C13.6404 36.305 13.9297 36.0955 14.1668 35.8334C14.1668 35.8334 24.1105 26.9292 24.1668 26.8751C26.2834 24.8334 28.3334 22.5459 28.3334 20.0001C28.3334 17.7899 27.4555 15.6703 25.8927 14.1075C24.3299 12.5447 22.2102 11.6667 20.0001 11.6667V11.6667Z" fill="#4285F4"/>
          <path d="M32.9687 7.0417C31.2662 5.33838 29.2448 3.98719 27.0199 3.06531C24.7951 2.14344 22.4104 1.66895 20.0021 1.66895C17.5938 1.66895 15.2091 2.14344 12.9842 3.06531C10.7594 3.98719 8.73792 5.33838 7.0354 7.0417L10.5771 10.5834C13.0659 8.08847 16.4426 6.68254 19.9666 6.67395C23.4905 6.66536 26.8741 8.05481 29.375 10.5375L32.1771 9.47295L32.9687 7.0417Z" fill="#34A853"/>
          <path d="M19.5146 31.0605L20 30.6251L16.2125 27.2292L15.7771 27.6417L19.5146 31.0605Z" fill="#185ABC"/>
          <path d="M32.1584 30.9479L29.4063 29.3937C28.8743 29.9122 28.307 30.3933 27.7084 30.8333L20.0001 23.5562L17.7084 21.2646C17.2523 20.7633 16.9876 20.1173 16.9609 19.4401C16.9342 18.7629 17.1473 18.098 17.5626 17.5625C16.7292 16.7291 15.0959 15.0791 14.1209 14.1C13.3438 14.8736 12.727 15.793 12.3058 16.8054C11.8847 17.8178 11.6675 18.9034 11.6667 20C11.6667 22.5 13.4917 24.6062 15.6251 26.6771C17.6563 28.65 20.0001 30.6354 20.0001 30.6354L25.8334 35.8437C26.5605 36.4937 27.0834 36.6416 27.7084 36.6416C28.5063 36.6416 29.9042 35.8833 32.9626 32.9354C32.9647 32.9583 32.148 30.9583 32.1584 30.9479Z" fill="#EA4335"/>
          <path d="M38.3333 20C38.3365 17.5876 37.8618 15.1985 36.9368 12.9704C36.0117 10.7424 34.6546 8.7196 32.9438 7.0188L29.4125 10.5605C30.6564 11.7975 31.6432 13.2684 32.3161 14.8885C32.989 16.5086 33.3347 18.2458 33.3333 20C33.3403 21.7444 32.9981 23.4726 32.3269 25.0826C31.6557 26.6927 30.669 28.1522 29.425 29.375L29.4062 29.3938L32.9625 32.9625C34.6653 31.2645 36.0163 29.2471 36.9379 27.0259C37.8596 24.8048 38.3338 22.4236 38.3333 20.0188V20Z" fill="#FBBC04"/>
        </svg>
      </div>
      <span id={`${id}-product-name`} className="text-[22px] font-normal text-[#1F1F1F] leading-[28px] whitespace-nowrap">
        My Google
      </span>
    </div>
  );

  return (
    <header 
      id={id} 
      className={`h-[64px] w-full flex items-center pl-7 pr-6 py-2 bg-surface text-on-surface z-30 sticky top-0 border-b border-outline-variant/10 ${className}`}
    >
      <div id={`${id}-left-section`} className="flex items-center gap-2 flex-shrink-0">
        <div id={`${id}-nav-icons`} className="flex items-center">
          {showBack && (
            <IconButton 
              id={`${id}-back-button`} 
              variant="standard" 
              onClick={handleBackClickInternal} 
              className="h-16"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </IconButton>
          )}
          {showMenu && (
            <IconButton id={`${id}-menu-button`} variant="standard" onClick={onMenuClick} className="h-16">
              <span className="material-symbols-outlined">menu</span>
            </IconButton>
          )}
        </div>
        
        <div id={`${id}-product-lockup`} className="flex items-center gap-2">
          {logo}
        </div>
      </div>

      <div id={`${id}-center-section`} className="flex-1 flex justify-center px-4 min-w-0">
        {showSearch && (
          <div id={`${id}-search-container`} className="w-full max-w-[720px]">
            <div className="relative h-12 w-full bg-surface-container-high rounded-full flex items-center group focus-within:bg-surface focus-within:shadow-elevation-1 border border-transparent focus-within:border-outline-variant transition-all duration-medium2 ease-standard px-4">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
              <input
                id={`${id}-search-input`}
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="flex-1 h-full bg-transparent outline-none body-large px-3 text-on-surface placeholder:text-on-surface-variant"
              />
              <IconButton id={`${id}-search-options`} variant="standard" size="xsmall" className="!text-on-surface-variant">
                <span className="material-symbols-outlined">tune</span>
              </IconButton>
            </div>
          </div>
        )}
      </div>

      <div id={`${id}-right-section`} className="flex items-center gap-1 flex-shrink-0 mr-2">
        <div id={`${id}-presence-container`}>
          {presenceSlot}
        </div>
        
        <div id={`${id}-utility-actions`} className="flex items-center gap-1">
          {actions.map((action) => (
            <React.Fragment key={action.id}>
              <Tooltip content={action.label}>
                <IconButton 
                  id={`${id}-action-${action.id}`} 
                  variant="standard" 
                  className="!text-on-surface-variant"
                  onClick={(e) => handleActionClick(e, action.id)}
                >
                  {typeof action.icon === 'string' ? (
                    <span className="material-symbols-outlined">{action.icon}</span>
                  ) : (
                    action.icon
                  )}
                </IconButton>
              </Tooltip>
              
              {action.menuItems && action.menuItems.length > 0 && (
                <Menu
                  anchorEl={menuAnchors[action.id]}
                  open={Boolean(menuAnchors[action.id])}
                  onClose={() => handleMenuClose(action.id)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {action.menuItems.map((item, idx) => (
                    <MenuItem 
                      key={idx} 
                      headline={item.headline} 
                      onClick={() => {
                        handleNavigate(item.path);
                        handleMenuClose(action.id);
                      }}
                    />
                  ))}
                </Menu>
              )}
            </React.Fragment>
          ))}
        </div>

        <div 
          id={`${id}-profile-trigger`} 
          className="flex items-center ml-2 cursor-pointer transition-all duration-medium2 ease-standard group"
          onClick={onProfileClick}
        >
          <div id={`${id}-avatar-circle`} className="w-8 h-8 rounded-full bg-[#0B57D0] flex items-center justify-center shadow-sm relative group-hover:brightness-95 transition-all">
            <span id={`${id}-avatar-label`} className="title-medium font-medium text-white">{avatarInitial}</span>
            <div className="absolute -right-2 -bottom-1 bg-surface rounded-full w-4 h-4 flex items-center justify-center border border-outline-variant shadow-sm">
              <span className="material-symbols-outlined text-on-surface-variant !text-[14px]">arrow_drop_down</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
