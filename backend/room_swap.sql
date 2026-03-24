-- 1. Update students table to track swap preference
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS wants_room_change BOOLEAN DEFAULT FALSE;

-- 2. Create room swap requests table
CREATE TABLE IF NOT EXISTS public.room_swap_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    target_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'admin_approved', 'admin_rejected')),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.room_swap_requests ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow students to see requests they are involved in
CREATE POLICY "Students can view their own swap requests" 
ON public.room_swap_requests FOR SELECT
USING (auth.uid() IN (
    SELECT auth_user_id FROM public.students WHERE id = requester_id OR id = target_id
));

-- Allow students to create requests
CREATE POLICY "Students can create swap requests" 
ON public.room_swap_requests FOR INSERT
WITH CHECK (auth.uid() IN (
    SELECT auth_user_id FROM public.students WHERE id = requester_id
));

-- Allow students to update status of incoming requests
CREATE POLICY "Students can update their received swap requests" 
ON public.room_swap_requests FOR UPDATE
USING (auth.uid() IN (
    SELECT auth_user_id FROM public.students WHERE id = target_id
));
