import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Team = {
    id: string
    name: string
    seed: number
}

export type Match = {
    id: string
    round: number
    matchIndex: number
    team1: { name: string; isBye?: boolean } | null
    team2: { name: string; isBye?: boolean } | null
    winner: string | null
    nextMatchId: string | null
}

type TournamentStore = {
    tournamentName: string
    sport: string
    teams: Team[]
    matches: Match[]
    setTournamentData: (name: string, sport: string, teams: string[]) => void
    setMatches: (matches: Match[]) => void
    updateMatchWinner: (matchId: string, winnerName: string) => void
}

export const useTournamentStore = create<TournamentStore>()(
    persist(
        (set, get) => ({
            tournamentName: "My Tournament",
            sport: "Cricket",
            teams: [],
            matches: [],
            setTournamentData: (name, sport, teams) => {
                const teamObjects = teams.map((teamName, index) => ({
                    id: crypto.randomUUID(),
                    name: teamName,
                    seed: index + 1
                }))
                // Reset matches when new tournament data is set
                set({ tournamentName: name, sport, teams: teamObjects, matches: [] })
            },
            setMatches: (matches) => set({ matches }),
            updateMatchWinner: (matchId, winnerName) => {
                const { matches } = get()
                const newMatches = matches.map(m => {
                    if (m.id === matchId) {
                        return { ...m, winner: winnerName }
                    }
                    return m
                })
                set({ matches: propagateWinners(newMatches) })
            }
        }),
        {
            name: 'tournament-storage',
        }
    )
)

// Helper to propagate winners (moved from component to shared logic)
function propagateWinners(currentMatches: Match[]) {
    const matchMap = new Map(currentMatches.map(m => [m.id, m]))

    currentMatches.forEach(match => {
        if (match.winner && match.nextMatchId) {
            const nextMatch = matchMap.get(match.nextMatchId)
            if (nextMatch) {
                if (match.matchIndex % 2 === 0) {
                    nextMatch.team1 = { name: match.winner }
                } else {
                    nextMatch.team2 = { name: match.winner }
                }
                matchMap.set(nextMatch.id, nextMatch)
            }
        }
    })

    return Array.from(matchMap.values())
}
