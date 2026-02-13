"use client"

import { useEffect, useState } from 'react'

export default function Home() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch data from the /admin API route we created
    fetch('/admin')
      .then((res) => res.json())
      .then((data) => {
        setStatus(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching status:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-xl animate-pulse">Checking system status...</div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-12">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          SongTeam System Check
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {/* Connection Status Card */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800">
          <h2 className="text-2xl font-semibold mb-4">Supabase Connection</h2>
          <div className={`p-4 rounded-lg border ${
            status?.connectionStatus?.includes('success') 
              ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900' 
              : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-900'
          }`}>
            <p className="font-medium text-lg flex items-center gap-2">
              {status?.connectionStatus}
            </p>
          </div>
        </div>

        {/* Environment Variables Card */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800">
          <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-3">
            {status?.envVars && Object.entries(status.envVars).map(([key, value]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/50">
                <span className="font-mono text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-all mr-4">{key}</span>
                <span className="font-medium text-sm whitespace-nowrap mt-1 sm:mt-0">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
