import { useState } from 'react'
import { Room, VIBE_CONFIG } from '../types'

interface Props {
  room: Room
  playerId: string
  isHost: boolean
  onStartGame: () => void
  onLeave: () => void
  error: string | null
  clearError: () => void
}

function nicknameColor(nickname: string): string {
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4']
  let hash = 0
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export default function LobbyScreen({ room, playerId, isHost, onStartGame, onLeave, error, clearError }: Props) {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard not available — silent fail
    }
  }

  const canStart = room.players.length >= 2

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', paddingTop: '48px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {error && (
          <div style={{ backgroundColor: '#ef444420', border: '1px solid #ef4444', color: '#f87171', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
            <button onClick={clearError} style={{ float: 'right', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>×</button>
          </div>
        )}

        <p style={{ textAlign: 'center', color: '#555', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '12px' }}>ROOM CODE</p>

        {/* Room code tap-to-copy */}
        <button
          onClick={copyCode}
          style={{
            display: 'block',
            width: '100%',
            padding: '20px',
            marginBottom: '16px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '16px',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'monospace', fontSize: '52px', fontWeight: 800, color: 'white', letterSpacing: '0.25em' }}>
            {room.code}
          </div>
          <div style={{ color: copied ? '#22c55e' : '#555', fontSize: '13px', marginTop: '8px', transition: 'color 0.2s' }}>
            {copied ? '✓ Copied to clipboard' : 'Tap to copy'}
          </div>
        </button>

        {/* Vibe tags */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
          {room.vibes.map(vibe => {
            const config = VIBE_CONFIG[vibe]
            return (
              <span key={vibe} style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                backgroundColor: config.primary + '1a',
                color: config.primary,
                fontWeight: 700,
              }}>
                {config.emoji} {config.label}
              </span>
            )
          })}
        </div>

        {/* Player list */}
        <p style={{ color: '#555', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '10px' }}>
          PLAYERS ({room.players.length})
        </p>
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
          {room.players.map((player, i) => (
            <div
              key={player.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 16px',
                borderBottom: i < room.players.length - 1 ? '1px solid #222' : 'none',
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: nicknameColor(player.nickname),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '15px',
                marginRight: '12px',
                flexShrink: 0,
              }}>
                {player.nickname[0].toUpperCase()}
              </div>
              <span style={{ color: 'white', fontWeight: 500, flex: 1 }}>{player.nickname}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {player.id === playerId && (
                  <span style={{ color: '#555', fontSize: '12px' }}>You</span>
                )}
                {(player.isHost || player.id === room.hostId) && (
                  <span style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700 }}>Host</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {isHost ? (
          <button
            onClick={onStartGame}
            disabled={!canStart}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: canStart ? '#ffffff' : '#1a1a1a',
              color: canStart ? '#000000' : '#444',
              fontSize: '16px',
              fontWeight: 700,
              cursor: canStart ? 'pointer' : 'not-allowed',
              minHeight: '64px',
              marginBottom: '12px',
              transition: 'all 0.2s',
            }}
          >
            {canStart ? 'Start Game →' : `Need ${2 - room.players.length} more player${2 - room.players.length !== 1 ? 's' : ''} to start`}
          </button>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ color: '#555', fontSize: '15px', marginBottom: '12px' }}>
              Waiting for host to start...
            </div>
            <div className="animate-pulse" style={{ color: '#333', fontSize: '20px', letterSpacing: '0.2em' }}>• • •</div>
          </div>
        )}

        <button
          onClick={onLeave}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            color: '#444',
            fontSize: '14px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '12px',
          }}
        >
          Leave Room
        </button>
      </div>
    </div>
  )
}
