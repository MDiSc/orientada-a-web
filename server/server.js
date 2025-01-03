import { WebSocketServer } from 'ws';

const wsServer = new WebSocketServer({ port: 8080 });
wsServer.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });
    ws.send('something');
});