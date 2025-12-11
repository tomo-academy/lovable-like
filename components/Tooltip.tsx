import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  delay?: number;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top', 
  className = '',
  delay = 200,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (disabled) return <>{children}</>;

  return (
    <div 
      className={`relative flex items-center ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div 
          className={`
            absolute z-[100] px-2.5 py-1.5 text-[11px] font-medium tracking-wide text-white bg-gray-900 dark:bg-gray-800 rounded-lg shadow-xl border border-white/5 whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150
            ${position === 'right' ? 'left-full ml-2.5 top-1/2 -translate-y-1/2' : ''}
            ${position === 'top' ? 'bottom-full mb-2.5 left-1/2 -translate-x-1/2' : ''}
            ${position === 'bottom' ? 'top-full mt-2.5 left-1/2 -translate-x-1/2' : ''}
            ${position === 'left' ? 'right-full mr-2.5 top-1/2 -translate-y-1/2' : ''}
          `}
        >
          {content}
          {/* Tiny Arrow */}
          <div 
            className={`
              absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45 border-white/5
              ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l' : ''}
              ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b' : ''}
              ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-t border-l' : ''}
              ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
};