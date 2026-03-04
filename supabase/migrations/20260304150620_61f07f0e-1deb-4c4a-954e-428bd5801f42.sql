
-- Create sql_questions table
CREATE TABLE public.sql_questions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  query_a TEXT NOT NULL,
  query_b TEXT NOT NULL,
  answer TEXT NOT NULL CHECK (answer IN ('same', 'different')),
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sql_questions ENABLE ROW LEVEL SECURITY;

-- Everyone can read questions (public quiz)
CREATE POLICY "Questions are publicly readable"
  ON public.sql_questions FOR SELECT
  TO anon, authenticated
  USING (true);
