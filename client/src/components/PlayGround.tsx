import { useSocket } from "@/hooks/usesocket";
import { Chat } from "./Chat";
import { PlayerList } from "./PlayerList";
import { Whiteboard } from "./Whiteboard";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Playground() {
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
  const [Turnwinner, setTurnWinner] = useState("");
  const [TurnWord, setTurnWord] = useState("");
  const [admin, setAdmin] = useState("");
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);

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
    const { x, y } = getMousePosition(e);
    drawingRef.current = true;

    socket?.send(
      JSON.stringify({
        action: "sendDrawing",
        roomid: roomId,
        type: "start",
        X: x,
        Y: y,
      })
    );
  };

  const getMousePosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;

    const { x, y } = getMousePosition(e);

    socket?.send(
      JSON.stringify({
        action: "sendDrawing",
        roomid: roomId,
        type: "draw",
        X: x,
        Y: y,
      })
    );
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
    socket?.send(
      JSON.stringify({ action: "startGame", userId, roomid: roomId })
    );
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
          } else if (id == "randomRoom") {
            socket?.send(JSON.stringify({ action: "joinRoom", userId }));
          } else if (id) {
            socket?.send(
              JSON.stringify({ action: "joinRoom", userId, roomid: id })
            );
          }
          break;
        case "roomCreated":
          setAdmin(parsedMessage.game.admin);
          setRoomId(parsedMessage.game.roomid);
          setPlayers(parsedMessage.game.players);
          break;
        case "joinedRoom":
          setAdmin(parsedMessage.game.admin);
          setRoomId(parsedMessage.game.roomid);
          setPlayers(parsedMessage.game.players);

          break;
        case "playerJoined":
          setAdmin(parsedMessage.game.admin);
          setRoomId(parsedMessage.game.roomid);
          setPlayers(parsedMessage.game.players);
          break;
        case "roomNotFound":
          navigate("/");
          break;
        case "correctGuess":
          setTurnWinner(parsedMessage.userId);
          setTurnWord(parsedMessage.word);
          setIsOverlayOpen(true);
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
          setCurrentPlayer(parsedMessage.currentPlayer);
          setWord("********");
          break;
        case "playerLeft":
          setGameStarted(parsedMessage.game.started);
          setAdmin(parsedMessage.game.admin);
          setPlayers(parsedMessage.game.players);
          break;
        case "gameOver":
          if (parsedMessage.winner) {
            alert(
              `Winner is ${parsedMessage.winner.id} with point ${parsedMessage.winner.points}`
            );
            navigate("/");
          } else {
            alert(`NO Winner`);
            navigate("/");
          }
          setGameStarted(false);
          break;
        case "gameStopped":
          clear();
          setGameStarted(false);
          break;
        case "chatMessage":
          setChat((prev) => [
            ...prev,
            {
              userId: parsedMessage.userId ?? "Unknown",
              message: parsedMessage.message,
            },
          ]);
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
          clearCanvas();
        }
      }
    }
  };
  const clear = () => {
    socket?.send(
      JSON.stringify({ action: "sendDrawing", roomid: roomId, type: "clear" })
    );
  };

  if (!socket) return <div>Connecting...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-orange-400 p-4 overflow-auto">
      {/* <WinnerOverlay
                winner={Turnwinner}
                word={TurnWord}
                isOpen={isOverlayOpen}
                onClose={() => setIsOverlayOpen(false)}
            /> */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 h-[calc(100vh-2rem)]">
        {/* Chat Section */}
        <div className="col-span-12 md:col-span-3">
          <Chat
            roomId={roomId}
            messages={chat}
            handleSendMessage={handleSendMessage}
            userid={userId}
          />
        </div>

        {/* Whiteboard Section */}
        <div className="col-span-12 md:col-span-6">
          <Whiteboard
            setIsOverlayOpen={setIsOverlayOpen}
            winner={Turnwinner}
            Turnword={TurnWord}
            isOpen={isOverlayOpen}
            clear={clear}
            word={word}
            canvasRef={canvasRef}
            startDrawing={startDrawing}
            draw={draw}
            stopDrawing={stopDrawing}
          />
        </div>

        {/* Player List Section */}
        <div className="col-span-12 md:col-span-3">
          <PlayerList
            userId={userId}
            admin={admin}
            currentPlayer={currentPlayer}
            gameStarted={gameStarted}
            StartGame={StartGame}
            players={players}
          />
        </div>
      </div>
    </div>
  );
}
