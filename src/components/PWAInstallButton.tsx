import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Monitor, CheckCircle, X, HelpCircle, Share2, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full' | 'drawer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed and running as standalone app, show subtle badge or hide
  if (isInstalled) {
    if (variant === 'drawer') {
      return (
        <div className="flex items-center space-x-2 px-3 py-2 bg-green-900/40 text-green-300 rounded-xl text-xs font-medium border border-green-700/50">
          <CheckCircle size={15} className="text-green-400" />
          <span>অ্যাপ ইনস্টল করা সম্পন্ন হয়েছে</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (installed) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'compact' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-blue-950 shadow-sm transition active:scale-95 cursor-pointer ring-1 ring-amber-300/50"
          title="অ্যান্ড্রয়েড বা ডেক্সটপে অ্যাপ হিসেবে ইনস্টল করুন"
        >
          {isAndroid ? <Smartphone size={14} className="shrink-0" /> : <Download size={14} className="shrink-0" />}
          <span>{isAndroid ? 'Android অ্যাপ' : 'অ্যাপ ইনস্টল'}</span>
        </button>
      )}

      {variant === 'drawer' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-blue-950 shadow-md transition active:scale-98 cursor-pointer border border-amber-300"
        >
          <div className="flex items-center space-x-2.5">
            <Smartphone size={18} />
            <div className="text-left">
              <p className="font-extrabold leading-tight">Android বা PC অ্যাপ হিসেবে ব্যবহার করুন</p>
              <p className="text-[11px] text-blue-900/80 font-normal">দ্রুত ওপেন ও অফলাইনে পড়ার সুবিধা</p>
            </div>
          </div>
          <span className="bg-blue-950 text-amber-400 text-xs px-2 py-1 rounded-md shrink-0">
            ইনস্টল
          </span>
        </button>
      )}

      {variant === 'full' && (
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl border border-blue-700/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/30 shrink-0">
              {isAndroid ? <Smartphone size={24} /> : <Monitor size={24} />}
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                ডেস্কটপ এবং অ্যান্ড্রয়েড উভয় ডিভাইসেই চালান
              </h4>
              <p className="text-xs text-blue-200 mt-0.5">
                কোনো ভারী প্লে স্টোর ছাড়াই সরাসরি ব্রাউজার থেকে মোবাইল হোমস্ক্রিন বা পিসিতে ইনস্টল করুন।
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-blue-950 text-xs sm:text-sm font-black rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <Download size={16} />
            <span>অ্যাপ ইনস্টল করুন</span>
          </button>
        </div>
      )}

      {/* Guide Modal for devices when browser prompt isn't directly auto-triggered */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="text-amber-500" size={20} />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  ডিভাইসে ইনস্টল করার সহজ নিয়ম
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Instruction Tabs or Sections */}
            <div className="space-y-3 text-xs sm:text-sm text-gray-700 dark:text-slate-300">
              
              {/* Android Guide */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-blue-950 dark:text-amber-400">
                  <Smartphone size={16} />
                  <span>অ্যান্ড্রয়েড (Android Phone / Tablet):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600 dark:text-slate-300">
                  <li>ব্রাউজারের (Chrome/Edge) ওপরের ডানে <strong>তিনটি ডট (⋮)</strong> মেন্যুতে ক্লিক করুন।</li>
                  <li><strong>"Add to Home screen"</strong> অথবা <strong>"Install app"</strong> বাটনে ট্যাপ করুন।</li>
                  <li>এবার হোমস্ক্রিন থেকে যে কোনো সময় এক ক্লিকে সম্পূর্ণ অ্যাপের মতো ব্যবহার করতে পারবেন।</li>
                </ol>
              </div>

              {/* Desktop Guide */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-gray-900 dark:text-white">
                  <Monitor size={16} />
                  <span>ডেস্কটপ ও ল্যাপটপ (Windows / Mac / Linux):</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                  ব্রাউজারের এড্রেস বারের (URL bar) একদম ডানপাশে থাকা <strong>Install (ডাউনলোড আইকন)</strong> এ ক্লিক করুন অথবা ব্রাউজার মেন্যু থেকে <strong>"Install আল-হেরা / আদর্শ কানন"</strong> সিলেক্ট করুন।
                </p>
              </div>

              {/* iOS Guide */}
              {isIOS && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-amber-900 dark:text-amber-300">
                    <Share2 size={16} />
                    <span>আইফোন / আইপ্যাড (iPhone / iPad Safari):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600 dark:text-slate-300">
                    <li>Safari ব্রাউজারের নিচে থাকা <strong>Share (শেয়ার)</strong> আইকনে চাপ দিন।</li>
                    <li>নিচে স্ক্রোল করে <strong>"Add to Home Screen"</strong> বেছে নিন।</li>
                  </ol>
                </div>
              )}

            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow transition cursor-pointer"
            >
              বুঝেছি, বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </>
  );
};
