import { PromptTesterClient } from './prompt-tester-client'

export default function PromptTesterPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Prompt Tester</h2>
        <p className="text-muted-foreground">
          Experiment with AI prompts and view raw responses.
        </p>
      </div>
      <PromptTesterClient />
    </div>
  )
}