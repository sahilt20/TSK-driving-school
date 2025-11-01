'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, Play, Calendar, Trophy } from 'lucide-react'

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateMatch, setShowCreateMatch] = useState(false)
  const [showCreateTeam, setShowCreateTeam] = useState(false)

  useEffect(() => {
    fetchMatches()
    fetchTeams()
  }, [])

  async function fetchMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(id, name, short_name),
        team_b:teams!matches_team_b_id_fkey(id, name, short_name)
      `)
      .order('match_date', { ascending: false })

    if (!error && data) {
      setMatches(data)
    }
    setLoading(false)
  }

  async function fetchTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name')

    if (!error && data) {
      setTeams(data)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500 text-white animate-pulse'
      case 'upcoming': return 'bg-blue-500 text-white'
      case 'completed': return 'bg-gray-500 text-white'
      default: return 'bg-gray-300 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Matches</h1>
              <p className="text-gray-600 mt-1">Manage your cricket matches and teams</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateTeam(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Team
              </button>
              <button
                onClick={() => setShowCreateMatch(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Match
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Teams Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            Teams ({teams.length})
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}/players`}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow block"
              >
                <h3 className="font-bold text-lg">{team.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{team.short_name}</p>
                <p className="text-xs text-blue-600 hover:underline">Manage Players →</p>
              </Link>
            ))}
            {teams.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No teams yet. Create your first team to get started!
              </div>
            )}
          </div>
        </div>

        {/* Matches Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Matches ({matches.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <div key={match.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(match.match_status)}`}>
                        {match.match_status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">{match.match_type}</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="font-bold text-lg">{match.team_a?.name || 'Team A'}</div>
                      <div className="text-gray-400 text-sm text-center">vs</div>
                      <div className="font-bold text-lg">{match.team_b?.name || 'Team B'}</div>
                    </div>

                    {match.venue && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Venue:</span> {match.venue}
                      </p>
                    )}

                    {match.match_date && (
                      <p className="text-sm text-gray-600 mb-4">
                        <span className="font-semibold">Date:</span> {new Date(match.match_date).toLocaleDateString()}
                      </p>
                    )}

                    {match.match_status === 'live' && (
                      <Link
                        href={`/matches/${match.id}/score`}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold"
                      >
                        <Play className="w-5 h-5" />
                        Score Match
                      </Link>
                    )}

                    {match.match_status === 'upcoming' && (
                      <Link
                        href={`/matches/${match.id}/start`}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold"
                      >
                        Start Match
                      </Link>
                    )}

                    {match.match_status === 'completed' && match.result_summary && (
                      <div className="bg-gray-100 p-3 rounded text-sm text-gray-700">
                        <strong>Result:</strong> {match.result_summary}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {matches.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-500 mb-4">No matches yet. Create your first match!</p>
                  <button
                    onClick={() => setShowCreateMatch(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Match
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateTeam && (
        <CreateTeamModal
          onClose={() => {
            setShowCreateTeam(false)
            fetchTeams()
          }}
        />
      )}

      {/* Create Match Modal */}
      {showCreateMatch && (
        <CreateMatchModal
          teams={teams}
          onClose={() => {
            setShowCreateMatch(false)
            fetchMatches()
          }}
        />
      )}
    </div>
  )
}

function CreateTeamModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: supabaseError } = await supabase
        .from('teams')
        .insert({ name, short_name: shortName })

      if (supabaseError) {
        if (supabaseError.message.includes('Failed to fetch') || supabaseError.message.includes('fetch')) {
          setError('Unable to connect to database. Please ensure Supabase is configured in .env.local')
        } else {
          setError(supabaseError.message)
        }
        setLoading(false)
      } else {
        onClose()
      }
    } catch (err) {
      setError('Failed to create team. Please check your Supabase configuration.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Create New Team</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="e.g., Mumbai Indians"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Short Name
            </label>
            <input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 bg-white uppercase"
              placeholder="e.g., MI"
              maxLength={5}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Max 5 characters</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CreateMatchModal({ teams, onClose }: { teams: any[], onClose: () => void }) {
  const [teamAId, setTeamAId] = useState('')
  const [teamBId, setTeamBId] = useState('')
  const [matchType, setMatchType] = useState('T20')
  const [venue, setVenue] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (teamAId === teamBId) {
      setError('Team A and Team B must be different teams')
      setLoading(false)
      return
    }

    const oversPerInnings = matchType === 'T20' ? 20 : matchType === 'ODI' ? 50 : 90

    try {
      const { error: supabaseError } = await supabase
        .from('matches')
        .insert({
          team_a_id: teamAId,
          team_b_id: teamBId,
          match_type: matchType,
          venue,
          match_date: matchDate,
          overs_per_innings: oversPerInnings,
          match_status: 'upcoming'
        })

      if (supabaseError) {
        if (supabaseError.message.includes('Failed to fetch') || supabaseError.message.includes('fetch')) {
          setError('Unable to connect to database. Please ensure Supabase is configured in .env.local')
        } else {
          setError(supabaseError.message)
        }
        setLoading(false)
      } else {
        onClose()
      }
    } catch (err) {
      setError('Failed to create match. Please check your Supabase configuration.')
      setLoading(false)
    }
  }

  if (teams.length < 2) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Create New Match</h2>
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              You need at least 2 teams to create a match. Please create teams first.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Create New Match</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Team A
            </label>
            <select
              value={teamAId}
              onChange={(e) => setTeamAId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              required
            >
              <option value="" className="text-gray-400">Select Team A</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id} className="text-gray-900">{team.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Team B
            </label>
            <select
              value={teamBId}
              onChange={(e) => setTeamBId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              required
            >
              <option value="" className="text-gray-400">Select Team B</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id} className="text-gray-900" disabled={team.id === teamAId}>
                  {team.name} {team.id === teamAId ? '(Selected as Team A)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Match Type
            </label>
            <select
              value={matchType}
              onChange={(e) => setMatchType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="T20" className="text-gray-900">T20 (20 overs)</option>
              <option value="ODI" className="text-gray-900">ODI (50 overs)</option>
              <option value="TEST" className="text-gray-900">Test Match</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Venue
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="e.g., Wankhede Stadium"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Match Date
            </label>
            <input
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
            >
              {loading ? 'Creating...' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
