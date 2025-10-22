# Web-Based Centralized vs Decentralized Chat

A modern web interface demonstrating the difference between **centralized** (WebSocket) and **decentralized** (WebRTC P2P) communication architectures.

## Architecture Overview

### Centralized Mode (WebSocket)
```
Browser A ----\
               \
Browser B -------> Node.js WebSocket Server
               /
Browser C ----/
```
- All messages routed through WebSocket server
- Server relays messages to all connected clients
- Traditional client-server architecture

### Decentralized Mode (WebRTC P2P)
```
Browser A <-----WebRTC-----> Browser B
    ^                           ^
    |                           |
    WebRTC                      WebRTC
    |                           |
    v                           v
Browser C <-----WebRTC-----> Browser D
         \                   /
          \                 /
           Signaling Server
           (connection setup only)
```
- Browsers connect directly via WebRTC data channels
- Signaling server only used for initial connection setup
- Messages sent peer-to-peer (no server relay)
- Message flooding for multi-peer distribution

## Features

### Centralized Mode
- ✅ WebSocket-based real-time communication
- ✅ Server relays all messages
- ✅ **Message History** - Server stores last 100 messages
- ✅ New users receive full message history on join
- ✅ User list with online status
- ✅ Join/leave notifications
- ✅ Modern gradient UI (purple theme)

### Decentralized Mode
- ✅ WebRTC peer-to-peer data channels
- ✅ Direct browser-to-browser communication
- ✅ Signaling server only for connection setup
- ✅ **No message history** - Messages not stored anywhere
- ✅ Message flooding across peer network
- ✅ Peer connection status indicators
- ✅ Modern gradient UI (pink theme)

## Prerequisites

**Option 1: Docker (Recommended)**
- Docker Engine 20.10+
- Docker Compose v2.0+

**Option 2: Manual Installation**
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Modern web browser (Chrome, Firefox, Edge, Safari)

## Installation & Usage

### Option 1: Using Docker (Recommended - Works on Local Network)

This is the easiest way to run both services and makes them accessible across your local network.

1. **Start both services with Docker Compose:**
```bash
docker-compose up -d
```

2. **Access the services:**
   - **Centralized Chat**: `http://<YOUR_LOCAL_IP>:8080` or `http://localhost:8080`
   - **P2P Chat**: `http://<YOUR_LOCAL_IP>:8081` or `http://localhost:8081`

3. **Find your local IP address:**
   ```bash
   # Linux/Mac
   ip addr show | grep "inet " | grep -v 127.0.0.1
   # or
   hostname -I

   # Windows
   ipconfig | findstr IPv4
   ```

4. **Stop the services:**
```bash
docker-compose down
```

5. **View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f centralized-chat
docker-compose logs -f p2p-chat
```

6. **Rebuild after changes:**
```bash
docker-compose up -d --build
```

**Access from other devices on your local network:**
- Replace `localhost` with your machine's local IP address (e.g., `192.168.1.100:8080`)
- Make sure your firewall allows connections on ports 8080 and 8081

### Option 2: Manual Installation

1. Install dependencies in the project root:
```bash
npm install
```

## Usage (Manual)

### Running Centralized Chat

1. Start the centralized WebSocket server:
```bash
npm run start:centralized
```

2. Open multiple browser windows/tabs and navigate to:
```
http://localhost:8080
```

3. Enter different usernames in each window and start chatting!

**How it works:**
- Each browser connects to the WebSocket server
- When you send a message, it goes to the server
- Server broadcasts the message to all other connected clients
- All communication flows through the central server

### Running P2P Decentralized Chat

1. Start the P2P signaling server:
```bash
npm run start:p2p
```

2. Open multiple browser windows/tabs and navigate to:
```
http://localhost:8081
```

3. Enter different usernames in each window

4. Wait a few seconds for WebRTC connections to establish

5. Start chatting!

**How it works:**
- Each browser connects to the signaling server initially
- Signaling server helps browsers discover each other
- Browsers establish direct WebRTC peer-to-peer connections
- Messages are sent directly between browsers (no server relay)
- Messages are automatically forwarded to all peers (flooding algorithm)

## Key Differences Demonstrated

| Aspect | Centralized (WebSocket) | Decentralized (WebRTC P2P) |
|--------|------------------------|----------------------------|
| **Connection** | Browser ↔ Server | Browser ↔ Browser |
| **Message Path** | Through server | Direct peer-to-peer |
| **Message History** | ✅ Last 100 messages stored | ❌ No history (ephemeral) |
| **Server Role** | Relay + store all messages | Initial signaling only |
| **Scalability** | Server bandwidth limits | Distributed load |
| **Privacy** | Server sees all messages | Messages never touch server |
| **Failure Point** | Server failure = total outage | Individual peer failure OK |
| **Latency** | Server round-trip | Direct peer connection |
| **Complexity** | Simple | More complex setup |

## Technical Details

### Centralized Mode Technologies
- **Backend**: Node.js with `ws` WebSocket library
- **Frontend**: Vanilla JavaScript with WebSocket API
- **Protocol**: WebSocket (ws://)
- **Message Flow**: Client → Server → All Clients

### Decentralized Mode Technologies
- **Backend**: Node.js with `ws` (signaling only)
- **Frontend**: Vanilla JavaScript with WebRTC API
- **Protocols**:
  - WebSocket (ws://) for signaling
  - WebRTC Data Channels for P2P communication
- **STUN Servers**: Google's public STUN servers for NAT traversal
- **Message Flow**: Client → Direct to Peers → Flooded to network

### WebRTC P2P Connection Process
1. Browser connects to signaling server via WebSocket
2. Signaling server provides list of available peers
3. Browsers exchange SDP offers/answers via signaling server
4. Browsers exchange ICE candidates for NAT traversal
5. Direct WebRTC data channel established between peers
6. Messages sent directly peer-to-peer
7. Each peer forwards messages to other connected peers

## Running on Different Ports

### Centralized:
```bash
PORT=3000 npm run start:centralized
```
Then open: `http://localhost:3000`

