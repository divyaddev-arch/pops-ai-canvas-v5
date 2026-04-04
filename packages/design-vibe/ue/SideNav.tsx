
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  NavigationRail,
  NavigationRailItem,
  FloatingActionButton,
  Icon,
  Divider,
  ExpansionPanel,
  ListItem
} from '@my-google-project/gm3-react-components';

const SuperChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.775 22C11.175 22 10.6333 21.7917 10.15 21.375C9.68333 20.9583 9.425 20.45 9.375 19.85C8.775 19.75 8.29167 19.5167 7.925 19.15C7.55833 18.7833 7.325 18.3 7.225 17.7C6.69167 17.65 6.225 17.4333 5.825 17.05C5.44167 16.65 5.225 16.1833 5.175 15.65C4.54167 15.6 4.025 15.3417 3.625 14.875C3.225 14.3917 3.025 13.8333 3.025 13.2C3.025 12.9 3.075 12.5917 3.175 12.275C3.29167 11.9417 3.475 11.65 3.725 11.4L9.525 5.6L12.775 8.85C12.825 8.9 12.875 8.94167 12.925 8.975C12.975 8.99167 13.0417 9 13.125 9C13.275 9 13.3917 8.95833 13.475 8.875C13.575 8.775 13.625 8.65 13.625 8.5C13.625 8.41667 13.6083 8.35 13.575 8.3C13.5583 8.25 13.525 8.2 13.475 8.15L10.65 5.325C10.2167 4.89167 9.725 4.56667 9.175 4.35C8.64167 4.11667 8.075 4 7.475 4C6.225 4 5.15833 4.44167 4.275 5.325C3.40833 6.19167 2.975 7.25 2.975 8.5C2.975 8.83333 3.00833 9.14167 3.075 9.425C3.14167 9.70833 3.24167 10 3.375 10.3L1.875 11.8C1.575 11.3 1.35 10.775 1.2 10.225C1.05 9.675 0.975 9.1 0.975 8.5C0.975 6.68333 1.6 5.15 2.85 3.9C4.11667 2.63333 5.65833 2 7.475 2C8.225 2 8.95833 2.13333 9.675 2.4C10.3917 2.65 11.0417 3.01667 11.625 3.5C12.2583 3 12.95 2.625 13.7 2.375C14.45 2.125 15.225 2 16.025 2C17.975 2 19.625 2.68333 20.975 4.05C22.3417 5.4 23.025 7.05 23.025 9C23.025 9.93333 22.8333 10.8333 22.45 11.7C22.0833 12.55 21.575 13.3 20.925 13.95L13.575 21.3C13.3417 21.5333 13.0667 21.7083 12.75 21.825C12.4333 21.9417 12.1083 22 11.775 22ZM12.225 19.85L19.525 12.55C20.0083 12.0667 20.375 11.525 20.625 10.925C20.8917 10.325 21.025 9.68333 21.025 9C21.025 7.61667 20.5333 6.44167 19.55 5.475C18.5833 4.49167 17.4083 4 16.025 4C15.4917 4 14.9833 4.075 14.5 4.225C14.0167 4.375 13.5583 4.6 13.125 4.9L14.925 6.7C15.1583 6.93333 15.3333 7.20833 15.45 7.525C15.5667 7.84167 15.625 8.16667 15.625 8.5C15.625 9.18333 15.3833 9.76667 14.9 10.25C14.4333 10.7167 13.8583 10.95 13.175 10.95C12.8417 10.95 12.5167 10.8917 12.2 10.775C11.8833 10.6583 11.6083 10.4833 11.375 10.25L9.575 8.45L5.175 12.85C5.125 12.9 5.08333 12.9583 5.05 13.025C5.03333 13.0917 5.025 13.1667 5.025 13.25C5.025 13.3833 5.06667 13.4917 5.15 13.575C5.23333 13.6583 5.34167 13.7 5.475 13.7C5.55833 13.7 5.63333 13.6917 5.7 13.675C5.76667 13.6417 5.825 13.6 5.875 13.55L9.275 10.15L10.675 11.55L7.275 14.95C7.225 15 7.18333 15.0583 7.15 15.125C7.13333 15.1917 7.125 15.2667 7.125 15.35C7.125 15.4833 7.16667 15.5917 7.25 15.675C7.33333 15.7583 7.44167 15.8 7.575 15.8C7.65833 15.8 7.73333 15.7917 7.8 15.775C7.86667 15.7417 7.925 15.7 7.975 15.65L11.375 12.25L12.775 13.65L9.375 17.05C9.325 17.1 9.28333 17.1667 9.25 17.25C9.21667 17.3167 9.2 17.3917 9.2 17.475C9.2 17.6083 9.24167 17.7167 9.325 17.8C9.40833 17.8833 9.51667 17.925 9.65 17.925C9.73333 17.925 9.80833 17.9083 9.875 17.875C9.95833 17.8417 10.025 17.8 10.075 17.75L13.475 14.35L14.875 15.75L11.475 19.15C11.425 19.2 11.3833 19.2583 11.35 19.325C11.3333 19.3917 11.325 19.4667 11.325 19.55C11.325 19.6833 11.3667 19.7917 11.45 19.875C11.5333 19.9583 11.6417 20 11.775 20C11.8583 20 11.9417 19.9917 12.025 19.975C12.1083 19.9417 12.175 19.9 12.225 19.85Z" fill="currentColor" />
  </svg>
);

const ChatSparkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_10362_1740)">
      <path d="M2 22V4C2 3.45 2.19167 2.98333 2.575 2.6C2.975 2.2 3.45 2 4 2H12C12 2.3 12 2.61667 12 2.95C12 3.28333 12 3.63333 12 4H4V17.125L5.15 16H20V12C20.3667 12 20.7167 12 21.05 12C21.3833 12 21.7 12 22 12V16C22 16.55 21.8 17.025 21.4 17.425C21.0167 17.8083 20.55 18 20 18H6L2 22ZM18.5 10C18.4 10 18.3333 9.95 18.3 9.85C18.0333 8.83333 17.525 7.95833 16.775 7.225C16.0417 6.475 15.1667 5.96667 14.15 5.7C14.05 5.66667 14 5.6 14 5.5C14 5.38333 14.05 5.31667 14.15 5.3C15.1667 5.03333 16.0417 4.53333 16.775 3.8C17.525 3.05 18.0333 2.16667 18.3 1.15C18.3333 1.05 18.4 0.999999 18.5 0.999999C18.6167 0.999999 18.6833 1.05 18.7 1.15C18.9833 2.16667 19.4917 3.05 20.225 3.8C20.9583 4.53333 21.8333 5.03333 22.85 5.3C22.95 5.31667 23 5.38333 23 5.5C23 5.6 22.95 5.66667 22.85 5.7C21.8333 5.96667 20.95 6.475 20.2 7.225C19.4667 7.95833 18.9667 8.83333 18.7 9.85C18.6833 9.95 18.6167 10 18.5 10ZM4 16V4C4 4.23333 4 4.475 4 4.725C4 4.975 4 5.23333 4 5.5C4 7.31667 4 8.85833 4 10.125C4 11.375 4 12 4 12C4 12 4 11.9917 4 11.975C4 11.9417 4 11.8917 4 11.825V16Z" fill="currentColor" />
    </g>
    <defs>
      <clipPath id="clip0_10362_1740">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const UEManifest = {
  name: "SideNav",
  description: "A dual-tier navigation system where the Rail destinations control the Drawer content via parentId mapping.",
  properties: [
    {
      id: "fabIcon",
      label: "Rail FAB Icon",
      type: "icon",
      default: "super_chat_for_good"
    },
    {
      id: "destinations",
      label: "Navigation Destinations (Rail)",
      type: "list",
      itemSchema: [
        { id: "id", label: "ID", type: "string", placeholder: "Unique ID (e.g. comp)" },
        { id: "icon", label: "Icon Name", type: "icon" },
        { id: "label", label: "Display Label", type: "string" },
        { id: "path", label: "Route Path (e.g. LoginPage)", type: "string" },
        { id: "dividerAbove", label: "Divider Above", type: "boolean" },
        { id: "dockedBottom", label: "Dock at Bottom", type: "boolean" }
      ]
    },
    {
      id: "secondaryHeaderItems",
      label: "Drawer Header Items (Static)",
      type: "list",
      itemSchema: [
        { id: "id", label: "ID", type: "hidden" },
        { id: "parentId", label: "Belongs to Rail ID", type: "string", placeholder: "Matches Rail Destination ID" },
        { id: "headline", label: "Headline", type: "string" },
        { id: "path", label: "Route Path", type: "string" },
        { id: "trailingIcon", label: "Trailing Icon (Optional)", type: "icon" }
      ]
    },
    {
      id: "secondarySections",
      label: "Drawer Accordion Sections",
      type: "accordion-list",
      itemSchema: [
        { id: "title", label: "Section Title", type: "string" },
        { id: "parentId", label: "Belongs to Rail ID", type: "string", placeholder: "Matches Rail Destination ID" },
        {
          id: "items",
          label: "Items",
          type: "list",
          itemSchema: [
            { id: "id", label: "ID", type: "hidden" },
            { id: "headline", label: "Item Headline", type: "string" },
            { id: "path", label: "Route Path", type: "string" }
          ]
        }
      ]
    }
  ]
};

