"use client"

import { useFormStatus } from "react-dom"
import { useFormState } from "react-dom"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle, Sparkles, Loader2, Copy } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { humanizeTextAction, type HumanizerState } from "./actions"
import { ScrollArea } from "@/components/ui/scroll-area"

const initialState: HumanizerState = {
  humanizedText: undefined,
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button size="lg" type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Humanizing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Humanize
        </>
      )}
    </Button>
  )
}

export default function HumanizerPage() {
  const [state, formAction] = useFormState(humanizeTextAction, initialState)
  const { toast } = useToast()
  const [inputText, setInputText] = useState("")
  const outputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      })
    }
  }, [state.error, state.timestamp, toast])

  const handleCopy = () => {
    if (outputRef.current?.value) {
      navigator.clipboard.writeText(outputRef.current.value)
      toast({
        title: "Copied to clipboard!",
        description: "The humanized text has been copied.",
      })
    }
  }

  const characterCount = inputText.length
  const wordCount = inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length
  const outputWordCount =
    !state.humanizedText || state.humanizedText.trim() === "" ? 0 : state.humanizedText.trim().split(/\s+/).length

  return (
    <form action={formAction}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-secondary p-3 rounded-lg">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Humanizer Tool <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
              </h1>
              <p className="text-muted-foreground">
                Rewrite your article, enhancing humanization and readability, improving your Google ranking.
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label htmlFor="readability" className="font-semibold">
                Readability
              </Label>
              <Select name="readability" defaultValue="grade-8-9">
                <SelectTrigger id="readability" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade-5">5th grade, easily understood by 11-year-olds</SelectItem>
                  <SelectItem value="grade-6">6th grade, easy to read. Conversational language</SelectItem>
                  <SelectItem value="grade-7">7th grade, fairly easy to read</SelectItem>
                  <SelectItem value="grade-8-9">8th & 9th grade, easily understood (Recommended)</SelectItem>
                  <SelectItem value="grade-10-12">10th to 12th grade, fairly difficult to read</SelectItem>
                  <SelectItem value="college">College, difficult to read</SelectItem>
                  <SelectItem value="college-grad">College graduate, very difficult to read</SelectItem>
                  <SelectItem value="professional">Professional, extremely difficult to read</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language" className="font-semibold">
                Language
              </Label>
              <Select name="language" defaultValue="en-us">
                <SelectTrigger id="language" className="mt-1">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-72">
                    <SelectItem value="en-us">English (US)</SelectItem>
                    <SelectItem value="en-uk">English (UK)</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="removeAiWords" className="font-semibold">
                Remove AI Words
              </Label>
              <Select name="removeAiWords" defaultValue="none">
                <SelectTrigger id="removeAiWords" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="inputText" className="font-semibold text-lg">
                Input Text
              </Label>
              <Textarea
                name="inputText"
                id="inputText"
                placeholder="Enter the article that you want to make it unique and human"
                className="min-h-[400px] text-base"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={3000}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="humanizedText" className="font-semibold text-lg">
                Humanized Text
              </Label>
              <Textarea
                id="humanizedText"
                ref={outputRef}
                readOnly
                placeholder="Your humanized text will appear here."
                value={state.humanizedText ?? ""}
                className="min-h-[400px] bg-secondary text-base"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                Input: {characterCount}/3000 chars ({wordCount} words)
              </span>
              <span>Output: {outputWordCount} words</span>
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <Button variant="outline" type="button" onClick={handleCopy} disabled={!state.humanizedText}>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
              <SubmitButton />
            </div>
          </div>
        </Card>
      </div>
    </form>
  )
}
