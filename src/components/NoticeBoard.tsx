import React, { useState } from 'react';
import { Notice } from '../types';
import { Pin, Calendar, Clock, ArrowRight, Eye, Search, AlertCircle, FileText } from 'lucide-react';

interface NoticeBoardProps {
  notices: Notice[];
  isHomepage?: boolean;
  setView?: (view: string) => void;
}

export default function NoticeBoard({ notices, isHomepage = false, setView }: NoticeBoardProps) {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notices based on search query (if not homepage)
  const activeNotices = notices.filter(n => n.published);
  
  const filteredNotices = isHomepage 
    ? activeNotices 
    : activeNotices.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Sorting: Pinned first, then by date and time descending
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Sort by Date + Time
    const datetimeA = new Date(`${a.date} ${a.time.replace(/AM|PM/g, '')}`);
    const datetimeB = new Date(`${b.date} ${b.time.replace(/AM|PM/g, '')}`);
    return datetimeB.getTime() - datetimeA.getTime();
  });

  // Homepage displays only top 3/4 notices, with a "View All" link
  const displayedNotices = isHomepage ? sortedNotices.slice(0, 4) : sortedNotices;

  // Formatting date to Bengali
  const formatBengaliDate = (dateStr: string) => {
    // Basic date parsing to Bengali format if possible, or keep it readable
    const bails = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
      '-': '/'
    };
    return dateStr.split('').map(char => (bails as any)[char] || char).join('');
  };

  return (
    <div className={`w-full ${isHomepage ? 'bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900/60 dark:to-slate-950 py-12' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Notice Board Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-gray-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-900 dark:text-amber-400 font-bold mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span className="text-sm tracking-wider uppercase">সর্বশেষ আপডেট</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-blue-950 dark:text-white font-sans">
              {isHomepage ? 'নোটিশ বোর্ড ও সংবাদ ফিড' : 'স্কুল নোটিশ বোর্ড'}
            </h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
              {isHomepage 
                ? 'আদর্শ শিশু কানন স্কুলের সাম্প্রতিক নোটিশ ও শিক্ষামূলক সংবাদের বিবরণী' 
                : 'সব ধরনের প্রাতিষ্ঠানিক নোটিশ, পরীক্ষার খবর এবং ছুটির দিনপঞ্জি এখানে পাবেন।'}
            </p>
          </div>
          
          {/* Action buttons or search */}
          {isHomepage ? (
            setView && (
              <button 
                onClick={() => setView('notice-board')}
                className="mt-4 md:mt-0 px-4 py-2 text-sm bg-blue-100 dark:bg-blue-950 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-900 dark:text-amber-400 font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer transition-all duration-200"
              >
                <span>সব নোটিশ দেখুন</span>
                <ArrowRight size={16} />
              </button>
            )
          ) : (
            <div className="mt-4 md:mt-0 relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="নোটিশ খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Notices Grid */}
        {displayedNotices.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
            <AlertCircle className="mx-auto text-gray-400 mb-2" size={36} />
            <p className="text-gray-500 dark:text-slate-400 font-medium">কোন নোটিশ পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className={`group relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col justify-between ${
                  notice.isPinned 
                    ? 'border-amber-400 dark:border-amber-500 shadow-[0_4px_20px_rgba(245,158,11,0.08)] bg-amber-50/10 dark:bg-amber-950/20' 
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                {/* Pinned Badge Overlay */}
                {notice.isPinned && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-blue-950 px-3 py-1 text-xs font-black rounded-bl-lg flex items-center space-x-1 z-10">
                    <Pin size={12} className="rotate-45" />
                    <span>পিন করা</span>
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  {/* Date and Time Header */}
                  <div className="flex flex-wrap gap-3 items-center text-xs text-gray-500 dark:text-slate-400 font-medium mb-3">
                    <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      <Calendar size={12} className="text-blue-900 dark:text-amber-400" />
                      <span>{formatBengaliDate(notice.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      <Clock size={12} className="text-blue-900 dark:text-amber-400" />
                      <span>{notice.time}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Notice Image (optional) */}
                    {notice.image && (
                      <div className="w-full sm:w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                        <img 
                          src={notice.image} 
                          alt="Notice" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-lg font-bold text-blue-950 dark:text-white group-hover:text-blue-700 dark:group-hover:text-amber-400 transition-colors duration-200 leading-snug line-clamp-2">
                        {notice.title}
                      </h4>
                      <p className="text-gray-600 dark:text-slate-300 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                        {notice.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer read more trigger */}
                <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-blue-900 dark:text-amber-400 group-hover:bg-blue-50/50 dark:group-hover:bg-slate-900 transition-colors">
                  <div className="flex items-center space-x-1.5">
                    <FileText size={14} className="text-blue-700 dark:text-amber-400" />
                    <span>বিস্তারিত পড়ুন</span>
                  </div>
                  <Eye size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Notice Details */}
        {selectedNotice && (
          <div className="fixed inset-0 bg-blue-950/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800">
              
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-blue-900 to-blue-950 text-white flex justify-between items-start">
                <div className="space-y-1 pr-6">
                  {selectedNotice.isPinned && (
                    <span className="inline-flex items-center space-x-1 bg-amber-500 text-blue-950 font-bold px-2 py-0.5 rounded text-xs mb-2">
                      <Pin size={10} className="rotate-45" />
                      <span>পিন করা গুরুত্বপূর্ণ নোটিশ</span>
                    </span>
                  )}
                  <h4 className="text-xl sm:text-2xl font-black font-sans leading-snug">
                    {selectedNotice.title}
                  </h4>
                  
                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 items-center text-xs text-blue-200 pt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>তারিখ: {formatBengaliDate(selectedNotice.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>সময়: {selectedNotice.time}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-4">
                {selectedNotice.image && (
                  <div className="w-full max-h-80 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                    <img 
                      src={selectedNotice.image} 
                      alt="Notice Image" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                
                <div className="text-gray-700 dark:text-slate-200 leading-relaxed text-base whitespace-pre-wrap font-sans">
                  {selectedNotice.content}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-5 py-2 bg-blue-900 dark:bg-amber-500 dark:text-blue-950 hover:bg-blue-800 text-white font-bold text-sm rounded-lg cursor-pointer transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
