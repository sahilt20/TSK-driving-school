'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { formatOvers, calculateRunRate } from '@/lib/scoring/calculations'
import { motion, AnimatePresence } from 'framer-motion'

function OverlayContent() {
  const searchParams = useSearchParams()
  const matchId = searchParams.get('match')
  const theme = searchParams.get('theme') || 'default'

  const [matchData, setMatchData] = useState<any>(null)
  const [inningsData, setInningsData] = useState<any>(null)
  const [liveState, setLiveState] = useState<any>(null)
  const [batsmen, setBatsmen] = useState<any[]>([])
  const [bowler, setBowler] = useState<any>(null)
  const [lastBallEvent, setLastBallEvent] = useState('')

  useEffect(() => {
    if (!matchId) return

    fetchData()
    setupRealtimeSubscription()
  }, [matchId])

  async function fetchData() {
    // Fetch match
    const { data: match } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `)
      .eq('id', matchId)
      .single()

    if (match) {
      setMatchData(match)

      // Fetch current innings
      const { data: innings } = await supabase
        .from('innings')
        .select('*')
        .eq('match_id', matchId)
        .eq('is_completed', false)
        .single()

      if (innings) {
        setInningsData(innings)

        // Fetch batting performances
        const { data: batting } = await supabase
          .from('batting_performances')
          .select('*, players(*)')
          .eq('innings_id', innings.id)
          .eq('is_out', false)
          .limit(2)

        if (batting) {
          setBatsmen(batting)
        }
      }

      // Fetch live state
      const { data: state } = await supabase
        .from('live_match_state')
        .select('*, current_bowler:players!live_match_state_current_bowler_id_fkey(*)')
        .eq('match_id', matchId)
        .single()

      if (state) {
        setLiveState(state)
        setLastBallEvent(state.last_ball_event || '')
        if (state.current_bowler) {
          setBowler(state.current_bowler)
        }
      }
    }
  }

  function setupRealtimeSubscription() {
    const channel = supabase
      .channel(`overlay:${matchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'live_match_state',
        filter: `match_id=eq.${matchId}`
      }, (payload: any) => {
        setLiveState(payload.new)
        if (payload.new?.last_ball_event) {
          setLastBallEvent(payload.new.last_ball_event)
          // Clear event after 3 seconds
          setTimeout(() => setLastBallEvent(''), 3000)
        }
        fetchData()
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'innings',
      }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  if (!matchId) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>No match ID provided. Add ?match=YOUR_MATCH_ID to the URL</p>
      </div>
    )
  }

  if (!matchData || !inningsData) {
    return (
      <div className="flex items-center justify-center h-screen bg-transparent">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    )
  }

  const battingTeam = inningsData.batting_team_id === matchData.team_a_id
    ? matchData.team_a
    : matchData.team_b

  const currentRunRate = calculateRunRate(inningsData.total_runs, inningsData.total_balls / 6)

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-transparent">
      {/* Bottom Score Bar */}
      <div className="absolute bottom-0 left-0 right-0">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`${getThemeClasses(theme)}`}
        >
          {/* Main Score Line */}
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Team & Score */}
            <div className="flex items-center gap-6">
              <div className="text-3xl font-bold">
                {battingTeam?.short_name || battingTeam?.name}
              </div>
              <div className="text-5xl font-black">
                {inningsData.total_runs}/{inningsData.total_wickets}
              </div>
              <div className="text-2xl">
                ({formatOvers(inningsData.total_balls)})
              </div>
              <div className="text-lg opacity-80">
                CRR: {currentRunRate.toFixed(2)}
              </div>
            </div>

            {/* Last Ball Event */}
            <AnimatePresence>
              {lastBallEvent && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`text-2xl font-bold px-6 py-3 rounded-full ${
                    lastBallEvent.includes('WICKET')
                      ? 'bg-red-500 text-white'
                      : lastBallEvent.includes('SIX')
                      ? 'bg-purple-500 text-white'
                      : lastBallEvent.includes('FOUR')
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/20'
                  }`}
                >
                  {lastBallEvent}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Batsmen & Bowler Info */}
          <div className="px-8 py-3 bg-black/20 flex items-center justify-between text-sm">
            {/* Batsmen */}
            <div className="flex gap-8">
              {batsmen.map((batsman, idx) => (
                <div key={batsman.player_id} className="flex items-center gap-3">
                  {idx === 0 && <span className="text-yellow-400">★</span>}
                  <span className="font-semibold">{batsman.players?.name}:</span>
                  <span className="font-bold">
                    {batsman.runs_scored} ({batsman.balls_faced})
                  </span>
                  <span className="opacity-70">
                    [{batsman.fours}×4, {batsman.sixes}×6]
                  </span>
                </div>
              ))}
            </div>

            {/* Bowler */}
            {bowler && (
              <div className="flex items-center gap-3">
                <span className="font-semibold">{bowler.name}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function OverlayPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-transparent flex items-center justify-center text-white">Loading...</div>}>
      <OverlayContent />
    </Suspense>
  )
}

function getThemeClasses(theme: string) {
  switch (theme) {
    case 'dark':
      return 'bg-gradient-to-r from-gray-900 to-black text-white'
    case 'blue':
      return 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
    default:
      return 'bg-gradient-to-r from-green-600 to-emerald-700 text-white'
  }
}
