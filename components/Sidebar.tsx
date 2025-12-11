import React, { useState, useRef, useEffect } from 'react';
import { Plus, MessageSquare, Search, MoreHorizontal, LayoutGrid, Star, Users, Home, Settings, Palette, HelpCircle, Book, LogOut, ChevronRight, Check, ArrowLeft, Sun, Moon, MonitorSmartphone } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Theme } from './SettingsModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onOpenSettings: (tab?: string) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNewChat, onOpenSettings, theme, onThemeChange }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [menuView, setMenuView] = useState<'main' | 'appearance'>('main');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Mock history data
  const history = [
    { id: 1, title: 'Landing page for coffee shop', time: '2h ago' },
    { id: 2, title: 'React component library', time: 'Yesterday' },
    { id: 3, title: 'Dashboard layout fix', time: '2 days ago' },
    { id: 4, title: 'Authentication flow', time: '3 days ago' },
    { id: 5, title: 'Portfolio website', time: '1 week ago' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setTimeout(() => setMenuView('main'), 200); // Reset menu view after close
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    if (!isProfileOpen) setMenuView('main');
  };

  return (
    <>
      {/* Mobile Overlay - Only visible when sidebar is open on mobile */}
      <div 
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <aside 
        className={`
          fixed md:relative top-0 left-0 h-full bg-[#fcfcfc] dark:bg-[#000000] border-r border-gray-200/50 dark:border-white/5 z-50
          transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] flex flex-col shadow-sm dark:shadow-none
          ${isOpen 
            ? 'w-[260px] translate-x-0' 
            : 'w-[260px] -translate-x-full md:w-[72px] md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full w-full">
          {/* Top Section */}
          <div className={`p-3 pb-0 flex flex-col ${!isOpen ? 'items-center' : ''}`}>
             
             {/* Workspace Switcher (Visual match for 'T' icon) */}
             <div className={`mb-4 flex items-center ${isOpen ? 'px-2' : 'justify-center'}`}>
               <Tooltip content="Switch Workspace" position="right" disabled={isOpen}>
                 <button className="w-8 h-8 rounded-lg bg-pink-600 text-white font-bold flex items-center justify-center text-sm hover:opacity-90 transition-opacity shadow-sm">
                   T
                 </button>
               </Tooltip>
               {isOpen && (
                 <div className="ml-3 flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white leading-none">LENZ BY AJ STUDIOZ</span>
                 </div>
               )}
               {isOpen && <MoreHorizontal className="w-4 h-4 ml-auto text-gray-400" />}
             </div>

             {/* New Chat Button */}
             <Tooltip content="New Project" position="right" disabled={isOpen}>
              <button 
                onClick={onNewChat}
                className={`
                  group flex items-center bg-white dark:bg-[#1a1a1a] border border-gray-200/75 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-sm text-gray-700 dark:text-gray-200 font-medium transition-all duration-200 mb-4
                  ${isOpen ? 'gap-3 w-full py-2 px-2.5 rounded-xl' : 'w-10 h-10 justify-center rounded-xl p-0'}
                `}
              >
                <div className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                {isOpen && <span className="text-[13px] font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">New Project</span>}
              </button>
            </Tooltip>

            {/* Navigation Links */}
            <div className="space-y-0.5 mb-4 w-full">
               <Tooltip content="Home" position="right" disabled={isOpen}>
                 <button 
                   className={`
                     flex items-center text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors
                     ${isOpen ? 'w-full gap-3 px-2.5 py-1.5' : 'w-10 h-10 justify-center'}
                   `}
                 >
                    <Home className="w-5 h-5 text-gray-500 dark:text-gray-500" />
                    {isOpen && <span className="animate-in fade-in slide-in-from-left-2 duration-300">Home</span>}
                 </button>
               </Tooltip>

               <Tooltip content="Search" position="right" disabled={isOpen}>
                 <button 
                   className={`
                     flex items-center text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors
                     ${isOpen ? 'w-full gap-3 px-2.5 py-1.5' : 'w-10 h-10 justify-center'}
                   `}
                 >
                    <Search className="w-5 h-5 text-gray-500 dark:text-gray-500" />
                    {isOpen && <span className="animate-in fade-in slide-in-from-left-2 duration-300">Search</span>}
                 </button>
               </Tooltip>

               <div className="my-2 border-t border-gray-100 dark:border-white/5 mx-2"></div>

               <Tooltip content="All projects" position="right" disabled={isOpen}>
                 <button 
                   className={`
                     flex items-center text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors
                     ${isOpen ? 'w-full gap-3 px-2.5 py-1.5' : 'w-10 h-10 justify-center'}
                   `}
                 >
                    <LayoutGrid className="w-5 h-5 text-gray-500 dark:text-gray-500" />
                    {isOpen && <span className="animate-in fade-in slide-in-from-left-2 duration-300">All projects</span>}
                 </button>
               </Tooltip>
               
               <Tooltip content="Starred" position="right" disabled={isOpen}>
                 <button 
                   className={`
                     flex items-center text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors
                     ${isOpen ? 'w-full gap-3 px-2.5 py-1.5' : 'w-10 h-10 justify-center'}
                   `}
                 >
                    <Star className="w-5 h-5 text-gray-500 dark:text-gray-500" />
                    {isOpen && <span className="animate-in fade-in slide-in-from-left-2 duration-300">Starred</span>}
                 </button>
               </Tooltip>
               
               <Tooltip content="Shared with me" position="right" disabled={isOpen}>
                 <button 
                   className={`
                     flex items-center text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors
                     ${isOpen ? 'w-full gap-3 px-2.5 py-1.5' : 'w-10 h-10 justify-center'}
                   `}
                 >
                    <Users className="w-5 h-5 text-gray-500 dark:text-gray-500" />
                    {isOpen && <span className="animate-in fade-in slide-in-from-left-2 duration-300">Shared with me</span>}
                 </button>
               </Tooltip>
            </div>
          </div>

          {/* History List - Only visible when open */}
          {isOpen && (
            <div className="flex-1 overflow-y-auto px-2 animate-in fade-in duration-300">
              <div className="py-2">
                <h3 className="px-2.5 text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-1">Recent</h3>
                <div className="space-y-0.5">
                  {history.map(item => (
                    <button 
                      key={item.id}
                      className="flex items-center gap-3 w-full px-2.5 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg group transition-all text-left"
                    >
                      <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-300 flex-shrink-0" />
                      <span className="text-[13px] text-gray-600 dark:text-gray-400 truncate group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Spacer if closed to push profile to bottom */}
          {!isOpen && <div className="flex-1"></div>}

          {/* User Profile Mini (Bottom) */}
          <div 
            className={`p-3 mt-auto border-t border-gray-100 dark:border-white/5 relative ${!isOpen ? 'flex justify-center' : ''}`}
            ref={dropdownRef}
          >
            <Tooltip content="Profile & Settings" position="right" disabled={isOpen || isProfileOpen}>
              <button 
                onClick={handleProfileClick}
                className={`flex items-center ${isOpen ? 'justify-between w-full px-2' : 'justify-center w-10'} hover:bg-gray-100 dark:hover:bg-white/5 py-2 rounded-xl transition-colors group ${isProfileOpen ? 'bg-gray-100 dark:bg-white/5' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-[#000000] group-hover:ring-gray-100 dark:group-hover:ring-white/10 transition-all shadow-sm">
                     <img 
                      src="https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full"
                    />
                   </div>
                   {isOpen && (
                     <div className="flex flex-col text-left animate-in fade-in slide-in-from-left-2 duration-300">
                       <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Kamesh AJ</span>
                       <span className="text-[10px] text-gray-500 dark:text-gray-500">Free Plan</span>
                     </div>
                   )}
                </div>
                {isOpen && <MoreHorizontal className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />}
              </button>
            </Tooltip>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div 
                className={`
                  absolute z-[60] w-72 bg-white dark:bg-[#121212] rounded-xl shadow-2xl dark:shadow-black/80 border border-gray-200 dark:border-white/10 overflow-hidden ring-1 ring-black/5 transition-all duration-200
                  ${isOpen ? 'bottom-full left-0 mb-3 ml-2' : 'left-full bottom-0 ml-3'}
                `}
              >
                {/* View Switcher: Main vs Appearance */}
                <div className={`transition-transform duration-300 ease-in-out ${menuView === 'appearance' ? '-translate-x-full hidden' : 'translate-x-0'}`}>
                   {menuView === 'main' && (
                     <>
                        {/* User Section - CLICKABLE */}
                        <button 
                           onClick={() => { setIsProfileOpen(false); onOpenSettings('account'); }}
                           className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                        >
                           <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden ring-1 ring-gray-100 dark:ring-white/10 shrink-0">
                              <img 
                                src="https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                              />
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Kamesh AJ</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 truncate">kamesh14151@gmail.com</p>
                           </div>
                           <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>

                        <div className="h-px bg-gray-100 dark:bg-white/5 my-1" />
                        
                        {/* Menu Items */}
                        <div className="px-1.5 space-y-0.5">
                          <button 
                            onClick={() => { setIsProfileOpen(false); onOpenSettings('general'); }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white flex items-center gap-3 transition-colors rounded-lg group"
                          >
                            <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                            Settings
                          </button>

                          <button 
                            onClick={() => setMenuView('appearance')}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white flex items-center gap-3 transition-colors rounded-lg group justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <Palette className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                              <span>Appearance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-semibold text-gray-400 bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded capitalize">{theme}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                          </button>

                          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white flex items-center gap-3 transition-colors rounded-lg group">
                            <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                            Support
                          </button>

                          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white flex items-center gap-3 transition-colors rounded-lg group">
                            <Book className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                            Documentation
                          </button>
                           
                          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white flex items-center gap-3 transition-colors rounded-lg group">
                            <Users className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                            Join Community
                          </button>
                        </div>
                        
                        <div className="h-px bg-gray-100 dark:bg-white/5 my-1" />
                        
                        <div className="px-1.5">
                          <button className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg flex items-center gap-3 transition-colors">
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </div>
                     </>
                   )}
                </div>

                {/* Appearance Submenu */}
                {menuView === 'appearance' && (
                  <div className="w-full animate-in slide-in-from-right duration-200">
                    <div className="flex items-center gap-2 p-2 px-3 border-b border-gray-100 dark:border-white/5">
                      <button 
                        onClick={() => setMenuView('main')} 
                        className="p-1 -ml-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md text-gray-500 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Appearance</span>
                    </div>
                    
                    <div className="p-3">
                       {/* Visual Previews */}
                       <div className="flex gap-2 mb-4">
                          <button onClick={() => onThemeChange('light')} className="flex-1 group">
                             <div className={`h-16 rounded-lg bg-white border mb-1.5 overflow-hidden relative ${theme === 'light' ? 'ring-2 ring-pink-500 border-transparent' : 'border-gray-200 dark:border-white/10'}`}>
                                <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/20 blur-xl rounded-full"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 bg-pink-500/20 blur-xl rounded-full"></div>
                             </div>
                          </button>
                          <button onClick={() => onThemeChange('dark')} className="flex-1 group">
                             <div className={`h-16 rounded-lg bg-[#1a1a1a] border mb-1.5 overflow-hidden relative ${theme === 'dark' ? 'ring-2 ring-pink-500 border-transparent' : 'border-gray-200 dark:border-white/10'}`}>
                                <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/20 blur-xl rounded-full"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 bg-pink-500/20 blur-xl rounded-full"></div>
                             </div>
                          </button>
                          <button onClick={() => onThemeChange('system')} className="flex-1 group">
                             <div className={`h-16 rounded-lg bg-gradient-to-br from-white to-[#1a1a1a] border mb-1.5 overflow-hidden relative ${theme === 'system' ? 'ring-2 ring-pink-500 border-transparent' : 'border-gray-200 dark:border-white/10'}`}>
                             </div>
                          </button>
                       </div>

                       {/* List Options */}
                       <div className="space-y-0.5">
                          <button 
                            onClick={() => onThemeChange('light')}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-200"
                          >
                             <div className="flex items-center gap-3">
                                <Sun className="w-4 h-4 text-gray-500" />
                                <span>Light</span>
                             </div>
                             {theme === 'light' && <Check className="w-4 h-4 text-pink-500" />}
                          </button>
                          <button 
                            onClick={() => onThemeChange('dark')}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-200"
                          >
                             <div className="flex items-center gap-3">
                                <Moon className="w-4 h-4 text-gray-500" />
                                <span>Dark</span>
                             </div>
                             {theme === 'dark' && <Check className="w-4 h-4 text-pink-500" />}
                          </button>
                          <button 
                            onClick={() => onThemeChange('system')}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-200"
                          >
                             <div className="flex items-center gap-3">
                                <MonitorSmartphone className="w-4 h-4 text-gray-500" />
                                <span>System</span>
                             </div>
                             {theme === 'system' && <Check className="w-4 h-4 text-pink-500" />}
                          </button>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};