require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { Server } = require('socket.io')
const {
  createRoom,
  joinRoom,
  removePlayer,
  recordAnswer,
  revealResults,
  startNextQuestion,
  getRoomPublic,
  getRoomCodeForPlayer,
  getRoom,
} = require('./rooms')
const { generateQuestion } = require('./questions')

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' },
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('create-room', ({ nickname, vibes }) => {
    try {
      const room = createRoom(socket.id, nickname, vibes)
      socket.join(room.code)
      socket.emit('room-joined', {
        room: getRoomPublic(room.code),
        playerId: socket.id,
        isHost: true,
      })
    } catch (err) {
      socket.emit('error', { message: err.message })
    }
  })

  socket.on('join-room', ({ roomCode, nickname }) => {
    const code = roomCode.toUpperCase()
    const result = joinRoom(code, socket.id, nickname)

    if (result.error) {
      socket.emit('error', { message: result.error })
      return
    }

    socket.join(code)
    socket.emit('room-joined', {
      room: getRoomPublic(code),
      playerId: socket.id,
      isHost: result.player.isHost,
    })

    // Only broadcast to others if it's a fresh join, not a reconnect
    if (!result.reconnected) {
      socket.to(code).emit('player-joined', { player: result.player })
    }
  })

  socket.on('start-game', async () => {
    const roomCode = getRoomCodeForPlayer(socket.id)
    if (!roomCode) return

    const room = getRoom(roomCode)
    if (!room || room.hostId !== socket.id) {
      socket.emit('error', { message: 'Only the host can start the game' })
      return
    }

    const activePlayers = [...room.players.values()].filter(p => !p.disconnectedAt)
    if (activePlayers.length < 2) {
      socket.emit('error', { message: 'Need at least 2 players to start' })
      return
    }

    io.to(roomCode).emit('game-started')

    try {
      const question = await generateQuestion(room.vibes, room.questionHistory)
      startNextQuestion(roomCode, question)
      io.to(roomCode).emit('round-started', { question })
    } catch (err) {
      socket.emit('error', { message: 'Failed to generate question' })
    }
  })

  socket.on('submit-answer', ({ choice }) => {
    const roomCode = getRoomCodeForPlayer(socket.id)
    if (!roomCode) return

    const result = recordAnswer(roomCode, socket.id, choice)
    if (!result) return

    io.to(roomCode).emit('answer-progress', {
      answered: result.answered,
      total: result.total,
    })

    if (result.allAnswered) {
      const results = revealResults(roomCode)
      const room = getRoom(roomCode)
      io.to(roomCode).emit('round-revealed', {
        results,
        question: room.currentQuestion,
      })
    }
  })

  socket.on('next-question', async () => {
    const roomCode = getRoomCodeForPlayer(socket.id)
    if (!roomCode) return

    const room = getRoom(roomCode)
    if (!room || room.hostId !== socket.id) {
      socket.emit('error', { message: 'Only the host can advance to the next question' })
      return
    }

    try {
      const question = await generateQuestion(room.vibes, room.questionHistory)
      startNextQuestion(roomCode, question)
      io.to(roomCode).emit('round-started', { question })
    } catch (err) {
      socket.emit('error', { message: 'Failed to generate question' })
    }
  })

  socket.on('leave-room', () => {
    handlePlayerLeave(socket)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
    handlePlayerLeave(socket)
  })
})

function handlePlayerLeave(socket) {
  const result = removePlayer(socket.id)
  if (!result) return

  const { roomCode, wasHost, isEmpty, newHostId } = result

  if (isEmpty) return

  socket.to(roomCode).emit('player-left', { playerId: socket.id })

  if (wasHost && newHostId) {
    io.to(roomCode).emit('host-changed', { newHostId })
    const newHostSocket = io.sockets.sockets.get(newHostId)
    if (newHostSocket) {
      newHostSocket.emit('you-are-host')
    }
  }
}

const PORT = process.env.PORT || 3002
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
