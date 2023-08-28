import { GameProvider } from "@/contexts/GameContext";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <GameProvider>
            <div>{children}</div>
        </GameProvider>
    )
  }