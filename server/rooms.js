const rooms = new Map()

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // excludes 0, O, I, 1
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    if (!rooms.has(code)) return code
  }
  throw new Error('Could not generate unique room code')
}

function createRoom(hostId, nickname, vibes) {
  const code = generateRoomCode()
  const room = {
    code,
    hostId,
    vibes,
    players: new Map([[hostId, { id: hostId, nickname, isHost: true }]]),
    state: 'lobby',
    currentQuestion: null,
    answers: new Map(),
    questionHistory: [],
    lastActivityAt: new Date(),
  }
  rooms.set(code, room)
  return room
}

function joinRoom(code, socketId, nickname) {
  const room = rooms.get(code)
  if (!room) return { error: 'Room not found' }

  // Check for reconnection: same nickname, disconnected within grace period
  for (const [oldSocketId, player] of room.players) {
    if (player.nickname === nickname && player.disconnectedAt) {
      const gracePeriod = 30 * 1000
      if (Date.now() - player.disconnectedAt < gracePeriod) {
        const reconnectedPlayer = { ...player, id: socketId, disconnectedAt: undefined }
        room.players.delete(oldSocketId)
        room.players.set(socketId, reconnectedPlayer)
        if (room.hostId === oldSocketId) room.hostId = socketId
        // Migrate their answer if they had submitted one
        const answer = room.answers.get(oldSocketId)
        if (answer !== undefined) {
          room.answers.delete(oldSocketId)
          room.answers.set(socketId, answer)
        }
        room.lastActivityAt = new Date()
        return { player: reconnectedPlayer, reconnected: true }
      }
    }
  }

  // Not a reconnect — reject mid-game joins
  if (room.state === 'playing' || room.state === 'results') {
    return { error: 'Game already in progress' }
  }

  if (room.players.has(socketId)) return { error: 'Already in room' }

  const player = { id: socketId, nickname, isHost: false }
  room.players.set(socketId, player)
  room.lastActivityAt = new Date()
  return { player }
}

function removePlayer(socketId) {
  let foundRoom = null
  let foundCode = null

  for (const [code, room] of rooms) {
    if (room.players.has(socketId)) {
      foundRoom = room
      foundCode = code
      break
    }
  }

  if (!foundRoom) return null

  const player = foundRoom.players.get(socketId)
  const wasHost = foundRoom.hostId === socketId

  // Mark as disconnected (grace period for reconnect)
  foundRoom.players.set(socketId, { ...player, disconnectedAt: Date.now() })

  const activePlayers = [...foundRoom.players.values()].filter(p => !p.disconnectedAt)

  if (activePlayers.length === 0) {
    rooms.delete(foundCode)
    return { roomCode: foundCode, wasHost, isEmpty: true, newHostId: null }
  }

  let newHostId = null
  if (wasHost) {
    const newHost = activePlayers[0]
    newHost.isHost = true
    foundRoom.players.set(newHost.id, newHost)
    foundRoom.hostId = newHost.id
    newHostId = newHost.id
  }

  foundRoom.lastActivityAt = new Date()
  return { roomCode: foundCode, wasHost, isEmpty: false, newHostId }
}

function recordAnswer(roomCode, socketId, choice) {
  const room = rooms.get(roomCode)
  if (!room) return null
  if (room.answers.has(socketId)) return null // already answered

  room.answers.set(socketId, choice)
  room.lastActivityAt = new Date()

  const activePlayers = [...room.players.values()].filter(p => !p.disconnectedAt)
  const activeIds = new Set(activePlayers.map(p => p.id))
  const answered = [...room.answers.keys()].filter(id => activeIds.has(id)).length
  const total = activePlayers.length
  const allAnswered = answered >= total

  return { answered, total, allAnswered }
}

function revealResults(roomCode) {
  const room = rooms.get(roomCode)
  if (!room) return null

  let A = 0, B = 0
  for (const choice of room.answers.values()) {
    if (choice === 'A') A++
    else B++
  }

  room.state = 'results'
  return { A, B }
}

function startNextQuestion(roomCode, question) {
  const room = rooms.get(roomCode)
  if (!room) return false

  room.currentQuestion = question
  room.answers = new Map()
  room.state = 'playing'
  if (question.text) room.questionHistory.push(question.text)
  room.lastActivityAt = new Date()
  return true
}

function getRoomPublic(code) {
  const room = rooms.get(code)
  if (!room) return null

  return {
    code: room.code,
    hostId: room.hostId,
    vibes: room.vibes,
    players: [...room.players.values()].filter(p => !p.disconnectedAt),
    state: room.state,
    currentQuestion: room.currentQuestion,
  }
}

function getRoomByHost(hostId) {
  for (const room of rooms.values()) {
    if (room.hostId === hostId) return room
  }
  return null
}

function getRoomCodeForPlayer(socketId) {
  for (const [code, room] of rooms) {
    if (room.players.has(socketId)) return code
  }
  return null
}

function getRoom(code) {
  return rooms.get(code)
}

// Stale room cleanup: every 10 minutes, delete rooms inactive > 2 hours
setInterval(() => {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
  for (const [code, room] of rooms) {
    if (room.lastActivityAt < twoHoursAgo) {
      rooms.delete(code)
    }
  }
}, 10 * 60 * 1000)

module.exports = {
  createRoom,
  joinRoom,
  removePlayer,
  recordAnswer,
  revealResults,
  startNextQuestion,
  getRoomPublic,
  getRoomByHost,
  getRoomCodeForPlayer,
  getRoom,
}
