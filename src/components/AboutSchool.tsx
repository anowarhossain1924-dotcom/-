import React from 'react';
import { SchoolInfo } from '../types';
import { MessageSquare, Phone, Mail, MapPin, History, Target, ShieldCheck, HelpCircle, Award } from 'lucide-react';

interface AboutSchoolProps {
  info: SchoolInfo;
  classes: string[];
}

export default function AboutSchool({ info, classes }: AboutSchoolProps) {
  // Configurable WhatsApp link
  const cleanNumber = info.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      
      {/* 1. Page Header */}
      <div className="text-center">
        <h3 className="text-2xl sm:text-3xl font-black text-blue-950 font-sans">স্কুল সম্পর্কিত তথ্য ও পরিচিতি</h3>
        <p className="text-gray-500 text-sm mt-1">আদর্শ শিশু কানন স্কুলের সংক্ষিপ্ত ইতিহাস, মিশন, ভিশন ও সুযোগ-সুবিধাসমূহ</p>
        <div className="w-16 h-1 bg-amber-500 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* 2. Grid with History, Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: About & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 space-y-4">
            <div className="flex items-center space-x-2.5 text-blue-900 border-b border-slate-100 pb-2">
              <ShieldCheck size={22} />
              <h4 className="text-xl font-bold font-sans">আমাদের সম্পর্কে</h4>
            </div>
            <p className="text-gray-600 leading-relaxed text-base">{info.about}</p>
          </div>

          {/* History Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 space-y-4">
            <div className="flex items-center space-x-2.5 text-blue-900 border-b border-slate-100 pb-2">
              <History size={22} />
              <h4 className="text-xl font-bold font-sans">স্কুলের ইতিহাস ও পথচলা</h4>
            </div>
            <p className="text-gray-600 leading-relaxed text-base whitespace-pre-wrap">{info.history}</p>
          </div>
        </div>

        {/* Right column: Mission & Vision */}
        <div className="space-y-6">
          {/* Mission */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
              <Target size={120} />
            </div>
            <div className="flex items-center space-x-2.5 text-amber-400 border-b border-blue-800 pb-2">
              <Target size={22} />
              <h4 className="text-xl font-bold font-sans">আমাদের মিশন (Mission)</h4>
            </div>
            <p className="text-blue-100 leading-relaxed text-sm">{info.mission}</p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
              <ShieldCheck size={120} />
            </div>
            <div className="flex items-center space-x-2.5 text-amber-400 border-b border-slate-800 pb-2">
              <ShieldCheck size={22} />
              <h4 className="text-xl font-bold font-sans">আমাদের ভিশন (Vision)</h4>
            </div>
            <p className="text-slate-200 leading-relaxed text-sm">{info.vision}</p>
          </div>

          {/* Academic Classes card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
            <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">আমাদের পাঠদান শ্রেণীসমূহ</h5>
            <div className="flex flex-wrap gap-2">
              {classes.map(cls => (
                <span key={cls} className="px-3 py-1 bg-blue-50 text-blue-900 text-xs font-black rounded-lg border border-blue-100/50">
                  {cls}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Facilities Section */}
      <div className="bg-gradient-to-b from-blue-50/40 to-transparent p-6 sm:p-8 rounded-2xl border border-slate-100/80">
        <div className="flex items-center space-x-2 mb-6 justify-center">
          <Award className="text-blue-900" size={24} />
          <h4 className="text-xl sm:text-2xl font-black text-blue-950 font-sans">স্কুলের আধুনিক সুযোগ-সুবিধাসমূহ</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {info.facilities.map((fac, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-50 shadow-sm flex items-start space-x-3 group hover:border-blue-200 hover:shadow-md transition-all">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-950 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                {idx + 1}
              </span>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">{fac}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Contact & WhatsApp (Highest Priority Call-out) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 space-y-6">
          <h4 className="text-lg font-bold text-blue-950 border-b border-slate-100 pb-2">স্কুলের ঠিকানা ও যোগাযোগ</h4>
          
          <div className="space-y-4 text-sm text-gray-600">
            {/* Address */}
            <div className="flex items-start space-x-3">
              <MapPin className="text-blue-900 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-bold text-gray-800">প্রতিষ্ঠানের ঠিকানা</p>
                <p>{info.address}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-3">
              <Phone className="text-blue-900 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-bold text-gray-800">মোবাইল নম্বর</p>
                <p>০১৯২৪-৫৩৫৫৮৯</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-3">
              <Mail className="text-blue-900 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-bold text-gray-800">ইমেইল এড্রেস</p>
                <p className="font-mono">{info.contactEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* HIGH-PRIORITY WHATSAPP CTA - Bengali Title exactly: "যেকোন অভিযোগ ও বিস্তারিত তথ্যের জন্য যোগাযোগ করুন" */}
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-500/15 via-white to-green-500/5 rounded-3xl p-6 sm:p-10 border-2 border-emerald-500/40 flex flex-col justify-center items-center text-center space-y-6 shadow-sm">
          <div className="p-4 bg-green-100 rounded-full text-green-600 animate-pulse">
            <MessageSquare size={36} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 font-sans tracking-tight">
              যেকোন অভিযোগ ও বিস্তারিত তথ্যের জন্য যোগাযোগ করুন
            </h3>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              আমাদের সহঃ পরিচালক বা অফিস ডেস্কে সরাসরি হোয়াটসঅ্যাপের মাধ্যমে মেসেজ পাঠাতে নিচের বাটনে ক্লিক করুন।
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-green-600 hover:bg-green-500 text-white font-extrabold text-base px-8 py-4 rounded-full shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 transition-all duration-300 transform"
          >
            {/* Custom WhatsApp Icon or simple MessageSquare */}
            <MessageSquare size={20} fill="#ffffff" />
            <span>সরাসরি হোয়াটসঅ্যাপ করুন ({info.whatsappNumber})</span>
          </a>
        </div>

      </div>

    </div>
  );
}
