-- ============================================================
-- Supabase Migration Schema for School Website
-- Clean, complete, deterministic schema setup
-- ============================================================

-- ============================================================
-- STEP 1: CREATE ALL TABLES
-- ============================================================

-- 1. SETTINGS
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    site_title TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    whatsapp_number TEXT,
    address TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ABOUT
CREATE TABLE IF NOT EXISTS public.about (
    id TEXT PRIMARY KEY DEFAULT 'main',
    about_text TEXT,
    history_text TEXT,
    mission_text TEXT,
    vision_text TEXT,
    facilities JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HERO (Banners)
CREATE TABLE IF NOT EXISTS public.hero (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NOTICES
CREATE TABLE IF NOT EXISTS public.notices (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    image TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TEACHERS
CREATE TABLE IF NOT EXISTS public.teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    qualification TEXT,
    phone TEXT,
    email TEXT,
    photo_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_date TEXT NOT NULL,
    location TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ADMISSIONS
CREATE TABLE IF NOT EXISTS public.admissions (
    id TEXT PRIMARY KEY,
    student_name_bn TEXT NOT NULL,
    student_name_en TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    gender TEXT NOT NULL,
    class_applied TEXT NOT NULL,
    prev_school TEXT,
    blood_group TEXT,
    guardian_name TEXT NOT NULL,
    guardian_relation TEXT NOT NULL,
    guardian_nid TEXT NOT NULL,
    guardian_occupation TEXT,
    phone_number TEXT NOT NULL,
    email TEXT,
    present_address TEXT NOT NULL,
    permanent_address TEXT NOT NULL,
    submitted_at TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. RESULTS
CREATE TABLE IF NOT EXISTS public.results (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    student_name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    exam_name TEXT NOT NULL,
    year TEXT NOT NULL,
    gpa TEXT,
    marks_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CLASS_ROUTINES
CREATE TABLE IF NOT EXISTS public.class_routines (
    id TEXT PRIMARY KEY,
    class_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    time TEXT NOT NULL,
    room TEXT NOT NULL,
    day TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EXAM_ROUTINES
CREATE TABLE IF NOT EXISTS public.exam_routines (
    id TEXT PRIMARY KEY,
    class_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    date TEXT NOT NULL,
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    room TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. COMMITTEE
CREATE TABLE IF NOT EXISTS public.committee (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    phone TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PRINCIPAL
CREATE TABLE IF NOT EXISTS public.principal (
    id TEXT PRIMARY KEY DEFAULT 'main',
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    photo_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. CONTACT
CREATE TABLE IF NOT EXISTS public.contact (
    id TEXT PRIMARY KEY DEFAULT 'main',
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT,
    google_map_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. VIDEOS
CREATE TABLE IF NOT EXISTS public.videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STEP 2: CREATE ALL INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_notices_pinned ON public.notices (is_pinned, published);
CREATE INDEX IF NOT EXISTS idx_class_routines_class ON public.class_routines (class_name, day);
CREATE INDEX IF NOT EXISTS idx_exam_routines_class ON public.exam_routines (class_name, date);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON public.admissions (status);
CREATE INDEX IF NOT EXISTS idx_hero_order ON public.hero (sort_order);
CREATE INDEX IF NOT EXISTS idx_teachers_order ON public.teachers (sort_order);

-- ============================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.principal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 4: CREATE ALL POLICIES
-- ============================================================

-- settings
DROP POLICY IF EXISTS "settings_select" ON public.settings;
CREATE POLICY "settings_select" ON public.settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "settings_insert" ON public.settings;
CREATE POLICY "settings_insert" ON public.settings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "settings_update" ON public.settings;
CREATE POLICY "settings_update" ON public.settings FOR UPDATE USING (true);
DROP POLICY IF EXISTS "settings_delete" ON public.settings;
CREATE POLICY "settings_delete" ON public.settings FOR DELETE USING (true);

-- about
DROP POLICY IF EXISTS "about_select" ON public.about;
CREATE POLICY "about_select" ON public.about FOR SELECT USING (true);
DROP POLICY IF EXISTS "about_insert" ON public.about;
CREATE POLICY "about_insert" ON public.about FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "about_update" ON public.about;
CREATE POLICY "about_update" ON public.about FOR UPDATE USING (true);
DROP POLICY IF EXISTS "about_delete" ON public.about;
CREATE POLICY "about_delete" ON public.about FOR DELETE USING (true);

-- hero
DROP POLICY IF EXISTS "hero_select" ON public.hero;
CREATE POLICY "hero_select" ON public.hero FOR SELECT USING (true);
DROP POLICY IF EXISTS "hero_insert" ON public.hero;
CREATE POLICY "hero_insert" ON public.hero FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "hero_update" ON public.hero;
CREATE POLICY "hero_update" ON public.hero FOR UPDATE USING (true);
DROP POLICY IF EXISTS "hero_delete" ON public.hero;
CREATE POLICY "hero_delete" ON public.hero FOR DELETE USING (true);

-- notices
DROP POLICY IF EXISTS "notices_select" ON public.notices;
CREATE POLICY "notices_select" ON public.notices FOR SELECT USING (true);
DROP POLICY IF EXISTS "notices_insert" ON public.notices;
CREATE POLICY "notices_insert" ON public.notices FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "notices_update" ON public.notices;
CREATE POLICY "notices_update" ON public.notices FOR UPDATE USING (true);
DROP POLICY IF EXISTS "notices_delete" ON public.notices;
CREATE POLICY "notices_delete" ON public.notices FOR DELETE USING (true);

-- teachers
DROP POLICY IF EXISTS "teachers_select" ON public.teachers;
CREATE POLICY "teachers_select" ON public.teachers FOR SELECT USING (true);
DROP POLICY IF EXISTS "teachers_insert" ON public.teachers;
CREATE POLICY "teachers_insert" ON public.teachers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "teachers_update" ON public.teachers;
CREATE POLICY "teachers_update" ON public.teachers FOR UPDATE USING (true);
DROP POLICY IF EXISTS "teachers_delete" ON public.teachers;
CREATE POLICY "teachers_delete" ON public.teachers FOR DELETE USING (true);

-- gallery
DROP POLICY IF EXISTS "gallery_select" ON public.gallery;
CREATE POLICY "gallery_select" ON public.gallery FOR SELECT USING (true);
DROP POLICY IF EXISTS "gallery_insert" ON public.gallery;
CREATE POLICY "gallery_insert" ON public.gallery FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "gallery_update" ON public.gallery;
CREATE POLICY "gallery_update" ON public.gallery FOR UPDATE USING (true);
DROP POLICY IF EXISTS "gallery_delete" ON public.gallery;
CREATE POLICY "gallery_delete" ON public.gallery FOR DELETE USING (true);

-- events
DROP POLICY IF EXISTS "events_select" ON public.events;
CREATE POLICY "events_select" ON public.events FOR SELECT USING (true);
DROP POLICY IF EXISTS "events_insert" ON public.events;
CREATE POLICY "events_insert" ON public.events FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "events_update" ON public.events;
CREATE POLICY "events_update" ON public.events FOR UPDATE USING (true);
DROP POLICY IF EXISTS "events_delete" ON public.events;
CREATE POLICY "events_delete" ON public.events FOR DELETE USING (true);

-- admissions
DROP POLICY IF EXISTS "admissions_select" ON public.admissions;
CREATE POLICY "admissions_select" ON public.admissions FOR SELECT USING (true);
DROP POLICY IF EXISTS "admissions_insert" ON public.admissions;
CREATE POLICY "admissions_insert" ON public.admissions FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "admissions_update" ON public.admissions;
CREATE POLICY "admissions_update" ON public.admissions FOR UPDATE USING (true);
DROP POLICY IF EXISTS "admissions_delete" ON public.admissions;
CREATE POLICY "admissions_delete" ON public.admissions FOR DELETE USING (true);

-- results
DROP POLICY IF EXISTS "results_select" ON public.results;
CREATE POLICY "results_select" ON public.results FOR SELECT USING (true);
DROP POLICY IF EXISTS "results_insert" ON public.results;
CREATE POLICY "results_insert" ON public.results FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "results_update" ON public.results;
CREATE POLICY "results_update" ON public.results FOR UPDATE USING (true);
DROP POLICY IF EXISTS "results_delete" ON public.results;
CREATE POLICY "results_delete" ON public.results FOR DELETE USING (true);

-- class_routines
DROP POLICY IF EXISTS "class_routines_select" ON public.class_routines;
CREATE POLICY "class_routines_select" ON public.class_routines FOR SELECT USING (true);
DROP POLICY IF EXISTS "class_routines_insert" ON public.class_routines;
CREATE POLICY "class_routines_insert" ON public.class_routines FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "class_routines_update" ON public.class_routines;
CREATE POLICY "class_routines_update" ON public.class_routines FOR UPDATE USING (true);
DROP POLICY IF EXISTS "class_routines_delete" ON public.class_routines;
CREATE POLICY "class_routines_delete" ON public.class_routines FOR DELETE USING (true);

-- exam_routines
DROP POLICY IF EXISTS "exam_routines_select" ON public.exam_routines;
CREATE POLICY "exam_routines_select" ON public.exam_routines FOR SELECT USING (true);
DROP POLICY IF EXISTS "exam_routines_insert" ON public.exam_routines;
CREATE POLICY "exam_routines_insert" ON public.exam_routines FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "exam_routines_update" ON public.exam_routines;
CREATE POLICY "exam_routines_update" ON public.exam_routines FOR UPDATE USING (true);
DROP POLICY IF EXISTS "exam_routines_delete" ON public.exam_routines;
CREATE POLICY "exam_routines_delete" ON public.exam_routines FOR DELETE USING (true);

-- committee
DROP POLICY IF EXISTS "committee_select" ON public.committee;
CREATE POLICY "committee_select" ON public.committee FOR SELECT USING (true);
DROP POLICY IF EXISTS "committee_insert" ON public.committee;
CREATE POLICY "committee_insert" ON public.committee FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "committee_update" ON public.committee;
CREATE POLICY "committee_update" ON public.committee FOR UPDATE USING (true);
DROP POLICY IF EXISTS "committee_delete" ON public.committee;
CREATE POLICY "committee_delete" ON public.committee FOR DELETE USING (true);

-- principal
DROP POLICY IF EXISTS "principal_select" ON public.principal;
CREATE POLICY "principal_select" ON public.principal FOR SELECT USING (true);
DROP POLICY IF EXISTS "principal_insert" ON public.principal;
CREATE POLICY "principal_insert" ON public.principal FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "principal_update" ON public.principal;
CREATE POLICY "principal_update" ON public.principal FOR UPDATE USING (true);
DROP POLICY IF EXISTS "principal_delete" ON public.principal;
CREATE POLICY "principal_delete" ON public.principal FOR DELETE USING (true);

-- contact
DROP POLICY IF EXISTS "contact_select" ON public.contact;
CREATE POLICY "contact_select" ON public.contact FOR SELECT USING (true);
DROP POLICY IF EXISTS "contact_insert" ON public.contact;
CREATE POLICY "contact_insert" ON public.contact FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "contact_update" ON public.contact;
CREATE POLICY "contact_update" ON public.contact FOR UPDATE USING (true);
DROP POLICY IF EXISTS "contact_delete" ON public.contact;
CREATE POLICY "contact_delete" ON public.contact FOR DELETE USING (true);

-- videos
DROP POLICY IF EXISTS "videos_select" ON public.videos;
CREATE POLICY "videos_select" ON public.videos FOR SELECT USING (true);
DROP POLICY IF EXISTS "videos_insert" ON public.videos;
CREATE POLICY "videos_insert" ON public.videos FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "videos_update" ON public.videos;
CREATE POLICY "videos_update" ON public.videos FOR UPDATE USING (true);
DROP POLICY IF EXISTS "videos_delete" ON public.videos;
CREATE POLICY "videos_delete" ON public.videos FOR DELETE USING (true);

-- ============================================================
-- STEP 5: STORAGE BUCKET & STORAGE POLICIES
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('school-assets', 'school-assets', true) 
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
    CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (bucket_id = 'school-assets');

    DROP POLICY IF EXISTS "Public Storage Upload" ON storage.objects;
    CREATE POLICY "Public Storage Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'school-assets');

    DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
    CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (bucket_id = 'school-assets');
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;
