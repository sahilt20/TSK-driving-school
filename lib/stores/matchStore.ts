import { create } from 'zustand'

interface Player {
  id: string
  name: string
  role: string
  batting_style?: string
  bowling_style?: string
}

interface Team {
  id: string
  name: string
  short_name: string
}

interface Match {
  id: string
  team_a_id: string
  team_b_id: string
  match_type: string
  venue: string
  match_status: string
}

interface MatchState {
  currentMatch: Match | null
  currentInnings: any | null
  currentBatsmen: [Player | null, Player | null]
  currentBowler: Player | null
  striker: 0 | 1

  setCurrentMatch: (match: Match) => void
  setCurrentInnings: (innings: any) => void
  setCurrentBatsmen: (batsmen: [Player | null, Player | null]) => void
  setCurrentBowler: (bowler: Player | null) => void
  setStriker: (striker: 0 | 1) => void
  swapBatsmen: () => void
  clearMatch: () => void
}

export const useMatchStore = create<MatchState>((set) => ({
  currentMatch: null,
  currentInnings: null,
  currentBatsmen: [null, null],
  currentBowler: null,
  striker: 0,

  setCurrentMatch: (match) => set({ currentMatch: match }),
  setCurrentInnings: (innings) => set({ currentInnings: innings }),
  setCurrentBatsmen: (batsmen) => set({ currentBatsmen: batsmen }),
  setCurrentBowler: (bowler) => set({ currentBowler: bowler }),
  setStriker: (striker) => set({ striker }),
  swapBatsmen: () => set((state) => ({
    striker: state.striker === 0 ? 1 : 0
  })),
  clearMatch: () => set({
    currentMatch: null,
    currentInnings: null,
    currentBatsmen: [null, null],
    currentBowler: null,
    striker: 0
  })
}))
