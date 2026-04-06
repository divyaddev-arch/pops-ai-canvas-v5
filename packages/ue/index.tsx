import React, { useEffect } from 'react';

// Primitive Components for UE Boilerplate

export const Button = ({ children, className = '', variant, ...props }: any) => (
  <button 
    className={`flex items-center justify-center transition-colors ${className}`} 
    {...props}
  >
    {children}
  </button>
);

export const Icon = ({ children, className = '' }: { children: string, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{children}</span>
);

export const IconButton = ({ children, className = '', ...props }: any) => (
  <button 
    className={`flex items-center justify-center p-2 rounded-full hover:bg-black/5 transition-colors disabled:opacity-50 ${className}`} 
    {...props}
  >
    {children}
  </button>
);

export const Chip = ({ label, leadingIcon, onClick, className = '' }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-sm font-medium ${className}`}
  >
    {leadingIcon}
    <span>{label}</span>
  </button>
);

export const Snackbar = ({ open, message, onClose }: any) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-[#323639] text-white p-3 rounded-lg shadow-lg flex items-center justify-between gap-4 z-[100]">
      <span>{message}</span>
      <button onClick={onClose} className="text-[#A8C7FA] hover:text-[#D3E3FD] text-sm font-medium">Dismiss</button>
    </div>
  );
};

export const TextField = ({ 
  multiline, 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  inputClassName = '', 
  onKeyDown,
  containerClassName,
  ...props 
}: any) => {
  const Component = multiline ? 'textarea' : 'input';
  return (
    <div className={containerClassName}>
      <Component
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        className={`${Component === 'textarea' ? 'resize-none' : ''} ${inputClassName} ${className}`}
        {...props}
      />
    </div>
  );
};

export * from './ContextualAppBar';
export * from './NavigationRail';
export * from './SideAgent';
