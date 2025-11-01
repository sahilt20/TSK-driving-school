'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function StartMatchPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.id as string

  const [match, setMatch] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    fetchMatchDetails()
  }, [matchId])

  async function fetchMatchDetails() {
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
      setMatch(matchData as any)
      const match = matchData as any

      // Fetch players from both teams
      const { data: playersData } = await supabase
        .from('players')
        .select('*')
        .in('team_id', [match.team_a_id, match.team_b_id])

      if (playersData) {
        setPlayers(playersData)
      }
    }
    setLoading(false)
  }

  async function handleStartMatch() {
    if (selectedPlayers.length < 2) {
      alert('Please select at least 2 batsmen to start')
      return
    }

    setStarting(true)

    // Update match status to live
    // @ts-ignore
    await supabase
      .from('matches')
      .update({ match_status: 'live' })
      .eq('id', matchId)

    // Create first innings
    // @ts-ignore
    const { data: innings } = await supabase
      .from('innings')
      .insert({
        match_id: matchId,
        innings_number: 1,
        batting_team_id: match.team_a_id,
        bowling_team_id: match.team_b_id,
      })
      .select()
      .single()

    if (innings) {
      // Create initial batting performances for selected players
      const battingPerformances = selectedPlayers.slice(0, 11).map((playerId, index) => ({
        innings_id: innings.id,
        player_id: playerId,
        batting_position: index + 1,
      }))

      // @ts-ignore
      await supabase
        .from('batting_performances')
        .insert(battingPerformances)

      // Initialize live match state
      // @ts-ignore
      await supabase
        .from('live_match_state')
        .insert({
          match_id: matchId,
          current_innings: 1,
          current_batsman1_id: selectedPlayers[0],
          current_batsman2_id: selectedPlayers[1],
        })

      // Navigate to scoring interface
      router.push(`/matches/${matchId}/score`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-6">Start Match</h1>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                {match?.team_a?.name} vs {match?.team_b?.name}
              </h2>
              <p className="text-gray-600">
                {match?.match_type} • {match?.venue}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select Opening Batsmen</h3>
              <p className="text-sm text-gray-600 mb-3">
                Select the batting order (first 11 players from {match?.team_a?.name})
              </p>
              <div className="space-y-2">
                {players
                  .filter(p => p.team_id === match?.team_a_id)
                  .map((player) => (
                    <label
                      key={player.id}
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlayers.includes(player.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPlayers([...selectedPlayers, player.id])
                          } else {
                            setSelectedPlayers(selectedPlayers.filter(id => id !== player.id))
                          }
                        }}
                        className="mr-3 h-4 w-4"
                      />
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-gray-600">
                          {player.role} • {player.batting_style}
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
            </div>

            <button
              onClick={handleStartMatch}
              disabled={starting || selectedPlayers.length < 2}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {starting ? 'Starting Match...' : 'Start Match'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
