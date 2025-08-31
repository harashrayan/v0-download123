"use client"

import { useFormStatus } from "react-dom"
import { useFormState } from "react-dom"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Wand2, ListChecks, FileText, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateOutlineAction, type SuperPageState } from "./actions"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const initialState: SuperPageState = {
  analysisSummary: "",
  topHeadlines: [],
  outline: "",
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button size="lg" type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analyzing SERP...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-5 w-5" />
          Generate Outline
        </>
      )}
    </Button>
  )
}

export default function SuperPage() {
  const [state, formAction] = useFormState(generateOutlineAction, initialState)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      })
    }
  }, [state.error, state.timestamp, toast])

  const hasResult = state.outline && !state.error

  const handleUseOutline = () => {
    if (state.outline) {
      // Store the outline and title suggestion in session storage to pass to the article writer page
      sessionStorage.setItem("superPageOutline", state.outline)
      sessionStorage.setItem("superPageTitle", state.topHeadlines[0] || "")
      router.push("/dashboard/article-writer")
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          What's your <span className="text-primary">Super Page</span> today?
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Clone SERP winners in seconds. Enter a keyword to analyze top-ranking content and generate a comprehensive
          outline to beat your competition.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form action={formAction} className="space-y-4">
            <Textarea
              name="keyword"
              placeholder="Enter keyword or instructions..."
              className="w-full p-4 text-base resize-none min-h-[120px]"
              required
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <Select name="targetCountry" defaultValue="us">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      {hasResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-primary" /> Analysis & Top Headlines
              </CardTitle>
              <CardDescription>Key takeaways and competitor headlines from the SERP analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Analysis Summary</h3>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{state.analysisSummary}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Top Competing Headlines</h3>
                  <ul className="space-y-2">
                    {state.topHeadlines.map((headline, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Badge variant="secondary" className="mt-1">
                          {index + 1}
                        </Badge>
                        <span className="text-muted-foreground">{headline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="text-primary" /> Generated Outline
              </CardTitle>
              <CardDescription>Use this SEO-optimized outline to create your article.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh] pr-4">
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: state.outline }}
                />
              </ScrollArea>
              <Button className="w-full mt-4" onClick={handleUseOutline}>
                <FileText className="mr-2" />
                Use This Outline in Article Writer
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
