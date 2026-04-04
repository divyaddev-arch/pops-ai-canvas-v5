import React, { ReactNode } from "react";
import { Button, Icon } from "@my-google-project/gm3-react-components";

export interface AiPillProps {
  label: string;
  icon: ReactNode | string;
  onClick?: () => void;
}

export const AiPill: React.FC<AiPillProps> = ({ label, icon, onClick }) => {
  // Wrap string emoji in span to ensure it behaves like an icon
  const renderedIcon =
    typeof icon === "string" ? (
      <span className="text-[18px] leading-none flex items-center justify-center w-5 h-5 overflow-hidden font-emoji">
        {icon}
      </span>
    ) : (
      // For component icons, we rely on Button to size them, but let's ensure they don't exceed expectations
      // The Button component clones and adds size classes.
      icon
    );

  return (
    <Button
      variant="text"
      size="xsmall" // 32px height, close to 36px. Or use custom class to force 36px?
      // User requested height of 36px. xsmall is 32px, small is 40px.
      // I will use `small` and override height or use `xsmall` and override?
      // Button component allows className override.
      // Let's use `variant="elevated"` (white bg, shadow-1)
      onClick={onClick}
      className="h-[36px] bg-surface shadow-none hover:shadow-none focus:shadow-none active:shadow-none border border-outline-variant pl-2 pr-4 gap-2 rounded-full !text-on-surface"
      icon={renderedIcon}
    >
      <span className="label-large text-on-surface font-google-sans whitespace-nowrap group-hover:text-primary transition-colors">
        {label}
      </span>
    </Button>
  );
};
