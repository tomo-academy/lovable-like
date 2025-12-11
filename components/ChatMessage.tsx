import React, { useState } from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

interface CodeBlockProps {
  language: string;
  children: React.ReactNode;
}

const CodeBlock = ({ language, children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const content = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 sm:my-5 rounded-lg sm:rounded-xl overflow-hidden border border-gray-200/50 dark:border-white/10 shadow-sm bg-[#0d1117] font-mono text-[12px] sm:text-[13px] group/code">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-[#161b22] border-b border-white/5">
        <span className="text-[10px] sm:text-xs font-semibold text-gray-400 select-none lowercase font-mono">
          {language || 'text'}
        </span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-500 hover:text-white transition-colors p-1 sm:p-1.5 rounded-md hover:bg-white/5 opacity-0 group-hover/code:opacity-100 sm:transition-opacity duration-200 touch:opacity-100"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" /> : <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
          <span className={copied ? "text-green-500 font-medium hidden sm:inline" : "hidden sm:inline"}>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '12px',
            fontFamily: '"JetBrains Mono", monospace',
            lineHeight: '1.5',
          }}
          wrapLines={true}
          showLineNumbers={false}
          PreTag="div"
        >
          {content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 sm:mb-8 group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[90%] lg:max-w-[85%] ${isUser ? 'ml-auto' : 'mr-auto w-full'}`}>
        <div className={`
          rounded-2xl
          ${isUser 
            ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white rounded-br-none p-3 px-4 sm:p-4 sm:px-5 shadow-sm' 
            : 'bg-transparent text-gray-900 dark:text-gray-100 px-0 pt-0'}
        `}>
          {isUser ? (
             <p className="whitespace-pre-wrap leading-relaxed text-[14px] sm:text-[15px] font-medium">{message.text}</p>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-h1:text-xl sm:prose-h1:text-2xl prose-h2:text-lg sm:prose-h2:text-xl prose-h3:text-base sm:prose-h3:text-lg 
              prose-p:leading-relaxed prose-p:text-[14px] sm:prose-p:text-[16px] prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:my-3 sm:prose-p:my-4
              prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-a:text-pink-600 dark:prose-a:text-pink-400 prose-a:no-underline hover:prose-a:underline
              prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:font-mono prose-code:font-medium prose-code:text-[12px] sm:prose-code:text-[13px] prose-code:bg-gray-100 dark:prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:rounded-none
              prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-1
              prose-ul:my-3 sm:prose-ul:my-4 prose-ol:my-3 sm:prose-ol:my-4
              ">
               <ReactMarkdown
                 children={message.text}
                 components={{
                   code({node, inline, className, children, ...props}: any) {
                     const match = /language-(\w+)/.exec(className || '');
                     return !inline && match ? (
                       <CodeBlock language={match[1]} children={children} />
                     ) : (
                       <code className={className} {...props}>
                         {children}
                       </code>
                     )
                   }
                 }}
               />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};