import React, { useState } from 'react';
import Logo from './Logo';
import { Menu, X, Lock, Phone, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  onAdminClick: () => void;
  isAdminLoggedIn: boolean;
}

export default function Header({ currentView, setView, onAdminClick, isAdminLoggedIn }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="bg-white p-1 rounded-full shadow-inner ring-2 ring-amber-400 transform group-hover:scale-105 transition-transform duration-300">
              <Logo size={55} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors duration-300 font-sans">
                আদর্শ শিশু কানন স্কুল
              </h1>
              <p className="text-xs text-blue-200 tracking-wider">
                কাশিম বাজার, সুন্দরগঞ্জ, গাইবান্ধা
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
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

            <span className="h-6 w-px bg-blue-800 mx-2"></span>

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
              <span>{isAdminLoggedIn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন লগইন'}</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
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

      {/* Mobile Drawer */}
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
