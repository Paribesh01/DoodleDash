import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Play } from "lucide-react";

export const PlayerList = ({ userId, admin, currentPlayer, players, StartGame, gameStarted }: any) => {
    const length = players.length
    console.log(length)
    console.log(admin)
    console.log(userId)
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full max-w-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                <h2 className="text-xl md:text-2xl font-bold">Players</h2>
                <Button
                    onClick={StartGame}
                    disabled={admin == userId ? gameStarted : true}
                    className="flex items-center space-x-2 text-sm md:text-base"
                >
                    <Play className="h-4 w-4 md:h-5 md:w-5" />
                    <span>{length > 3 ? "Start Game" : "Waiting..."}</span>
                </Button>
            </div>
            <ScrollArea className="flex-grow">
                {players.map((player: any, index: any) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between mb-2 p-2 rounded-lg ${player.id === currentPlayer ? 'bg-blue-100' : 'hover:bg-gray-100'
                            }`}
                    >
                        <div className="flex items-center">
                            <Avatar className="h-6 w-6 md:h-8 md:w-8 mr-2">
                                <AvatarImage alt={player.id} />
                            </Avatar>
                            <span className="text-sm md:text-base">{player.id} {player.id == userId && "(You)"}  </span>
                        </div>
                        <span className="font-bold text-sm md:text-base">{player.points}</span>
                    </div>
                ))}
            </ScrollArea>
        </div>

    );
};
