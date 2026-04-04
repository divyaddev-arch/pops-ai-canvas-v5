import React, { useState } from "react";
import { Card, IconButton, Icon, Tab, TabRow, Button, ExposedDropdownMenu, MenuItem } from "@my-google-project/gm3-react-components";

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isUnread?: boolean;
  actions?: NotificationAction[];
  icon?: string;
  section?: string; // e.g. "Today", "Yesterday"
}

export interface NotificationSheetProps {
  notifications?: NotificationItem[];
  className?: string;
  onClose?: () => void;
  onSettingsClick?: () => void;
  closeOnOutsideClick?: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Subject or title of the notification",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum mollis nunc a...",
    timestamp: "2h ago • New task",
    isUnread: true,
    section: "Today",
    actions: [
      { label: "Action 1", onClick: () => console.log("Action 1 clicked") },
      { label: "Action 2", onClick: () => console.log("Action 2 clicked") },
    ],
  },
  {
    id: "2",
    title: "Subject or title of the notification",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum mollis nunc a...",
    timestamp: "18h ago • Update",
    isUnread: true,
    section: "Yesterday",
    actions: [
      { label: "Action 1", onClick: () => console.log("Action 1 clicked") },
      { label: "Action 2", onClick: () => console.log("Action 2 clicked") },
    ],
  },
  {
    id: "3",
    title: "Subject or title of the notification",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum mollis nunc a...",
    timestamp: "Jul 9 • New comment",
    isUnread: false,
    section: "Yesterday", // Grouping with previous for demo purposes or could be separate
    actions: [
      { label: "Action 1", onClick: () => console.log("Action 1 clicked") },
      { label: "Action 2", onClick: () => console.log("Action 2 clicked") },
    ],
  },
];

export const NotificationSheet: React.FC<NotificationSheetProps> = ({
  notifications = DEFAULT_NOTIFICATIONS,
  className = "",
  onClose,
  onSettingsClick,
  closeOnOutsideClick = false,
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [view, setView] = useState("All notifications");
  const sheetRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!closeOnOutsideClick || !onClose) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeOnOutsideClick, onClose]);

  const filter = selectedTabIndex === 0 ? "All" : "Unread";

  const filteredNotifications = notifications.filter((n) =>
    filter === "Unread" ? n.isUnread : true,
  );

  // Group notifications by section
  const groupedNotifications = filteredNotifications.reduce(
    (acc, curr) => {
      const section = curr.section || "Older";
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(curr);
      return acc;
    },
    {} as Record<string, NotificationItem[]>,
  );

  const sections = Object.keys(groupedNotifications);

  return (
    <Card
      ref={sheetRef}
      variant="elevated"
      className={`w-[320px] h-[600px] flex flex-col overflow-hidden bg-surface text-on-surface ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 gap-2">
        <div className="flex-1 max-w-[200px]">
          <ExposedDropdownMenu
            value={view}
            onValueChange={setView}
            label=""
            noLabel
            variant="filled-minimal"
            containerClassName="!h-[40px] bg-transparent"
            inputClassName="!py-2 !text-title-medium !font-medium !cursor-pointer"
          >
            <MenuItem headline="All notifications" />
            <MenuItem headline="Archived" />
          </ExposedDropdownMenu>
        </div>
        <div className="flex items-center gap-0 text-on-surface-variant">
          <IconButton onClick={onSettingsClick}>
            <Icon>filter_list</Icon>
          </IconButton>
          <IconButton onClick={onSettingsClick}>
            <Icon>more_vert</Icon>
          </IconButton>
        </div>
      </div>

      {/* Filter Tabs */}
      <TabRow
        selectedTabIndex={selectedTabIndex}
        onTabChange={setSelectedTabIndex}
        className="border-b border-outline-variant"
      >
        <Tab label="All" className="flex-none min-w-0 w-auto px-4" />
        <Tab label="Unread" className="flex-none min-w-0 w-auto px-4" />
      </TabRow>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto mt-2">
        {sections.map((section) => (
          <div key={section} className="mb-2">
            <div className="pl-10 pr-4 py-2 label-medium text-on-surface-variant">
              {section}
            </div>
            {groupedNotifications[section].map((item) => (
              <div
                key={item.id}
                className={`relative group hover:bg-on-surface/5 transition-colors ${
                  item.isUnread ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex px-4 py-3 gap-3">
                  {/* Unread Indicator Column */}
                  <div className="pt-1.5 shrink-0 w-3 flex justify-center">
                    {item.isUnread && (
                      <div className="w-2 h-2 rounded-full bg-error" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col gap-0.5">
                    {/* Timestamp & Meta */}
                    <div className="body-small text-on-surface-variant">
                      {item.timestamp}
                    </div>

                    {/* Title */}
                    <div className="title-medium text-on-surface leading-snug">
                      {item.title}
                    </div>

                    {/* Description */}
                    <div className="body-medium text-on-surface-variant line-clamp-3 mt-0.5">
                      {item.description}
                    </div>

                    {/* Actions */}
                    {item.actions && item.actions.length > 0 && (
                      <div className="flex gap-2 mt-2 -ml-2">
                        {item.actions.map((action, idx) => (
                          <Button
                            key={idx}
                            variant="text"
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick();
                            }}
                            className="!h-[32px] !px-2"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant p-8 text-center">
            <Icon className="text-4xl mb-2 opacity-50">notifications_off</Icon>
            <p>No notifications</p>
          </div>
        )}
      </div>
    </Card>
  );
};
