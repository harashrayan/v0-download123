"use client"

import type React from "react"

import { useFormStatus } from "react-dom"
import { useFormState } from "react-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  HelpCircle,
  Wand2,
  Loader2,
  Workflow,
  Trash2,
  PlusCircle,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Link,
  Sparkles,
  BrainCircuit,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { bulkGenerateArticlesAction, type BulkArticleState } from "./actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>WhatsApp</title>
    <path d="M12.04 2.01A10.02 10.02 0 0 0 2.02 12.03a10.02 10.02 0 0 0 10.02 10.02 10.02 10.02 0 0 0 10.02-10.02c0-5.52-4.5-10.02-10.02-10.02m5.43 14.52c-.07.12-.26.19-.52.32-.26.13-.62.26-1.02.4- .4.13-1.01.2-1.52.07-.5-.13-1.28-.51-2.19-1.29-.91-.78-1.6-1.68-2.08-2.43-.48-.75-.73-1.44-.73-2.07 0-.63.26-1.2.65-1.65.39-.45.85-.61 1.25-.61.4 0 .75.06 1.02.19.27.13.4.19.5.46.1.27.13.51.13.68 0 .17-.06.34-.19.51l-.52.92c-.06.13-.13.2-.19.26-.06.07-.13.13-.19.13h-.07c-.06 0-.13-.03-.19-.07-.06-.03-.22-.16-.48-.42s-.48-.55-.65-.82c-.17-.27-.26-.51-.26-.71 0-.21.06-.39.19-.51.13-.13.32-.26.58-.39l.45-.26c.2-.13.34-.26.45-.4.1-.13.16-.29.16-.48 0-.19-.06-.35-.19-.48-.13-.13-.32-.19-.58-.19H9.24c-.26 0-.5.06-.71.19-.2.13-.39.3-.51.51-.13.2-.2.4-.26.64-.07.24-.1.48-.1.71 0 .39.06.75.19 1.08.13.34.32.68.58.99.26.32.58.64.99.99.4.35.85.67 1.39.95.54.28 1.14.53 1.79.74.65.21 1.27.31 1.85.31.58 0 1.13-.06 1.65-.19.52-.13.92-.32 1.2-.58.27-.26.45-.55.58-.88.12-.32.19-.64.19-1.02V16.3c0-.2-.03-.4-.07-.53Z" />
  </svg>
)

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Pinterest</title>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.104 3.14 9.434 7.532 11.197.01-.82-.045-1.89.213-2.888a12.115 12.115 0 0 1 1.112-2.502s-.28-.56-.28-1.384c0-1.297.747-2.264 1.68-2.264.792 0 1.17.593 1.17 1.3 0 .786-.507 1.96-.767 3.054-.22.93.466 1.687 1.376 1.687 1.652 0 2.91-1.74 2.91-4.248 0-2.21-1.572-3.752-4.41-3.752-2.822 0-4.48 2.11-4.48 4.032 0 .78.306 1.62.687 2.084.078.093.09.168.067.262-.023.096-.153.61-.186.73-.045.16-.14.2-.33.104-1.25-.514-2.03-2.048-2.03-3.484 0-2.658 1.916-5.12 5.56-5.12 2.94 0 5.22 2.09 5.22 4.782 0 2.95-1.85 5.23-4.41 5.23-1.12 0-2.18-.57-2.54-1.248 0 0-.54 2.1-.66 2.52-.375 1.297-.99 2.85-1.46 3.85a11.96 11.96 0 0 0 4.133.916c4.646 0 8.468-3.78 8.468-8.468C24 5.373 18.627 0 12 0z" />
  </svg>
)

interface ArticleRow {
  id: number
  mainKeyword: string
  title: string
  keywords: string
  outline: string
}

const initialState: BulkArticleState = {
  articles: [],
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button size="lg" type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Running...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-5 w-5" />
          Run
        </>
      )}
    </Button>
  )
}

