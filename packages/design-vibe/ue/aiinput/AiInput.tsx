import React, { useState, useRef, useEffect } from "react";
import { Icon, IconButton, Button } from "@my-google-project/gm3-react-components";

export interface AiInputProps {
  placeholder?: string;
  onSend?: (value: string) => void;
  onToolsClick?: () => void;
  onAddClick?: () => void;
  className?: string;
}

export const AiInput: React.FC<AiInputProps> = ({
  placeholder = "Ask My Google AI",
  onSend,
  onToolsClick,
  onAddClick,
  className,
}) => {
  const [value, setValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 160; // Max height in pixels
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      textareaRef.current.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend?.(value);
      setValue("");
    }
  };

  return (
    <div
      className={`bg-surface rounded-[28px] border border-outline-variant shadow-sm p-4 w-full flex flex-col gap-4 relative transition-shadow hover:shadow-md focus-within:shadow-md ${
        className || ""
      }`}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none resize-none body-large text-on-surface placeholder:text-on-surface-variant/50 min-h-[56px] py-2"
        rows={1}
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <IconButton
            onClick={onAddClick}
            aria-label="Add attachment"
            className="text-on-surface-variant hover:text-on-surface"
          >
            <Icon>add</Icon>
          </IconButton>
          <Button
            variant="text"
            onClick={onToolsClick}
            icon={<Icon>tune</Icon>}
            className="!text-on-surface-variant hover:!text-on-surface pl-2 pr-4"
          >
            Tools
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {isRecording && (
            <div className="flex items-center gap-1 px-2">
              <div className="w-1 h-2 bg-primary animate-pulse" />
              <div
                className="w-1 h-3 bg-primary animate-pulse"
                style={{ animationDelay: "100ms" }}
              />
              <div
                className="w-1 h-2 bg-primary animate-pulse"
                style={{ animationDelay: "200ms" }}
              />
            </div>
          )}
          <IconButton
            onClick={() => {
              if (value.trim()) {
                onSend?.(value);
                setValue("");
                setIsRecording(false);
              } else {
                setIsRecording(!isRecording);
                if (!isRecording) {
                  console.log("Started recording");
                } else {
                  console.log("Stopped recording");
                }
              }
            }}
            aria-label={
              value.trim()
                ? "Send"
                : isRecording
                  ? "Stop Recording"
                  : "Use Microphone"
            }
            className={
              value.trim()
                ? "text-on-surface-variant hover:text-on-surface"
                : isRecording
                  ? "text-error hover:text-error/80 bg-error/10 hover:bg-error/20"
                  : "text-on-surface-variant hover:text-on-surface"
            }
          >
            <Icon>
              {value.trim() ? "send" : isRecording ? "stop_circle" : "mic"}
            </Icon>
          </IconButton>
        </div>
      </div>
    </div>
  );
};
