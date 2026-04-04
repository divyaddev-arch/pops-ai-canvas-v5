import React from "react";
import { Card, Button, Icon, IconButton } from "@my-google-project/gm3-react-components";

interface HeroCardProps {
  title: string;
  description?: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  title,
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  buttonLabel,
  onButtonClick,
  onMenuClick,
  className = "",
}) => {
  return (
    <Card
      variant="filled"
      className={`relative w-full max-w-[400px] !p-0 overflow-hidden !bg-surface-container-lowest ${className}`}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header Label */}
        <div className="mb-3">
          <span className="body-medium text-on-surface-variant">
            Recommendation
          </span>
        </div>

        {/* Title */}
        <h2 className="title-large text-on-surface mb-6">{title}</h2>

        {/* Description Placeholder (Skeleton-like if empty logs or just text) - User asked for Lorem Ipsum text */}
        <div className="mb-8">
          <p className="body-medium text-on-surface-variant line-clamp-4">
            {description}
          </p>
        </div>

        <div className="flex-grow" />

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-auto">
          <IconButton onClick={onMenuClick}>
            <Icon>more_vert</Icon>
          </IconButton>

          <Button
            variant="filled"
            onClick={onButtonClick}
            className="rounded-full"
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
};
