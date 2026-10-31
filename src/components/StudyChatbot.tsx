import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  GraduationCap, 
  RotateCcw, 
  ChevronDown, 
  HelpCircle,
  Lightbulb,
  Maximize2,
  Minimize2,
  X,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, StudyGrade, StudySubject } from '../types';

interface StudyChatbotProps {
  isFullPage?: boolean;
  onClose?: () => void;
}

const GRADES: StudyGrade[] = [
  'প্লে', 
  'নার্সারি', 
  'কেজি', 
  '১ম শ্রেণি', 
  '২য় শ্রেণি', 
  '৩য় শ্রেণি', 
  '৪র্থ শ্রেণি', 
  '৫ম শ্রেণি'
];

const SUBJECTS: StudySubject[] = [
  'প্রাথমিক গণিত',
  'বাংলা',
  'ইংরেজি (English)',
  'প্রাথমিক বিজ্ঞান',
  'বাংলাদেশ ও বিশ্বপরিচয়',
  'ইসলাম ও নৈতিক শিক্ষা',
  'সাধারণ জ্ঞান ও কুইজ',
  'দৈনিক পড়ার রুটিন ও টিপস'
];

const QUICK_PROMPTS = [
  {
    label: '🔢 গণিত সহজ নিয়ম',
    prompt: 'ছোট শিশুদের সহজে গুণের নামতা ও যোগ-বিয়োগ মনে রাখার সহজ কৌশল শিখিয়ে দাও।'
  },
  {
    label: '🍎 ইংরেজি ১০টি শব্দার্থ',
    prompt: 'প্রাথমিক শিক্ষার্থীদের জন্য ১০টি সাধারণ ইংরেজি শব্দ, তাদের বাংলা অর্থ এবং সহজ বাক্য তৈরি করে দাও।'
  },
  {
    label: '🇧🇩 আমাদের জাতীয় ঐতিহ্য',
    prompt: 'ছোটদের উপযোগী ভাষায় বাংলাদেশের জাতীয় স্মৃতিসৌধ, জাতীয় ফুল, ফল, পাখি ও পতাকা সম্পর্কে সংক্ষেপে বুঝিয়ে দাও।'
  },
  {
    label: '⏰ দৈনিক আদর্শ রুটিন',
    prompt: 'সকাল থেকে রাত পর্যন্ত একজন প্রাথমিক শিক্ষার্থীর পড়ার, খেলার এবং বিশ্রামের একটি সুন্দর আদর্শ দৈনিক রুটিন দাও।'
  },
  {
    label: '🧠 পড়া মনে রাখার টিপস',
    prompt: 'পড়া দ্রুত মুখস্থ ও দীর্ঘদিন মনে রাখার জন্য শিশুদের জন্য ৩টি সহজ ও কার্যকর কৌশল বলে দাও।'
  },
  {
    label: '🌱 উদ্ভিদের অংশ ও খাদ্য',
    prompt: 'প্রাথমিক বিজ্ঞান: একটি গাছের মূল, কাণ্ড ও পাতা কীভাবে গাছকে বাঁচিয়ে রাখে এবং খাদ্য তৈরি করে তা সহজ করে বোঝাও।'
  }
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  text: `স্বাগতম! 🌟 আমি **আদর্শ শিক্ষাসহায়িকা** (Adarsha Study Assistant)। 

কাশিম বাজার, সুন্দরগঞ্জ, গাইবান্ধার **আদর্শ শিশু কানন স্কুল**-এর কোমলমতি শিক্ষার্থী এবং সম্মানিত অভিভাবকদের জন্য আমি সবসময় প্রস্তুত। 

📚 **আমি যা যা সাহায্য করতে পারি:**
1. **প্রাথমিক গণিত:** যোগ, বিয়োগ, গুণ, ভাগ ও জ্যামিতির সহজ নিয়ম।
2. **বাংলা ও ব্যাকরণ:** বর্ণমালা, বানান, বিপরীত শব্দ ও ছোট অনুচ্ছেদ।
3. **ইংরেজি (English):** শব্দার্থ, সহজ গ্রামার, Spoken English ও ছোট বাক্য।
4. **সাধারণ জ্ঞান ও বিজ্ঞান:** মজার বিজ্ঞান তথ্য, সাধারণ জ্ঞান ও কুইজ।
5. **দৈনিক পড়ার রুটিন:** বাড়ির কাজ ও পরীক্ষা প্রস্তুতির দারুণ পরামর্শ।

তোমার যেকোনো পড়াশোনার প্রশ্ন নিচে লিখে দাও, আমি পরম যত্নে বুঝিয়ে দেবো! 😊`,
  timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
};

