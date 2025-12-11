import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { ChatMessage } from './components/ChatMessage';
import { Sidebar } from './components/Sidebar';
import { SettingsModal, Theme } from './components/SettingsModal';
import { sendMessageToGemini } from './services/gemini';
import { Message } from './types';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('general');
  const [theme, setTheme] = useState<Theme>('system');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle screen size for initial sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { 
        if (window.innerWidth < 768) {
           setIsSidebarOpen(false);
        }
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Theme Logic
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (theme === 'dark' || (theme === 'system' && mediaQuery.matches)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const listener = () => {
      if (theme === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (hasStarted) {
      scrollToBottom();
    }
  }, [messages, hasStarted, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    if (!hasStarted) setHasStarted(true);
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const aiResponseText = await sendMessageToGemini(text);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponseText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasStarted(false);
    // On mobile, close sidebar after starting new chat
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const openSettings = (tab = 'general') => {
    setSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white dark:bg-[#050505] selection:bg-pink-100 selection:text-pink-900 dark:selection:bg-pink-900/30 dark:selection:text-pink-100 flex transition-colors duration-300">
      
      {/* Background Gradient Layer */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0 ${hasStarted ? 'opacity-40' : 'opacity-100'}`}
      >
        {/* Light Mode Background (Vibrant Aurora) */}
        <div className="absolute inset-0 bg-white dark:hidden overflow-hidden">
          {/* Blue Orb - Middle Left */}
          <div className="absolute top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-400/30 rounded-full blur-[100px] mix-blend-multiply filter animate-pulse-slow"></div>
          
          {/* Pink/Red Orb - Bottom Right */}
          <div className="absolute bottom-[-10%] -right-[10%] w-[70%] h-[70%] bg-pink-500/30 rounded-full blur-[100px] mix-blend-multiply filter animate-pulse-slow delay-1000"></div>
          
          {/* Purple Blend - Bottom Center */}
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-purple-400/30 rounded-full blur-[100px] mix-blend-multiply filter animate-pulse-slow delay-2000"></div>
          
          {/* Top light tint */}
          <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-white via-white/80 to-transparent"></div>
        </div>

        {/* Dark Mode Background (Lovable Style) */}
        <div className="absolute inset-0 hidden dark:block bg-[#0a0a0a] overflow-hidden">
          {/* Blue Orb (Top/Left) - Brighter and more prominent */}
          <div className="absolute top-[5%] -left-[15%] w-[80%] h-[80%] bg-blue-500/25 rounded-full blur-[140px] mix-blend-screen animate-pulse-slow"></div>
          
          {/* Pink/Magenta Orb (Bottom/Right) - More vibrant */}
          <div className="absolute bottom-[-15%] right-[-15%] w-[85%] h-[85%] bg-pink-500/30 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow delay-1000"></div>
          
          {/* Purple Central Glow - Stronger blend */}
          <div className="absolute top-[35%] left-[25%] w-[60%] h-[60%] bg-purple-500/15 rounded-full blur-[120px] mix-blend-screen"></div>
          
          {/* Additional cyan accent for depth */}
          <div className="absolute top-[50%] right-[20%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow delay-2000"></div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onOpenSettings={openSettings}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative z-10 min-w-0">
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          onOpenSettings={openSettings}
        />

        <main className="flex-1 relative flex flex-col w-full overflow-hidden">
          {/* Chat Area - Scrollable */}
          <div className={`flex-1 overflow-y-auto w-full scroll-smooth ${hasStarted ? 'pt-4 pb-4' : ''}`}>
            <div className={`max-w-[90%] md:max-w-2xl mx-auto w-full ${hasStarted ? 'pb-[200px]' : ''}`}>
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && (
                 <div className="flex items-center gap-2 text-gray-400 text-sm ml-2 mt-4 pl-4">
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div 
            className={`
              w-full flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
              ${hasStarted 
                ? 'absolute bottom-0 left-0 right-0 p-4 pb-6 md:pb-8 z-20 pointer-events-none bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#050505] dark:via-[#050505]/80' 
                : 'absolute top-[42%] md:top-[45%] left-0 right-0 -translate-y-1/2 px-4 z-20'}
            `}
          >
            {/* Wrapper to re-enable pointer events for the input container */}
            <div 
              className={`
                w-full flex flex-col items-center pointer-events-auto
              `}
            >
               {/* Hero Title */}
              <h1 
                className={`
                  text-center font-bold text-gray-900 dark:text-white mb-8 transition-all duration-500
                  ${hasStarted 
                    ? 'opacity-0 translate-y-4 pointer-events-none absolute' 
                    : 'text-3xl md:text-[40px] opacity-100 translate-y-0 px-4 leading-tight tracking-tight drop-shadow-sm'}
                `}
              >
                Ready to build, Kamesh?
              </h1>

              <PromptInput 
                onSend={handleSend} 
                isLoading={isLoading} 
                isExpanded={hasStarted} 
              />
            </div>
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        theme={theme}
        onThemeChange={setTheme}
        initialTab={settingsTab}
      />
    </div>
  );
};

export default App;