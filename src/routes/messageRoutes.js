const url = require('url');
const FixedQueue = require('../models/FixedQueue');
const broadcast = require('../utils/broadcast');

let messages = new FixedQueue(9);

const messageRoutes = (req, res, wss) => {
    const parsedUrl = url.parse(req.url, true);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && parsedUrl.pathname === '/messages') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { message } = JSON.parse(body);

            if (!message) {
                res.statusCode = 400;
                res.end('Message is required');
                return;
            }

            const deletedMessage = (messages.queue.length >= messages.limit) ? messages.queue[0] : null;
            messages.enqueue(message);

            if (deletedMessage) {
                console.log('Message deleted:', deletedMessage);
                broadcast(wss, { type: 'deleted', message: deletedMessage });
            }

            console.log('Message created:', message);
            res.statusCode = 201;
            res.end('Message created');
            broadcast(wss, { type: 'created', message });
        });
    } else if (req.method === 'GET' && parsedUrl.pathname === '/messages') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(messages.getItems()));
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
};

module.exports = messageRoutes;
