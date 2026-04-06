
import React, { useState } from 'react';
import { Icon } from './Icons.tsx';
const GeminiSparkLogo = ({ className }: { className?: string }) => <Icon className={className}>spark</Icon>;
const GoogleSheetsLogo = ({ className }: { className?: string }) => <Icon className={className}>table_chart</Icon>;
import { IconButton } from './IconButton.tsx';
import { CircularProgressIndicator } from './CircularProgressIndicator.tsx';
import { Tooltip } from './Tooltip.tsx';
import { Button } from './Button.tsx';
import { VideoPlayer } from './VideoPlayer.tsx';
import { Divider } from './Divider.tsx';
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// In a real app, this would likely be in a shared types file.
interface Attachment {
    id: number;
    file: File;
    previewUrl?: string; // for images or video src
    posterUrl?: string; // for video poster
}

// --- Internal CodeBlock component ---
interface CodeBlockProps {
    language: string;
    code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        window.focus();
        navigator.clipboard.writeText(code)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error("Clipboard write failed: ", err);
                alert("Could not copy to clipboard. Your browser might require the document to be focused. Please click anywhere on the page and try again.");
            });
    };
    
    // A simple syntax highlighter for XML/HTML
    const highlightedCode = code
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/([a-zA-Z0-9_-]+)=(".*?")/g, '<span class="text-tertiary">$1</span>=<span class="text-primary">$2</span>')
      .replace(/(&lt;\/?[\w-:]+)/g, '<span class="text-secondary">$1</span>')
      .replace(/(&gt;)/g, '<span class="text-secondary">$1</span>');

    return (
        <div className="flex flex-col gap-[2px] py-2">
            <header className="flex justify-between items-center px-4 py-2 bg-surface-container rounded-t-[16px] rounded-b-[4px]">
                <span className="title-small text-on-surface-variant pl-[2px]">{language}</span>
                <Tooltip content={copied ? "Copied!" : "Copy code"}>
                    <IconButton size="xsmall" onClick={handleCopy} aria-label="Copy code">
                        <Icon>{copied ? 'check' : 'content_copy'}</Icon>
                    </IconButton>
                </Tooltip>
            </header>
            <pre className="p-4 overflow-x-auto scroll-thin bg-surface-container rounded-t-[4px] rounded-b-[16px]">
                <code className="font-google-code text-sm leading-[21px] text-on-surface" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
        </div>
    );
};

