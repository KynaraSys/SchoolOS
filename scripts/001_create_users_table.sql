-- Create users table with role-based access
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'principal', 'academic_director', 'bursar', 'teacher', 'parent', 'student', 'ict_admin')),
  school_id UUID NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  motto TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key
ALTER TABLE users ADD CONSTRAINT fk_school FOREIGN KEY (school_id) REFERENCES schools(id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for schools table
CREATE POLICY "Users can view their school" ON schools
  FOR SELECT USING (
    id IN (SELECT school_id FROM users WHERE id = auth.uid())
  );

-- Insert a demo school
INSERT INTO schools (id, name, code, motto)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Nairobi Excellence Academy', 'NEA', 'Excellence Through Knowledge')
ON CONFLICT (id) DO NOTHING;

-- Insert a demo admin user (you'll need to create this user in Supabase Auth first)
-- This is just an example structure
