import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, MonitorSmartphone, ChevronRight, ChevronDown, Check } from 'lucide-react';

export type Theme = 'light' | 'dark' | 'system';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  initialTab?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, theme, onThemeChange, initialTab = 'general' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Mock heatmap generation
  const renderHeatmap = () => {
    const weeks = 52;
    const days = 7;
    const grid = [];

    for (let w = 0; w < weeks; w++) {
      const weekColumn = [];
      for (let d = 0; d < days; d++) {
        // Randomly assign activity levels for visual similarity to screenshot
        // Most are empty (0), some are low (1), few are high (2)
        const rand = Math.random();
        let level = 0;
        if (rand > 0.95) level = 2; // High activity
        else if (rand > 0.85) level = 1; // Low activity
        
        // Specific mock pattern for the screenshot look
        if (w > 48 && d % 2 === 0) level = 2;

        let colorClass = 'bg-gray-100 dark:bg-[#1a1a1a]'; // Empty
        if (level === 1) colorClass = 'bg-blue-300 dark:bg-blue-700';
        if (level === 2) colorClass = 'bg-blue-500 dark:bg-blue-500';

        weekColumn.push(
          <div 
            key={`${w}-${d}`} 
            className={`w-2.5 h-2.5 rounded-sm ${colorClass}`}
            title={`No contributions`} 
          />
        );
      }
      grid.push(
        <div key={w} className="flex flex-col gap-1">
          {weekColumn}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full h-[95vh] md:h-[650px] md:max-w-4xl bg-white dark:bg-[#0c0c0c] rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:fade-in md:zoom-in-95 duration-200 flex flex-col md:flex-row border border-gray-100 dark:border-white/10">
        
        {/* Navigation / Sidebar */}
        <div className="w-full md:w-64 bg-gray-50/50 dark:bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/5 p-4 flex-shrink-0">
          <div className="flex items-center justify-between md:mb-6 mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white px-2">Settings</h2>
            <button onClick={onClose} className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500">
               <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
            <button 
              onClick={() => setActiveTab('general')}
              className={`whitespace-nowrap flex-shrink-0 w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-white/5' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
              General
            </button>
            <button 
              onClick={() => setActiveTab('appearance')}
              className={`whitespace-nowrap flex-shrink-0 w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-white/5' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
              Appearance
            </button>
            <button 
              onClick={() => setActiveTab('account')}
              className={`whitespace-nowrap flex-shrink-0 w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'account' ? 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-white/5' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
              Account
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#0c0c0c] overflow-hidden">
          <div className="hidden md:flex items-center justify-between px-8 py-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {activeTab === 'general' && 'General Settings'}
              {activeTab === 'appearance' && 'Appearance'}
              {activeTab === 'account' && 'Account settings'}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 text-gray-900 dark:text-gray-100">
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-2xl">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                   <div className="relative">
                     <select className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-900/20 text-gray-900 dark:text-white appearance-none text-sm font-medium">
                       <option>English (US)</option>
                       <option>Spanish</option>
                       <option>French</option>
                     </select>
                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                   </div>
                 </div>
                 <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-white/5">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Auto-save history</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Automatically save your chat sessions</p>
                    </div>
                    <div className="relative inline-block w-11 h-6 transition duration-200 ease-in-out">
                        <input type="checkbox" id="toggle" className="peer absolute w-full h-full opacity-0 cursor-pointer z-10"/>
                        <div className="block w-full h-full bg-gray-200 dark:bg-gray-800 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                        <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Theme</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    <button 
                      onClick={() => onThemeChange('light')}
                      className={`flex flex-row sm:flex-col items-center gap-3 sm:gap-2 p-3 md:p-4 border rounded-xl transition-all ${theme === 'light' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10' : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      <Sun className={`w-6 h-6 md:w-8 md:h-8 ${theme === 'light' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Light</span>
                    </button>
                    
                    <button 
                      onClick={() => onThemeChange('dark')}
                      className={`flex flex-row sm:flex-col items-center gap-3 sm:gap-2 p-3 md:p-4 border rounded-xl transition-all ${theme === 'dark' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10' : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      <Moon className={`w-6 h-6 md:w-8 md:h-8 ${theme === 'dark' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Dark</span>
                    </button>
                    
                    <button 
                      onClick={() => onThemeChange('system')}
                      className={`flex flex-row sm:flex-col items-center gap-3 sm:gap-2 p-3 md:p-4 border rounded-xl transition-all ${theme === 'system' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10' : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      <MonitorSmartphone className={`w-6 h-6 md:w-8 md:h-8 ${theme === 'system' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm font-medium ${theme === 'system' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>System</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

             {activeTab === 'account' && (
              <div className="space-y-8 max-w-4xl">
                 <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Personalize how others see and interact with you on Lovable.</p>
                    
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-1.5">
                      14 edits on <span className="text-pink-500 font-bold">Lovable</span> in the last year
                    </h4>
                    
                    {/* Heatmap */}
                    <div className="border border-gray-100 dark:border-white/5 rounded-xl p-4 bg-white dark:bg-[#0a0a0a] mb-6 overflow-hidden">
                       <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar justify-between">
                          {renderHeatmap()}
                       </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                       <div>
                         <div className="text-[11px] text-gray-500 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">Daily average</div>
                         <div className="text-lg font-bold text-gray-900 dark:text-white">0.0 edits</div>
                       </div>
                       <div>
                         <div className="text-[11px] text-gray-500 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">Days edited</div>
                         <div className="text-lg font-bold text-gray-900 dark:text-white">8 (2%)</div>
                       </div>
                       <div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">Current streak</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">0 days</div>
                       </div>
                    </div>
                 </div>

                 {/* Profile Fields */}
                 <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-white/5">
                    
                    {/* Avatar */}
                    <div className="flex items-center justify-between">
                       <div className="max-w-md">
                         <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Your avatar</label>
                         <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Your avatar is either fetched from your linked identity provider or automatically generated based on your account.</p>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-gray-200 dark:ring-white/10 flex-shrink-0">
                          <img src="https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" className="w-full h-full object-cover" />
                       </div>
                    </div>

                    {/* Username */}
                    <div>
                       <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Username</label>
                       <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Your public identifier and profile URL.</p>
                       <input 
                         type="text" 
                         defaultValue="O8Pv0eguckgesgUOR0aXyYjAvLW2" 
                         className="w-full bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-900/10 text-gray-900 dark:text-white font-mono text-sm shadow-sm" 
                       />
                       <a href="#" className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-2 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                          lovable.dev/@O8Pv0eguckgesgUOR0aXyYjAvLW2 <ChevronRight className="w-3 h-3" />
                       </a>
                    </div>

                    {/* Email */}
                    <div className="pt-2">
                       <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Email</label>
                       <input 
                         type="email" 
                         defaultValue="kamesh14151@gmail.com" 
                         disabled 
                         className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2.5 outline-none text-gray-500 dark:text-gray-500 cursor-not-allowed shadow-inner text-sm font-medium" 
                       />
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};