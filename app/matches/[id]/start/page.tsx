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
  const [selectedBattingPlayers, setSelectedBattingPlayers] = useState<string[]>([])
  const [selectedBowlingPlayers, setSelectedBowlingPlayers] = useState<string[]>([])
  const [tossWinner, setTossWinner] = useState<'team_a' | 'team_b' | null>(null)
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl' | null>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [currentTab, setCurrentTab] = useState<'batting' | 'bowling'>('batting')

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
      const match = matchData as any

      // If match is already live, redirect to scoring page
      if (match.match_status === 'live') {
        router.push(`/matches/${matchId}/score`)
        return
      }

      setMatch(match)

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
    // Validation
    const teamAPlayers = players.filter(p => p.team_id === match?.team_a_id)
    const teamBPlayers = players.filter(p => p.team_id === match?.team_b_id)

    const errors = []
    if (teamAPlayers.length === 0) {
      errors.push(`${match?.team_a?.name} has no players`)
    }
    if (teamBPlayers.length === 0) {
      errors.push(`${match?.team_b?.name} has no players`)
    }
    if (selectedBattingPlayers.length < 2) {
      errors.push('Select at least 2 batsmen from batting team')
    }
    if (selectedBowlingPlayers.length < 1) {
      errors.push('Select at least 1 bowler from bowling team')
    }
    if (!tossWinner) {
      errors.push('Complete the toss first')
    }
    if (!tossDecision) {
      errors.push('Decide whether to bat or bowl')
    }

    if (errors.length > 0) {
      setShowValidation(true)
      alert('Please fix the following:\n\n' + errors.join('\n'))
      return
    }

    setStarting(true)

    try {
      // Determine which team bats first based on toss
      const battingTeamId = (tossWinner === 'team_a' && tossDecision === 'bat') ||
                            (tossWinner === 'team_b' && tossDecision === 'bowl')
                            ? match.team_a_id : match.team_b_id
      const bowlingTeamId = battingTeamId === match.team_a_id ? match.team_b_id : match.team_a_id

      // Check if innings already exists for this match
      const { data: existingInnings } = await supabase
        .from('innings')
        .select('*')
        .eq('match_id', matchId)
        .eq('innings_number', 1)
        .maybeSingle()

      let innings = existingInnings

      if (!existingInnings) {
        // Create first innings only if it doesn't exist
        const { data: newInnings, error: inningsError } = await supabase
          .from('innings')
          .insert({
            match_id: matchId,
            innings_number: 1,
            batting_team_id: battingTeamId,
            bowling_team_id: bowlingTeamId,
          })
          .select()
          .single()

        if (inningsError) throw inningsError
        innings = newInnings
      }

      if (innings) {
        // Check if batting performances already exist
        const { data: existingBatting } = await supabase
          .from('batting_performances')
          .select('*')
          .eq('innings_id', innings.id)

        // Only create batting performances if they don't exist
        if (!existingBatting || existingBatting.length === 0) {
          const battingPerformances = selectedBattingPlayers.slice(0, 11).map((playerId, index) => ({
            innings_id: innings.id,
            player_id: playerId,
            batting_position: index + 1,
          }))

          const { error: battingError } = await supabase
            .from('batting_performances')
            .insert(battingPerformances)

          if (battingError) throw battingError
        }

        // Check if live match state exists
        const { data: existingState } = await supabase
          .from('live_match_state')
          .select('*')
          .eq('match_id', matchId)
          .maybeSingle()

        // Update match status to live
        await supabase
          .from('matches')
          .update({
            match_status: 'live',
            toss_winner: tossWinner === 'team_a' ? match.team_a_id : match.team_b_id,
            toss_decision: tossDecision
          })
          .eq('id', matchId)

        if (!existingState) {
          // Initialize live match state only if it doesn't exist
          const { error: stateError } = await supabase
            .from('live_match_state')
            .insert({
              match_id: matchId,
              current_innings: 1,
              current_batsman1_id: selectedBattingPlayers[0],
              current_batsman2_id: selectedBattingPlayers[1],
            })

          if (stateError) throw stateError
        }

        // Navigate to scoring interface
        router.push(`/matches/${matchId}/score`)
      }
    } catch (error: any) {
      console.error('Error starting match:', error)
      alert(`Failed to start match: ${error.message}`)
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const teamAPlayers = players.filter(p => p.team_id === match?.team_a_id)
  const teamBPlayers = players.filter(p => p.team_id === match?.team_b_id)

  // Determine which team's players to show based on toss decision
  const getBattingTeam = () => {
    if (!tossWinner || !tossDecision) return { players: teamAPlayers, name: match?.team_a?.name }

    // If team A won toss and chose to bat, team A bats
    // If team A won toss and chose to bowl, team B bats
    // If team B won toss and chose to bat, team B bats
    // If team B won toss and chose to bowl, team A bats

    const teamABats = (tossWinner === 'team_a' && tossDecision === 'bat') ||
                      (tossWinner === 'team_b' && tossDecision === 'bowl')

    return {
      players: teamABats ? teamAPlayers : teamBPlayers,
      name: teamABats ? match?.team_a?.name : match?.team_b?.name
    }
  }

  const battingTeam = getBattingTeam()
  const battingTeamPlayers = battingTeam.players
  const battingTeamName = battingTeam.name

  // Bowling team is opposite of batting team
  const getBowlingTeam = () => {
    if (!tossWinner || !tossDecision) return { players: teamBPlayers, name: match?.team_b?.name }

    const teamABowls = (tossWinner === 'team_a' && tossDecision === 'bowl') ||
                       (tossWinner === 'team_b' && tossDecision === 'bat')

    return {
      players: teamABowls ? teamAPlayers : teamBPlayers,
      name: teamABowls ? match?.team_a?.name : match?.team_b?.name
    }
  }

  const bowlingTeam = getBowlingTeam()
  const bowlingTeamPlayers = bowlingTeam.players
  const bowlingTeamName = bowlingTeam.name

  const canStart = selectedBattingPlayers.length >= 2 && selectedBowlingPlayers.length >= 1 &&
                   tossWinner && tossDecision && teamAPlayers.length > 0 && teamBPlayers.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Start Match</h1>

            <div className="mb-6 p-4 bg-blue-600 text-white rounded-lg">
              <h2 className="text-xl font-bold mb-2">
                {match?.team_a?.name} vs {match?.team_b?.name}
              </h2>
              <p className="text-white">
                {match?.match_type} • {match?.venue || 'No venue set'}
              </p>
            </div>

            {/* Validation Warnings */}
            {showValidation && (
              <div className="mb-6 space-y-2">
                {teamAPlayers.length === 0 && (
                  <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded">
                    <p className="text-red-900 font-bold">⚠️ {match?.team_a?.name} has no players!</p>
                  </div>
                )}
                {teamBPlayers.length === 0 && (
                  <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded">
                    <p className="text-red-900 font-bold">⚠️ {match?.team_b?.name} has no players!</p>
                  </div>
                )}
              </div>
            )}

            {/* Toss Section */}
            <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-2 border-yellow-400">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                🪙 Toss
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Who won the toss?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTossWinner('team_a')}
                    className={`p-4 rounded-lg font-semibold transition-all ${
                      tossWinner === 'team_a'
                        ? 'bg-green-600 text-white border-2 border-green-700'
                        : 'bg-white text-gray-900 border-2 border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {match?.team_a?.name}
                  </button>
                  <button
                    onClick={() => setTossWinner('team_b')}
                    className={`p-4 rounded-lg font-semibold transition-all ${
                      tossWinner === 'team_b'
                        ? 'bg-green-600 text-white border-2 border-green-700'
                        : 'bg-white text-gray-900 border-2 border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {match?.team_b?.name}
                  </button>
                </div>
              </div>

              {tossWinner && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Choose to bat or bowl?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTossDecision('bat')}
                      className={`p-4 rounded-lg font-semibold transition-all ${
                        tossDecision === 'bat'
                          ? 'bg-blue-600 text-white border-2 border-blue-700'
                          : 'bg-white text-gray-900 border-2 border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      🏏 Bat First
                    </button>
                    <button
                      onClick={() => setTossDecision('bowl')}
                      className={`p-4 rounded-lg font-semibold transition-all ${
                        tossDecision === 'bowl'
                          ? 'bg-blue-600 text-white border-2 border-blue-700'
                          : 'bg-white text-gray-900 border-2 border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      ⚾ Bowl First
                    </button>
                  </div>
                </div>
              )}

              {tossWinner && tossDecision && (
                <div className="mt-4 p-3 bg-green-100 border-2 border-green-600 rounded-lg">
                  <p className="text-green-900 font-bold text-center">
                    ✅ {tossWinner === 'team_a' ? match?.team_a?.name : match?.team_b?.name} won the toss and chose to {tossDecision}
                  </p>
                </div>
              )}
            </div>

            {/* Team Selection Tabs */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setCurrentTab('batting')}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
                    currentTab === 'batting'
                      ? 'bg-green-600 text-white border-2 border-green-700'
                      : 'bg-gray-200 text-gray-700 border-2 border-gray-300 hover:bg-gray-300'
                  }`}
                >
                  🏏 Batting Team ({selectedBattingPlayers.length}/11)
                </button>
                <button
                  onClick={() => setCurrentTab('bowling')}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
                    currentTab === 'bowling'
                      ? 'bg-red-600 text-white border-2 border-red-700'
                      : 'bg-gray-200 text-gray-700 border-2 border-gray-300 hover:bg-gray-300'
                  }`}
                >
                  ⚾ Bowling Team ({selectedBowlingPlayers.length}/11)
                </button>
              </div>

              {/* Batting Team Selection */}
              {currentTab === 'batting' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">Select Batting XI</h3>
                    {selectedBattingPlayers.length > 0 && (
                      <button
                        onClick={() => setSelectedBattingPlayers([])}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 mb-4 bg-green-100 p-3 rounded border-l-4 border-green-600">
                    <strong>📋 {battingTeamName}</strong> - Select players in batting order
                    <br />
                    <span className="text-xs text-gray-700">First selected = openers. Minimum 2 players required.</span>
                  </p>

                  {!tossWinner || !tossDecision ? (
                    <div className="bg-amber-100 border-2 border-amber-500 rounded-lg p-6 text-center">
                      <p className="text-amber-900 font-bold mb-2">⚠️ Complete the Toss First</p>
                      <p className="text-sm text-amber-800">
                        Please select the toss winner and decision before selecting teams.
                      </p>
                    </div>
                  ) : battingTeamPlayers.length === 0 ? (
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
                      <p className="text-yellow-900 font-bold mb-2">⚠️ No Players Found</p>
                      <p className="text-sm text-yellow-800 mb-4">
                        {battingTeamName} has no players. You need to add players before starting a match.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {battingTeamPlayers.map((player) => {
                        const isSelected = selectedBattingPlayers.includes(player.id)
                        const position = selectedBattingPlayers.indexOf(player.id) + 1

                        return (
                          <label
                            key={player.id}
                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-green-50 border-green-500 shadow-sm'
                                : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (selectedBattingPlayers.length < 11) {
                                    setSelectedBattingPlayers([...selectedBattingPlayers, player.id])
                                  } else {
                                    alert('Maximum 11 players can be selected')
                                  }
                                } else {
                                  setSelectedBattingPlayers(selectedBattingPlayers.filter(id => id !== player.id))
                                }
                              }}
                              className="mr-4 h-5 w-5 text-green-600 rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {isSelected && (
                                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                                    #{position}
                                  </span>
                                )}
                                <div className="font-semibold text-gray-900">{player.name}</div>
                              </div>
                              <div className="text-sm text-gray-700 mt-1">
                                {player.role} • {player.batting_style}
                                {player.jersey_number && ` • Jersey #${player.jersey_number}`}
                              </div>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Bowling Team Selection */}
              {currentTab === 'bowling' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">Select Bowling XI</h3>
                    {selectedBowlingPlayers.length > 0 && (
                      <button
                        onClick={() => setSelectedBowlingPlayers([])}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 mb-4 bg-red-100 p-3 rounded border-l-4 border-red-600">
                    <strong>📋 {bowlingTeamName}</strong> - Select playing 11
                    <br />
                    <span className="text-xs text-gray-700">Minimum 1 player required (should have bowlers).</span>
                  </p>

                  {!tossWinner || !tossDecision ? (
                    <div className="bg-amber-100 border-2 border-amber-500 rounded-lg p-6 text-center">
                      <p className="text-amber-900 font-bold mb-2">⚠️ Complete the Toss First</p>
                      <p className="text-sm text-amber-800">
                        Please select the toss winner and decision before selecting teams.
                      </p>
                    </div>
                  ) : bowlingTeamPlayers.length === 0 ? (
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
                      <p className="text-yellow-900 font-bold mb-2">⚠️ No Players Found</p>
                      <p className="text-sm text-yellow-800 mb-4">
                        {bowlingTeamName} has no players. You need to add players before starting a match.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {bowlingTeamPlayers.map((player) => {
                        const isSelected = selectedBowlingPlayers.includes(player.id)

                        return (
                          <label
                            key={player.id}
                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-red-50 border-red-500 shadow-sm'
                                : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (selectedBowlingPlayers.length < 11) {
                                    setSelectedBowlingPlayers([...selectedBowlingPlayers, player.id])
                                  } else {
                                    alert('Maximum 11 players can be selected')
                                  }
                                } else {
                                  setSelectedBowlingPlayers(selectedBowlingPlayers.filter(id => id !== player.id))
                                }
                              }}
                              className="mr-4 h-5 w-5 text-red-600 rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {isSelected && (
                                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                    ✓
                                  </span>
                                )}
                                <div className="font-semibold text-gray-900">{player.name}</div>
                              </div>
                              <div className="text-sm text-gray-700 mt-1">
                                {player.role} • {player.bowling_style || 'N/A'}
                                {player.jersey_number && ` • Jersey #${player.jersey_number}`}
                              </div>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {!canStart && (battingTeamPlayers.length > 0 || bowlingTeamPlayers.length > 0) && (
                <div className="bg-amber-100 border-2 border-amber-600 rounded-lg p-4">
                  <p className="text-sm font-bold text-amber-900">
                    ⚠️ Requirements to start match:
                  </p>
                  <ul className="text-sm text-amber-900 mt-2 space-y-1 list-disc list-inside">
                    {!tossWinner && <li>Complete the toss</li>}
                    {selectedBattingPlayers.length < 2 && <li>Select at least 2 batsmen from {battingTeamName}</li>}
                    {selectedBowlingPlayers.length < 1 && <li>Select at least 1 bowler from {bowlingTeamName}</li>}
                    {teamAPlayers.length === 0 && <li>{match?.team_a?.name} needs players</li>}
                    {teamBPlayers.length === 0 && <li>{match?.team_b?.name} needs players</li>}
                  </ul>
                </div>
              )}

              <button
                onClick={handleStartMatch}
                disabled={starting || !canStart}
                className="w-full bg-green-700 hover:bg-green-800 text-white px-6 py-4 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg border-2 border-green-900"
              >
                {starting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Starting Match...
                  </span>
                ) : (
                  <span>Start Match →</span>
                )}
              </button>

              <a
                href="/matches"
                className="block text-center text-gray-700 hover:text-gray-900 font-medium"
              >
                ← Back to Matches
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
