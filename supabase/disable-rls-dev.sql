-- =====================================================
-- DISABLE RLS FOR DEVELOPMENT (Quick Fix)
-- =====================================================
-- WARNING: This removes all security checks
-- Only use for development/testing, NOT in production!

-- Disable RLS on all tables
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE innings DISABLE ROW LEVEL SECURITY;
ALTER TABLE batting_performances DISABLE ROW LEVEL SECURITY;
ALTER TABLE bowling_performances DISABLE ROW LEVEL SECURITY;
ALTER TABLE balls DISABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships DISABLE ROW LEVEL SECURITY;
ALTER TABLE live_match_state DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- RESULT
-- =====================================================
-- All tables are now fully accessible without authentication
-- You can now:
--   ✅ Create teams
--   ✅ Add players
--   ✅ Create matches
--   ✅ Start scoring
--
-- No more "row-level security policy" errors!

-- To RE-ENABLE RLS later (for production):
-- Replace DISABLE with ENABLE in the commands above
