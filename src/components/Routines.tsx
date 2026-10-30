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
  FileCheck,
  Sparkles,
  ZoomIn,
  Layers,
  FileSpreadsheet
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

  // Sub-view toggle preference ('auto' | 'full' | 'table')
  const [classViewPref, setClassViewPref] = useState<'full' | 'table'>('full');
  const [examViewPref, setExamViewPref] = useState<'full' | 'table'>('full');

  // Filtered Class Routines for selected class
  const filteredClassRoutines = classRoutines.filter(r => r.className === selectedClass);
  const fullClassRoutines = filteredClassRoutines.filter(r => Boolean(r.isFullRoutine || r.time === 'পূর্ণাঙ্গ সময়সূচী'));
  const singleClassRoutines = filteredClassRoutines.filter(r => !r.isFullRoutine && r.time !== 'পূর্ণাঙ্গ সময়সূচী');
  
  const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const dayLabels: { [key: string]: string } = {
    'Saturday': 'শনিবার (Saturday)',
    'Sunday': 'রবিবার (Sunday)',
    'Monday': 'সোমবার (Monday)',
    'Tuesday': 'মঙ্গলবার (Tuesday)',
    'Wednesday': 'বুধবার (Wednesday)',
    'Thursday': 'বৃহস্পতিবার (Thursday)'
  };

  // Filtered Exam Routines for selected class
  const filteredExamRoutines = examRoutines.filter(r => r.className === selectedClass).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  const fullExamRoutines = filteredExamRoutines.filter(r => Boolean(r.isFullRoutine || r.day === 'পূর্ণাঙ্গ সময়সূচী'));
  const singleExamRoutines = filteredExamRoutines.filter(r => !r.isFullRoutine && r.day !== 'পূর্ণাঙ্গ সময়সূচী');

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
    if (type === 'image' || url.startsWith('data:image')) {
      setPreviewAttachment({ url, title, name, type: 'image' });
    } else {
      window.open(url, '_blank');
    }
  };

  // Component to render a full uploaded routine card (Image or Document)
  const renderFullRoutineCard = (item: RoutineItem | ExamRoutineItem, isExam = false) => {
    const isImage = item.attachmentType === 'image' || item.attachmentUrl?.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif)$/i.test(item.attachmentName || '');
    const isPdf = item.attachmentType === 'pdf' || /\.pdf$/i.test(item.attachmentName || '');

    return (
      <div key={item.id} className="bg-slate-50 border border-blue-200 rounded-2xl overflow-hidden shadow-sm space-y-4 p-5 sm:p-6 transition-all hover:shadow-md">
        
        {/* Header of Full Routine Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-blue-100 gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-900 rounded-full font-bold text-xs">
                <Sparkles size={12} className="text-purple-600" />
                <span>অফিসিয়াল পূর্ণাঙ্গ {isExam ? 'পরীক্ষার' : 'ক্লাস'} রুটিন কপি</span>
              </span>
              <span className="text-xs bg-blue-100 text-blue-900 font-bold px-2.5 py-0.5 rounded-md">
                {item.className}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-blue-950 mt-1">
              {item.subject}
            </h4>
            {item.note && (
              <p className="text-xs text-gray-600 font-medium">{item.note}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 no-print">
            {item.attachmentUrl && (
              <a
                href={item.attachmentUrl}
                download={item.attachmentName || 'routine-official-file'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
              >
                <Download size={14} />
                <span>ডাউনলোড</span>
              </a>
            )}
          </div>
        </div>

        {/* Display image directly or file card */}
        {item.attachmentUrl ? (
          <div>
            {isImage ? (
              <div className="space-y-3">
                <div 
                  className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white p-2 sm:p-3 text-center cursor-pointer shadow-inner"
                  onClick={() => openAttachment(item.attachmentUrl!, `${item.className} - ${item.subject}`, item.attachmentName, 'image')}
                >
                  <img
                    src={item.attachmentUrl}
                    alt={item.subject}
                    className="max-h-[600px] w-auto mx-auto object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-4 py-2 bg-blue-900/90 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg">
                      <ZoomIn size={16} />
                      <span>বড় করে দেখতে ক্লিক করুন (Zoom)</span>
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 no-print px-1">
                  <span>ফাইলের নাম: {item.attachmentName || 'রুটিন ছবি'}</span>
                  <button
                    type="button"
                    onClick={() => openAttachment(item.attachmentUrl!, `${item.className} - ${item.subject}`, item.attachmentName, 'image')}
                    className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ZoomIn size={13} />
                    <span>পূর্ণ পর্দায় দেখুন</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white rounded-xl border border-blue-200 text-center space-y-3 max-w-lg mx-auto shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 mx-auto flex items-center justify-center">
                  {isPdf ? <FileText size={32} className="text-rose-600" /> : <FileSpreadsheet size={32} className="text-emerald-600" />}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.attachmentName || 'অফিসিয়াল রুটিন ডকুমেন্ট'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.attachmentType?.toUpperCase() || 'DOCUMENT'} ফরম্যাটের পূর্ণাঙ্গ রুটিন ফাইল
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2 no-print">
                  <a
                    href={item.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Eye size={14} />
                    <span>সরাসরি দেখুন</span>
                  </a>
                  <a
                    href={item.attachmentUrl}
                    download={item.attachmentName || 'routine-file'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Download size={14} />
                    <span>ডাউনলোড করুন</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500">কোন ফাইল পাওয়া যায়নি।</p>
        )}

      </div>
    );
  };

  // Render Method for Class Routine (Handles Dual Modes: Full File Upload vs Single Period Entries)
  const renderClassRoutine = () => {
    const hasFull = fullClassRoutines.length > 0;
    const hasSingle = singleClassRoutines.length > 0;

    if (!hasFull && !hasSingle) {
      return (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
          <BookOpen size={40} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 font-bold text-sm">{selectedClass} শ্রেণীর জন্য ক্লাস রুটিন এখনও প্রকাশ করা হয়নি।</p>
          <p className="text-xs text-gray-400 mt-1">রুটিন প্রকাশিত হলে এখানে দেখা যাবে।</p>
        </div>
      );
    }

    // Determine what to display
    const showFull = hasFull && (!hasSingle || classViewPref === 'full');
    const showTable = hasSingle && (!hasFull || classViewPref === 'table');

    return (
      <div className="space-y-6">

        {/* Dual Mode Switcher Banner (when both full file and single period entries exist) */}
        {hasFull && hasSingle && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-blue-50/70 border border-blue-200 rounded-xl gap-2 no-print">
            <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <Layers size={14} className="text-blue-700" />
              <span>এই শ্রেণীর জন্য পূর্ণাঙ্গ রুটিন ফাইল ও পিরিয়ড তালিকা উভয়ই বিদ্যমান:</span>
            </span>
            <div className="flex bg-white p-1 rounded-lg border border-blue-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setClassViewPref('full')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  classViewPref === 'full' ? 'bg-blue-900 text-white shadow-xs' : 'text-gray-600 hover:text-blue-900'
                }`}
              >
                <Sparkles size={12} />
                <span>পূর্ণাঙ্গ রুটিন কপি ({fullClassRoutines.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setClassViewPref('table')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  classViewPref === 'table' ? 'bg-blue-900 text-white shadow-xs' : 'text-gray-600 hover:text-blue-900'
                }`}
              >
                <Clock size={12} />
                <span>পিরিয়ডভিত্তিক ছক ({singleClassRoutines.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* 1. Show Full Routine Cards if available and selected */}
        {showFull && (
          <div className="space-y-6">
            {fullClassRoutines.map(item => renderFullRoutineCard(item, false))}
          </div>
        )}

        {/* 2. Show Single Period Structured Table if available and selected */}
        {showTable && (
          <div className="space-y-6">
            {daysOfWeek.map((day) => {
              const dayRoutines = singleClassRoutines.filter(r => r.day === day);
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
        )}

      </div>
    );
  };

  // Render Method for Exam Routine (Handles Dual Modes: Full File Upload vs Single Subject Entries)
  const renderExamRoutine = () => {
    const hasFull = fullExamRoutines.length > 0;
    const hasSingle = singleExamRoutines.length > 0;

    if (!hasFull && !hasSingle) {
      return (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
          <Calendar size={40} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 font-bold text-sm">{selectedClass} শ্রেণীর জন্য পরীক্ষার রুটিন এখনও প্রকাশ করা হয়নি।</p>
          <p className="text-xs text-gray-400 mt-1">পরীক্ষার তারিখ ও রুটিন প্রকাশিত হলে এখানে দেখা যাবে।</p>
        </div>
      );
    }

    const showFull = hasFull && (!hasSingle || examViewPref === 'full');
    const showTable = hasSingle && (!hasFull || examViewPref === 'table');

    return (
      <div className="space-y-6">

        {/* Dual Mode Switcher Banner (when both full file and single subject entries exist) */}
        {hasFull && hasSingle && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-blue-50/70 border border-blue-200 rounded-xl gap-2 no-print">
            <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <Layers size={14} className="text-blue-700" />
              <span>এই শ্রেণীর জন্য সম্পূর্ণ পরীক্ষার রুটিন কপি ও বিষয়ভিত্তিক তালিকা উভয়ই বিদ্যমান:</span>
            </span>
            <div className="flex bg-white p-1 rounded-lg border border-blue-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setExamViewPref('full')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  examViewPref === 'full' ? 'bg-blue-900 text-white shadow-xs' : 'text-gray-600 hover:text-blue-900'
                }`}
              >
                <Sparkles size={12} />
                <span>সম্পূর্ণ রুটিন কপি ({fullExamRoutines.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setExamViewPref('table')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  examViewPref === 'table' ? 'bg-blue-900 text-white shadow-xs' : 'text-gray-600 hover:text-blue-900'
                }`}
              >
                <Calendar size={12} />
                <span>বিষয়ভিত্তিক ছক ({singleExamRoutines.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* 1. Show Full Routine Cards if available and selected */}
        {showFull && (
          <div className="space-y-6">
            {fullExamRoutines.map(item => renderFullRoutineCard(item, true))}
          </div>
        )}

        {/* 2. Show Single Subject Exam Table if available and selected */}
        {showTable && (
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
                {singleExamRoutines.map((item) => (
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
        )}

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
              <span>{attachedItems.length} টি ছবি / ফাইল সংযুক্তি</span>
            </span>
          )}
        </div>

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
