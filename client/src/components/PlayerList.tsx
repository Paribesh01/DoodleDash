import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Play } from "lucide-react";

export const PlayerList = ({ currentPlayer, players, StartGame, gameStarted }: any) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Players</h2>
                <Button
                    onClick={StartGame}
                    disabled={gameStarted}
                    className="flex items-center space-x-2"
                >
                    <Play className="h-4 w-4" />
                    <span>Start Game</span>
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
                            <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage alt={player.id} />
                            </Avatar>
                            <span>{player.id}</span>
                        </div>
                        <span className="font-bold">{player.points}</span>
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
};
