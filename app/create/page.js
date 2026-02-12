'use client'
import { useState } from 'react'

export default function Studio() {
  const [step, setStep] = useState(1)
  return (
    <div style={{ background: '#0a0a0c', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <header style={{ marginBottom: '40px' }}><a href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>? BACK</a></header>
        {step === 1 && (
          <div>
            <h1 style={{ fontWeight: '900', fontStyle: 'italic' }}>RECORD THE WIN</h1>
            <div style={{ background: '#111', padding: '30px', borderRadius: '20px', marginTop: '20px' }}>
              <input style={{ width: '100%', padding: '15px', background: '#000', color: 'white', border: '1px solid #333', borderRadius: '8px', marginBottom: '15px' }} placeholder="Who is this for?" />
              <button onClick={() => setStep(2)} style={{ width: '100%', padding: '15px', background: '#a855f7', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>CHOOSE VIBE</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div style={{ textAlign: 'center' }}>
            <h1>SELECT VIBE</h1>
            <button onClick={() => setStep(1)} style={{ padding: '15px', background: '#a855f7', color: 'white', borderRadius: '8px', border: 'none' }}>80s SYNTHWAVE</button>
          </div>
        )}
      </div>
    </div>
  )
}
