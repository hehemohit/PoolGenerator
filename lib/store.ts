import { create } from 'zustand'

export type Team = {
    id: string
    name: string
    seed: number
}

type TournamentStore = {
    tournamentName: string
    sport: string
    teams: Team[]
    setTournamentData: (name: string, sport: string, teams: string[]) => void
}

export const useTournamentStore = create<TournamentStore>((set) => ({
    tournamentName: "My Tournament",
    sport: "Cricket",
    teams: [],
    setTournamentData: (name, sport, teams) => {
        // Convert string array to Team objects with seeds based on their shuffled order
        const teamObjects = teams.map((teamName, index) => ({
            id: crypto.randomUUID(),
            name: teamName,
            seed: index + 1
        }))
        set({ tournamentName: name, sport, teams: teamObjects })
    },
}))
