"use client"

import { useFormStatus } from "react-dom"
import { useFormState } from "react-dom"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader2, RefreshCw, Download, BarChart, ChevronDown, Plus, KeyRound } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateKeywordIdeasAction, type KeywordResearcherState } from "./actions"
import Link from "next/link"
import { cn } from "@/lib/utils"

const initialState: KeywordResearcherState = {
  keywords: [],
  totalVolume: "0",
  totalKeywords: 0,
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Searching...
        </>
      ) : (
        "Search"
      )}
    </Button>
  )
}

export default function KeywordResearcherPage() {
  const [state, formAction] = useFormState(generateKeywordIdeasAction, initialState)
  const { toast } = useToast()

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      })
    }
  }, [state.error, state.timestamp, toast])

  const hasResult = state.keywords && state.keywords.length > 0 && !state.error

  const getKdColor = (kd: number) => {
    if (kd <= 14) return "bg-green-500"
    if (kd <= 29) return "bg-green-400"
    if (kd <= 49) return "bg-yellow-400"
    if (kd <= 79) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-secondary p-3 rounded-lg">
          <KeyRound className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Keyword Researcher</h1>
          <p className="text-muted-foreground">
            Discover thousands of keyword ideas, analyze their ranking difficulty and traffic potential.
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="p-4">
          <form action={formAction}>
            <div className="flex flex-wrap gap-2 items-end">
              <div className="flex-grow">
                <Label htmlFor="keyword" className="sr-only">
                  Keyword
                </Label>
                <Input
                  name="keyword"
                  id="keyword"
                  placeholder="Enter a keyword..."
                  className="h-12 text-base"
                  required
                />
              </div>
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="us">
              <SelectTrigger className="w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="google">
              <SelectTrigger className="w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="text-muted-foreground bg-transparent">
              Last 3 months
            </Button>
            <Button variant="outline" className="text-muted-foreground bg-transparent">
              All keywords
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg">
        <div className="p-4 flex justify-between items-center bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <Checkbox id="select-all-keywords" />
            <Label htmlFor="select-all-keywords" className="font-normal">
              {hasResult ? `${state.totalKeywords.toLocaleString()} keywords` : "No keywords"}
            </Label>
            {hasResult && <span className="text-muted-foreground">· Total volume: {state.totalVolume}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        {hasResult ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                <TableHead>Keyword</TableHead>
                <TableHead className="w-[100px] text-center">KD</TableHead>
                <TableHead className="w-[120px]">Volume</TableHead>
                <TableHead className="w-[120px]">Global</TableHead>
                <TableHead className="w-[120px]">TP</TableHead>
                <TableHead className="w-[120px]">CPC</TableHead>
                <TableHead>Parent topic</TableHead>
                <TableHead className="w-[120px]">SERP</TableHead>
                <TableHead className="w-[120px]">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.keywords.map((item) => (
                <TableRow key={item.keyword}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                      <Link
                        href={`https://www.google.com/search?q=${encodeURIComponent(item.keyword)}`}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.keyword}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className={cn("text-white", getKdColor(item.kd))}>{item.kd}</Badge>
                        </TooltipTrigger>
                        <TooltipContent>Keyword Difficulty</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{item.volume}</TableCell>
                  <TableCell>{item.gv}</TableCell>
                  <TableCell>{item.tp}</TableCell>
                  <TableCell>{item.cpc}</TableCell>
                  <TableCell>
                    <Link
                      href={`https://www.google.com/search?q=${encodeURIComponent(item.parentTopic)}`}
                      className="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.parentTopic}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono">
                        {item.sf}
                      </Badge>
                      <Button variant="outline" size="sm" className="h-7 bg-transparent">
                        SERP <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>{item.updated}</span>
                      <RefreshCw className="h-3 w-3" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <BarChart className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Run a search to see keyword ideas</h3>
            <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
              Enter a keyword or phrase to get started. The results will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
