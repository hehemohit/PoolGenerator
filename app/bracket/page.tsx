"use client"

import { useTournamentStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Trophy, Download } from "lucide-react"

type Match = {
    id: string
    round: number
    matchIndex: number // Position in the round (0 = top match)
    team1: { name: string; isBye?: boolean } | null
    team2: { name: string; isBye?: boolean } | null
    winner: string | null
    nextMatchId: string | null
}

export default function BracketPage() {
    const router = useRouter()
    const { teams, sport, tournamentName } = useTournamentStore()
    const [matches, setMatches] = useState<Match[]>([])
    const [rounds, setRounds] = useState<number>(0)

    // Redirect if no teams
    useEffect(() => {
        if (teams.length < 2) {
            router.push("/")
        }
    }, [teams, router])

    // Initialize Bracket Logic (Phase 2 core logic starts here)
    useEffect(() => {
        if (teams.length < 2) return

        const teamCount = teams.length
        const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(teamCount)))
        const roundsCount = Math.log2(nextPowerOf2)
        setRounds(roundsCount)

        const bracketSlots = nextPowerOf2
        const numByes = bracketSlots - teamCount
        const matchesInFirstRound = bracketSlots / 2

        // Strategy: 
        // We have `matchesInFirstRound` matches.
        // We want to assign `numByes` Byes to specific matches so they play against a Real Team.
        // A Match with a Bye automatically has a Winner.
        // Matches needed for Byes: `numByes`. (Since 1 Bye + 1 Team = 1 Match).
        // Matches playing normally: `matchesInFirstRound - numByes`.
        // Teams required for Bye Matches: `numByes` (1 per match).
        // Matches remaining: `matchesInFirstRound - numByes`.
        // Teams required for Normal Matches: 2 * (Matches - Byes).

        // Total Teams Check: numByes + 2*(M-B) = B + 2M - 2B = 2M - B = Slots - Byes = Teams. Correct.

        // Allocation:
        // We will assign the first `numByes` matches to have (Team, BYE).
        // The remaining matches will have (Team, Team).

        const initialMatches: Match[] = []
        let currentTeamIndex = 0

        for (let r = 1; r <= roundsCount; r++) {
            const matchesInThisRound = nextPowerOf2 / Math.pow(2, r)

            for (let i = 0; i < matchesInThisRound; i++) {
                let t1 = null
                let t2 = null
                let winner = null

                if (r === 1) {
                    // Round 1 Logic
                    if (i < numByes) {
                        // This match gets a Bye
                        t1 = { name: teams[currentTeamIndex]?.name || "TBD", isBye: false }
                        t2 = { name: "BYE", isBye: true }
                        winner = t1.name // Auto-advance
                        currentTeamIndex++
                    } else {
                        // Normal Match
                        t1 = { name: teams[currentTeamIndex]?.name || "TBD", isBye: false }
                        currentTeamIndex++
                        t2 = { name: teams[currentTeamIndex]?.name || "TBD", isBye: false }
                        currentTeamIndex++
                    }
                }

                // Logic to find next match ID
                // Current match is round r, index i.
                // Next match will be round r+1, index floor(i/2).
                const nextMatchId = r < roundsCount ? `R${r + 1}-M${Math.floor(i / 2)}` : null

                initialMatches.push({
                    id: `R${r}-M${i}`,
                    round: r,
                    matchIndex: i,
                    team1: t1,
                    team2: t2,
                    winner: winner,
                    nextMatchId
                })
            }
        }

        // We need to propagate the Round 1 winners (from Byes) to Round 2 immediately
        const finalMatches = propagateWinners(initialMatches)
        setMatches(finalMatches)

    }, [teams])

    const propagateWinners = (currentMatches: Match[]) => {
        const matchMap = new Map(currentMatches.map(m => [m.id, m]))

        // We iterate rounds 1 to N-1
        // We can't just iterate normally because of dependencies.
        // But since we are looking for "winner" field which is already set for Byes...

        currentMatches.forEach(match => {
            if (match.winner && match.nextMatchId) {
                const nextMatch = matchMap.get(match.nextMatchId)
                if (nextMatch) {
                    // Determine if we are the top or bottom feeder for the next match
                    // Current index i feeds into floor(i/2).
                    // If i is even (0, 2, 4), we are the TOP (team1) of the next match.
                    // If i is odd (1, 3, 5), we are the BOTTOM (team2) of the next match.
                    if (match.matchIndex % 2 === 0) {
                        nextMatch.team1 = { name: match.winner }
                    } else {
                        nextMatch.team2 = { name: match.winner }
                    }

                    // Auto-advance in next round if both slots filled? No, user must wait or click? 
                    // Initial requirement: "Clicking a team name... advances them".
                    // But Byes should be auto.
                    matchMap.set(nextMatch.id, nextMatch)
                }
            }
        })

        return Array.from(matchMap.values())
    }

    const handleAdvance = (matchId: string, winnerName: string) => {
        const newMatches = matches.map(m => {
            if (m.id === matchId) {
                return { ...m, winner: winnerName }
            }
            return m
        })
        setMatches(propagateWinners(newMatches))
    }

    // Render Logic
    // We need distinct columns for each round.
    // Flex container: row.

    return (
        <div className="min-h-screen p-8 font-sans">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex items-center justify-between mb-12 bg-white border-[3px] border-black p-4 neo-shadow">
                <Button variant="ghost" onClick={() => router.push("/")} className="gap-2 font-bold uppercase hover:bg-transparent hover:underline">
                    <ChevronLeft className="h-5 w-5 stroke-[3px]" /> Back to Setup
                </Button>
                <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3 uppercase tracking-tighter">
                    <Trophy className="h-8 w-8 stroke-[3px]" />
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold bg-black text-white px-2 py-0.5">{sport} Tournament</span>
                        <span className="text-xl md:text-2xl drop-shadow-[2px_2px_0_rgba(255,255,255,1)]">{tournamentName}</span>
                    </div>
                </h1>
                <Button variant="outline" className="gap-2 font-bold uppercase hover:bg-[#ff69b4] hover:text-white transition-all">
                    <Download className="h-4 w-4 stroke-[3px]" /> Export PDF
                </Button>
            </div>

            {/* Bracket Container */}
            <div className="max-w-[98vw] mx-auto overflow-x-auto pb-12">
                <div className="flex gap-20 min-w-max px-4">
                    {Array.from({ length: rounds }).map((_, rIndex) => {
                        const roundNum = rIndex + 1
                        const roundMatches = matches.filter(m => m.round === roundNum).sort((a, b) => a.matchIndex - b.matchIndex)

                        return (
                            <div key={roundNum} className="flex flex-col justify-around relative w-80 space-y-8">
                                {/* Round Header */}
                                <div className="absolute -top-12 left-0 w-full text-center font-black text-black uppercase tracking-widest text-xl bg-[#a3e635] border-[3px] border-black py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
                                    {roundNum === rounds ? "Finals" : `Round ${roundNum}`}
                                </div>

                                {roundMatches.map((match) => (
                                    <div key={match.id} className="relative flex flex-col gap-0 border-[3px] border-black bg-white text-black neo-shadow transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]">

                                        <div
                                            className={`p-4 border-b-[3px] border-black cursor-pointer hover:bg-zinc-100 transition-colors flex justify-between items-center ${match.winner === match.team1?.name ? "bg-[#a3e635] font-black" : "font-bold"}`}
                                            onClick={() => match.team1 && !match.winner && handleAdvance(match.id, match.team1.name)}
                                        >
                                            <span className={!match.team1 ? "text-zinc-400 italic" : "uppercase"}>
                                                {match.team1?.name || "TBD"}
                                            </span>
                                            {match.team1?.isBye && <span className="text-[10px] bg-[#ff69b4] text-white border border-black px-1 font-bold">BYE</span>}
                                        </div>
                                        <div
                                            className={`p-4 cursor-pointer hover:bg-zinc-100 transition-colors flex justify-between items-center ${match.winner === match.team2?.name ? "bg-[#a3e635] font-black" : "font-bold"}`}
                                            onClick={() => match.team2 && !match.winner && handleAdvance(match.id, match.team2.name)}
                                        >
                                            <span className={!match.team2 ? "text-zinc-400 italic" : "uppercase"}>
                                                {match.team2?.name || "TBD"}
                                            </span>
                                            {match.team2?.isBye && <span className="text-[10px] bg-[#ff69b4] text-white border border-black px-1 font-bold">BYE</span>}
                                        </div>

                                        {/* Connector Line (Right side) - Only if not final round */}
                                        {roundNum < rounds && (
                                            <div className="absolute right-0 top-1/2 w-10 h-[3px] bg-black translate-x-full z-10" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
