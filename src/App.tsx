import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import NoticeBoard from './components/NoticeBoard';
import AdmissionForm from './components/AdmissionForm';
import Routines from './components/Routines';
import AboutSchool from './components/AboutSchool';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

import { 
  Notice, 
  RoutineItem, 
  ExamRoutineItem, 
  AdmissionApplication, 
  BannerSlide, 
  SchoolInfo 
} from './types';

import { 
  DEFAULT_NOTICES, 
  DEFAULT_CLASS_ROUTINES, 
  DEFAULT_EXAM_ROUTINES, 
  DEFAULT_APPLICATIONS, 
  DEFAULT_BANNERS, 
  DEFAULT_SCHOOL_INFO 
} from './lib/initialData';

import { 
  subscribeNotices, 
  subscribeClassRoutines, 
  subscribeExamRoutines, 
  subscribeApplications, 
  subscribeBanners, 
  subscribeSchoolInfo, 
  saveApplicationToFirestore 
} from './lib/firebase';

import { 
  GraduationCap, 
  CalendarDays, 
  Clock, 
  School, 
  PhoneCall, 
  FileText, 
  MapPin, 
  MessageSquare 
} from 'lucide-react';

const CLASSES = ['Play', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

export default function App() {
  const [currentView, setView] = useState<string>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // --- FIRESTORE REALTIME STATE ---
  const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES);
  const [classRoutines, setClassRoutines] = useState<RoutineItem[]>(DEFAULT_CLASS_ROUTINES);
  const [examRoutines, setExamRoutines] = useState<ExamRoutineItem[]>(DEFAULT_EXAM_ROUTINES);
  const [applications, setApplications] = useState<AdmissionApplication[]>(DEFAULT_APPLICATIONS);
  const [banners, setBanners] = useState<BannerSlide[]>(DEFAULT_BANNERS);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(DEFAULT_SCHOOL_INFO);

  // Subscribe to Firestore database for real-time live sync across devices
  useEffect(() => {
    const unsubNotices = subscribeNotices(setNotices, DEFAULT_NOTICES);
    const unsubClassRoutines = subscribeClassRoutines(setClassRoutines, DEFAULT_CLASS_ROUTINES);
    const unsubExamRoutines = subscribeExamRoutines(setExamRoutines, DEFAULT_EXAM_ROUTINES);
    const unsubApps = subscribeApplications(setApplications, DEFAULT_APPLICATIONS);
    const unsubBanners = subscribeBanners(setBanners, DEFAULT_BANNERS);
    const unsubSchoolInfo = subscribeSchoolInfo(setSchoolInfo, DEFAULT_SCHOOL_INFO);

    return () => {
      unsubNotices();
      unsubClassRoutines();
      unsubExamRoutines();
      unsubApps();
      unsubBanners();
      unsubSchoolInfo();
    };
  }, []);


  // --- HANDLERS ---
  const handleAdmissionSubmit = (appForm: Omit<AdmissionApplication, 'id' | 'submittedAt' | 'status'>) => {
    const newApplication: AdmissionApplication = {
      ...appForm,
      id: 'ASK-' + Math.floor(100000 + Math.random() * 900000),
      submittedAt: new Date().toLocaleString('bn-BD', { hour12: true }),
      status: 'pending'
    };
    setApplications(prev => [newApplication, ...prev]);
    saveApplicationToFirestore(newApplication);
  };

  const navigateToAdmin = () => {
    setView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // WhatsApp Link generator
  const cleanNumber = schoolInfo.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-800 font-sans selection:bg-blue-900 selection:text-white">
      
      {/* Header */}
      <Header 
        currentView={currentView} 
        setView={setView} 
        onAdminClick={navigateToAdmin} 
        isAdminLoggedIn={isAdminLoggedIn} 
      />

      {/* Main Content View Switcher */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <div className="space-y-4">
            
            {/* Hero Slider */}
            <Hero banners={banners} setView={setView} />

            {/* News Feed / Notice Board Widget - HIGHEST PRIORITY ON HOMEPAGE */}
            <NoticeBoard notices={notices} isHomepage={true} setView={setView} />

            {/* Feature Cards Grid (Main Features) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 no-print">
              <div className="text-center mb-10">
                <h3 className="text-2xl sm:text-3xl font-black text-blue-950 font-sans">
                  আদর্শ শিক্ষালয়ের মূল সেবা ও সুযোগসমূহ
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  কোমলমতি শিশুদের আনন্দময় শিক্ষার জন্য দ্রুত অ্যাক্সেস কার্ডসমূহ
                </p>
                <div className="w-16 h-1 bg-amber-500 mx-auto mt-3 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Feature 1: Admission */}
                <div 
                  onClick={() => setView('admission')}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer text-center space-y-4 group"
                >
                  <div className="mx-auto w-14 h-14 bg-blue-100 text-blue-900 rounded-2xl flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300">
                    <GraduationCap size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-blue-950">ভর্তির আবেদন</h4>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      সহজ ও ঝঞ্ঝাটমুক্ত অনলাইন ভর্তি ফর্ম পূরণ এবং রসিদ সংগ্রহ করুন।
                    </p>
                  </div>
                  <span className="inline-block text-xs font-bold text-blue-900 group-hover:underline">ফরম পূরণ করুন →</span>
                </div>

                {/* Feature 2: Class Routine */}
                <div 
                  onClick={() => setView('routines')}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer text-center space-y-4 group"
                >
                  <div className="mx-auto w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-blue-950 transition-colors duration-300">
                    <Clock size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-blue-950">ক্লাস রুটিন</h4>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      সকল শ্রেণীর দৈনিক ক্লাস রুটিন দেখুন এবং প্রিন্ট কপি সংগ্রহ করুন।
                    </p>
                  </div>
                  <span className="inline-block text-xs font-bold text-blue-900 group-hover:underline">সময়সূচী দেখুন →</span>
                </div>

                {/* Feature 3: Exam Routine */}
                <div 
                  onClick={() => setView('routines')}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer text-center space-y-4 group"
                >
                  <div className="mx-auto w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                    <CalendarDays size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-blue-950">পরীক্ষার রুটিন</h4>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      অর্ধ-বার্ষিক ও বার্ষিক পরীক্ষার বিস্তারিত সময়সূচী ও কক্ষ নম্বর দেখুন।
                    </p>
                  </div>
                  <span className="inline-block text-xs font-bold text-blue-900 group-hover:underline">পরীক্ষা সূচী দেখুন →</span>
                </div>

                {/* Feature 4: School Info */}
                <div 
                  onClick={() => setView('school-info')}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer text-center space-y-4 group"
                >
                  <div className="mx-auto w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-colors duration-300">
                    <School size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-blue-950">স্কুল সম্পর্কিত তথ্য</h4>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      স্কুলের গৌরবময় ইতিহাস, লক্ষ্য ও মিশন, এবং উন্নত সুযোগ-সুবিধা জানুন।
                    </p>
                  </div>
                  <span className="inline-block text-xs font-bold text-blue-900 group-hover:underline">পরিচিতি দেখুন →</span>
                </div>

              </div>
            </section>

            {/* Quick Informational / Principal Welcome section */}
            <section className="bg-blue-900 text-white py-14 no-print relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-black font-sans text-amber-400">কোমলমতি শিশুদের মেধা বিকাশে আমরা অঙ্গীকারাবদ্ধ</h3>
                    <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                      ২০১১ সালে প্রতিষ্ঠার পর থেকেই আদর্শ শিশু কানন স্কুল কাশিম বাজার এবং সুন্দরগঞ্জ এলাকার কোমলমতি শিশুদের সঠিক নৈতিক শিক্ষা, শৃঙ্খলা ও উন্নত মানবিক গুণাবলী সম্পন্ন ভবিষ্যৎ নাগরিক হিসেবে গড়ে তুলছে। আমাদের দক্ষ শিক্ষক মণ্ডলীর পরম যত্ন ও আধুনিক ক্লাসরুম পাঠদান শিশুদের পড়ার ভয় দূর করে শিক্ষাকে আনন্দদায়ক করে তোলে।
                    </p>
                    <button 
                      onClick={() => setView('school-info')}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold text-sm rounded-lg cursor-pointer transition-all"
                    >
                      আমাদের সুযোগ-সুবিধাসমূহ জানুন
                    </button>
                  </div>

                  {/* Director / Asst. Director Brief Details */}
                  <div className="bg-blue-950/50 p-6 rounded-2xl border border-blue-800/60 text-center space-y-3">
                    <h4 className="text-base font-black text-amber-400">জরুরী নোটিশ ও সহায়তার জন্য</h4>
                    <p className="text-xs text-blue-200">যেকোন প্রাতিষ্ঠানিক অভিযোগ বা পরামর্শ সরাসরি সহঃ পরিচালক বরাবর প্রদান করতে পারেন।</p>
                    <div className="text-xs text-slate-300">
                      <p className="font-bold text-white text-sm">মোঃ আনোয়ার হোসাইন</p>
                      <p>সহঃ পরিচালক, আদর্শ শিশু কানন স্কুল</p>
                    </div>
                    <a 
                      href={`tel:${schoolInfo.contactPhone}`}
                      className="inline-flex items-center space-x-1 px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      <PhoneCall size={12} />
                      <span>কল করুন: ০১৯২৪-৫৩৫৫৮৯</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* High Priority WhatsApp complaints section (conforming precisely to prompt) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 no-print">
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
                <div className="space-y-2 text-center md:text-left">
                  <h4 className="text-xl sm:text-3xl font-black font-sans leading-tight">
                    যেকোন অভিযোগ ও বিস্তারিত তথ্যের জন্য যোগাযোগ করুন
                  </h4>
                  <p className="text-green-100 text-xs sm:text-sm">
                    আমাদের সম্মানিত পরিচালক অথবা সহঃ পরিচালক মহোদয়ের হোয়াটসঅ্যাপ নাম্বারে সরাসরি বার্তা পাঠান।
                  </p>
                </div>
                
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-green-700 font-extrabold text-sm sm:text-base rounded-full shadow-lg flex items-center space-x-2 shrink-0 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <MessageSquare size={18} fill="#10b981" />
                  <span>সরাসরি হোয়াটসঅ্যাপ করুন ({schoolInfo.whatsappNumber})</span>
                </a>
              </div>
            </section>

          </div>
        )}

        {/* Notice Board View */}
        {currentView === 'notice-board' && (
          <NoticeBoard notices={notices} isHomepage={false} />
        )}

        {/* Admission Application View */}
        {currentView === 'admission' && (
          <AdmissionForm onSubmit={handleAdmissionSubmit} classes={CLASSES} />
        )}

        {/* Routines View */}
        {currentView === 'routines' && (
          <Routines 
            classRoutines={classRoutines} 
            examRoutines={examRoutines} 
            classes={CLASSES} 
          />
        )}

        {/* School Info View */}
        {currentView === 'school-info' && (
          <AboutSchool info={schoolInfo} classes={CLASSES} />
        )}

        {/* Contact View */}
        {currentView === 'contact' && (
          <AboutSchool info={schoolInfo} classes={CLASSES} />
        )}

        {/* Admin Dashboard View */}
        {currentView === 'admin' && (
          <AdminPanel
            notices={notices} setNotices={setNotices}
            classRoutines={classRoutines} setClassRoutines={setClassRoutines}
            examRoutines={examRoutines} setExamRoutines={setExamRoutines}
            applications={applications} setApplications={setApplications}
            banners={banners} setBanners={setBanners}
            schoolInfo={schoolInfo} setSchoolInfo={setSchoolInfo}
            classes={CLASSES}
            isLoggedIn={isAdminLoggedIn}
            setIsLoggedIn={setIsAdminLoggedIn}
          />
        )}
      </main>

      {/* Footer */}
      <Footer info={schoolInfo} />

    </div>
  );
}
