'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, TrendingUp, Award, Target, Users, Calendar, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { calculateStrikeRate, calculateEconomyRate } from '@/lib/scoring/calculations'

export default function GeneralAnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>({
    totalMatches: 0,
    completedMatches: 0,
    liveMatches: 0,
    upcomingMatches: 0,
    totalRuns: 0,
    totalWickets: 0,
    totalBalls: 0,
    topScorers: [],
    topBowlers: [],
    recentMatches: [],
    teams: []
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      // Fetch all matches
      const { data: matches } = await supabase
        .from('matches')
        .select(`
          *,
          team_a:teams!matches_team_a_id_fkey(*),
          team_b:teams!matches_team_b_id_fkey(*)
        `)
        .order('match_date', { ascending: false })

      const totalMatches = matches?.length || 0
      const completedMatches = matches?.filter(m => m.status === 'completed').length || 0
      const liveMatches = matches?.filter(m => m.status === 'live').length || 0
      const upcomingMatches = matches?.filter(m => m.status === 'scheduled').length || 0

      // Fetch all innings to calculate total stats
      const { data: innings } = await supabase
        .from('innings')
        .select('*')

      const totalRuns = innings?.reduce((sum, i) => sum + (i.total_runs || 0), 0) || 0
      const totalWickets = innings?.reduce((sum, i) => sum + (i.total_wickets || 0), 0) || 0
      const totalBalls = innings?.reduce((sum, i) => sum + (i.total_balls || 0), 0) || 0

      // Fetch top scorers (all time)
      const { data: topScorers } = await supabase
        .from('batting_performances')
        .select('*, players(*)')
        .order('runs_scored', { ascending: false })
        .limit(10)

      // Fetch top bowlers (all time)
      const { data: topBowlers } = await supabase
        .from('bowling_performances')
        .select('*, players(*)')
        .order('wickets_taken', { ascending: false })
        .limit(10)

      // Fetch all teams
      const { data: teams } = await supabase
        .from('teams')
        .select('*')

      setStats({
        totalMatches,
        completedMatches,
        liveMatches,
        upcomingMatches,
        totalRuns,
        totalWickets,
        totalBalls,
        topScorers: topScorers || [],
        topBowlers: topBowlers || [],
        recentMatches: matches?.slice(0, 5) || [],
        teams: teams || []
      })

      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Cricket Analytics Dashboard</h1>
              <p className="text-blue-100">Overall statistics and performance metrics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm text-gray-600">Total Matches</div>
            </div>
            <div className="text-3xl font-black text-blue-600">{stats.totalMatches}</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-3xl font-black text-green-600">{stats.completedMatches}</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-sm text-gray-600">Live Now</div>
            </div>
            <div className="text-3xl font-black text-red-600">{stats.liveMatches}</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-sm text-gray-600">Teams</div>
            </div>
            <div className="text-3xl font-black text-yellow-600">{stats.teams.length}</div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-3 opacity-90">Total Runs Scored</h3>
            <div className="text-4xl font-black mb-2">{stats.totalRuns.toLocaleString()}</div>
            <p className="text-sm opacity-75">Across all matches</p>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-3 opacity-90">Total Wickets</h3>
            <div className="text-4xl font-black mb-2">{stats.totalWickets.toLocaleString()}</div>
            <p className="text-sm opacity-75">Across all matches</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-3 opacity-90">Total Overs</h3>
            <div className="text-4xl font-black mb-2">{(stats.totalBalls / 6).toFixed(1)}</div>
            <p className="text-sm opacity-75">{stats.totalBalls} legal deliveries</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Scorers */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold">Top Scorers (All Time)</h2>
            </div>

            <div className="space-y-3">
              {stats.topScorers.slice(0, 5).map((scorer: any, idx: number) => (
                <div key={scorer.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">{scorer.players?.name}</div>
                    <div className="text-sm text-gray-600">
                      {scorer.balls_faced} balls • {scorer.fours} fours • {scorer.sixes} sixes
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-yellow-600">{scorer.runs_scored}</div>
                    <div className="text-xs text-gray-500">
                      SR: {calculateStrikeRate(scorer.runs_scored, scorer.balls_faced)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {stats.topScorers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No batting records yet</p>
                <p className="text-sm mt-2">Start scoring matches to see top scorers</p>
              </div>
            )}
          </div>

          {/* Top Bowlers */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold">Top Bowlers (All Time)</h2>
            </div>

            <div className="space-y-3">
              {stats.topBowlers.filter((b: any) => b.wickets_taken > 0).slice(0, 5).map((bowler: any, idx: number) => (
                <div key={bowler.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">{bowler.players?.name}</div>
                    <div className="text-sm text-gray-600">
                      {(bowler.balls_bowled / 6).toFixed(1)} overs • {bowler.runs_conceded} runs
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-red-600">{bowler.wickets_taken}</div>
                    <div className="text-xs text-gray-500">
                      Econ: {calculateEconomyRate(bowler.runs_conceded, bowler.balls_bowled).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {stats.topBowlers.filter((b: any) => b.wickets_taken > 0).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No bowling records yet</p>
                <p className="text-sm mt-2">Start scoring matches to see top bowlers</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Matches */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Recent Matches</h2>

          <div className="space-y-4">
            {stats.recentMatches.map((match: any) => (
              <div
                key={match.id}
                onClick={() => router.push(`/matches/${match.id}/analytics`)}
                className="border-l-4 border-blue-500 bg-gray-50 p-4 hover:bg-gray-100 transition-colors cursor-pointer rounded-r-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        match.status === 'live' ? 'bg-green-600 text-white animate-pulse' :
                        match.status === 'completed' ? 'bg-gray-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {match.status?.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">{match.match_type}</span>
                    </div>
                    <div className="font-bold text-lg">
                      {match.team_a?.name} vs {match.team_b?.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {match.venue} • {match.match_date ? new Date(match.match_date).toLocaleDateString() : 'Date TBD'}
                    </div>
                    {match.result_summary && (
                      <div className="text-sm text-green-700 font-semibold mt-2">
                        {match.result_summary}
                      </div>
                    )}
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {stats.recentMatches.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No matches found</p>
              <p className="text-sm mt-2">Create your first match to get started</p>
              <Link
                href="/matches"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Matches
              </Link>
            </div>
          )}
        </div>

        {/* Teams */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Teams</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.teams.map((team: any) => (
              <div
                key={team.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="font-bold text-lg mb-1">{team.name}</div>
                <div className="text-sm text-gray-600">{team.short_name}</div>
              </div>
            ))}
          </div>

          {stats.teams.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No teams created yet</p>
              <p className="text-sm mt-2">Create teams to start organizing matches</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
