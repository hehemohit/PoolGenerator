import TournamentSetup from "@/components/TournamentSetup";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] pointer-events-none" />
      <div className="z-10 w-full">
        <TournamentSetup />
      </div>
    </main>
  );
}
