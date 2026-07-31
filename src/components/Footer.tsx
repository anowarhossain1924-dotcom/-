import React from 'react';
import Logo from './Logo';
import { SchoolInfo } from '../types';
import { ArrowUp, Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  info: SchoolInfo;
}

export default function Footer({ info }: FooterProps) {
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-amber-500 pt-12 pb-6 relative overflow-hidden no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {info.logoUrl && info.logoUrl.trim() !== '' && (
                <div className="bg-white p-1 rounded-full shadow-inner ring-2 ring-amber-400">
                  <Logo size={55} logoUrl={info.logoUrl} />
                </div>
              )}
              <div>
                <h4 className="text-lg font-bold text-white font-sans">আদর্শ শিশু কানন স্কুল</h4>
                <p className="text-xs text-slate-400 tracking-wide">স্থাপিত: ২০১১ ইং</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              কোমলমতি শিশুদের সঠিক নৈতিক শিক্ষা, নিয়মকানুন এবং আধুনিক ডিজিটাল যুগোপযোগী শিশুবান্ধব শিক্ষাদানের প্রধান নির্ভরযোগ্য প্রতিষ্ঠান।
            </p>
          </div>

          {/* Col 2: Management Committee (Requested Exactly) */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-l-4 border-amber-500 pl-2">পরিচালনা পর্ষদ</h5>
            
            <div className="space-y-3">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400">পরিচালক</p>
                <p className="text-base font-bold text-white">মোঃ মতিয়ার ভূঁইয়া</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400">সহঃ পরিচালক</p>
                <p className="text-base font-bold text-white">মোঃ আনোয়ার হোসাইন</p>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Contacts */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-l-4 border-amber-500 pl-2">যোগাযোগের ঠিকানা</h5>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2.5">
                <MapPin size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">{info.address}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone size={16} className="text-amber-500" />
                <span className="text-slate-400">০১৯২৪-৫৩৫৫৮৯</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail size={16} className="text-amber-500" />
                <span className="text-slate-400 font-mono">{info.contactEmail}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 bg-slate-800 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 bg-slate-800 hover:bg-rose-600 text-white rounded-lg transition-colors cursor-pointer"
                title="Youtube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-semibold tracking-wider">
          <div>
            © ২০২৬ আদর্শ শিশু কানন স্কুল। সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-right">
            <div className="normal-case">
              <div className="font-bold text-amber-400 text-sm">All credit MUSTAKIM BILLAH</div>
              <div className="text-[11px] text-slate-400 font-normal">Junior Web Developer</div>
            </div>
            <button
              onClick={scrollToTop}
              className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-blue-950 text-slate-300 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
              title="Back to Top"
            >
              <span>উপরে যান</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
