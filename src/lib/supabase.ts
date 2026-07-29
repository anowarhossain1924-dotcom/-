import { createClient } from '@supabase/supabase-js';
import { 
  Notice, 
  RoutineItem, 
  ExamRoutineItem, 
  AdmissionApplication, 
  BannerSlide, 
  SchoolInfo 
} from '../types';

// Read environment variables or fallback to provided user project credentials
const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jmbhyueozdsqhzjkeyuv.supabase.co';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_mWIiBFJJSvqEZv_Ui_vRNQ_PFz89A6T';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// IMAGE / ASSET UPLOAD HELPER (SUPABASE STORAGE)
// ============================================================
export async function uploadImageToSupabaseStorage(file: File, folder = 'uploads'): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('school-assets')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      // Fallback to base64 data URL if storage bucket fails or isn't created yet
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const { data } = supabase.storage
      .from('school-assets')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (err) {
    console.error('Failed to upload image to Supabase storage:', err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}

// ============================================================
// DATA MAPPERS (Snake Case DB <-> Camel Case TS)
// ============================================================
function mapNoticeFromDb(row: any): Notice {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    date: row.date,
    time: row.time,
    isPinned: row.is_pinned ?? false,
    image: row.image,
    published: row.published ?? true
  };
}

function mapNoticeToDb(item: Notice) {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    date: item.date,
    time: item.time,
    is_pinned: item.isPinned,
    image: item.image,
    published: item.published
  };
}

function mapClassRoutineFromDb(row: any): RoutineItem {
  return {
    id: row.id,
    className: row.class_name,
    subject: row.subject,
    teacherName: row.teacher_name,
    time: row.time,
    room: row.room,
    day: row.day
  };
}

function mapClassRoutineToDb(item: RoutineItem) {
  return {
    id: item.id,
    class_name: item.className,
    subject: item.subject,
    teacher_name: item.teacherName,
    time: item.time,
    room: item.room,
    day: item.day
  };
}

function mapExamRoutineFromDb(row: any): ExamRoutineItem {
  return {
    id: row.id,
    className: row.class_name,
    subject: row.subject,
    date: row.date,
    day: row.day,
    time: row.time,
    room: row.room
  };
}

function mapExamRoutineToDb(item: ExamRoutineItem) {
  return {
    id: item.id,
    class_name: item.className,
    subject: item.subject,
    date: item.date,
    day: item.day,
    time: item.time,
    room: item.room
  };
}

function mapApplicationFromDb(row: any): AdmissionApplication {
  return {
    id: row.id,
    studentNameBn: row.student_name_bn,
    studentNameEn: row.student_name_en,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    classApplied: row.class_applied,
    prevSchool: row.prev_school,
    bloodGroup: row.blood_group,
    guardianName: row.guardian_name,
    guardianRelation: row.guardian_relation,
    guardianNID: row.guardian_nid,
    guardianOccupation: row.guardian_occupation,
    phoneNumber: row.phone_number,
    email: row.email,
    presentAddress: row.present_address,
    permanentAddress: row.permanent_address,
    submittedAt: row.submitted_at,
    status: row.status as any
  };
}

function mapApplicationToDb(item: AdmissionApplication) {
  return {
    id: item.id,
    student_name_bn: item.studentNameBn,
    student_name_en: item.studentNameEn,
    date_of_birth: item.dateOfBirth,
    gender: item.gender,
    class_applied: item.classApplied,
    prev_school: item.prevSchool,
    blood_group: item.bloodGroup,
    guardian_name: item.guardianName,
    guardian_relation: item.guardianRelation,
    guardian_nid: item.guardianNID,
    guardian_occupation: item.guardianOccupation,
    phone_number: item.phoneNumber,
    email: item.email,
    present_address: item.presentAddress,
    permanent_address: item.permanentAddress,
    submitted_at: item.submittedAt,
    status: item.status
  };
}

function mapBannerFromDb(row: any): BannerSlide {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.image_url
  };
}

function mapBannerToDb(item: BannerSlide) {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    image_url: item.imageUrl
  };
}

// ============================================================
// REALTIME SUBSCRIPTIONS WITH AUTOMATIC SEEDING
// ============================================================

