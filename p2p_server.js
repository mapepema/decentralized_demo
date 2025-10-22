const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8081;

// Create HTTP server for serving static files
const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'p2p_client.html'), (err, data) => {
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

// Create WebSocket server for signaling only
const wss = new WebSocket.Server({ server });

const peers = new Map(); // socket -> { id, username, socket }
let peerId = 0;

// Broadcast to all peers
function broadcastAll(message) {
    const data = JSON.stringify(message);
    peers.forEach((peer, socket) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(data);
        }
    });
}

// Send to specific peer by ID
function sendToPeer(targetId, message) {
    peers.forEach((peer, socket) => {
        if (peer.id === targetId && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    });
}

wss.on('connection', (socket) => {
    const id = `peer_${peerId++}`;
    console.log(`[${new Date().toISOString()}] New peer connected (ID: ${id})`);

    let username = null;

    socket.on('message', (data) => {
        try {
            const message = JSON.parse(data);

            switch (message.type) {
                case 'register':
                    username = message.username || id;
                    peers.set(socket, { id, username, socket });

                    console.log(`[${new Date().toISOString()}] ${username} registered (ID: ${id})`);

                    // Send peer ID back
                    socket.send(JSON.stringify({
                        type: 'registered',
                        id: id,
                        username: username
                    }));

                    // Get list of other peers
                    const peerList = Array.from(peers.entries())
                        .filter(([s]) => s !== socket)
                        .map(([, peer]) => ({
                            id: peer.id,
                            username: peer.username
                        }));

                    // Send peer list to new peer
                    socket.send(JSON.stringify({
                        type: 'peerlist',
                        peers: peerList
                    }));

                    // Notify other peers about new peer
                    broadcastAll({
                        type: 'peer-joined',
                        peer: { id, username }
                    });

                    break;

                case 'signal':
                    // Forward WebRTC signaling messages
                    console.log(`[${new Date().toISOString()}] Signaling ${message.signal.type} from ${id} to ${message.targetId}`);

                    sendToPeer(message.targetId, {
                        type: 'signal',
                        fromId: id,
                        fromUsername: username,
                        signal: message.signal
                    });
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
            console.log(`[${new Date().toISOString()}] ${username} (${id}) disconnected`);

            peers.delete(socket);

            // Notify other peers
            broadcastAll({
                type: 'peer-left',
                peer: { id, username }
            });
        } else {
            peers.delete(socket);
        }
    });

    socket.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

server.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  P2P CHAT SIGNALING SERVER (WEB)       ║');
    console.log(`║  HTTP Server: http://localhost:${PORT.toString().padEnd(7)} ║`);
    console.log(`║  WebSocket Server: ws://localhost:${PORT.toString().padEnd(5)} ║`);
    console.log('║  (Signaling only - messages are P2P)   ║');
    console.log('╚════════════════════════════════════════╝\n');
});
