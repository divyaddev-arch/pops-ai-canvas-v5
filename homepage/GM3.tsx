import React from 'react';
import { cn } from '../src/lib/utils';

// Icon component using Material Symbols
export const Icon: React.FC<{ children: string; className?: string }> = ({ children, className }) => (
  <span className={cn("material-symbols-outlined", className)}>
    {children}
  </span>
);

// IconButton component
export const IconButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  title?: string;
}> = ({ children, onClick, disabled, className, id, title }) => (
  <button
    id={id}
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "p-2 rounded-full hover:bg-black/5 active:bg-black/10 disabled:opacity-38 disabled:cursor-not-allowed transition-colors flex items-center justify-center",
      className
    )}
  >
    {children}
  </button>
);

// Button component
export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'filled' | 'outlined' | 'text' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
  id?: string;
}> = ({ children, onClick, variant = 'filled', size = 'medium', className, disabled, id }) => {
  const variants = {
    filled: "bg-[#0B57D0] text-white hover:shadow-elevation-1",
    outlined: "border border-outline text-primary hover:bg-primary/5",
    text: "text-primary hover:bg-primary/5",
    tonal: "bg-secondary-container text-on-secondary-container hover:shadow-elevation-1",
  };

  const sizes = {
    small: "h-8 px-4 text-xs",
    medium: "h-10 px-6 text-sm",
    large: "h-12 px-8 text-base",
  };

  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full font-google-sans font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-38 disabled:cursor-not-allowed",
        variants[variant as keyof typeof variants] || variants.filled,
        sizes[size as keyof typeof sizes] || sizes.medium,
        className
      )}
    >
      {children}
    </button>
  );
};

// TextField component
export const TextField: React.FC<{
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  multiline?: boolean;
  autoGrow?: boolean;
  noLabel?: boolean;
  variant?: string;
  className?: string;
  containerClassName?: string;
  inputClassName?: string;
  id?: string;
}> = ({
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
  multiline,
  autoGrow,
  className,
  containerClassName,
  inputClassName,
  id
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (multiline && autoGrow && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, multiline, autoGrow]);

  const commonProps = {
    placeholder,
    value,
    onChange,
    onKeyDown,
    id,
    className: cn(
      "w-full bg-transparent border-none focus:ring-0 focus:outline-none outline-none p-0 text-base text-on-surface placeholder:text-on-surface-variant",
      inputClassName
    ),
  };

  return (
    <div className={cn("flex flex-col w-full", containerClassName, className)}>
      {multiline ? (
        <textarea 
          {...commonProps as any} 
          ref={textareaRef}
          rows={1} 
          className={cn(commonProps.className, "resize-none overflow-hidden")} 
        />
      ) : (
        <input type="text" {...commonProps as any} />
      )}
    </div>
  );
};

// Chip component
export const Chip: React.FC<{
  label: string;
  leadingIcon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ label, leadingIcon, onClick, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "h-8 px-3 rounded-lg border border-outline flex items-center gap-2 hover:bg-black/5 transition-colors text-sm font-medium text-on-surface",
      className
    )}
  >
    {leadingIcon}
    {label}
  </button>
);

// Card component
export const Card: React.FC<{
  children: React.ReactNode;
  variant?: 'elevated' | 'filled' | 'outlined';
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = 'elevated', className, onClick }) => {
  const variants = {
    elevated: "bg-surface shadow-elevation-1 hover:shadow-elevation-2",
    filled: "bg-surface-container-highest",
    outlined: "bg-surface border border-outline",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl transition-all",
        variants[variant as keyof typeof variants],
        className
      )}
    >
      {children}
    </div>
  );
};

// Badge component
export const Badge: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <span className={cn(
    "inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-error text-on-error",
    className
  )}>
    {children}
  </span>
);

