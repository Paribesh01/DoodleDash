import { useSocket } from "@/hooks/usesocket";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatBox from "./ChatBox";

export default function Game() {
    const socket = useSocket();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawingRef = useRef(false);
    const { id } = useParams();
    const [roomId, setRoomId] = useState<string>("");
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState("");
    const [word, setWord] = useState("");
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [chat, setChat] = useState<{ userId: string; message: string }[]>([]);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            drawingRef.current = true;

            socket?.send(
                JSON.stringify({ action: "sendDrawing", roomid: roomId, type: "start", X: x, Y: y })
            );
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!drawingRef.current) return;

        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            socket?.send(
                JSON.stringify({ action: "sendDrawing", roomid: roomId, type: "draw", X: x, Y: y })
            );
        }
    };

    const stopDrawing = () => {
        if (drawingRef.current) {
            socket?.send(
                JSON.stringify({ action: "sendDrawing", roomid: roomId, type: "stop" })
            );
            drawingRef.current = false;
        }
    };

    const StartGame = () => {
        socket?.send(JSON.stringify({ action: "startGame", userId, roomid: roomId }));
    };

    const handleSendMessage = (message: string) => {
        socket?.send(
            JSON.stringify({ action: "sendChat", message, roomid: roomId })
        );
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.lineJoin = "round";
                ctx.lineCap = "round";
                ctx.lineWidth = 2;
            }
        }
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = function (event) {
            const parsedMessage = JSON.parse(event.data);
            console.log(parsedMessage);
            switch (parsedMessage.status) {
                case "ID":
                    setUserId(parsedMessage.userId);
                    if (id === "createRoom") {
                        socket?.send(JSON.stringify({ action: "createRoom", userId }));
                    } else if (id) {
                        socket?.send(JSON.stringify({ action: "joinRoom", userId, roomid: id }));
                    }
                    break;
                case "roomCreated":
                case "joinedRoom":
                case "playerJoined":
                    setRoomId(parsedMessage.game.roomid);
                    setPlayers(parsedMessage.game.players);
                    break;
                case "roomNotFound":
                    navigate("/");
                    break;
                case "correctGuess":
                    setPlayers(parsedMessage.players);
                    break;
                case "gameStarted":
                    setGameStarted(true);
                    setCurrentPlayer(parsedMessage.currentPlayer);
                    break;
                case "drawing":
                    handleDrawingFromServer(parsedMessage.data);
                    break;
                case "Word":
                    setWord(parsedMessage.currentWord);
                    break;
                case "nextTurn":
                    setWord("********");
                    break;
                case "chatMessage":
                    setChat(prev => [...prev, { userId: parsedMessage.userId ?? "Unknown", message: parsedMessage.message }]);
                    break;
                default:
                    console.log("Unknown status");
            }
        };
    }, [socket, id]);

    const handleDrawingFromServer = (data: any) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                if (data.type === "start") {
                    ctx.beginPath();
                    ctx.moveTo(data.X, data.Y);
                } else if (data.type === "draw") {
                    ctx.lineTo(data.X, data.Y);
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else if (data.type === "stop") {
                    ctx.closePath();
                } else if (data.type == "clear") {
                    clearCanvas()
                }
            }
        }
    };

    if (!socket) return <div>Connecting...</div>;

    return (
        <div>
            <p>Current Word: {word || "******"}</p>
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                style={{ border: "1px solid black" }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />
            <button onClick={() => {
                console.log("clear sent")
                socket?.send(
                    JSON.stringify({ action: "sendDrawing", roomid: roomId, type: "clear", })
                )
            }}>Clear</button>
            <div>
                <h1>Player List</h1>
                {players.map((pl: any, index) => (
                    <div key={index}>
                        <span className="font-bold">{pl.id} - Score: {pl.points}</span>
                    </div>
                ))}
                <p>Room ID: {roomId}</p>
                <p>Player ID: {userId}</p>
                <p>Current Player: {currentPlayer}</p>
            </div>
            <ChatBox messages={chat} handleSendMessage={handleSendMessage} userid={userId} />
            {!gameStarted && <button onClick={StartGame}>Start</button>}
        </div>
    );
}
