-- =====================================================
-- Cricket Club Platform - DEVELOPMENT Schema
-- =====================================================
-- This version has RLS DISABLED for easy development
-- Use this for local development and testing
-- For production, use schema.sql with RLS enabled

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
ALTER DATABASE postgres SET timezone TO 'UTC';

-- =====================================================
-- TEAMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT,
  logo_url TEXT,
  club_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_club_id ON teams(club_id);

-- =====================================================
-- PLAYERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  batting_style TEXT CHECK (batting_style IN ('right-hand', 'left-hand')),
  bowling_style TEXT CHECK (bowling_style IN ('right-arm-fast', 'right-arm-medium', 'right-arm-spin', 'left-arm-fast', 'left-arm-medium', 'left-arm-spin', 'none')),
  role TEXT CHECK (role IN ('batsman', 'bowler', 'all-rounder', 'wicket-keeper')),
  jersey_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);

-- =====================================================
-- MATCHES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_number TEXT,
  team_a_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  team_b_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  venue TEXT,
  match_date DATE,
  match_type TEXT CHECK (match_type IN ('T20', 'ODI', 'TEST', 'T10', 'THE100')),
  overs_per_innings INTEGER,
  match_status TEXT CHECK (match_status IN ('upcoming', 'live', 'completed', 'abandoned')) DEFAULT 'upcoming',
  toss_winner_id UUID REFERENCES teams(id),
  toss_decision TEXT CHECK (toss_decision IN ('bat', 'bowl')),
  result_summary TEXT,
  winner_id UUID REFERENCES teams(id),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_team_a ON matches(team_a_id);
CREATE INDEX IF NOT EXISTS idx_matches_team_b ON matches(team_b_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(match_status);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);

-- =====================================================
-- INNINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS innings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  batting_team_id UUID REFERENCES teams(id),
  bowling_team_id UUID REFERENCES teams(id),
  innings_number INTEGER NOT NULL,
  total_runs INTEGER DEFAULT 0,
  total_wickets INTEGER DEFAULT 0,
  total_balls INTEGER DEFAULT 0,
  extras_wides INTEGER DEFAULT 0,
  extras_noballs INTEGER DEFAULT 0,
  extras_byes INTEGER DEFAULT 0,
  extras_legbyes INTEGER DEFAULT 0,
  extras_penalty INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  target_runs INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_innings_match_id ON innings(match_id);
CREATE INDEX IF NOT EXISTS idx_innings_batting_team ON innings(batting_team_id);

-- =====================================================
-- BATTING PERFORMANCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS batting_performances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  innings_id UUID REFERENCES innings(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  runs_scored INTEGER DEFAULT 0,
  balls_faced INTEGER DEFAULT 0,
  fours INTEGER DEFAULT 0,
  sixes INTEGER DEFAULT 0,
  is_out BOOLEAN DEFAULT false,
  dismissal_type TEXT CHECK (dismissal_type IN ('bowled', 'caught', 'lbw', 'run-out', 'stumped', 'hit-wicket', 'retired-hurt', 'not-out')),
  dismissing_bowler_id UUID REFERENCES players(id),
  dismissing_fielder_id UUID REFERENCES players(id),
  batting_position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_batting_innings ON batting_performances(innings_id);
CREATE INDEX IF NOT EXISTS idx_batting_player ON batting_performances(player_id);

-- =====================================================
-- BOWLING PERFORMANCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bowling_performances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  innings_id UUID REFERENCES innings(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  overs_bowled INTEGER DEFAULT 0,
  balls_bowled INTEGER DEFAULT 0,
  runs_conceded INTEGER DEFAULT 0,
  wickets_taken INTEGER DEFAULT 0,
  maidens INTEGER DEFAULT 0,
  wides INTEGER DEFAULT 0,
  noballs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bowling_innings ON bowling_performances(innings_id);
CREATE INDEX IF NOT EXISTS idx_bowling_player ON bowling_performances(player_id);

-- =====================================================
-- BALLS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS balls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  innings_id UUID REFERENCES innings(id) ON DELETE CASCADE,
  over_number INTEGER NOT NULL,
  ball_number INTEGER NOT NULL,
  batsman_id UUID REFERENCES players(id),
  bowler_id UUID REFERENCES players(id),
  runs_scored INTEGER DEFAULT 0,
  is_wicket BOOLEAN DEFAULT false,
  dismissal_type TEXT,
  dismissing_fielder_id UUID REFERENCES players(id),
  is_wide BOOLEAN DEFAULT false,
  is_noball BOOLEAN DEFAULT false,
  is_bye BOOLEAN DEFAULT false,
  is_legbye BOOLEAN DEFAULT false,
  extras INTEGER DEFAULT 0,
  shot_type TEXT,
  fielding_position TEXT,
  commentary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_balls_innings ON balls(innings_id);
CREATE INDEX IF NOT EXISTS idx_balls_over ON balls(innings_id, over_number);

-- =====================================================
-- PARTNERSHIPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS partnerships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  innings_id UUID REFERENCES innings(id) ON DELETE CASCADE,
  batsman_1_id UUID REFERENCES players(id),
  batsman_2_id UUID REFERENCES players(id),
  runs INTEGER DEFAULT 0,
  balls INTEGER DEFAULT 0,
  wicket_number INTEGER,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partnerships_innings ON partnerships(innings_id);

-- =====================================================
-- LIVE MATCH STATE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS live_match_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE UNIQUE,
  current_innings_id UUID REFERENCES innings(id),
  striker_id UUID REFERENCES players(id),
  non_striker_id UUID REFERENCES players(id),
  current_bowler_id UUID REFERENCES players(id),
  current_over INTEGER DEFAULT 0,
  current_ball INTEGER DEFAULT 0,
  current_score INTEGER DEFAULT 0,
  current_wickets INTEGER DEFAULT 0,
  current_run_rate DECIMAL(5,2),
  required_run_rate DECIMAL(5,2),
  last_ball_event TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_innings_updated_at BEFORE UPDATE ON innings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_batting_updated_at BEFORE UPDATE ON batting_performances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bowling_updated_at BEFORE UPDATE ON bowling_performances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partnerships_updated_at BEFORE UPDATE ON partnerships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live_state_updated_at BEFORE UPDATE ON live_match_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ENABLE REALTIME FOR CRITICAL TABLES
-- =====================================================
-- Enable realtime for live scoring updates
ALTER PUBLICATION supabase_realtime ADD TABLE balls;
ALTER PUBLICATION supabase_realtime ADD TABLE innings;
ALTER PUBLICATION supabase_realtime ADD TABLE live_match_state;
ALTER PUBLICATION supabase_realtime ADD TABLE batting_performances;
ALTER PUBLICATION supabase_realtime ADD TABLE bowling_performances;

-- =====================================================
-- RLS DISABLED FOR DEVELOPMENT
-- =====================================================
-- Row Level Security is DISABLED on all tables
-- This allows full access without authentication
-- Perfect for development and testing

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
-- SETUP COMPLETE
-- =====================================================
-- Your database is ready for development!
-- No authentication required for any operations.
--
-- You can now:
--   ✅ Create teams
--   ✅ Add players
--   ✅ Create matches
--   ✅ Start scoring
--
-- For production deployment:
--   - Use schema.sql (with RLS enabled)
--   - Set up proper authentication
--   - Configure RLS policies
