const WebSocket = require('ws');

const broadcast = (wss, data) => {
    console.log('Broadcasting message:', data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

module.exports = broadcast;
