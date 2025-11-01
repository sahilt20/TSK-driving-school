import { supabase } from '@/lib/supabase/client'

interface BallInput {
  inningsId: string
  overNumber: number
  ballNumber: number
  batsmanId: string
  nonStrikerId: string
  bowlerId: string
  runsScored: number
  isFour: boolean
  isSix: boolean
  extrasType?: 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'penalty' | null
  extrasRuns: number
  isWicket: boolean
  dismissalType?: string
  dismissedBatsmanId?: string
  fielderId?: string
}

export async function recordBall(ballData: BallInput) {
  try {
    // Calculate total runs (including extras)
    const totalRuns = ballData.runsScored + ballData.extrasRuns
    const isLegalBall = !ballData.extrasType || (ballData.extrasType !== 'wide' && ballData.extrasType !== 'no-ball')

    // 1. Insert ball record
    const { data: ball, error: ballError } = await supabase
      .from('balls')
      .insert({
        innings_id: ballData.inningsId,
        over_number: ballData.overNumber,
        ball_number: ballData.ballNumber,
        batsman_id: ballData.batsmanId,
        non_striker_id: ballData.nonStrikerId,
        bowler_id: ballData.bowlerId,
        runs_scored: ballData.runsScored,
        is_four: ballData.isFour,
        is_six: ballData.isSix,
        extras_type: ballData.extrasType,
        extras_runs: ballData.extrasRuns,
        is_wicket: ballData.isWicket,
        dismissal_type: ballData.dismissalType,
        dismissed_batsman_id: ballData.dismissedBatsmanId,
        fielder_id: ballData.fielderId,
      })
      .select()
      .single()

    if (ballError) throw ballError

    // 2. Get current innings data
    const { data: innings, error: inningsError } = await supabase
      .from('innings')
      .select('*')
      .eq('id', ballData.inningsId)
      .single()

    if (inningsError) throw inningsError

    // 3. Update innings totals
    const newTotalRuns = innings.total_runs + totalRuns
    const newTotalWickets = innings.total_wickets + (ballData.isWicket ? 1 : 0)
    const newTotalBalls = innings.total_balls + (isLegalBall ? 1 : 0)

    // Update extras breakdown
    const extrasUpdate: any = {
      extras_total: innings.extras_total + ballData.extrasRuns
    }

    if (ballData.extrasType === 'wide') {
      extrasUpdate.extras_wides = innings.extras_wides + ballData.extrasRuns
    } else if (ballData.extrasType === 'no-ball') {
      extrasUpdate.extras_no_balls = innings.extras_no_balls + ballData.extrasRuns
    } else if (ballData.extrasType === 'bye') {
      extrasUpdate.extras_byes = innings.extras_byes + ballData.extrasRuns
    } else if (ballData.extrasType === 'leg-bye') {
      extrasUpdate.extras_leg_byes = innings.extras_leg_byes + ballData.extrasRuns
    }

    await supabase
      .from('innings')
      .update({
        total_runs: newTotalRuns,
        total_wickets: newTotalWickets,
        total_balls: newTotalBalls,
        total_overs: parseFloat((newTotalBalls / 6).toFixed(1)),
        ...extrasUpdate
      })
      .eq('id', ballData.inningsId)

    // 4. Update or create batting performance
    if (!ballData.extrasType || ballData.extrasType === 'no-ball') {
      const { data: batting, error: battingFetchError } = await supabase
        .from('batting_performances')
        .select('*')
        .eq('innings_id', ballData.inningsId)
        .eq('player_id', ballData.batsmanId)
        .single()

      if (batting) {
        await supabase
          .from('batting_performances')
          .update({
            runs_scored: batting.runs_scored + ballData.runsScored,
            balls_faced: batting.balls_faced + (isLegalBall ? 1 : 0),
            fours: batting.fours + (ballData.isFour ? 1 : 0),
            sixes: batting.sixes + (ballData.isSix ? 1 : 0),
            is_out: ballData.isWicket && ballData.dismissedBatsmanId === ballData.batsmanId,
            dismissal_type: ballData.isWicket && ballData.dismissedBatsmanId === ballData.batsmanId ? ballData.dismissalType : batting.dismissal_type,
          })
          .eq('id', batting.id)
      }
    }

    // 5. Update or create bowling performance
    const { data: bowling, error: bowlingFetchError } = await supabase
      .from('bowling_performances')
      .select('*')
      .eq('innings_id', ballData.inningsId)
      .eq('player_id', ballData.bowlerId)
      .single()

    if (bowling) {
      await supabase
        .from('bowling_performances')
        .update({
          balls_bowled: bowling.balls_bowled + (isLegalBall ? 1 : 0),
          overs_bowled: parseFloat(((bowling.balls_bowled + (isLegalBall ? 1 : 0)) / 6).toFixed(1)),
          runs_conceded: bowling.runs_conceded + totalRuns,
          wickets_taken: bowling.wickets_taken + (ballData.isWicket ? 1 : 0),
          wides: bowling.wides + (ballData.extrasType === 'wide' ? 1 : 0),
          no_balls: bowling.no_balls + (ballData.extrasType === 'no-ball' ? 1 : 0),
        })
        .eq('id', bowling.id)
    } else {
      await supabase
        .from('bowling_performances')
        .insert({
          innings_id: ballData.inningsId,
          player_id: ballData.bowlerId,
          balls_bowled: isLegalBall ? 1 : 0,
          overs_bowled: parseFloat((isLegalBall ? 0.1 : 0).toFixed(1)),
          runs_conceded: totalRuns,
          wickets_taken: ballData.isWicket ? 1 : 0,
          wides: ballData.extrasType === 'wide' ? 1 : 0,
          no_balls: ballData.extrasType === 'no-ball' ? 1 : 0,
        })
    }

    // 6. Update live match state
    const { data: match } = await supabase
      .from('innings')
      .select('match_id')
      .eq('id', ballData.inningsId)
      .single()

    if (match) {
      let eventText = ''
      if (ballData.isWicket) {
        eventText = 'WICKET!'
      } else if (ballData.isSix) {
        eventText = '6 SIX!'
      } else if (ballData.isFour) {
        eventText = '4 FOUR!'
      } else if (ballData.extrasType) {
        eventText = `${ballData.extrasRuns} ${ballData.extrasType.toUpperCase()}`
      } else {
        eventText = `${ballData.runsScored} ${ballData.runsScored === 1 ? 'run' : 'runs'}`
      }

      await supabase
        .from('live_match_state')
        .upsert({
          match_id: match.match_id,
          current_score: newTotalRuns,
          current_wickets: newTotalWickets,
          current_over: ballData.overNumber,
          current_ball: ballData.ballNumber,
          current_batsman1_id: ballData.batsmanId,
          current_batsman2_id: ballData.nonStrikerId,
          current_bowler_id: ballData.bowlerId,
          last_ball_event: eventText,
          updated_at: new Date().toISOString(),
        })
    }

    return { success: true, ball }
  } catch (error) {
    console.error('Error recording ball:', error)
    return { success: false, error }
  }
}

export async function undoLastBall(inningsId: string) {
  try {
    // Get the last ball
    const { data: lastBall, error: fetchError } = await supabase
      .from('balls')
      .select('*')
      .eq('innings_id', inningsId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !lastBall) {
      throw new Error('No ball to undo')
    }

    // Delete the ball
    await supabase
      .from('balls')
      .delete()
      .eq('id', lastBall.id)

    // TODO: Reverse all the updates (innings, batting, bowling, etc.)
    // This is complex and should be done in a database transaction

    return { success: true }
  } catch (error) {
    console.error('Error undoing ball:', error)
    return { success: false, error }
  }
}