export default function BulkArticleGenerationPage() {
  const [state, formAction] = useFormState(bulkGenerateArticlesAction, initialState)
  const { toast } = useToast()
  const router = useRouter()

  const [rows, setRows] = useState<ArticleRow[]>([{ id: 1, mainKeyword: "", title: "", keywords: "", outline: "" }])
  const [nextId, setNextId] = useState(2)

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      })
    }

    if (state.articles && state.articles.length > 0 && state.timestamp) {
      if (typeof window !== "undefined") {
        const existingArticlesRaw = localStorage.getItem("articlesList")
        const existingArticles = existingArticlesRaw ? JSON.parse(existingArticlesRaw) : []

        // Generated image data URI is very large and can exceed localStorage quota.
        // To prevent the app from crashing, we'll store the article text but not the image data.
        const articlesToStore = state.articles.map((article) => ({
          ...article,
          imageUrl: undefined, // Explicitly remove the image data before saving
        }))

        const newArticles = [...articlesToStore, ...existingArticles]

        try {
          localStorage.setItem("articlesList", JSON.stringify(newArticles))
        } catch (error) {
          if (
            error instanceof DOMException &&
            (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
          ) {
            toast({
              variant: "destructive",
              title: "Storage Full",
              description:
                "Couldn't save new articles as browser storage is full. Try deleting older articles from the Documents page.",
            })
          } else {
            console.error("Failed to save to localStorage", error)
            toast({
              variant: "destructive",
              title: "Save Error",
              description: "Could not save the articles to your browser storage.",
            })
          }
        }
      }
      router.push("/dashboard/documents")
    }
  }, [state, toast, router])

  const addRow = () => {
    setRows([...rows, { id: nextId, mainKeyword: "", title: "", keywords: "", outline: "" }])
    setNextId(nextId + 1)
  }

  const removeRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  const handleInputChange = (id: number, field: keyof Omit<ArticleRow, "id">, value: string) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="rowsData" value={JSON.stringify(rows)} />
      <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-secondary p-3 rounded-lg">
              <Workflow className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Bulk Article Generation <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
              </h1>
              <p className="text-muted-foreground">Bulk generation and publication of articles.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" type="button">
              Import from Excel
            </Button>
            <SubmitButton />
          </div>
        </div>

        <p className="text-muted-foreground">
          Add Main Keyword, Title, Keywords and Outline (optional) to create tasks for generating an article. Import
          from Excel if desired. Select your WordPress site and other settings. See{" "}
          <Button variant="link" className="p-0 h-auto" type="button">
            video tutorial
          </Button>{" "}
          for help.
        </p>

        <div className="rounded-lg border bg-card p-4">
          <div className="grid grid-cols-12 gap-x-4 mb-2">
            <Label className="col-span-2">Main Keyword*</Label>
            <Label className="col-span-3">Title*</Label>
            <Label className="col-span-3">Keywords</Label>
            <Label className="col-span-3">Outline</Label>
          </div>
          <div className="space-y-2">
            {rows.map((row, index) => (
              <div key={row.id} className="grid grid-cols-12 gap-x-4 items-center">
                <div className="col-span-2">
                  <Input
                    placeholder="Enter your main keyword"
                    value={row.mainKeyword}
                    onChange={(e) => handleInputChange(row.id, "mainKeyword", e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    placeholder="Enter your blog title or topic here"
                    value={row.title}
                    onChange={(e) => handleInputChange(row.id, "title", e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    placeholder="Enter keywords to include in the text"
                    value={row.keywords}
                    onChange={(e) => handleInputChange(row.id, "keywords", e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    placeholder="Enter outline to include in the text"
                    value={row.outline}
                    onChange={(e) => handleInputChange(row.id, "outline", e.target.value)}
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length <= 1}
                    type="button"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button variant="ghost" onClick={addRow} className="mt-4" type="button">
            <PlusCircle className="mr-2 h-4 w-4" /> Add row
          </Button>
        </div>

        <div className="text-center text-muted-foreground my-4">
          Saved templates will appear here.
          <Button variant="link" className="text-primary ml-2" type="button">
            Save Template
          </Button>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">Core Settings</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <SelectItem value="ar">Arabic</SelectItem>
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="articleType" className="font-semibold">
                  Article Type
                </Label>
                <Select name="articleType" defaultValue="none">
                  <SelectTrigger id="articleType" className="mt-1">
                    <SelectValue placeholder="e.g. How-to guide" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="how-to-guide">How-to guide</SelectItem>
                    <SelectItem value="listicle">Listicle</SelectItem>
                    <SelectItem value="product-review">Product review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="articleSize" className="font-semibold">
                  Article size
                </Label>
                <Select name="articleSize" defaultValue="medium">
                  <SelectTrigger id="articleSize" className="mt-1">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="x-small">X-Small</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">2400-3600 words, 9-12 H2</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Content Settings</h2>
            <Card className="p-6 space-y-6">
              <div>
                <Label htmlFor="toneOfVoice" className="font-semibold">
                  Tone of voice
                </Label>
                <Select name="toneOfVoice" defaultValue="friendly">
                  <SelectTrigger id="toneOfVoice" className="mt-1">
                    <SelectValue placeholder="e.g. Creative" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pointOfView" className="font-semibold">
                  Point of view
                </Label>
                <Select name="pointOfView" defaultValue="none">
                  <SelectTrigger id="pointOfView" className="mt-1">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="first-person-singular">First person singular (I, me, my, mine)</SelectItem>
                    <SelectItem value="third-person">Third person (he, she, it, they)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetCountry" className="font-semibold">
                  Target country
                </Label>
                <Select name="targetCountry" defaultValue="us">
                  <SelectTrigger id="targetCountry" className="mt-1">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-72">
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">AI Settings</h2>
            <Card className="p-6 space-y-6">
              <div>
                <Label className="font-semibold flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-primary" /> AI Model{" "}
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </Label>
                <Select name="aiModel" defaultValue="default">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="textReadability" className="font-semibold flex items-center gap-1">
                  Text Readability <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </Label>
                <Select name="textReadability" defaultValue="none">
                  <SelectTrigger id="textReadability" className="mt-1">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="grade-8-9">8th &amp; 9th grade, easily understood Recommended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="aiContentCleaning" className="font-semibold flex items-center gap-1">
                  AI Content Cleaning <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </Label>
                <Select name="aiContentCleaning" defaultValue="none">
                  <SelectTrigger id="aiContentCleaning" className="mt-1">
                    <SelectValue placeholder="No AI Words Removal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No AI Words Removal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">Brand Voice</h2>
          <Card className="p-6 bg-violet-50 dark:bg-violet-950/20 border-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <Select name="brandVoice" defaultValue="none">
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="create-new">+ Create Brand Voice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-muted-foreground">
                Create unique styles and tones for different situations using{" "}
                <Button variant="link" className="p-0 text-primary" type="button">
                  Brand Voice
                </Button>
                , ensuring your content always remains consistent.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">Structure</h2>
          <Card className="p-6 space-y-6">
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="intro-hook" className="font-semibold flex items-center gap-1">
                  Introductory Hook Brief <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </Label>
                <span className="text-muted-foreground font-normal text-sm">0/500</span>
              </div>

              <div className="flex gap-2 mt-2 flex-wrap">
                <Button variant="outline" size="sm" type="button">
                  Question
                </Button>
                <Button variant="outline" size="sm" type="button">
                  Statistical or Fact
                </Button>
                <Button variant="outline" size="sm" type="button">
                  Quotation
                </Button>
                <Button variant="outline" size="sm" type="button">
                  Anecdotal or Story
                </Button>
                <Button variant="outline" size="sm" type="button">
                  Personal or Emotional
                </Button>
              </div>
              <Textarea
                name="intro-hook"
                id="intro-hook"
                placeholder="Enter the type of hook for the article's opening sentence"
                className="mt-2 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <Label>Conclusion</Label>
                <Select name="conclusion" defaultValue="yes">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tables</Label>
                <Select name="tables" defaultValue="yes">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>H3</Label>
                <Select name="h3" defaultValue="yes">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Lists</Label>
                <Select name="lists" defaultValue="yes">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Italics</Label>
                <Select name="italics" defaultValue="yes">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quotes</Label>
                <Select name="quotes" defaultValue="yes">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Key Takeaways</Label>
                <Select name="keyTakeaways" defaultValue="yes">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>FAQ</Label>
                <Select name="faq" defaultValue="yes">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes-qa">Yes, with Q: A:</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Bold</Label>
                <Select name="bold" defaultValue="yes">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Media Hub <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
          </h2>
          <Card className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <Label>AI Images</Label>
                <Select name="aiImages" defaultValue="yes">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Number of images</Label>
                <Select name="numImages" defaultValue="3">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Image style</Label>
                <Select name="imageStyle" defaultValue="none">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="e.g. Andy Warhol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Image Size</Label>
                <Select name="imageSize" defaultValue="16:9">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">1344×768 (16:9)</SelectItem>
                    <SelectItem value="1:1">1024×1024 (1:1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="additional-instructions">Additional Instructions</Label>
                <Input
                  name="additional-instructions"
                  id="additional-instructions"
                  placeholder="Enter details or creative directions"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="brand-name">Brand Name</Label>
                <Input name="brand-name" id="brand-name" placeholder="Enter your brand name" className="mt-1" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Checkbox name="include-keyword" id="include-keyword" defaultChecked />
                <Label htmlFor="include-keyword" className="font-normal leading-snug">
                  Include the main keyword in the first image as Alt-text. Relevant keywords will be picked up and added
                  to the rest of the images.
                </Label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox name="informative-alt-text" id="informative-alt-text" />
                <Label htmlFor="informative-alt-text" className="font-normal leading-snug">
                  Adds informative Alt-text to images based on their content, providing a clear description of what is
                  depicted to improve SEO.
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>YouTube videos</Label>
                <Select name="youtubeVideos" defaultValue="yes">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Number of videos</Label>
                <Select name="numVideos" defaultValue="1">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Layout Options</Label>
                <Select name="layoutOptions" defaultValue="alternate-img-vid">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alternate-img-vid">Alternate image and video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox name="strict-placement" id="strict-placement" />
              <Label htmlFor="strict-placement" className="font-normal leading-snug">
                All media elements will be placed strictly under the headings. If disabled, the AI will decide and find
                the best placement.
              </Label>
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">SEO</h2>
            <Button variant="link" className="text-primary" type="button">
              New
            </Button>
          </div>
          <Card className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <Label htmlFor="seo-keywords" className="font-semibold">
                  Keywords to include in the text
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  These keywords will be applied to ALL articles in this bulk generation batch. For article-specific
                  keywords, use the table above.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground font-normal text-sm">0/150</span>
                <Button variant="outline" type="button">
                  <BrainCircuit className="w-4 h-4 mr-2" /> NLP keywords generation
                </Button>
              </div>
            </div>
            <div className="relative mt-2">
              <Textarea
                name="seo-keywords"
                id="seo-keywords"
                placeholder="Write some keyword or phrase relevant to your blog, then press Enter or + to add"
                className="min-h-[100px]"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Internal Linking <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
            </h2>
            <Badge variant="outline" className="border-primary/50 text-primary">
              New!
            </Badge>
          </div>
          <Card className="p-6 bg-violet-50 dark:bg-violet-950/20 border-primary/20">
            <p className="text-muted-foreground mb-4 max-w-prose">
              Automatically index your site and add links relevant to your content. Select a Website and our semantic
              search will find the best pages to link to within your article.
            </p>
            <Label className="font-semibold">Select a Website</Label>
            <div className="flex justify-between items-end mt-1">
              <div className="w-full md:w-1/2">
                <Select name="internalLinkingWebsite" defaultValue="none">
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="add-website">+ Add a Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="link" className="text-primary text-sm p-0 h-auto" type="button">
                Unlimited internal URLs crawlable.
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            External Linking <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
          </h2>
          <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-500/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Label>Link Type</Label>
                <Select name="externalLinkingType" defaultValue="none">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Note</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  External Linking automatically integrates authoritative and relevant external links into your content,
                  while also allowing you to manually specify desired links.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Connect to Web <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
          </h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <Label>Access</Label>
                <Select name="connectToWeb" defaultValue="none">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Enabling "Connect to Web" reduces AI hallucinations and improves accuracy by using real-time
                information.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Syndication <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
          </h2>
          <Card className="p-6">
            <p className="text-muted-foreground mb-6">
              Create marketing materials based on the article for various platforms.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
              <div>
                <Label className="flex items-center gap-2 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <span>Twitter post</span>
                </Label>
                <Select name="twitterPost" defaultValue="no">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center gap-2 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <span>LinkedIn post</span>
                </Label>
                <Select name="linkedinPost" defaultValue="no">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center gap-2 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <span>Facebook post</span>
                </Label>
                <Select name="facebookPost" defaultValue="no">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center gap-2 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>Email newsletter</span>
                </Label>
                <Select name="emailNewsletter" defaultValue="no">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center gap-2 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                  </div>
                  <span>WhatsApp message</span>
                </Label>
                <Select name="whatsappMessage" defaultValue="no">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center gap-2 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-[#E60023] flex items-center justify-center text-white">
                    <PinterestIcon className="w-4 h-4 fill-white" />
                  </div>
                  <span>Pinterest Pin</span>
                </Label>
                <Select name="pinterestPin" defaultValue="no">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6 items-center">
              <div className="md:col-span-1">
                <Label className="flex items-center gap-2 font-semibold">
                  <Link className="w-4 h-4 text-muted-foreground" />
                  <span>Link to page</span>
                </Label>
                <Select name="linkToPage" defaultValue="no">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="No Link" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Note</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  No link will be used in the creation of marketing materials.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">Document</h2>
          <Card className="p-6 flex items-center justify-between">
            <div>
              <Label htmlFor="directory">Save to</Label>
              <div className="flex items-center gap-2 mt-1">
                <Select name="directory" defaultValue="home">
                  <SelectTrigger id="directory" className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" type="button">
                  Change
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Publishing to Website <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
          </h2>
          <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-500/20">
            <Label htmlFor="target-website" className="font-semibold">
              Target Website *
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Select the website where the content will be published.
            </p>
            <Select name="targetWebsite" defaultValue="none">
              <SelectTrigger id="target-website">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="add-website">+ Add a Website</SelectItem>
              </SelectContent>
            </Select>
          </Card>
        </div>
      </div>
    </form>
  )
}
