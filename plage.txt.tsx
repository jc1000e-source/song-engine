'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0c] via-purple-950 to-[#0a0a0c] text-white">
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✋</span>
            <h1 className="text-xl font-black italic tracking-tighter uppercase">TeamHighFive <span className="text-purple-400">Studio</span></h1>
          </div>
          <div className="flex gap-4">
            {user ? (
              <Link href="/dashboard" className="px-6 py-2.5 bg-purple-600 rounded-full font-bold hover:bg-purple-500 transition-all">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="px-6 py-2.5 text-white/80 hover:text-white transition-colors font-medium">Sign in</Link>
                <Link href="/signup" className="px-6 py-2.5 bg-purple-600 rounded-full font-bold hover:bg-purple-500 transition-all">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300">✨ 90-Second Studio Production</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none">
            Turn Team Wins<br />Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Custom Songs</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
            Professional 90-second anthems celebrating your team's accomplishments. AI-powered studio production in minutes.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup" className="px-8 py-4 bg-purple-600 rounded-xl font-black uppercase tracking-widest hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20">
              Start Creating Free →
            </Link>
            <a href="#pricing" className="px-8 py-4 border border-white/10 rounded-xl font-bold uppercase tracking-widest hover:bg-white/5 transition-all">View Pricing</a>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🎯', title: 'Track Wins', desc: 'Log team accomplishments throughout the week' },
            { icon: '🎵', title: '90s Studio Production', desc: 'AI-mastered anthems in 10+ genres' },
            { icon: '👥', title: 'Team Collaboration', desc: 'Everyone contributes, everyone celebrates' }
          ].map((f, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-xl font-black italic uppercase mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <div id="pricing" className="mt-32">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-4">Studio <span className="text-purple-400">Packs</span></h2>
            <p className="text-gray-400 uppercase text-xs tracking-widest font-mono">One-time purchase • No subscriptions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:scale-105 transition-all">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Starter Pack</div>
              <div className="text-5xl font-black mb-6">$20</div>
              <div className="space-y-2 mb-6 text-sm text-gray-400">
                <p className="font-bold text-white">4 song credits</p>
                <p>$5 per track</p>
              </div>
              <Link href="/signup" className="block w-full text-center px-6 py-3 border border-white/20 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-all">Get Started</Link>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-2xl relative scale-105 shadow-2xl shadow-purple-500/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase">⭐ Best Value</div>
              <div className="text-xs font-mono uppercase tracking-widest text-purple-100 mb-4">Pro Pack</div>
              <div className="text-5xl font-black mb-6">$80</div>
              <div className="space-y-2 mb-6 text-sm text-purple-100">
                <p className="font-bold text-white">20 song credits</p>
                <p>$4 per track • Save 20%</p>
              </div>
              <Link href="/signup" className="block w-full text-center px-6 py-3 bg-white text-purple-600 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-all">Get Started</Link>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:scale-105 transition-all">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Corporate Pack</div>
              <div className="text-5xl font-black mb-6">$175</div>
              <div className="space-y-2 mb-6 text-sm text-gray-400">
                <p className="font-bold text-white">50 song credits</p>
                <p>$3.50 per track • Save 30%</p>
              </div>
              <Link href="/signup" className="block w-full text-center px-6 py-3 border border-white/20 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-all">Get Started</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md mt-32 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">&copy; 2026 TeamHighFive Studio. Turn wins into music.</p>
        </div>
      </footer>
    </div>
  )
}
