'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 4,
    price: '$20',
    description: 'Perfect for trying it out',
    features: [
      '4 AI Songs',
      'High Quality Audio',
      'Commercial Usage',
      'Keep forever'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 20,
    price: '$75',
    description: 'Best value for active teams',
    features: [
      '20 AI Songs',
      'High Quality Audio',
      'Commercial Usage',
      'Priority Generation',
      'Keep forever'
    ],
    popular: true
  },
  {
    id: 'team',
    name: 'Team Pack',
    credits: 60,
    price: '$200',
    description: 'For large organizations',
    features: [
      '60 AI Songs',
      'High Quality Audio',
      'Commercial Usage',
      'Priority Generation',
      'Keep forever'
    ]
  }
]

export default function PurchaseCreditsPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (planId: string) => {
    setLoading(planId)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start checkout')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error: any) {
      toast.error(error.message)
      setLoading(null)
    }
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Purchase Credits</h2>
          <p className="text-muted-foreground">
            Buy credits to generate more songs for your team.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={cn(
              "flex flex-col relative",
              plan.popular && "border-primary shadow-lg scale-105 z-10"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center">
                  <Zap className="w-3 h-3 mr-1 fill-current" />
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground"> / one-time</span>
              </div>
              <div className="space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handlePurchase(plan.id)}
                disabled={!!loading}
                variant={plan.popular ? 'default' : 'secondary'}
              >
                {loading === plan.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading === plan.id ? 'Processing...' : 'Buy Now'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}