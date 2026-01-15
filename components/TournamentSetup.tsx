"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Shuffle, Users, Trophy } from "lucide-react"
import { useTournamentStore } from "@/lib/store"
import { Logo } from "@/components/Logo"

type Sport = "Cricket" | "Football" | "Volleyball" | "Kabaddi" | "Other"

export default function TournamentSetup() {
    const router = useRouter()
    const { setTournamentData } = useTournamentStore()
    const [sport, setSport] = useState<Sport>("Cricket")
    const [tournamentName, setTournamentName] = useState("")
    const [teamInput, setTeamInput] = useState("")
    const [numTeams, setNumTeams] = useState<number>(0)

    // Sync text to number
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setTeamInput(val)
        const lines = val.split("\n").filter(t => t.trim().length > 0)
        setNumTeams(lines.length)
    }

    // Sync number to text (Auto-generate)
    const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 0
        setNumTeams(val)
        // Only auto-fill if empty or previously auto-filled (simple check: if text is empty or matches pattern)
        if (teamInput.trim() === "" || teamInput.startsWith("Team 1")) {
            const generated = Array.from({ length: val }, (_, i) => `Team ${i + 1}`).join("\n")
            setTeamInput(generated)
        }
    }

    const handleRandomize = () => {
        // 1. Parse teams
        let teams = teamInput.split("\n").map(t => t.trim()).filter(t => t.length > 0)

        // If user entered a number but no text, generate now
        if (teams.length === 0 && numTeams > 1) {
            teams = Array.from({ length: numTeams }, (_, i) => `Team ${i + 1}`)
        }

        if (teams.length < 2) {
            alert("Please enter at least 2 teams.")
            return
        }

        // 2. Fisher-Yates Shuffle
        const shuffled = [...teams]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // 3. Save to Store and Navigate
        setTournamentData(tournamentName || "My Tournament", sport, shuffled)
        router.push("/bracket")
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[80vh] font-sans">
            <div className="text-center mb-12 space-y-6 flex flex-col items-center">
                <Logo className="w-24 h-24 mb-4 neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-all" />
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-950 uppercase drop-shadow-[4px_4px_0_rgba(255,255,255,1)]">
                    Tournament<br /><span className="bg-[#a3e635] px-2 text-black ml-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Bracket</span> Generator
                </h1>
                <p className="text-xl font-bold text-zinc-800 max-w-2xl mx-auto bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
                    Create professional knockout tournaments in seconds.
                </p>
            </div>

            <div className="w-full max-w-lg z-10">
                <Card className="bg-[#d8b4fe] overflow-visible">
                    <CardHeader className="border-b-[3px] border-black bg-white">
                        <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase tracking-widest">
                            <Users className="h-6 w-6 stroke-[3px]" />
                            Setup
                        </CardTitle>
                        <CardDescription className="text-zinc-600 font-bold">
                            Configure the settings for your new tournament.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="t-name" className="text-base font-black uppercase">Tournament Name</Label>
                            <div className="flex">
                                <Input
                                    id="t-name"
                                    placeholder="e.g. SUMMER SLAM 2026"
                                    value={tournamentName}
                                    onChange={(e) => setTournamentName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-black uppercase">Select Sport</Label>
                            <Tabs defaultValue="Cricket" onValueChange={(v) => setSport(v as Sport)} className="w-full">
                                <TabsList className="flex w-full overflow-x-auto pb-2 no-scrollbar gap-2 md:grid md:grid-cols-5 md:gap-1 bg-transparent p-0 snap-x">
                                    {["Cricket", "Football", "Volleyball", "Kabaddi", "Other"].map((s) => (
                                        <TabsTrigger
                                            key={s}
                                            value={s}
                                            className="flex-shrink-0 min-w-[80px] md:min-w-0 border-[2px] border-black bg-white rounded-none data-[state=active]:bg-[#ff69b4] data-[state=active]:text-white font-bold uppercase data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform text-[10px] sm:text-xs px-2 snap-center"
                                        >
                                            <span className="md:hidden">{s}</span>
                                            <span className="hidden md:inline">{s.slice(0, 4)}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="num-teams" className="text-base font-black uppercase">Number of Teams</Label>
                                    <Input
                                        id="num-teams"
                                        type="number"
                                        min="2"
                                        placeholder="0"
                                        className="h-12 text-lg font-black border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
                                        value={numTeams || ""}
                                        onChange={handleNumChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="teams" className="text-base font-black uppercase">Team Names</Label>
                                <Textarea
                                    id="teams"
                                    placeholder="ENTER TEAM NAMES HERE..."
                                    className="min-h-[200px] font-mono text-sm resize-y border-[3px] border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all bg-white uppercase font-bold"
                                    value={teamInput}
                                    onChange={handleTextChange}
                                />
                                <p className="text-xs font-bold text-black flex justify-between uppercase border-2 border-black p-1 bg-[#a3e635]">
                                    <span>1 Team / Line</span>
                                    <span>{numTeams} Teams</span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-white border-t-[3px] border-black p-4">
                        <Button
                            size="lg"
                            className="w-full text-xl font-black uppercase h-16 shadow-[5px_5px_0px_0px_#a3e635] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                            onClick={handleRandomize}
                        >
                            <Trophy className="mr-2 h-6 w-6 stroke-[3px]" />
                            Let's Fight
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