// TopAppBar component
export const TopAppBar: React.FC<{
  title: string;
  avatarInitial?: string;
  actions?: Array<{ id: string; icon: React.ReactNode; label: string }>;
  onActionClick?: (id: string) => void;
  showMenu?: boolean;
  showSearch?: boolean;
}> = ({ title, avatarInitial, actions, onActionClick }) => (
  <header className="h-16 px-4 flex items-center justify-between bg-surface border-b border-outline-variant shrink-0 z-50">
    <div className="flex items-center gap-4">
      <IconButton><Icon>menu</Icon></IconButton>
      <h1 className="text-xl font-google-sans text-on-surface">{title}</h1>
    </div>
    <div className="flex items-center gap-2">
      {actions?.map(action => (
        <IconButton key={action.id} onClick={() => onActionClick?.(action.id)} title={action.label}>
          {typeof action.icon === 'string' ? <Icon>{action.icon}</Icon> : action.icon}
        </IconButton>
      ))}
      {avatarInitial && (
        <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-medium ml-2">
          {avatarInitial}
        </div>
      )}
    </div>
  </header>
);

// SideNav component
export const SideNav: React.FC<{
  destinations: any[];
  onDestinationClick?: (dest: any) => void;
  onFabClick?: () => void;
  className?: string;
  id?: string;
  fabIcon?: string;
  secondarySections?: any[];
  onItemClick?: (item: any) => void;
}> = ({ destinations, onDestinationClick, onFabClick, className, fabIcon }) => (
  <nav className={cn("w-20 flex flex-col items-center py-4 bg-surface-container-low border-r border-outline-variant shrink-0", className)}>
    {fabIcon && (
      <button
        onClick={onFabClick}
        className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-4 hover:shadow-elevation-2 transition-shadow"
      >
        <Icon>{fabIcon}</Icon>
      </button>
    )}
    <div className="flex flex-col gap-4 w-full items-center">
      {destinations.map((dest, i) => (
        <button
          key={i}
          onClick={() => onDestinationClick?.(dest)}
          className={cn(
            "flex flex-col items-center gap-1 w-full group",
            dest.selected ? "text-on-surface" : "text-on-surface-variant"
          )}
        >
          <div className={cn(
            "w-14 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-on-surface-variant/10",
            dest.selected && "bg-secondary-container text-on-secondary-container"
          )}>
            <Icon>{dest.icon}</Icon>
          </div>
          <span className="text-[11px] font-medium">{dest.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

// AiInput component
export const AiInput: React.FC<{
  onSend: (text: string) => void;
  placeholder?: string;
}> = ({ onSend, placeholder }) => {
  const [value, setValue] = React.useState('');
  return (
    <div className="flex items-center gap-2 p-2 bg-surface-container-high rounded-full border border-outline focus-within:border-primary transition-colors">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) {
            onSend(value);
            setValue('');
          }
        }}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none px-4 py-1 text-sm"
      />
      <IconButton
        onClick={() => {
          if (value.trim()) {
            onSend(value);
            setValue('');
          }
        }}
        disabled={!value.trim()}
        className="bg-primary text-on-primary disabled:bg-surface-container-highest"
      >
        <Icon>send</Icon>
      </IconButton>
    </div>
  );
};

// Snackbar component
export const Snackbar: React.FC<{
  open: boolean;
  message: string;
  onClose: () => void;
}> = ({ open, message, onClose }) => {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-[#323232] text-[#F5F5F5] px-4 py-3 rounded shadow-lg flex items-center justify-between min-w-[288px] max-w-[568px]">
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-4 text-[#D0BCFF] text-sm font-medium hover:bg-white/10 px-2 py-1 rounded">
        Dismiss
      </button>
    </div>
  );
};

// Custom SVG Icons
export const MyGoogleLogo = ({ id, className }: { id?: string; className?: string }) => (
  <svg
    id={id}
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const SendIcon = ({ id, className }: { id?: string; className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    id={id}
    className={className}
  >
    <path
      d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
      fill="currentColor"
    />
  </svg>
);