export interface SideNavProps {
  id?: string;
  className?: string;
  fabIcon?: string;
  destinations?: Array<{ id: string; icon: string; label: string; selected?: boolean; path?: string; dividerAbove?: boolean | string; dockedBottom?: boolean | string; }>;
  secondaryHeaderItems?: Array<{ id: string; headline: string; parentId?: string; selected?: boolean; path?: string; trailingIcon?: string }>;
  secondarySections?: Array<{
    id: string;
    title: string;
    parentId?: string;
    isExpanded?: boolean;
    items: Array<{ id: string; headline: string; selected?: boolean; path?: string }>;
  }>;
  onDestinationClick?: (dest: any) => void;
  onItemClick?: (item: any) => void;
  onFabClick?: () => void;
}

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

/**
 * SideNav: A dual-tier overlay navigation system.
 * The drawer starts at the right edge of the rail and overlays content.
 */
export const SideNav: React.FC<SideNavProps> = ({
  id = "ue-side-navigation",
  className,
  fabIcon = "super_chat_for_good",
  destinations = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'new_chat', icon: 'chat_spark', label: 'New chat' },
    { id: 'recent', icon: 'history', label: 'Recent' },
    { id: 'growth', icon: 'local_florist', label: 'Growth', dividerAbove: true },
    { id: 'performance', icon: 'trending_up', label: 'Performance' },
    { id: 'compensation', icon: 'payments', label: 'Compensation' },
    { id: 'benefits', icon: 'favorite', label: 'Benefits' },
    { id: 'hiring', icon: 'work', label: 'Hiring' },
    { id: 'culture', icon: 'groups', label: 'Culture' },
    { id: 'help', icon: 'help', label: 'Help center', dockedBottom: true },
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', dockedBottom: true },
  ],
  secondaryHeaderItems = [],
  secondarySections = [],
  onDestinationClick,
  onItemClick,
  onFabClick
}) => {
  const [activeRailId, setActiveRailId] = useState(destinations.find(d => d.selected)?.id || destinations[0]?.id);
  const [selectedDrawerItemId, setSelectedDrawerItemId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync activeRailId when destinations change
  useEffect(() => {
    const selected = destinations.find(d => d.selected);
    if (selected) {
      setActiveRailId(selected.id);
    }
  }, [destinations]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    secondarySections.reduce((acc, section) => ({
      ...acc,
      [section.id || section.title]: section.isExpanded ?? true
    }), {} as Record<string, boolean>)
  );

  const toggleExpand = (sectionId: string) => {
    setExpanded(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const isTrue = (val: any) => val === true || val === "true";

  const isMatch = (parentId?: string, railId?: string) => {
    if (!parentId) return true;
    if (!railId) return false;
    const p = String(parentId).toLowerCase().trim();
    const r = String(railId).toLowerCase().trim();
    return p === r;
  };

  const handleRailClick = (dest: any) => {
    const isSameDest = activeRailId === dest.id;
    setActiveRailId(dest.id);

    if (onDestinationClick) {
      onDestinationClick(dest);
    }

    if (!isSameDest) {
      setSelectedDrawerItemId(null);
    }

    const hasContent = secondaryHeaderItems.some(h => h.parentId && isMatch(h.parentId, dest.id)) ||
      secondarySections.some(s => s.parentId && isMatch(s.parentId, dest.id));

    if (hasContent) {
      if (isSameDest) {
        setIsDrawerOpen(!isDrawerOpen);
      } else {
        setIsDrawerOpen(true);
      }
    } else {
      setIsDrawerOpen(false);
      if (dest.path) {
        window.location.hash = `#/${dest.path}`;
      }
    }
  };

  const handleNavigation = (path?: string, itemId?: string, item?: any) => {
    if (itemId) {
      setSelectedDrawerItemId(itemId);
    }
    if (onItemClick && item) {
      onItemClick(item);
    }
    if (path) {
      window.location.hash = `#/${path}`;
      setIsDrawerOpen(false);
    }
  };

  const filteredHeaders = useMemo(() =>
    secondaryHeaderItems.filter(item => isMatch(item.parentId, activeRailId)),
    [secondaryHeaderItems, activeRailId]);

  const filteredSections = useMemo(() =>
    secondarySections.filter(section => isMatch(section.parentId, activeRailId)),
    [secondarySections, activeRailId]);


  return (
    <div
      id={`${id}-combo`}
      className={cn(
        "flex flex-row shrink-0 bg-transparent z-40 relative",
        className
      )}
    >
      <style>{`
        .ue-rail-item .label,
        .ue-rail-item span:not(.material-symbols-outlined) {
          font-size: 12px !important;
        }
      `}</style>
      {/* Rail Container Anchor */}
      <div
        id={`${id}-rail-anchor`}
        className="relative z-50 flex shrink-0 h-full"
      >
        <NavigationRail
          id={`${id}-rail`}
          className="w-[96px] min-w-[96px] max-w-[96px] z-50 flex flex-col shrink-0 !bg-[#F8FAFD]"
          header={
            <div id={`${id}-rail-header`} className="flex flex-col items-center pt-2 pb-4 shrink-0">
              <FloatingActionButton
                id={`${id}-fab`}
                icon={<SuperChatIcon />}
                variant="primary"
                onClick={onFabClick}
                className="!w-[56px] !h-[56px] !rounded-[16px] shadow-elevation-1 !bg-[#D3E3FD] !text-[#0842A0]"
              />
            </div>
          }
        >
          <div id={`${id}-rail-container`} className="flex flex-col items-center justify-between w-full h-full pb-6">
            <div id="Navigation-Rail-Inner" className="w-full flex flex-col gap-1">
              <div id="Destinations" className="flex flex-col items-center gap-1">
                {destinations.filter(d => !isTrue(d.dockedBottom)).map((dest) => (
                  <React.Fragment key={dest.id}>
                    {isTrue(dest.dividerAbove) && (
                      <div id={`${id}-rail-divider-${dest.id}`} className="w-full flex justify-center py-2">
                        <Divider className="!w-[64px] !bg-[#C4C7C5]" />
                      </div>
                    )}
                    <NavigationRailItem
                      id={dest.id}
                      icon={
                        dest.id === 'new_chat' ? <ChatSparkIcon /> :
                        <span className="material-symbols-outlined !text-[24px]">{dest.icon}</span>
                      }
                      label={dest.label}
                      selected={dest.id === activeRailId}
                      onClick={() => handleRailClick(dest)}
                      alwaysShowLabel={true}
                      className="h-[64px] !w-full ue-rail-item"
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div id="Bottom-Destinations" className="w-full flex flex-col items-center gap-1 shrink-0 pt-2">
              {destinations.filter(d => isTrue(d.dockedBottom)).map((dest) => (
                <React.Fragment key={dest.id}>
                  {isTrue(dest.dividerAbove) && (
                    <div id={`${id}-rail-divider-${dest.id}`} className="w-full flex justify-center py-2">
                      <Divider className="!w-[64px] !bg-[#C4C7C5]" />
                    </div>
                  )}
                  <NavigationRailItem
                    id={dest.id}
                    icon={<span className="material-symbols-outlined !text-[24px]">{dest.icon}</span>}
                    label={dest.label}
                    selected={dest.id === activeRailId}
                    onClick={() => handleRailClick(dest)}
                    alwaysShowLabel={true}
                    className="h-[64px] !w-full ue-rail-item"
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </NavigationRail>

        {/* Secondary Drawer Overlay */}
        <div
          id={`${id}-secondary`}
          className={cn(
            "absolute left-[96px] top-0 bottom-0 bg-[#F8FAFD] z-30 overflow-hidden shrink-0 border-r border-outline-variant/10 shadow-elevation-2 transition-[width,opacity] duration-300 ease-standard",
            isDrawerOpen
              ? "w-[256px] opacity-100 pointer-events-auto"
              : "w-0 opacity-0 pointer-events-none"
          )}
        >
          {/* 4. Content Wrapper: Keep this fixed width so content doesn't "squish" during animation */}
          <div className="w-[256px] h-full p-2 pt-4 flex flex-col gap-1 overflow-y-auto scroll-thin">
            {filteredHeaders.map(item => (
              <ListItem
                key={item.id}
                id={item.id}
                headline={<span className="label-large font-medium">{item.headline}</span>}
                variant="nav-desktop"
                selected={item.id === selectedDrawerItemId}
                className="px-4 !rounded-full !h-14 pointer-events-auto !bg-transparent"
                onClick={() => handleNavigation(item.path, item.id, item)}
              />
            ))}

            {filteredSections.map((section) => {
              const sectionId = section.id || section.title;
              return (
                <div key={sectionId} id={sectionId} className="flex flex-col">
                  <div className="px-4 py-2">
                    <Divider id={`${sectionId}-divider`} indent={16} />
                  </div>
                  <ExpansionPanel
                    id={`${sectionId}-panel`}
                    title={<span className="body-large font-medium text-on-surface-variant">{section.title}</span>}
                    headerVariant="floating"
                    isExpanded={expanded[sectionId]}
                    onToggleExpand={() => toggleExpand(sectionId)}
                    className="!border-none !bg-transparent pointer-events-auto"
                  >
                    <div id={`${sectionId}-content`} className="flex flex-col gap-1 pt-1 !bg-transparent">
                      {section.items.map(item => (
                        <ListItem
                          key={item.id}
                          id={item.id}
                          headline={<span className="label-large font-medium">{item.headline}</span>}
                          variant="nav-desktop"
                          selected={item.id === selectedDrawerItemId}
                          className="px-4 !rounded-full !h-14 pointer-events-auto !bg-transparent"
                          onClick={() => handleNavigation(item.path, item.id, item)}
                        />
                      ))}
                    </div>
                  </ExpansionPanel>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
