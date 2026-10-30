import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center gap-3 rounded-xl bg-amber-600 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl border border-amber-400/40 animate-bounce-subtle">
      <div className="p-1.5 bg-amber-700/60 rounded-lg shrink-0">
        <WifiOff size={18} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="font-bold">ইন্টারনেট সংযোগ নেই</p>
        <p className="text-[11px] text-amber-100 font-normal">অফলাইন মোডে সংরক্ষিত ডাটা ব্যবহার করা হচ্ছে।</p>
      </div>
    </div>
  );
};
