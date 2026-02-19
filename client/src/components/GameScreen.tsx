import { Vibe, VIBE_CONFIG, Question } from '../types'

interface Props {
  question: Question
  myAnswer: 'A' | 'B' | null
  answeredCount: number
  totalCount: number
  vibes: Vibe[]
  onSubmitAnswer: (choice: 'A' | 'B') => void
}

export default function GameScreen({ question, myAnswer, answeredCount, totalCount, vibes, onSubmitAnswer }: Props) {
  const vibeKey = (question.vibe && VIBE_CONFIG[question.vibe]) ? question.vibe : (vibes[0] ?? 'deep')
  const config = VIBE_CONFIG[vibeKey]
  const hasAnswered = myAnswer !== null

  const progressPct = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Vibe badge */}
        <div style={{ textAlign: 'center' }}>
          <span style={{
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            backgroundColor: config.primary + '1a',
            color: config.primary,
            fontWeight: 700,
          }}>
            {config.emoji} {config.label}
          </span>
        </div>

        {/* Question prompt */}
        <div style={{ textAlign: 'center', padding: '4px 0' }}>
          <p style={{ color: '#666', fontSize: '16px', fontWeight: 500, margin: 0 }}>
            Would you rather...
          </p>
        </div>

        {/* Option A */}
        <button
          onClick={() => !hasAnswered && onSubmitAnswer('A')}
          disabled={hasAnswered}
          style={{
            width: '100%',
            padding: '22px 20px',
            borderRadius: '16px',
            border: myAnswer === 'A' ? `2px solid ${config.primary}` : '2px solid transparent',
            backgroundColor: myAnswer === 'B' ? '#141414' : config.primary,
            color: 'white',
            fontSize: '17px',
            fontWeight: 600,
            cursor: hasAnswered ? 'default' : 'pointer',
            opacity: myAnswer === 'B' ? 0.35 : 1,
            minHeight: '80px',
            lineHeight: 1.4,
            textAlign: 'center',
            transition: 'all 0.2s',
          }}
        >
          {question.optionA}
        </button>

        {/* OR divider */}
        <div style={{ textAlign: 'center', color: '#333', fontWeight: 700, fontSize: '13px', letterSpacing: '0.15em' }}>
          — OR —
        </div>

        {/* Option B */}
        <button
          onClick={() => !hasAnswered && onSubmitAnswer('B')}
          disabled={hasAnswered}
          style={{
            width: '100%',
            padding: '22px 20px',
            borderRadius: '16px',
            border: myAnswer === 'B' ? `2px solid ${config.secondary}` : '2px solid transparent',
            backgroundColor: myAnswer === 'A' ? '#141414' : config.secondary,
            color: 'white',
            fontSize: '17px',
            fontWeight: 600,
            cursor: hasAnswered ? 'default' : 'pointer',
            opacity: myAnswer === 'A' ? 0.35 : 1,
            minHeight: '80px',
            lineHeight: 1.4,
            textAlign: 'center',
            transition: 'all 0.2s',
          }}
        >
          {question.optionB}
        </button>

        {/* Progress (shown after answering) */}
        {hasAnswered && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#555', fontSize: '13px' }}>Waiting for others...</span>
              <span style={{ color: '#555', fontSize: '13px' }}>{answeredCount} / {totalCount}</span>
            </div>
            <div style={{ backgroundColor: '#1a1a1a', borderRadius: '6px', height: '6px', overflow: 'hidden' }}>
              <div style={{
                backgroundColor: config.primary,
                height: '100%',
                width: `${progressPct}%`,
                borderRadius: '6px',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
