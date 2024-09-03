import { WebSocketServer } from 'ws';

// node index.js

const server = new WebSocketServer({ port: 20000 });

server.on('connection', (client) => {
    console.log('Client connected');

    client.on('message', (data) => {
        console.log(data);
    });
});