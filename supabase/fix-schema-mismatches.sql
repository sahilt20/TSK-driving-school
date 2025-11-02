-- =====================================================
-- FIX SCHEMA MISMATCHES
-- =====================================================
-- This script adds missing fields and fixes inconsistencies
-- between the database schema and the application code
-- Run this in Supabase SQL Editor to fix scoring errors
--
-- IMPORTANT: Run this if you're getting errors when scoring
-- =====================================================

-- Fix INNINGS table - Add missing fields
ALTER TABLE innings ADD COLUMN IF NOT EXISTS extras_total INTEGER DEFAULT 0;
ALTER TABLE innings ADD COLUMN IF NOT EXISTS total_overs DECIMAL(5,1) DEFAULT 0;

-- Fix field name inconsistencies in INNINGS
-- Note: extras_noballs -> extras_no_balls, extras_legbyes -> extras_leg_byes
-- We'll keep the original field names and update code references instead

-- Fix BALLS table - Add missing fields
ALTER TABLE balls ADD COLUMN IF NOT EXISTS non_striker_id UUID REFERENCES players(id);
ALTER TABLE balls ADD COLUMN IF NOT EXISTS is_four BOOLEAN DEFAULT false;
ALTER TABLE balls ADD COLUMN IF NOT EXISTS is_six BOOLEAN DEFAULT false;
ALTER TABLE balls ADD COLUMN IF NOT EXISTS extras_type TEXT;
ALTER TABLE balls ADD COLUMN IF NOT EXISTS extras_runs INTEGER DEFAULT 0;
ALTER TABLE balls ADD COLUMN IF NOT EXISTS dismissed_batsman_id UUID REFERENCES players(id);
ALTER TABLE balls ADD COLUMN IF NOT EXISTS fielder_id UUID REFERENCES players(id);

-- Add check constraint for extras_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'balls_extras_type_check'
  ) THEN
    ALTER TABLE balls ADD CONSTRAINT balls_extras_type_check
    CHECK (extras_type IN ('wide', 'no-ball', 'bye', 'leg-bye', 'penalty') OR extras_type IS NULL);
  END IF;
END $$;

-- Fix LIVE_MATCH_STATE table - Add missing fields
ALTER TABLE live_match_state ADD COLUMN IF NOT EXISTS current_innings INTEGER DEFAULT 1;
ALTER TABLE live_match_state ADD COLUMN IF NOT EXISTS current_batsman1_id UUID REFERENCES players(id);
ALTER TABLE live_match_state ADD COLUMN IF NOT EXISTS current_batsman2_id UUID REFERENCES players(id);

-- Rename existing striker/non_striker columns if they exist
DO $$
BEGIN
  -- Check if striker_id exists and current_batsman1_id doesn't
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='live_match_state' AND column_name='striker_id')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns
                     WHERE table_name='live_match_state' AND column_name='current_batsman1_id') THEN
    ALTER TABLE live_match_state RENAME COLUMN striker_id TO current_batsman1_id;
  END IF;

  -- Check if non_striker_id exists and current_batsman2_id doesn't
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='live_match_state' AND column_name='non_striker_id')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns
                     WHERE table_name='live_match_state' AND column_name='current_batsman2_id') THEN
    ALTER TABLE live_match_state RENAME COLUMN non_striker_id TO current_batsman2_id;
  END IF;

  -- Check if current_innings_id exists and we need to add current_innings
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='live_match_state' AND column_name='current_innings_id')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns
                     WHERE table_name='live_match_state' AND column_name='current_innings') THEN
    ALTER TABLE live_match_state ADD COLUMN current_innings INTEGER DEFAULT 1;
  END IF;
END $$;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_balls_non_striker ON balls(non_striker_id);
CREATE INDEX IF NOT EXISTS idx_balls_dismissed_batsman ON balls(dismissed_batsman_id);
CREATE INDEX IF NOT EXISTS idx_balls_is_four ON balls(innings_id, is_four) WHERE is_four = true;
CREATE INDEX IF NOT EXISTS idx_balls_is_six ON balls(innings_id, is_six) WHERE is_six = true;

-- =====================================================
-- UPDATE EXISTING DATA (if needed)
-- =====================================================

-- Update extras_total from existing extras fields
UPDATE innings
SET extras_total = COALESCE(extras_wides, 0) + COALESCE(extras_noballs, 0) +
                   COALESCE(extras_byes, 0) + COALESCE(extras_legbyes, 0) +
                   COALESCE(extras_penalty, 0)
WHERE extras_total = 0 OR extras_total IS NULL;

-- Update total_overs from total_balls
UPDATE innings
SET total_overs = ROUND(CAST(total_balls AS DECIMAL) / 6, 1)
WHERE total_overs = 0 OR total_overs IS NULL;

-- Migrate old boolean extras to extras_type
UPDATE balls
SET extras_type = CASE
  WHEN is_wide = true THEN 'wide'
  WHEN is_noball = true THEN 'no-ball'
  WHEN is_bye = true THEN 'bye'
  WHEN is_legbye = true THEN 'leg-bye'
  ELSE NULL
END,
extras_runs = COALESCE(extras, 0)
WHERE extras_type IS NULL
  AND (is_wide = true OR is_noball = true OR is_bye = true OR is_legbye = true);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the migration worked correctly

-- Check innings table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'innings'
  AND column_name IN ('extras_total', 'total_overs', 'extras_wides', 'extras_noballs', 'extras_byes', 'extras_legbyes')
ORDER BY column_name;

-- Check balls table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'balls'
  AND column_name IN ('non_striker_id', 'is_four', 'is_six', 'extras_type', 'extras_runs', 'dismissed_batsman_id', 'fielder_id')
ORDER BY column_name;

-- Check live_match_state table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'live_match_state'
  AND column_name IN ('current_innings', 'current_batsman1_id', 'current_batsman2_id', 'current_bowler_id')
ORDER BY column_name;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Your database schema now matches the application code!
-- You can now use the scoring interface without errors.
--
-- If you still see errors, check the browser console (F12)
-- and share the error message for further troubleshooting.
