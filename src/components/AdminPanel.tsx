import React, { useState } from 'react';
import { 
  Notice, 
  RoutineItem, 
  ExamRoutineItem, 
  AdmissionApplication, 
  BannerSlide, 
  SchoolInfo 
} from '../types';
import { 
  Lock, 
  LogOut, 
  Bell, 
  Users, 
  FileSpreadsheet, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Pin, 
  Check, 
  AlertCircle, 
  Image,
  Eye,
  Info,
  Download,
  Save,
  CheckCircle,
  X
} from 'lucide-react';
import Logo from './Logo';
import { 
  saveNoticeToSupabase, 
  deleteNoticeFromSupabase, 
  saveClassRoutineToSupabase, 
  deleteClassRoutineFromSupabase, 
  saveExamRoutineToSupabase, 
  deleteExamRoutineFromSupabase, 
  saveApplicationToSupabase, 
  deleteApplicationFromSupabase, 
  saveBannerToSupabase, 
  deleteBannerFromSupabase, 
  saveSchoolInfoToSupabase,
  uploadImageToSupabaseStorage
} from '../lib/supabase';

interface AdminPanelProps {
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  classRoutines: RoutineItem[];
  setClassRoutines: React.Dispatch<React.SetStateAction<RoutineItem[]>>;
  examRoutines: ExamRoutineItem[];
  setExamRoutines: React.Dispatch<React.SetStateAction<ExamRoutineItem[]>>;
  applications: AdmissionApplication[];
  setApplications: React.Dispatch<React.SetStateAction<AdmissionApplication[]>>;
  banners: BannerSlide[];
  setBanners: React.Dispatch<React.SetStateAction<BannerSlide[]>>;
  schoolInfo: SchoolInfo;
  setSchoolInfo: React.Dispatch<React.SetStateAction<SchoolInfo>>;
  classes: string[];
  
  isLoggedIn: boolean;
  setIsLoggedIn: (login: boolean) => void;
}

