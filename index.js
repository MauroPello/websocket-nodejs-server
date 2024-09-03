import { WebSocketServer, WebSocket } from 'ws';

const topicsClients = {};
const server = new WebSocketServer({ port: 20000 });

server.on('connection', (client) => {
    client.on('message', (rawMessage) => {
        const message = JSON.parse(rawMessage);
        const { type, topic } = message;

        switch (type) {
            case 'subscribe':
                console.log("New subscription to topic ", topic);

                // if it's a new topic create it
                if (!topicsClients[topic]) {
                    topicsClients[topic] = [];
                }

                // add client to topic
                topicsClients[topic].push(client);

                // when client closes connection, remove it from the topic
                client.on('close', () => {
                    topicsClients[topic] = topicsClients[topic].filter(c => c !== client);

                    // delete the topic if it was the last client connected
                    if (topicsClients[topic].length === 0) {
                        delete topicsClients[topic];
                    }
                });

                break;
            case 'publish':
                const payload = JSON.stringify(message.payload);
                console.log(`New message on topic ${topic} with payload: `, payload);

                // send message to all clients subscribed to the topic
                topicsClients[topic]?.filter(client => client.readyState !== WebSocket.OPEN).forEach(client => client.send(payload));
                break;
            default:
                console.log('Unknown message type');
                break;
        }
    });
});
