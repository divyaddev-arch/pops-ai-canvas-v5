import React, { useRef, useEffect, useId } from 'react';
import { Icon } from '../Icons';
import { IconButton } from './IconButton';
import { Divider } from './Divider';
import { Scrollbar } from './Scrollbar';
import { Menu } from './Menu';
import { ListItem } from './ListItem';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch?: (query:string) => void;
  active: boolean;
  onActiveChange: (active: boolean) => void;
  placeholder?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children?: React.ReactNode;
  variant?: 'full-view' | 'inline' | 'inline-nav' | 'inline-nav-expanded';
  size?: 'small' | 'medium';
  label?: string; // For inline-nav
  isNavExpanded?: boolean; // For inline-nav
  inactiveAppearance?: 'nav-item' | 'section-header';
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(({
  query,
  onQueryChange,
  onSearch,
  active,
  onActiveChange,
  placeholder = "Search",
  leadingIcon,
  trailingIcon,
  children,
  className,
  variant = 'full-view',
  size = 'small',
  inactiveAppearance = 'nav-item',
  label,
  isNavExpanded,
  onKeyDown,
  ...props
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (active && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [active]);
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    if(e.key === 'Enter') {
        onSearch?.(query);
        if (variant === 'inline' || variant === 'inline-nav' || variant === 'inline-nav-expanded') {
          onActiveChange(false);
          inputRef.current?.blur();
        }
    }
    if (e.key === 'Escape' && (variant === 'inline' || variant === 'inline-nav' || variant === 'inline-nav-expanded')) {
      onActiveChange(false);
      inputRef.current?.blur();
    }
  };

  const menuItems = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      const el = child as React.ReactElement<any>;
      return React.cloneElement(el, {
        onMouseDown: (e: React.MouseEvent) => {
            e.preventDefault();
            el.props.onMouseDown?.(e);
        },
      });
    }
    return child;
  });

  const hasChildren = React.Children.count(children) > 0;
  const isMenuOpen = active && hasChildren;
  const menuWidth = containerRef.current?.offsetWidth;
  
  if (variant === 'full-view') {
    if (!active) {
      return (
        <div ref={ref} className={cn("w-full h-[56px]", className)} {...props}>
            <button
              type="button"
              onClick={() => onActiveChange(true)}
              className={cn(
                  'w-full h-full flex items-center pl-4 pr-2 rounded-full',
                  'bg-surface-container-low shadow-sm text-on-surface-variant'
              )}
              aria-label={placeholder}
            >
              {leadingIcon || <Icon className="text-2xl">search</Icon>}
              <span className="body-large ml-4 flex-1 text-left">{placeholder}</span>
              <span onClick={(e) => e.stopPropagation()}>{trailingIcon}</span>
            </button>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("w-full h-full bg-surface-container-high flex flex-col shadow-lg", className)}
        {...props}
      >
        <header className="h-[56px] flex items-center flex-shrink-0 pr-2">
          <IconButton onClick={() => onActiveChange(false)} aria-label="Back">
            <Icon>arrow_back</Icon>
          </IconButton>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            className="flex-1 h-full bg-transparent outline-none body-large text-on-surface placeholder:text-on-surface-variant mx-2"
          />
          {trailingIcon}
        </header>
        <Divider />
        <div className="flex-1 min-h-0">
          <Scrollbar>
            <ul>
              {children}
            </ul>
          </Scrollbar>
        </div>
      </div>
    );
  }
  
  if (variant === 'inline-nav') {
      const isSectionHeader = inactiveAppearance === 'section-header';

      const handleSearchIconClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (!active) {
              onActiveChange(true);
          } else {
              onSearch?.(query);
          }
      };
      
      const containerOnClick = () => {
          if (!active && !isSectionHeader) {
              onActiveChange(true);
          }
      }
      
      const isMedium = size === 'medium';
      const heightClass = isMedium ? 'h-[48px]' : 'h-[36px]';
      const labelTypographyClass = isMedium ? 'body-large' : 'label-medium';
      
      return (
          <div ref={containerRef} className={cn("relative w-full", className)}>
              <div
                  ref={ref}
                  className={cn(
                      "relative w-full flex items-center overflow-hidden transition-colors duration-200 ease-in-out",
                      heightClass,
                      active ? 'bg-surface-container rounded-full' : 'bg-transparent',
                      !active && !isSectionHeader && 'rounded-full hover:bg-on-surface/5 cursor-pointer',
                  )}
                  onClick={containerOnClick}
                  {...props}
              >
                  <div className={cn(
                      'absolute left-0 top-0 h-full flex items-center transition-all duration-200 ease-in-out pointer-events-none pl-3',
                      active ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0',
                      !isNavExpanded && !isSectionHeader && 'w-full justify-center !pl-0'
                  )}>
                      {isNavExpanded && <span className={cn("truncate", isSectionHeader ? "label-large" : labelTypographyClass, "text-on-surface-variant")}>{label}</span>}
                  </div>

                  <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => onQueryChange(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      placeholder={placeholder}
                      className={cn(
                          "w-full h-full bg-transparent outline-none body-large text-on-surface placeholder:text-on-surface-variant transition-opacity duration-200",
                          "pl-4 pr-12",
                          active ? 'opacity-100' : 'opacity-0'
                      )}
                      disabled={!active}
                  />
                  
                  <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <IconButton size="xsmall" onClick={handleSearchIconClick} aria-label={`Search ${label}`}>
                          <Icon className="text-on-surface-variant">search</Icon>
                      </IconButton>
                  </div>
              </div>
              
              <Menu
                  anchorEl={containerRef.current}
                  open={isMenuOpen}
                  onClose={() => onActiveChange(false)}
                  className="!p-0"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  style={{ width: menuWidth, marginTop: '8px' }}
                  disableAutoFocus
              >
                <Scrollbar className="max-h-[260px]">
                    <div id={listboxId} role="listbox">
                        <ul>{menuItems}</ul>
                    </div>
                </Scrollbar>
              </Menu>
          </div>
      );
  }

  if (variant === 'inline-nav-expanded') {
      const isMedium = size === 'medium';
      const heightClass = isMedium ? 'h-[48px]' : 'h-[36px]';
      const iconSizeClass = 'text-[20px]';

      const sizedLeadingIcon = leadingIcon && React.isValidElement(leadingIcon)
        ? React.cloneElement((leadingIcon as React.ReactElement<any>), { className: cn((leadingIcon as React.ReactElement<any>).props.className, iconSizeClass) })
        : <Icon className={iconSizeClass}>search</Icon>;
      
      const finalTrailingIcon = query ? (
          <IconButton size="xsmall" onClick={() => onQueryChange('')} aria-label="Clear query">
              <Icon>close</Icon>
          </IconButton>
      ) : trailingIcon;

      return (
          <div ref={containerRef} className={cn("relative w-full", className)}>
              <div
                  ref={ref}
                  className={cn(
                      "relative w-full flex items-center overflow-hidden transition-colors duration-200 ease-in-out",
                      heightClass,
                      'bg-surface-container rounded-full'
                  )}
                  {...props}
              >
                  <div className="absolute left-0 top-0 h-full flex items-center pl-3 pointer-events-none">
                      <div className="text-on-surface-variant">{sizedLeadingIcon}</div>
                  </div>
                  
                  <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => onQueryChange(e.target.value)}
                      onFocus={() => onActiveChange(true)}
                      onKeyDown={handleInputKeyDown}
                      placeholder={placeholder}
                      className={cn(
                          "w-full h-full bg-transparent outline-none label-medium text-on-surface placeholder:text-on-surface-variant",
                          "pl-11",
                          finalTrailingIcon ? "pr-12" : "pr-4"
                      )}
                  />
                  
                  {finalTrailingIcon && (
                      <div className="absolute right-1 top-1/2 -translate-y-1/2">
                          {finalTrailingIcon}
                      </div>
                  )}
              </div>
              
              <Menu
                  anchorEl={containerRef.current}
                  open={isMenuOpen}
                  onClose={() => onActiveChange(false)}
                  className="!p-0"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  style={{ width: menuWidth, marginTop: '8px' }}
                  disableAutoFocus
              >
                <Scrollbar className="max-h-[260px]">
                    <div id={listboxId} role="listbox">
                        <ul>{menuItems}</ul>
                    </div>
                </Scrollbar>
              </Menu>
          </div>
      );
  }
  
  // --- Inline Variant Logic ---
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      {...props}
    >
      <div
        ref={ref}
        onClick={handleContainerClick}
        className='w-full h-[56px] flex items-center pl-4 pr-2 rounded-full bg-surface-container-low shadow-sm text-on-surface-variant cursor-text'
      >
        {leadingIcon || <Icon className="text-2xl">search</Icon>}
        <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => onActiveChange(true)}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            className="flex-1 h-full bg-transparent outline-none body-large text-on-surface placeholder:text-on-surface-variant mx-4"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isMenuOpen}
            aria-controls={isMenuOpen ? listboxId : undefined}
        />
        {trailingIcon}
      </div>
      <Menu
          anchorEl={containerRef.current}
          open={isMenuOpen}
          onClose={() => onActiveChange(false)}
          className="!p-0"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          style={{ width: menuWidth, marginTop: '8px' }}
          disableAutoFocus
      >
          <Scrollbar className="max-h-[260px]">
              <div id={listboxId} role="listbox">
                  <ul>{menuItems}</ul>
              </div>
          </Scrollbar>
      </Menu>
    </div>
  );
});
SearchBar.displayName = 'SearchBar';
