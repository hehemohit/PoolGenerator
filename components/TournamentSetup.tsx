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
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-transparent bg-clip-text animate-in fade-in zoom-in duration-500">
                    Tournament Bracket Generator
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Create professional knockout tournaments in seconds. Select your sport, enter teams, and let the chaos begin.
                </p>
            </div>

            <div className="w-full max-w-lg">
                <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Tournament Details
                        </CardTitle>
                        <CardDescription>
                            Configure the settings for your new tournament.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="t-name">Tournament Name</Label>
                            <div className="flex">
                                <Input
                                    id="t-name"
                                    placeholder="e.g. Summer Cup 2026"
                                    value={tournamentName}
                                    onChange={(e) => setTournamentName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Select Sport</Label>
                            <Tabs defaultValue="Cricket" onValueChange={(v) => setSport(v as Sport)} className="w-full">
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="Cricket">Cri</TabsTrigger>
                                    <TabsTrigger value="Football">Foot</TabsTrigger>
                                    <TabsTrigger value="Volleyball">Voll</TabsTrigger>
                                    <TabsTrigger value="Kabaddi">Kab</TabsTrigger>
                                    <TabsTrigger value="Other">Oth</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="teams">Team Names</Label>
                            <Textarea
                                id="teams"
                                placeholder="Enter team names here, one per line..."
                                className="min-h-[200px] font-mono text-sm resize-y"
                                value={teamInput}
                                onChange={(e) => setTeamInput(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground flex justify-between">
                                <span>One team per line</span>
                                <span>{teamInput.split(/\n/).filter(line => line.trim()).length} Teams</span>
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" className="w-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all" onClick={handleRandomize}>
                            <Trophy className="mr-2 h-5 w-5" />
                            Generate Bracket
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

