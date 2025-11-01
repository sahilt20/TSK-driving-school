'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, TrendingUp, Award, Target } from 'lucide-react'
import Link from 'next/link'
import { calculateStrikeRate, calculateEconomyRate, calculateRunRate } from '@/lib/scoring/calculations'

export default function MatchAnalyticsPage() {
  const params = useParams()
  const matchId = params.id as string

  const [match, setMatch] = useState<any>(null)
  const [innings, setInnings] = useState<any[]>([])
  const [batting, setBatting] = useState<any[]>([])
  const [bowling, setBowling] = useState<any[]>([])
  const [partnerships, setPartnerships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [matchId])

  async function fetchAnalytics() {
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

    // Fetch all innings
    const { data: inningsData } = await supabase
      .from('innings')
      .select('*')
      .eq('match_id', matchId)
      .order('innings_number')

    if (inningsData) {
      setInnings(inningsData)

      // Fetch batting performances for all innings
      const inningsIds = inningsData.map(i => i.id)
      const { data: battingData } = await supabase
        .from('batting_performances')
        .select('*, players(*), innings(*)')
        .in('innings_id', inningsIds)
        .order('runs_scored', { ascending: false })

      if (battingData) {
        setBatting(battingData)
      }

      // Fetch bowling performances
      const { data: bowlingData } = await supabase
        .from('bowling_performances')
        .select('*, players(*), innings(*)')
        .in('innings_id', inningsIds)
        .order('wickets_taken', { ascending: false })

      if (bowlingData) {
        setBowling(bowlingData)
      }

      // Fetch partnerships
      const { data: partnershipsData } = await supabase
        .from('partnerships')
        .select('*, batsman1:players!partnerships_batsman1_id_fkey(*), batsman2:players!partnerships_batsman2_id_fkey(*)')
        .in('innings_id', inningsIds)
        .order('runs_scored', { ascending: false })

      if (partnershipsData) {
        setPartnerships(partnershipsData)
      }
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const getTopScorer = () => {
    return batting.reduce((prev, current) =>
      (current.runs_scored > prev.runs_scored) ? current : prev, batting[0])
  }

  const getTopBowler = () => {
    const bowlersWithWickets = bowling.filter(b => b.wickets_taken > 0)
    if (bowlersWithWickets.length === 0) return null
    return bowlersWithWickets.reduce((prev, current) =>
      (current.wickets_taken > prev.wickets_taken) ? current : prev, bowlersWithWickets[0])
  }

  const topScorer = batting.length > 0 ? getTopScorer() : null
  const topBowler = getTopBowler()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/matches"
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Match Analytics</h1>
              <p className="text-blue-100">
                {match?.team_a?.name} vs {match?.team_b?.name}
              </p>
            </div>
          </div>

          {match?.result_summary && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg font-semibold">{match.result_summary}</p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Top Scorer */}
          {topScorer && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Top Scorer</p>
                  <p className="text-xl font-bold">{topScorer.players?.name}</p>
                </div>
              </div>
              <div className="text-3xl font-black text-yellow-600 mb-2">
                {topScorer.runs_scored}
              </div>
              <p className="text-sm text-gray-600">
                {topScorer.balls_faced} balls • SR: {calculateStrikeRate(topScorer.runs_scored, topScorer.balls_faced)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {topScorer.fours} fours • {topScorer.sixes} sixes
              </p>
            </div>
          )}

          {/* Top Bowler */}
          {topBowler && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Best Bowler</p>
                  <p className="text-xl font-bold">{topBowler.players?.name}</p>
                </div>
              </div>
              <div className="text-3xl font-black text-red-600 mb-2">
                {topBowler.wickets_taken}/{topBowler.runs_conceded}
              </div>
              <p className="text-sm text-gray-600">
                {(topBowler.balls_bowled / 6).toFixed(1)} overs • Econ: {calculateEconomyRate(topBowler.runs_conceded, topBowler.balls_bowled).toFixed(2)}
              </p>
            </div>
          )}

          {/* Match Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Match Type</p>
                <p className="text-xl font-bold">{match?.match_type}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Venue:</span>
                <span className="font-semibold">{match?.venue || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">
                  {match?.match_date ? new Date(match.match_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Innings Scorecard */}
        {innings.map((inning, idx) => (
          <div key={inning.id} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Innings {inning.innings_number} - {inning.total_runs}/{inning.total_wickets}
              <span className="text-sm font-normal text-gray-600 ml-3">
                ({(inning.total_balls / 6).toFixed(1)} overs)
              </span>
            </h2>

            {/* Batting Card */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Batting</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Batsman</th>
                      <th className="px-4 py-2 text-center">R</th>
                      <th className="px-4 py-2 text-center">B</th>
                      <th className="px-4 py-2 text-center">4s</th>
                      <th className="px-4 py-2 text-center">6s</th>
                      <th className="px-4 py-2 text-center">SR</th>
                      <th className="px-4 py-2 text-left">Dismissal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {batting
                      .filter(b => b.innings_id === inning.id)
                      .sort((a, b) => a.batting_position - b.batting_position)
                      .map(perf => (
                        <tr key={perf.id} className={!perf.is_out ? 'bg-green-50' : ''}>
                          <td className="px-4 py-3 font-semibold">
                            {perf.players?.name}
                            {!perf.is_out && <span className="text-green-600 ml-2">*</span>}
                          </td>
                          <td className="px-4 py-3 text-center font-bold">{perf.runs_scored}</td>
                          <td className="px-4 py-3 text-center">{perf.balls_faced}</td>
                          <td className="px-4 py-3 text-center">{perf.fours}</td>
                          <td className="px-4 py-3 text-center">{perf.sixes}</td>
                          <td className="px-4 py-3 text-center">
                            {calculateStrikeRate(perf.runs_scored, perf.balls_faced)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {perf.is_out ? perf.dismissal_type : 'not out'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="bg-gray-100 font-semibold">
                    <tr>
                      <td className="px-4 py-3">Extras</td>
                      <td className="px-4 py-3 text-center">{inning.extras_total}</td>
                      <td colSpan={5} className="px-4 py-3 text-sm text-gray-600">
                        (b {inning.extras_byes}, lb {inning.extras_leg_byes}, w {inning.extras_wides}, nb {inning.extras_no_balls})
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Total</td>
                      <td className="px-4 py-3 text-center text-lg">{inning.total_runs}/{inning.total_wickets}</td>
                      <td colSpan={5} className="px-4 py-3">
                        ({(inning.total_balls / 6).toFixed(1)} overs, RR: {calculateRunRate(inning.total_runs, inning.total_balls / 6)})
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Bowling Card */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Bowling</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Bowler</th>
                      <th className="px-4 py-2 text-center">O</th>
                      <th className="px-4 py-2 text-center">M</th>
                      <th className="px-4 py-2 text-center">R</th>
                      <th className="px-4 py-2 text-center">W</th>
                      <th className="px-4 py-2 text-center">Econ</th>
                      <th className="px-4 py-2 text-center">WD</th>
                      <th className="px-4 py-2 text-center">NB</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {bowling
                      .filter(b => b.innings_id === inning.id)
                      .map(perf => (
                        <tr key={perf.id}>
                          <td className="px-4 py-3 font-semibold">{perf.players?.name}</td>
                          <td className="px-4 py-3 text-center">{(perf.balls_bowled / 6).toFixed(1)}</td>
                          <td className="px-4 py-3 text-center">{perf.maidens || 0}</td>
                          <td className="px-4 py-3 text-center font-bold">{perf.runs_conceded}</td>
                          <td className="px-4 py-3 text-center font-bold text-red-600">{perf.wickets_taken}</td>
                          <td className="px-4 py-3 text-center">
                            {calculateEconomyRate(perf.runs_conceded, perf.balls_bowled).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">{perf.wides || 0}</td>
                          <td className="px-4 py-3 text-center">{perf.no_balls || 0}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        {/* Partnerships */}
        {partnerships.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Key Partnerships</h2>
            <div className="space-y-3">
              {partnerships.slice(0, 5).map((partnership, idx) => (
                <div key={partnership.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        {partnership.batsman1?.name} & {partnership.batsman2?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Wicket {partnership.wicket_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{partnership.runs_scored}</p>
                      <p className="text-sm text-gray-600">runs ({partnership.balls_faced} balls)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
