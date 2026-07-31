import { Notice, RoutineItem, ExamRoutineItem, AdmissionApplication, BannerSlide, SchoolInfo } from '../types';

export const DEFAULT_BANNERS: BannerSlide[] = [
  {
    id: 'banner-1',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200',
    title: 'আদর্শ শিশু কানন স্কুলে আপনাকে স্বাগতম',
    subtitle: 'জ্ঞানই শক্তি - সুশিক্ষা, শৃঙ্খলা ও উন্নত নৈতিক চরিত্রের প্রতিশ্রুতি।'
  },
  {
    id: 'banner-2',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200',
    title: 'ভর্তি চলছে! ২০২৬ শিক্ষাবর্ষে ভর্তি বিজ্ঞপ্তি',
    subtitle: 'প্লে-গ্রুপ থেকে ১০ম শ্রেণী পর্যন্ত সীমিত আসনে ভর্তি কার্যক্রম চলছে।'
  },
  {
    id: 'banner-3',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200',
    title: 'আমাদের আধুনিক ও শিশুবান্ধব শিক্ষাদান পদ্ধতি',
    subtitle: 'ডিজিটাল মাল্টিমিডিয়া ক্লাসরুম ও দক্ষ শিক্ষক মণ্ডলী দ্বারা পরিচালিত।'
  }
];

export const DEFAULT_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: '২০২৬ শিক্ষাবর্ষে প্লে থেকে ১০ম শ্রেণীতে ভর্তি চলছে',
    content: 'আদর্শ শিশু কানন স্কুলে ২০২৬ শিক্ষাবর্ষে প্লে-গ্রুপ থেকে ১০ম শ্রেণী পর্যন্ত ভর্তি ফরম বিতরণ করা হচ্ছে। আগ্রহী অভিভাবকদের অতিসত্বর স্কুল অফিস থেকে ভর্তি ফরম সংগ্রহ করে আবেদন করার জন্য অনুরোধ করা হলো। আসন সংখ্যা সীমিত। বিস্তারিত তথ্যের জন্য স্কুল অফিসে সরাসরি যোগাযোগ করুন বা ওয়েবসাইট থেকে সরাসরি ভর্তির আবেদন সম্পন্ন করুন।',
    date: '২০২৬-০৭-০৫',
    time: '১০:৩০ AM',
    isPinned: true,
    published: true,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'notice-2',
    title: 'অর্ধ-বার্ষিক পরীক্ষা ২০২৬ এর রুটিন প্রকাশ',
    content: 'সকল শিক্ষার্থী ও অভিভাবকদের জানানো যাচ্ছে যে, আগামী ১৫ই জুলাই ২০২৬ থেকে আমাদের অর্ধ-বার্ষিক পরীক্ষা শুরু হতে যাচ্ছে। পরীক্ষার বিস্তারিত সময়সূচী (রুটিন) নিচে প্রকাশ করা হলো। সকল শিক্ষার্থীকে সময়মতো পরীক্ষায় অংশগ্রহণ করতে এবং প্রবেশপত্র সংগ্রহ করতে নির্দেশ দেওয়া হলো।',
    date: '২০২৬-০৭-০১',
    time: '০২:১৫ PM',
    isPinned: true,
    published: true,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'notice-3',
    title: 'বর্ষা উৎসব ও বৃক্ষরোপণ কর্মসূচী ২০২৬',
    content: 'আগামী ১০ই জুলাই ২০২৬, শুক্রবার আদর্শ শিশু কানন স্কুল প্রাঙ্গণে বার্ষিক বর্ষা উৎসব ও বৃক্ষরোপণ কর্মসূচী অনুষ্ঠিত হবে। অনুষ্ঠানে প্রধান অতিথি হিসেবে উপস্থিত থাকবেন স্থানীয় শিক্ষানুরাগী ব্যক্তিত্ব ও সমাজসেবকবৃন্দ। উক্ত অনুষ্ঠানে সকল শিক্ষার্থীদের উপস্থিত থাকার জন্য অনুরোধ করা হচ্ছে।',
    date: '২০২৬-০৭-০৬',
    time: '০৯:০০ AM',
    isPinned: false,
    published: true,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600'
  }
];

