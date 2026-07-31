import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { Menu, X, Lock, Phone, Search, Bell, Calendar, Info, FileText, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { Notice, RoutineItem, ExamRoutineItem, SchoolInfo } from '../types';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  onAdminClick: () => void;
  isAdminLoggedIn: boolean;
  logoUrl?: string;
  notices?: Notice[];
  classRoutines?: RoutineItem[];
  examRoutines?: ExamRoutineItem[];
  schoolInfo?: SchoolInfo;
}

export default function Header({ 
  currentView, 
  setView, 
  onAdminClick, 
  isAdminLoggedIn, 
  logoUrl,
  notices = [],
  classRoutines = [],
  examRoutines = [],
  schoolInfo
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { id: 'home', label: 'হোম' },
    { id: 'notice-board', label: 'নোটিশ বোর্ড' },
    { id: 'admission', label: 'ভর্তির আবেদন' },
    { id: 'routines', label: 'রুটিন সমূহ' },
    { id: 'school-info', label: 'স্কুল পরিচিতি' },
    { id: 'contact', label: 'যোগাযোগ' },
  ];

  const handleNavClick = (id: string) => {
    setView(id);
    setIsOpen(false);
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close search dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchFocused(false);
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // --- GLOBAL SEARCH COMPUTATIONS ---
  const query = searchQuery.trim().toLowerCase();

  const matchingNotices = query 
    ? notices.filter(n => 
        n.published !== false && (
          n.title.toLowerCase().includes(query) || 
          n.content.toLowerCase().includes(query) ||
          n.date.toLowerCase().includes(query)
        )
      )
    : [];

  const matchingClassRoutines = query 
    ? classRoutines.filter(cr =>
        cr.className.toLowerCase().includes(query) ||
        cr.subject.toLowerCase().includes(query) ||
        cr.teacherName.toLowerCase().includes(query) ||
        cr.day.toLowerCase().includes(query) ||
        cr.room.toLowerCase().includes(query)
      )
    : [];

  const matchingExamRoutines = query 
    ? examRoutines.filter(er =>
        er.className.toLowerCase().includes(query) ||
        er.subject.toLowerCase().includes(query) ||
        er.date.toLowerCase().includes(query)
      )
    : [];

  const matchingPages = query 
    ? navItems.filter(item => 
        item.label.toLowerCase().includes(query) ||
        (item.id === 'admission' && ('ভর্তি আবেদন ফরম ফি টাকা প্লে নার্সারি প্রাইমারি হাইস্কুল').includes(query)) ||
        (item.id === 'school-info' && ('ইতিহাস মিশন ভিশন কানন শিক্ষক বর্ণনা পরিচালনা তথ্য').includes(query)) ||
        (item.id === 'contact' && ('যোগাযোগ ঠিকানা ফোন ইমেইল মানচিত্র লোকেশন').includes(query))
      )
    : [];

  const matchesSchoolInfo = query && schoolInfo && (
    schoolInfo.about?.toLowerCase().includes(query) ||
    schoolInfo.history?.toLowerCase().includes(query) ||
    schoolInfo.mission?.toLowerCase().includes(query) ||
    schoolInfo.vision?.toLowerCase().includes(query) ||
    schoolInfo.address?.toLowerCase().includes(query) ||
    schoolInfo.contactPhone?.toLowerCase().includes(query)
  );

  const totalResultsCount = 
    matchingNotices.length + 
    matchingClassRoutines.length + 
    matchingExamRoutines.length + 
    matchingPages.length + 
    (matchesSchoolInfo ? 1 : 0);

  const handleSelectResult = (targetView: string) => {
    setView(targetView);
    setSearchQuery('');
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-blue-900 text-white shadow-md border-b-2 border-amber-500 no-print">
      {/* Top Bar for Contact Info & Announcement */}
      <div className="bg-blue-950 text-amber-400 text-xs py-1 px-4 flex justify-between items-center border-b border-blue-800/50">
        <div className="flex items-center space-x-2">
          <Phone size={12} className="inline" />
          <span>সহায়তার জন্য: ০১৯২৪-৫৩৫৫৮৯</span>
        </div>
        <div className="hidden md:block animate-pulse text-center font-medium">
          ★ ২০২৬ শিক্ষাবর্ষে প্লে থেকে দশম শ্রেণীতে ভর্তি চলছে! ★
        </div>
        <div className="flex items-center space-x-2">
          <span>স্থাপিত: ২০১১ ইং</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex justify-between items-center gap-4">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="bg-white p-1 rounded-full shadow-inner ring-2 ring-amber-400 transform group-hover:scale-105 transition-transform duration-300">
              <Logo size={50} logoUrl={logoUrl} />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors duration-300 font-sans leading-tight">
                আদর্শ শিশু কানন স্কুল
              </h1>
              <p className="text-[11px] sm:text-xs text-blue-200 tracking-wider">
                কাশিম বাজার, সুন্দরগঞ্জ, গাইবান্ধা
              </p>
            </div>
          </div>

          {/* Desktop Global Search Bar */}
          <div className="hidden md:block relative flex-1 max-w-sm mx-2" ref={searchContainerRef}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="নোটিশ, রুটিন বা বিষয় অনুসন্ধান করুন..."
                className="w-full bg-blue-950/80 text-white placeholder-blue-300 text-xs py-2 pl-9 pr-8 rounded-full border border-blue-700/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all shadow-inner"
              />
              <Search size={15} className="absolute left-3 top-2.5 text-amber-400 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-blue-300 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Desktop Live Search Results Dropdown */}
            {isSearchFocused && query && (
              <div className="absolute left-0 right-0 mt-2 bg-white text-gray-900 rounded-2xl shadow-2xl border border-blue-100 overflow-hidden z-50 max-h-[75vh] overflow-y-auto animate-fade-in">
                
                {/* Search Header */}
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-blue-950 flex items-center space-x-1">
                    <Sparkles size={14} className="text-amber-500 mr-1" /> 
                    অনুসন্ধান ফলাফল ({totalResultsCount})
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">Esc চাপে বন্ধ হবে</span>
                </div>

                {totalResultsCount === 0 ? (
                  <div className="p-6 text-center text-gray-500 space-y-2">
                    <p className="text-sm font-semibold">"{searchQuery}" এর জন্য কোনো ফলাফল পাওয়া যায়নি</p>
                    <p className="text-xs text-gray-400">বানান সঠিক আছে কিনা দেখুন অথবা নোটিশ বা রুটিন শব্দ লিখে চেষ্টা করুন।</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-3">
                    
                    {/* Notices Category */}
                    {matchingNotices.length > 0 && (
                      <div>
                        <div className="px-3 py-1 text-[11px] font-extrabold text-blue-800 uppercase tracking-wider flex items-center gap-1.5 bg-blue-50/60 rounded-md">
                          <Bell size={12} className="text-amber-600" />
                          নোটিশ বোর্ড ({matchingNotices.length})
                        </div>
                        <div className="mt-1 space-y-1">
                          {matchingNotices.slice(0, 4).map(notice => (
                            <div
                              key={notice.id}
                              onClick={() => handleSelectResult('notice-board')}
                              className="p-2.5 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-blue-100 group"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="text-xs font-bold text-blue-950 group-hover:text-blue-700 transition-colors line-clamp-1">
                                  {notice.title}
                                </h4>
                                <span className="text-[10px] text-gray-400 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                                  {notice.date}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">
                                {notice.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Class & Exam Routines */}
                    {(matchingClassRoutines.length > 0 || matchingExamRoutines.length > 0) && (
                      <div>
                        <div className="px-3 py-1 text-[11px] font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 bg-amber-50 rounded-md">
                          <Calendar size={12} className="text-amber-600" />
                          রুটিন সমূহ ({matchingClassRoutines.length + matchingExamRoutines.length})
                        </div>
                        <div className="mt-1 space-y-1">
                          {matchingClassRoutines.slice(0, 3).map(cr => (
                            <div
                              key={cr.id}
                              onClick={() => handleSelectResult('routines')}
                              className="p-2 hover:bg-amber-50/50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-amber-100 group flex items-center justify-between"
                            >
                              <div>
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mr-1.5">
                                  ক্লাস: {cr.className}
                                </span>
                                <span className="text-xs font-semibold text-gray-800">
                                  {cr.subject} ({cr.teacherName})
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500">{cr.day} | {cr.time}</span>
                            </div>
                          ))}

                          {matchingExamRoutines.slice(0, 3).map(er => (
                            <div
                              key={er.id}
                              onClick={() => handleSelectResult('routines')}
                              className="p-2 hover:bg-purple-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-purple-100 group flex items-center justify-between"
                            >
                              <div>
                                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded mr-1.5">
                                  পরীক্ষা: {er.className}
                                </span>
                                <span className="text-xs font-semibold text-gray-800">
                                  {er.subject}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500">{er.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pages & Info */}
                    {(matchingPages.length > 0 || matchesSchoolInfo) && (
                      <div>
                        <div className="px-3 py-1 text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 bg-emerald-50 rounded-md">
                          <Info size={12} className="text-emerald-600" />
                          স্কুল পেজ ও পরিচিতি
                        </div>
                        <div className="mt-1 space-y-1">
                          {matchingPages.map(page => (
                            <div
                              key={page.id}
                              onClick={() => handleSelectResult(page.id)}
                              className="p-2 hover:bg-emerald-50 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs font-bold text-emerald-950"
                            >
                              <span>{page.label} সেকশন</span>
                              <ChevronRight size={14} className="text-emerald-600" />
                            </div>
                          ))}

                          {matchesSchoolInfo && (
                            <div
                              onClick={() => handleSelectResult('school-info')}
                              className="p-2.5 hover:bg-emerald-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-emerald-100 text-xs text-gray-700"
                            >
                              <div className="font-bold text-emerald-900 mb-0.5">স্কুল পরিচিতি ও বিস্তারিত ইতিহাস</div>
                              <p className="text-[11px] text-gray-500 line-clamp-1">{schoolInfo?.about}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1 shrink-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  currentView === item.id
                    ? 'bg-amber-500 text-blue-950 shadow-sm'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            <span className="h-6 w-px bg-blue-800 mx-1.5"></span>

            {/* Admin Login Button */}
            <button
              onClick={() => {
                onAdminClick();
                setIsOpen(false);
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold border-2 cursor-pointer transition-all duration-300 ${
                currentView === 'admin'
                  ? 'bg-amber-500 border-amber-500 text-blue-950'
                  : isAdminLoggedIn
                  ? 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                  : 'border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-blue-950'
              }`}
            >
              <Lock size={14} />
              <span>{isAdminLoggedIn ? 'ড্যাশবোর্ড' : 'লগইন'}</span>
            </button>
          </nav>

          {/* Mobile Right Action Controls */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 rounded-lg border border-amber-400/40 text-amber-400 hover:bg-blue-800 focus:outline-none cursor-pointer"
              title="খুঁজুন"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => {
                onAdminClick();
                setIsOpen(false);
              }}
              className={`p-2 rounded-lg border cursor-pointer ${
                isAdminLoggedIn ? 'bg-green-600 border-green-600 text-white' : 'border-amber-500/50 text-amber-400'
              }`}
              title="Admin Login"
            >
              <Lock size={18} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-blue-100 hover:bg-blue-800 hover:text-white focus:outline-none cursor-pointer"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dedicated Search Input Bar */}
      {isMobileSearchOpen && (
        <div className="lg:hidden bg-blue-950 border-t border-amber-500/40 p-3 shadow-xl animate-fade-in relative z-50">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নোটিশ, রুটিন বা বিষয় দিয়ে খুঁজুন..."
              autoFocus
              className="w-full bg-blue-900 text-white placeholder-blue-300 text-sm py-2.5 pl-9 pr-9 rounded-xl border border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <Search size={16} className="absolute left-3 top-3 text-amber-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-blue-300"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Mobile Search Results list */}
          {query && (
            <div className="mt-2 bg-white text-gray-900 rounded-xl max-h-80 overflow-y-auto p-2 space-y-2 shadow-2xl">
              <div className="px-2 py-1 text-xs font-bold text-blue-900 border-b border-gray-100 flex justify-between">
                <span>ফলাফল ({totalResultsCount})</span>
                <span onClick={() => setIsMobileSearchOpen(false)} className="text-red-600 cursor-pointer">বন্ধ করুন</span>
              </div>

              {totalResultsCount === 0 ? (
                <div className="p-4 text-center text-xs text-gray-500">
                  "{searchQuery}" এর জন্য কোনো তথ্য পাওয়া যায়নি।
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {matchingNotices.map(notice => (
                    <div
                      key={notice.id}
                      onClick={() => handleSelectResult('notice-board')}
                      className="p-2 hover:bg-blue-50 rounded-lg cursor-pointer border-b border-gray-50"
                    >
                      <div className="font-bold text-blue-900">{notice.title}</div>
                      <div className="text-[10px] text-gray-500 line-clamp-1">{notice.content}</div>
                    </div>
                  ))}

                  {matchingClassRoutines.map(cr => (
                    <div
                      key={cr.id}
                      onClick={() => handleSelectResult('routines')}
                      className="p-2 hover:bg-amber-50 rounded-lg cursor-pointer border-b border-gray-50"
                    >
                      <span className="font-bold text-amber-800">ক্লাস {cr.className}:</span> {cr.subject} ({cr.teacherName})
                    </div>
                  ))}

                  {matchingExamRoutines.map(er => (
                    <div
                      key={er.id}
                      onClick={() => handleSelectResult('routines')}
                      className="p-2 hover:bg-purple-50 rounded-lg cursor-pointer border-b border-gray-50"
                    >
                      <span className="font-bold text-purple-800">পরীক্ষা {er.className}:</span> {er.subject}
                    </div>
                  ))}

                  {matchingPages.map(page => (
                    <div
                      key={page.id}
                      onClick={() => handleSelectResult(page.id)}
                      className="p-2 hover:bg-emerald-50 font-bold text-emerald-900 rounded-lg cursor-pointer flex justify-between"
                    >
                      <span>{page.label} পৃষ্ঠা</span>
                      <ChevronRight size={14} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-blue-950 border-t border-blue-800 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 cursor-pointer ${
                currentView === item.id
                  ? 'bg-amber-500 text-blue-950 shadow-md'
                  : 'text-blue-100 hover:bg-blue-900 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

