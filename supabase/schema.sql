-- Cricket Club Platform Database Schema
-- This schema supports live scoring, match management, and analytics

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET timezone TO 'UTC';

-- =====================================================
-- TEAMS TABLE
-- =====================================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT,
  logo_url TEXT,
  club_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_teams_club_id ON teams(club_id);

-- =====================================================
-- PLAYERS TABLE
-- =====================================================
CREATE TABLE players (
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

CREATE INDEX idx_players_team_id ON players(team_id);

-- =====================================================
-- MATCHES TABLE
-- =====================================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_number TEXT,
  team_a_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  team_b_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  venue TEXT,
  match_date DATE,
  match_type TEXT CHECK (match_type IN ('T20', 'ODI', 'TEST', 'T10', 'THE100')),
  overs_per_innings INTEGER,
  balls_per_over INTEGER DEFAULT 6,
  toss_winner_id UUID REFERENCES teams(id),
  toss_decision TEXT CHECK (toss_decision IN ('bat', 'bowl')),
  match_status TEXT CHECK (match_status IN ('upcoming', 'live', 'completed', 'abandoned')) DEFAULT 'upcoming',
  result_summary TEXT,
  winner_id UUID REFERENCES teams(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_matches_status ON matches(match_status);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_created_by ON matches(created_by);

-- =====================================================
-- INNINGS TABLE
-- =====================================================
CREATE TABLE innings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  innings_number INTEGER NOT NULL CHECK (innings_number IN (1, 2, 3, 4)),
  batting_team_id UUID REFERENCES teams(id),
  bowling_team_id UUID REFERENCES teams(id),
  total_runs INTEGER DEFAULT 0,
  total_wickets INTEGER DEFAULT 0,
  total_overs DECIMAL(4,1) DEFAULT 0,
  total_balls INTEGER DEFAULT 0,
  extras_total INTEGER DEFAULT 0,
  extras_byes INTEGER DEFAULT 0,
  extras_leg_byes INTEGER DEFAULT 0,
  extras_wides INTEGER DEFAULT 0,
  extras_no_balls INTEGER DEFAULT 0,
  extras_penalties INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(match_id, innings_number)
);

CREATE INDEX idx_innings_match_id ON innings(match_id);

-- =====================================================
-- BATTING PERFORMANCES TABLE
-- =====================================================
CREATE TABLE batting_performances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  innings_id UUID REFERENCES innings(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  batting_position INTEGER,
  runs_scored INTEGER DEFAULT 0,
  balls_faced INTEGER DEFAULT 0,
  fours INTEGER DEFAULT 0,
  sixes INTEGER DEFAULT 0,
  is_out BOOLEAN DEFAULT FALSE,
  dismissal_type TEXT CHECK (dismissal_type IN ('bowled', 'caught', 'lbw', 'run-out', 'stumped', 'hit-wicket', 'retired-hurt', 'not-out')),
  bowler_id UUID REFERENCES players(id),
  fielder_id UUID REFERENCES players(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_batting_performances_innings_id ON batting_performances(innings_id);
CREATE INDEX idx_batting_performances_player_id ON batting_performances(player_id);

-- =====================================================
-- BOWLING PERFORMANCES TABLE
-- =====================================================
CREATE TABLE bowling_performances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  innings_id UUID REFERENCES innings(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  overs_bowled DECIMAL(4,1) DEFAULT 0,
  balls_bowled INTEGER DEFAULT 0,
  runs_conceded INTEGER DEFAULT 0,
  wickets_taken INTEGER DEFAULT 0,
  maidens INTEGER DEFAULT 0,
  wides INTEGER DEFAULT 0,
  no_balls INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bowling_performances_innings_id ON bowling_performances(innings_id);
CREATE INDEX idx_bowling_performances_player_id ON bowling_performances(player_id);

-- =====================================================
-- BALLS TABLE (Ball-by-Ball Scoring)
-- =====================================================
CREATE TABLE balls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  innings_id UUID REFERENCES innings(id) ON DELETE CASCADE,
  over_number INTEGER NOT NULL,
  ball_number INTEGER NOT NULL,
  batsman_id UUID REFERENCES players(id),
  non_striker_id UUID REFERENCES players(id),
  bowler_id UUID REFERENCES players(id),
  runs_scored INTEGER DEFAULT 0,
  is_four BOOLEAN DEFAULT FALSE,
  is_six BOOLEAN DEFAULT FALSE,
  extras_type TEXT CHECK (extras_type IN ('wide', 'no-ball', 'bye', 'leg-bye', 'penalty')),
  extras_runs INTEGER DEFAULT 0,
  is_wicket BOOLEAN DEFAULT FALSE,
  dismissal_type TEXT,
  dismissed_batsman_id UUID REFERENCES players(id),
  fielder_id UUID REFERENCES players(id),
  ball_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(innings_id, over_number, ball_number)
);

CREATE INDEX idx_balls_innings_id ON balls(innings_id);
CREATE INDEX idx_balls_over ON balls(innings_id, over_number);

-- =====================================================
-- PARTNERSHIPS TABLE
-- =====================================================
CREATE TABLE partnerships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  innings_id UUID REFERENCES innings(id) ON DELETE CASCADE,
  batsman1_id UUID REFERENCES players(id),
  batsman2_id UUID REFERENCES players(id),
  runs INTEGER DEFAULT 0,
  balls INTEGER DEFAULT 0,
  wicket_number INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_partnerships_innings_id ON partnerships(innings_id);

-- =====================================================
-- LIVE MATCH STATE TABLE (For Real-time Updates)
-- =====================================================
CREATE TABLE live_match_state (
  match_id UUID PRIMARY KEY REFERENCES matches(id) ON DELETE CASCADE,
  current_innings INTEGER DEFAULT 1,
  current_batsman1_id UUID REFERENCES players(id),
  current_batsman2_id UUID REFERENCES players(id),
  current_bowler_id UUID REFERENCES players(id),
  current_over INTEGER DEFAULT 0,
  current_ball INTEGER DEFAULT 0,
  current_score INTEGER DEFAULT 0,
  current_wickets INTEGER DEFAULT 0,
  target_score INTEGER,
  required_run_rate DECIMAL(5,2),
  last_ball_event TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE innings ENABLE ROW LEVEL SECURITY;
ALTER TABLE batting_performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE bowling_performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE balls ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_match_state ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (anyone can view)
CREATE POLICY "Public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON players FOR SELECT USING (true);
CREATE POLICY "Public read access" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read access" ON innings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON batting_performances FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bowling_performances FOR SELECT USING (true);
CREATE POLICY "Public read access" ON balls FOR SELECT USING (true);
CREATE POLICY "Public read access" ON partnerships FOR SELECT USING (true);
CREATE POLICY "Public read access" ON live_match_state FOR SELECT USING (true);

-- Authenticated users can insert/update/delete their own data
CREATE POLICY "Users can manage their teams" ON teams
  FOR ALL USING (auth.uid() = club_id);

CREATE POLICY "Users can manage their matches" ON matches
  FOR ALL USING (auth.uid() = created_by);

-- Allow authenticated users to manage match data
CREATE POLICY "Authenticated users can manage innings" ON innings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage batting" ON batting_performances
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage bowling" ON bowling_performances
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage balls" ON balls
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage partnerships" ON partnerships
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage live state" ON live_match_state
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Team owners can manage players" ON players
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = players.team_id
      AND teams.club_id = auth.uid()
    )
  );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
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

-- Function to update live match state
CREATE OR REPLACE FUNCTION update_live_match_state()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE live_match_state
  SET updated_at = NOW()
  WHERE match_id = NEW.match_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- REALTIME PUBLICATION (For Supabase Realtime)
-- =====================================================

-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE balls;
ALTER PUBLICATION supabase_realtime ADD TABLE live_match_state;
ALTER PUBLICATION supabase_realtime ADD TABLE innings;