### P2P:
```bash
PORT=3001 npm run start:p2p
```
Then open: `http://localhost:3001`

## Testing Locally

### Test Centralized Mode:
1. Open 3 browser windows to `http://localhost:8080`
2. Name them: Alice, Bob, Charlie
3. Send messages from each
4. Observe: All messages go through server (check server console)
5. **Close one browser and reopen** → Message history appears!
6. Stop the server → All clients disconnect immediately (but history is lost)

### Test P2P Mode:
1. Open 3 browser windows to `http://localhost:8081`
2. Name them: Alice, Bob, Charlie
3. Wait for "P2P connection established" messages
4. Send messages from each
5. Observe: Messages delivered peer-to-peer (check browser console)
6. Stop the signaling server → Existing P2P connections continue working!
7. Close one browser → Other browsers remain connected

## Browser Console Debugging

Open Developer Tools (F12) to see:

**Centralized Mode:**
- WebSocket connection status
- Message send/receive events

**P2P Mode:**
- Signaling messages
- WebRTC connection states
- ICE candidate exchanges
- Data channel open/close events
- Peer connection diagnostics

## Network Architecture Visualization

### Centralized: Star Topology
```
        Server
       /  |  \
      /   |   \
     A    B    C
```
All communication through central hub

### Decentralized: Mesh Topology
```
     A ---- B
     |  X   |
     |   X  |
     C ---- D
```
Each peer connects to every other peer

## Limitations & Notes

- **P2P Mode**: May require TURN server for restrictive NATs/firewalls
- **P2P Mode**: Currently uses message flooding (simple but not optimal for large networks)
- **Both Modes**: For demo purposes only, not production-ready
- **Security**: No encryption, authentication, or input sanitization
- **Scalability**: Limited to ~10-20 peers in P2P mode

## Production Considerations

For production use, you would need:

1. **Security**:
   - HTTPS/WSS (TLS encryption)
   - User authentication
   - Input validation & sanitization
   - Rate limiting

2. **P2P Enhancements**:
   - TURN server for NAT traversal
   - Efficient routing (not flooding)
   - Peer discovery mechanisms
   - Connection quality monitoring

3. **Centralized Enhancements**:
   - Load balancing
   - Redis for horizontal scaling
   - Message persistence
   - Reconnection logic

## Learning Objectives

This demo illustrates:

1. ✅ **Centralized systems** are simpler but create bottlenecks and single points of failure
2. ✅ **Decentralized systems** are more resilient but require complex peer management
3. ✅ **WebRTC** enables true peer-to-peer communication in browsers
4. ✅ **Trade-offs** between simplicity and resilience in system architecture

## Docker Architecture

The Docker setup includes:

- **Two separate containers**: One for centralized chat, one for P2P chat
- **Bridge network**: Both containers on the same Docker network
- **Port mapping**: 8080 (centralized) and 8081 (P2P) exposed to host
- **Health checks**: Automatic health monitoring for both services
- **Auto-restart**: Containers restart automatically on failure
- **Lightweight**: Alpine Linux base images (~50MB each)

## Troubleshooting

**Problem**: P2P connections not establishing
- **Solution**: Check browser console for errors, ensure STUN servers are reachable, try different browsers

**Problem**: Messages not appearing in P2P mode
- **Solution**: Wait for "P2P connection established" message, check data channel status in console

**Problem**: "Module not found" error
- **Solution**: Run `npm install` in the project root (manual install) or rebuild Docker containers

**Problem**: Port already in use
- **Solution (Manual)**: Change port: `PORT=9000 npm run start:centralized`
- **Solution (Docker)**: Edit `docker-compose.yml` to change the host port mapping (e.g., `"9000:8080"`)

**Problem**: Can't access from other devices on local network
- **Solution**:
  - Check your firewall settings (allow ports 8080 and 8081)
  - Verify your local IP with `hostname -I` or `ipconfig`
  - Make sure devices are on the same network
  - Try `http://0.0.0.0:8080` to bind to all interfaces (manual mode)

**Problem**: Docker containers won't start
- **Solution**:
  - Check logs: `docker-compose logs`
  - Ensure ports aren't already in use: `docker ps`
  - Rebuild: `docker-compose up -d --build --force-recreate`

## License

MIT License - Educational demonstration project
