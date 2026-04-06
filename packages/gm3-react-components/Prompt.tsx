import React, { useState, useRef, useLayoutEffect } from 'react';
import { Icon } from './Icons.tsx';
import { IconButton } from './IconButton.tsx';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// In a real app, these would be in a shared types/utils file.
interface Attachment {
    id: number;
    file: File;
    previewUrl?: string;
    posterUrl?: string; // for video poster
}

const getFileTypeLabel = (file: File) => {
    const type = file.type;
    if (type === 'application/pdf') return 'PDF';
    const extension = file.name.split('.').pop()?.toUpperCase();
    return extension || 'File';
}

const getFileIcon = (file: File) => {
    const type = file.type;
    if (type === 'application/pdf') return 'picture_as_pdf';
    return 'draft';
}

export interface PromptProps {
    text?: string;
    attachments?: Attachment[];
}

export const Prompt: React.FC<PromptProps> = ({ text = '', attachments }) => {
    const textRef = useRef<HTMLParagraphElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useLayoutEffect(() => {
        const checkOverflow = () => {
            const element = textRef.current;
            if (element) {
                // To reliably check for overflow, we compare the scrollHeight
                // with the calculated height for 3 lines of text.
                const computedStyle = getComputedStyle(element);
                const lineHeight = parseFloat(computedStyle.lineHeight);
                // A small buffer is added to account for floating point inaccuracies.
                const threeLinesHeight = lineHeight * 3;
                const canBeTruncated = element.scrollHeight > threeLinesHeight + 2;
                setIsOverflowing(canBeTruncated);
            }
        };

        // Run check after initial render and on window resize.
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [text]);

    if (!text?.trim() && (!attachments || attachments.length === 0)) {
        return null;
    }

    return (
        <div className="group relative flex justify-end items-start gap-1 w-full">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <IconButton
                    size="xsmall"
                    variant="standard"
                    aria-label="Edit prompt"
                    className="!w-10 !h-10 !bg-on-surface-8 !text-on-surface-variant"
                >
                    <Icon>edit</Icon>
                </IconButton>
            </div>
            <div className="flex flex-col items-end max-w-[calc(100%-44px)] sm:max-w-[calc(80%-44px)] gap-[7px]">
                {attachments && attachments.length > 0 && (
                    <div className="flex justify-end items-start gap-[9px] flex-wrap self-end">
                        {attachments.map(att => (
                            att.previewUrl ? (
                                <img key={att.id} src={att.previewUrl} alt={att.file.name} className="h-24 w-24 object-cover rounded-2xl" />
                            ) : (
                                 <div key={att.id} className="bg-surface-container rounded-2xl p-4 flex flex-col justify-between h-24 max-w-[200px] w-fit">
                                    <span className="body-medium text-on-surface truncate" title={att.file.name}>{att.file.name}</span>
                                    <div className="flex items-center gap-2">
                                        <Icon className="text-xl text-on-surface-variant">{getFileIcon(att.file)}</Icon>
                                        <span className="body-medium text-on-surface-variant">{getFileTypeLabel(att.file)}</span>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
                
                {text?.trim() && (
                    <div className="relative bg-surface-container text-on-surface py-4 px-4 rounded-tl-[24px] rounded-bl-[24px] rounded-br-[24px] rounded-tr-[4px] self-end w-fit">
                        <p
                            ref={textRef}
                            className={cn(
                                'body-large whitespace-pre-wrap break-words leading-[28px]',
                                isOverflowing && !isExpanded && 'line-clamp-3',
                                isOverflowing && 'pr-12' // padding-right to avoid overlap with button
                            )}
                        >
                            {text}
                        </p>
                        {isOverflowing && (
                            <div className="absolute top-[12px] right-[16px]">
                                <IconButton
                                    size="small"
                                    variant="standard"
                                    onClick={() => setIsExpanded(prev => !prev)}
                                    aria-label={isExpanded ? "Collapse prompt" : "Expand prompt"}
                                >
                                    <Icon>{isExpanded ? 'expand_less' : 'expand_more'}</Icon>
                                </IconButton>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