export const DEFAULT_CLASS_ROUTINES: RoutineItem[] = [
  // Saturday
  { id: 'cr-1', className: 'Play', subject: 'বাংলা', teacherName: 'মোছাঃ সেলিনা বেগম', time: '০৯:০০ - ০৯:৪৫ AM', room: '১০১', day: 'Saturday' },
  { id: 'cr-2', className: 'Play', subject: 'ইংরেজি', teacherName: 'মোঃ আনোয়ার হোসাইন', time: '০৯:৪৫ - ১০:৩০ AM', room: '১০১', day: 'Saturday' },
  { id: 'cr-3', className: 'Play', subject: 'গণিত', teacherName: 'মোছাঃ ফাতেমা খাতুন', time: '১০:৩০ - ১১:১৫ AM', room: '১০১', day: 'Saturday' },
  
  { id: 'cr-4', className: 'Class 1', subject: 'গণিত', teacherName: 'মোঃ মতিয়ার ভূঁইয়া', time: '০৯:০০ - ০৯:৪৫ AM', room: '২০১', day: 'Saturday' },
  { id: 'cr-5', className: 'Class 1', subject: 'বাংলা', teacherName: 'মোছাঃ সেলিনা বেগম', time: '০৯:৪৫ - ১০:৩০ AM', room: '২০১', day: 'Saturday' },
  { id: 'cr-6', className: 'Class 1', subject: 'English', teacherName: 'মোঃ আনোয়ার হোসাইন', time: '১০:৩০ - ১১:১৫ AM', room: '২০১', day: 'Saturday' },

  // Sunday
  { id: 'cr-7', className: 'Play', subject: 'অঙ্কন ও ছড়া', teacherName: 'মোছাঃ ফাতেমা খাতুন', time: '০৯:০০ - ০৯:৪৫ AM', room: '১০১', day: 'Sunday' },
  { id: 'cr-8', className: 'Play', subject: 'সাধারণ জ্ঞান', teacherName: 'মোঃ আনোয়ার হোসাইন', time: '০৯:৪৫ - ১০:৩০ AM', room: '১০১', day: 'Sunday' },
  
  { id: 'cr-9', className: 'Class 1', subject: 'English', teacherName: 'মোঃ আনোয়ার হোসাইন', time: '০৯:০০ - ০৯:৪৫ AM', room: '২০১', day: 'Sunday' },
  { id: 'cr-10', className: 'Class 1', subject: 'পরিবেশ পরিচিতি', teacherName: 'মোছাঃ সেলিনা বেগম', time: '০৯:৪৫ - ১০:৩০ AM', room: '২০১', day: 'Sunday' },
  { id: 'cr-11', className: 'Class 1', subject: 'ধর্ম শিক্ষা', teacherName: 'মোঃ মতিয়ার ভূঁইয়া', time: '১০:৩০ - ১১:১৫ AM', room: '২০১', day: 'Sunday' }
];

export const DEFAULT_EXAM_ROUTINES: ExamRoutineItem[] = [
  { id: 'er-1', className: 'Play', subject: 'বাংলা (লিখিত ও মৌখিক)', date: '২০২৬-০৭-১৫', day: 'বুধবার', time: '১০:০০ - ১১:৩০ AM', room: '১০১' },
  { id: 'er-2', className: 'Play', subject: 'ইংরেজি', date: '২০২৬-০৭-১৬', day: 'বৃহস্পতিবার', time: '১০:০০ - ১১:৩০ AM', room: '১০১' },
  { id: 'er-3', className: 'Play', subject: 'গণিত', date: '২০২৬-০৭-১৮', day: 'শনিবার', time: '১০:০০ - ১১:৩০ AM', room: '১০১' },
  
  { id: 'er-4', className: 'Class 1', subject: 'বাংলা ১ম ও ২য় পত্র', date: '২০২৬-০৭-১৫', day: 'বুধবার', time: '১০:০০ - ০১:০০ PM', room: '২০১' },
  { id: 'er-5', className: 'Class 1', subject: 'English 1st & 2nd Paper', date: '২০২৬-০৭-১৬', day: 'বৃহস্পতিবার', time: '১০:০০ - ০১:০০ PM', room: '২০১' },
  { id: 'er-6', className: 'Class 1', subject: 'প্রাথমিক গণিত', date: '২০২৬-০৭-১৮', day: 'শনিবার', time: '১০:০০ - ০১:০০ PM', room: '২০১' },
  { id: 'er-7', className: 'Class 1', subject: 'সমাজ ও পরিবেশ পরিচিতি', date: '২০২৬-০৭-১৯', day: 'রবিবার', time: '১০:০০ - ০১:০০ PM', room: '২০১' }
];

