import React from 'react';
import { PanelLeft, Inbox } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: (tab?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenSettings }) => {
  return (
    <header className="absolute top-0 left-0 right-0 p-3 md:p-4 flex justify-between items-center z-30 pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto">
        <Tooltip content="Toggle Sidebar" position="bottom" delay={500}>
          <button 
            onClick={onToggleSidebar}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Toggle Sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        </Tooltip>
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Logo Only */}
          <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">Lovable</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto relative">
        <Tooltip content="Notifications" position="bottom" delay={500}>
          <button className="relative p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <Inbox className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0a]"></span>
          </button>
        </Tooltip>
      </div>
    </header>
  );
};