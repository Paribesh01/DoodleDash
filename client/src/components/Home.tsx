import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dice5Icon, PencilIcon, PlusCircleIcon, Users } from "lucide-react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();


  const handleCreateRoom = () => {
    navigate("/game/createRoom");
  };

  const handleJoinRoom = () => {
    if (roomId) {
      navigate(`/game/${roomId}`);
    } else {
      navigate(`/game/randomRoom`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-orange-400 flex flex-col items-center justify-center p-4 font-comic-sans">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4 relative">
            <PencilIcon className="h-20 w-20 text-purple-600 z-10 transform -rotate-12 animate-wiggle" />
          </div>
          <h1 className="text-6xl font-bold text-blue-600 mb-2 transform -rotate-2">Skribble.io</h1>
          <p className="text-2xl text-purple-700 font-semibold transform rotate-1">Draw, Guess, Giggle!</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl space-y-6 border-4 border-dashed border-blue-400 transform rotate-1">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter Room Code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="bg-yellow-100 border-2 border-orange-400 text-purple-700 placeholder-purple-400 rounded-xl text-lg"
              />
              <Button
                onClick={handleJoinRoom}
                className="bg-green-400 hover:bg-green-500 text-white rounded-xl text-lg font-semibold transform transition-transform duration-200 hover:scale-105"
              >
                <Users className="mr-2 h-5 w-5" />
                Join
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleCreateRoom}
                className="bg-pink-400 hover:bg-pink-500 text-white border-2 border-pink-600 rounded-xl text-lg font-semibold transform transition-transform duration-200 hover:scale-105"
              >
                <PlusCircleIcon className="mr-2 h-5 w-5" />
                Create Room
              </Button>

              <Button
                variant="outline"
                onClick={handleJoinRoom}
                className="bg-blue-400 hover:bg-blue-500 text-white border-2 border-blue-600 rounded-xl text-lg font-semibold transform transition-transform duration-200 hover:scale-105"
              >
                <Dice5Icon className="mr-2 h-5 w-5" />
                Random Room
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center text-xl text-purple-800 font-semibold transform -rotate-1">
          Scribble, laugh, and guess with pals! Jump into a room or start your own silly session!
        </div>
      </div>
    </div>

  );
}