export const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  about: 'আদর্শ শিশু কানন স্কুল গাইবান্ধা জেলার সুন্দরগঞ্জ উপজেলার কাশিম বাজার এলাকায় অবস্থিত একটি স্বনামধন্য ও শিশুবান্ধব শিক্ষাপ্রতিষ্ঠান। ২০১১ সালে প্রতিষ্ঠার পর থেকে আমরা অত্যন্ত যত্ন ও নিষ্ঠার সাথে কোমলমতি শিশুদের মাঝে শিক্ষার আলো ছড়িয়ে দিয়ে আসছি।',
  history: 'জ্ঞান ও প্রজ্ঞার বিস্তারে কাশিম বাজার এলাকার গুণীজনদের উদ্যোগে ২০১১ সালে আদর্শ শিশু কানন স্কুলটি প্রতিষ্ঠিত হয়। এলাকার কোমলমতি শিশুদের সঠিক নৈতিক শিক্ষা, নিয়মকানুন এবং আধুনিক ডিজিটাল যুগোপযোগী শিক্ষাদানের উদ্দেশ্যে স্কুলটির পথচলা শুরু হয়। পরিচালক মোঃ মতিয়ার ভূঁইয়া এবং সহঃ পরিচালক মোঃ আনোয়ার হোসাইনের নিরলস পরিশ্রম এবং এলাকাবাসীর আন্তরিক সহযোগিতায় আজ এটি উপজেলার অন্যতম প্রধান প্রাথমিক ও শিশু শিক্ষাপ্রতিষ্ঠানে রূপ নিয়েছে।',
  mission: 'আমাদের মূল লক্ষ্য হলো শিশুদের মধ্যে সুপ্ত মেধা ও সৃজনশীলতার বিকাশ ঘটানো, পড়াশোনাকে আনন্দদায়ক করা এবং ভবিষ্যৎ উন্নত মানবিক গুণাবলী সম্পন্ন আদর্শ নাগরিক গড়ে তোলা। আমরা গতানুগতিক মুখস্থ বিদ্যার পরিবর্তে ব্যবহারিক ও মনস্তাত্ত্বিক শিক্ষাদানে বিশ্বাসী।',
  vision: 'এমন একটি আধুনিক ও ডিজিটাল তথ্য-প্রযুক্তি সমৃদ্ধ সুশিক্ষিত জাতি গড়ে তোলা, যা নৈতিক শিক্ষা এবং মানবিক মূল্যবোধের ভিত্তিতে উন্নত বাংলাদেশ বিনির্মাণে অবদান রাখবে।',
  facilities: [
    'ডিজিটাল ক্লাসরুম ও মাল্টিমিডিয়া প্রজেক্টর দ্বারা আধুনিক পাঠদান ব্যবস্থা।',
    'দক্ষ, অভিজ্ঞ ও বিশেষভাবে প্রশিক্ষিত শিশুবান্ধব শিক্ষক-শিক্ষিকা মণ্ডলী।',
    'সম্পূর্ণ সুরক্ষিত ও সিসিটিভি (CCTV) ক্যামেরা নিয়ন্ত্রিত শিক্ষাঙ্গন।',
    'শিশুদের জন্য চিত্তবিনোদন ও আধুনিক খেলার সামগ্রী সমৃদ্ধ খেলার মাঠ।',
    'বিশুদ্ধ সুপেয় পানির ব্যবস্থা ও স্বাস্থ্যকর উন্নত ওয়াশ ব্লক।',
    'প্রতি মাসে শিক্ষার্থীদের মেডিকেল চেকআপ ও স্বাস্থ্য পর্যবেক্ষণ।',
    'বিশেষ ক্ষেত্রে অনগ্রসর ও মেধাবী শিক্ষার্থীদের হাফ-ফ্রি বা ফুল-ফ্রি বৃত্তির ব্যবস্থা।'
  ],
  contactPhone: '01924535589', // standard phone number
  contactEmail: 'contact@adarshashishukanan.edu.bd',
  whatsappNumber: '8801924535589', // Bengali default for contact, fully configurable
  address: 'কাশিম বাজার, সুন্দরগঞ্জ, গাইবান্ধা, বাংলাদেশ',
  logoUrl: ''
};

export const DEFAULT_APPLICATIONS: AdmissionApplication[] = [
  {
    id: 'app-1',
    studentNameBn: 'তাসনিম রহমান',
    studentNameEn: 'Tasnim Rahman',
    dateOfBirth: '২০২০-০৫-১২',
    gender: 'Female',
    classApplied: 'Play',
    prevSchool: 'নেই',
    bloodGroup: 'O+',
    guardianName: 'মোঃ আব্দুর রহমান',
    guardianRelation: 'Father',
    guardianNID: '১২৩৪৫৬৭৮৯০',
    guardianOccupation: 'ব্যবসায়ী',
    phoneNumber: '01711122233',
    email: 'rahman@gmail.com',
    presentAddress: 'কাশিম বাজার, সুন্দরগঞ্জ, গাইবান্ধা',
    permanentAddress: 'কাশিম বাজার, সুন্দরগঞ্জ, গাইবান্ধা',
    submittedAt: '২০২৬-০৭-০৭ ১০:১৫ AM',
    status: 'pending'
  },
  {
    id: 'app-2',
    studentNameBn: 'আলমগীর হোসাইন',
    studentNameEn: 'Alomgir Hossain',
    dateOfBirth: '২০১৮-০৯-১৫',
    gender: 'Male',
    classApplied: 'Class 1',
    prevSchool: 'ধুবনী সরকারি প্রাথমিক বিদ্যালয়',
    bloodGroup: 'A+',
    guardianName: 'মোছাঃ আমেনা খাতুন',
    guardianRelation: 'Mother',
    guardianNID: '৯৮৭৬৫৪৩২১০',
    guardianOccupation: 'গৃহিণী',
    phoneNumber: '01822334455',
    presentAddress: 'সুন্দরগঞ্জ পৌরসভা, গাইবান্ধা',
    permanentAddress: 'সুন্দরগঞ্জ, গাইবান্ধা',
    submittedAt: '২০২৬-০৭-০৬ ০২:৩০ PM',
    status: 'approved'
  }
];
