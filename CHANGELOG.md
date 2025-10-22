# Changelog

## [2024-10-22] - Message History Feature Added

### ✨ New Features

#### Centralized Chat - Message History
Added server-side message storage to demonstrate a key difference between centralized and decentralized architectures.

**Server Changes (`centralized_server.js`):**
- ✅ Added in-memory message history array (stores last 100 messages)
- ✅ Messages automatically saved when sent
- ✅ History sent to new clients on join
- ✅ Server logs show "[SAVED]" when storing messages
- ✅ Console shows history count when sending to new users

**Client Changes (`centralized_client.html`):**
- ✅ Added `displayHistory()` function to render stored messages
- ✅ Visual "📜 Message History" banner with message count
- ✅ History messages displayed with grayed-out style
- ✅ "📍 End of History" divider separates old from new
- ✅ Updated subtitle to show "+ Message History"

### 🎯 Why This Feature?

This feature clearly demonstrates the **fundamental difference** between centralized and decentralized systems:

**Centralized:**
- Server has authority and storage
- Can provide context to late joiners
- Messages persist (while server runs)
- Trade-off: Privacy concerns, server dependency

**Decentralized:**
- No central storage
- Ephemeral messages
- Maximum privacy
- Trade-off: No history for late joiners

### 📊 Visual Differences

| When | Centralized (8080) | P2P (8081) |
|------|-------------------|------------|
| **Join as 3rd user** | See 📜 Message History banner | Clean slate, no messages |
| **Server console** | "[SAVED] Message stored (Total: X)" | No storage logs |
| **Message appearance** | History messages grayed out | All messages same style |
| **Late joiners** | Full context provided | Miss all previous messages |

### 🧪 Testing

```bash
# Start both servers
docker-compose up -d

# Test Centralized (http://localhost:8080)
1. Browser A: Join as "Alice", send "Hello World"
2. Browser B: Join as "Bob", send "Hi Alice"
3. Browser C: Join as "Charlie" → SEE HISTORY! 📜

# Test P2P (http://localhost:8081)
1. Browser A: Join as "Alice", send "Hello World"
2. Browser B: Join as "Bob", send "Hi Alice"
3. Browser C: Join as "Charlie" → NO HISTORY (clean slate)
```

### 📝 Documentation Updates

- ✅ Updated `README.md` with message history feature
- ✅ Created `FEATURES_COMPARISON.md` with detailed comparison
- ✅ Updated feature matrix table
- ✅ Added testing instructions for history feature

### 🚀 Future Enhancements (Not Implemented)

Could be added to further demonstrate centralized features:
- [ ] Persistent storage (database)
- [ ] Message search
- [ ] User authentication
- [ ] Message moderation/deletion
- [ ] Export chat history
- [ ] Message encryption

---

## [2024-10-22] - Docker & Project Restructure

### 🐳 Docker Support
- ✅ Added `Dockerfile.centralized` for centralized chat
- ✅ Added `Dockerfile.p2p` for P2P chat
- ✅ Added `docker-compose.yml` for easy deployment
- ✅ Health checks for both services
- ✅ Auto-restart on failure
- ✅ Local network ready (ports 8080, 8081)

### 📁 Project Restructure
- ✅ Moved web files from `web/` to project root
- ✅ Updated all paths and references
- ✅ Created `PROJECT_STRUCTURE.md`
- ✅ Updated `.gitignore`

---

## [2024-10-22] - Initial Release

### 🎉 Features
- ✅ C terminal-based chat (centralized + P2P)
- ✅ Web-based chat with modern UI
- ✅ WebSocket for centralized communication
- ✅ WebRTC for P2P communication
- ✅ Complete documentation
- ✅ Build system (Makefile + npm)
