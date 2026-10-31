import React, { useState } from 'react';
import { Bot, Sparkles, X, MessageSquare, Maximize2 } from 'lucide-react';
import StudyChatbot from './StudyChatbot';

interface StudyFloatingWidgetProps {
  onOpenFullPage: () => void;
}

export default function StudyFloatingWidget({ onOpenFullPage }: StudyFloatingWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 no-print flex flex-col items-end space-y-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-blue-950 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-amber-400/30 animate-pulse pointer-events-none">
            <Sparkles size={12} className="text-amber-400" />
            <span>পড়াশোনায় সহায়তা / AI Tutor</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="পড়াশোনায় সহায়তা চ্যাটবট খুলুন"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-amber-400 hover:text-white flex items-center justify-center shadow-2xl border-2 border-amber-400/60 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer relative group"
        >
          {isOpen ? (
            <X size={26} className="text-white" />
          ) : (
            <>
              <Bot size={28} className="group-hover:rotate-6 transition-transform" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </>
          )}
        </button>
      </div>

      {/* Floating Popup Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[95vw] sm:w-[440px] max-h-[82vh] h-[640px] flex flex-col no-print animate-in fade-in slide-in-from-bottom-6 duration-200">
          <div className="relative w-full h-full flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-blue-800/40">
            {/* Quick full-screen switch button */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenFullPage();
              }}
              className="absolute top-4 right-14 z-20 p-2 text-blue-200 hover:text-white hover:bg-blue-800/60 rounded-xl transition-colors cursor-pointer"
              title="সম্পূর্ণ পর্দায় খুলুন"
            >
              <Maximize2 size={18} />
            </button>

            <StudyChatbot onClose={() => setIsOpen(false)} isFullPage={false} />
          </div>
        </div>
      )}
    </>
  );
}
