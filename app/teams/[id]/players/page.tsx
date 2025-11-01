'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Plus, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function TeamPlayersPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = params.id as string

  const [team, setTeam] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddPlayer, setShowAddPlayer] = useState(false)

  useEffect(() => {
    fetchTeamAndPlayers()
  }, [teamId])

  async function fetchTeamAndPlayers() {
    // Fetch team
    const { data: teamData } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single()

    if (teamData) {
      setTeam(teamData)
    }

    // Fetch players
    const { data: playersData } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', teamId)
      .order('name')

    if (playersData) {
      setPlayers(playersData)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/matches"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{team?.name}</h1>
                <p className="text-gray-600 mt-1">Manage team players</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddPlayer(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Player
            </button>
          </div>
        </div>
      </div>

      {/* Players List */}
      <div className="container mx-auto px-4 py-8">
        {players.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No players yet</h2>
            <p className="text-gray-600 mb-6">Add players to your team to get started</p>
            <button
              onClick={() => setShowAddPlayer(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add First Player
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{player.name}</h3>
                    {player.jersey_number && (
                      <span className="text-sm text-gray-600">#{player.jersey_number}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Role:</span>
                    <span className="text-sm text-gray-600 capitalize">{player.role}</span>
                  </div>

                  {player.batting_style && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">Batting:</span>
                      <span className="text-sm text-gray-600 capitalize">{player.batting_style}</span>
                    </div>
                  )}

                  {player.bowling_style && player.bowling_style !== 'none' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">Bowling:</span>
                      <span className="text-sm text-gray-600 capitalize">{player.bowling_style}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Player Modal */}
      {showAddPlayer && (
        <AddPlayerModal
          teamId={teamId}
          onClose={() => {
            setShowAddPlayer(false)
            fetchTeamAndPlayers()
          }}
        />
      )}
    </div>
  )
}

function AddPlayerModal({ teamId, onClose }: { teamId: string, onClose: () => void }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('batsman')
  const [battingStyle, setBattingStyle] = useState('right-hand')
  const [bowlingStyle, setBowlingStyle] = useState('none')
  const [jerseyNumber, setJerseyNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: supabaseError } = await supabase
        .from('players')
        .insert({
          name,
          team_id: teamId,
          role,
          batting_style: battingStyle,
          bowling_style: bowlingStyle,
          jersey_number: jerseyNumber ? parseInt(jerseyNumber) : null,
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
      setError('Failed to add player. Please check your Supabase configuration.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Add New Player</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Player Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="e.g., Virat Kohli"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            >
              <option value="batsman" className="text-gray-900">Batsman</option>
              <option value="bowler" className="text-gray-900">Bowler</option>
              <option value="all-rounder" className="text-gray-900">All-rounder</option>
              <option value="wicket-keeper" className="text-gray-900">Wicket Keeper</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Batting Style *
            </label>
            <select
              value={battingStyle}
              onChange={(e) => setBattingStyle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            >
              <option value="right-hand" className="text-gray-900">Right-hand</option>
              <option value="left-hand" className="text-gray-900">Left-hand</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bowling Style
            </label>
            <select
              value={bowlingStyle}
              onChange={(e) => setBowlingStyle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            >
              <option value="none" className="text-gray-900">None</option>
              <option value="right-arm-fast" className="text-gray-900">Right-arm Fast</option>
              <option value="right-arm-medium" className="text-gray-900">Right-arm Medium</option>
              <option value="right-arm-spin" className="text-gray-900">Right-arm Spin</option>
              <option value="left-arm-fast" className="text-gray-900">Left-arm Fast</option>
              <option value="left-arm-medium" className="text-gray-900">Left-arm Medium</option>
              <option value="left-arm-spin" className="text-gray-900">Left-arm Spin</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jersey Number
            </label>
            <input
              type="number"
              value={jerseyNumber}
              onChange={(e) => setJerseyNumber(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="e.g., 18"
              min="1"
              max="99"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: 1-99</p>
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
              {loading ? 'Adding...' : 'Add Player'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
