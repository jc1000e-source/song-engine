'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Play } from 'lucide-react'

export function PromptTesterClient() {
  const [model, setModel] = useState('gpt-3.5-turbo')
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.')
  const [userPrompt, setUserPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRun = async () => {
    if (!userPrompt.trim()) return

    setLoading(true)
    setResponse('')
    
    try {
      const res = await fetch('/api/admin/test-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            model,
            systemPrompt,
            userPrompt 
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to run prompt')
      }

      setResponse(data.result)
      toast.success('Prompt executed successfully')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Set up the model parameters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Model</Label>
                    <Select value={model} onValueChange={setModel}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>System Prompt</Label>
                    <Textarea 
                        className="min-h-[100px] font-mono text-sm"
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>The user message to send to the model.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>User Prompt</Label>
                    <Textarea 
                        className="min-h-[150px] font-mono text-sm"
                        placeholder="Enter your test prompt here..."
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                    />
                </div>
                <Button onClick={handleRun} disabled={loading || !userPrompt.trim()} className="w-full">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Running...
                        </>
                    ) : (
                        <>
                            <Play className="mr-2 h-4 w-4" />
                            Run Prompt
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Output</CardTitle>
                <CardDescription>The response from the model.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[400px]">
                {response ? (
                    <div className="p-4 bg-muted rounded-md whitespace-pre-wrap font-mono text-sm h-full">
                        {response}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                        Run a prompt to see the result
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}