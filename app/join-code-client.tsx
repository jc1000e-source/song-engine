'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

export function JoinCodeClient({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Join code copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="grid flex-1 gap-2">
        <Input
          readOnly
          value={code}
          className="font-mono text-lg text-center tracking-widest"
        />
      </div>
      <Button type="submit" size="icon" onClick={copyToClipboard} variant="outline">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )
}