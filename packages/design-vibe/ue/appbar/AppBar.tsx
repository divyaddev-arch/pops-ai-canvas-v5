import React, { useState, useRef } from "react";
import { Icon, IconButton, Badge, Menu, MenuItem, Switch, Tooltip, useTheme } from "@my-google-project/gm3-react-components";

interface AppBarProps {
  productName: string;
  logoSrc?: string;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  className?: string;
  variant?: "default" | "contextual";
  onBackClick?: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({
  productName,
  logoSrc = "/icon.png",
  onMenuClick,
  onNotificationClick,
  className = "",
  variant = "default",
  onBackClick,
}) => {
  const { mode, setMode, availableThemes, themeKey, setThemeKey } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const settingsRef = useRef<HTMLButtonElement>(null);

  return (
    <header
      className={`flex items-center justify-between px-4 h-16 bg-transparent text-on-surface ${className}`}
    >
      <div className="flex items-center gap-2">
        {variant === "contextual" ? (
          <IconButton onClick={onBackClick}>
            <Icon>arrow_back</Icon>
          </IconButton>
        ) : (
          <img
            src={logoSrc}
            alt={`${productName} logo`}
            className="h-8 w-8 object-contain"
          />
        )}
        <span className="title-large text-on-surface pt-1">{productName}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-on-surface-variant">
          <div className="relative inline-flex">
            <IconButton onClick={onNotificationClick}>
              <Icon>notifications</Icon>
            </IconButton>
            <Badge
              className="absolute top-1 right-1 z-10 pointer-events-none"
              style={{ transform: "translate(25%, -25%) scale(0.8)" }}
            >
              3
            </Badge>
          </div>
          <IconButton>
            <Icon>help</Icon>
          </IconButton>
          <div className="relative">
            <IconButton
              ref={settingsRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className={menuOpen ? "bg-state-layer-on-surface-variant" : ""}
            >
              <Icon>settings</Icon>
            </IconButton>
            <Menu
              anchorEl={settingsRef.current}
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              className="min-w-[260px]"
            >
              <MenuItem
                headline="Dark theme"
                leadingIcon={<Icon>dark_mode</Icon>}
                trailingIcon={
                  <Switch
                    checked={mode === "dark"}
                    onCheckedChange={(checked) =>
                      setMode(checked ? "dark" : "light")
                    }
                    compact
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                onClick={() => setMode(mode === "dark" ? "light" : "dark")}
              />

              <div className="my-1 border-t border-outline-variant/30" />

              <div className="px-3 py-2 flex flex-col gap-2">
                <span className="label-medium text-on-surface-variant px-1">
                  Theme
                </span>
                <div className="flex gap-2 flex-wrap">
                  {availableThemes.map((t) => (
                    <Tooltip
                      key={t.key}
                      content={t.displayName}
                      className="z-[100]"
                    >
                      <button
                        onClick={() => setThemeKey(t.key)}
                        className={`
                            w-8 h-8 rounded-full transition-all border-2 flex items-center justify-center
                            ${
                              themeKey === t.key
                                ? "border-primary scale-110"
                                : "border-transparent hover:scale-110"
                            }
                          `}
                        style={{
                          backgroundColor: t[mode]["--color-primary"],
                        }}
                        aria-label={t.displayName}
                      >
                        {themeKey === t.key && (
                          <Icon className="text-white text-[16px] drop-shadow-md">
                            check
                          </Icon>
                        )}
                      </button>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </Menu>
          </div>
        </div>
        <div className="pl-2">
          <button className="h-8 w-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-label-large font-medium hover:opacity-80 transition-opacity">
            A
          </button>
        </div>
      </div>
    </header>
  );
};
