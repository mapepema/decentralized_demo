# Project Structure

```
decentralized/
├── .git/                          # Git repository
├── .gitignore                     # Git ignore patterns
├── node_modules/                  # Node.js dependencies
│
├── common.h                       # C: Shared utilities and definitions
├── centralized_server.c           # C: Central server implementation
├── centralized_client.c           # C: Client for centralized mode
├── p2p_client.c                   # C: P2P decentralized client
├── Makefile                       # Build system for C programs
│
├── centralized_server.js          # Web: Node.js WebSocket server
├── centralized_client.html        # Web: Centralized chat UI
├── p2p_server.js                  # Web: WebRTC signaling server
├── p2p_client.html                # Web: P2P chat UI
├── package.json                   # Node.js dependencies
├── package-lock.json              # Locked dependency versions
│
├── Dockerfile.centralized         # Docker: Centralized server container
├── Dockerfile.p2p                 # Docker: P2P server container
├── docker-compose.yml             # Docker: Orchestration for both services
│
├── README.md                      # Main documentation
└── PROJECT_STRUCTURE.md           # This file
```

## Quick Start

### C Terminal Version
```bash
make                                    # Build all C programs
./centralized_server 8080               # Terminal: Start centralized server
./centralized_client 127.0.0.1 8080 Alice  # Terminal: Connect client
./p2p_client 9001 Bob                   # Terminal: Start P2P client
```

### Web Version (Manual)
```bash
npm install                             # Install dependencies
npm run start:centralized               # Start centralized web server
npm run start:p2p                       # Start P2P web server
```

### Web Version (Docker - Recommended)
```bash
docker-compose up -d                    # Start both services
docker-compose logs -f                  # View logs
docker-compose down                     # Stop services
```

## Access Web Version

- **Centralized Chat**: http://localhost:8080
- **P2P Chat**: http://localhost:8081

From local network: Replace `localhost` with your IP (e.g., `192.168.1.100:8080`)

## Components

### C Programs (Terminal)
- Pure C implementation with POSIX sockets
- pthread for concurrency
- Direct terminal I/O
- Educational low-level networking

### Web Version (Browser)
- Node.js backend with WebSocket/WebRTC
- Modern HTML5 + CSS3 + Vanilla JS
- No frameworks required
- Browser-based UI with gradients and animations

### Docker
- Containerized deployment
- Local network ready
- Auto-restart and health checks
- Production-ready setup