export default function StudyChatbot({ isFullPage = false, onClose }: StudyChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('ask_study_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [INITIAL_MESSAGE];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<StudyGrade>('১ম শ্রেণি');
  const [selectedSubject, setSelectedSubject] = useState<StudySubject>('প্রাথমিক গণিত');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Persist chat to local storage
  useEffect(() => {
    try {
      localStorage.setItem('ask_study_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            text: m.text,
          })),
          gradeLevel: selectedGrade,
          subject: selectedSubject,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'উত্তর পেতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }

      const assistantMessage: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        text: data.reply || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        text: `⚠️ দুঃখিত! ${err.message || 'পড়াশোনা সহায়তায় সংযোগ পাওয়া যায়নি।'} \n\nদয়া করে কিছুক্ষণ পর আবার প্রশ্ন করুন।`,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // keep focus on input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('আপনি কি পূর্বের সকল কথোপকথন মুছে নতুন করে শুরু করতে চান?')) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingId(null);
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem('ask_study_chat_history');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজারে স্পিচ ফিচার সমর্থিত নয়।');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Clean markdown characters like asterisks, hashes
    const cleanText = text
      .replace(/[*#_~`]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .slice(0, 500); // limit for smoother playback

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.9; // clear, gentle speed for kids

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Helper to format text with bold, bullet points and numbered lines
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1 text-sm sm:text-[15px] leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }

          // Check if bullet point
          const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
          const isNumbered = /^\d+\.\s/.test(line.trim());
          const displayLine = isBullet ? line.trim().slice(2) : line;

          // Parse **bold** in line
          const parts = displayLine.split(/(\*\*.*?\*\*)/g);

          const formattedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-blue-900 dark:text-amber-300">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <span className="text-amber-500 font-bold mt-1 text-xs">•</span>
                <div className="flex-1">{formattedLine}</div>
              </div>
            );
          }

          if (isNumbered) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2 font-medium">
                <div className="flex-1">{formattedLine}</div>
              </div>
            );
          }

          return <div key={idx}>{formattedLine}</div>;
        })}
      </div>
    );
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden ${
      isFullPage 
        ? 'max-w-6xl mx-auto rounded-3xl min-h-[750px] my-6' 
        : 'w-full h-full max-h-[85vh] rounded-2xl'
    }`}>
      
      {/* Header bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-blue-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-blue-950 flex items-center justify-center shadow-md font-bold shrink-0 ring-2 ring-white/20">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-black font-sans tracking-wide">
                আদর্শ শিক্ষাসহায়িকা
              </h3>
              <span className="px-2 py-0.5 text-[10px] bg-amber-400 text-blue-950 font-bold rounded-full uppercase tracking-wider">
                Gemini AI Tutor
              </span>
            </div>
            <p className="text-xs text-blue-200">
              প্লে থেকে ৫ম শ্রেণির শিশু ও অভিভাবকদের জন্য ২৪/৭ পড়াশোনার গৃহশিক্ষক
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearChat}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-800/60 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="নতুন কথোপকথন শুরু করুন"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">নতুন চ্যাট</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-blue-800/60 rounded-xl transition-colors cursor-pointer"
              title="বন্ধ করুন"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Grade and Subject Selector Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/70 p-3 sm:px-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Grade selection */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <GraduationCap size={15} className="text-amber-500" />
            <span className="text-gray-500 dark:text-slate-400 font-medium">শ্রেণি:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as StudyGrade)}
              className="bg-transparent font-bold text-blue-950 dark:text-white focus:outline-hidden cursor-pointer"
            >
              {GRADES.map(grade => (
                <option key={grade} value={grade} className="dark:bg-slate-900 text-gray-800 dark:text-slate-100">
                  {grade}
                </option>
              ))}
            </select>
          </div>

          {/* Subject selection */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <BookOpen size={15} className="text-blue-600 dark:text-blue-400" />
            <span className="text-gray-500 dark:text-slate-400 font-medium">বিষয়:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as StudySubject)}
              className="bg-transparent font-bold text-blue-950 dark:text-white focus:outline-hidden cursor-pointer max-w-[140px] sm:max-w-none truncate"
            >
              {SUBJECTS.map(subj => (
                <option key={subj} value={subj} className="dark:bg-slate-900 text-gray-800 dark:text-slate-100">
                  {subj}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center space-x-1">
          <Sparkles size={12} className="text-amber-500" />
          <span>মডেল: Gemini 3.8 Flash • বাংলা ও ইংরেজিতে উত্তর</span>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="bg-slate-100/60 dark:bg-slate-800/40 px-3 sm:px-5 py-2.5 border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Lightbulb size={12} className="text-amber-500" />
          দ্রুত প্রশ্ন:
        </span>
        {QUICK_PROMPTS.map((qp, index) => (
          <button
            key={index}
            onClick={() => handleSendMessage(qp.prompt)}
            disabled={isLoading}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0 hover:border-amber-400 dark:hover:border-amber-500 hover:text-blue-900 dark:hover:text-amber-300 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/60 min-h-[350px]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-xs font-bold ${
                isUser 
                  ? 'bg-blue-900 text-white ring-2 ring-blue-700' 
                  : 'bg-amber-400 text-blue-950 ring-2 ring-amber-300'
              }`}>
                {isUser ? 'ছাত্র' : <Bot size={18} />}
              </div>

              {/* Message Bubble Container */}
              <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                
                {/* Name / Role Label */}
                <div className="flex items-center space-x-2 mb-1 px-1 text-[11px] text-gray-400 dark:text-slate-500 font-medium">
                  <span>{isUser ? 'আপনি / শিক্ষার্থী' : 'আদর্শ শিক্ষাসহায়িকা'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Bubble Body */}
                <div className={`p-4 rounded-2xl text-left shadow-xs relative group ${
                  isUser
                    ? 'bg-blue-900 text-white rounded-tr-none'
                    : msg.isError
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 rounded-tl-none'
                    : 'bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 rounded-tl-none'
                }`}>
                  {renderFormattedText(msg.text)}

                  {/* Actions for assistant bubbles */}
                  {!isUser && !msg.isError && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end space-x-2 text-xs">
                      
                      {/* Read Aloud Button */}
                      <button
                        onClick={() => handleSpeak(msg.text, msg.id)}
                        className="px-2.5 py-1 text-slate-500 hover:text-blue-900 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1 transition-colors cursor-pointer"
                        title={speakingId === msg.id ? 'পড়া বন্ধ করুন' : 'উচ্চস্বরে শুনুন'}
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX size={14} className="text-amber-500 animate-pulse" />
                            <span className="text-[11px] text-amber-500 font-bold">পড়া থামান</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={14} />
                            <span className="text-[11px]">পড়ে শোনান</span>
                          </>
                        )}
                      </button>

                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="px-2.5 py-1 text-slate-500 hover:text-blue-900 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1 transition-colors cursor-pointer"
                        title="লেখা কপি করুন"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check size={14} className="text-emerald-500" />
                            <span className="text-[11px] text-emerald-500 font-bold">কপি হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span className="text-[11px]">কপি করুন</span>
                          </>
                        )}
                      </button>

                    </div>
                  )}

                </div>

              </div>
            </div>
          );
        })}

        {/* Loading / Thinking Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center shrink-0 shadow-sm animate-bounce">
              <Bot size={18} />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none shadow-xs space-y-2 max-w-[80%]">
              <div className="flex items-center space-x-2 text-xs text-amber-600 dark:text-amber-400 font-bold">
                <Sparkles size={14} className="animate-spin" />
                <span>আদর্শ শিক্ষাসহায়িকা ভাবছে ও সুন্দর করে উত্তর লিখছে...</span>
              </div>
              <div className="flex space-x-1.5 py-1">
                <div className="w-2.5 h-2.5 bg-blue-900 dark:bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-blue-700 dark:bg-amber-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-blue-500 dark:bg-amber-200 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-950 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 focus-within:border-blue-900 dark:focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-blue-900/10 dark:focus-within:ring-amber-400/10 transition-all">
          <textarea
            ref={inputRef}
            rows={2}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`তোমার পড়াশোনার যেকোনো প্রশ্ন লিখুন (${selectedGrade} • ${selectedSubject})...`}
            className="w-full bg-transparent px-2 py-1 text-sm text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 resize-none focus:outline-hidden leading-relaxed"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isLoading}
            className="h-10 px-4 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 disabled:opacity-40 text-white rounded-xl flex items-center justify-center space-x-1.5 font-bold text-xs shrink-0 shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <span>পাঠান</span>
            <Send size={14} />
          </button>
        </div>

        {/* Helpful study footer note */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1 text-[11px] text-gray-400 dark:text-slate-500">
          <div className="flex items-center space-x-1">
            <span>💡 এন্টার চাপুন পাঠাতে, শিফট+এন্টার নতুন লাইনের জন্য।</span>
          </div>
          <div>
            <span>আদর্শ শিশু কানন স্কুল, সুন্দরগঞ্জ, গাইবান্ধা</span>
          </div>
        </div>
      </div>

    </div>
  );
}
