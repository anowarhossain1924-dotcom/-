-- ============================================================
-- Supabase Migration Schema for School Website
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
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_notices_pinned ON public.notices (is_pinned, published);
CREATE INDEX IF NOT EXISTS idx_class_routines_class ON public.class_routines (class_name, day);
CREATE INDEX IF NOT EXISTS idx_exam_routines_class ON public.exam_routines (class_name, date);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON public.admissions (status);
CREATE INDEX IF NOT EXISTS idx_hero_order ON public.hero (sort_order);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY & POLICIES
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

-- Create open access policies for public reading and admin updating
DO $$ 
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('settings', 'about', 'hero', 'notices', 'teachers', 'gallery', 'events', 'admissions', 'results', 'class_routines', 'exam_routines', 'committee', 'principal', 'contact', 'videos')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public Select" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Public Select" ON public.%I FOR SELECT USING (true)', tbl);
        
        EXECUTE format('DROP POLICY IF EXISTS "Public Insert" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Public Insert" ON public.%I FOR INSERT WITH CHECK (true)', tbl);

        EXECUTE format('DROP POLICY IF EXISTS "Public Update" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Public Update" ON public.%I FOR UPDATE USING (true)', tbl);

        EXECUTE format('DROP POLICY IF EXISTS "Public Delete" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Public Delete" ON public.%I FOR DELETE USING (true)', tbl);
    END LOOP;
END $$;

-- ============================================================
-- STORAGE BUCKET CREATION (FOR IMAGE UPLOADS)
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
