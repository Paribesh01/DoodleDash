// import useSocket from "@/hooks/usesocket";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Game() {
    // const socket = useSocket();
    const socket = new WebSocket("ws://localhost:8081");

    const { id } = useParams();
    const [roomId, setRoomId] = useState<string>("");
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);
    const [player, setPlayers] = useState<string[]>([]);
    const [isSocketReady, setSocketReady] = useState<boolean>(false);

    // Handling WebSocket message processing
    const handleSocketMessage = (event: MessageEvent) => {
        console.log("WebSocket message received");

        const parsedMessage = JSON.parse(event.data);
        console.log("Message data:", parsedMessage);
        switch (parsedMessage.status) {
            case "ID":
                console.log("IDDDDDD")
                setUserId(parsedMessage.userId);
                if (id == "createRoom") {
                    console.log("room created")
                    socket?.send(JSON.stringify({ action: "createRoom", userId }));
                } else if (id) {
                    console.log("joined room")
                    socket?.send(JSON.stringify({ action: "joinRoom", userId, roomid: id }));
                }
                break;
            case "roomCreated":
                setRoomId(parsedMessage.roomid);
                break;
            case "roomNotFound":
                navigate("/");
                break;
            case "joinedRoom":
                setRoomId(parsedMessage.roomid)
                break;
            case "playerJoined":
                const exists = player.includes(parsedMessage.userId);
                if (!exists) {
                    setPlayers((prev) => [...prev, parsedMessage.userId]);
                }
                break;
            default:
                console.log("Unknown status");
        }
    };

    useEffect(() => {
        if (!socket) {
            console.log("Socket is not available yet");
            console.log(socket)
            return;
        }

        // WebSocket connection established
        console.log("WebSocket connection established");
        setSocketReady(true);


        // Set up the message handler for the WebSocket
        socket.onmessage = handleSocketMessage

        // Cleanup function to stop listening when the component unmounts
        return () => {
            socket.onmessage = null;
        };
    }, []); // Minimal dependencies to avoid unnecessary re-renders

    if (!isSocketReady) {
        return <div>Loading WebSocket...</div>;
    }

    return (
        <div>
            <h2>This is the game room</h2>
            <p>Room ID: {roomId}</p>
            <p>User ID: {userId}</p>
            <p>Players: {player.join(", ")}</p>
        </div>
    );
}
