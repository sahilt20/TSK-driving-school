'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { recordBall } from '@/lib/scoring/ballScoring'
import { formatOvers } from '@/lib/scoring/calculations'
import { RotateCcw, Users, ChevronDown } from 'lucide-react'

export default function ScoringPage() {
  const params = useParams()
  const matchId = params.id as string

  const [match, setMatch] = useState<any>(null)
  const [innings, setInnings] = useState<any>(null)
  const [batsmen, setBatsmen] = useState<any[]>([])
  const [bowlers, setBowlers] = useState<any[]>([])
  const [striker, setStriker] = useState<any>(null)
  const [nonStriker, setNonStriker] = useState<any>(null)
  const [bowler, setBowler] = useState<any>(null)
  const [currentOver, setCurrentOver] = useState<any[]>([])
  const [ballNumber, setBallNumber] = useState(1)
  const [overNumber, setOverNumber] = useState(0)
  const [showExtras, setShowExtras] = useState(false)
  const [showWicket, setShowWicket] = useState(false)

  useEffect(() => {
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
          .select('*, players(*)')
          .eq('innings_id', innings.id)
          .eq('is_out', false)

        if (battingData && battingData.length >= 2) {
          setStriker(battingData[0])
          setNonStriker(battingData[1])
        }

        // Fetch all batsmen
        const { data: allBatsmenData } = await supabase
          .from('batting_performances')
          .select('*, players(*)')
          .eq('innings_id', innings.id)
          .order('batting_position')

        if (allBatsmenData) {
          setBatsmen(allBatsmenData as any)
        }

        // Fetch bowlers
        const { data: playersData } = await supabase
          .from('players')
          .select('*')
          .eq('team_id', innings.bowling_team_id)

        if (playersData) {
          setBowlers(playersData as any)
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
        fetchMatchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  async function handleBallScore(runs: number, isFour = false, isSix = false) {
    if (!striker || !nonStriker || !bowler || !innings) {
      alert('Please select batsmen and bowler first')
      return
    }

    const result = await recordBall({
      inningsId: innings.id,
      overNumber,
      ballNumber,
      batsmanId: striker.player_id,
      nonStrikerId: nonStriker.player_id,
      bowlerId: bowler.id,
      runsScored: runs,
      isFour,
      isSix,
      extrasRuns: 0,
      isWicket: false,
    })

    if (result.success) {
      // Swap batsmen if odd runs
      if (runs % 2 === 1) {
        const temp = striker
        setStriker(nonStriker)
        setNonStriker(temp)
      }

      // Move to next ball
      if (ballNumber === 6) {
        setOverNumber(overNumber + 1)
        setBallNumber(1)
        // Swap striker for new over
        const temp = striker
        setStriker(nonStriker)
        setNonStriker(temp)
      } else {
        setBallNumber(ballNumber + 1)
      }

      fetchMatchData()
    }
  }

  async function handleExtra(type: 'wide' | 'no-ball' | 'bye' | 'leg-bye', runs: number = 1) {
    if (!striker || !nonStriker || !bowler || !innings) return

    const result = await recordBall({
      inningsId: innings.id,
      overNumber,
      ballNumber,
      batsmanId: striker.player_id,
      nonStrikerId: nonStriker.player_id,
      bowlerId: bowler.id,
      runsScored: 0,
      isFour: false,
      isSix: false,
      extrasType: type,
      extrasRuns: runs,
      isWicket: false,
    })

    if (result.success) {
      // Wide and No-ball don't increment ball number
      if (type !== 'wide' && type !== 'no-ball' && ballNumber === 6) {
        setOverNumber(overNumber + 1)
        setBallNumber(1)
      } else if (type !== 'wide' && type !== 'no-ball') {
        setBallNumber(ballNumber + 1)
      }

      setShowExtras(false)
      fetchMatchData()
    }
  }

  async function handleWicket() {
    setShowWicket(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Score Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-6">
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
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Batsmen */}
          <div className="lg:col-span-2">
            {/* Batsmen Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Current Batsmen
              </h2>
              <div className="space-y-4">
                {/* Striker */}
                <div className={`p-4 rounded-lg ${striker ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">★ STRIKER</span>
                    <select
                      value={striker?.player_id || ''}
                      onChange={(e) => {
                        const selected = batsmen.find(b => b.player_id === e.target.value)
                        setStriker(selected)
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select Striker</option>
                      {batsmen.filter(b => !b.is_out).map((b) => (
                        <option key={b.player_id} value={b.player_id}>
                          {b.players?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {striker && (
                    <div className="text-2xl font-bold">
                      {striker.runs_scored} ({striker.balls_faced})
                      <span className="text-sm font-normal text-gray-600 ml-3">
                        {striker.fours}×4, {striker.sixes}×6
                      </span>
                    </div>
                  )}
                </div>

                {/* Non-Striker */}
                <div className={`p-4 rounded-lg ${nonStriker ? 'bg-gray-50 border-2 border-gray-300' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">NON-STRIKER</span>
                    <select
                      value={nonStriker?.player_id || ''}
                      onChange={(e) => {
                        const selected = batsmen.find(b => b.player_id === e.target.value)
                        setNonStriker(selected)
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select Non-Striker</option>
                      {batsmen.filter(b => !b.is_out).map((b) => (
                        <option key={b.player_id} value={b.player_id}>
                          {b.players?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {nonStriker && (
                    <div className="text-2xl font-bold">
                      {nonStriker.runs_scored} ({nonStriker.balls_faced})
                      <span className="text-sm font-normal text-gray-600 ml-3">
                        {nonStriker.fours}×4, {nonStriker.sixes}×6
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  const temp = striker
                  setStriker(nonStriker)
                  setNonStriker(temp)
                }}
                className="mt-4 w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
              >
                Swap Batsmen
              </button>
            </div>

            {/* Bowler Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Current Bowler</h2>
              <select
                value={bowler?.id || ''}
                onChange={(e) => {
                  const selected = bowlers.find(b => b.id === e.target.value)
                  setBowler(selected)
                }}
                className="w-full px-3 py-2 border rounded-lg mb-4"
              >
                <option value="">Select Bowler</option>
                {bowlers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.bowling_style})
                  </option>
                ))}
              </select>
              {bowler && (
                <div className="text-lg">
                  <span className="font-bold">{bowler.name}</span>
                </div>
              )}
            </div>

            {/* Current Over */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="font-bold mb-3">This Over: {overNumber}.{ballNumber - 1}</h3>
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
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold mb-4 text-lg">Score Ball</h3>

              {/* Runs */}
              <div className="grid grid-cols-7 gap-3 mb-4">
                <button
                  onClick={() => handleBallScore(0)}
                  className="aspect-square bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                >
                  0
                </button>
                <button
                  onClick={() => handleBallScore(1)}
                  className="aspect-square bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                >
                  1
                </button>
                <button
                  onClick={() => handleBallScore(2)}
                  className="aspect-square bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                >
                  2
                </button>
                <button
                  onClick={() => handleBallScore(3)}
                  className="aspect-square bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                >
                  3
                </button>
                <button
                  onClick={() => handleBallScore(4, true)}
                  className="aspect-square bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-xl"
                >
                  4
                </button>
                <button
                  onClick={() => handleBallScore(5)}
                  className="aspect-square bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                >
                  5
                </button>
                <button
                  onClick={() => handleBallScore(6, false, true)}
                  className="aspect-square bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold text-xl"
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
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleExtra('wide')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold"
                    >
                      Wide
                    </button>
                    <button
                      onClick={() => handleExtra('no-ball')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold"
                    >
                      No Ball
                    </button>
                    <button
                      onClick={() => handleExtra('bye')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold"
                    >
                      Bye
                    </button>
                    <button
                      onClick={() => handleExtra('leg-bye')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold"
                    >
                      Leg Bye
                    </button>
                  </div>
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

          {/* Right Panel - Scorecard */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="font-bold text-lg mb-4">Scorecard</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {batsmen.map((batsman) => (
                  <div
                    key={batsman.player_id}
                    className={`p-3 rounded-lg ${
                      !batsman.is_out ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{batsman.players?.name}</div>
                    <div className="text-sm text-gray-600">
                      {batsman.runs_scored} ({batsman.balls_faced})
                      {batsman.is_out && (
                        <span className="text-red-600 ml-2">
                          {batsman.dismissal_type}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Extras: {innings?.extras_total || 0}
                  <div className="text-xs">
                    (w {innings?.extras_wides || 0}, nb {innings?.extras_no_balls || 0}, b {innings?.extras_byes || 0}, lb {innings?.extras_leg_byes || 0})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

function WicketModal({ striker, onClose, onConfirm }: any) {
  const [dismissalType, setDismissalType] = useState('caught')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Wicket!</h2>
        <p className="mb-4">
          <span className="font-bold">{striker?.players?.name}</span> is out
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dismissal Type
          </label>
          <select
            value={dismissalType}
            onChange={(e) => setDismissalType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="caught">Caught</option>
            <option value="bowled">Bowled</option>
            <option value="lbw">LBW</option>
            <option value="run-out">Run Out</option>
            <option value="stumped">Stumped</option>
            <option value="hit-wicket">Hit Wicket</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
