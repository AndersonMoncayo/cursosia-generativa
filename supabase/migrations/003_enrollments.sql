CREATE TABLE IF NOT EXISTS enrollments (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id    uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at  timestamptz DEFAULT now() NOT NULL,
  progress     integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_at timestamptz,
  deleted_at   timestamptz,
  UNIQUE(user_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_enrollments" ON enrollments
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_enrollments_user    ON enrollments(user_id);
CREATE INDEX idx_enrollments_course  ON enrollments(course_id);
CREATE INDEX idx_enrollments_created ON enrollments(enrolled_at DESC);