export function subscribeNotices(onUpdate: (data: Notice[]) => void, initialDefaults: Notice[]) {
  const fetchAndSync = async () => {
    try {
      const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        if (initialDefaults.length > 0) {
          const payload = initialDefaults.map(mapNoticeToDb);
          await supabase.from('notices').upsert(payload);
          onUpdate(initialDefaults);
        }
      } else {
        onUpdate(data.map(mapNoticeFromDb));
      }
    } catch (err) {
      console.error('Error fetching notices from Supabase:', err);
    }
  };

  fetchAndSync();

  const channel = supabase
    .channel('notices_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => {
      fetchAndSync();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeClassRoutines(onUpdate: (data: RoutineItem[]) => void, initialDefaults: RoutineItem[]) {
  const fetchAndSync = async () => {
    try {
      const { data, error } = await supabase.from('class_routines').select('*');
      if (error || !data || data.length === 0) {
        if (initialDefaults.length > 0) {
          const payload = initialDefaults.map(mapClassRoutineToDb);
          await supabase.from('class_routines').upsert(payload);
          onUpdate(initialDefaults);
        }
      } else {
        onUpdate(data.map(mapClassRoutineFromDb));
      }
    } catch (err) {
      console.error('Error fetching class_routines from Supabase:', err);
    }
  };

  fetchAndSync();

  const channel = supabase
    .channel('class_routines_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'class_routines' }, () => {
      fetchAndSync();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeExamRoutines(onUpdate: (data: ExamRoutineItem[]) => void, initialDefaults: ExamRoutineItem[]) {
  const fetchAndSync = async () => {
    try {
      const { data, error } = await supabase.from('exam_routines').select('*');
      if (error || !data || data.length === 0) {
        if (initialDefaults.length > 0) {
          const payload = initialDefaults.map(mapExamRoutineToDb);
          await supabase.from('exam_routines').upsert(payload);
          onUpdate(initialDefaults);
        }
      } else {
        onUpdate(data.map(mapExamRoutineFromDb));
      }
    } catch (err) {
      console.error('Error fetching exam_routines from Supabase:', err);
    }
  };

  fetchAndSync();

  const channel = supabase
    .channel('exam_routines_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'exam_routines' }, () => {
      fetchAndSync();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeApplications(onUpdate: (data: AdmissionApplication[]) => void, initialDefaults: AdmissionApplication[]) {
  const fetchAndSync = async () => {
    try {
      const { data, error } = await supabase.from('admissions').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        if (initialDefaults.length > 0) {
          const payload = initialDefaults.map(mapApplicationToDb);
          await supabase.from('admissions').upsert(payload);
          onUpdate(initialDefaults);
        }
      } else {
        onUpdate(data.map(mapApplicationFromDb));
      }
    } catch (err) {
      console.error('Error fetching admissions from Supabase:', err);
    }
  };

  fetchAndSync();

  const channel = supabase
    .channel('admissions_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'admissions' }, () => {
      fetchAndSync();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeBanners(onUpdate: (data: BannerSlide[]) => void, initialDefaults: BannerSlide[]) {
  const fetchAndSync = async () => {
    try {
      const { data, error } = await supabase.from('hero').select('*').order('sort_order', { ascending: true });
      if (error || !data || data.length === 0) {
        if (initialDefaults.length > 0) {
          const payload = initialDefaults.map((b, idx) => ({ ...mapBannerToDb(b), sort_order: idx }));
          await supabase.from('hero').upsert(payload);
          onUpdate(initialDefaults);
        }
      } else {
        onUpdate(data.map(mapBannerFromDb));
      }
    } catch (err) {
      console.error('Error fetching hero banners from Supabase:', err);
    }
  };

  fetchAndSync();

  const channel = supabase
    .channel('hero_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'hero' }, () => {
      fetchAndSync();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeSchoolInfo(onUpdate: (data: SchoolInfo) => void, initialDefault: SchoolInfo) {
  const fetchAndSync = async () => {
    try {
      const { data, error } = await supabase.from('about').select('*').eq('id', 'main').single();
      const { data: contactData } = await supabase.from('contact').select('*').eq('id', 'main').single();

      if (error || !data) {
        // Seed initial about & contact
        await supabase.from('about').upsert({
          id: 'main',
          about_text: initialDefault.about,
          history_text: initialDefault.history,
          mission_text: initialDefault.mission,
          vision_text: initialDefault.vision,
          facilities: initialDefault.facilities
        });
        await supabase.from('contact').upsert({
          id: 'main',
          address: initialDefault.address,
          phone: initialDefault.contactPhone,
          email: initialDefault.contactEmail,
          whatsapp: initialDefault.whatsappNumber
        });
        onUpdate(initialDefault);
      } else {
        onUpdate({
          about: data.about_text || initialDefault.about,
          history: data.history_text || initialDefault.history,
          mission: data.mission_text || initialDefault.mission,
          vision: data.vision_text || initialDefault.vision,
          facilities: data.facilities || initialDefault.facilities,
          contactPhone: contactData?.phone || initialDefault.contactPhone,
          contactEmail: contactData?.email || initialDefault.contactEmail,
          whatsappNumber: contactData?.whatsapp || initialDefault.whatsappNumber,
          address: contactData?.address || initialDefault.address
        });
      }
    } catch (err) {
      console.error('Error fetching school info from Supabase:', err);
    }
  };

  fetchAndSync();

  const channelAbout = supabase
    .channel('about_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'about' }, () => {
      fetchAndSync();
    })
    .subscribe();

  const channelContact = supabase
    .channel('contact_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'contact' }, () => {
      fetchAndSync();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channelAbout);
    supabase.removeChannel(channelContact);
  };
}

// ============================================================
// CRUD WRITERS (SUPABASE POSTGRES)
// ============================================================

export async function saveNoticeToSupabase(notice: Notice) {
  const { error } = await supabase.from('notices').upsert(mapNoticeToDb(notice));
  if (error) console.error('Supabase notice save error:', error.message);
}

export async function deleteNoticeFromSupabase(id: string) {
  const { error } = await supabase.from('notices').delete().eq('id', id);
  if (error) console.error('Supabase notice delete error:', error.message);
}

export async function saveClassRoutineToSupabase(item: RoutineItem) {
  const { error } = await supabase.from('class_routines').upsert(mapClassRoutineToDb(item));
  if (error) console.error('Supabase class routine save error:', error.message);
}

export async function deleteClassRoutineFromSupabase(id: string) {
  const { error } = await supabase.from('class_routines').delete().eq('id', id);
  if (error) console.error('Supabase class routine delete error:', error.message);
}

export async function saveExamRoutineToSupabase(item: ExamRoutineItem) {
  const { error } = await supabase.from('exam_routines').upsert(mapExamRoutineToDb(item));
  if (error) console.error('Supabase exam routine save error:', error.message);
}

export async function deleteExamRoutineFromSupabase(id: string) {
  const { error } = await supabase.from('exam_routines').delete().eq('id', id);
  if (error) console.error('Supabase exam routine delete error:', error.message);
}

export async function saveApplicationToSupabase(appItem: AdmissionApplication) {
  const { error } = await supabase.from('admissions').upsert(mapApplicationToDb(appItem));
  if (error) console.error('Supabase admission save error:', error.message);
}

export async function deleteApplicationFromSupabase(id: string) {
  const { error } = await supabase.from('admissions').delete().eq('id', id);
  if (error) console.error('Supabase admission delete error:', error.message);
}

export async function saveBannerToSupabase(banner: BannerSlide, index = 0) {
  const dbData = {
    ...mapBannerToDb(banner),
    sort_order: index
  };
  const { error } = await supabase.from('hero').upsert(dbData);
  if (error) console.error('Supabase banner save error:', error.message);
}

export async function deleteBannerFromSupabase(id: string) {
  const { error } = await supabase.from('hero').delete().eq('id', id);
  if (error) console.error('Supabase banner delete error:', error.message);
}

export async function saveSchoolInfoToSupabase(info: SchoolInfo) {
  const { error: aboutErr } = await supabase.from('about').upsert({
    id: 'main',
    about_text: info.about,
    history_text: info.history,
    mission_text: info.mission,
    vision_text: info.vision,
    facilities: info.facilities,
    updated_at: new Date().toISOString()
  });

  const { error: contactErr } = await supabase.from('contact').upsert({
    id: 'main',
    address: info.address,
    phone: info.contactPhone,
    email: info.contactEmail,
    whatsapp: info.whatsappNumber,
    updated_at: new Date().toISOString()
  });

  const { error: settingsErr } = await supabase.from('settings').upsert({
    id: 'main',
    site_title: 'আদর্শ শিশু কানন স্কুল',
    contact_phone: info.contactPhone,
    contact_email: info.contactEmail,
    whatsapp_number: info.whatsappNumber,
    address: info.address,
    updated_at: new Date().toISOString()
  });

  if (aboutErr || contactErr || settingsErr) {
    console.error('Supabase school info update error:', aboutErr?.message || contactErr?.message || settingsErr?.message);
  }
}
