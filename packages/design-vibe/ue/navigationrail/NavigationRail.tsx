import React, { useState, useRef, useEffect } from "react";
import { NavigationRail as Gm3NavigationRail, NavigationRailItem, IconButton, Icon } from "@my-google-project/gm3-react-components";

export interface NavItemData {
  id: string;
  label: string;
  icon: string;
  flyoutContent?: React.ReactNode;
}

export interface NavigationRailProps {
  items?: NavItemData[];
  topItems?: NavItemData[];
  className?: string;
}

// --- Helper Components ---

export const ExpansionItem = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between py-3 px-4 hover:bg-on-surface-variant/10 rounded-lg cursor-pointer transition-colors group">
    <span className="body-medium group-hover:text-primary transition-colors">
      {title}
    </span>
    <Icon className="text-on-surface-variant group-hover:text-primary transition-colors">
      chevron_right
    </Icon>
  </div>
);

export const FlyoutSection = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <div>
    <h2 className="headline-small-emphasized mb-4">{title}</h2>
    <div className="space-y-1">
      {items.map((item, idx) => (
        <ExpansionItem key={idx} title={item} />
      ))}
    </div>
  </div>
);

// --- Default Data ---

const DEFAULT_TOP_ITEMS: NavItemData[] = [
  {
    id: "new-chat",
    label: "New chat",
    icon: "edit_square",
    flyoutContent: (
      <div className="flex flex-col gap-4">
        <h2 className="headline-small-emphasized">Start new...</h2>
        <button className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-highest hover:bg-primary-container hover:text-on-primary-container transition-colors text-left">
          <Icon>chat_bubble</Icon>
          <div className="flex flex-col">
            <span className="title-small">General Chat</span>
            <span className="body-small opacity-80">Ask anything</span>
          </div>
        </button>
        <button className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-highest hover:bg-primary-container hover:text-on-primary-container transition-colors text-left">
          <Icon>code</Icon>
          <div className="flex flex-col">
            <span className="title-small">Code Assistant</span>
            <span className="body-small opacity-80">Debug & Generate</span>
          </div>
        </button>
      </div>
    ),
  },
  {
    id: "recent",
    label: "Recent",
    icon: "history",
    flyoutContent: (
      <FlyoutSection
        title="Recent Activity"
        items={[
          'Project "Vibe" Update',
          "React Component Debug",
          "Meeting Notes: Q1",
          "Email Draft: Team",
        ]}
      />
    ),
  },
];

const DEFAULT_MAIN_ITEMS: NavItemData[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "account_circle",
    flyoutContent: (
      <FlyoutSection
        title="Dashboard"
        items={["Overview", "Analytics", "My Reports", "System Status"]}
      />
    ),
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: "check_circle",
    flyoutContent: (
      <FlyoutSection
        title="My Tasks"
        items={["Pending Review (3)", "Due Today (1)", "Backlog", "Completed"]}
      />
    ),
  },
  {
    id: "career",
    label: "Career",
    icon: "eco",
    flyoutContent: (
      <FlyoutSection
        title="Career Growth"
        items={["Goals 2026", "Skills Assessment", "Learning Path", "Feedback"]}
      />
    ),
  },
  {
    id: "recognition",
    label: "Recognition",
    icon: "emoji_events",
    flyoutContent: (
      <FlyoutSection
        title="Recognition"
        items={["Give Kudos", "My Badges", "Leaderboard", "History"]}
      />
    ),
  },
  {
    id: "culture",
    label: "Culture",
    icon: "diversity_3",
    flyoutContent: (
      <FlyoutSection
        title="Team Culture"
        items={["Events", "Photos", "Values", "Clubs"]}
      />
    ),
  },
  {
    id: "help-center",
    label: "Help center",
    icon: "help_center",
    flyoutContent: (
      <div>
        <h2 className="headline-small-emphasized mb-4">Get support</h2>
        <p className="body-large mb-6 text-on-surface-variant">Requests</p>
        <div className="space-y-1">
          <ExpansionItem title="Help articles" />
          <ExpansionItem title="Performance" />
          <ExpansionItem title="Benefits" />
          <ExpansionItem title="Compensation" />
          <ExpansionItem title="Hiring" />
          <ExpansionItem title="Workplace" />
          <ExpansionItem title="Wellbeing" />
          <ExpansionItem title="Employment info" />
          <div className="py-3 px-4 text-on-surface-variant mt-2 font-medium">
            Managers
          </div>
        </div>
      </div>
    ),
  },
];

export const NavigationRail: React.FC<NavigationRailProps> = ({
  items = DEFAULT_MAIN_ITEMS,
  topItems = DEFAULT_TOP_ITEMS,
  className,
}) => {
  // Default to first item if available, or 'help-center' as fallback logic if desired
  // Ensure we have items to select from if items is empty (though default covers this, explicit passing might be empty array)
  // If explicitly passed empty array, we respect it.
  const activeItems = items.length > 0 ? items : [];

  const [activeId, setActiveId] = useState<string>(activeItems[0]?.id || "");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleMouseEnter = (id: string) => {
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  const activeFlyoutContent = [...(topItems || []), ...items].find(
    (item) => item.id === hoveredId,
  )?.flyoutContent;
  const showFlyout = !!activeFlyoutContent;

  return (
    <div
      className={`flex h-full relative ${className || ""}`}
      onMouseLeave={handleMouseLeave}
    >
      <Gm3NavigationRail className="z-20 !bg-transparent h-full">
        <div className="w-full flex justify-center mb-10">
          <IconButton className="text-on-surface-variant">
            <Icon>menu</Icon>
          </IconButton>
        </div>

        {/* Top section */}
        {topItems && topItems.length > 0 && (
          <div className="flex flex-col gap-2 w-full mt-4 border-b border-outline-variant/50 pb-2">
            {topItems.map((item) => (
              <NavigationRailItem
                key={item.id}
                icon={<Icon>{item.icon}</Icon>}
                label={item.label}
                selected={activeId === item.id}
                onClick={() => setActiveId(item.id)}
                onMouseEnter={() => handleMouseEnter(item.id)}
                alwaysShowLabel
              />
            ))}
          </div>
        )}

        {/* Main section */}
        <div className="flex flex-col gap-2 w-full mt-2">
          {items.map((item) => (
            <NavigationRailItem
              key={item.id}
              icon={<Icon>{item.icon}</Icon>}
              label={item.label}
              selected={activeId === item.id}
              onClick={() => setActiveId(item.id)}
              onMouseEnter={() => handleMouseEnter(item.id)}
              alwaysShowLabel
            />
          ))}
        </div>
      </Gm3NavigationRail>

      {/* Flyout Panel */}
      {showFlyout && (
        <div
          className="absolute left-[80px] top-[22px] h-[calc(100%-44px)] w-[300px] bg-surface-container-high border border-outline-variant shadow-lg z-10 overflow-hidden animate-slide-in-right rounded-2xl"
          // Keep open when hovering panel if needed, though strictly it should be hover over item
          // But usually flyouts aim to stay open if mouse moves to them.
          // Implementation: If we want it to stay open when hovering the panel, we need to know we are hovering the panel.
          onMouseEnter={() => setHoveredId(hoveredId)}
        >
          <div className="p-4 h-full overflow-y-auto scroll-thin">
            {activeFlyoutContent}
          </div>
        </div>
      )}

      <style>{`
                @keyframes slide-in-right {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.2s ease-out forwards;
                }
            `}</style>
    </div>
  );
};
