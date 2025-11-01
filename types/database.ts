export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string
          name: string
          short_name: string | null
          logo_url: string | null
          club_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          short_name?: string | null
          logo_url?: string | null
          club_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_name?: string | null
          logo_url?: string | null
          club_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: string
          name: string
          team_id: string | null
          batting_style: 'right-hand' | 'left-hand' | null
          bowling_style: 'right-arm-fast' | 'right-arm-medium' | 'right-arm-spin' | 'left-arm-fast' | 'left-arm-medium' | 'left-arm-spin' | 'none' | null
          role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper' | null
          jersey_number: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          team_id?: string | null
          batting_style?: 'right-hand' | 'left-hand' | null
          bowling_style?: 'right-arm-fast' | 'right-arm-medium' | 'right-arm-spin' | 'left-arm-fast' | 'left-arm-medium' | 'left-arm-spin' | 'none' | null
          role?: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper' | null
          jersey_number?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          team_id?: string | null
          batting_style?: 'right-hand' | 'left-hand' | null
          bowling_style?: 'right-arm-fast' | 'right-arm-medium' | 'right-arm-spin' | 'left-arm-fast' | 'left-arm-medium' | 'left-arm-spin' | 'none' | null
          role?: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper' | null
          jersey_number?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          match_number: string | null
          team_a_id: string | null
          team_b_id: string | null
          venue: string | null
          match_date: string | null
          match_type: 'T20' | 'ODI' | 'TEST' | 'T10' | 'THE100' | null
          overs_per_innings: number | null
          balls_per_over: number
          toss_winner_id: string | null
          toss_decision: 'bat' | 'bowl' | null
          match_status: 'upcoming' | 'live' | 'completed' | 'abandoned'
          result_summary: string | null
          winner_id: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_number?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          venue?: string | null
          match_date?: string | null
          match_type?: 'T20' | 'ODI' | 'TEST' | 'T10' | 'THE100' | null
          overs_per_innings?: number | null
          balls_per_over?: number
          toss_winner_id?: string | null
          toss_decision?: 'bat' | 'bowl' | null
          match_status?: 'upcoming' | 'live' | 'completed' | 'abandoned'
          result_summary?: string | null
          winner_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_number?: string | null
          team_a_id?: string | null
          team_b_id?: string | null
          venue?: string | null
          match_date?: string | null
          match_type?: 'T20' | 'ODI' | 'TEST' | 'T10' | 'THE100' | null
          overs_per_innings?: number | null
          balls_per_over?: number
          toss_winner_id?: string | null
          toss_decision?: 'bat' | 'bowl' | null
          match_status?: 'upcoming' | 'live' | 'completed' | 'abandoned'
          result_summary?: string | null
          winner_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      innings: {
        Row: {
          id: string
          match_id: string | null
          innings_number: number
          batting_team_id: string | null
          bowling_team_id: string | null
          total_runs: number
          total_wickets: number
          total_overs: number
          total_balls: number
          extras_total: number
          extras_byes: number
          extras_leg_byes: number
          extras_wides: number
          extras_no_balls: number
          extras_penalties: number
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id?: string | null
          innings_number: number
          batting_team_id?: string | null
          bowling_team_id?: string | null
          total_runs?: number
          total_wickets?: number
          total_overs?: number
          total_balls?: number
          extras_total?: number
          extras_byes?: number
          extras_leg_byes?: number
          extras_wides?: number
          extras_no_balls?: number
          extras_penalties?: number
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string | null
          innings_number?: number
          batting_team_id?: string | null
          bowling_team_id?: string | null
          total_runs?: number
          total_wickets?: number
          total_overs?: number
          total_balls?: number
          extras_total?: number
          extras_byes?: number
          extras_leg_byes?: number
          extras_wides?: number
          extras_no_balls?: number
          extras_penalties?: number
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      balls: {
        Row: {
          id: string
          innings_id: string | null
          over_number: number
          ball_number: number
          batsman_id: string | null
          non_striker_id: string | null
          bowler_id: string | null
          runs_scored: number
          is_four: boolean
          is_six: boolean
          extras_type: 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'penalty' | null
          extras_runs: number
          is_wicket: boolean
          dismissal_type: string | null
          dismissed_batsman_id: string | null
          fielder_id: string | null
          ball_timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          innings_id?: string | null
          over_number: number
          ball_number: number
          batsman_id?: string | null
          non_striker_id?: string | null
          bowler_id?: string | null
          runs_scored?: number
          is_four?: boolean
          is_six?: boolean
          extras_type?: 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'penalty' | null
          extras_runs?: number
          is_wicket?: boolean
          dismissal_type?: string | null
          dismissed_batsman_id?: string | null
          fielder_id?: string | null
          ball_timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          innings_id?: string | null
          over_number?: number
          ball_number?: number
          batsman_id?: string | null
          non_striker_id?: string | null
          bowler_id?: string | null
          runs_scored?: number
          is_four?: boolean
          is_six?: boolean
          extras_type?: 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'penalty' | null
          extras_runs?: number
          is_wicket?: boolean
          dismissal_type?: string | null
          dismissed_batsman_id?: string | null
          fielder_id?: string | null
          ball_timestamp?: string
          created_at?: string
        }
      }
      live_match_state: {
        Row: {
          match_id: string
          current_innings: number
          current_batsman1_id: string | null
          current_batsman2_id: string | null
          current_bowler_id: string | null
          current_over: number
          current_ball: number
          current_score: number
          current_wickets: number
          target_score: number | null
          required_run_rate: number | null
          last_ball_event: string | null
          updated_at: string
        }
        Insert: {
          match_id: string
          current_innings?: number
          current_batsman1_id?: string | null
          current_batsman2_id?: string | null
          current_bowler_id?: string | null
          current_over?: number
          current_ball?: number
          current_score?: number
          current_wickets?: number
          target_score?: number | null
          required_run_rate?: number | null
          last_ball_event?: string | null
          updated_at?: string
        }
        Update: {
          match_id?: string
          current_innings?: number
          current_batsman1_id?: string | null
          current_batsman2_id?: string | null
          current_bowler_id?: string | null
          current_over?: number
          current_ball?: number
          current_score?: number
          current_wickets?: number
          target_score?: number | null
          required_run_rate?: number | null
          last_ball_event?: string | null
          updated_at?: string
        }
      }
    }
  }
}
