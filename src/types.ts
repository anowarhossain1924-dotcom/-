export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  isPinned: boolean;
  image?: string; // Base64 or URL
  published: boolean;
}

export interface RoutineItem {
  id: string;
  className: string;
  subject: string;
  teacherName: string;
  time: string;
  room: string;
  day: string; // e.g. Saturday, Sunday, etc.
  attachmentUrl?: string; // Image, PDF, Doc, Sheet, or any format (Base64 or URL)
  attachmentName?: string; // Original filename (e.g. class5_routine.pdf)
  attachmentType?: string; // 'image' | 'pdf' | 'doc' | 'sheet' | 'other'
}

export interface ExamRoutineItem {
  id: string;
  className: string;
  subject: string;
  date: string;
  day: string;
  time: string;
  room: string;
  attachmentUrl?: string; // Image, PDF, Doc, Sheet, or any format (Base64 or URL)
  attachmentName?: string; // Original filename (e.g. final_exam_routine.pdf)
  attachmentType?: string; // 'image' | 'pdf' | 'doc' | 'sheet' | 'other'
}

export interface AdmissionApplication {
  id: string;
  studentNameBn: string;
  studentNameEn: string;
  dateOfBirth: string;
  gender: string;
  classApplied: string;
  prevSchool?: string;
  bloodGroup?: string;
  
  guardianName: string;
  guardianRelation: string;
  guardianNID: string;
  guardianOccupation: string;
  phoneNumber: string;
  email?: string;
  presentAddress: string;
  permanentAddress: string;
  
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface BannerSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

export interface SchoolInfo {
  about: string;
  history: string;
  mission: string;
  vision: string;
  facilities: string[];
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string; // Bengali text config
  address: string;
  logoUrl?: string;
}
