-- 4. SQL EN SUPABASE (proyecto zksnydnjumdesdftajns):
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  progress integer DEFAULT 0,
  UNIQUE(user_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own enrollments" ON enrollments
  FOR ALL USING (auth.uid() = user_id);
