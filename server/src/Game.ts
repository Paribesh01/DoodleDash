
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const words = ['apple', 'banana', 'cherry', 'grape', 'orange', 'strawberry', 'melon'];

interface Game {
    roomid: string;
    players: { id: string, ws: WebSocket, points: number }[];
    messages: { userid: string, drawingData: { x: number, y: number } }[];
    admin: string;
    started: boolean;
    currentWord: string;
    playerTurnIndex: number;
}

export class GameManager {
    private games: Game[];
    private users: { ws: WebSocket, userId: string, id: string }[];

    constructor() {
        this.games = [];
        this.users = [];
    }

    addUser(ws: WebSocket) {
        const userId = this.nameGenerator();
        const id = uuidv4();
        this.users.push({ ws, userId, id });

        console.log(`User added with ID: ${userId}`);
        this.notifyUser(userId, { status: "ID", userId });
        this.handleMessages(userId, ws);
    }

    removeUser(ws: WebSocket) {
        this.users = this.users.filter(user => user.ws !== ws);
        console.log(`User disconnected and removed`);
    }

    handleMessages(userId: string, ws: WebSocket) {
        ws.on('message', (message: string) => {
            const parsedMessage = JSON.parse(message);
            const { action, roomid } = parsedMessage;

            switch (action) {
                case 'createRoom':
                    this.createRoom(userId);
                    break;
                case 'joinRoom':
                    this.joinRoom(userId, roomid);
                    break;
                case 'startGame':
                    this.startGame(userId, roomid);
                    break;
                case 'sendDrawing':
                    this.handleDrawing(userId, roomid, parsedMessage.drawingData);
                    break;
                case 'sendChat':
                    this.handleChat(userId, roomid, parsedMessage.message);
                    break;
                default:
                    console.log('Unknown action:', action);
                    break;
            }
        });
    }

    createRoom(userId: string) {
        const roomid = uuidv4();

        const ws = this.getUserSocket(userId);
        if (!ws) {
            throw new Error(`WebSocket for User ID ${userId} not found`);
        }

        const newGame: Game = {
            roomid,
            players: [{ id: userId, ws, points: 0 }],
            messages: [],
            admin: userId,
            started: false,
            currentWord: '',
            playerTurnIndex: 0
        };
        this.games.push(newGame);
        console.log(`Room created with ID: ${roomid} by User ID: ${userId}`);
        this.notifyUser(userId, { status: 'roomCreated', roomid });
    }
    joinRoom(userId: string, roomid: string) {
        const game = this.games.find(g => g.roomid === roomid);
        if (game) {
            if (game.players.length >= 4) {
                this.notifyUser(userId, { status: 'roomFull', roomid });
                return;
            }

            if (!game.players.some(player => player.id === userId)) {
                const userWs = this.getUserSocket(userId);
                if (!userWs) {
                    this.notifyUser(userId, { status: 'webSocketNotFound', roomid });
                    return;
                }
                game.players.push({ id: userId, ws: userWs, points: 0 });
                console.log(`User ID: ${userId} joined room ID: ${roomid}`);
                this.notifyUser(userId, { status: "joinedRoom", roomid })
                this.notifyAllUsersInRoom(roomid, { status: 'playerJoined', userId });
                if (game.players.length === 4) {
                    this.startGame(userId, roomid);
                }
            } else {
                this.notifyUser(userId, { status: 'alreadyInRoom', roomid });
            }
        } else {
            this.notifyUser(userId, { status: 'roomNotFound', roomid });
        }
    }


    startGame(userId: string, roomid: string) {
        const game = this.games.find(g => g.roomid === roomid);

        if (game) {
            if (game.admin !== userId) {
                this.notifyUser(userId, { status: 'notAdmin' });
                return;
            }

            if (game.players.length < 4) {
                this.notifyUser(userId, { status: 'notEnoughPlayers' });
                return;
            }

            game.started = true;
            game.currentWord = this.getRandomWord();
            game.playerTurnIndex = Math.floor(Math.random() * game.players.length);

            this.notifyAllUsersInRoom(roomid, {
                status: 'gameStarted',
                currentWord: 'Hidden',
                currentPlayer: game.players[game.playerTurnIndex].id
            });

            console.log(`Game started in room ID: ${roomid}`);
        } else {
            this.notifyUser(userId, { status: 'roomNotFound', roomid });
        }
    }

    handleDrawing(userId: string, roomid: string, drawingData: any) {
        const game = this.games.find(g => g.roomid === roomid);

        if (game && game.started) {
            const currentPlayer = game.players[game.playerTurnIndex];

            if (currentPlayer.id === userId) {
                this.notifyAllUsersInRoom(roomid, { status: 'drawing', drawingData });
            } else {
                this.notifyUser(userId, { status: 'notYourTurn' });
            }
        }
    }

    handleChat(userId: string, roomid: string, message: string) {
        const game = this.games.find(g => g.roomid === roomid);

        if (game && game.started) {
            if (message.toLowerCase() === game.currentWord.toLowerCase()) {
                this.notifyAllUsersInRoom(roomid, { status: 'correctGuess', userId });
                this.assignPoint(userId, roomid);
                this.nextTurn(roomid);
            } else {
                this.notifyAllUsersInRoom(roomid, { status: 'chatMessage', userId, message });
            }
        }
    }

    assignPoint(userId: string, roomid: string) {
        const game = this.games.find(g => g.roomid === roomid);

        if (game) {
            const player = game.players.find(p => p.id === userId);
            if (player) {
                player.points += 1;
                console.log(`User ID: ${userId} gained a point in room ID: ${roomid}`);
            }
        }
    }

    nextTurn(roomid: string) {
        const game = this.games.find(g => g.roomid === roomid);

        if (game) {
            game.playerTurnIndex = (game.playerTurnIndex + 1) % game.players.length;
            game.currentWord = this.getRandomWord();

            this.notifyAllUsersInRoom(roomid, {
                status: 'nextTurn',
                currentPlayer: game.players[game.playerTurnIndex].id,
                currentWord: 'Hidden'
            });

            console.log(`Next turn in room ID: ${roomid}`);
        }
    }

    notifyUser(userId: string, message: object) {
        const user = this.users.find(u => u.userId === userId);

        if (user && user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify(message));
        }
    }

    notifyAllUsersInRoom(roomid: string, message: object) {
        const game = this.games.find(g => g.roomid === roomid);

        if (game) {
            game.players.forEach(player => {
                if (player.ws.readyState === WebSocket.OPEN) {
                    player.ws.send(JSON.stringify(message));
                }
            });
        }
    }

    getRandomWord(): string {
        return words[Math.floor(Math.random() * words.length)];
    }

    nameGenerator() {
        const config: Config = {
            dictionaries: [adjectives, colors, animals],
            separator: ' ',
            style: 'capital',
            length: 2
        };
        return uniqueNamesGenerator(config);
    }

    getUserSocket(userId: string): WebSocket | null {
        const user = this.users.find(u => u.userId === userId);
        return user ? user.ws : null;
    }

}
