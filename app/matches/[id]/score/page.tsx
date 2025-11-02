'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { recordBall } from '@/lib/scoring/ballScoring'
import { formatOvers } from '@/lib/scoring/calculations'
import { RotateCcw, Users, ChevronDown, ArrowLeft, Settings, BarChart3, X, MoreVertical, StopCircle, Trash2, PlayCircle } from 'lucide-react'

export default function ScoringPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.id as string

  const [match, setMatch] = useState<any>(null)
  const [innings, setInnings] = useState<any>(null)
  const [batsmen, setBatsmen] = useState<any[]>([])
  const [allBattingPlayers, setAllBattingPlayers] = useState<any[]>([])
  const [bowlers, setBowlers] = useState<any[]>([])
  const [striker, setStriker] = useState<any>(null)
  const [nonStriker, setNonStriker] = useState<any>(null)
  const [bowler, setBowler] = useState<any>(null)
  const [currentOver, setCurrentOver] = useState<any[]>([])
  const [ballNumber, setBallNumber] = useState(1)
  const [overNumber, setOverNumber] = useState(0)
  const [showExtras, setShowExtras] = useState(false)
  const [showWicket, setShowWicket] = useState(false)
  const [showBatsmanSelector, setShowBatsmanSelector] = useState<'striker' | 'nonStriker' | null>(null)
  const [showBowlerSelector, setShowBowlerSelector] = useState(false)
  const [showMatchOptions, setShowMatchOptions] = useState(false)
  const [showRetiredHurt, setShowRetiredHurt] = useState(false)
  const [showFullScoreboard, setShowFullScoreboard] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [recording, setRecording] = useState(false)
  const [isUpdatingScore, setIsUpdatingScore] = useState(false)
  const [bowlerPerformance, setBowlerPerformance] = useState<any>(null)
  const [overByOverData, setOverByOverData] = useState<any[]>([])
  const [allBowlingPerformances, setAllBowlingPerformances] = useState<any[]>([])

  useEffect(() => {
    fetchMatchData()
    setupRealtimeSubscription()
  }, [matchId])

  async function fetchMatchData(preserveCurrentBatsmen = false) {
    try {
      setError('')

      // Store current batsmen IDs if we need to preserve them
      const currentStrikerId = striker?.player_id
      const currentNonStrikerId = nonStriker?.player_id

      // Fetch match details
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select(`
          *,
          team_a:teams!matches_team_a_id_fkey(*),
          team_b:teams!matches_team_b_id_fkey(*)
        `)
        .eq('id', matchId)
        .single()

      if (matchError) throw matchError

      if (!matchData) {
        setError('Match not found')
        setLoading(false)
        return
      }

      setMatch(matchData)

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
        const innings = inningsData as any
        setInnings(innings)
        const totalBalls = innings.total_balls || 0
        setOverNumber(Math.floor(totalBalls / 6))
        setBallNumber((totalBalls % 6) + 1)

        // Fetch batting performances
        const { data: battingData } = await supabase
          .from('batting_performances')
          .select('*, players:player_id(*)')
          .eq('innings_id', innings.id)
          .eq('is_out', false)

        // Fetch ALL batting performances for scoreboard
        const { data: allBatsmenData } = await supabase
          .from('batting_performances')
          .select('*, players:player_id(*)')
          .eq('innings_id', innings.id)
          .order('batting_position')

        if (allBatsmenData) {
          setBatsmen(allBatsmenData as any)
        }

        if (battingData) {
          if (preserveCurrentBatsmen && currentStrikerId && currentNonStrikerId) {
            // Update current batsmen with fresh data from ALL batsmen (including out batsmen)
            const updatedStriker = allBatsmenData?.find(b => b.player_id === currentStrikerId)
            const updatedNonStriker = allBatsmenData?.find(b => b.player_id === currentNonStrikerId)

            if (updatedStriker && !updatedStriker.is_out) {
              setStriker(updatedStriker)
            } else if (!updatedStriker || updatedStriker.is_out) {
              // If striker is out, select a new one
              const nextBatsman = battingData.find(b => b.player_id !== currentNonStrikerId)
              if (nextBatsman) setStriker(nextBatsman)
            }

            if (updatedNonStriker && !updatedNonStriker.is_out) {
              setNonStriker(updatedNonStriker)
            } else if (!updatedNonStriker || updatedNonStriker.is_out) {
              // If non-striker is out, select a new one
              const nextBatsman = battingData.find(b => b.player_id !== currentStrikerId)
              if (nextBatsman) setNonStriker(nextBatsman)
            }
          } else if (battingData.length >= 2) {
            // First time setup - just take first two not-out
            setStriker(battingData[0])
            setNonStriker(battingData[1])
          } else if (battingData.length === 1) {
            // Only one batsman not out
            if (!striker || striker.is_out) {
              setStriker(battingData[0])
            }
          }
        }

        // Fetch ALL players from batting team (not just those with performances)
        const { data: allBattingTeamPlayers } = await supabase
          .from('players')
          .select('*')
          .eq('team_id', innings.batting_team_id)

        if (allBattingTeamPlayers) {
          setAllBattingPlayers(allBattingTeamPlayers as any)
        }

        // Fetch bowlers
        const { data: playersData } = await supabase
          .from('players')
          .select('*')
          .eq('team_id', innings.bowling_team_id)

        if (playersData) {
          setBowlers(playersData as any)
        }

        // Fetch over-by-over data for graphs
        const { data: ballsData } = await supabase
          .from('balls')
          .select('*')
          .eq('innings_id', innings.id)
          .order('over_number')
          .order('ball_number')

        if (ballsData) {
          // Calculate runs per over
          const overStats = ballsData.reduce((acc: any[], ball: any) => {
            const overIndex = ball.over_number
            if (!acc[overIndex]) {
              acc[overIndex] = { over: overIndex, runs: 0, wickets: 0, balls: 0 }
            }
            acc[overIndex].runs += (ball.runs_scored + (ball.extras_runs || 0))
            if (ball.is_wicket) acc[overIndex].wickets++
            if (!ball.extras_type || ball.extras_type === 'bye' || ball.extras_type === 'leg-bye') {
              acc[overIndex].balls++
            }
            return acc
          }, [])
          setOverByOverData(overStats.filter(Boolean))
        }

        // Fetch current over balls
        const { data: overBalls } = await supabase
          .from('balls')
          .select('*')
          .eq('innings_id', innings.id)
          .eq('over_number', Math.floor(totalBalls / 6))
          .order('ball_number')

        if (overBalls) {
          setCurrentOver(overBalls as any)
        }

        // Fetch all bowling performances for this innings
        const { data: bowlingPerformances } = await supabase
          .from('bowling_performances')
          .select('*, players:player_id(*)')
          .eq('innings_id', innings.id)
          .order('balls_bowled', { ascending: false })

        if (bowlingPerformances) {
          setAllBowlingPerformances(bowlingPerformances as any)
        }

        // Fetch current bowler performance if bowler is selected
        // This will be updated when bowler is selected

        // Load current state from live_match_state if available (for persistence)
        if (!preserveCurrentBatsmen) {
          const { data: liveState } = await supabase
            .from('live_match_state')
            .select('*')
            .eq('match_id', matchId)
            .maybeSingle()

          if (liveState) {
            // Restore batsmen if saved in live state
            if (liveState.current_batsman1_id && liveState.current_batsman2_id && allBatsmenData) {
              const savedStriker = allBatsmenData.find(b => b.player_id === liveState.current_batsman1_id)
              const savedNonStriker = allBatsmenData.find(b => b.player_id === liveState.current_batsman2_id)

              if (savedStriker && !savedStriker.is_out) setStriker(savedStriker)
              if (savedNonStriker && !savedNonStriker.is_out) setNonStriker(savedNonStriker)
            }

            // Restore bowler if saved in live state
            if (liveState.current_bowler_id && playersData) {
              const savedBowler = playersData.find(p => p.id === liveState.current_bowler_id)
              if (savedBowler) setBowler(savedBowler)
            }
          }
        }
      }

      setLoading(false)
    } catch (err: any) {
      console.error('Error fetching match data:', err)
      setError(err.message || 'Failed to load match data')
      setLoading(false)
    }
  }

  // Fetch bowler performance whenever bowler changes
  useEffect(() => {
    if (bowler && innings) {
      fetchBowlerPerformance()
    }
  }, [bowler, innings])

  async function fetchBowlerPerformance() {
    if (!bowler || !innings) return

    const { data } = await supabase
      .from('bowling_performances')
      .select('*')
      .eq('innings_id', innings.id)
      .eq('player_id', bowler.id)
      .maybeSingle()

    if (data) {
      setBowlerPerformance(data)
    } else {
      // Initialize bowling performance if doesn't exist
      const { data: newPerf } = await supabase
        .from('bowling_performances')
        .insert({
          innings_id: innings.id,
          player_id: bowler.id,
          balls_bowled: 0,
          runs_conceded: 0,
          wickets_taken: 0,
          maidens: 0,
        })
        .select()
        .single()

      if (newPerf) {
        setBowlerPerformance(newPerf)
      }
    }
  }

  function setupRealtimeSubscription() {
    const channel = supabase
      .channel(`match:${matchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'innings',
      }, () => {
        // Don't update if we're in the middle of scoring
        if (!isUpdatingScore) {
          fetchMatchData(true)
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'batting_performances',
      }, () => {
        // Don't update if we're in the middle of scoring
        if (!isUpdatingScore) {
          fetchMatchData(true)
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bowling_performances',
      }, () => {
        // Don't update if we're in the middle of scoring
        if (!isUpdatingScore) {
          fetchMatchData(true)
          if (bowler && innings) fetchBowlerPerformance()
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'balls',
      }, () => {
        // Don't update if we're in the middle of scoring
        if (!isUpdatingScore) {
          fetchMatchData(true)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  async function handleBallScore(runs: number, isFour = false, isSix = false) {
    if (!striker || !nonStriker || !bowler || !innings) {
      setError('Please select batsmen and bowler first')
      return
    }

    setRecording(true)
    setIsUpdatingScore(true) // Block realtime updates
    setError('')

    // Store player IDs for swapping logic
    const strikerPlayerId = striker.player_id
    const nonStrikerPlayerId = nonStriker.player_id

    const result = await recordBall({
      inningsId: innings.id,
      overNumber,
      ballNumber,
      batsmanId: strikerPlayerId,
      nonStrikerId: nonStrikerPlayerId,
      bowlerId: bowler.id,
      runsScored: runs,
      isFour,
      isSix,
      extrasRuns: 0,
      isWicket: false,
    })

    if (result.success) {
      // Get the updated batsman objects directly from database
      const { data: freshBatsmen } = await supabase
        .from('batting_performances')
        .select('*, players:player_id(*)')
        .eq('innings_id', innings.id)
        .in('player_id', [strikerPlayerId, nonStrikerPlayerId])

      // Get updated innings for display
      const { data: updatedInnings } = await supabase
        .from('innings')
        .select('*')
        .eq('id', innings.id)
        .single()

      if (updatedInnings) {
        setInnings(updatedInnings)
      }

      // Update all batsmen for scoreboard
      const { data: allBatsmenData } = await supabase
        .from('batting_performances')
        .select('*, players:player_id(*)')
        .eq('innings_id', innings.id)
        .order('batting_position')

      if (allBatsmenData) {
        setBatsmen(allBatsmenData)
      }

      // Update current over display
      const totalBalls = updatedInnings?.total_balls || 0
      const currentOverNum = Math.floor(totalBalls / 6)
      const { data: overBalls } = await supabase
        .from('balls')
        .select('*')
        .eq('innings_id', innings.id)
        .eq('over_number', currentOverNum)
        .order('ball_number')

      if (overBalls) {
        setCurrentOver(overBalls)
      }

      if (freshBatsmen && freshBatsmen.length === 2) {
        const freshStriker = freshBatsmen.find(b => b.player_id === strikerPlayerId)
        const freshNonStriker = freshBatsmen.find(b => b.player_id === nonStrikerPlayerId)

        // Determine swapping based on runs and over
        const shouldSwapForRuns = runs % 2 === 1
        const isOverComplete = ballNumber === 6

        if (isOverComplete) {
          // End of over - always swap, but check if already swapped for runs
          if (shouldSwapForRuns) {
            // Already swapped for odd runs, swap back = net no swap
            setStriker(freshStriker)
            setNonStriker(freshNonStriker)
          } else {
            // Not swapped for runs, so swap for new over
            setStriker(freshNonStriker)
            setNonStriker(freshStriker)
          }
          setOverNumber(overNumber + 1)
          setBallNumber(1)
        } else {
          // Middle of over
          if (shouldSwapForRuns) {
            // Swap for odd runs
            setStriker(freshNonStriker)
            setNonStriker(freshStriker)
          } else {
            // No swap
            setStriker(freshStriker)
            setNonStriker(freshNonStriker)
          }
          setBallNumber(ballNumber + 1)
        }
      }
    } else {
      setError('Failed to record ball. Please try again.')
    }

    setRecording(false)
    setIsUpdatingScore(false) // Allow realtime updates again
  }

  async function handleExtra(type: 'wide' | 'no-ball' | 'bye' | 'leg-bye', runs: number = 1) {
    if (!striker || !nonStriker || !bowler || !innings) return

    setRecording(true)
    setIsUpdatingScore(true) // Block realtime updates

    // Store player IDs for swapping logic
    const strikerPlayerId = striker.player_id
    const nonStrikerPlayerId = nonStriker.player_id

    const result = await recordBall({
      inningsId: innings.id,
      overNumber,
      ballNumber,
      batsmanId: strikerPlayerId,
      nonStrikerId: nonStrikerPlayerId,
      bowlerId: bowler.id,
      runsScored: 0,
      isFour: false,
      isSix: false,
      extrasType: type,
      extrasRuns: runs,
      isWicket: false,
    })

    if (result.success) {
      // Get updated batsman objects directly from database
      const { data: freshBatsmen } = await supabase
        .from('batting_performances')
        .select('*, players:player_id(*)')
        .eq('innings_id', innings.id)
        .in('player_id', [strikerPlayerId, nonStrikerPlayerId])

      // Get updated innings
      const { data: updatedInnings } = await supabase
        .from('innings')
        .select('*')
        .eq('id', innings.id)
        .single()

      if (updatedInnings) {
        setInnings(updatedInnings)
      }

      // Update all batsmen for scoreboard
      const { data: allBatsmenData } = await supabase
        .from('batting_performances')
        .select('*, players:player_id(*)')
        .eq('innings_id', innings.id)
        .order('batting_position')

      if (allBatsmenData) {
        setBatsmen(allBatsmenData)
      }

      // Update current over display
      const totalBalls = updatedInnings?.total_balls || 0
      const currentOverNum = Math.floor(totalBalls / 6)
      const { data: overBalls } = await supabase
        .from('balls')
        .select('*')
        .eq('innings_id', innings.id)
        .eq('over_number', currentOverNum)
        .order('ball_number')

      if (overBalls) {
        setCurrentOver(overBalls)
      }

      if (freshBatsmen && freshBatsmen.length === 2) {
        const freshStriker = freshBatsmen.find(b => b.player_id === strikerPlayerId)
        const freshNonStriker = freshBatsmen.find(b => b.player_id === nonStrikerPlayerId)

        // Byes and leg-byes allow runs, so swap batsmen for odd runs
        const shouldSwapForRuns = (type === 'bye' || type === 'leg-bye') && runs % 2 === 1
        const isLegalBall = type !== 'wide' && type !== 'no-ball'
        const isOverComplete = isLegalBall && ballNumber === 6

        if (isOverComplete) {
          // End of over
          if (shouldSwapForRuns) {
            // Already swapped for runs, swap back = net no swap
            setStriker(freshStriker)
            setNonStriker(freshNonStriker)
          } else {
            // Not swapped for runs, so swap for new over
            setStriker(freshNonStriker)
            setNonStriker(freshStriker)
          }
          setOverNumber(overNumber + 1)
          setBallNumber(1)
        } else if (isLegalBall) {
          // Middle of over, legal ball
          if (shouldSwapForRuns) {
            // Swap for odd runs
            setStriker(freshNonStriker)
            setNonStriker(freshStriker)
          } else {
            // No swap
            setStriker(freshStriker)
            setNonStriker(freshNonStriker)
          }
          setBallNumber(ballNumber + 1)
        } else {
          // Illegal ball (wide/no-ball) - update stats but don't change ball number
          if (shouldSwapForRuns) {
            setStriker(freshNonStriker)
            setNonStriker(freshStriker)
          } else {
            setStriker(freshStriker)
            setNonStriker(freshNonStriker)
          }
        }
      }

      setShowExtras(false)
    }

    setRecording(false)
    setIsUpdatingScore(false) // Allow realtime updates again
  }

  async function handleWicket() {
    setShowWicket(true)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading match data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Match</h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => router.push('/matches')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Back to Matches
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <p className="text-red-800 dark:text-red-300">{error}</p>
            <button
              onClick={() => setError('')}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Score Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-4">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/matches')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Matches</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/matches/${matchId}/analytics`)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
              <button
                onClick={() => window.open(`/overlay?match=${matchId}`, '_blank')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Overlay</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMatchOptions(!showMatchOptions)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showMatchOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20">
                    <button
                      onClick={() => {
                        setShowRetiredHurt(true)
                        setShowMatchOptions(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 border-b"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span className="text-gray-900">Retired Hurt</span>
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('End this innings? This cannot be undone.')) {
                          await supabase
                            .from('innings')
                            .update({ is_completed: true })
                            .eq('id', innings.id)
                          router.push('/matches')
                        }
                        setShowMatchOptions(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 border-b"
                    >
                      <StopCircle className="w-4 h-4" />
                      <span className="text-gray-900">End Innings</span>
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Stop this match? You can resume it later.')) {
                          await supabase
                            .from('matches')
                            .update({ status: 'paused' })
                            .eq('id', matchId)
                          router.push('/matches')
                        }
                        setShowMatchOptions(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 border-b text-orange-700"
                    >
                      <StopCircle className="w-4 h-4" />
                      <span>Stop Match</span>
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this match? This cannot be undone and all scoring data will be lost!')) {
                          await supabase
                            .from('matches')
                            .delete()
                            .eq('id', matchId)
                          router.push('/matches')
                        }
                        setShowMatchOptions(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-2 text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Match</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                {innings?.batting_team_id === match?.team_a_id ? match?.team_a?.name : match?.team_b?.name}
              </h1>
              <p className="text-green-100">
                {match?.match_type} • {match?.venue}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">
                {innings?.total_runs}/{innings?.total_wickets}
              </div>
              <div className="text-xl">
                {formatOvers(innings?.total_balls || 0)} overs
              </div>
              <div className="text-sm text-green-200">
                CRR: {innings?.total_balls > 0 ? ((innings?.total_runs / innings?.total_balls) * 6).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scoring Interface */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Main Panel - Batsmen */}
          <div>
            {/* Batsmen Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <Users className="w-5 h-5" />
                Current Batsmen
              </h2>
              <div className="space-y-4">
                {/* Striker */}
                <button
                  onClick={() => setShowBatsmanSelector('striker')}
                  className={`w-full p-4 rounded-lg text-left transition-all ${striker ? 'bg-green-50 border-2 border-green-500 hover:bg-green-100' : 'bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">★ STRIKER</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                  {striker ? (
                    <>
                      <div className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{striker.players?.name}</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        <span className={recording ? 'opacity-50' : 'transition-opacity'}>{striker.runs_scored}</span> ({striker.balls_faced})
                        <span className="text-sm font-normal text-gray-700 dark:text-gray-300 ml-3">
                          {striker.fours}×4, {striker.sixes}×6
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        SR: {striker.balls_faced > 0 ? ((striker.runs_scored / striker.balls_faced) * 100).toFixed(1) : '0.0'}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-600 dark:text-gray-400 font-semibold">Tap to select striker</div>
                  )}
                </button>

                {/* Non-Striker */}
                <button
                  onClick={() => setShowBatsmanSelector('nonStriker')}
                  className={`w-full p-4 rounded-lg text-left transition-all ${nonStriker ? 'bg-gray-50 border-2 border-gray-300 hover:bg-gray-100' : 'bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">NON-STRIKER</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                  {nonStriker ? (
                    <>
                      <div className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{nonStriker.players?.name}</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        <span className={recording ? 'opacity-50' : 'transition-opacity'}>{nonStriker.runs_scored}</span> ({nonStriker.balls_faced})
                        <span className="text-sm font-normal text-gray-700 dark:text-gray-300 ml-3">
                          {nonStriker.fours}×4, {nonStriker.sixes}×6
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        SR: {nonStriker.balls_faced > 0 ? ((nonStriker.runs_scored / nonStriker.balls_faced) * 100).toFixed(1) : '0.0'}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-600 dark:text-gray-400 font-semibold">Tap to select non-striker</div>
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  const temp = striker
                  setStriker(nonStriker)
                  setNonStriker(temp)
                }}
                disabled={!striker || !nonStriker}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ⇄ Swap Batsmen
              </button>
            </div>

            {/* Bowler Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Current Bowler</h2>
              <button
                onClick={() => setShowBowlerSelector(true)}
                className={`w-full p-4 rounded-lg text-left transition-all ${bowler ? 'bg-red-50 border-2 border-red-500 hover:bg-red-100' : 'bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">🎯 BOWLER</span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
                {bowler ? (
                  <>
                    <div className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{bowler.name}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">{bowler.bowling_style}</div>
                    {bowlerPerformance && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="bg-white dark:bg-gray-700 p-2 rounded">
                          <div className="text-xs text-gray-600 dark:text-gray-400">Overs</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {Math.floor(bowlerPerformance.balls_bowled / 6)}.{bowlerPerformance.balls_bowled % 6}
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-2 rounded">
                          <div className="text-xs text-gray-600 dark:text-gray-400">Runs</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{bowlerPerformance.runs_conceded}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-2 rounded">
                          <div className="text-xs text-gray-600 dark:text-gray-400">Wickets</div>
                          <div className="text-lg font-bold text-red-600">{bowlerPerformance.wickets_taken}</div>
                        </div>
                        <div className="col-span-3 mt-1">
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Economy: {bowlerPerformance.balls_bowled > 0
                              ? ((bowlerPerformance.runs_conceded / bowlerPerformance.balls_bowled) * 6).toFixed(2)
                              : '0.00'}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-600 dark:text-gray-400 font-semibold">Tap to select bowler</div>
                )}
              </button>
            </div>

            {/* Current Over */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h3 className="font-bold mb-3 text-gray-900 dark:text-white">This Over: {overNumber}.{ballNumber - 1}</h3>
              <div className="flex gap-2 flex-wrap">
                {currentOver.map((ball, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      ball.is_wicket
                        ? 'bg-red-500 text-white'
                        : ball.is_six
                        ? 'bg-purple-500 text-white'
                        : ball.is_four
                        ? 'bg-blue-500 text-white'
                        : ball.extras_type
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    {ball.is_wicket ? 'W' : ball.extras_type ? ball.extras_type[0].toUpperCase() : ball.runs_scored}
                  </div>
                ))}
              </div>
            </div>

            {/* Scoring Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="font-bold mb-4 text-lg text-gray-900 dark:text-white">Score Ball</h3>

              {/* Runs */}
              <div className="grid grid-cols-7 gap-3 mb-4">
                <button
                  onClick={() => handleBallScore(0)}
                  disabled={recording}
                  className="aspect-square bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  0
                </button>
                <button
                  onClick={() => handleBallScore(1)}
                  disabled={recording}
                  className="aspect-square bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  1
                </button>
                <button
                  onClick={() => handleBallScore(2)}
                  disabled={recording}
                  className="aspect-square bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  2
                </button>
                <button
                  onClick={() => handleBallScore(3)}
                  disabled={recording}
                  className="aspect-square bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  3
                </button>
                <button
                  onClick={() => handleBallScore(4, true)}
                  disabled={recording}
                  className="aspect-square bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  4
                </button>
                <button
                  onClick={() => handleBallScore(5)}
                  disabled={recording}
                  className="aspect-square bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  5
                </button>
                <button
                  onClick={() => handleBallScore(6, false, true)}
                  disabled={recording}
                  className="aspect-square bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  6
                </button>
              </div>

              {/* Wicket and Extras */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWicket}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg"
                >
                  WICKET
                </button>
                <button
                  onClick={() => setShowExtras(!showExtras)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2"
                >
                  EXTRAS
                  <ChevronDown className={`w-5 h-5 transition-transform ${showExtras ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Extras Panel */}
              {showExtras && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3">Extras</h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      onClick={() => handleExtra('wide')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold"
                    >
                      Wide (1)
                    </button>
                    <button
                      onClick={() => handleExtra('no-ball')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold"
                    >
                      No Ball (1)
                    </button>
                    <button
                      onClick={() => handleExtra('bye')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold"
                    >
                      Bye (1)
                    </button>
                    <button
                      onClick={() => handleExtra('leg-bye')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold"
                    >
                      Leg Bye (1)
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleExtra('wide', 2)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm"
                    >
                      Wide + 1
                    </button>
                    <button
                      onClick={() => handleExtra('no-ball', 2)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm"
                    >
                      No Ball + 1
                    </button>
                    <button
                      onClick={() => handleExtra('bye', 4)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm"
                    >
                      Bye 4
                    </button>
                    <button
                      onClick={() => handleExtra('leg-bye', 4)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm"
                    >
                      Leg Bye 4
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Tip: Wide and No Ball do not count as legal deliveries
                  </p>
                </div>
              )}

              {/* Undo Button */}
              <button
                className="mt-4 w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Undo Last Ball
              </button>
            </div>
          </div>
        </div>

        {/* Complete Scoreboard & Stats Section */}
        <div className="container mx-auto px-4 pb-6">
          <button
            onClick={() => setShowFullScoreboard(!showFullScoreboard)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg mb-4 transition-all"
          >
            <BarChart3 className="w-6 h-6" />
            {showFullScoreboard ? 'Hide' : 'Show'} Full Scoreboard & Stats
            <ChevronDown className={`w-5 h-5 transition-transform ${showFullScoreboard ? 'rotate-180' : ''}`} />
          </button>

          {showFullScoreboard && (
            <div className="space-y-6">
              {/* Full Batting Scorecard */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Batting Scorecard</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="text-left p-3 font-bold text-gray-900 dark:text-white">Batsman</th>
                        <th className="text-center p-3 font-bold text-gray-900 dark:text-white">R</th>
                        <th className="text-center p-3 font-bold text-gray-900 dark:text-white">B</th>
                        <th className="text-center p-3 font-bold text-gray-900 dark:text-white">4s</th>
                        <th className="text-center p-3 font-bold text-gray-900 dark:text-white">6s</th>
                        <th className="text-center p-3 font-bold text-gray-900 dark:text-white">SR</th>
                        <th className="text-left p-3 font-bold text-gray-900 dark:text-white">Dismissal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {batsmen.map((batsman, idx) => (
                        <tr key={idx} className={!batsman.is_out ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">
                            {batsman.players?.name}
                            {batsman.player_id === striker?.player_id && <span className="ml-2 text-green-600">★</span>}
                          </td>
                          <td className="text-center p-3 font-bold text-gray-900 dark:text-white">{batsman.runs_scored}</td>
                          <td className="text-center p-3 text-gray-700 dark:text-gray-300">{batsman.balls_faced}</td>
                          <td className="text-center p-3 text-blue-600">{batsman.fours}</td>
                          <td className="text-center p-3 text-purple-600">{batsman.sixes}</td>
                          <td className="text-center p-3 text-gray-700 dark:text-gray-300">
                            {batsman.balls_faced > 0 ? ((batsman.runs_scored / batsman.balls_faced) * 100).toFixed(1) : '0.0'}
                          </td>
                          <td className="p-3 text-gray-700 dark:text-gray-300">
                            {batsman.is_out ? batsman.dismissal_type : 'not out'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 pt-4 border-t dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Extras</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{innings?.extras_total || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      (w{innings?.extras_wides || 0} nb{innings?.extras_noballs || 0} b{innings?.extras_byes || 0} lb{innings?.extras_legbyes || 0})
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {innings?.total_runs}/{innings?.total_wickets}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      ({formatOvers(innings?.total_balls || 0)} overs)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Run Rate</div>
                    <div className="text-2xl font-bold text-green-600">
                      {innings?.total_balls > 0 ? ((innings?.total_runs / innings?.total_balls) * 6).toFixed(2) : '0.00'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Projected Score</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {innings?.total_balls > 0 && match?.overs_per_innings
                        ? Math.round((innings.total_runs / innings.total_balls) * 6 * match.overs_per_innings)
                        : '0'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bowling Scorecard */}
              {allBowlingPerformances.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Bowling Scorecard</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="text-left p-3 font-bold text-gray-900 dark:text-white">Bowler</th>
                          <th className="text-center p-3 font-bold text-gray-900 dark:text-white">O</th>
                          <th className="text-center p-3 font-bold text-gray-900 dark:text-white">M</th>
                          <th className="text-center p-3 font-bold text-gray-900 dark:text-white">R</th>
                          <th className="text-center p-3 font-bold text-gray-900 dark:text-white">W</th>
                          <th className="text-center p-3 font-bold text-gray-900 dark:text-white">Econ</th>
                          <th className="text-center p-3 font-bold text-gray-900 dark:text-white">Dots</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {allBowlingPerformances.map((bowlingPerf, idx) => {
                          const overs = Math.floor(bowlingPerf.balls_bowled / 6)
                          const balls = bowlingPerf.balls_bowled % 6
                          const economy = bowlingPerf.balls_bowled > 0
                            ? ((bowlingPerf.runs_conceded / bowlingPerf.balls_bowled) * 6).toFixed(2)
                            : '0.00'
                          const isCurrent = bowler?.id === bowlingPerf.player_id

                          return (
                            <tr key={idx} className={isCurrent ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                              <td className="p-3 font-semibold text-gray-900 dark:text-white">
                                {bowlingPerf.players?.name}
                                {isCurrent && <span className="ml-2 text-red-600">🎯</span>}
                              </td>
                              <td className="text-center p-3 font-bold text-gray-900 dark:text-white">
                                {overs}.{balls}
                              </td>
                              <td className="text-center p-3 text-gray-700 dark:text-gray-300">
                                {bowlingPerf.maidens || 0}
                              </td>
                              <td className="text-center p-3 text-gray-700 dark:text-gray-300">
                                {bowlingPerf.runs_conceded}
                              </td>
                              <td className="text-center p-3 font-bold text-red-600">
                                {bowlingPerf.wickets_taken}
                              </td>
                              <td className="text-center p-3 text-gray-700 dark:text-gray-300">
                                {economy}
                              </td>
                              <td className="text-center p-3 text-gray-700 dark:text-gray-300">
                                {bowlingPerf.dots || 0}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 pt-4 border-t dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Wickets</div>
                      <div className="text-2xl font-bold text-red-600">
                        {allBowlingPerformances.reduce((sum, b) => sum + (b.wickets_taken || 0), 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bowlers Used</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {allBowlingPerformances.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Dot Ball %</div>
                      <div className="text-2xl font-bold text-green-600">
                        {innings?.total_balls > 0
                          ? ((allBowlingPerformances.reduce((sum, b) => sum + (b.dots || 0), 0) / innings.total_balls) * 100).toFixed(1)
                          : '0.0'}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Best Bowling</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {allBowlingPerformances.length > 0
                          ? `${allBowlingPerformances[0].wickets_taken}/${allBowlingPerformances[0].runs_conceded}`
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Worm Graph - Runs per Over */}
              {overByOverData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Worm Graph - Runs Per Over</h3>
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                      <div className="flex items-end gap-1 h-64">
                        {overByOverData.map((over, idx) => {
                          const maxRuns = Math.max(...overByOverData.map(o => o.runs), 20)
                          const height = (over.runs / maxRuns) * 100

                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                              <div
                                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all relative group"
                                style={{ height: `${height}%`, minHeight: '20px' }}
                              >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                                  {over.runs} runs{over.wickets > 0 ? `, ${over.wickets}W` : ''}
                                </div>
                              </div>
                              <div className="text-xs font-bold mt-2 text-gray-900 dark:text-white">{over.runs}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Ov {over.over + 1}</div>
                              {over.wickets > 0 && (
                                <div className="text-xs text-red-600 font-bold">{over.wickets}W</div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t dark:border-gray-700">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Highest Scoring Over</div>
                      <div className="text-lg font-bold text-green-600">
                        {Math.max(...overByOverData.map(o => o.runs))} runs
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Lowest Scoring Over</div>
                      <div className="text-lg font-bold text-blue-600">
                        {Math.min(...overByOverData.map(o => o.runs))} runs
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Boundaries</div>
                      <div className="text-lg font-bold text-purple-600">
                        {batsmen.reduce((sum, b) => sum + b.fours + b.sixes, 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Boundary %</div>
                      <div className="text-lg font-bold text-orange-600">
                        {innings?.total_runs > 0
                          ? ((batsmen.reduce((sum, b) => sum + (b.fours * 4) + (b.sixes * 6), 0) / innings.total_runs) * 100).toFixed(1)
                          : '0.0'}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Manhattan Graph - Cumulative Runs */}
              {overByOverData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Manhattan - Run Progression</h3>
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                      <div className="flex items-end gap-1 h-64 border-l-2 border-b-2 border-gray-300 dark:border-gray-600 pl-2 pb-2">
                        {overByOverData.map((over, idx) => {
                          const cumulative = overByOverData.slice(0, idx + 1).reduce((sum, o) => sum + o.runs, 0)
                          const maxCumulative = overByOverData.reduce((sum, o) => sum + o.runs, 0)
                          const height = maxCumulative > 0 ? (cumulative / maxCumulative) * 100 : 0

                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                              <div className="w-full relative">
                                <div
                                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t hover:from-purple-600 hover:to-purple-500 transition-all group"
                                  style={{ height: `${Math.max(height, 5)}%`, maxHeight: '256px' }}
                                >
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                                    {cumulative} total runs
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                                {over.over + 1}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Batsman Selector Modal */}
      {showBatsmanSelector && innings && (
        <BatsmanSelectorModal
          batsmen={batsmen.filter(b => !b.is_out)}
          allPlayers={allBattingPlayers}
          inningsId={innings.id}
          type={showBatsmanSelector}
          currentStriker={striker}
          currentNonStriker={nonStriker}
          onClose={() => setShowBatsmanSelector(null)}
          onSelect={async (selected) => {
            if (showBatsmanSelector === 'striker') {
              setStriker(selected)
            } else {
              setNonStriker(selected)
            }
            setShowBatsmanSelector(null)
            // Refresh data to get updated batting performances
            await fetchMatchData()
          }}
        />
      )}

      {/* Bowler Selector Modal */}
      {showBowlerSelector && (
        <BowlerSelectorModal
          bowlers={bowlers}
          currentBowler={bowler}
          onClose={() => setShowBowlerSelector(false)}
          onSelect={(selected) => {
            setBowler(selected)
            setShowBowlerSelector(false)
          }}
        />
      )}

      {/* Retired Hurt Modal */}
      {showRetiredHurt && (
        <RetiredHurtModal
          batsmen={batsmen.filter(b => !b.is_out)}
          currentStriker={striker}
          currentNonStriker={nonStriker}
          onClose={() => setShowRetiredHurt(false)}
          onConfirm={async (selectedBatsman) => {
            if (!selectedBatsman || !innings) return

            // Mark batsman as retired hurt
            await supabase
              .from('batting_performances')
              .update({
                is_out: true,
                dismissal_type: 'retired-hurt'
              })
              .eq('id', selectedBatsman.id)

            setShowRetiredHurt(false)
            fetchMatchData()

            // If retired batsman was striker or non-striker, need to select replacement
            if (selectedBatsman.player_id === striker?.player_id) {
              setStriker(null)
              setShowBatsmanSelector('striker')
            } else if (selectedBatsman.player_id === nonStriker?.player_id) {
              setNonStriker(null)
              setShowBatsmanSelector('nonStriker')
            }
          }}
        />
      )}

      {/* Wicket Modal */}
      {showWicket && (
        <WicketModal
          striker={striker}
          onClose={() => setShowWicket(false)}
          onConfirm={async (dismissalType: string) => {
            if (!striker || !innings) return

            await recordBall({
              inningsId: innings.id,
              overNumber,
              ballNumber,
              batsmanId: striker.player_id,
              nonStrikerId: nonStriker.player_id,
              bowlerId: bowler.id,
              runsScored: 0,
              isFour: false,
              isSix: false,
              extrasRuns: 0,
              isWicket: true,
              dismissalType,
              dismissedBatsmanId: striker.player_id,
            })

            if (ballNumber === 6) {
              setOverNumber(overNumber + 1)
              setBallNumber(1)
            } else {
              setBallNumber(ballNumber + 1)
            }

            setShowWicket(false)
            fetchMatchData()

            // Select next batsman
            const nextBatsman = batsmen.find(b => !b.is_out && b.player_id !== striker.player_id && b.player_id !== nonStriker.player_id)
            if (nextBatsman) {
              setStriker(nextBatsman)
            }
          }}
        />
      )}
    </div>
  )
}

function BatsmanSelectorModal({ batsmen, allPlayers, inningsId, type, currentStriker, currentNonStriker, onClose, onSelect }: any) {
  const [creating, setCreating] = useState(false)

  // Merge existing batting performances with all available players
  const availableBatsmen = allPlayers.map((player: any) => {
    const existingPerformance = batsmen.find((b: any) => b.player_id === player.id)
    if (existingPerformance) {
      return existingPerformance
    }
    // Create placeholder for new batsman
    return {
      player_id: player.id,
      players: player,
      runs_scored: 0,
      balls_faced: 0,
      fours: 0,
      sixes: 0,
      is_out: false,
      isNew: true // Flag to indicate this needs to be created
    }
  }).filter((b: any) => !b.is_out) // Only show not-out batsmen

  const handleSelect = async (batsman: any) => {
    setCreating(true)

    try {
      // If this is a new batsman (not in batting_performances yet), create the record
      if (batsman.isNew) {
        const nextPosition = batsmen.length + 1

        const { data: newPerformance, error } = await supabase
          .from('batting_performances')
          .insert({
            innings_id: inningsId,
            player_id: batsman.player_id,
            batting_position: nextPosition,
            runs_scored: 0,
            balls_faced: 0,
            fours: 0,
            sixes: 0,
            is_out: false,
            dismissal_type: null // Don't set dismissal_type for new batsman
          })
          .select('*, players:player_id(*)')
          .single()

        if (error) {
          console.error('Error creating batting performance:', error)
          alert(`Failed to add batsman: ${error.message}`)
          setCreating(false)
          return
        }

        onSelect(newPerformance)
      } else {
        onSelect(batsman)
      }
    } catch (err: any) {
      console.error('Unexpected error:', err)
      alert(`Error: ${err.message}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Select {type === 'striker' ? 'Striker' : 'Non-Striker'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={creating}
            >
              <X className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Choose the batsman currently at the {type === 'striker' ? "striker's" : "non-striker's"} end
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {availableBatsmen.map((batsman: any) => {
              const isCurrentStriker = currentStriker?.player_id === batsman.player_id
              const isCurrentNonStriker = currentNonStriker?.player_id === batsman.player_id
              const isOtherEnd = type === 'striker' ? isCurrentNonStriker : isCurrentStriker

              return (
                <button
                  key={batsman.player_id}
                  onClick={() => !isOtherEnd && handleSelect(batsman)}
                  disabled={isOtherEnd || creating}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    isOtherEnd
                      ? 'bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                      : isCurrentStriker && type === 'striker'
                      ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                      : isCurrentNonStriker && type === 'nonStriker'
                      ? 'bg-gray-200 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-500'
                      : 'bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                  } ${creating ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {batsman.players?.name}
                        {batsman.isNew && (
                          <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">NEW</span>
                        )}
                      </div>
                      {!batsman.isNew && (
                        <>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {batsman.runs_scored} ({batsman.balls_faced}) • {batsman.fours}×4, {batsman.sixes}×6
                          </div>
                          {batsman.balls_faced > 0 && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Strike Rate: {((batsman.runs_scored / batsman.balls_faced) * 100).toFixed(1)}
                            </div>
                          )}
                        </>
                      )}
                      {batsman.isNew && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Tap to add to batting order
                        </div>
                      )}
                    </div>
                    {isCurrentStriker && (
                      <span className="ml-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                        ★ STRIKER
                      </span>
                    )}
                    {isCurrentNonStriker && (
                      <span className="ml-3 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">
                        NON-STRIKER
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {availableBatsmen.length === 0 && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <p>No batsmen available</p>
              <p className="text-sm mt-2">All batsmen are out</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={onClose}
            disabled={creating}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
          >
            {creating ? 'Adding batsman...' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}

function BowlerSelectorModal({ bowlers, currentBowler, onClose, onSelect }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Bowler</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Choose the bowler for this over
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {bowlers.map((bowler: any) => {
              const isCurrent = currentBowler?.id === bowler.id

              return (
                <button
                  key={bowler.id}
                  onClick={() => onSelect(bowler)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    isCurrent
                      ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                      : 'bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{bowler.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{bowler.bowling_style}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {bowler.role}
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="ml-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        🎯 CURRENT
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {bowlers.length === 0 && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <p>No bowlers available</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-gray-900 dark:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function RetiredHurtModal({ batsmen, currentStriker, currentNonStriker, onClose, onConfirm }: any) {
  const [selectedBatsman, setSelectedBatsman] = useState<any>(null)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">Retired Hurt</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Select the batsman who is retiring due to injury
        </p>

        <div className="mb-6 space-y-2">
          {batsmen.map((batsman: any) => (
            <button
              key={batsman.player_id}
              onClick={() => setSelectedBatsman(batsman)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedBatsman?.player_id === batsman.player_id
                  ? 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500'
                  : 'bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-orange-300'
              }`}
            >
              <div className="font-bold text-gray-900 dark:text-white">{batsman.players?.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {batsman.runs_scored} ({batsman.balls_faced})
                {batsman.player_id === currentStriker?.player_id && (
                  <span className="ml-2 text-green-600">★ Striker</span>
                )}
                {batsman.player_id === currentNonStriker?.player_id && (
                  <span className="ml-2 text-gray-600">Non-Striker</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 bg-blue-50 dark:bg-blue-900/30 p-3 rounded">
          Note: Retired hurt does not count as a wicket. The batsman can return to bat later if recovered.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedBatsman && onConfirm(selectedBatsman)}
            disabled={!selectedBatsman}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Retirement
          </button>
        </div>
      </div>
    </div>
  )
}

function WicketModal({ striker, onClose, onConfirm }: any) {
  const [dismissalType, setDismissalType] = useState('caught')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Wicket!</h2>
        <p className="mb-4 text-gray-900 dark:text-white">
          <span className="font-bold">{striker?.players?.name}</span> is out
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dismissal Type
          </label>
          <select
            value={dismissalType}
            onChange={(e) => setDismissalType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <optgroup label="Common">
              <option value="caught">Caught</option>
              <option value="bowled">Bowled</option>
              <option value="lbw">LBW (Leg Before Wicket)</option>
              <option value="run-out">Run Out</option>
              <option value="stumped">Stumped</option>
            </optgroup>
            <optgroup label="Other">
              <option value="hit-wicket">Hit Wicket</option>
              <option value="caught-and-bowled">Caught and Bowled</option>
              <option value="handled-ball">Handled the Ball</option>
              <option value="obstructing-field">Obstructing the Field</option>
              <option value="hit-ball-twice">Hit the Ball Twice</option>
              <option value="timed-out">Timed Out</option>
              <option value="mankad">Mankaded (Run Out Non-Striker)</option>
            </optgroup>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(dismissalType)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Confirm Wicket
          </button>
        </div>
      </div>
    </div>
  )
}
