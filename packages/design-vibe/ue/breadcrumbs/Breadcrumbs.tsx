import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { IconButton, Button, Menu, MenuItem, Icon as MaterialIcon } from "@my-google-project/gm3-react-components";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  maxItems?: number;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  maxItems = 5,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<BreadcrumbItem[]>([]);
  const [hiddenItems, setHiddenItems] = useState<BreadcrumbItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  // We need to measure items to know how many fit
  // Simple approach: Always show first and last, collapse middle
  // If we have resizing, we need to know the width of the container
  // and the width of each item.

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    // Logic to determine visible items
    // This is a heuristic/simplified version because true width calculation requires rendering
    // For now, we rely on maxItems and a rough "if container is small, reduce maxItems" (optional)
    // or just strictly follow maxItems for the count logic, and let the user handle the width via maxItems prop if needed?
    // The prompt says: "listen to the width of the conatiner and hide or show the breadcrumb item"
    // So we MUST handle width.

    // To do this properly without layout trashing or complex 2-pass rendering:
    // We can assume an average item width or try to fit.
    // Better approach for exactness:
    // 1. Render all items (invisible)
    // 2. Measure summated width
    // 3. If > containerWidth, hide one more from the middle
    // 4. Repeat until fits or only 1-2 items left.

    // Implementation nuance: We can't easily "render all invisible" in the same pass without flickering.
    // Instead, we can try to fit based on an estimated width or just basic overflow handling.
    // Given the complexity of "exact pixel fitting" in React without strict control,
    // I will implement a "Greedy" approach with a hidden measurement container if needed,
    // or simply use the `maxItems` as a hard cap, and THEN reduce that cap if width is small (e.g. < 400px -> 3 items).

    // Let's do a refined approach:
    // 1. Start with `renderCount = min(items.length, maxItems)`
    // 2. If containerWidth is very small (e.g. < 500px), force `renderCount = 3` or `2`.

    // Actually, to truly "listen to width", we should measure.
    // But since I can't modify the DOM easily in a loop in UseLayoutEffect without painting,
    // I'll stick to a logic verifying if we overflow.
    // Use `scrollWidth > clientWidth` check?
    // Browsers don't easily tell us "you are overflowing" for flex items unless we wrap or scroll.

    // Let's implement the logic requested: "concat the second from first item"
    // implies: [0] ... [N-x] ... [N]

    calculateVisibility();
  }, [items, maxItems, containerWidth]);

  const calculateVisibility = () => {
    if (!containerRef.current) return;

    // Default to maxItems
    let allowedItems = maxItems;

    // Simple responsive heuristic based on container width
    // Assuming approx 100-150px per item?
    // If container is 300px, we can maybe fit 2 items.
    const approximateItemWidth = 120; // conservative estimate
    const maxFitting = Math.floor(containerWidth / approximateItemWidth);

    if (maxFitting < allowedItems) {
      allowedItems = Math.max(2, maxFitting); // Always show at least 2 (Head + Tail or Head + Active)
    }

    if (items.length <= allowedItems) {
      setVisibleItems(items);
      setHiddenItems([]);
      return;
    }

    // Collapse logic
    // Always keep Index 0 (Home/Root)
    // Always keep Last Index (Current/Active)
    // collapse items between 0 and (total - (allowed - 2))
    // Example: 10 items, allow 5.
    // Keep 0.
    // Keep 9, 8, 7 (3 tail items).
    // Total visible: 1 (Head) + 1 (Ellipsis) + 3 (Tail) = 5 slots used.

    // Slots for actual items = allowedItems - 1 (Ellipsis takes 1 slot if we have hidden items)
    // Actually ellipsis takes a slot.
    // visible = [0] + [ ellipsis ] + [ ...tail ]
    // tail length = allowedItems - 2 (Head + Ellipsis)

    const tailCount = Math.max(1, allowedItems - 2);
    const tailStartIndex = items.length - tailCount;

    // Hidden are from index 1 to tailStartIndex - 1
    const newHidden = items.slice(1, tailStartIndex);
    const newVisibleHead = [items[0]];
    const newVisibleTail = items.slice(tailStartIndex);

    setVisibleItems([...newVisibleHead, ...newVisibleTail]);
    setHiddenItems(newHidden);
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(e.currentTarget);
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    setMenuAnchor(null); // Cleanup
  };

  return (
    <nav
      className={`flex items-center text-sm ${className}`}
      ref={containerRef}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center whitespace-nowrap overflow-hidden">
        {hiddenItems.length > 0 && items.length > 0 ? (
          <>
            {/* First Item */}
            <BreadcrumbItemView item={items[0]} isLast={false} />

            {/* Separator */}
            <li className="flex items-center text-on-surface-variant mx-1">
              <MaterialIcon className="text-[20px]">chevron_right</MaterialIcon>
            </li>

            {/* Ellipsis */}
            <li className="flex items-center">
              <IconButton
                size="xsmall"
                onClick={handleMenuOpen}
                aria-label="Show path"
                aria-expanded={isMenuOpen}
              >
                <MaterialIcon>more_horiz</MaterialIcon>
              </IconButton>

              <Menu
                anchorEl={menuAnchor}
                open={isMenuOpen}
                onClose={handleMenuClose}
              >
                {hiddenItems.map((hiddenItem, index) => (
                  <MenuItem
                    key={index}
                    headline={hiddenItem.label}
                    onClick={() => {
                      handleMenuClose();
                      hiddenItem.onClick?.();
                      if (hiddenItem.href)
                        window.location.href = hiddenItem.href; // Simple nav
                    }}
                  />
                ))}
              </Menu>
            </li>

            {/* Separator after ellipsis */}
            <li className="flex items-center text-on-surface-variant mx-1">
              <MaterialIcon className="text-[20px]">chevron_right</MaterialIcon>
            </li>

            {/* Tail Items */}
            {visibleItems.slice(1).map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItemView
                  item={item}
                  isLast={index === visibleItems.slice(1).length - 1}
                />
                {index < visibleItems.slice(1).length - 1 && (
                  <li className="flex items-center text-on-surface-variant mx-1">
                    <MaterialIcon className="text-[20px]">
                      chevron_right
                    </MaterialIcon>
                  </li>
                )}
              </React.Fragment>
            ))}
          </>
        ) : (
          // No hiding, show all
          visibleItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItemView
                item={item}
                isLast={index === visibleItems.length - 1}
              />
              {index < visibleItems.length - 1 && (
                <li className="flex items-center text-on-surface-variant mx-1">
                  <MaterialIcon className="text-[20px]">
                    chevron_right
                  </MaterialIcon>
                </li>
              )}
            </React.Fragment>
          ))
        )}
      </ol>
    </nav>
  );
};

const BreadcrumbItemView: React.FC<{
  item: BreadcrumbItem;
  isLast: boolean;
}> = ({ item, isLast }) => {
  const handleClick = () => {
    item.onClick?.();
    if (item.href) {
      window.location.href = item.href;
    }
  };

  if (isLast) {
    return (
      <li className="flex items-center">
        <span className="label-large px-3 text-on-surface" aria-current="page">
          {item.label}
        </span>
      </li>
    );
  }

  return (
    <li className="flex items-center">
      <Button
        variant="text"
        size="xsmall"
        onClick={handleClick}
        className="!text-on-surface-variant hover:!text-on-surface"
      >
        {item.label}
      </Button>
    </li>
  );
};
