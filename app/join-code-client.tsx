'use client'

import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export function JoinCodeClient({ code }: { code: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    toast.success('Join code copied to clipboard!')
  }

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-muted rounded-lg border">
      <p className="font-mono text-lg tracking-widest text-muted-foreground">{code}</p>
      <Button variant="ghost" size="icon" onClick={copyToClipboard} aria-label="Copy join code">
        <Copy className="h-5 w-5" />
      </Button>
    </div>
  )
}