export default function AdminPanel({
  notices, setNotices,
  classRoutines, setClassRoutines,
  examRoutines, setExamRoutines,
  applications, setApplications,
  banners, setBanners,
  schoolInfo, setSchoolInfo,
  classes,
  isLoggedIn, setIsLoggedIn
}: AdminPanelProps) {

  // Login credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tab management
  const [activeTab, setActiveTab] = useState<'notices' | 'applications' | 'routines' | 'banners' | 'settings'>('notices');

  // Form states
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    isPinned: false,
    image: '',
    published: true
  });

  // Routine manage form state
  const [classRoutineForm, setClassRoutineForm] = useState({
    className: 'Play',
    subject: '',
    teacherName: '',
    time: '',
    room: '',
    day: 'Saturday'
  });

  const [examRoutineForm, setExamRoutineForm] = useState({
    className: 'Play',
    subject: '',
    date: '',
    day: 'শনিবার',
    time: '',
    room: ''
  });

  // Detailed Application Viewer
  const [viewingApp, setViewingApp] = useState<AdmissionApplication | null>(null);

  // New Banner form state
  const [newBannerForm, setNewBannerForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: ''
  });

  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Mustakimbillah1757' && password === '191491') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('ভুল ইউজারনেম অথবা পাসওয়ার্ড! আবার চেষ্টা করুন।');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleExportSVG = () => {
    const svgContent = `<?xml version="1.0" encoding="utf-8"?>
<svg width="800" height="880" viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="topTextPath" d="M 50,200 A 150,150 0 1,1 350,200" fill="none" />
    <path id="bottomTextPath" d="M 50,200 A 150,150 0 0,0 350,200" fill="none" />
    <path id="ribbonTextPath" d="M 100,380 Q 200,366 300,380" fill="none" />
  </defs>
  <circle cx="200" cy="200" r="180" fill="#fffbeb" stroke="#1e3a8a" stroke-width="4" />
  <circle cx="200" cy="200" r="125" fill="#ffffff" stroke="#1e3a8a" stroke-width="3" />
  <text fill="#dc2626" font-size="26" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" letter-spacing="0.5">
    <textPath href="#topTextPath" startOffset="50%" text-anchor="middle">আদর্শ শিশু কানন স্কুল</textPath>
  </text>
  <text fill="#0f172a" font-size="19" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" letter-spacing="0.2">
    <textPath href="#bottomTextPath" startOffset="50%" text-anchor="middle">কাশিম বাজার, সুন্দরগঞ্জ, গাইবান্ধা</textPath>
  </text>
  <g transform="translate(42, 200)">
    <polygon points="0,-10 3,-3 10,-3 5,1 7,8 0,4 -7,8 -5,1 -10,-3 -3,-3" fill="#dc2626" stroke="#1e3a8a" stroke-width="1" />
  </g>
  <g transform="translate(358, 200)">
    <polygon points="0,-10 3,-3 10,-3 5,1 7,8 0,4 -7,8 -5,1 -10,-3 -3,-3" fill="#dc2626" stroke="#1e3a8a" stroke-width="1" />
  </g>
  <path d="M 200,250 Q 155,215 110,225 L 110,175 Q 155,165 200,200 Z" fill="#ffffff" stroke="#1d4ed8" stroke-width="3.5" stroke-linejoin="round" />
  <path d="M 200,250 Q 245,215 290,225 L 290,175 Q 245,165 200,200 Z" fill="#ffffff" stroke="#1d4ed8" stroke-width="3.5" stroke-linejoin="round" />
  <line x1="200" y1="200" x2="200" y2="250" stroke="#1d4ed8" stroke-width="2.5" />
  <text x="155" y="196" fill="#000000" font-size="24" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" text-anchor="middle">অ</text>
  <text x="155" y="230" fill="#7c3aed" font-size="24" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" text-anchor="middle">আ</text>
  <text x="245" y="196" fill="#dc2626" font-size="24" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" text-anchor="middle">১</text>
  <text x="245" y="230" fill="#2563eb" font-size="24" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" text-anchor="middle">২</text>
  <rect x="194" y="148" width="12" height="38" rx="2" fill="#2563eb" stroke="#1d4ed8" stroke-width="1" />
  <line x1="200" y1="148" x2="200" y2="140" stroke="#000000" stroke-width="2" />
  <path d="M 200,141 C 193,133 194,118 200,108 C 206,118 207,133 200,141 Z" fill="#ea580c" />
  <path d="M 200,139 C 196,134 196,125 200,118 C 204,125 204,134 200,139 Z" fill="#facc15" />
  <g stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round">
    <line x1="200" y1="98" x2="200" y2="88" />
    <line x1="184" y1="104" x2="175" y2="95" />
    <line x1="171" y1="117" x2="161" y2="110" />
    <line x1="166" y1="134" x2="155" y2="130" />
    <line x1="216" y1="104" x2="225" y2="95" />
    <line x1="229" y1="117" x2="239" y2="110" />
    <line x1="234" y1="134" x2="245" y2="130" />
  </g>
  <text x="155" y="156" fill="#16a34a" font-size="26" font-weight="bold" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">A</text>
  <text x="245" y="156" fill="#16a34a" font-size="26" font-weight="bold" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">B</text>
  <text x="200" y="285" fill="#0f172a" font-size="20" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" text-anchor="middle">স্থাপিত: ২০১১ইং</text>
  <path d="M 90,352 L 50,375 L 90,398 Z" fill="#15803d" stroke="#14532d" stroke-width="1.5" />
  <path d="M 90,352 L 105,354 L 105,395 L 90,398 Z" fill="#14532d" />
  <path d="M 310,352 L 350,375 L 310,398 Z" fill="#15803d" stroke="#14532d" stroke-width="1.5" />
  <path d="M 310,352 L 295,354 L 295,395 L 310,398 Z" fill="#14532d" />
  <path d="M 80,355 Q 200,340 320,355 L 310,405 Q 200,390 90,405 Z" fill="#16a34a" stroke="#15803d" stroke-width="2" stroke-linejoin="round" />
  <text fill="#ffffff" font-size="21" font-weight="extrabold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" letter-spacing="1">
    <textPath href="#ribbonTextPath" startOffset="50%" text-anchor="middle">জ্ঞানই শক্তি</textPath>
  </text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'adarsha_shishu_kanan_school_logo.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    const svgContent = `<svg width="2048" height="2253" viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="topTextPath" d="M 50,200 A 150,150 0 1,1 350,200" fill="none" />
    <path id="bottomTextPath" d="M 50,200 A 150,150 0 0,0 350,200" fill="none" />
    <path id="ribbonTextPath" d="M 100,380 Q 200,366 300,380" fill="none" />
  </defs>
  <circle cx="200" cy="200" r="180" fill="#fffbeb" stroke="#1e3a8a" stroke-width="4" />
  <circle cx="200" cy="200" r="125" fill="#ffffff" stroke="#1e3a8a" stroke-width="3" />
  <text fill="#dc2626" font-size="26" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" letter-spacing="0.5">
    <textPath href="#topTextPath" startOffset="50%" text-anchor="middle">আদর্শ শিশু কানন স্কুল</textPath>
  </text>
  <text fill="#0f172a" font-size="19" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" letter-spacing="0.2">
    <textPath href="#bottomTextPath" startOffset="50%" text-anchor="middle">কাশিম বাজার, সুন্দরগঞ্জ, গাইবান্ধা</textPath>
  </text>
  <g transform="translate(42, 200)">
    <polygon points="0,-10 3,-3 10,-3 5,1 7,8 0,4 -7,8 -5,1 -10,-3 -3,-3" fill="#dc2626" stroke="#1e3a8a" stroke-width="1" />
  </g>
  <g transform="translate(358, 200)">
    <polygon points="0,-10 3,-3 10,-3 5,1 7,8 0,4 -7,8 -5,1 -10,-3 -3,-3" fill="#dc2626" stroke="#1e3a8a" stroke-width="1" />
  </g>
  <path d="M 200,250 Q 155,215 110,225 L 110,175 Q 155,165 200,200 Z" fill="#ffffff" stroke="#1d4ed8" stroke-width="3.5" stroke-linejoin="round" />
  <path d="M 200,250 Q 245,215 290,225 L 290,175 Q 245,165 200,200 Z" fill="#ffffff" stroke="#1d4ed8" stroke-width="3.5" stroke-linejoin="round" />
  <line x1="200" y1="200" x2="200" y2="250" stroke="#1d4ed8" stroke-width="2.5" />
  <text x="155" y="196" fill="#000000" font-size="24" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" text-anchor="middle">অ</text>
  <text x="155" y="230" fill="#7c3aed" font-size="24" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" text-anchor="middle">আ</text>
  <text x="245" y="196" fill="#dc2626" font-size="24" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" text-anchor="middle">১</text>
  <text x="245" y="230" fill="#2563eb" font-size="24" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" text-anchor="middle">২</text>
  <rect x="194" y="148" width="12" height="38" rx="2" fill="#2563eb" stroke="#1d4ed8" stroke-width="1" />
  <line x1="200" y1="148" x2="200" y2="140" stroke="#000000" stroke-width="2" />
  <path d="M 200,141 C 193,133 194,118 200,108 C 206,118 207,133 200,141 Z" fill="#ea580c" />
  <path d="M 200,139 C 196,134 196,125 200,118 C 204,125 204,134 200,139 Z" fill="#facc15" />
  <g stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round">
    <line x1="200" y1="98" x2="200" y2="88" />
    <line x1="184" y1="104" x2="175" y2="95" />
    <line x1="171" y1="117" x2="161" y2="110" />
    <line x1="166" y1="134" x2="155" y2="130" />
    <line x1="216" y1="104" x2="225" y2="95" />
    <line x1="229" y1="117" x2="239" y2="110" />
    <line x1="234" y1="134" x2="245" y2="130" />
  </g>
  <text x="155" y="156" fill="#16a34a" font-size="26" font-weight="bold" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">A</text>
  <text x="245" y="156" fill="#16a34a" font-size="26" font-weight="bold" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">B</text>
  <text x="200" y="285" fill="#0f172a" font-size="20" font-weight="bold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" text-anchor="middle">স্থাপিত: ২০১১ইং</text>
  <path d="M 90,352 L 50,375 L 90,398 Z" fill="#15803d" stroke="#14532d" stroke-width="1.5" />
  <path d="M 90,352 L 105,354 L 105,395 L 90,398 Z" fill="#14532d" />
  <path d="M 310,352 L 350,375 L 310,398 Z" fill="#15803d" stroke="#14532d" stroke-width="1.5" />
  <path d="M 310,352 L 295,354 L 295,395 L 310,398 Z" fill="#14532d" />
  <path d="M 80,355 Q 200,340 320,355 L 310,405 Q 200,390 90,405 Z" fill="#16a34a" stroke="#15803d" stroke-width="2" stroke-linejoin="round" />
  <text fill="#ffffff" font-size="21" font-weight="extrabold" font-family="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', system-ui, sans-serif" letter-spacing="1">
    <textPath href="#ribbonTextPath" startOffset="50%" text-anchor="middle">জ্ঞানই শক্তি</textPath>
  </text>
