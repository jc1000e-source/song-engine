'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function StudioLayout({ 
  children, 
  userEmail 
}: { 
  children: React.ReactNode
  userEmail?: string 
}) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-purple-500/30 font-sans">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-2xl">✋</span>
            <h1 className="text-xl font-black italic tracking-tighter uppercase">
              TeamHighFive <span className="text-purple-500 underline decoration-2 underline-offset-4">Studio</span>
            </h1>
          </Link>
          
          {userEmail && (
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-mono text-gray-500 hidden md:block uppercase tracking-widest">
                {userEmail}
              </span>
              <button 
                onClick={handleSignOut}
                className="px-4 py-1.5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 pb-32">
        {children}
      </main>

      {/* Studio Status Bar */}
      <div className="fixed bottom-0 inset-x-0 h-20 bg-[#121218] border-t border-white/10 backdrop-blur-xl z-50 flex items-center px-8 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-900/20 rounded-lg border border-purple-500/20 flex items-center justify-center text-xl">
            ✋
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-gray-100 uppercase tracking-tight">
              Studio Status: Ready
            </div>
            <div className="text-[9px] text-purple-400 uppercase tracking-[0.2em] font-mono">
              Format: 90s Single / 24-bit
            </div>
          </div>
        </div>
        
        <div className="flex-1 max-w-xl px-12">
          <div className="h-1 bg-white/5 rounded-full relative">
            <div className="absolute inset-y-0 left-0 bg-purple-500 w-full shadow-[0_0_10px_rgba(168,85,247,0.5)] opacity-20" />
          </div>
        </div>
        
        <div className="text-[10px] font-mono text-gray-500">00:00 / 01:30</div>
      </div>
    </div>
  )
}
