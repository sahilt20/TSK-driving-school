'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { formatOvers } from '@/lib/scoring/calculations'

function StreamOverlayContent() {
  const searchParams = useSearchParams()
  const matchId = searchParams.get('match')

  const [match, setMatch] = useState<any>(null)
  const [innings, setInnings] = useState<any>(null)
  const [batsmen, setBatsmen] = useState<any[]>([])
  const [bowler, setBowler] = useState<any>(null)
  const [liveState, setLiveState] = useState<any>(null)
  const [lastBallAnimation, setLastBallAnimation] = useState<string | null>(null)
  const [showPlayerCard, setShowPlayerCard] = useState<any>(null)
  const [partnership, setPartnership] = useState<any>(null)

  useEffect(() => {
    if (!matchId) return
    fetchMatchData()
    setupRealtimeSubscription()
  }, [matchId])

  async function fetchMatchData() {
    // Fetch match details
    const { data: matchData } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `)
      .eq('id', matchId)
      .single()

    if (matchData) {
      setMatch(matchData)
    }

    // Fetch current innings
    const { data: inningsData } = await supabase
      .from('innings')
      .select('*')
      .eq('match_id', matchId)
      .eq('is_completed', false)
      .order('innings_number', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (inningsData) {
      setInnings(inningsData)

      // Fetch current batsmen
      const { data: batsmenData } = await supabase
        .from('batting_performances')
        .select('*, players(*)')
        .eq('innings_id', inningsData.id)
        .eq('is_out', false)
        .limit(2)

      if (batsmenData) {
        setBatsmen(batsmenData)
      }

      // Fetch bowling performance
      const { data: stateData } = await supabase
        .from('live_match_state')
        .select('*')
        .eq('match_id', matchId)
        .maybeSingle()

      if (stateData) {
        setLiveState(stateData)

        if (stateData.current_bowler_id) {
          const { data: bowlerPerf } = await supabase
            .from('bowling_performances')
            .select('*, players(*)')
            .eq('innings_id', inningsData.id)
            .eq('player_id', stateData.current_bowler_id)
            .maybeSingle()

          if (bowlerPerf) {
            setBowler(bowlerPerf)
          }
        }
      }

      // Fetch current partnership
      if (batsmenData && batsmenData.length >= 2) {
        const { data: partnershipData } = await supabase
          .from('partnerships')
          .select('*')
          .eq('innings_id', inningsData.id)
          .eq('is_current', true)
          .maybeSingle()

        if (partnershipData) {
          setPartnership(partnershipData)
        }
      }

      // Fetch latest ball for animations
      const { data: latestBall } = await supabase
        .from('balls')
        .select('*')
        .eq('innings_id', inningsData.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestBall) {
        detectBallAnimation(latestBall)
      }
    }
  }

  function detectBallAnimation(ball: any) {
    if (ball.is_wicket) {
      setLastBallAnimation('WICKET')
      setTimeout(() => setLastBallAnimation(null), 4000)
    } else if (ball.is_six) {
      setLastBallAnimation('SIX')
      setTimeout(() => setLastBallAnimation(null), 3000)
    } else if (ball.is_four) {
      setLastBallAnimation('FOUR')
      setTimeout(() => setLastBallAnimation(null), 3000)
    }
  }

  function setupRealtimeSubscription() {
    const channel = supabase
      .channel(`stream-overlay:${matchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'balls',
      }, () => {
        fetchMatchData()
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'innings',
      }, () => {
        fetchMatchData()
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'batting_performances',
      }, () => {
        fetchMatchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  if (!matchId || !innings || !match) {
    return null
  }

  const battingTeam = innings.batting_team_id === match?.team_a_id ? match?.team_a : match?.team_b
  const bowlingTeam = innings.bowling_team_id === match?.team_a_id ? match?.team_a : match?.team_b
  const striker = batsmen.find(b => b.player_id === liveState?.current_batsman1_id) || batsmen[0]
  const nonStriker = batsmen.find(b => b.player_id === liveState?.current_batsman2_id) || batsmen[1]
  const runRate = innings.total_balls > 0 ? (innings.total_runs / innings.total_balls * 6).toFixed(2) : '0.00'

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Top Score Bar - IPL Style */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="flex items-stretch">
          {/* Left - Batting Team Score */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-8 py-3 flex items-center gap-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-blue-700">{battingTeam?.short_name || 'BAT'}</span>
              </div>
              <div>
                <div className="text-sm font-semibold opacity-90">{battingTeam?.name}</div>
                <div className="text-xs opacity-75">{formatOvers(innings.total_balls)} Ov</div>
              </div>
            </div>
            <div className="text-5xl font-black tracking-tight">
              {innings.total_runs}<span className="text-3xl opacity-75">/{innings.total_wickets}</span>
            </div>
            <div className="text-sm">
              <div className="opacity-90">CRR: <span className="font-bold">{runRate}</span></div>
            </div>
          </div>

          {/* Center - Match Info */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-3 flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs opacity-75 uppercase tracking-wide">{match.match_type}</div>
              <div className="text-sm font-bold">{match.venue}</div>
            </div>
          </div>

          {/* Right - Bowling Team */}
          <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-600 text-white px-6 py-3 flex items-center gap-3 shadow-2xl">
            <div className="text-right">
              <div className="text-sm font-semibold">{bowlingTeam?.name}</div>
              <div className="text-xs opacity-75">BOWLING</div>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-red-700">{bowlingTeam?.short_name || 'BWL'}</span>
            </div>
          </div>
        </div>

        {/* Partnership Bar */}
        {partnership && partnership.runs > 0 && (
          <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white px-6 py-2 text-sm flex items-center justify-center gap-4 shadow-lg animate-slideDown">
            <span className="opacity-75">PARTNERSHIP:</span>
            <span className="font-bold text-lg">{partnership.runs}</span>
            <span className="opacity-75">runs</span>
            <span className="font-bold">({partnership.balls} balls)</span>
          </div>
        )}
      </div>

      {/* Lower Third - Batsmen & Bowler Cards */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <div className="grid grid-cols-3 gap-4 p-4">
          {/* Striker Card */}
          {striker && (
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg shadow-2xl p-4 border-l-4 border-yellow-400 animate-slideUp">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-300 text-2xl">★</span>
                <div>
                  <div className="text-xs text-green-100 font-semibold uppercase tracking-wide">On Strike</div>
                  <div className="text-white font-bold text-xl">{striker.players?.name}</div>
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <div className="text-5xl font-black text-white">{striker.runs_scored}</div>
                <div className="text-lg text-green-100">({striker.balls_faced})</div>
                <div className="text-sm text-green-200">
                  SR: {striker.balls_faced > 0 ? ((striker.runs_scored / striker.balls_faced) * 100).toFixed(0) : '0'}
                </div>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-green-100">
                <span>{striker.fours} Fours</span>
                <span>{striker.sixes} Sixes</span>
              </div>
            </div>
          )}

          {/* Bowler Card */}
          {bowler && (
            <div className="bg-gradient-to-br from-red-600 to-orange-700 rounded-lg shadow-2xl p-4 border-l-4 border-yellow-400 animate-slideUp">
              <div className="mb-2">
                <div className="text-xs text-red-100 font-semibold uppercase tracking-wide">Bowling</div>
                <div className="text-white font-bold text-xl">{bowler.players?.name}</div>
                <div className="text-sm text-red-100">{bowler.players?.bowling_style}</div>
              </div>
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-black text-white">
                  {Math.floor(bowler.balls_bowled / 6)}.{bowler.balls_bowled % 6}
                </div>
                <div className="text-lg text-red-100">Overs</div>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-red-100">
                <span className="font-bold text-lg">{bowler.wickets_taken}-{bowler.runs_conceded}</span>
                <span>Econ: {bowler.balls_bowled > 0 ? ((bowler.runs_conceded / bowler.balls_bowled) * 6).toFixed(2) : '0.00'}</span>
              </div>
            </div>
          )}

          {/* Non-Striker Card */}
          {nonStriker && (
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-2xl p-4 border-l-4 border-gray-500 animate-slideUp">
              <div className="mb-2">
                <div className="text-xs text-gray-300 font-semibold uppercase tracking-wide">At Non-Striker</div>
                <div className="text-white font-bold text-xl">{nonStriker.players?.name}</div>
              </div>
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-black text-white">{nonStriker.runs_scored}</div>
                <div className="text-lg text-gray-300">({nonStriker.balls_faced})</div>
                <div className="text-sm text-gray-400">
                  SR: {nonStriker.balls_faced > 0 ? ((nonStriker.runs_scored / nonStriker.balls_faced) * 100).toFixed(0) : '0'}
                </div>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-gray-300">
                <span>{nonStriker.fours} Fours</span>
                <span>{nonStriker.sixes} Sixes</span>
              </div>
            </div>
          )}
        </div>

        {/* Branding Bar */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-6 py-1.5 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-widest">
            Powered by Cricket Club Platform • Live Streaming
          </div>
        </div>
      </div>

      {/* Animated Event Graphics */}
      {lastBallAnimation === 'SIX' && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none animate-bounceIn">
          <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 text-white px-20 py-12 rounded-3xl shadow-2xl transform rotate-3 animate-pulse border-8 border-yellow-300">
            <div className="text-9xl font-black tracking-wider drop-shadow-2xl">SIX!</div>
            <div className="text-3xl font-bold text-center mt-4 text-yellow-200">Maximum!</div>
          </div>
        </div>
      )}

      {lastBallAnimation === 'FOUR' && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none animate-bounceIn">
          <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 text-white px-20 py-12 rounded-3xl shadow-2xl transform -rotate-2 animate-pulse border-8 border-yellow-300">
            <div className="text-9xl font-black tracking-wider drop-shadow-2xl">FOUR!</div>
            <div className="text-3xl font-bold text-center mt-4 text-yellow-200">Boundary!</div>
          </div>
        </div>
      )}

      {lastBallAnimation === 'WICKET' && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none animate-bounceIn">
          <div className="bg-gradient-to-br from-red-700 via-red-600 to-orange-600 text-white px-20 py-12 rounded-3xl shadow-2xl animate-pulse border-8 border-yellow-300">
            <div className="text-9xl font-black tracking-wider drop-shadow-2xl">OUT!</div>
            <div className="text-3xl font-bold text-center mt-4 text-yellow-200">Wicket!</div>
          </div>
        </div>
      )}

      {/* Global Styles for Transparent Background */}
      <style jsx global>{`
        body {
          background: transparent !important;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-bounceIn {
          animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  )
}

export default function StreamOverlayPage() {
  return (
    <Suspense fallback={null}>
      <StreamOverlayContent />
    </Suspense>
  )
}
