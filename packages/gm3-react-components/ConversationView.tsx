import React, { useRef, useEffect } from 'react';
import { Response } from './Response.tsx';
import { Prompt } from './Prompt.tsx';
import { IconButton } from './IconButton.tsx';
import { Icon } from './Icons.tsx';
import { Tooltip } from './Tooltip.tsx';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- Types ---
// In a real app, this would likely be in a shared types file.
interface Attachment {
    id: number;
    file: File;
    previewUrl?: string; // for images or video src
    posterUrl?: string; // for video poster
}

// --- ConversationView ---
export interface ConversationMessage {
    id: string;
    role: 'user' | 'model' | 'assistant';
    text?: string;
    content?: string;
    attachments?: Attachment[];
    isLoading?: boolean;
    actions?: { label: string; value: string; variant: 'primary' | 'secondary' }[];
    footer?: string;
    changeSummary?: any[][]; // using any[][] to avoid importing ChangePart for now, or I can import it.
    summaryTitle?: string;
}

export interface ConversationViewProps {
    messages: ConversationMessage[];
    variant?: 'standard' | 'contained';
    elevation?: 'default' | 'prominent' | 'none';
    className?: string;
    onClose?: () => void;
    onActionClick?: (value: string) => void;
    onUndo?: () => void;
    onNodeClick?: (id: string) => void;
    onShowDiff?: () => void;
    onClear?: () => void;
    hideResponseActions?: boolean;
}

export const ConversationView = ({
    messages,
    variant = 'standard',
    elevation = 'default',
    className,
    onClose,
    onActionClick,
    onUndo,
    onNodeClick,
    onShowDiff,
    onClear,
    hideResponseActions = false
}: ConversationViewProps) => {
    const isContained = variant === 'contained';
    const hasElevation = elevation !== 'none';
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const lastMessageCount = useRef(messages.length);
    const pendingScrollId = useRef<string | null>(null);

    const scrollToMessage = (messageId: string, behavior: ScrollBehavior = 'smooth') => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const messageElement = container.querySelector(`[data-message-id="${messageId}"]`) as HTMLElement;

        if (messageElement) {
            const isMeasurable = messageElement.offsetTop > 0 || messages.findIndex(m => m.id === messageId) === 0;

            if (isMeasurable) {
                container.scrollTo({
                    top: messageElement.offsetTop - 48,
                    behavior
                });
                pendingScrollId.current = null;
            }
        }
    };

    useEffect(() => {
        if (isContained && messages.length > lastMessageCount.current) {
            const latestMessage = messages[messages.length - 1];
            const userMessages = messages.filter(m => m.role === 'user');
            const latestUserMessage = userMessages[userMessages.length - 1];

            // Priority 1: If the latest message is a change summary, scroll to it
            if (latestMessage?.changeSummary) {
                pendingScrollId.current = latestMessage.id;
                scrollToMessage(latestMessage.id, 'smooth');
            }
            // Priority 2: Otherwise, scroll to the latest user message (if any)
            else if (latestUserMessage) {
                pendingScrollId.current = latestUserMessage.id;
                scrollToMessage(latestUserMessage.id, 'smooth');
            }

            // Backup for DOM completion/layout settle
            if (pendingScrollId.current) {
                const id = pendingScrollId.current;
                setTimeout(() => scrollToMessage(id, 'smooth'), 150);
            }
        }
        lastMessageCount.current = messages.length;
    }, [messages, isContained]);

    useEffect(() => {
        if (!isContained || !scrollContainerRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            if (pendingScrollId.current) {
                // Smooth scroll even during resize to ensure it feels animated as it appears
                scrollToMessage(pendingScrollId.current, 'smooth');
            }
        });

        resizeObserver.observe(scrollContainerRef.current);
        return () => resizeObserver.disconnect();
    }, [isContained]);

    return (
        <div className={cn(
            "flex flex-col relative",
            isContained ? "rounded-t-extra-large-increased rounded-b-extra-small overflow-hidden" : "space-y-8",
            className
        )}>
            {isContained && (
                <>
                    {/* Background layers: Blur then Color Overlay */}
                    <div
                        className="absolute inset-0 z-0 backdrop-blur-[8px] rounded-t-extra-large-increased rounded-b-extra-small"
                        aria-hidden="true"
                    />
                    <div
                        className="absolute inset-0 z-0 bg-surface-bright opacity-70 rounded-t-extra-large-increased rounded-b-extra-small"
                        aria-hidden="true"
                    />

                    {/* Elevation Shadow Layer (placed on container to avoid blur issues) */}
                    <div
                        className={cn(
                            "absolute inset-0 -z-10 rounded-t-extra-large-increased rounded-b-extra-small",
                            hasElevation && (elevation === 'prominent' ? "shadow-elevation-gemini-prominent" : "shadow-elevation-gemini")
                        )}
                        aria-hidden="true"
                    />
                </>
            )}
            {isContained && (
                <div className="absolute top-0 left-0 right-0 h-[48px] px-3 flex items-center justify-end z-30 pointer-events-none gap-2">
                    <div className="absolute inset-0 bg-gradient-to-b from-surface-bright from-[9px] to-transparent opacity-70 -z-10 rounded-t-extra-large-increased" aria-hidden="true" />
                    <Tooltip content="Reset conversation">
                        <IconButton
                            size="xsmall"
                            variant="standard"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log("ConversationView: onClear clicked, onClear prop exists:", !!onClear);
                                onClear?.();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            aria-label="Reset conversation"
                            className="!text-on-surface-variant bg-surface-bright/80 rounded-full pointer-events-auto shadow-sm"
                        >
                            <Icon>refresh</Icon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip content="Hide conversation">
                        <IconButton
                            size="xsmall"
                            variant="standard"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose?.();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            aria-label="Hide conversation"
                            className="!text-on-surface-variant bg-surface-bright/80 rounded-full pointer-events-auto shadow-sm"
                        >
                            <Icon>close</Icon>
                        </IconButton>
                    </Tooltip>
                </div>
            )}

            <div
                ref={scrollContainerRef}
                className={cn(
                    "flex flex-col overflow-y-auto scroll-thin relative z-20",
                    isContained ? "max-h-[300px] px-4 pb-4 pt-12 gap-8" : "space-y-8"
                )}
            >
                {messages.map((message) => (
                    <div key={message.id} data-message-id={message.id}>
                        {message.role === 'user' ? (
                            <Prompt text={message.content || message.text} attachments={message.attachments} />
                        ) : (
                            <Response
                                text={message.content || message.text}
                                isLoading={!!message.isLoading}
                                attachments={message.attachments}
                                showIcon={!isContained}
                                onShowDiff={onShowDiff}
                                summaryTitle={message.summaryTitle}
                                hideActions={hideResponseActions}
                            />
                        )}
                    </div>
                ))}
                {isContained && <div className="h-[240px] shrink-0 pointer-events-none" />}
            </div>
        </div>
    );
};
