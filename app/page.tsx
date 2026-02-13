'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Music, Users, Zap } from 'lucide-react'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">🎵</span>
            <span>SongTeam</span>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <Button asChild variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-purple-400 transition-colors">
                  Sign In
                </Link>
                <Button asChild variant="default" className="bg-white text-black hover:bg-gray-200">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black z-0" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
              AI-Powered Team Anthems
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
              Turn Team Wins <br />
              Into Hit Songs
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Celebrate your team's accomplishments with custom, professional-grade songs generated in minutes. No musical talent required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-12 text-lg">
                <Link href="/signup">
                  Start Creating <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white h-12 text-lg">
                <Link href="#pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-zinc-900/50 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Track Wins</h3>
                <p className="text-gray-400">Log team accomplishments throughout the week. Everyone contributes to the lyrics.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                  <Music className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Generate Music</h3>
                <p className="text-gray-400">Choose from 10+ genres like Rap, Rock, or EDM. AI composes and produces the track.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Results</h3>
                <p className="text-gray-400">Get a professional 90-second song in minutes. Download, share, and celebrate.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-gray-400">Pay as you go. Credits never expire.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-8 flex flex-col">
                <h3 className="text-lg font-medium text-gray-300 mb-2">Starter Pack</h3>
                <div className="text-4xl font-bold mb-6">$20</div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center text-gray-300"><Check className="h-5 w-5 text-purple-500 mr-2" /> 4 Song Credits</li>
                  <li className="flex items-center text-gray-300"><Check className="h-5 w-5 text-purple-500 mr-2" /> $5.00 per song</li>
                  <li className="flex items-center text-gray-300"><Check className="h-5 w-5 text-purple-500 mr-2" /> All Genres Included</li>
                </ul>
                <Button asChild className="w-full bg-white/10 hover:bg-white/20 text-white">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>

              <div className="rounded-2xl border border-purple-500/50 bg-purple-900/10 p-8 flex flex-col relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">Pro Pack</h3>
                <div className="text-4xl font-bold mb-6">$75</div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center text-white"><Check className="h-5 w-5 text-purple-400 mr-2" /> 20 Song Credits</li>
                  <li className="flex items-center text-white"><Check className="h-5 w-5 text-purple-400 mr-2" /> $3.75 per song</li>
                  <li className="flex items-center text-white"><Check className="h-5 w-5 text-purple-400 mr-2" /> Priority Generation</li>
                </ul>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-8 flex flex-col">
                <h3 className="text-lg font-medium text-gray-300 mb-2">Team Pack</h3>
                <div className="text-4xl font-bold mb-6">$200</div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center text-gray-300"><Check className="h-5 w-5 text-purple-500 mr-2" /> 60 Song Credits</li>
                  <li className="flex items-center text-gray-300"><Check className="h-5 w-5 text-purple-500 mr-2" /> $3.33 per song</li>
                  <li className="flex items-center text-gray-300"><Check className="h-5 w-5 text-purple-500 mr-2" /> Best Value</li>
                </ul>
                <Button asChild className="w-full bg-white/10 hover:bg-white/20 text-white">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} SongTeam. All rights reserved.
        </div>
      </footer>
    </div>
  )
}