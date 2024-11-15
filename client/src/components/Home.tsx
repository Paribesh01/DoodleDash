import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  // const [userId, setUserId] = useState(null)
  // const socket = useSocket()

  // useEffect(() => {
  //     if (!socket) {
  //         return
  //     }
  //     socket.onmessage = function (event) {
  //         const parsedmessage = JSON.parse(event.data as string)

  //         switch (parsedmessage.status) {
  //             case "ID":
  //                 setUserId(parsedmessage.userId)
  //                 break;
  //             case "roomCreated":
  //                 setRoomId(parsedmessage.roomid)
  //                 break;
  //         }

  //     }
  // }, [])

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Skribble Game
          </CardTitle>
          <CardDescription className="text-center">
            Create or join a room to start playing!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full text-lg py-6" onClick={handleCreateRoom}>
            Create New Room
          </Button>
          <Button className="w-full text-lg py-6" onClick={handleJoinRoom}>
            Join Random
          </Button>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleJoinRoom} disabled={!roomId}>
              Join Room
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
