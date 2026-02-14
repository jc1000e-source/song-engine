'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Check, CreditCard } from 'lucide-react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 4,
    price: 20,
    description: 'Perfect for trying it out',
    features: ['4 Song Credits', '$5.00 per song', 'All genres included', 'Shareable links']
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 20,
    price: 75,
    description: 'Best value for small teams',
    features: ['20 Song Credits', '$3.75 per song', 'All genres included', 'Priority generation', 'Shareable links'],
    popular: true
  },
  {
    id: 'team',
    name: 'Team Pack',
    credits: 60,
    price: 200,
    description: 'For active teams celebrating often',
    features: ['60 Song Credits', '$3.33 per song', 'All genres included', 'Priority generation', 'Shareable links']
  }
]

export default function PurchaseCreditsPage() {
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string>('')
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadTeams() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: members } = await supabase
          .from('team_members')
          .select('teams(*)')
          .eq('user_id', user.id)
        
        const userTeams = members?.map((m: any) => m.teams).filter(Boolean) || []
        setTeams(userTeams)
        
        if (userTeams.length > 0) {
          setSelectedTeamId(userTeams[0].id)
        }
      } catch (error) {
        console.error('Error loading teams:', error)
        toast.error('Failed to load teams')
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
  }, [supabase])

  const handlePurchase = async (planId: string) => {
    if (!selectedTeamId) {
      toast.error('Please select a team first')
      return
    }

    setProcessing(planId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planId,
          teamId: selectedTeamId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start checkout')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error: any) {
      toast.error(error.message)
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <h2 className="text-2xl font-bold">No Teams Found</h2>
        <p className="text-muted-foreground">
          You need to be part of a team to purchase credits.
        </p>
        <Button onClick={() => router.push('/dashboard/team/create')}>
          Create a Team
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase Credits</h1>
        <p className="text-muted-foreground mt-2">
          Buy credits to generate songs. Credits are shared with your entire team.
        </p>
      </div>

      <div className="flex items-center space-x-4 bg-muted/50 p-4 rounded-lg">
        <span className="text-sm font-medium">Buying for team:</span>
        <select 
          className="flex h-9 w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          disabled={!!processing}
        >
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name} ({team.credits} credits)
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg relative' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground"> / one-time</span>
              </div>
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handlePurchase(plan.id)}
                disabled={!!processing}
              >
                {processing === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Buy Now
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}