import React, { useState, useRef, useEffect } from 'react';
import { Plus, Paperclip, AudioLines, ArrowUp, MessageSquare, Image, Database, FileText, ChevronDown, Check, Briefcase, Sparkles, Code, Mic, MicOff } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface PromptInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  isExpanded: boolean;
}

// Add type definition for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const PREFIX = "Ask Lovable to ";
const SUFFIXES = [
  "create a prototype...",
  "debug...",
  "write a component...",
  "explain a concept..."
];

export const PromptInput: React.FC<PromptInputProps> = ({ onSend, isLoading, isExpanded }) => {
  const [input, setInput] = useState('');
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [chatMode, setChatMode] = useState<'chat' | 'builder'>('builder');
  const [selectedTheme, setSelectedTheme] = useState('Modern');
  
  // Typing effect state
  const [typingSuffix, setTypingSuffix] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Typing effect logic
  useEffect(() => {
    const currentSuffix = SUFFIXES[phraseIndex];
    const typeSpeed = isDeleting ? 30 : 50; // Speed of typing/deleting
    const pauseTime = 2000; // Pause after full phrase

    const timer = setTimeout(() => {
      if (!isDeleting && typingSuffix === currentSuffix) {
        // Finished typing, wait before deleting
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && typingSuffix === '') {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % SUFFIXES.length);
      } else {
        // Typing or Deleting characters
        setTypingSuffix(current => 
          isDeleting 
            ? current.slice(0, -1) 
            : currentSuffix.slice(0, current.length + 1)
        );
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [typingSuffix, isDeleting, phraseIndex]);


  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsPlusMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Voice Input Logic
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after one sentence
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setInput(prev => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${finalTranscript}` : finalTranscript;
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };


  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  return (
    <div 
      className={`
        relative w-full transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] flex justify-center
        ${isExpanded ? 'max-w-[92%] sm:max-w-[90%] md:max-w-2xl' : 'max-w-[92%] sm:max-w-[90%] md:max-w-[640px]'}
      `}
    >
      <div className="w-full bg-[#fcfbf9] dark:bg-[#18181b]/95 backdrop-blur-xl rounded-[18px] sm:rounded-[26px] shadow-lg dark:shadow-black/50 border border-white/60 dark:border-white/5 p-[10px] sm:p-2 md:p-3 transition-all duration-300 ring-1 ring-black/5 focus-within:ring-black/10 focus-within:shadow-xl dark:ring-white/5 dark:focus-within:ring-white/10 group">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : `${PREFIX}${typingSuffix}`}
          className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 text-[15px] sm:text-[16px] placeholder-gray-400 dark:placeholder-gray-500 resize-none overflow-hidden min-h-[24px] py-1 px-1 sm:px-2 leading-relaxed"
          rows={1}
        />
        
        <div className="flex items-center justify-between mt-2 px-1 relative">
          <div className="flex items-center gap-2">
            <div className="relative" ref={menuRef}>
              <Tooltip content="Add Context" position="top" disabled={isPlusMenuOpen}>
                <button 
                  onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 border border-transparent ${isPlusMenuOpen ? 'bg-gray-100 dark:bg-white/10 rotate-45 text-gray-900 dark:text-white' : 'bg-gray-100/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </Tooltip>

              {/* Plus Menu Popover */}
              <div 
                className={`
                  absolute bottom-full left-0 mb-3 w-64 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl dark:shadow-black/50 border border-gray-100 dark:border-white/5 p-1.5 transform transition-all duration-200 origin-bottom-left z-50
                  ${isPlusMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}
                `}
              >
                 <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Add Context</div>
                 <div className="space-y-0.5">
                   <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                     <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400 flex items-center justify-center"><Image className="w-3 h-3"/></div>
                     <span>Upload Image</span>
                   </button>
                   <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                     <div className="w-5 h-5 rounded bg-green-50 dark:bg-green-500/20 text-green-500 dark:text-green-400 flex items-center justify-center"><FileText className="w-3 h-3"/></div>
                     <span>Upload Text File</span>
                   </button>
                   <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                     <div className="w-5 h-5 rounded bg-purple-50 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400 flex items-center justify-center"><Database className="w-3 h-3"/></div>
                     <span>Connect Database</span>
                   </button>
                </div>
              </div>
            </div>

            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors text-xs font-medium border border-transparent">
              <Paperclip className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span>Attach</span>
            </button>

             <div className="relative hidden sm:block" ref={themeMenuRef}>
               <button 
                 onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-xs font-medium border border-transparent
                  ${isThemeMenuOpen ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : 'bg-gray-100/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'}
                 `}
               >
                <Sparkles className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                <span>{selectedTheme}</span>
                <ChevronDown className={`w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform ${isThemeMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Theme Menu Popover */}
              <div 
                className={`
                  absolute bottom-full left-0 mb-3 w-56 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl dark:shadow-black/50 border border-gray-100 dark:border-white/5 p-1.5 transform transition-all duration-200 origin-bottom-left z-50
                  ${isThemeMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}
                `}
              >
                 <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Visual Style</div>
                 <div className="space-y-0.5">
                   {['Modern', 'Professional', 'Creative', 'Minimal'].map((themeName) => (
                     <button 
                       key={themeName}
                       onClick={() => { setSelectedTheme(themeName); setIsThemeMenuOpen(false); }}
                       className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors group"
                     >
                       <div className="flex items-center gap-3">
                         {themeName === 'Modern' && <Sparkles className="w-4 h-4 text-pink-500" />}
                         {themeName === 'Professional' && <Briefcase className="w-4 h-4 text-blue-500" />}
                         {themeName === 'Creative' && <Image className="w-4 h-4 text-purple-500" />}
                         {themeName === 'Minimal' && <Code className="w-4 h-4 text-gray-500" />}
                         <span>{themeName}</span>
                       </div>
                       {selectedTheme === themeName && <Check className="w-4 h-4 text-pink-500" />}
                     </button>
                   ))}
                </div>
              </div>
             </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setChatMode(chatMode === 'builder' ? 'chat' : 'builder')}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
                ${chatMode === 'chat' 
                  ? 'bg-transparent text-gray-900 border-gray-200/80 hover:bg-gray-50 dark:text-white dark:border-white/20 dark:hover:bg-white/5' 
                  : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'}
              `}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chat</span>
            </button>
            
            <Tooltip content={isListening ? "Stop listening" : "Voice Input"} position="top">
              <button 
                onClick={toggleListening}
                className={`
                  w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                  ${isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400'}
                `}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </Tooltip>
            
            <Tooltip content="Send Message" position="top" disabled={!input.trim()}>
              <button 
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className={`
                  w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200
                  ${input.trim() 
                    ? 'bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 transform hover:scale-105 shadow-sm' 
                    : 'bg-gray-200 text-gray-400 dark:bg-white/10 dark:text-gray-600 cursor-not-allowed'}
                `}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
