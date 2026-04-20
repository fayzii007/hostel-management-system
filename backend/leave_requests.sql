-- 1. Create the `leave_requests` table
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason TEXT NOT NULL,
    destination TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow students to insert their own leaves ONLY
CREATE POLICY "Students can insert their own leaves" 
ON leave_requests FOR INSERT 
WITH CHECK (
    auth.uid()::text = (SELECT auth_user_id::text FROM students WHERE students.id::text = student_id::text)
);

-- 4. Policy: Allow students to view their own leaves ONLY
CREATE POLICY "Students can view their own leaves" 
ON leave_requests FOR SELECT 
USING (
    auth.uid()::text = (SELECT auth_user_id::text FROM students WHERE students.id::text = student_id::text)
);
