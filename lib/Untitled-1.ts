fetch('/admin')
fetch('/api/admin')
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  const isValidKey = (key: string | undefined) => key?.startsWith('ey')

  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✅' : 'Missing ❌',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? (isValidKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ? 'Set ✅' : 'Invalid Format (Should start with "ey") ⚠️') 
      : 'Missing ❌',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY 
      ? (isValidKey(process.env.SUPABASE_SERVICE_ROLE_KEY) ? 'Set ✅' : 'Invalid Format (Should start with "ey") ⚠️') 
      : 'Missing ❌',
  }

  let connectionStatus = 'Checking...'
  
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    // Try a lightweight query to verify connection (HEAD request)
    const { error } = await supabase.from('teams').select('*', { count: 'exact', head: true })
    
    if (error) {
      connectionStatus = `Error: ${error.message}`
    } else {
      connectionStatus = 'Connected successfully ✅'
    }
  } catch (error) {
    connectionStatus = `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
  }

  return NextResponse.json({
    envVars,
    connectionStatus
  })
}
