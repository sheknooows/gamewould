import { Question, Vibe, VIBE_CONFIG } from '../types'

interface Props {
  question: Question
  results: { A: number; B: number }
  isHost: boolean
  myAnswer: 'A' | 'B' | null
  onNextQuestion: () => void
  onLeave: () => void
}

export default function ResultsScreen({ question, results, isHost, myAnswer, onNextQuestion, onLeave }: Props) {
  const vibeKey = (question.vibe && VIBE_CONFIG[question.vibe as Vibe]) ? question.vibe as Vibe : 'deep'
  const config = VIBE_CONFIG[vibeKey]

  const total = results.A + results.B
  const aPercent = total > 0 ? (results.A / total) * 100 : 50
  const bPercent = total > 0 ? (results.B / total) * 100 : 50

  const winner: 'A' | 'B' | 'tie' =
    results.A > results.B ? 'A' : results.B > results.A ? 'B' : 'tie'

  const winnerLabel =
    winner === 'tie'
      ? "It's a tie! 🤝"
      : winner === 'A'
      ? '🏆 Option A wins!'
      : '🏆 Option B wins!'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Winner header */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#555', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px' }}>RESULTS</p>
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
            {winnerLabel}
          </h2>
        </div>

        {/* Question recap */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '16px 20px', textAlign: 'center' }}>
          <p style={{ color: '#555', fontSize: '12px', marginBottom: '6px' }}>Would you rather...</p>
          <p style={{ color: 'white', fontSize: '15px', lineHeight: 1.5, margin: 0 }}>
            <span style={{ color: config.primary, fontWeight: 600 }}>{question.optionA}</span>
            <span style={{ color: '#333', margin: '0 10px', fontSize: '13px' }}>OR</span>
            <span style={{ color: config.secondary, fontWeight: 600 }}>{question.optionB}</span>
          </p>
        </div>

        {/* Bar — Option A */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{
              color: myAnswer === 'A' ? config.primary : '#aaa',
              fontSize: '14px',
              fontWeight: myAnswer === 'A' ? 700 : 400,
              flex: 1,
              marginRight: '8px',
            }}>
              {question.optionA}{myAnswer === 'A' ? ' (you)' : ''}
            </span>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '20px', flexShrink: 0 }}>{results.A}</span>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '6px', height: '14px', overflow: 'hidden' }}>
            <div style={{
              backgroundColor: winner === 'A' ? config.primary : config.primary + '88',
              height: '100%',
              width: `${aPercent}%`,
              borderRadius: '6px',
              transition: 'width 0.7s ease',
            }} />
          </div>
        </div>

        {/* Bar — Option B */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{
              color: myAnswer === 'B' ? config.secondary : '#aaa',
              fontSize: '14px',
              fontWeight: myAnswer === 'B' ? 700 : 400,
              flex: 1,
              marginRight: '8px',
            }}>
              {question.optionB}{myAnswer === 'B' ? ' (you)' : ''}
            </span>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '20px', flexShrink: 0 }}>{results.B}</span>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '6px', height: '14px', overflow: 'hidden' }}>
            <div style={{
              backgroundColor: winner === 'B' ? config.secondary : config.secondary + '88',
              height: '100%',
              width: `${bPercent}%`,
              borderRadius: '6px',
              transition: 'width 0.7s ease',
            }} />
          </div>
        </div>

        {/* Host: next question */}
        {isHost && (
          <button
            onClick={onNextQuestion}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#ffffff',
              color: '#000000',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              minHeight: '64px',
            }}
          >
            Next Question →
          </button>
        )}

        {!isHost && (
          <div style={{ textAlign: 'center', color: '#444', fontSize: '14px', padding: '8px 0' }}>
            Waiting for host to continue...
          </div>
        )}

        {/* Leave */}
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
            padding: '8px',
          }}
        >
          Leave Game
        </button>
      </div>
    </div>
  )
}
