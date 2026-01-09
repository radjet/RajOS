import React, { useState, forwardRef } from 'react';
import { Send, Terminal } from 'lucide-react';
import { Node, Sector } from '../types';
import { SECTORS } from '../constants';

interface QuickLogProps {
  activeNode: Node | null;
  onLogSubmit: (text: string) => void;
}

const QuickLog = forwardRef<HTMLInputElement, QuickLogProps>(({ activeNode, onLogSubmit }, ref) => {
  const [input, setInput] = useState('');
  const sector = activeNode ? SECTORS.find(s => s.id === activeNode.sectorId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onLogSubmit(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none flex justify-center">
      <div className="w-full max-w-2xl pointer-events-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative group"
        >
          {/* Outer glow */}
          <div className="absolute inset-0 bg-paper-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
          
          <div className="relative flex items-center bg-paper-100/90 backdrop-blur-xl border border-paper-600 rounded-full shadow-2xl overflow-hidden focus-within:border-paper-accent transition-colors duration-300">
            <div className="pl-4 pr-3 text-paper-500">
              <Terminal size={18} />
            </div>
            
            <input
              ref={ref}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeNode ? `Log entry for [${activeNode.label}]...` : "Quick capture to Inbox..."}
              className="flex-1 bg-transparent border-none py-4 text-paper-900 placeholder-paper-600 focus:outline-none focus:ring-0 font-mono text-sm font-medium"
              autoFocus
            />
            
            <div className="pr-2">
                <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="p-2 bg-paper-800 hover:bg-paper-accent text-paper-300 hover:text-white rounded-full transition-all duration-300 disabled:opacity-50 disabled:hover:bg-paper-800 disabled:hover:text-paper-300"
                >
                    <Send size={16} className={input.trim() ? 'translate-x-0.5 translate-y-px' : ''} />
                </button>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="absolute -top-6 left-6 text-[10px] uppercase font-bold tracking-widest text-paper-accent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 drop-shadow-sm">
             {activeNode ? `Linking to: ${sector?.label} / ${activeNode.label}` : 'System Ready'}
          </div>
        </form>
      </div>
    </div>
  );
});

export default QuickLog;
