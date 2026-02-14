import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CreditCard, Plus } from 'lucide-react'

export default async function CreditsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch user's teams to get transactions
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
  
  const teamIds = teamMembers?.map(tm => tm.team_id) || []

  let transactions: any[] = []
  
  if (teamIds.length > 0) {
    const { data } = await supabase
      .from('credit_transactions')
      .select('*, teams(name)')
      .in('team_id', teamIds)
      .order('created_at', { ascending: false })
    transactions = data || []
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Credit History</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/credits/purchase">
              <Plus className="mr-2 h-4 w-4" /> Buy Credits
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>History of credit purchases and usage.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Team</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">No transactions found.</td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td className="p-4 align-middle">{tx.teams?.name}</td>
                      <td className="p-4 align-middle">{tx.description}</td>
                      <td className={`p-4 align-middle text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}