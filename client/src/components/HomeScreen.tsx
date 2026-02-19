import { useState } from 'react'
import { Vibe, VIBE_CONFIG } from '../types'

interface Props {
  onCreateRoom: (nickname: string, vibes: Vibe[]) => void
  onJoinRoom: (roomCode: string, nickname: string) => void
  error: string | null
  clearError: () => void
}

export default function HomeScreen({ onCreateRoom, onJoinRoom, error, clearError }: Props) {
  const [tab, setTab] = useState<'create' | 'join'>('create')
  const [nickname, setNickname] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [selectedVibes, setSelectedVibes] = useState<Vibe[]>([])

  const toggleVibe = (vibe: Vibe) => {
    setSelectedVibes(prev =>
      prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]
    )
  }

  const canCreate = nickname.trim().length > 0 && selectedVibes.length > 0
  const canJoin = nickname.trim().length > 0 && roomCode.trim().length === 4

  const handleCreate = () => {
    if (!canCreate) return
    clearError()
    onCreateRoom(nickname.trim(), selectedVibes)
  }

  const handleJoin = () => {
    if (!canJoin) return
    clearError()
    onJoinRoom(roomCode.trim(), nickname.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      tab === 'create' ? handleCreate() : handleJoin()
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '4px', color: 'white', letterSpacing: '-0.02em' }}>
          Would You Rather
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px', fontSize: '15px' }}>
          The party game for impossible choices
        </p>

        {error && (
          <div style={{ backgroundColor: '#ef444420', border: '1px solid #ef4444', color: '#f87171', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* Tab Toggle */}
        <div style={{ display: 'flex', backgroundColor: '#1a1a1a', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
          {(['create', 'join'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); clearError() }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: tab === t ? '#ffffff' : 'transparent',
                color: tab === t ? '#000000' : '#666666',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'all 0.15s',
              }}
            >
              {t === 'create' ? 'Create Room' : 'Join Room'}
            </button>
          ))}
        </div>

        {/* Nickname */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#555', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px' }}>YOUR NAME</label>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your nickname"
            maxLength={20}
            autoComplete="off"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid #2a2a2a',
              backgroundColor: '#1a1a1a',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Room Code (join tab only) */}
        {tab === 'join' && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#555', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px' }}>ROOM CODE</label>
            <input
              type="text"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4))}
              onKeyDown={handleKeyDown}
              placeholder="XXXX"
              maxLength={4}
              autoComplete="off"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #2a2a2a',
                backgroundColor: '#1a1a1a',
                color: 'white',
                fontSize: '28px',
                fontFamily: 'monospace',
                letterSpacing: '0.3em',
                outline: 'none',
                boxSizing: 'border-box',
                textAlign: 'center',
              }}
            />
          </div>
        )}

        {/* Vibe picker (create tab only) */}
        {tab === 'create' && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#555', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '10px' }}>
              PICK YOUR VIBES (pick at least one)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {(Object.keys(VIBE_CONFIG) as Vibe[]).map(vibe => {
                const config = VIBE_CONFIG[vibe]
                const selected = selectedVibes.includes(vibe)
                return (
                  <button
                    key={vibe}
                    onClick={() => toggleVibe(vibe)}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '12px',
                      border: `2px solid ${selected ? config.primary : '#2a2a2a'}`,
                      backgroundColor: selected ? config.primary + '1a' : '#1a1a1a',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s',
                      minHeight: '72px',
                    }}
                  >
                    <div style={{ fontSize: '26px', marginBottom: '4px' }}>{config.emoji}</div>
                    <div style={{ color: selected ? config.primary : '#555', fontWeight: 700, fontSize: '13px' }}>
                      {config.label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={tab === 'create' ? handleCreate : handleJoin}
          disabled={tab === 'create' ? !canCreate : !canJoin}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontSize: '16px',
            fontWeight: 700,
            cursor: (tab === 'create' ? !canCreate : !canJoin) ? 'not-allowed' : 'pointer',
            opacity: (tab === 'create' ? !canCreate : !canJoin) ? 0.35 : 1,
            minHeight: '64px',
            transition: 'opacity 0.15s',
          }}
        >
          {tab === 'create' ? 'Create Room →' : 'Join Room →'}
        </button>
      </div>
    </div>
  )
}
