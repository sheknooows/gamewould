export type Screen = 'home' | 'lobby' | 'game' | 'results'

export type Vibe = 'spicy' | 'funny' | 'deep' | 'weird'

export interface VibeConfig {
  label: string
  emoji: string
  primary: string
  secondary: string
}

export const VIBE_CONFIG: Record<Vibe, VibeConfig> = {
  spicy: { label: 'Spicy', emoji: '🔥', primary: '#ef4444', secondary: '#f97316' },
  funny: { label: 'Funny', emoji: '😂', primary: '#eab308', secondary: '#f59e0b' },
  deep:  { label: 'Deep',  emoji: '🤔', primary: '#3b82f6', secondary: '#6366f1' },
  weird: { label: 'Weird', emoji: '👻', primary: '#a855f7', secondary: '#8b5cf6' },
}

export interface Player {
  id: string
  nickname: string
  isHost: boolean
  disconnectedAt?: number
}

export interface Question {
  text: string
  optionA: string
  optionB: string
  vibe: Vibe
}

export interface Room {
  code: string
  hostId: string
  vibes: Vibe[]
  players: Player[]
  state: 'lobby' | 'playing' | 'results'
  currentQuestion: Question | null
}

export interface GameState {
  screen: Screen
  room: Room | null
  playerId: string | null
  isHost: boolean
  currentQuestion: Question | null
  myAnswer: 'A' | 'B' | null
  answeredCount: number
  totalCount: number
  results: { A: number; B: number } | null
  error: string | null
}
