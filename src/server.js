require('dotenv').config();
const http = require('http');
const WebSocket = require('ws');
const messageRoutes = require('./routes/messageRoutes');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    messageRoutes(req, res, wss);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    ws.on('message', (message) => {
        console.log('WebSocket message received:', message);
    });

    ws.on('close', (event) => {
        if (event.wasClean) {
            console.log(`WebSocket connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.error('WebSocket connection closed unexpectedly');
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
