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
}

export interface ExamRoutineItem {
  id: string;
  className: string;
  subject: string;
  date: string;
  day: string;
  time: string;
  room: string;
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
}
