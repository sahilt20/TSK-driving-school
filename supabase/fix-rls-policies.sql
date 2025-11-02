-- =====================================================
-- FIX RLS POLICIES FOR DEVELOPMENT
-- =====================================================
-- This script allows public access for development/testing
-- Run this in Supabase SQL Editor if you're getting RLS errors

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can manage their teams" ON teams;
DROP POLICY IF EXISTS "Users can manage their matches" ON matches;
DROP POLICY IF EXISTS "Authenticated users can manage innings" ON innings;
DROP POLICY IF EXISTS "Authenticated users can manage batting" ON batting_performances;
DROP POLICY IF EXISTS "Authenticated users can manage bowling" ON bowling_performances;
DROP POLICY IF EXISTS "Authenticated users can manage balls" ON balls;
DROP POLICY IF EXISTS "Authenticated users can manage partnerships" ON partnerships;
DROP POLICY IF EXISTS "Authenticated users can manage live state" ON live_match_state;
DROP POLICY IF EXISTS "Users can manage players" ON players;

-- Create permissive policies for development
-- These allow anyone to INSERT, UPDATE, DELETE (useful for testing)

-- TEAMS: Allow all operations for everyone
CREATE POLICY "Public can manage teams" ON teams
  FOR ALL USING (true) WITH CHECK (true);

-- PLAYERS: Allow all operations for everyone
CREATE POLICY "Public can manage players" ON players
  FOR ALL USING (true) WITH CHECK (true);

-- MATCHES: Allow all operations for everyone
CREATE POLICY "Public can manage matches" ON matches
  FOR ALL USING (true) WITH CHECK (true);

-- INNINGS: Allow all operations for everyone
CREATE POLICY "Public can manage innings" ON innings
  FOR ALL USING (true) WITH CHECK (true);

-- BATTING PERFORMANCES: Allow all operations
CREATE POLICY "Public can manage batting" ON batting_performances
  FOR ALL USING (true) WITH CHECK (true);

-- BOWLING PERFORMANCES: Allow all operations
CREATE POLICY "Public can manage bowling" ON bowling_performances
  FOR ALL USING (true) WITH CHECK (true);

-- BALLS: Allow all operations
CREATE POLICY "Public can manage balls" ON balls
  FOR ALL USING (true) WITH CHECK (true);

-- PARTNERSHIPS: Allow all operations
CREATE POLICY "Public can manage partnerships" ON partnerships
  FOR ALL USING (true) WITH CHECK (true);

-- LIVE MATCH STATE: Allow all operations
CREATE POLICY "Public can manage live state" ON live_match_state
  FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- VERIFICATION
-- =====================================================
-- After running this, try creating a team again
-- It should work without authentication!

-- To check if policies are active:
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
