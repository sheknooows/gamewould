import { useEffect, useRef, useState } from 'react'
import socket from './socket'
import { GameState, Room, Question, Screen, Vibe } from './types'
import HomeScreen from './components/HomeScreen'
import LobbyScreen from './components/LobbyScreen'
import GameScreen from './components/GameScreen'
import ResultsScreen from './components/ResultsScreen'

const initialState: GameState = {
  screen: 'home',
  room: null,
  playerId: null,
  isHost: false,
  currentQuestion: null,
  myAnswer: null,
  answeredCount: 0,
  totalCount: 0,
  results: null,
  error: null,
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(initialState)
  const screenRef = useRef<Screen>('home')

  // Keep ref current so the connect handler (closure) can read latest screen
  useEffect(() => {
    screenRef.current = gameState.screen
  }, [gameState.screen])

  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      const session = sessionStorage.getItem('wyr-session')
      if (session && screenRef.current !== 'home') {
        const { roomCode, nickname } = JSON.parse(session)
        socket.emit('join-room', { roomCode, nickname })
      }
    })

    socket.on('room-joined', ({ room, playerId, isHost }: { room: Room; playerId: string; isHost: boolean }) => {
      const me = room.players.find(p => p.id === playerId)
      if (me) {
        sessionStorage.setItem('wyr-session', JSON.stringify({ roomCode: room.code, nickname: me.nickname }))
      }
      setGameState(prev => ({
        ...prev,
        screen: 'lobby',
        room,
        playerId,
        isHost,
        error: null,
      }))
    })

    socket.on('player-joined', ({ player }: { player: { id: string; nickname: string; isHost: boolean } }) => {
      setGameState(prev => {
        if (!prev.room) return prev
        const alreadyExists = prev.room.players.some(p => p.id === player.id)
        if (alreadyExists) return prev
        return {
          ...prev,
          room: { ...prev.room, players: [...prev.room.players, player] },
        }
      })
    })

    socket.on('player-left', ({ playerId }: { playerId: string }) => {
      setGameState(prev => {
        if (!prev.room) return prev
        return {
          ...prev,
          room: { ...prev.room, players: prev.room.players.filter(p => p.id !== playerId) },
        }
      })
    })

    socket.on('host-changed', ({ newHostId }: { newHostId: string }) => {
      setGameState(prev => {
        if (!prev.room) return prev
        return {
          ...prev,
          room: {
            ...prev.room,
            hostId: newHostId,
            players: prev.room.players.map(p => ({ ...p, isHost: p.id === newHostId })),
          },
        }
      })
    })

    socket.on('you-are-host', () => {
      setGameState(prev => ({ ...prev, isHost: true }))
    })

    socket.on('game-started', () => {
      setGameState(prev => ({ ...prev, screen: 'game' }))
    })

    socket.on('round-started', ({ question }: { question: Question }) => {
      setGameState(prev => ({
        ...prev,
        screen: 'game',
        currentQuestion: question,
        myAnswer: null,
        answeredCount: 0,
        totalCount: prev.room?.players.length ?? 0,
        results: null,
      }))
    })

    socket.on('answer-progress', ({ answered, total }: { answered: number; total: number }) => {
      setGameState(prev => ({ ...prev, answeredCount: answered, totalCount: total }))
    })

    socket.on('round-revealed', ({ results, question }: { results: { A: number; B: number }; question: Question }) => {
      setGameState(prev => ({
        ...prev,
        screen: 'results',
        results,
        currentQuestion: question,
      }))
    })

    socket.on('error', ({ message }: { message: string }) => {
      setGameState(prev => ({ ...prev, error: message }))
    })

    return () => {
      socket.off('connect')
      socket.off('room-joined')
      socket.off('player-joined')
      socket.off('player-left')
      socket.off('host-changed')
      socket.off('you-are-host')
      socket.off('game-started')
      socket.off('round-started')
      socket.off('answer-progress')
      socket.off('round-revealed')
      socket.off('error')
      socket.disconnect()
    }
  }, [])

  const handleCreateRoom = (nickname: string, vibes: Vibe[]) => {
    socket.emit('create-room', { nickname, vibes })
  }

  const handleJoinRoom = (roomCode: string, nickname: string) => {
    socket.emit('join-room', { roomCode: roomCode.toUpperCase(), nickname })
  }

  const handleStartGame = () => {
    socket.emit('start-game')
  }

  const handleSubmitAnswer = (choice: 'A' | 'B') => {
    setGameState(prev => ({ ...prev, myAnswer: choice }))
    socket.emit('submit-answer', { choice })
  }

  const handleNextQuestion = () => {
    socket.emit('next-question')
  }

  const handleLeaveRoom = () => {
    socket.emit('leave-room')
    sessionStorage.removeItem('wyr-session')
    setGameState(initialState)
  }

  const clearError = () => setGameState(prev => ({ ...prev, error: null }))

  switch (gameState.screen) {
    case 'home':
      return (
        <HomeScreen
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          error={gameState.error}
          clearError={clearError}
        />
      )
    case 'lobby':
      return (
        <LobbyScreen
          room={gameState.room!}
          playerId={gameState.playerId!}
          isHost={gameState.isHost}
          onStartGame={handleStartGame}
          onLeave={handleLeaveRoom}
          error={gameState.error}
          clearError={clearError}
        />
      )
    case 'game':
      return (
        <GameScreen
          question={gameState.currentQuestion!}
          myAnswer={gameState.myAnswer}
          answeredCount={gameState.answeredCount}
          totalCount={gameState.totalCount}
          vibes={gameState.room?.vibes ?? []}
          onSubmitAnswer={handleSubmitAnswer}
        />
      )
    case 'results':
      return (
        <ResultsScreen
          question={gameState.currentQuestion!}
          results={gameState.results!}
          isHost={gameState.isHost}
          myAnswer={gameState.myAnswer}
          onNextQuestion={handleNextQuestion}
          onLeave={handleLeaveRoom}
        />
      )
    default:
      return null
  }
}
