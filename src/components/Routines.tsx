import React, { useState } from 'react';
import { RoutineItem, ExamRoutineItem } from '../types';
import { 
  Printer, 
  BookOpen, 
  Clock, 
  Calendar, 
  Paperclip, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Eye, 
  ExternalLink, 
  X,
  FileCheck
} from 'lucide-react';

interface RoutinesProps {
  classRoutines: RoutineItem[];
  examRoutines: ExamRoutineItem[];
  classes: string[];
}

interface PreviewAttachment {
  url: string;
  title: string;
  name?: string;
  type?: string;
}

export default function Routines({ classRoutines, examRoutines, classes }: RoutinesProps) {
  const [activeTab, setActiveTab] = useState<'class' | 'exam'>('class');
  const [selectedClass, setSelectedClass] = useState<string>('Play');
  const [previewAttachment, setPreviewAttachment] = useState<PreviewAttachment | null>(null);

  // Filtered Class Routines
  const filteredClassRoutines = classRoutines.filter(r => r.className === selectedClass);
  
  const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const dayLabels: { [key: string]: string } = {
    'Saturday': 'শনিবার (Saturday)',
    'Sunday': 'রবিবার (Sunday)',
    'Monday': 'সোমবার (Monday)',
    'Tuesday': 'মঙ্গলবার (Tuesday)',
    'Wednesday': 'বুধবার (Wednesday)',
    'Thursday': 'বৃহস্পতিবার (Thursday)'
  };

  // Filtered Exam Routines
  const filteredExamRoutines = examRoutines.filter(r => r.className === selectedClass).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Current view attachments
  const currentRoutines = activeTab === 'class' ? filteredClassRoutines : filteredExamRoutines;
  const attachedItems = currentRoutines.filter(r => Boolean(r.attachmentUrl));

  const formatBengaliDate = (dateStr: string) => {
    const bails = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
      '-': '/'
    };
    return dateStr.split('').map(char => (bails as any)[char] || char).join('');
  };

  const handlePrint = () => {
    window.print();
  };

  const openAttachment = (url: string, title: string, name?: string, type?: string) => {
    if (type === 'image') {
      setPreviewAttachment({ url, title, name, type });
    } else {
      window.open(url, '_blank');
    }
  };

  // Isolated Render Method for Class Routine
  const renderClassRoutine = () => {
    if (filteredClassRoutines.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 font-medium">এই শ্রেণীর জন্য ক্লাস রুটিন এখনও প্রকাশ করা হয়নি।</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {daysOfWeek.map((day) => {
          const dayRoutines = filteredClassRoutines.filter(r => r.day === day);
          if (dayRoutines.length === 0) return null;

          return (
            <div key={day} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              {/* Day Title */}
              <div className="bg-blue-900 text-white px-4 py-2.5 text-sm font-bold flex justify-between items-center">
                <span>{dayLabels[day]}</span>
                <span className="text-xs bg-blue-800/80 px-2 py-0.5 rounded font-normal text-blue-100">
                  {dayRoutines.length} টি ক্লাস
                </span>
              </div>

              {/* Table of routines */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700 min-w-[550px]">
                  <thead className="bg-slate-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left">সময় (Time)</th>
                      <th className="px-4 py-3 text-left">বিষয় (Subject)</th>
                      <th className="px-4 py-3 text-left">শিক্ষক (Teacher)</th>
                      <th className="px-4 py-3 text-left">কক্ষ নং (Room)</th>
                      <th className="px-4 py-3 text-left no-print">সংযুক্তি (File)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dayRoutines.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3.5 font-semibold text-blue-950 flex items-center space-x-1.5 whitespace-nowrap">
                          <Clock size={14} className="text-blue-900 shrink-0" />
                          <span>{item.time}</span>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-gray-900">{item.subject}</td>
                        <td className="px-4 py-3.5 text-gray-600">{item.teacherName}</td>
                        <td className="px-4 py-3.5 font-mono text-gray-500">{item.room}</td>
                        <td className="px-4 py-3.5 no-print">
                          {item.attachmentUrl ? (
                            <button
                              type="button"
                              onClick={() => openAttachment(
                                item.attachmentUrl!, 
                                `${selectedClass} - ${item.subject} (${dayLabels[day]})`, 
                                item.attachmentName, 
                                item.attachmentType
                              )}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold rounded-lg border border-blue-200 text-xs transition cursor-pointer"
                              title={item.attachmentName || 'ফাইল দেখুন'}
                            >
                              {item.attachmentType === 'image' ? (
                                <ImageIcon size={13} className="text-emerald-600" />
                              ) : (
                                <FileText size={13} className="text-blue-600" />
                              )}
                              <span>{item.attachmentType === 'image' ? 'ছবি দেখুন' : 'ডকুমেন্ট'}</span>
                              <Eye size={11} className="text-blue-700" />
                            </button>
                          ) : (
                            <span className="text-gray-300 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Isolated Render Method for Exam Routine
  const renderExamRoutine = () => {
    if (filteredExamRoutines.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 font-medium">এই শ্রেণীর জন্য পরীক্ষার রুটিন এখনও প্রকাশ করা হয়নি।</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
        <table className="w-full text-left text-sm text-gray-700 min-w-[620px]">
          <thead className="bg-blue-900 text-white text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">তারিখ ও বার (Date & Day)</th>
              <th className="px-4 py-3">সময় (Time)</th>
              <th className="px-4 py-3">বিষয় (Subject)</th>
              <th className="px-4 py-3">কক্ষ (Room)</th>
              <th className="px-4 py-3 no-print">সংযুক্তি (File)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredExamRoutines.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-4 font-bold text-blue-950">
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} className="text-amber-500 shrink-0" />
                    <div>
                      <p>{formatBengaliDate(item.date)}</p>
                      <p className="text-xs text-gray-500 font-normal">{item.day}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-700 font-medium whitespace-nowrap">{item.time}</td>
                <td className="px-4 py-4 font-bold text-gray-900">{item.subject}</td>
                <td className="px-4 py-4 font-mono text-gray-500">{item.room}</td>
                <td className="px-4 py-4 no-print">
                  {item.attachmentUrl ? (
                    <button
                      type="button"
                      onClick={() => openAttachment(
                        item.attachmentUrl!, 
                        `${selectedClass} - ${item.subject} পরীক্ষার রুটিন`, 
                        item.attachmentName, 
                        item.attachmentType
                      )}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold rounded-lg border border-blue-200 text-xs transition cursor-pointer"
                      title={item.attachmentName || 'ফাইল দেখুন'}
                    >
                      {item.attachmentType === 'image' ? (
                        <ImageIcon size={13} className="text-emerald-600" />
                      ) : (
                        <FileText size={13} className="text-blue-600" />
                      )}
                      <span>{item.attachmentType === 'image' ? 'ছবি দেখুন' : 'ডকুমেন্ট'}</span>
                      <Eye size={11} className="text-blue-700" />
                    </button>
                  ) : (
                    <span className="text-gray-300 text-xs">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Page Header */}
      <div className="text-center mb-8 no-print">
        <h3 className="text-2xl sm:text-3xl font-black text-blue-950 font-sans">ক্লাস ও পরীক্ষা রুটিন</h3>
        <p className="text-gray-500 text-sm mt-1">আদর্শ শিশু কানন স্কুলের সকল শ্রেণীর নিয়মিত ক্লাস এবং পরীক্ষা সময়সূচী এখানে দেখুন।</p>
        <div className="w-16 h-1 bg-amber-500 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Class Selector & Tab Switches */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl shadow-md border border-slate-100 mb-8 no-print">
        
        {/* Class Filter */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-bold text-gray-700 shrink-0">শ্রেণী নির্বাচন করুন:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-bold text-blue-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab('class')}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'class'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-900'
            }`}
          >
            ক্লাস রুটিন
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'exam'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-900'
            }`}
          >
            পরীক্ষার রুটিন
          </button>
        </div>

        {/* Print button */}
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
        >
          <Printer size={16} />
          <span>প্রিন্ট / PDF সংরক্ষণ</span>
        </button>

      </div>

      {/* Routine Display Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden print-section p-6 sm:p-8">
        
        {/* Print-only Header */}
        <div className="hidden print:flex flex-col items-center text-center border-b-2 border-blue-900 pb-4 mb-6">
          <h2 className="text-2xl font-black text-blue-950">আদর্শ শিশু কানন স্কুল</h2>
          <p className="text-sm text-gray-600">কাশিম বাজার, সুন্দরগঞ্জ, গাইবান্ধা, বাংলাদেশ</p>
          <div className="mt-3 px-4 py-1 bg-blue-100 rounded text-sm font-bold text-blue-950">
            {selectedClass} - {activeTab === 'class' ? 'ক্লাস সময়সূচী' : 'পরীক্ষার সময়সূচী'}
          </div>
        </div>

        {/* Screen Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6 no-print border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="text-blue-900" size={24} />
            <h4 className="text-lg font-black text-blue-950 font-sans">
              {selectedClass} - {activeTab === 'class' ? 'ক্লাস রুটিন' : 'পরীক্ষার রুটিন'}
            </h4>
          </div>
          {attachedItems.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              <FileCheck size={14} className="text-emerald-600" />
              <span>{attachedItems.length} টি ছবি / ফাইল সংযুক্তি পাওয়া গেছে</span>
            </span>
          )}
        </div>

        {/* Highlights banner if uploaded routine files/images exist for this class */}
        {attachedItems.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-emerald-50/60 border border-blue-200 rounded-2xl shadow-sm no-print">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
                  <Paperclip size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-blue-950 text-sm">
                    {selectedClass} শ্রেণীর রুটিনের ছবি বা ডকুমেন্ট সংযুক্তি
                  </h5>
                  <p className="text-xs text-gray-600">
                    এডমিন কর্তৃক আপলোডকৃত পূর্ণাঙ্গ রুটিন ছবি বা ফাইল নিচে ক্লিক করে সরাসরি দেখতে ও ডাউনলোড করতে পারেন:
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                {attachedItems.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    type="button"
                    onClick={() => openAttachment(
                      item.attachmentUrl!, 
                      `${selectedClass} - ${item.subject} রুটিন`, 
                      item.attachmentName, 
                      item.attachmentType
                    )}
                    className="px-3 py-1.5 bg-white hover:bg-blue-900 hover:text-white text-blue-950 border border-blue-200 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                  >
                    {item.attachmentType === 'image' ? (
                      <ImageIcon size={14} className="text-emerald-600" />
                    ) : (
                      <FileText size={14} className="text-blue-600" />
                    )}
                    <span className="max-w-[130px] truncate">{item.subject}</span>
                    <Eye size={12} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamically render routines using robust sub-render helper methods */}
        {activeTab === 'class' ? renderClassRoutine() : renderExamRoutine()}

        {/* Print-only footer signature */}
        <div className="hidden print:flex justify-between items-center mt-12 pt-8 border-t border-dashed border-gray-300 text-xs">
          <div>
            <p className="font-bold">আদর্শ শিশু কানন স্কুল</p>
            <p className="text-gray-500">কাশিম বাজার, সুন্দরগঞ্জ, গাইবান্ধা</p>
          </div>
          <div className="text-center">
            <div className="w-32 border-b border-gray-400 mb-1 mx-auto"></div>
            <p className="font-bold">সহঃ পরিচালক</p>
          </div>
          <div className="text-center">
            <div className="w-32 border-b border-gray-400 mb-1 mx-auto"></div>
            <p className="font-bold">পরিচালক</p>
          </div>
        </div>

      </div>

      {/* Lightbox Modal for Image / Attachment Preview */}
      {previewAttachment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setPreviewAttachment(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center space-x-2 truncate">
                <Paperclip size={18} className="text-blue-900 shrink-0" />
                <h4 className="font-bold text-blue-950 text-sm truncate">
                  {previewAttachment.title}
                </h4>
                {previewAttachment.name && (
                  <span className="text-xs text-gray-500 truncate hidden sm:inline">
                    ({previewAttachment.name})
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={previewAttachment.url}
                  download={previewAttachment.name || 'routine-file'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
                >
                  <Download size={14} />
                  <span>ডাউনলোড</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewAttachment(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
                  title="বন্ধ করুন"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-100 min-h-[300px]">
              {previewAttachment.type === 'image' || previewAttachment.url.startsWith('data:image') ? (
                <img 
                  src={previewAttachment.url} 
                  alt={previewAttachment.title}
                  className="max-h-[75vh] w-auto object-contain rounded-lg shadow-md"
                />
              ) : (
                <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md w-full">
                  <FileText size={48} className="mx-auto text-blue-900 mb-3" />
                  <p className="font-bold text-gray-800 mb-1">{previewAttachment.name || 'সংযুক্ত ডকুমেন্ট'}</p>
                  <p className="text-xs text-gray-500 mb-4">এই ফাইলটি প্রিভিউ করার জন্য নিচের বাটনে ক্লিক করে ওপেন বা ডাউনলোড করুন।</p>
                  <a
                    href={previewAttachment.url}
                    download={previewAttachment.name || 'routine-document'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-sm font-bold transition shadow-sm"
                  >
                    <Download size={16} />
                    <span>ফাইল ওপেন / ডাউনলোড</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
