
import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { Icon } from '../components/Icons.tsx';
import { IconButton } from '../components/gm3/IconButton.tsx';
import { Scrollbar } from '../components/gm3/Scrollbar.tsx';
import { Header } from '../components/gm3/Header.tsx';
import { ButtonGroup } from '../components/gm3/ButtonGroup.tsx';
import { Button } from '../components/gm3/Button.tsx';
import { ExpansionPanel } from '../components/gm3/ExpansionPanel.tsx';
import { Tooltip } from '../components/gm3/Tooltip.tsx';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

declare global {
    interface Window {
        hljs?: any;
    }
}

const CodePreview = ({ code }: { code: string }) => {
    return (
        <iframe
            srcDoc={code}
            title="Code Preview"
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts"
        />
    );
};


interface EditableCodeViewerProps {
    code: string;
    onCodeChange: (newCode: string) => void;
    language?: string;
}

const EditableCodeViewer = ({ code, onCodeChange, language = 'html' }: EditableCodeViewerProps) => {
    const codeElRef = useRef<HTMLElement>(null);
    const cursorPositionRef = useRef<number | null>(null);
    const [isHljsLoaded, setIsHljsLoaded] = useState(false);

    const [lineCount, setLineCount] = useState(0);
    const [lineHeight, setLineHeight] = useState(21); // Default line height

    const saveSelection = useCallback((element: Node) => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(element);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            return preSelectionRange.toString().length;
        }
        return 0;
    }, []);

    const restoreSelection = useCallback((element: Node, position: number | null) => {
        if (position === null || position < 0) return;
        const selection = window.getSelection();
        if (!selection) return;

        const range = document.createRange();
        let charIndex = 0;
        const nodeStack: Node[] = [element];
        let node: Node | undefined;
        let foundStart = false;
        
        range.setStart(element, 0);
        range.collapse(true);

        while ((node = nodeStack.shift())) {
            if (node.nodeType === Node.TEXT_NODE) {
                const nodeLength = node.textContent?.length || 0;
                const nextCharIndex = charIndex + nodeLength;
                if (!foundStart && position >= charIndex && position <= nextCharIndex) {
                    range.setStart(node, position - charIndex);
                    range.collapse(true);
                    foundStart = true;
                }
                charIndex = nextCharIndex;
            } else {
                let i = node.childNodes.length;
                while (i--) {
                    nodeStack.unshift(node.childNodes[i]);
                }
            }
            if (foundStart) break;
        }

        selection.removeAllRanges();
        selection.addRange(range);
    }, []);

    useEffect(() => {
        if (window.hljs) {
            setIsHljsLoaded(true);
            return;
        }
        const interval = setInterval(() => {
            if (window.hljs) {
                setIsHljsLoaded(true);
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useLayoutEffect(() => {
        const element = codeElRef.current;
        if (element) {
            const computedStyle = window.getComputedStyle(element);
            const lh = parseFloat(computedStyle.lineHeight);
            if (!isNaN(lh)) setLineHeight(lh);
        }
        setLineCount(code.split('\n').length);
    }, [code]);

    useLayoutEffect(() => {
        const element = codeElRef.current;
        if (element && isHljsLoaded && window.hljs) {
            const highlightedHtml = window.hljs.highlight(code, { language }).value;
            element.innerHTML = highlightedHtml;
            restoreSelection(element, cursorPositionRef.current);
        }
    }, [code, language, isHljsLoaded, restoreSelection]);

    useEffect(() => {
        const element = codeElRef.current;
        if (!element) return;

        const handleInput = () => {
            cursorPositionRef.current = saveSelection(element);
            onCodeChange(element.innerText || '');
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                event.preventDefault();

                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) return;

                const range = selection.getRangeAt(0);
                const startContainer = range.startContainer;

                if (!element.contains(startContainer) || startContainer.nodeType !== Node.TEXT_NODE) {
                    if (!event.shiftKey) {
                        document.execCommand('insertText', false, '  ');
                    }
                    return;
                }

                const startOffset = range.startOffset;
                const textContent = startContainer.textContent || '';

                if (event.shiftKey) {
                    const beforeCaret = textContent.substring(0, startOffset);
                    let spacesToRemove = 0;
                    if (beforeCaret.endsWith('  ')) {
                        spacesToRemove = 2;
                    } else if (beforeCaret.endsWith(' ')) {
                        spacesToRemove = 1;
                    }

                    if (spacesToRemove > 0) {
                        startContainer.textContent = beforeCaret.slice(0, -spacesToRemove) + textContent.substring(startOffset);
                        range.setStart(startContainer, startOffset - spacesToRemove);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                } else {
                    const beforeCaret = textContent.substring(0, startOffset);
                    const afterCaret = textContent.substring(startOffset);
                    startContainer.textContent = beforeCaret + '  ' + afterCaret;
                    
                    range.setStart(startContainer, startOffset + 2);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }

                element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            }
        };

        const handlePaste = (event: ClipboardEvent) => {
            event.preventDefault();
            const text = event.clipboardData?.getData('text/plain') || '';
            // Using execCommand is a robust way to insert text at the cursor
            // in a contentEditable element and it triggers the 'input' event.
            document.execCommand('insertText', false, text);
        };

        element.addEventListener('input', handleInput);
        element.addEventListener('keydown', handleKeyDown);
        element.addEventListener('paste', handlePaste);

        return () => {
            element.removeEventListener('input', handleInput);
            element.removeEventListener('keydown', handleKeyDown);
            element.removeEventListener('paste', handlePaste);
        };
    }, [onCodeChange, saveSelection]);
    
    // Set initial content
    useEffect(() => {
        const element = codeElRef.current;
        if (element && element.innerText !== code) {
             if (isHljsLoaded && window.hljs) {
                const highlightedHtml = window.hljs.highlight(code, { language }).value;
                element.innerHTML = highlightedHtml;
            } else {
                element.innerText = code;
            }
        }
    }, [isHljsLoaded]); // Only on initial highlight.js load

    return (
        <div className="bg-surface-container text-[14px] font-google-code h-full overflow-hidden">
            <Scrollbar orientation="horizontal" className="h-full canvas-horizontal-scrollbar">
                <Scrollbar orientation="vertical" className="h-full w-max-content canvas-code-scrollbar">
                    <div className="flex">
                        <div className="font-google-code text-[14px] pl-[25px] pr-[11px] text-right text-cyan-40 select-none sticky left-0 bg-surface-container z-10 flex-shrink-0">
                            {Array.from({ length: lineCount }, (_, i) => (
                                <div key={i} style={{ height: `${lineHeight}px`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        <pre className="relative m-0 p-0">
                            <code
                                ref={codeElRef}
                                contentEditable="true"
                                spellCheck="false"
                                className="language-html hljs focus:outline-none focus:ring-0 whitespace-pre block !bg-transparent pl-4 pr-1"
                                style={{ lineHeight: `${lineHeight}px` }}
                            />
                        </pre>
                    </div>
                </Scrollbar>
            </Scrollbar>
        </div>
    );
};


export interface CanvasProps {
  title: string;
  initialCode?: string;
  initialView?: 'code' | 'preview';
  initialConsoleVisible?: boolean;
  variant?: 'default' | 'expansions';
  headerDividerClassName?: string;
}

export const Canvas: React.FC<CanvasProps> = ({
  title,
  initialCode = '',
  initialView = 'preview',
  initialConsoleVisible = false,
  variant = 'default',
  headerDividerClassName,
}) => {
  const [view, setView] = useState<'code' | 'preview'>(initialView);
  const [code, setCode] = useState(initialCode);
  const [isConsoleVisible, setIsConsoleVisible] = useState(initialConsoleVisible);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState([false, true, true]); // Settings, System instructions, Minimap

  const togglePanel = (index: number) => {
    setExpandedPanels(currentPanels => {
      const newPanels = [...currentPanels];
      newPanels[index] = !newPanels[index];
      
      const lastPanelIndex = newPanels.length - 1;
      const secondToLastPanelIndex = newPanels.length - 2;
      
      // If the last panel was just collapsed...
      if (index === lastPanelIndex && !newPanels[lastPanelIndex]) {
        // ...and all other panels are also collapsed...
        const allOthersCollapsed = newPanels.every((isExpanded, i) => i === lastPanelIndex || !isExpanded);
        
        if (allOthersCollapsed) {
          // ...then expand the second-to-last panel.
          if (secondToLastPanelIndex >= 0) {
            newPanels[secondToLastPanelIndex] = true;
          }
        }
      }
      
      return newPanels;
    });
  };

  
  return (
    <div className={cn(
      "h-full w-full flex flex-col bg-surface-container-low rounded-large border border-surface-container-highest relative overflow-hidden",
      variant === 'expansions' && "min-w-[400px] max-w-[532px]"
    )}>
      {/* Header */}
      <Header
        variant="canvas"
        title={title}
        className={cn("!border-b", headerDividerClassName || "!border-surface-container-highest")}
        centerActions={
          <>
            <Tooltip content="Changes saved">
              <IconButton size="xsmall" aria-label="Auto-saving to cloud"><Icon>cloud_done</Icon></IconButton>
            </Tooltip>
            <Tooltip content="Previous version">
              <IconButton size="xsmall" aria-label="Undo"><Icon>undo</Icon></IconButton>
            </Tooltip>
            <Tooltip content="Next version">
              <IconButton size="xsmall" aria-label="Redo"><Icon>redo</Icon></IconButton>
            </Tooltip>
          </>
        }
      >
          <Tooltip content="Show console">
            <IconButton
                size="xsmall"
                variant={isConsoleVisible ? 'tonal' : 'standard'}
                onClick={() => setIsConsoleVisible(p => !p)}
                aria-label="Toggle Terminal"
                aria-pressed={isConsoleVisible}
            >
                <Icon className={cn(isConsoleVisible && 'filled-icon')}>terminal</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip content="Refresh">
            <IconButton
                size="xsmall"
                variant="standard"
                onClick={() => {}}
                aria-label="Refresh"
            >
                <Icon>refresh</Icon>
            </IconButton>
          </Tooltip>
          {variant === 'default' && (
            <ButtonGroup
                variant="gm2-segmented"
                value={view}
                onValueChange={(v) => setView(v as 'code' | 'preview')}
            >
                <Button variant="text" value="code">Code</Button>
                <Button variant="text" value="preview">Preview</Button>
            </ButtonGroup>
          )}
          <Button variant="tonal" size="xsmall" icon={<Icon className="text-[18px]">share</Icon>}>Share</Button>
          <IconButton size="xsmall" aria-label="Close"><Icon>close</Icon></IconButton>
      </Header>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative">
           {(() => {
                if (variant === 'default') {
                    if (view === 'preview') {
                        return (
                          <div className="p-8 h-full bg-surface">
                            <CodePreview code={code} />
                          </div>
                        );
                    }
                    if (view === 'code') {
                        return <EditableCodeViewer code={code} onCodeChange={setCode} />;
                    }
                }

                if (variant === 'expansions') {
                    return (
                        <div className="flex flex-col h-full">
                            <ExpansionPanel
                                headerVariant="full-width"
                                title="Settings"
                                hideTopBorder
                                isExpanded={expandedPanels[0]}
                                onToggleExpand={() => togglePanel(0)}
                            >
                                <p className="body-small">Content for settings goes here. Adjust various parameters and configurations for your canvas.</p>
                            </ExpansionPanel>
                            <ExpansionPanel
                                headerVariant="full-width"
                                title="System instructions"
                                className="-mt-px"
                                isExpanded={expandedPanels[1]}
                                onToggleExpand={() => togglePanel(1)}
                            >
                                <p className="body-small">Provide system-level instructions or context here. This can guide the behavior of models or applications within the canvas.</p>
                            </ExpansionPanel>
                            <ExpansionPanel
                                headerVariant="full-width"
                                title="Minimap"
                                className="-mt-px"
                                hideBottomBorder
                                isExpanded={expandedPanels[2]}
                                onToggleExpand={() => togglePanel(2)}
                            >
                                <p className="body-small">A minimap or an overview of the canvas content can be displayed here, providing a high-level view and quick navigation.</p>
                            </ExpansionPanel>
                        </div>
                    );
                }
                return null;
            })()}
      </div>
      
      {/* Console */}
      {isConsoleVisible && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-inverse-surface rounded-t-lg transition-[height] duration-300 ease-in-out",
            isConsoleExpanded ? "h-[calc(100%-65px)]" : "h-[253px]"
          )}
        >
          <div className="flex items-center justify-between h-12 px-4 flex-shrink-0">
            <span className="title-small text-inverse-on-surface pl-2">Console</span>
            <div className="flex items-center gap-2">
              <IconButton
                variant="standard"
                size="xsmall"
                className="!text-inverse-on-surface"
                onClick={() => setIsConsoleExpanded((p) => !p)}
                aria-label={isConsoleExpanded ? 'Collapse console' : 'Expand console'}
              >
                <Icon className={cn("transition-transform", isConsoleExpanded && "rotate-180")}>
                  expand_less
                </Icon>
              </IconButton>
              <IconButton
                variant="standard"
                size="xsmall"
                className="!text-inverse-on-surface"
                onClick={() => setIsConsoleVisible(false)}
                aria-label="Close console"
              >
                <Icon>close</Icon>
              </IconButton>
            </div>
          </div>
          <div
            className={cn(
              "h-[calc(100%-48px)] text-inverse-on-surface p-2 font-google-code text-sm overflow-hidden",
              isConsoleExpanded ? 'block' : 'hidden'
            )}
          >
            <Scrollbar>
              <p>&gt; Console output will appear here.</p>
            </Scrollbar>
          </div>
        </div>
      )}
    </div>
  );
};