// --- Internal Table component ---
const ResponseTable: React.FC<{ headers: string[], rows: string[][] }> = ({ headers, rows }) => {
    return (
        <div className="py-0">
            <div className="overflow-x-auto scroll-thin">
                <div className="inline-block min-w-full">
                    <div className="flex flex-col gap-[2px]">
                        <div className="bg-surface-container-low rounded-t-[16px] rounded-b-[4px]">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        {headers.map((header, index) => (
                                            <th key={index} className="p-3 text-left align-top body-medium text-on-surface font-normal">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <td key={cellIndex} className="p-3 align-top body-medium text-on-surface-variant">
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                        </div>
                        <footer className="bg-surface-container-low rounded-t-[4px] rounded-b-[16px] h-[60px] flex items-center pl-[6px] pr-4">
                            <Button variant="text" size="small" icon={<GoogleSheetsLogo className="w-5 h-5" />} className="!text-on-surface">
                                Export to Sheets
                            </Button>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MARKDOWN PARSER ---

const renderMarkdownInline = (text: string): React.ReactNode => {
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    // Regex priority: Escaped Character, Inline Code, Image, Link, Bold+Italic, Bold, Italic, Strikethrough
    const regex = /\\(.)|`([^`]+)`|!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\s*\)|\[(.*?)\]\((.*?)\)|(\*\*\*|___)(.*?)\8|(\*\*|__)(.*?)\10|(\*|_)(.*?)\12|~~(.*?)~~/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        
        if (match[1] !== undefined) { // Escaped Character -> Group 1
            parts.push(match[1]);
        } else if (match[2] !== undefined) { // `Inline Code` -> Group 2
            parts.push(<code key={lastIndex} className="font-google-code text-sm bg-surface-container rounded-md px-1 py-0.5">{match[2]}</code>);
        } else if (match[3] !== undefined && match[4] !== undefined) { // Image -> Groups 3 & 4
             const imageUrl = match[4];
             const altText = match[3];
             parts.push(<img key={lastIndex} src={imageUrl} alt={altText} className="max-w-full rounded-lg my-2" />);
        } else if (match[6] !== undefined && match[7] !== undefined) { // Link -> Groups 6 & 7
            parts.push(<a key={lastIndex} href={match[7]} target="_blank" rel="noopener noreferrer" className="text-primary underline">{match[6]}</a>);
        } else if (match[9] !== undefined) { // ***Bold and Italic*** -> Group 9
            parts.push(<strong key={lastIndex}><em>{renderMarkdownInline(match[9])}</em></strong>);
        } else if (match[11] !== undefined) { // **Bold** -> Group 11
            parts.push(<strong key={lastIndex}>{renderMarkdownInline(match[11])}</strong>);
        } else if (match[13] !== undefined) { // *Italic* -> Group 13
            parts.push(<em key={lastIndex}>{renderMarkdownInline(match[13])}</em>);
        } else if (match[14] !== undefined) { // ~~Strikethrough~~ -> Group 14
            parts.push(<s key={lastIndex}>{renderMarkdownInline(match[14])}</s>);
        }
        
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return <>{parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}</>;
};

const parseMarkdown = (text: string): React.ReactNode[] => {
    if (!text) return [];

    // Pre-process: Split inline :::schedule blocks onto their own lines for proper parsing
    // This handles "Some text :::schedule { ... } ::: More text" by converting it to:
    // Some text
    // :::schedule { ... } :::
    // More text
    // It is careful not to break existing structure if already correct.
    let processedText = text;
    if (text.includes(':::schedule')) {
        processedText = text.replace(/([^\n])\s*(:::schedule)/g, '$1\n$2');
    }

    const lines = processedText.split('\n');
    const blocks: React.ReactNode[] = [];
    let i = 0;

    const parseList = (parentTag: 'ul' | 'ol', initialIndent: number): number => {
        const items: string[][] = [];
        let currentItem: string[] = [];

        while (i < lines.length) {
            const line = lines[i];
            const lineIndentMatch = line.match(/^(\s*)/);
            const lineIndent = lineIndentMatch ? lineIndentMatch[0].length : 0;
            const isListItem = /^\s*([*+-]|\d+\.)\s/.test(line);

            if (line.trim() === '') {
                // Handle blank lines within a list item
                if (currentItem.length > 0) {
                    currentItem.push('');
                }
                i++;
                continue;
            }

            if (lineIndent < initialIndent) {
                // End of the current list level
                break;
            }

            if (isListItem && lineIndent === initialIndent) {
                // A new item at the current list level
                if (currentItem.length > 0) items.push(currentItem);
                currentItem = [line.substring(lineIndent).replace(/^\s*([*+-]|\d+\.)\s+/, '')];
            } else if (currentItem.length > 0) {
                const isNestedListItem = /^\s*([*+-]|\d+\.)\s/.test(line);
                if (isNestedListItem) {
                    currentItem.push(line);
                } else {
                    if (lineIndent > initialIndent) {
                        currentItem.push(line.substring(Math.min(lineIndent, initialIndent + 2)));
                    } else {
                        break;
                    }
                }
            } else {
                // This line doesn't belong to this list
                break;
            }
            i++;
        }
        if (currentItem.length > 0) items.push(currentItem);
        
        const listItems = items.map((itemLines, index) => {
            const content: React.ReactNode[] = [];
            const nestedListLines: string[] = [];
            let inNestedList = false;

            for(const line of itemLines) {
                if (/^\s*([*+-]|\d+\.)\s/.test(line)) {
                    inNestedList = true;
                }
                if (inNestedList) {
                    nestedListLines.push(line);
                } else {
                    content.push(
                        <React.Fragment key={content.length}>
                            {renderMarkdownInline(line)}
                            <br/>
                        </React.Fragment>
                    );
                }
            }
             // Remove last trailing <br/>
            if (content.length > 0) {
                const lastChild = content[content.length - 1] as React.ReactElement<{ children?: React.ReactNode }>;
                const childrenAsArray = React.Children.toArray(lastChild.props.children);
                if (childrenAsArray.length > 0) {
                    const lastGrandChild = childrenAsArray[childrenAsArray.length - 1];
                    if (React.isValidElement(lastGrandChild) && lastGrandChild.type === 'br') {
                        const newChildren = childrenAsArray.slice(0, -1);
                         content[content.length - 1] = React.cloneElement(
                            lastChild,
                            {},
                            ...newChildren
                        );
                    }
                }
            }


            return (
                <li key={index} className="my-1">
                    {content}
                    {nestedListLines.length > 0 && parseMarkdown(nestedListLines.join('\n'))}
                </li>
            );
        });

        blocks.push(React.createElement(parentTag, { key: i, className: cn('pl-5 my-2', parentTag === 'ol' ? 'list-decimal' : 'list-disc') }, ...listItems));
        return i;
    };
    
    while (i < lines.length) {
        const line = lines[i];

        // Skip empty lines between blocks
        if (line.trim() === '') {
            i++;
            continue;
        }

        // Setext H1/H2 (needs lookahead)
        if (line.trim() && i + 1 < lines.length) {
            if (lines[i + 1].match(/^===\s*$/)) {
                blocks.push(<h1 key={i} className="title-large-emphasized text-on-surface mt-4">{renderMarkdownInline(line)}</h1>);
                i += 2; continue;
            }
            if (lines[i + 1].match(/^---\s*$/)) {
                blocks.push(<h2 key={i} className="title-medium-emphasized text-on-surface mt-4">{renderMarkdownInline(line)}</h2>);
                i += 2; continue;
            }
        }
        
        // Atx Headings
        const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const content = headingMatch[2];
            // FIX: Using React.createElement for dynamic tags, as <Tag> syntax is not valid for outputs. Also changed type to avoid JSX namespace error.
            const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
            blocks.push(React.createElement(Tag, { key: i, className: `title-large-emphasized text-on-surface mt-4` }, renderMarkdownInline(content)));
            i++; continue;
        }

        // Horizontal Rule
        if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line)) {
            blocks.push(<Divider key={i} className="my-4" />);
            i++; continue;
        }

        // Code Blocks
        if (line.startsWith('```')) {
            const language = line.substring(3).trim();
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            blocks.push(<CodeBlock key={i} language={language.toUpperCase() || 'PLAINTEXT'} code={codeLines.join('\n')} />);
            i++; continue;
        }

        // Table check
        const isTableLine = (line: string) => line.includes('|');
        const isTableSeparator = (line: string) => /^\s*\|?([-|: ]+)\|\s*$/.test(line) && line.includes('-');

        if (
            i + 1 < lines.length &&
            isTableLine(lines[i]) &&
            isTableSeparator(lines[i + 1])
        ) {
            const headerLine = lines[i];
            const rowsLines = [];
            
            let tableIndex = i + 2;
            while (tableIndex < lines.length && isTableLine(lines[tableIndex])) {
                rowsLines.push(lines[tableIndex]);
                tableIndex++;
            }

            const parseRow = (line: string): string[] => {
                const content = line.trim().replace(/^\||\|$/g, '').trim();
                return content.split('|').map(s => s.trim());
            };
            
            const headers = parseRow(headerLine);
            const rows = rowsLines.map(parseRow);

            const isValidTable = rows.every(row => row.length === headers.length);

            if (isValidTable && headers.length > 0) {
                blocks.push(<ResponseTable key={i} headers={headers} rows={rows} />);
                i = tableIndex;
                continue;
            }
        }
        
        // Blockquotes (recursive)
        if (line.startsWith('>')) {
            const bqLines: string[] = [];
            while (i < lines.length && lines[i].startsWith('>')) {
                bqLines.push(lines[i].substring(1).trimStart());
                i++;
            }
            blocks.push(
                <blockquote key={i} className="border-l-2 border-outline-variant pl-4 my-2 text-on-surface-variant">
                    {parseMarkdown(bqLines.join('\n'))}
                </blockquote>
            );
            continue;
        }

        // Lists
        const listMatch = line.match(/^(\s*)([*+-]|\d+\.)\s/);
        if (listMatch) {
            const initialIndent = listMatch[1].length;
            const tag = listMatch[2].match(/\d/) ? 'ol' : 'ul';
            i = parseList(tag, initialIndent);
            continue;
        }

        // Paragraphs (fallback)
        const paragraphLines = [];
        while (i < lines.length && lines[i].trim() !== '') {
            // Check if the next line starts a new block that can't interrupt a paragraph.
             if (
                lines[i].startsWith('```') ||
                lines[i].startsWith('#') ||
                 lines[i].startsWith(':::') ||
                lines[i].match(/^(\*{3,}|-{3,}|_{3,})\s*$/) ||
                (i + 1 < lines.length && lines[i+1].match(/^(===|---)\s*$/))
             ) {
                break;
             }
            paragraphLines.push(lines[i]);
            i++;
        }

        if (paragraphLines.length > 0) {
            const paragraphText = paragraphLines.join('\n');
            blocks.push(
                <p key={i} className="body-large text-on-surface break-words leading-[28px] my-2" style={{ whiteSpace: 'pre-line' }}>
                    {renderMarkdownInline(paragraphText)}
                </p>
            );
        }
    }

    return blocks;
};


// --- Response Component ---
export interface ResponseProps {
    text?: string;
    isLoading?: boolean;
    attachments?: Attachment[];
    thinkingContent?: React.ReactNode;
    showIcon?: boolean;
    onShowDiff?: () => void;
    summaryTitle?: string;
    hideActions?: boolean;
}


export const Response: React.FC<ResponseProps> = ({
    text = '',
    isLoading,
    attachments,
    thinkingContent,
    showIcon = true,
    onShowDiff,
    summaryTitle,
    hideActions = false,
}) => {
    const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);

    const handleDownload = async (url: string | undefined, filename: string) => {
        if (!url) return;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
    
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl); // Clean up
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-start gap-6">
                <div className="w-8 h-8 flex-shrink-0">
                    <CircularProgressIndicator variant="gemini" isIndeterminate size={32} />
                </div>
                <div className="flex-1 min-w-0 pt-0">
                    {/* Mimic the structure of a text-only response to prevent layout shift */}
                    <div className="space-y-2 pb-[16px]">
                        <p className="body-large text-on-surface-variant break-words leading-[28px] pt-[2px]">Thinking...</p>
                    </div>
                    {/* Invisible action buttons as placeholders to reserve the exact vertical space */}
                    <div className="flex items-center gap-2 -ml-2 mt-0 invisible" aria-hidden="true">
                        <IconButton size="xsmall" variant="standard" />
                        <IconButton size="xsmall" variant="standard" />
                        <IconButton size="xsmall" variant="standard" />
                        <IconButton size="xsmall" variant="standard" />
                        <IconButton size="xsmall" variant="standard" />
                    </div>
                </div>
            </div>
        );
    }
    
    const contentParts = parseMarkdown(text);
    const hasCode = text.includes('```');
    const hasAttachments = attachments && attachments.length > 0;
    const hasTextContent = text.trim().length > 0;
    
    const hasTextForActions = hasTextContent && !hasAttachments;

    const effectiveShowIcon = showIcon;

    return (
        <div className={cn("flex items-start", effectiveShowIcon ? "gap-6" : "gap-0")}>
            {effectiveShowIcon && (
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <GeminiSparkLogo className="w-8 h-8" />
                </div>
            )}
            <div className="flex-1 min-w-0 pt-0">
                {thinkingContent && (
                    <div className={cn(isThinkingExpanded ? 'mb-[26px]' : 'mb-[24px]')}>
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
                            aria-expanded={isThinkingExpanded}
                            className="!text-on-surface-variant flex-row-reverse -ml-[14px] -mt-[5px]"
                            icon={<Icon className={cn('transition-transform duration-200', isThinkingExpanded && 'rotate-180')}>keyboard_arrow_down</Icon>}
                        >
                            Show thinking
                        </Button>
                        <div className={cn(
                            "grid transition-[grid-template-rows] duration-medium4 ease-standard",
                            isThinkingExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        )}>
                            <div className="overflow-hidden">
                                <div className="mt-[0px] pl-[24px] border-l border-outline-variant pt-[2px]">
                                    <div className="italic leading-[28px] -mt-[2px]">
                                        {thinkingContent}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                


                {contentParts.length > 0 && (
                    <div className={cn(
                        "space-y-2",
                        !hasCode && !hasAttachments && "pb-[8px]",
                        thinkingContent && "mt-4",
                        !thinkingContent && "-mt-[7px]"
                    )}>
                        {contentParts.map((part, index) => <React.Fragment key={index}>{part}</React.Fragment>)}
                    </div>
                )}





                {hasAttachments && (
                    <div className={cn("flex flex-wrap gap-4", (hasTextContent || thinkingContent || contentParts.length > 0) && 'mt-4')}>
                        {attachments.map(att => {
                            if (att.previewUrl && att.file.type.startsWith('image/')) {
                                return (
                                    <div key={att.id} className="relative group">
                                        <img
                                            src={att.previewUrl}
                                            alt={att.file.name}
                                            className="w-[240px] h-[240px] object-cover rounded-large"
                                        />
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Tooltip content="Download full size">
                                                <IconButton
                                                    variant="standard"
                                                    size="small"
                                                    style={{ backgroundColor: 'rgba(var(--color-on-primary-rgb), 0.7)' }}
                                                    className="!text-on-surface-variant"
                                                    onClick={() => handleDownload(att.previewUrl, att.file.name)}
                                                    aria-label={`Download ${att.file.name}`}
                                                >
                                                    <Icon>download</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                );
                            } else if (att.previewUrl && att.file.type.startsWith('video/')) {
                                return (
                                    <div key={att.id} className="w-full max-w-[708px]">
                                        <VideoPlayer src={att.previewUrl} poster={att.posterUrl} />
                                    </div>
                                )
                            }
                            return null;
                        })}
                    </div>
                )}
                






                {!hideActions && (
                    <div className={cn(
                        "flex items-center gap-2 -ml-2",
                        hasAttachments ? 'mt-4' : (hasCode || hasTextContent) ? 'mt-2' : 'mt-0'
                    )}>
                        <IconButton size="xsmall" variant="standard" aria-label="Good response"><Icon>thumb_up</Icon></IconButton>
                        <IconButton size="xsmall" variant="standard" aria-label="Bad response"><Icon>thumb_down</Icon></IconButton>
                        <IconButton size="xsmall" variant="standard" aria-label="Regenerate"><Icon>refresh</Icon></IconButton>
                        <IconButton size="xsmall" variant="standard" aria-label="Share"><Icon>share</Icon></IconButton>
                        <IconButton size="xsmall" variant="standard" aria-label="More options"><Icon>more_vert</Icon></IconButton>
                    </div>
                )}
            </div>
        </div>
    );
};