import { WebSocketServer, WebSocket } from 'ws';

const wsServer = new WebSocketServer({ port: 8080 });
const players = new Map();

wsServer.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('Raw data received:', data.toString());

        let parsedData;
        try {
            parsedData = JSON.parse(data);
        } catch (e) {
            console.error('Error parsing JSON:', e, 'Data received:', data);
            return;
        }

        if (!parsedData.type) {
            console.error('Invalid message: missing type', parsedData);
            return;
        }

        try {
            switch(parsedData.type){
                case 'connection':
                    if (!parsedData.playerId) {
                        console.error('Invalid connection message: missing playerId', parsedData);
                        return;
                    }
                    console.log('Player connected with id: ', parsedData.playerId);
                    players.set(parsedData.playerId, ws);
                    break;
                case 'create-game':
                    if (!parsedData.gameId || !parsedData.playerId) {
                        console.error('Invalid create-game message: missing gameId or playerId', parsedData);
                        return;
                    }
                    console.log('Game created game with id: ', parsedData.gameId, ' and player id: ', parsedData.playerId);
                    break;
                case 'join-game':
                    if (!parsedData.gameId || !parsedData.playerId) {
                        console.error('Invalid join-game message: missing gameId or playerId', parsedData);
                        return;
                    }
                    console.log('Player joined game with id: ', parsedData.gameId, ' and player id: ', parsedData.playerId);
                    players.set(parsedData.playerId, ws);
                    break;
                case 'send-move':
                    if (!parsedData.coordinates || !parsedData.gameId || !parsedData.sender || !parsedData.receiver) {
                        console.error('Invalid send-move message: missing coordinates, gameId, sender, or receiver', parsedData);
                        return;
                    }
                    console.log('Move sent: ', parsedData.coordinates, 'game id: ', parsedData.gameId, 'from player: ', parsedData.sender);
                    const targetWsSendMove = players.get(parsedData.receiver);
                    if (targetWsSendMove && targetWsSendMove.readyState === WebSocket.OPEN) {
                        targetWsSendMove.send(JSON.stringify(parsedData));
                    } else {
                        console.log('Player not connected or WebSocket not open');
                    }
                    break;           
                case 'move':
                    if (!parsedData.coordinates || !parsedData.gameId || !parsedData.sender || !parsedData.receiver) {
                        console.error('Invalid move message: missing coordinates, gameId, sender, or receiver', parsedData);
                        return;
                    }
                    console.log('Move received: ', parsedData);
                    console.log('Sending move to player: ', parsedData.receiver);
                    const targetWs = players.get(parsedData.receiver);
                    if (targetWs && targetWs.readyState === WebSocket.OPEN) {
                        targetWs.send(JSON.stringify(parsedData));
                    } else {
                        console.log('Player not connected or WebSocket not open');
                    }
                    break;
                default:
                    console.log('Unknown message type: ', parsedData);
            }
        } catch (e) {
            console.error('Error handling message:', e, 'Parsed data:', parsedData);
        }
    });

    ws.on('close', () => {
        try {
            for (const [playerId, clientWs] of players.entries()) {
                if (clientWs === ws) {
                    players.delete(playerId);
                    break;
                }
            }
        } catch (e) {
            console.error('Error handling close event:', e);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});