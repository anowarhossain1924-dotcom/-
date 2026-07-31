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

// ============================================================
// DUAL-LAYER PERSISTENCE HELPERS (LOCAL STORAGE + SUPABASE)
// ============================================================
function getLocalCache<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
}

function setLocalCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage quota or save error:', e);
  }
}

const STORAGE_KEYS = {
  NOTICES: 'adarsha_notices_v2',
  CLASS_ROUTINES: 'adarsha_class_routines_v2',
  EXAM_ROUTINES: 'adarsha_exam_routines_v2',
  APPLICATIONS: 'adarsha_admissions_v2',
  BANNERS: 'adarsha_banners_v2',
  SCHOOL_INFO: 'adarsha_school_info_v2'
};

// ============================================================
// REALTIME SUBSCRIBERS (SUPABASE + LOCAL STORAGE FALLBACK)
// ============================================================

export function subscribeNotices(onUpdate: (data: Notice[]) => void, initialDefaults: Notice[]) {
  // Load local cache immediately for instant render without delay
  const cached = getLocalCache<Notice[]>(STORAGE_KEYS.NOTICES);
  if (cached && cached.length > 0) {
    onUpdate(cached);
  } else {
    onUpdate(initialDefaults);
  }

  const fetchAndSync = async () => {
    try {
      const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(mapNoticeFromDb);
        setLocalCache(STORAGE_KEYS.NOTICES, mapped);
        onUpdate(mapped);
      } else if (error || !data || data.length === 0) {
        const currentCache = getLocalCache<Notice[]>(STORAGE_KEYS.NOTICES);
        if (currentCache && currentCache.length > 0) {
          onUpdate(currentCache);
        } else if (initialDefaults.length > 0) {
          const payload = initialDefaults.map(mapNoticeToDb);
          await supabase.from('notices').upsert(payload);
          setLocalCache(STORAGE_KEYS.NOTICES, initialDefaults);
          onUpdate(initialDefaults);
        }
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
  const cached = getLocalCache<RoutineItem[]>(STORAGE_KEYS.CLASS_ROUTINES);
  if (cached && cached.length > 0) {
    onUpdate(cached);
  } else {
    onUpdate(initialDefaults);
  }

  const fetchAndSync = async () => {
    try {
      const { data, error } = await supabase.from('class_routines').select('*');
      if (!error && data && data.length > 0) {
        const mapped = data.map(mapClassRoutineFromDb);
        setLocalCache(STORAGE_KEYS.CLASS_ROUTINES, mapped);
        onUpdate(mapped);
      } else if (error || !data || data.length === 0) {
        const currentCache = getLocalCache<RoutineItem[]>(STORAGE_KEYS.CLASS_ROUTINES);
        if (currentCache && currentCache.length > 0) {
          onUpdate(currentCache);
        } else if (initialDefaults.length > 0) {
          const payload = initialDefaults.map(mapClassRoutineToDb);
          await supabase.from('class_routines').upsert(payload);
          setLocalCache(STORAGE_KEYS.CLASS_ROUTINES, initialDefaults);
          onUpdate(initialDefaults);
        }
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
  const cached = getLocalCache<ExamRoutineItem[]>(STORAGE_KEYS.EXAM_ROUTINES);
  if (cached && cached.length > 0) {
    onUpdate(cached);
  } else {
    onUpdate(initialDefaults);
  }

  const fetchAndSync = async () => {
    try {
      const { data, error } = await supabase.from('exam_routines').select('*');
      if (!error && data && data.length > 0) {
        const mapped = data.map(mapExamRoutineFromDb);
        setLocalCache(STORAGE_KEYS.EXAM_ROUTINES, mapped);
        onUpdate(mapped);
      } else if (error || !data || data.length === 0) {
        const currentCache = getLocalCache<ExamRoutineItem[]>(STORAGE_KEYS.EXAM_ROUTINES);
        if (currentCache && currentCache.length > 0) {
          onUpdate(currentCache);
        } else if (initialDefaults.length > 0) {
          const payload = initialDefaults.map(mapExamRoutineToDb);
          await supabase.from('exam_routines').upsert(payload);
          setLocalCache(STORAGE_KEYS.EXAM_ROUTINES, initialDefaults);
          onUpdate(initialDefaults);
        }
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
  const cached = getLocalCache<AdmissionApplication[]>(STORAGE_KEYS.APPLICATIONS);
  if (cached && cached.length > 0) {
    onUpdate(cached);
  } else {
    onUpdate(initialDefaults);
  }

  const fetchAndSync = async () => {
    try {
      const { data, error } = await supabase.from('admissions').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(mapApplicationFromDb);
        setLocalCache(STORAGE_KEYS.APPLICATIONS, mapped);
        onUpdate(mapped);
      } else if (error || !data || data.length === 0) {
        const currentCache = getLocalCache<AdmissionApplication[]>(STORAGE_KEYS.APPLICATIONS);
        if (currentCache && currentCache.length > 0) {
          onUpdate(currentCache);
        } else if (initialDefaults.length > 0) {
          const payload = initialDefaults.map(mapApplicationToDb);
          await supabase.from('admissions').upsert(payload);
          setLocalCache(STORAGE_KEYS.APPLICATIONS, initialDefaults);
          onUpdate(initialDefaults);
        }
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

export function subscribeBanners(onUpdate: (data: BannerSlide[]) => void) {
  const cached = getLocalCache<BannerSlide[]>(STORAGE_KEYS.BANNERS);
  const cleanCache = cached ? cached.filter(b => b.id !== 'banner-1' && b.id !== 'banner-2' && b.id !== 'banner-3') : [];
  if (cleanCache.length > 0) {
    onUpdate(cleanCache);
  }

  const fetchAndSync = async () => {
    try {
      const { data, error } = await supabase.from('hero').select('*').order('sort_order', { ascending: true });
      if (!error && data) {
        const mapped = data.map(mapBannerFromDb);
        setLocalCache(STORAGE_KEYS.BANNERS, mapped);
        onUpdate(mapped);
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
  // Load local cache immediately so refresh preserves custom settings instantly
  const cached = getLocalCache<SchoolInfo>(STORAGE_KEYS.SCHOOL_INFO);
  if (cached) {
    onUpdate(cached);
  } else {
    onUpdate(initialDefault);
  }

  const fetchAndSync = async () => {
    try {
      const { data: aboutData } = await supabase.from('about').select('*').limit(1).maybeSingle();
      const { data: contactData } = await supabase.from('contact').select('*').limit(1).maybeSingle();
      
      // Select settings row dynamically without hardcoding id requirement
      const { data: settingsRows } = await supabase.from('settings').select('*').order('updated_at', { ascending: false }).limit(1);
      const settingsData = settingsRows && settingsRows.length > 0 ? settingsRows[0] : null;

      const currentCache = getLocalCache<SchoolInfo>(STORAGE_KEYS.SCHOOL_INFO);

      if (aboutData || contactData || settingsData) {
        const dbLogoUrl = settingsData ? (settingsData.logo_url ?? settingsData.logoUrl ?? null) : null;
        const updatedLogoUrl = dbLogoUrl !== null ? dbLogoUrl : (currentCache?.logoUrl || initialDefault.logoUrl || '');

        const updated: SchoolInfo = {
          about: aboutData?.about_text || currentCache?.about || initialDefault.about,
          history: aboutData?.history_text || currentCache?.history || initialDefault.history,
          mission: aboutData?.mission_text || currentCache?.mission || initialDefault.mission,
          vision: aboutData?.vision_text || currentCache?.vision || initialDefault.vision,
          facilities: aboutData?.facilities || currentCache?.facilities || initialDefault.facilities,
          contactPhone: contactData?.phone || currentCache?.contactPhone || initialDefault.contactPhone,
          contactEmail: contactData?.email || currentCache?.contactEmail || initialDefault.contactEmail,
          whatsappNumber: contactData?.whatsapp || currentCache?.whatsappNumber || initialDefault.whatsappNumber,
          address: contactData?.address || currentCache?.address || initialDefault.address,
          logoUrl: updatedLogoUrl
        };
        setLocalCache(STORAGE_KEYS.SCHOOL_INFO, updated);
        onUpdate(updated);
      }
    } catch (err) {
      console.error('Error fetching school info from Supabase:', err);
      const currentCache = getLocalCache<SchoolInfo>(STORAGE_KEYS.SCHOOL_INFO);
      if (currentCache) {
        onUpdate(currentCache);
      }
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

  const channelSettings = supabase
    .channel('settings_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
      fetchAndSync();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channelAbout);
    supabase.removeChannel(channelContact);
    supabase.removeChannel(channelSettings);
  };
}

// ============================================================
// CRUD WRITERS (SUPABASE POSTGRES + LOCAL STORAGE SYNC)
// ============================================================

export async function saveNoticeToSupabase(notice: Notice) {
  const current = getLocalCache<Notice[]>(STORAGE_KEYS.NOTICES) || [];
  const idx = current.findIndex(n => n.id === notice.id);
  const updated = idx >= 0 ? current.map(n => n.id === notice.id ? notice : n) : [notice, ...current];
  setLocalCache(STORAGE_KEYS.NOTICES, updated);

  const { error } = await supabase.from('notices').upsert(mapNoticeToDb(notice));
  if (error) console.error('Supabase notice save error:', error.message);
}

export async function deleteNoticeFromSupabase(id: string) {
  const current = getLocalCache<Notice[]>(STORAGE_KEYS.NOTICES) || [];
  const updated = current.filter(n => n.id !== id);
  setLocalCache(STORAGE_KEYS.NOTICES, updated);

  const { error } = await supabase.from('notices').delete().eq('id', id);
  if (error) console.error('Supabase notice delete error:', error.message);
}

export async function saveClassRoutineToSupabase(item: RoutineItem) {
  const current = getLocalCache<RoutineItem[]>(STORAGE_KEYS.CLASS_ROUTINES) || [];
  const idx = current.findIndex(r => r.id === item.id);
  const updated = idx >= 0 ? current.map(r => r.id === item.id ? item : r) : [...current, item];
  setLocalCache(STORAGE_KEYS.CLASS_ROUTINES, updated);

  const { error } = await supabase.from('class_routines').upsert(mapClassRoutineToDb(item));
  if (error) console.error('Supabase class routine save error:', error.message);
}

export async function deleteClassRoutineFromSupabase(id: string) {
  const current = getLocalCache<RoutineItem[]>(STORAGE_KEYS.CLASS_ROUTINES) || [];
  const updated = current.filter(r => r.id !== id);
  setLocalCache(STORAGE_KEYS.CLASS_ROUTINES, updated);

  const { error } = await supabase.from('class_routines').delete().eq('id', id);
  if (error) console.error('Supabase class routine delete error:', error.message);
}

export async function saveExamRoutineToSupabase(item: ExamRoutineItem) {
  const current = getLocalCache<ExamRoutineItem[]>(STORAGE_KEYS.EXAM_ROUTINES) || [];
  const idx = current.findIndex(r => r.id === item.id);
  const updated = idx >= 0 ? current.map(r => r.id === item.id ? item : r) : [...current, item];
  setLocalCache(STORAGE_KEYS.EXAM_ROUTINES, updated);

  const { error } = await supabase.from('exam_routines').upsert(mapExamRoutineToDb(item));
  if (error) console.error('Supabase exam routine save error:', error.message);
}

export async function deleteExamRoutineFromSupabase(id: string) {
  const current = getLocalCache<ExamRoutineItem[]>(STORAGE_KEYS.EXAM_ROUTINES) || [];
  const updated = current.filter(r => r.id !== id);
  setLocalCache(STORAGE_KEYS.EXAM_ROUTINES, updated);

  const { error } = await supabase.from('exam_routines').delete().eq('id', id);
  if (error) console.error('Supabase exam routine delete error:', error.message);
}

export async function saveApplicationToSupabase(appItem: AdmissionApplication) {
  const current = getLocalCache<AdmissionApplication[]>(STORAGE_KEYS.APPLICATIONS) || [];
  const updated = [appItem, ...current];
  setLocalCache(STORAGE_KEYS.APPLICATIONS, updated);

  const { error } = await supabase.from('admissions').upsert(mapApplicationToDb(appItem));
  if (error) console.error('Supabase admission save error:', error.message);
}

export async function deleteApplicationFromSupabase(id: string) {
  const current = getLocalCache<AdmissionApplication[]>(STORAGE_KEYS.APPLICATIONS) || [];
  const updated = current.filter(a => a.id !== id);
  setLocalCache(STORAGE_KEYS.APPLICATIONS, updated);

  const { error } = await supabase.from('admissions').delete().eq('id', id);
  if (error) console.error('Supabase admission delete error:', error.message);
}

export async function saveBannerToSupabase(banner: BannerSlide, index = 0) {
  const current = getLocalCache<BannerSlide[]>(STORAGE_KEYS.BANNERS) || [];
  const idx = current.findIndex(b => b.id === banner.id);
  const updated = idx >= 0 ? current.map(b => b.id === banner.id ? banner : b) : [...current, banner];
  setLocalCache(STORAGE_KEYS.BANNERS, updated);

  const dbData = {
    ...mapBannerToDb(banner),
    sort_order: index
  };
  const { error } = await supabase.from('hero').upsert(dbData);
  if (error) console.error('Supabase banner save error:', error.message);
}

export async function deleteBannerFromSupabase(id: string) {
  const current = getLocalCache<BannerSlide[]>(STORAGE_KEYS.BANNERS) || [];
  const updated = current.filter(b => b.id !== id);
  setLocalCache(STORAGE_KEYS.BANNERS, updated);

  const { error } = await supabase.from('hero').delete().eq('id', id);
  if (error) console.error('Supabase banner delete error:', error.message);
}

export async function saveSchoolInfoToSupabase(info: SchoolInfo) {
  // 1. Immediately update Local Storage cache for fast local persistence
  setLocalCache(STORAGE_KEYS.SCHOOL_INFO, info);

  // 2. Persist to Supabase database tables
  try {
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

    // Save settings table reliably (check existing row first)
    const logoVal = info.logoUrl || '';
    const { data: existingSettingsRows } = await supabase.from('settings').select('*').limit(1);
    const existingSetting = existingSettingsRows && existingSettingsRows.length > 0 ? existingSettingsRows[0] : null;

    if (existingSetting) {
      const { error: settingsUpdateErr } = await supabase.from('settings').update({
        site_title: 'আদর্শ শিশু কানন স্কুল',
        contact_phone: info.contactPhone,
        contact_email: info.contactEmail,
        whatsapp_number: info.whatsappNumber,
        address: info.address,
        logo_url: logoVal,
        updated_at: new Date().toISOString()
      }).eq('id', existingSetting.id);

      if (settingsUpdateErr) {
        console.warn('Supabase settings update error:', settingsUpdateErr.message);
      }
    } else {
      const { error: settingsUpsertErr } = await supabase.from('settings').upsert({
        id: 'main',
        site_title: 'আদর্শ শিশু কানন স্কুল',
        contact_phone: info.contactPhone,
        contact_email: info.contactEmail,
        whatsapp_number: info.whatsappNumber,
        address: info.address,
        logo_url: logoVal,
        updated_at: new Date().toISOString()
      });

      if (settingsUpsertErr) {
        await supabase.from('settings').insert({
          site_title: 'আদর্শ শিশু কানন স্কুল',
          contact_phone: info.contactPhone,
          contact_email: info.contactEmail,
          whatsapp_number: info.whatsappNumber,
          address: info.address,
          logo_url: logoVal,
          updated_at: new Date().toISOString()
        });
      }
    }

    if (aboutErr || contactErr) {
      console.warn('Supabase DB save note:', aboutErr?.message || contactErr?.message);
    }
  } catch (err) {
    console.error('Failed to sync school info to Supabase DB:', err);
  }
}

