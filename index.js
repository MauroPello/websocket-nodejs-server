import { WebSocketServer } from 'ws';

// node index.js

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    console('Client connected');

    ws.on('message', (data) => {
        console.log(data);
    });
});