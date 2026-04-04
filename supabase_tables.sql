-- Run this SQL in your Supabase dashboard → SQL Editor
-- Go to: https://supabase.com/dashboard/project/dbanyyxnheukwnmtyura/sql/new

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  repo_id TEXT NOT NULL,
  repo_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, repo_id)
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own bookmarks
CREATE POLICY "Users can read own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid()::text = user_id);

-- Allow users to insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Allow users to delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid()::text = user_id);


-- Create search_history table
CREATE TABLE IF NOT EXISTS search_history (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  query TEXT NOT NULL,
  repositories JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own history
CREATE POLICY "Users can read own search history"
  ON search_history FOR SELECT
  USING (auth.uid()::text = user_id);

-- Allow users to insert their own history
CREATE POLICY "Users can insert own search history"
  ON search_history FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Allow users to delete their own history
CREATE POLICY "Users can delete own search history"
  ON search_history FOR DELETE
  USING (auth.uid()::text = user_id);
