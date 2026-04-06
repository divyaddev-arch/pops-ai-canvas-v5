import React, { useState, useRef, useEffect, useLayoutEffect, ChangeEvent, forwardRef, useImperativeHandle, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './Icons.tsx';
import { IconButton } from './IconButton.tsx';
import { Tooltip } from './Tooltip.tsx';
import { MenuButton } from './MenuButton.tsx';
import { Menu, MenuItem } from './Menu.tsx';
import { Button } from './Button.tsx';
import { CircularProgressIndicator } from './CircularProgressIndicator.tsx';
import { Chip } from './Chip.tsx';
import { duration, easing } from '../gm3-styles';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');



const MAX_TEXTAREA_HEIGHT_PX = 168; // approx 7 lines

export interface Attachment {
    id: number;
    file: File;
    previewUrl?: string; // for images or video src
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

const BananaIcon = () => (
    <svg width="20" height="20" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" transform="scale(-1, 1)">
        <path d="M119.22 95.12c-1.14 2.36-5.91 2.21-8.54 1.38c-6.72-2.12-10.9-7.9-10.9-7.9L65.14 73.9l-10.61-5.57s-2.06-3.5 2.06-6.17s7.01-2.87 7.01-2.87l11.94 7.6s7.71-6 15.54-6.91c7.48-.86 16.79 5.22 19.24 16.7c1.99 9.31 5.14 12.59 6.09 13.8c.95 1.22 3.79 2.62 2.81 4.64z" fill="#ff8e00"></path>
        <path d="M77.72 32.15C74.65 21.99 70.77 10.1 64.91 6.03c-5.19-3.6-10.24-2.95-12.64-1.38c0 0-4.33 1.77-5.47 6.24c-1.88 7.34.59 16.15 2.2 25.25c1.61 9.1 2.45 15.36 3.18 22.67c.07.66 12.16 22.18 12.16 22.18l9.65 5.17s7.37-15.94 7.26-18.19c-.1-2.26-1.29-28.4-3.53-35.82z" fill="#ffe4b4"></path>
        <path d="M52.55 66.94c-.13 2.43 5.73 21.8 5.73 21.8L74 86.14s11.15-6.6 11.46-18.57c.48-18.05-2.61-26.55-4.85-33.97c-3.08-10.14-9.94-23.5-15.75-27.64c-3.41-2.43-7.19-2.79-8.74-2.49c0 0 10.32 8.08 15.54 21.9s6.45 29.79 6.45 29.79s-3.84 2.83-12.9 4.13c-7 1.01-13.04-.7-13.04-.7s.55 5.27.38 8.35z" fill="#ffe265"></path>
        <path d="M85.33 83.75l-6.29-13.14l.34-4.68s1.34-3.93-7.03 2.42c-3.88 2.94-6.22 8.36-6.22 8.36s-1.18-2.92-5.32-6.78c-3.68-3.42-8.63-5.08-8.63-5.08s-10.28-2-11.4-1.13c-7.25 5.66-12.55 12.55-12.55 12.55L22.9 96.42l-8.86 5.43s2.42 3.54 5.92 2.22c2.73-1.03 6.11-4.12 7.93-8.01c2.5-5.35 7.75-15.47 10.42-18.67c5.16-6.16 10.22-8.41 13.99-6.62c4.29 2.03.86 22.29.86 22.29l-27.58 23.21l-.47 3.16s4.01 3.85 15.06 3.49s25.83-4.45 35.18-17.2c8.25-11.24 9.98-21.97 9.98-21.97z" fill="#ffa726"></path>
        <path d="M63.58 84.96c.24 5.55-3.22 13.96-11.22 20.97c-7.99 7.01-16.43 9.33-21.67 9.73c-3.8.29-4.93-1.88-4.93-1.88s7.66-7.05 13.35-12.7c5.4-5.37 11.28-16.65 12.56-21.84c1.28-5.19.12-8.68.12-8.68s2.48.69 6.13 4.35c3.54 3.55 5.53 6.97 5.66 10.05z" fill="#ffb803"></path>
        <path d="M29.45 118.74c-.83 1.93-3.68 2.01-4.92.94c-1.17-1.01-2.31-3.02-1.13-5.27c.78-1.48 3.34-1.89 4.78-.74s2.02 3.32 1.27 5.07z" fill="#875b54"></path>
        <path d="M23.76 97.84c-3.28 4.55-6.57 5.24-7.93 5.39c-1.19.14-2.49-1.38-2.34-2.78c.15-1.4 2.45-3.37 2.73-7.67c.28-4.3-.06-20.07 8.69-29.13c6.17-6.38 13.73-4.18 18.61-2.49c5.5 1.9 8.67 3.7 8.67 3.7s-4.5-.31-12.26 5.81c-4.51 3.56-7.16 8.45-9.66 14.06c-1.8 4.06-4.2 9.91-6.51 13.11z" fill="#fee4b4"></path>
        <path d="M111 109.58c-.92 1.84-3.17 2.98-5.16 2.89c-4.21-.18-8.05-2.35-12.3-7.83c-6.01-7.76-11.24-26.38-15.16-31.34c-2.65-3.35-5.95-5.01-5.95-5.01s1.82-1.54 3.64-2.49c1.82-.95 6.22-.5 6.22-.5l18.78 30.18l9.93 14.1z" fill="#feb804"></path>
        <path d="M100.39 68.46c4.12 5.89 4.66 11.06 5.28 16.34c.56 4.77 1.71 14.8 3.44 18.07c1.74 3.27 3.43 5.4 1.56 7.39s-7.37 1.28-11.32-3.02c-3.18-3.47-4.94-7.25-7.33-12.8c-2.39-5.55-5.91-18.65-10.48-24.57c-2.92-3.78-5.83-3.89-5.83-3.89s3.85-3.14 11.2-3.22c6.59-.07 10.05.8 13.48 5.7z" fill="#ffe4b4"></path>
    </svg>
);

const SHOW_SECURITY_ICON = false; // Set to true to recover the shield icon in the NL input field placeholder



export interface PromptInputProps {
    onSubmit?: (prompt: string, attachments: Attachment[], mode: string | null, metadata?: any) => void;
    onImportCodeClick?: () => void;
    loading?: boolean;
    onCancel?: () => void;
    variant?: 'standard' | 'single-line' | 'guided';
    appearance?: 'default' | 'embedded';
    className?: string;
    hideTools?: boolean;
    hideModelPicker?: boolean;
    placeholder?: string;
    elevation?: 'default' | 'none';
    populateTextOnUpArrow?: boolean | string | string[];
    onFocus?: () => void;
    onBlur?: () => void;
    onPromptChange?: (val: string) => void;
    flatTop?: boolean;
    thinkingVariant?: 'standard' | 'gemini';
    thinkingText?: string;
    autoFocus?: boolean;
    onKeyDown?: (e: React.KeyboardEvent | any) => void;
    submissionMetadata?: any;
    startChipLabel?: string;
    startChipIcon?: string | React.ReactNode;
    onStartChipRemove?: () => void;
    chipLabel?: string;
    chipIcon?: string | React.ReactNode;
    onChipRemove?: () => void;
    chipVariant?: 'leading' | 'trailing' | 'in-line';
    value?: string;
    minHeight?: number | string;
    multilinePlaceholder?: boolean;
    disabled?: boolean;
    forceGradientOutline?: boolean;
}

export const PromptInput = forwardRef((props: PromptInputProps, ref: React.Ref<any>) => {
    const {
        onSubmit,
        onImportCodeClick,
        loading,
        onCancel,
        variant = 'standard',
        appearance = 'default',
        className,
        hideTools: hideToolsProp,
        hideModelPicker: hideModelPickerProp,
        placeholder,
        elevation = 'default',
        populateTextOnUpArrow,
        onFocus,
        onBlur,
        onPromptChange,
        flatTop = false,
        thinkingVariant = 'standard',
        thinkingText,
        autoFocus,
        onKeyDown,
        submissionMetadata,
        startChipLabel,
        startChipIcon,
        onStartChipRemove,
        chipLabel: chipLabelProp,
        chipIcon: chipIconProp,
        onChipRemove: onChipRemoveProp,
        chipVariant = 'leading',
        value,
        minHeight,
        multilinePlaceholder = false,
        disabled = false,
        forceGradientOutline = false,
    } = props;

    // Standardize chip props
    const chipLabel = chipLabelProp || startChipLabel;
    const chipIcon = chipIconProp || startChipIcon;
    const onChipRemove = onChipRemoveProp || onStartChipRemove;

    const [internalPrompt, setInternalPrompt] = useState('');
    const prompt = value !== undefined ? value : internalPrompt;
    const setPrompt = (val: string) => {
        setInternalPrompt(val);
        onPromptChange?.(val);
    };
    const [selectedMode, setSelectedMode] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showExpandButton, setShowExpandButton] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [addMenuAnchor, setAddMenuAnchor] = useState<HTMLElement | null>(null);
    const [toolsMenuAnchor, setToolsMenuAnchor] = useState<HTMLElement | null>(null);
    // modelMenuAnchor state removed (handled by MenuButton)

    const [selectedModel, setSelectedModel] = useState('fast');
    const rootRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    const isTrailingChipActive = !!chipLabel && chipVariant === 'trailing' && prompt !== '' && (!loading || !thinkingText);





    const models = [
        { id: 'fast', label: 'Fast', fullLabel: 'Fast', description: 'Answers quickly', badge: 'New' },
        { id: 'pro', label: 'Pro', fullLabel: 'Pro', description: 'Thinks longer for advanced math & code' },
    ];

    const currentModel = models.find(m => m.id === selectedModel) || models[0];

    const isSingleLine = variant === 'single-line';

    const modes = [
        { id: 'Deep Research', icon: 'travel_explore', label: 'Deep Research' },
        { id: 'Video', icon: 'movie', label: 'Create videos (Veo 3.1)' },
        { id: 'Image', icon: 'banana', label: 'Create images' },
        { id: 'Canvas', icon: 'note_stack_add', label: 'Canvas' },
        { id: 'Guided Learning', icon: 'auto_stories', label: 'Guided Learning' },
        { id: 'Visual Layout', icon: 'view_quilt', label: 'Visual layout', badge: 'Labs' },
    ];
    
    const [containerHeight, setContainerHeight] = useState<number | string>(
        minHeight ?? (variant === 'single-line' ? 68 : 118)
    );

    const [isMounted, setIsMounted] = useState(false);



    const handleInput = () => {
        if (textareaRef.current) {
            setPrompt(textareaRef.current.value);
        }
    };

    const handleAddClick = (e: React.MouseEvent<HTMLElement>) => {
        setAddMenuAnchor(e.currentTarget);
    };

    useEffect(() => {
        // Small delay to ensure initial paint is complete before enabling transitions
        const timer = setTimeout(() => {
            setIsMounted(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
        onPromptChange?.(prompt);
    }, [prompt, onPromptChange]);

    useImperativeHandle(ref, () => ({
        focus: () => {
            textareaRef.current?.focus();
            inputRef.current?.focus();
        }
    }));

    // Maintain focus after thinking state ends
    const prevLoading = useRef(loading);
    useEffect(() => {
        if (prevLoading.current && !loading) {
            if (textareaRef.current) textareaRef.current.focus();
            if (inputRef.current) inputRef.current.focus();
        }
        prevLoading.current = loading;
    }, [loading]);

    // Explicit autofocus effect (useful for components inside menus/portals)
    useEffect(() => {
        if (autoFocus) {
            // Use a tiny timeout to ensure it happens after any menu animations or focus traps
            const timer = setTimeout(() => {
                if (textareaRef.current) textareaRef.current.focus();
                if (inputRef.current) inputRef.current.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [autoFocus]);

    // Auto-grow and expand button logic with height tracking
    const updateHeight = () => {
        const textarea = textareaRef.current;
        const root = rootRef.current;
        if (textarea && root) {
            const isAutoHeight = textarea.style.height === 'auto';
            if (!isAutoHeight) {
                textarea.style.height = 'auto';
            }
            const scrollHeight = textarea.scrollHeight;
            
            const computedStyle = getComputedStyle(textarea);
            const lineHeight = parseFloat(computedStyle.lineHeight) || 24;
            const paddingTop = parseFloat(computedStyle.paddingTop) || 1;
            const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
            const contentHeight = scrollHeight - paddingTop - paddingBottom;
            const lines = prompt === '' ? 0 : Math.round(contentHeight / lineHeight);

            const shouldShowButtonBasedOnLines = lines >= 3;

            if (scrollHeight > MAX_TEXTAREA_HEIGHT_PX) {
                textarea.style.height = `${MAX_TEXTAREA_HEIGHT_PX}px`;
                textarea.style.overflowY = 'auto';
                setShowExpandButton(true);
            } else {
                textarea.style.height = `${scrollHeight}px`;
                textarea.style.overflowY = 'hidden';
                setShowExpandButton(shouldShowButtonBasedOnLines);
            }

            // Explicitly set container height for transitions
            const isEmpty = !prompt && attachments.length === 0 && !loading;

            if (isSingleLine && attachments.length === 0) {
                const currentHeight = parseFloat(textarea.style.height) || scrollHeight;
                const overhead = isTrailingChipActive ? 87 : 42;
                setContainerHeight(Math.max(68, currentHeight + overhead));
            } else if (isExpanded) {
                setContainerHeight('80vh');
            } else if (isEmpty) {
                // Force default height to avoid measurement jitters when empty
                setContainerHeight(minHeight ?? (isSingleLine ? 68 : 118));
            } else {
                const h = root.scrollHeight;
                if (h > 0) {
                    const mh = typeof minHeight === 'number' ? minHeight : 0;
                    setContainerHeight(mh ? Math.max(h, mh) : h);
                }
            }
        }
    };

    // Use ResizeObserver to catch width changes (e.g. during animation)
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const observer = new ResizeObserver(() => {
            // Request animation frame to avoid "ResizeObserver loop limit exceeded"
            requestAnimationFrame(() => {
                updateHeight();
            });
        });

        observer.observe(root);
        return () => observer.disconnect();
    }, [prompt, isSingleLine, isExpanded, attachments.length]);

    useEffect(() => {
        updateHeight();
    }, [prompt, isSingleLine, isExpanded, attachments.length]);

    const handleSend = () => {
        if ((!prompt.trim() && attachments.length === 0) || loading) return;

        onSubmit?.(prompt, attachments, selectedMode, submissionMetadata);
        setPrompt('');
        setAttachments([]);
        setIsExpanded(false);
    };
    
    const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        onKeyDown?.(e);
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (loading) {
                onCancel?.();
            } else {
                handleSend();
            }
        }
        if (e.key === 'ArrowUp' && populateTextOnUpArrow && populateTextOnUpArrow !== true) {
            const prompts = Array.isArray(populateTextOnUpArrow) ? populateTextOnUpArrow : [populateTextOnUpArrow];
            if (prompts.length > 0) {
                const currentIndex = prompts.indexOf(prompt);
                if (prompt === '') {
                    e.preventDefault();
                    setPrompt(prompts[0]);
                } else if (currentIndex !== -1) {
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % prompts.length;
                    setPrompt(prompts[nextIndex]);
                }
            }
        }
    };

    const handleModeClick = (modeId: string) => {
        setSelectedMode(current => (current === modeId ? null : modeId));
        setToolsMenuAnchor(null); // Close menu
    };
    
    const handleImportClick = () => {
        setAddMenuAnchor(null);
        onImportCodeClick?.();
    };
    
    const handleUploadFileClick = () => {
        setAddMenuAnchor(null);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        (Array.from(files) as File[]).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAttachments(prev => [
                        ...prev,
                        {
                            id: Date.now() + index,
                            file: file,
                            previewUrl: reader.result as string,
                        },
                    ]);
                };
                reader.readAsDataURL(file);
            } else {
                 setAttachments(prev => [
                    ...prev,
                    { id: Date.now() + index, file: file },
                 ]);
            }
        });

        if (e.target) e.target.value = '';
    };

    const handleRemoveAttachment = (idToRemove: number) => {
        setAttachments(prev => prev.filter(att => att.id !== idToRemove));
    };

    const [chipWidth, setChipWidth] = useState(0);
    const chipRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!chipRef.current || !chipLabel || chipVariant !== 'leading') {
            setChipWidth(0);
            return;
        }

        const updateWidth = () => {
            if (chipRef.current) {
                setChipWidth(chipRef.current.getBoundingClientRect().width);
            }
        };

        const observer = new ResizeObserver(updateWidth);
        observer.observe(chipRef.current);
        updateWidth();

        return () => observer.disconnect();
    }, [startChipLabel]);

    // Keep focus after adding an attachment
    useEffect(() => {
        if (attachments.length > 0) {
            if (textareaRef.current) textareaRef.current.focus();
        }
    }, [attachments.length]);




    return (
        <div
            ref={rootRef}
            className={cn(
                "w-full transition-all flex flex-col relative",
                isSingleLine || forceGradientOutline
                    ? cn('bg-surface border border-transparent')
                    : cn('border border-outline-variant'),
                !isExpanded && !isSingleLine && !multilinePlaceholder && "min-h-[118px]",
                multilinePlaceholder && "min-h-0",
                isSingleLine && "min-h-[68px]",
                flatTop ? "rounded-t-[4px]" : (isSingleLine ? "rounded-t-[36px]" : "rounded-t-[32px]"),
                isSingleLine ? "rounded-b-[36px]" : "rounded-b-[32px]",
                isSingleLine && isTrailingChipActive && "pt-[21px] pb-5",
                className
            )}
            style={{
                height: typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight,
                transitionDuration: `${duration.medium4}ms`,
                transitionTimingFunction: easing.standard,
                transitionProperty: isMounted ? 'all' : 'none'
            }}
        >
            {/* Gradient Outline for Single Line Variant */}
            {(isSingleLine || forceGradientOutline) && (
                <div
                    className={cn(
                        "absolute -inset-[1px] pointer-events-none z-0 transition-opacity duration-300",
                        "opacity-100"
                    )}
                    style={{
                        background: 'var(--color-ge-ai-refine)',
                        padding: '1px',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        WebkitMaskComposite: 'xor',
                        borderRadius: flatTop ? "4px 4px 36px 36px" : (isSingleLine ? "37px" : "33px"),
                    }}
                />
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
                multiple
            />

            {/* Main Content Area */}
            <div
                className={cn(
                    "relative flex-1 flex flex-col transition-opacity duration-300",
                    isExpanded && "overflow-hidden",
                    isSingleLine ? "pl-[54px] pr-12" : "pt-[21px] px-4 pb-[61px]",
                    chipLabel && chipVariant === 'leading' && !isSingleLine && "pt-1",
                    isSingleLine && isTrailingChipActive && "pt-0"
                )}
                style={isSingleLine ? {
                    paddingRight: '78px',
                    whiteSpace: 'normal',
                    height: 'fit-content',
                    paddingBottom: '0px',
                    paddingTop: attachments.length > 0 ? '18px' : undefined
                } : undefined}
            >
                 {attachments.length > 0 && (
                    <div className="pb-2">
                        <div className="flex flex-wrap gap-2">
                            {attachments.map(att => (
                                att.previewUrl ? (
                                    <div key={att.id} className="relative group">
                                        <img src={att.previewUrl} alt={att.file.name} className="h-20 w-20 rounded-2xl object-cover" />
                                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <IconButton
                                                variant="standard"
                                                size="xsmall"
                                                className="bg-surface"
                                                onClick={() => handleRemoveAttachment(att.id)}
                                                aria-label={`Remove ${att.file.name}`}
                                            >
                                                <Icon>close</Icon>
                                            </IconButton>
                                        </div>
                                    </div>
                                ) : (
                                    <Tooltip key={att.id} content={att.file.name}>
                                        <div className="relative group h-20 bg-surface-container rounded-2xl p-3 flex items-center gap-3">
                                                <Icon className="text-4xl text-on-surface-variant">{getFileIcon(att.file)}</Icon>
                                            <div className="flex flex-col">
                                                <span className="body-medium text-on-surface-variant w-32 truncate">{att.file.name}</span>
                                                <span className="body-small text-on-surface-variant">{getFileTypeLabel(att.file)}</span>
                                            </div>
                                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <IconButton
                                                    variant="standard"
                                                    size="xsmall"
                                                    className="bg-surface"
                                                    onClick={() => handleRemoveAttachment(att.id)}
                                                    aria-label={`Remove ${att.file.name}`}
                                                >
                                                        <Icon>close</Icon>
                                                </IconButton>
                                            </div>
                                        </div>
                                    </Tooltip>
                                )
                            ))}
                        </div>
                    </div>
                )}

                {chipLabel && chipVariant === 'trailing' && (prompt !== '' && (!loading || !thinkingText)) && (
                    <div className={cn("pb-2 pl-2 transition-all duration-300 flex-shrink-0 pt-0")}>
                        <div className="pointer-events-auto shrink-0 w-fit">
                            <Chip
                                label={chipLabel}
                                leadingIcon={chipIcon ? (typeof chipIcon === 'string' ? <Icon>{chipIcon}</Icon> : chipIcon) : <Icon>spark</Icon>}
                                onTrailingIconClick={onChipRemove}
                                trailingIcon={<Icon>close</Icon>}
                                variant="in-line"
                            />
                        </div>
                    </div>
                )}

                <div
                    className={cn(
                        "relative flex flex-col",
                        isSingleLine ? "items-start" : "items-start",
                        isExpanded && "flex-1 min-h-0"
                    )}
                    style={isSingleLine ? {
                        height: '100%',
                        paddingBottom: '0px',
                        paddingRight: '0px',
                        width: '100%',
                        alignItems: 'start',
                        whiteSpace: 'normal',
                        display: 'flex',
                        paddingTop: isTrailingChipActive ? '0px' : '12px'
                    } : undefined}
                >
                    <div
                        className={cn(
                            "relative flex w-full items-start",
                            isExpanded && "flex-1 min-h-0"
                        )}
                    >
                        <div
                            className={cn("relative flex-1", isExpanded ? "flex flex-col" : "flex items-start")}
                            style={isSingleLine ? { display: 'flex', alignItems: 'start', paddingBottom: '0px', whiteSpace: 'normal', minHeight: '34px' } : undefined}
                        >
                            {chipLabel && chipVariant === 'leading' && (
                                <div ref={chipRef} className={cn("absolute z-10 pointer-events-auto", isSingleLine ? "left-0 top-[7px]" : "left-1 top-[-1px]")}>
                                    <Chip
                                        label={chipLabel}
                                        leadingIcon={chipIcon ? (typeof chipIcon === 'string' ? <Icon>{chipIcon}</Icon> : chipIcon) : <Icon>spark</Icon>}
                                        onTrailingIconClick={onChipRemove}
                                        trailingIcon={<Icon>close</Icon>}
                                        variant="in-line"
                                    />
                                </div>
                            )}
                            <div className={cn("relative flex-1", isExpanded && "h-full flex flex-col", multilinePlaceholder && "grid")} style={isSingleLine ? { paddingTop: isTrailingChipActive ? '0px' : '5px' } : undefined}>
                                {(prompt === '' || (loading && thinkingText)) && !isExpanded && (
                                    <div
                                        className={cn(
                                            "flex pointer-events-none transition-opacity duration-300 pl-[2px]",
                                            multilinePlaceholder ? "relative z-0 row-start-1 col-start-1" : "absolute inset-0",
                                            multilinePlaceholder ? "items-start pt-[6px]" : "items-center",
                                            chipVariant === 'trailing' && "gap-2"
                                        )}
                                        style={{
                                            paddingLeft: (chipLabel && chipVariant === 'leading') ? `${(chipWidth || 70) + (isSingleLine ? 16 : 11)}px` : '5px',
                                            marginTop: isSingleLine ? '1px' : '-4px',
                                            height: 'auto',
                                            paddingRight: multilinePlaceholder ? '40px' : undefined
                                        }}>
                                        {SHOW_SECURITY_ICON && (
                                            <span className={cn(
                                                "material-symbols-rounded align-middle leading-none transition-opacity duration-300 overflow-hidden w-5 opacity-100 mr-1 text-[20px]",
                                                (loading && thinkingText) && "hidden"
                                            )} aria-hidden="true" style={{ margin: '0px 10px 0px 0px' }}>encrypted</span>
                                        )}
                                        <span className={cn(
                                            "body-large leading-normal",
                                            !multilinePlaceholder && "truncate"
                                        )}>
                                            {(loading && thinkingText) ? thinkingText : (placeholder || "Describe agent and @mention knowledge or tools")}
                                        </span>
                                        {chipLabel && chipVariant === 'trailing' && (
                                            <div className="pointer-events-auto shrink-0">
                                                <Chip
                                                    label={chipLabel}
                                                    leadingIcon={chipIcon ? (typeof chipIcon === 'string' ? <Icon>{chipIcon}</Icon> : chipIcon) : <Icon>spark</Icon>}
                                                    onTrailingIconClick={onChipRemove}
                                                    trailingIcon={<Icon>close</Icon>}
                                                    variant="in-line"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                        <textarea
                                            ref={textareaRef}
                                            value={prompt}
                                            onInput={handleInput}
                                            onKeyDown={handleKeyDownInternal}
                                            placeholder=""
                                            rows={1}
                                            disabled={disabled}
                                            className={cn(
                                                "w-full bg-transparent resize-none outline-none body-large text-on-surface placeholder:text-on-surface-variant transition-[height] duration-300 pt-[0px] pl-2 pr-[17px]",
                                                isExpanded ? 'h-full scroll-thin' : (showExpandButton ? 'scroll-thin' : ''),
                                            )}
                                            aria-label="Gemini Prompt Input"
                                            style={isSingleLine ? {
                                                whiteSpace: 'normal',
                                                paddingTop: '6px',
                                                marginTop: '0px',
                                                paddingBottom: '0px',
                                                paddingRight: '0px',
                                                opacity: (loading && thinkingText) ? 0 : 1,
                                                textIndent: (chipLabel && chipVariant === 'leading') ? `${(chipWidth || 70) + 16}px` : '0px'
                                            } : {
                                                height: '27px',
                                                opacity: (loading && thinkingText) ? 0 : 1,
                                                paddingTop: '1px',
                                                textIndent: (chipLabel && chipVariant === 'leading') ? `${(chipWidth || 70) + 6}px` : '0px'
                                            }}
                                            onFocus={onFocus}
                                            onBlur={onBlur}
                                            autoFocus={autoFocus}
                                />
                            </div>
                        {showExpandButton && !isExpanded && !isSingleLine && (
                            <div className="absolute top-[-8px] right-[-8px]">
                                <IconButton
                                    size="xsmall"
                                    className="!w-10 !h-10"
                                    onClick={() => setIsExpanded(true)}
                                    aria-label="Expand prompt input"
                                >
                                    <Icon>expand_content</Icon>
                                </IconButton>
                            </div>
                        )}
                        {isExpanded && !isSingleLine && (
                            <div className="absolute top-[-8px] right-[-8px]">
                                <IconButton
                                    size="xsmall"
                                    className="!w-10 !h-10"
                                    onClick={() => setIsExpanded(false)}
                                    aria-label="Collapse prompt input"
                                >
                                    <Icon>collapse_content</Icon>
                                </IconButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>

            {/* Shared Elements - Absolutely Positioned */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Add Attachment Button */}
                <div
                    className="absolute transition-opacity duration-300 pointer-events-auto z-20"
                    style={{
                        left: isSingleLine ? '12px' : '11px',
                        bottom: isSingleLine ? '15px' : '11px'
                    }}
                >
                    <Tooltip content="Add">
                        <div className="flex items-center">
                            <IconButton
                                variant="standard"
                                size="small"
                                onClick={handleAddClick}
                                aria-label="Add"
                                className="!w-[42px] !h-[42px] text-on-surface-variant"
                                disabled={disabled}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <CircularProgressIndicator variant="gemini" isIndeterminate size={28} />
                                    </div>
                                ) : (
                                        <Icon>add</Icon>
                                )}
                            </IconButton>
                        </div>
                    </Tooltip>
                    <Menu anchorEl={addMenuAnchor} open={Boolean(addMenuAnchor)} onClose={() => setAddMenuAnchor(null)}>
                        <MenuItem headline="Upload files" leadingIcon={<Icon>attachment</Icon>} onClick={handleUploadFileClick} />
                        <MenuItem headline="Add from Drive" leadingIcon={<Icon>add_to_drive</Icon>} onClick={() => setAddMenuAnchor(null)} />
                        <MenuItem headline="Import code" leadingIcon={<Icon>code</Icon>} onClick={handleImportClick} />
                    </Menu>
                </div>

                {/* Tools Button */}
                <div
                    className="absolute transition-opacity duration-300 pointer-events-auto overflow-hidden whitespace-nowrap z-20"
                    style={{
                        left: isSingleLine ? '43px' : '54px',
                        bottom: isSingleLine ? '14px' : '11px',
                        opacity: (isSingleLine || hideToolsProp) ? 0 : 1,
                        maxWidth: (isSingleLine || hideToolsProp) ? '0px' : '200px',
                        pointerEvents: (isSingleLine || hideToolsProp) ? 'none' : 'auto'
                    }}
                >
                    <Button
                        variant="text"
                        size="small"
                        onClick={(e) => setToolsMenuAnchor(e.currentTarget)}
                        aria-label="Tools"
                        disabled={disabled}
                        className={cn(
                            "[&>span:first-of-type]:!w-5 [&>span:first-of-type]:!h-5 !text-on-surface-variant !gap-[6px]",
                            Boolean(toolsMenuAnchor) && "is-open"
                        )}
                        icon={<Icon className="!text-[20px]">page_info</Icon>}
                    >
                        Tools
                    </Button>
                    <Menu anchorEl={toolsMenuAnchor} open={Boolean(toolsMenuAnchor)} onClose={() => setToolsMenuAnchor(null)} className="!w-[282px]">
                        {modes.map(mode => (
                            <MenuItem
                                key={mode.id}
                                headline={
                                    <div className="flex items-center gap-2">
                                        <span>{mode.label}</span>
                                        {(mode as any).badge && (
                                            <div className="h-6 px-2.5 bg-secondary-container rounded-full flex items-center gap-1 shrink-0">
                                                <Icon className="text-on-secondary-container !text-[16px] filled-icon">science</Icon>
                                                <span className="text-on-secondary-container body-small-emphasized leading-none">Labs</span>
                                            </div>
                                        )}
                                    </div>
                                }
                                leadingIcon={
                                    mode.icon === 'banana' ? (
                                        <BananaIcon />
                                    ) : (
                                            <Icon className="!text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>{mode.icon}</Icon>
                                    )
                                }
                                onClick={() => handleModeClick(mode.id)}
                                className="!h-10 !pl-[18px] !pr-3 !gap-[14px]"
                            />
                        ))}
                    </Menu>
                </div>

                {/* Send/Mic Action Group */}
                <div
                    className="absolute transition-opacity duration-300 pointer-events-auto z-20"
                    style={{
                        right: isSingleLine ? '12px' : '11px',
                        bottom: isSingleLine ? '14px' : '11px'
                    }}
                >
                    <div className="flex items-center gap-[5px]">
                    {/* Model Picker */}
                        {!hideModelPickerProp && !isSingleLine && (
                        <>
                                <MenuButton
                                    variant="text"
                                    label={currentModel.label}
                                    className="!text-on-surface-variant !px-3 font-medium [&_.material-symbols-outlined]:!text-[20px] !gap-[8px]"
                                    disabled={disabled}
                                >
                                    <div className="pl-4 pr-3 py-2 text-on-surface-variant text-sm font-medium">Gemini 3</div>
                                    {models.map(model => (
                                        <MenuItem
                                            key={model.id}
                                            headline={model.fullLabel}
                                            className="!h-auto !py-[7px]"
                                            trailingIcon={
                                                model.id === selectedModel ? (
                                                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                                        <Icon className="text-on-primary text-[14px] font-bold">check</Icon>
                                                    </div>
                                                ) : (
                                                    (model as any).badge && (
                                                        <div className="h-5 px-2 bg-primary text-on-primary label-small rounded-full flex items-center justify-center shadow-sm">
                                                            {(model as any).badge}
                                                            </div>
                                                        )
                                                    )
                                            }
                                            onClick={() => setSelectedModel(model.id)}
                                        />
                                    ))}
                                </MenuButton>
                        </>
                    )}

                        {(prompt || loading || attachments.length > 0) ? (
                            <Tooltip content="Submit">
                                <IconButton
                                    variant="standard"
                                    size="small"
                                    className={cn(
                                        "bg-surface-container !w-[42px] !h-[42px]",
                                        loading ? 'text-primary' : 'text-on-surface-variant'
                                    )}
                                    onClick={loading ? onCancel : handleSend}
                                    aria-label={loading ? 'Stop generation' : 'Send prompt'}
                                    disabled={loading ? !onCancel : disabled}
                                >
                                    <Icon className="filled-icon">{loading ? 'stop' : 'send'}</Icon>
                                </IconButton>
                            </Tooltip>
                    ) : (
                                <Tooltip content="Use microphone">
                                    <IconButton variant="standard" size="small" aria-label="Use microphone" className="!w-[42px] !h-[42px] text-on-surface-variant" disabled={disabled}>
                                        <Icon className="filled-icon" style={{ fontSize: '20px' }}>mic</Icon>
                                    </IconButton>
                                </Tooltip>
                    )}
                </div>
                </div>
            </div>



        </div>
    );
});

PromptInput.displayName = 'PromptInput';