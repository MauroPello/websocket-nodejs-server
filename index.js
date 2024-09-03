import { WebSocketServer, WebSocket } from 'ws';

const topics = {};
const wss = new WebSocketServer({ port: 20000 });

wss.on('connection', (ws) => {
    console.log('New connection accepted.');

    ws.on('message', (rawMessage) => {
        console.log('Message arrived: \n' + rawMessage);
        const message = JSON.parse(rawMessage);
        const { type, topic } = message;

        switch (type) {
            case 'subscribe':
                console.log(`New subscription\n- topic ${topic}\n`);

                // create topic if it wasn't there already
                if (!topics[topic]) {
                    topics[topic] = [];
                }

                // add client to topic
                topics[topic].push(ws);

                // when client closes connection, remove it from the topic
                ws.on('close', () => {
                    topics[topic].filter(client => client !== ws);

                    // delete the topic if it was the last client connected
                    if (topics[topic].size === 0) {
                        delete topics[topic];
                    }
                });

                break;
            case 'publish':
                const messagePayload = JSON.stringify(message.msg);
                console.log(`Publish msg\n- topic ${topic}\n- msg ${messagePayload}`);

                // send message to all clients subscribed to the topic if it exists
                if (topics[topic]) {
                    topics[topic].forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(messagePayload);
                        }
                    });
                }
                break;
            default:
                console.log('Unknown message type');
                break;
        }
    });
});