</svg>`;

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2253;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      try {
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'adarsha_shishu_kanan_school_logo_highres.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('PNG conversion failed', err);
      }
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // ----- NOTICE ACTIONS -----
  const saveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNotice) {
      // Edit existing
      const updated: Notice = {
        ...editingNotice,
        title: noticeForm.title,
        content: noticeForm.content,
        isPinned: noticeForm.isPinned,
        image: noticeForm.image,
        published: noticeForm.published
      };
      setNotices(prev => prev.map(n => n.id === editingNotice.id ? updated : n));
      saveNoticeToSupabase(updated);
      setEditingNotice(null);
    } else {
      // Create new
      const newNotice: Notice = {
        id: 'notice-' + Date.now(),
        title: noticeForm.title,
        content: noticeForm.content,
        isPinned: noticeForm.isPinned,
        image: noticeForm.image,
        published: noticeForm.published,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setNotices(prev => [newNotice, ...prev]);
      saveNoticeToSupabase(newNotice);
    }
    // Reset form
    setNoticeForm({ title: '', content: '', isPinned: false, image: '', published: true });
  };

  const handleNoticeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImageToSupabaseStorage(file, 'notices');
      setNoticeForm(prev => ({ ...prev, image: url }));
    }
  };

  const deleteNotice = (id: string) => {
    if (confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?')) {
      setNotices(prev => prev.filter(n => n.id !== id));
      deleteNoticeFromSupabase(id);
    }
  };

  const togglePinNotice = (id: string) => {
    const noticeToToggle = notices.find(n => n.id === id);
    if (noticeToToggle) {
      const updated = { ...noticeToToggle, isPinned: !noticeToToggle.isPinned };
      setNotices(prev => prev.map(n => n.id === id ? updated : n));
      saveNoticeToSupabase(updated);
    }
  };

  // ----- ADMISSION ACTIONS -----
  const updateAppStatus = (id: string, status: 'approved' | 'rejected') => {
    const appToUpdate = applications.find(app => app.id === id);
    if (appToUpdate) {
      const updated = { ...appToUpdate, status };
      setApplications(prev => prev.map(app => app.id === id ? updated : app));
      saveApplicationToSupabase(updated);
      if (viewingApp && viewingApp.id === id) {
        setViewingApp(updated);
      }
    }
  };

  const deleteApplication = (id: string) => {
    if (confirm('আপনি কি এই আবেদনটি তালিকা থেকে মুছে ফেলতে চান?')) {
      setApplications(prev => prev.filter(app => app.id !== id));
      deleteApplicationFromSupabase(id);
      if (viewingApp?.id === id) setViewingApp(null);
    }
  };

  // ----- ROUTINE ACTIONS -----
  const addClassRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: RoutineItem = {
      id: 'cr-' + Date.now(),
      ...classRoutineForm
    };
    setClassRoutines(prev => [...prev, newItem]);
    saveClassRoutineToSupabase(newItem);
    setClassRoutineForm(prev => ({ ...prev, subject: '', teacherName: '', time: '', room: '' }));
  };

  const deleteClassRoutine = (id: string) => {
    setClassRoutines(prev => prev.filter(r => r.id !== id));
    deleteClassRoutineFromSupabase(id);
  };

  const addExamRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ExamRoutineItem = {
      id: 'er-' + Date.now(),
      ...examRoutineForm
    };
    setExamRoutines(prev => [...prev, newItem]);
    saveExamRoutineToSupabase(newItem);
    setExamRoutineForm(prev => ({ ...prev, subject: '', date: '', day: 'শনিবার', time: '', room: '' }));
  };

  const deleteExamRoutine = (id: string) => {
    setExamRoutines(prev => prev.filter(r => r.id !== id));
    deleteExamRoutineFromSupabase(id);
  };

  // ----- SETTINGS / GENERAL ACTIONS -----
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedInfo = { ...schoolInfo, [name]: value };
    setSchoolInfo(updatedInfo);
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);
    try {
      await saveSchoolInfoToSupabase(schoolInfo);
      setSaveSuccessMsg('সকল কাস্টমাইজেশন ও সেটিংস তথ্য সফলভাবে সেভ করা হয়েছে!');
      setTimeout(() => {
        setSaveSuccessMsg('');
      }, 4000);
    } catch (err) {
      console.error(err);
      setSaveSuccessMsg('সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleBannerChange = (id: string, field: 'title' | 'subtitle' | 'imageUrl', value: string) => {
    const bannerToUpdate = banners.find(b => b.id === id);
    if (bannerToUpdate) {
      const updated = { ...bannerToUpdate, [field]: value };
      const index = banners.findIndex(b => b.id === id);
      setBanners(prev => prev.map(b => b.id === id ? updated : b));
      saveBannerToSupabase(updated, index);
    }
  };

  const handleNewBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImageToSupabaseStorage(file, 'banners');
      setNewBannerForm(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const handleSlideImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImageToSupabaseStorage(file, 'banners');
      handleBannerChange(id, 'imageUrl', url);
    }
  };

  const handleLogoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImageToSupabaseStorage(file, 'logo');
      const updatedInfo = { ...schoolInfo, logoUrl: url };
      setSchoolInfo(updatedInfo);
      saveSchoolInfoToSupabase(updatedInfo);
    }
  };

  const resetToDefaultLogo = () => {
    const updatedInfo = { ...schoolInfo, logoUrl: '' };
    setSchoolInfo(updatedInfo);
    saveSchoolInfoToSupabase(updatedInfo);
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerForm.imageUrl) {
      alert('দয়া করে একটি ছবি আপলোড করুন অথবা ছবির ইউআরএল দিন।');
      return;
    }
    const newSlide: BannerSlide = {
      id: 'banner-' + Date.now(),
      title: newBannerForm.title || '',
      subtitle: newBannerForm.subtitle || '',
      imageUrl: newBannerForm.imageUrl
    };
    setBanners(prev => [...prev, newSlide]);
    saveBannerToSupabase(newSlide, banners.length);
    setNewBannerForm({ title: '', subtitle: '', imageUrl: '' });
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('আপনি কি এই স্লাইডার ব্যানারটি মুছে ফেলতে চান?')) {
      setBanners(prev => prev.filter(b => b.id !== id));
      deleteBannerFromSupabase(id);
    }
  };


  // Login View
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          
          <div className="bg-blue-900 p-6 text-center text-white">
            <Lock className="mx-auto mb-2 text-amber-400" size={32} />
            <h3 className="text-xl font-bold font-sans">অ্যাডমিন প্রবেশদ্বার (Admin Login)</h3>
            <p className="text-xs text-blue-200 mt-1">সুরক্ষিত ব্যবস্থাপনার জন্য লগইন সম্পন্ন করুন</p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center space-x-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ইউজারনেম (Username)</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ইউজারনেম লিখুন"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">পাসওয়ার্ড (Password)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg text-sm transition-colors cursor-pointer shadow-sm"
            >
              প্রবেশ করুন (Login)
            </button>

            <div className="pt-2 text-center text-xs text-gray-400 font-medium">
              সহায়তার জন্য মূল পরিচালনা পর্ষদের সাথে যোগাযোগ করুন।
            </div>
          </form>

        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Dashboard Top header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-blue-950 font-sans flex items-center space-x-2">
            <Settings className="text-blue-900" size={28} />
            <span>অ্যাডমিন ম্যানেজমেন্ট ড্যাশবোর্ড</span>
          </h3>
          <p className="text-gray-500 text-sm mt-1">আদর্শ শিশু কানন স্কুলের সকল তথ্য লাইভ পরিবর্তন করুন</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
        >
          <LogOut size={16} />
          <span>লগআউট (Logout)</span>
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl mb-8 gap-1">
        {[
          { id: 'notices', label: 'নোটিশ ব্যবস্থাপনা', icon: <Bell size={16} /> },
          { id: 'applications', label: 'ভর্তির আবেদনসমূহ', icon: <Users size={16} /> },
          { id: 'routines', label: 'রুটিন সময়সূচী', icon: <FileSpreadsheet size={16} /> },
          { id: 'banners', label: 'স্লাইডার ব্যানার', icon: <Image size={16} /> },
          { id: 'settings', label: 'সেটিংস ও ঠিকানা', icon: <Settings size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-900 hover:bg-slate-200/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* -------------------- TAB 1: NOTICES -------------------- */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create/Edit Notice Form */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 h-fit">
            <h4 className="text-lg font-bold text-blue-950 border-b border-slate-100 pb-2 mb-4 flex items-center space-x-1.5">
              <Plus size={18} className="text-blue-900" />
              <span>{editingNotice ? 'নোটিশ সংশোধন করুন' : 'নতুন নোটিশ তৈরি করুন'}</span>
            </h4>
            
            <form onSubmit={saveNotice} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">নোটিশের শিরোনাম <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="যেমন: অর্ধ-বার্ষিক পরীক্ষার ফলাফল"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">নোটিশের মূল বিবরণী <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="বিস্তারিত নোটিশের তথ্য এখানে লিখুন..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Pin notice */}
              <div className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  id="formIsPinned"
                  checked={noticeForm.isPinned}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, isPinned: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="formIsPinned" className="text-sm font-semibold text-gray-600 cursor-pointer select-none">টপ নোটিশ হিসেবে পিন করুন</label>
              </div>

              {/* Upload image */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">ছবি আপলোড করুন (ঐচ্ছিক)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNoticeImageUpload}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-950 hover:file:bg-blue-100 cursor-pointer"
                />
                
                {/* Image preview or explicit link */}
                <div className="mt-2">
                  <span className="text-xs text-gray-400 block mb-1">অথবা ইন্টারনেট ইমেজ লিংক দিন:</span>
                  <input
                    type="text"
                    value={noticeForm.image}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                {noticeForm.image && (
                  <div className="mt-3 relative w-full h-24 rounded-lg overflow-hidden border border-slate-200">
                    <img src={noticeForm.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => setNoticeForm(prev => ({ ...prev, image: '' }))}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg text-sm cursor-pointer"
                >
                  {editingNotice ? 'সংশোধন সংরক্ষণ করুন' : 'নোটিশ প্রকাশ করুন'}
                </button>
                {editingNotice && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNotice(null);
                      setNoticeForm({ title: '', content: '', isPinned: false, image: '', published: true });
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-lg text-sm cursor-pointer"
                  >
                    বাতিল
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Notice List */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-slate-100">
            <h4 className="text-lg font-bold text-blue-950 border-b border-slate-100 pb-2 mb-4">প্রকাশিত নোটিশ সমূহ</h4>
            
            <div className="space-y-4">
              {notices.map(n => (
                <div 
                  key={n.id} 
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                    n.isPinned ? 'bg-amber-50/20 border-amber-400' : 'bg-slate-50/50 border-slate-100'
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center space-x-2">
                      {n.isPinned && <Pin size={14} className="text-amber-500 rotate-45" />}
                      <span className="font-extrabold text-blue-950 text-sm sm:text-base leading-snug line-clamp-1">{n.title}</span>
                    </div>
                    <p className="text-xs text-gray-500">তারিখ: {n.date} | সময়: {n.time}</p>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{n.content}</p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex space-x-2 shrink-0">
                    <button
                      onClick={() => togglePinNotice(n.id)}
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${
                        n.isPinned ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                      }`}
                      title={n.isPinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin size={16} className={n.isPinned ? 'rotate-0' : 'rotate-45'} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingNotice(n);
                        setNoticeForm({
                          title: n.title,
                          content: n.content,
                          isPinned: n.isPinned,
                          image: n.image || '',
                          published: n.published
                        });
                      }}
                      className="p-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteNotice(n.id)}
                      className="p-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* -------------------- TAB 2: ADMISSION APPLICATIONS -------------------- */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
            <h4 className="text-lg font-bold text-blue-950 border-b border-slate-100 pb-2 mb-4">অনলাইন ভর্তির আবেদন তালিকা</h4>

            {applications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                কোন আবেদন জমা হয়নি।
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-sm text-gray-700 min-w-[700px]">
                  <thead className="bg-blue-900 text-white text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">আবেদনকারী (Student)</th>
                      <th className="px-4 py-3">শ্রেণী (Class)</th>
                      <th className="px-4 py-3">অভিভাবক ও মোবাইল (Guardian)</th>
                      <th className="px-4 py-3">সময় (Date)</th>
                      <th className="px-4 py-3">অবস্থা (Status)</th>
                      <th className="px-4 py-3">পদক্ষেপ (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-gray-900">
                          <div>
                            <p>{app.studentNameBn}</p>
                            <p className="text-xs text-gray-500 font-normal font-sans">{app.studentNameEn}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-blue-800">{app.classApplied}</td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold">{app.guardianName}</p>
                          <p className="text-xs text-gray-500">{app.phoneNumber}</p>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-500">{app.submittedAt}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-block px-2.5 py-1 rounded text-xs font-extrabold ${
                            app.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status === 'approved' ? 'অনুমোদিত' : app.status === 'rejected' ? 'বাতিলকৃত' : 'অপেক্ষমাণ'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 space-x-1 shrink-0">
                          <button
                            onClick={() => setViewingApp(app)}
                            className="p-1.5 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded cursor-pointer inline-flex items-center"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => updateAppStatus(app.id, 'approved')}
                            className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded cursor-pointer inline-flex items-center"
                            title="Approve"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => deleteApplication(app.id)}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded cursor-pointer inline-flex items-center"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail Application Viewer Modal */}
          {viewingApp && (
            <div className="fixed inset-0 bg-blue-950/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                <div className="p-5 bg-blue-900 text-white flex justify-between items-center">
                  <h4 className="text-lg font-black">আবেদনপত্রের পূর্ণাঙ্গ বিবরণী</h4>
                  <button onClick={() => setViewingApp(null)} className="text-white hover:text-amber-400 font-bold text-lg cursor-pointer">✕</button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 text-sm">
                  {/* Student Details */}
                  <div className="border-b border-gray-100 pb-4 space-y-3">
                    <h5 className="font-bold text-blue-950 border-l-4 border-amber-500 pl-2">শিক্ষার্থীর বিবরণ</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-gray-500">নাম (বাংলা):</span> <p className="font-bold text-gray-800">{viewingApp.studentNameBn}</p></div>
                      <div><span className="text-gray-500">নাম (English):</span> <p className="font-bold text-gray-800">{viewingApp.studentNameEn}</p></div>
                      <div><span className="text-gray-500">শ্রেণী:</span> <p className="font-bold text-blue-800">{viewingApp.classApplied}</p></div>
                      <div><span className="text-gray-500">জন্ম তারিখ:</span> <p className="font-bold text-gray-800">{viewingApp.dateOfBirth}</p></div>
                      <div><span className="text-gray-500">লিঙ্গ:</span> <p className="font-bold text-gray-800">{viewingApp.gender}</p></div>
                      <div><span className="text-gray-500">রক্তের গ্রুপ:</span> <p className="font-bold text-gray-800">{viewingApp.bloodGroup || 'নেই'}</p></div>
                    </div>
                  </div>

                  {/* Guardian Details */}
                  <div className="border-b border-gray-100 pb-4 space-y-3">
                    <h5 className="font-bold text-blue-950 border-l-4 border-amber-500 pl-2">অভিভাবকের বিবরণ</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-gray-500">নাম ও সম্পর্ক:</span> <p className="font-bold text-gray-800">{viewingApp.guardianName} ({viewingApp.guardianRelation})</p></div>
                      <div><span className="text-gray-500">জাতীয় পরিচয়পত্র (NID):</span> <p className="font-bold text-gray-800">{viewingApp.guardianNID}</p></div>
                      <div><span className="text-gray-500">মোবাইল নাম্বার:</span> <p className="font-bold text-gray-800">{viewingApp.phoneNumber}</p></div>
                      <div><span className="text-gray-500">ইমেইল:</span> <p className="font-bold text-gray-800">{viewingApp.email || 'নেই'}</p></div>
                      <div className="col-span-2"><span className="text-gray-500">বর্তমান ঠিকানা:</span> <p className="font-bold text-gray-800">{viewingApp.presentAddress}</p></div>
                      <div className="col-span-2"><span className="text-gray-500">স্থায়ী ঠিকানা:</span> <p className="font-bold text-gray-800">{viewingApp.permanentAddress}</p></div>
                    </div>
                  </div>

                  {/* Application Meta */}
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-gray-400">দাখিলের সময়:</span>
                      <p className="font-bold text-gray-600">{viewingApp.submittedAt}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">অবস্থা:</span>
                      <p className={`font-black ${
                        viewingApp.status === 'approved' ? 'text-green-700' : viewingApp.status === 'rejected' ? 'text-rose-700' : 'text-amber-700'
                      }`}>{viewingApp.status === 'approved' ? 'অনুমোদিত' : viewingApp.status === 'rejected' ? 'প্রত্যাখ্যাত' : 'অপেক্ষমাণ'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => updateAppStatus(viewingApp.id, 'approved')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-xs cursor-pointer"
                  >
                    আবেদন অনুমোদন করুন
                  </button>
                  <button
                    onClick={() => updateAppStatus(viewingApp.id, 'rejected')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs cursor-pointer"
                  >
                    আবেদন বাতিল করুন
                  </button>
                  <button
                    onClick={() => setViewingApp(null)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-gray-700 font-bold rounded-lg text-xs cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* -------------------- TAB 3: ROUTINES -------------------- */}
      {activeTab === 'routines' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Class Routine management */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 space-y-6">
            <h4 className="text-lg font-bold text-blue-950 border-b border-slate-100 pb-2 flex items-center space-x-1.5">
              <Plus size={18} className="text-blue-900" />
              <span>ক্লাস রুটিন যোগ করুন</span>
            </h4>

            <form onSubmit={addClassRoutine} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">শ্রেণী নির্বাচন</label>
                <select
                  value={classRoutineForm.className}
                  onChange={(e) => setClassRoutineForm(prev => ({ ...prev, className: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">বার (Day)</label>
                <select
                  value={classRoutineForm.day}
                  onChange={(e) => setClassRoutineForm(prev => ({ ...prev, day: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="Saturday">শনিবার (Saturday)</option>
                  <option value="Sunday">রবিবার (Sunday)</option>
                  <option value="Monday">সোমবার (Monday)</option>
                  <option value="Tuesday">মঙ্গলবার (Tuesday)</option>
                  <option value="Wednesday">বুধবার (Wednesday)</option>
                  <option value="Thursday">বৃহস্পতিবার (Thursday)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">বিষয় (Subject)</label>
                <input
                  type="text"
                  required
                  value={classRoutineForm.subject}
                  onChange={(e) => setClassRoutineForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="যেমন: সাধারণ বিজ্ঞান"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">শিক্ষক (Teacher)</label>
                <input
                  type="text"
                  required
                  value={classRoutineForm.teacherName}
                  onChange={(e) => setClassRoutineForm(prev => ({ ...prev, teacherName: e.target.value }))}
                  placeholder="যেমন: মোঃ মতিয়ার ভূঁইয়া"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">সময়সূচী (Time Slot)</label>
                <input
                  type="text"
                  required
                  value={classRoutineForm.time}
                  onChange={(e) => setClassRoutineForm(prev => ({ ...prev, time: e.target.value }))}
                  placeholder="যেমন: ০৯:০০ - ০৯:৪৫ AM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">কক্ষ নং (Room)</label>
                <input
                  type="text"
                  required
                  value={classRoutineForm.room}
                  onChange={(e) => setClassRoutineForm(prev => ({ ...prev, room: e.target.value }))}
                  placeholder="যেমন: ১০২"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>

              <button
                type="submit"
                className="sm:col-span-2 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg text-sm cursor-pointer mt-2"
              >
                রুটিনে যোগ করুন
              </button>
            </form>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <h5 className="text-xs font-bold text-gray-400">বর্তমান ক্লাস রুটিন আইটেমসমূহ:</h5>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {classRoutines.map(cr => (
                  <div key={cr.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-blue-950">{cr.className} - {cr.subject}</p>
                      <p className="text-gray-500">{cr.day} | {cr.time} | কক্ষ: {cr.room} | শিক্ষক: {cr.teacherName}</p>
                    </div>
                    <button onClick={() => deleteClassRoutine(cr.id)} className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Exam Routine management */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 space-y-6">
            <h4 className="text-lg font-bold text-blue-950 border-b border-slate-100 pb-2 flex items-center space-x-1.5">
              <Plus size={18} className="text-blue-900" />
              <span>পরীক্ষার রুটিন যোগ করুন</span>
            </h4>

            <form onSubmit={addExamRoutine} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">শ্রেণী নির্বাচন</label>
                <select
                  value={examRoutineForm.className}
                  onChange={(e) => setExamRoutineForm(prev => ({ ...prev, className: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">পরীক্ষার তারিখ</label>
                <input
                  type="date"
                  required
                  value={examRoutineForm.date}
                  onChange={(e) => setExamRoutineForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">বার (যেমন: বুধবার)</label>
                <input
                  type="text"
                  required
                  value={examRoutineForm.day}
                  onChange={(e) => setExamRoutineForm(prev => ({ ...prev, day: e.target.value }))}
                  placeholder="যেমন: বুধবার"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">বিষয় (Subject)</label>
                <input
                  type="text"
                  required
                  value={examRoutineForm.subject}
                  onChange={(e) => setExamRoutineForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="যেমন: প্রাথমিক গণিত"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">সময়সূচী (Time Slot)</label>
                <input
                  type="text"
                  required
                  value={examRoutineForm.time}
                  onChange={(e) => setExamRoutineForm(prev => ({ ...prev, time: e.target.value }))}
                  placeholder="যেমন: ১০:০০ - ০১:০০ PM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">পরীক্ষা কক্ষ</label>
                <input
                  type="text"
                  required
                  value={examRoutineForm.room}
                  onChange={(e) => setExamRoutineForm(prev => ({ ...prev, room: e.target.value }))}
                  placeholder="যেমন: ২০১"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>

              <button
                type="submit"
                className="sm:col-span-2 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg text-sm cursor-pointer mt-2"
              >
                রুটিনে যোগ করুন
              </button>
            </form>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <h5 className="text-xs font-bold text-gray-400">বর্তমান পরীক্ষার রুটিন আইটেমসমূহ:</h5>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {examRoutines.map(er => (
                  <div key={er.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-blue-950">{er.className} - {er.subject}</p>
                      <p className="text-gray-500">{er.date} ({er.day}) | {er.time} | কক্ষ: {er.room}</p>
                    </div>
                    <button onClick={() => deleteExamRoutine(er.id)} className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* -------------------- TAB 4: BANNERS -------------------- */}
      {activeTab === 'banners' && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 space-y-8">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h4 className="text-lg font-bold text-blue-950">হোমপেজ স্লাইডার ব্যানার ব্যবস্থাপনা</h4>
            <p className="text-xs text-slate-500 mt-1">এখানে আপনি স্লাইড ব্যানারে ইচ্ছামত নতুন ছবি, শিরোনাম ও বিবরণ যুক্ত করতে পারেন বা বিদ্যমান স্লাইডগুলো পরিবর্তন/মুছে ফেলতে পারেন।</p>
          </div>

          {/* Form to Add New Banner Slide */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h5 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Plus className="text-blue-600" size={18} />
              নতুন স্লাইড ব্যানার যুক্ত করুন
            </h5>
            
            <form onSubmit={handleAddBanner} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">ব্যানার শিরোনাম (Title)</label>
                  <input
                    type="text"
                    value={newBannerForm.title}
                    onChange={(e) => setNewBannerForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="যেমন: আদর্শ শিশু কানন স্কুল এ স্বাগতম"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">ব্যানার উপ-শিরোনাম / বিবরণ (Subtitle)</label>
                  <input
                    type="text"
                    value={newBannerForm.subtitle}
                    onChange={(e) => setNewBannerForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="যেমন: সুশিক্ষাই আমাদের একমাত্র লক্ষ্য ও উদ্দেশ্য।"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">ছবি আপলোড করুন (Upload Image)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewBannerImageUpload}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-950 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">অথবা ছবির লিংক দিন (Image URL)</label>
                  <input
                    type="text"
                    value={newBannerForm.imageUrl}
                    onChange={(e) => setNewBannerForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {newBannerForm.imageUrl && (
                <div className="space-y-1">
                  <span className="block text-xs font-bold text-gray-500">ছবি প্রিভিউ:</span>
                  <div className="relative h-40 w-full md:w-1/2 rounded-xl overflow-hidden border border-slate-200">
                    <img src={newBannerForm.imageUrl} alt="New Slide Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => setNewBannerForm(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full text-xs hover:bg-red-700 transition-colors shadow-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus size={14} />
                নতুন ব্যানার যুক্ত করুন
              </button>
            </form>
          </div>

          {/* List of Existing Banners */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold text-blue-950 border-b border-slate-100 pb-2">বর্তমান ব্যানার স্লাইডগুলোর তালিকা ({banners.length} টি)</h5>
            
            {banners.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                কোন ব্যানার স্লাইড নেই। দয়া করে উপরে একটি নতুন ব্যানার যুক্ত করুন।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((b, idx) => (
                  <div key={b.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between bg-slate-50/50 hover:shadow-md transition-shadow">
                    <div className="relative h-36 bg-slate-900">
                      <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-blue-900 text-white text-[10px] font-bold rounded shadow-sm">স্লাইড {idx + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteBanner(b.id)}
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs transition-colors shadow-sm cursor-pointer"
                        title="স্লাইডটি মুছে ফেলুন"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-3 bg-white border-t border-slate-100 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">ছবি পরিবর্তন করুন (আপলোড)</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSlideImageUpload(b.id, e)}
                            className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-blue-950 hover:file:bg-blue-100 cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">অথবা ইমেজ ইউআরএল (Image URL)</label>
                          <input
                            type="text"
                            value={b.imageUrl}
                            onChange={(e) => handleBannerChange(b.id, 'imageUrl', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">ব্যানার শিরোনাম</label>
                          <input
                            type="text"
                            value={b.title}
                            onChange={(e) => handleBannerChange(b.id, 'title', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">ব্যানার উপ-শিরোনাম</label>
                          <textarea
                            rows={2}
                            value={b.subtitle}
                            onChange={(e) => handleBannerChange(b.id, 'subtitle', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500 resize-none text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------- TAB 5: SCHOOL SETTINGS -------------------- */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 space-y-6">
          
          {/* Settings Header with Save Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-lg font-bold text-blue-950">স্কুল সাধারণ তথ্য ও যোগাযোগের সেটিংস</h4>
              <p className="text-xs text-gray-500 mt-0.5">আপনার প্রয়োজনমতো ওয়েবসাইট তথ্য ও লোগো পরিমার্জন করুন এবং সেভ বাটনে ক্লিক করুন।</p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveSettings()}
              disabled={isSavingSettings}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
            >
              <Save size={18} />
              <span>{isSavingSettings ? 'সংরক্ষণ করা হচ্ছে...' : 'কাস্টমাইজেশন সেভ করুন (Save Changes)'}</span>
            </button>
          </div>

          {/* Success Notification Banner */}
          {saveSuccessMsg && (
            <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-between font-bold text-xs sm:text-sm animate-fade-in border border-emerald-400">
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
              <button onClick={() => setSaveSuccessMsg('')} className="text-white hover:text-emerald-100 p-1 cursor-pointer">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Logo Section */}
          <div className="p-5 bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-6">
            <div className="p-2 bg-white rounded-full shadow-sm border border-slate-100 shrink-0">
              <Logo size={140} logoUrl={schoolInfo.logoUrl} />
            </div>
            <div className="space-y-3 text-center sm:text-left flex-1">
              <h5 className="font-bold text-slate-800 text-base">স্কুলের অফিসিয়াল লোগো (Official Vector Logo)</h5>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                এটি আদর্শ শিশু কানন স্কুলের মূল হাই-কোয়ালিটি ভেক্টর লোগো। ওয়েবসাইট, ভর্তি ফরম, নোটিশ বা প্রিন্ট মিডিয়ার জন্য সরাসরি এখান থেকে ডাউনলোড করতে পারেন।
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleExportSVG}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Download size={14} />
                  ডাউনলোড SVG (স্কেলেবল ভেক্টর)
                </button>
                <button
                  type="button"
                  onClick={handleExportPNG}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Download size={14} />
                  ডাউনলোড হাই-রেজুলেশন PNG (2048px)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Logo Management Section */}
            <div className="md:col-span-2 p-5 bg-blue-50/80 rounded-2xl border border-blue-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-blue-950">
                  <Image size={22} className="text-blue-700" />
                  <h5 className="font-extrabold text-base sm:text-lg">ওয়েবসাইট লোগো পরিবর্তন ও আপলোড (Website Logo Management)</h5>
                </div>
                {schoolInfo.logoUrl && (
                  <button
                    type="button"
                    onClick={resetToDefaultLogo}
                    className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    ডিফল্ট লোগোতে ফিরে যান
                  </button>
                )}
              </div>
              
              <p className="text-xs text-gray-600 leading-relaxed">
                অ্যাডমিন হিসেবে আপনি ডিভাইস থেকে যেকোনো কাস্টম লোগো আপলোড করতে পারেন। আপলোডকৃত লোগোটি Supabase Storage-এ সংরক্ষিত হবে এবং ওয়েবসাইটের হেডার ও ফুটারে সাথে সাথে রিয়েল-টাইমে আপডেট হয়ে স্থায়ী থাকবে।
              </p>

              <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl shrink-0">
                  <span className="text-[11px] font-bold text-gray-500 mb-2">বর্তমান ওয়েবসাইট লোগো প্রিভিউ</span>
                  <div className="bg-white p-2 rounded-full shadow-md ring-2 ring-amber-400">
                    <Logo size={70} logoUrl={schoolInfo.logoUrl} />
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">ডিভাইস থেকে লোগো আপলোড করুন (Upload Image File)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoImageUpload}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer"
                    />
                  </div>

                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-2 text-[10px] font-bold text-gray-400 uppercase">অথবা সরাসরি ইমেজের URL দিন</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">লোগো ইমেজের লিঙ্ক (Logo Image URL)</label>
                    <input
                      type="text"
                      name="logoUrl"
                      value={schoolInfo.logoUrl || ''}
                      onChange={handleSettingsChange}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white font-mono focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp configuration */}
            <div className="md:col-span-2 p-4 bg-emerald-50 rounded-xl border border-emerald-200/60 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Plus size={20} />
                <h5 className="font-bold text-sm sm:text-base">হোয়াটসঅ্যাপ চ্যাট নাম্বার সেটিংস (Configurable WhatsApp Number)</h5>
              </div>
              <p className="text-xs text-gray-500">
                এই নাম্বারটি পরিবর্তন করলে হোমপেজ ও কন্টাক্ট সেকশনের সবুজ হোয়াটসঅ্যাপ লিংকের টার্গেট স্বয়ংক্রিয়ভাবে আপডেট হবে। অবশ্যই দেশের কোডসহ নাম্বারটি দিন (যেমন: 88017XXXXXXXX)।
              </p>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">হোয়াটসঅ্যাপ নাম্বার</label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={schoolInfo.whatsappNumber}
                  onChange={handleSettingsChange}
                  placeholder="যেমন: 8801700000000"
                  className="max-w-md w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-mono focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* School About & History */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">স্কুল সম্পর্কে (সংক্ষিপ্ত বিবরণ)</label>
              <textarea
                name="about"
                rows={4}
                value={schoolInfo.about}
                onChange={handleSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">স্কুলের গৌরবময় ইতিহাস</label>
              <textarea
                name="history"
                rows={4}
                value={schoolInfo.history}
                onChange={handleSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>

            {/* Mission & Vision */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">স্কুলের লক্ষ্য ও মিশন (Mission)</label>
              <textarea
                name="mission"
                rows={3}
                value={schoolInfo.mission}
                onChange={handleSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">স্কুলের ভিশন (Vision)</label>
              <textarea
                name="vision"
                rows={3}
                value={schoolInfo.vision}
                onChange={handleSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">স্কুলের ঠিকানা (Address)</label>
              <input
                type="text"
                name="address"
                value={schoolInfo.address}
                onChange={handleSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>

            {/* Email / Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">অফিস মোবাইল ফোন</label>
              <input
                type="text"
                name="contactPhone"
                value={schoolInfo.contactPhone}
                onChange={handleSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">অফিস ইমেইল এড্রেস</label>
              <input
                type="text"
                name="contactEmail"
                value={schoolInfo.contactEmail}
                onChange={handleSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-mono"
              />
            </div>

          </div>

          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="p-4 bg-blue-50 text-blue-900 rounded-xl text-xs flex items-start space-x-2 flex-1 w-full">
              <Info size={16} className="shrink-0 mt-0.5 text-blue-600" />
              <p className="font-semibold">
                সকল তথ্য ও লোগো কাস্টমাইজেশন সম্পন্ন হলে "সব তথ্য সংরক্ষণ করুন" বাটনে ক্লিক করুন। নতুন তথ্য সাথে সাথে ডাটাবেজে আপডেট ও সংরক্ষিত হয়ে যাবে।
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveSettings()}
              disabled={isSavingSettings}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer shrink-0"
            >
              <Save size={20} />
              <span>{isSavingSettings ? 'সংরক্ষণ করা হচ্ছে...' : 'সব তথ্য সংরক্ষণ করুন (Save All Settings)'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
