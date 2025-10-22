const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

// Create HTTP server for serving static files
const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'centralized_client.html'), (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

const clients = new Map(); // socket -> { username, socket }
let clientId = 0;

// MESSAGE HISTORY STORAGE (Centralized feature!)
const messageHistory = [];
const MAX_HISTORY = 100; // Keep last 100 messages

// Broadcast message to all clients except sender
function broadcast(message, sender) {
    const data = JSON.stringify(message);
    clients.forEach((client, socket) => {
        if (socket !== sender && socket.readyState === WebSocket.OPEN) {
            socket.send(data);
        }
    });
}

// Broadcast to all clients including sender
function broadcastAll(message) {
    const data = JSON.stringify(message);
    clients.forEach((client, socket) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(data);
        }
    });
}

wss.on('connection', (socket) => {
    const id = clientId++;
    console.log(`[${new Date().toISOString()}] New connection (ID: ${id})`);

    let username = null;

    socket.on('message', (data) => {
        try {
            const message = JSON.parse(data);

            switch (message.type) {
                case 'join':
                    username = message.username || `User${id}`;
                    clients.set(socket, { username, socket });

                    console.log(`[${new Date().toISOString()}] ${username} joined (Total: ${clients.size})`);

                    // Send message history to the new client
                    if (messageHistory.length > 0) {
                        socket.send(JSON.stringify({
                            type: 'history',
                            messages: messageHistory
                        }));
                        console.log(`[${new Date().toISOString()}] Sent ${messageHistory.length} messages from history to ${username}`);
                    }

                    // Send join message to all clients
                    broadcastAll({
                        type: 'system',
                        content: `${username} has joined the chat`,
                        timestamp: new Date().toISOString(),
                        variant: 'join'
                    });

                    // Send current user list to the new client
                    const userList = Array.from(clients.values()).map(c => c.username);
                    socket.send(JSON.stringify({
                        type: 'userlist',
                        users: userList
                    }));

                    break;

                case 'message':
                    if (!username) {
                        socket.send(JSON.stringify({
                            type: 'error',
                            content: 'Please set username first'
                        }));
                        return;
                    }

                    console.log(`[${new Date().toISOString()}] [RELAY] ${username}: ${message.content}`);

                    const msgData = {
                        type: 'message',
                        username: username,
                        content: message.content,
                        timestamp: new Date().toISOString()
                    };

                    // SAVE MESSAGE TO HISTORY (Centralized feature!)
                    messageHistory.push({
                        username: msgData.username,
                        content: msgData.content,
                        timestamp: msgData.timestamp
                    });

                    // Keep only last MAX_HISTORY messages
                    if (messageHistory.length > MAX_HISTORY) {
                        messageHistory.shift();
                    }

                    console.log(`[${new Date().toISOString()}] [SAVED] Message stored (Total: ${messageHistory.length})`);

                    // Broadcast to all other clients
                    broadcast(msgData, socket);

                    // Echo back to sender with confirmation
                    socket.send(JSON.stringify({
                        ...msgData,
                        own: true
                    }));

                    break;

                default:
                    console.log(`Unknown message type: ${message.type}`);
            }
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    });

    socket.on('close', () => {
        if (username) {
            console.log(`[${new Date().toISOString()}] ${username} disconnected (Total: ${clients.size - 1})`);

            clients.delete(socket);

            // Notify all clients
            broadcastAll({
                type: 'system',
                content: `${username} has left the chat`,
                timestamp: new Date().toISOString(),
                variant: 'leave'
            });
        } else {
            clients.delete(socket);
        }
    });

    socket.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

server.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  CENTRALIZED CHAT SERVER (WEB)         ║');
    console.log(`║  HTTP Server: http://localhost:${PORT.toString().padEnd(7)} ║`);
    console.log(`║  WebSocket Server: ws://localhost:${PORT.toString().padEnd(5)} ║`);
    console.log('╚════════════════════════════════════════╝\n');
});
