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

type Sport = "Cricket" | "Football" | "Volleyball" | "Kabaddi" | "Other"

export default function TournamentSetup() {
    const router = useRouter()
    const { setTournamentData } = useTournamentStore()
    const [sport, setSport] = useState<Sport>("Cricket")
    const [tournamentName, setTournamentName] = useState("")
    const [teamInput, setTeamInput] = useState("")

    const handleRandomize = () => {
        // 1. Parse teams
        const teams = teamInput.split("\n").map(t => t.trim()).filter(t => t.length > 0)

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
            <div className="text-center mb-12 space-y-4">
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
                                <TabsList className="grid w-full grid-cols-5 gap-1">
                                    {["Cricket", "Football", "Volleyball", "Kabaddi", "Other"].map((s) => (
                                        <TabsTrigger
                                            key={s}
                                            value={s}
                                        >
                                            {s.slice(0, 4)}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="teams" className="text-base font-black uppercase">Team Names</Label>
                            <Textarea
                                id="teams"
                                placeholder="ENTER TEAM NAMES HERE..."
                                value={teamInput}
                                onChange={(e) => setTeamInput(e.target.value)}
                            />
                            <p className="text-xs font-bold text-black flex justify-between uppercase border-2 border-black p-1 bg-[#a3e635]">
                                <span>1 Team / Line</span>
                                <span>{teamInput.split(/\n/).filter(line => line.trim()).length} Teams</span>
                            </p>
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

