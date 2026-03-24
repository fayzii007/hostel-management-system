-- 1. Add new columns to students table
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS sleep_time TEXT,
ADD COLUMN IF NOT EXISTS cleanliness TEXT,
ADD COLUMN IF NOT EXISTS study_preference TEXT,
ADD COLUMN IF NOT EXISTS noise_tolerance TEXT,
ADD COLUMN IF NOT EXISTS room_assigned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS roommate_id UUID REFERENCES public.students(id);

-- 2. Update the auth trigger to map these new fields from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.students (
    auth_user_id, full_name, email, student_id, username, phone, course,
    sleep_time, cleanliness, study_preference, noise_tolerance
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'), 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'student_id', 'ST-' || floor(random() * 90000 + 10000)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', 'N/A'),
    COALESCE(NEW.raw_user_meta_data->>'course', 'N/A'),
    NEW.raw_user_meta_data->>'sleep_time',
    NEW.raw_user_meta_data->>'cleanliness',
    NEW.raw_user_meta_data->>'study_preference',
    NEW.raw_user_meta_data->>'noise_tolerance'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
