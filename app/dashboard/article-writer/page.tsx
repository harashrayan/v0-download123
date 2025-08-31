"use client"

import { useFormStatus } from "react-dom"
import { useFormState } from "react-dom"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  HelpCircle,
  Sparkles,
  Wand2,
  BrainCircuit,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Link,
  Loader2,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { generateArticleAction, generateTitleAction, type ArticleState } from "./actions"
import { useRouter } from "next/navigation"

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>WhatsApp</title>
    <path d="M12.04 2.01A10.02 10.02 0 0 0 2.02 12.03a10.02 10.02 0 0 0 10.02 10.02 10.02 10.02 0 0 0 10.02-10.02c0-5.52-4.5-10.02-10.02-10.02m5.43 14.52c-.07.12-.26.19-.52.32-.26.13-.62.26-1.02.4- .4.13-1.01.2-1.52.07-.5-.13-1.28-.51-2.19-1.29-.91-.78-1.6-1.68-2.08-2.43-.48-.75-.73-1.44-.73-2.07 0-.63.26-1.2.65-1.65.39-.45.85-.61 1.25-.61.4 0 .75.06 1.02.19.27.13.4.19.5.46.1.27.13.51.13.68 0 .17-.06.34-.19.51l-.52.92c-.06.13-.13.2-.19.26-.06.07-.13.13-.19.13h-.07c-.06 0-.13-.03-.19-.07-.06-.03-.22-.16-.48-.42s-.48-.55-.65-.82c-.17-.27-.26-.51-.26-.71 0-.21.06-.39.19-.51.13-.13.32-.26.58-.39l.45-.26c.2-.13.34-.26.45-.4.1-.13.16-.29.16-.48 0-.19-.06-.35-.19-.48-.13-.13-.32-.19-.58-.19H9.24c-.26 0-.5.06-.71.19-.2.13-.39.3-.51.51-.13.2-.2.4-.26.64-.07.24-.1.48-.1.71 0 .39.06.75.19 1.08.13.34.32.68.58.99.26.32.58.64.99.99.4.35.85.67 1.39.95.54.28 1.14.53 1.79.74.65.21 1.27.31 1.85.31.58 0 1.13-.06 1.65-.19.52-.13.92-.32 1.2-.58.27-.26.45-.55.58-.88.12-.32.19-.64.19-1.02V16.3c0-.2-.03-.4-.07-.53Z" />
  </svg>
)

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Pinterest</title>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.104 3.14 9.434 7.532 11.197.01-.82-.045-1.89.213-2.888a12.115 12.115 0 0 1 1.112-2.502s-.28-.56-.28-1.384c0-1.297.747-2.264 1.68-2.264.792 0 1.17.593 1.17 1.3 0 .786-.507 1.96-.767 3.054-.22.93.466 1.687 1.376 1.687 1.652 0 2.91-1.74 2.91-4.248 0-2.21-1.572-3.752-4.11-3.752-2.822 0-4.48 2.11-4.48 4.032 0 .78.306 1.62.687 2.084.078.093.09.168.067.262-.023.096-.153.61-.186.73-.045.16-.14.2-.33.104-1.25-.514-2.03-2.048-2.03-3.484 0-2.658 1.916-5.12 5.56-5.12 2.94 0 5.22 2.09 5.22 4.782 0 2.95-1.85 5.23-4.41 5.23-1.12 0-2.18-.57-2.54-1.248 0 0-.54 2.1-.66 2.52-.375 1.297-.99 2.85-1.46 3.85a11.96 11.96 0 0 0 4.133.916c4.646 0 8.468-3.78 8.468-8.468C24 5.373 18.627 0 12 0z" />
  </svg>
)

const initialState: ArticleState = {
  article: undefined,
  imageUrl: undefined,
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button size="lg" type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating...
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

export default function ArticleWriterPage() {
  const [state, formAction] = useFormState(generateArticleAction, initialState)
  const { toast } = useToast()
  const router = useRouter()

  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false)
  const keywordInputRef = useRef<HTMLInputElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const detailsInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Check for outline from Super Page
    const outline = sessionStorage.getItem("superPageOutline")
    const title = sessionStorage.getItem("superPageTitle")
    if (outline && detailsInputRef.current) {
      detailsInputRef.current.value = outline
      sessionStorage.removeItem("superPageOutline")
    }
    if (title && titleInputRef.current) {
      titleInputRef.current.value = title
      if (keywordInputRef.current) {
        // Attempt to derive keyword from title, or use title itself
        keywordInputRef.current.value = title.split(" ").slice(0, 3).join(" ")
      }
      sessionStorage.removeItem("superPageTitle")
    }

    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      })
    }

    // An article was successfully generated
    if (state.article && state.timestamp) {
      // We no longer require imageUrl to redirect
      if (typeof window !== "undefined") {
        const existingArticlesRaw = localStorage.getItem("articlesList")
        const existingArticles: ArticleState[] = existingArticlesRaw ? JSON.parse(existingArticlesRaw) : []

        // The generated image data URI is very large and can exceed localStorage quota.
        // To prevent the app from crashing, we'll store the article text but not the image data.
        const articleToStore: ArticleState = {
          ...state,
          // Explicitly set imageUrl to undefined before saving.
          // The full article with image was still generated, just not saved to localStorage.
          imageUrl: undefined,
        }

        const newArticles = [...existingArticles, articleToStore]

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
                "Couldn't save the new article as browser storage is full. Try deleting older articles from the Documents page.",
            })
          } else {
            console.error("Failed to save to localStorage", error)
            toast({
              variant: "destructive",
              title: "Save Error",
              description: "Could not save the article to your browser storage.",
            })
          }
        }
      }
      router.push("/dashboard/documents")
    }
  }, [state, toast, router])

  const handleGenerateTitle = async () => {
    const keyword = keywordInputRef.current?.value
    if (!keyword || keyword.length < 3) {
      toast({
        variant: "destructive",
        title: "Keyword required",
        description: "Please enter a main keyword (at least 3 characters) to generate a title.",
      })
      return
    }

    setIsGeneratingTitle(true)
    try {
      const result = await generateTitleAction(keyword)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error generating title",
          description: result.error,
        })
      } else if (result.title && titleInputRef.current) {
        titleInputRef.current.value = result.title
      }
    } catch (e) {
      console.error(e)
      toast({
        variant: "destructive",
        title: "An unexpected error occurred",
        description: "Failed to generate title. Please try again.",
      })
    } finally {
      setIsGeneratingTitle(false)
    }
  }

  return (
    <form action={formAction}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-4 rounded-xl">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2 text-balance">
                1-Click Blog Post
                <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
              </h1>
              <p className="text-muted-foreground leading-relaxed">Generate and publish article in 1 click.</p>
            </div>
          </div>
          <SubmitButton />
        </div>

        <div className="space-y-8">
          <Card className="p-8 bg-gradient-to-br from-card to-secondary/10 border-primary/10 hover:border-primary/20 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="space-y-2">
                <Label htmlFor="main-keyword" className="font-semibold flex justify-between text-base">
                  <span>Main Keyword*</span>
                  <span className="text-muted-foreground font-normal text-sm">0/80</span>
                </Label>
                <div className="flex gap-3 items-center">
                  <Input
                    ref={keywordInputRef}
                    id="main-keyword"
                    name="keywords"
                    placeholder="Enter your main keyword"
                    required
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleGenerateTitle}
                    disabled={isGeneratingTitle}
                    className="hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 whitespace-nowrap bg-transparent"
                  >
                    {isGeneratingTitle ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Title
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold flex justify-between text-base">
                  <span>Title*</span>
                  <span className="text-muted-foreground font-normal text-sm">0/100</span>
                </Label>
                <Input
                  ref={titleInputRef}
                  id="title"
                  name="title"
                  placeholder="Enter your blog title or topic here"
                  required
                  className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg border-dashed border-2 border-secondary">
              <p className="text-muted-foreground">
                Saved templates will appear here.
                <Button variant="link" className="text-primary ml-2 hover:underline" type="button">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Save Template
                </Button>
              </p>
            </div>
          </Card>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Core Settings</h2>
              <Button variant="link" className="text-primary" type="button">
                New
              </Button>
            </div>
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
                        <SelectItem value="en-au">English (Australia)</SelectItem>
                        <SelectItem value="en-ca">English (Canada)</SelectItem>
                        <SelectItem value="af">Afrikaans</SelectItem>
                        <SelectItem value="sq">Albanian</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="hy">Armenian</SelectItem>
                        <SelectItem value="az">Azerbaijani</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                        <SelectItem value="bg">Bulgarian</SelectItem>
                        <SelectItem value="zh-cn">Chinese (Simplified)</SelectItem>
                        <SelectItem value="zh-tw">Chinese (Traditional)</SelectItem>
                        <SelectItem value="hr">Croatian</SelectItem>
                        <SelectItem value="cs">Czech</SelectItem>
                        <SelectItem value="da">Danish</SelectItem>
                        <SelectItem value="nl">Dutch</SelectItem>
                        <SelectItem value="et">Estonian</SelectItem>
                        <SelectItem value="fil">Filipino</SelectItem>
                        <SelectItem value="fi">Finnish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="ka">Georgian</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="el">Greek</SelectItem>
                        <SelectItem value="he">Hebrew</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="hu">Hungarian</SelectItem>
                        <SelectItem value="id">Indonesian</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="kk">Kazakh</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                        <SelectItem value="ky">Kyrgyz</SelectItem>
                        <SelectItem value="lv">Latvian</SelectItem>
                        <SelectItem value="lt">Lithuanian</SelectItem>
                        <SelectItem value="mk">Macedonian</SelectItem>
                        <SelectItem value="ms">Malay</SelectItem>
                        <SelectItem value="no">Norwegian</SelectItem>
                        <SelectItem value="fa">Persian</SelectItem>
                        <SelectItem value="pl">Polish</SelectItem>
                        <SelectItem value="pt-br">Portuguese (Brazilian)</SelectItem>
                        <SelectItem value="pt-pt">Portuguese (European)</SelectItem>
                        <SelectItem value="ro">Romanian</SelectItem>
                        <SelectItem value="ru">Russian</SelectItem>
                        <SelectItem value="sr">Serbian</SelectItem>
                        <SelectItem value="si">Sinhala</SelectItem>
                        <SelectItem value="sk">Slovak</SelectItem>
                        <SelectItem value="sl">Slovenian</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                        <SelectItem value="sv">Swedish</SelectItem>
                        <SelectItem value="tg">Tajik</SelectItem>
                        <SelectItem value="th">Thai</SelectItem>
                        <SelectItem value="tr">Turkish</SelectItem>
                        <SelectItem value="tk">Turkmen</SelectItem>
                        <SelectItem value="uk">Ukrainian</SelectItem>
                        <SelectItem value="ur">Urdu</SelectItem>
                        <SelectItem value="uz">Uzbek</SelectItem>
                        <SelectItem value="vi">Vietnamese</SelectItem>
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="articleType" className="font-semibold flex justify-between">
                    <span className="flex items-center gap-1">
                      Article Type <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </span>
                    <span className="text-muted-foreground font-normal">0/50</span>
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
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="comparison">Comparison</SelectItem>
                      <SelectItem value="case-study">Case study</SelectItem>
                      <SelectItem value="opinion-piece">Opinion piece</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="roundup-post">Roundup post</SelectItem>
                      <SelectItem value="q&a-page">Q&amp;A page</SelectItem>
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
                  <Label htmlFor="toneOfVoice" className="font-semibold flex justify-between">
                    <span>Tone of voice</span>
                    <span className="text-muted-foreground font-normal">8/50</span>
                  </Label>
                  <Select name="toneOfVoice" defaultValue="friendly">
                    <SelectTrigger id="toneOfVoice" className="mt-1">
                      <SelectValue placeholder="e.g. Creative or Winston Churchill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="informational">Informational</SelectItem>
                      <SelectItem value="transactional">Transactional</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="witty">Witty</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="encouraging">Encouraging</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="poetic">Poetic</SelectItem>
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
                      <SelectItem value="first-person-plural">First person plural (we, us, our, ours)</SelectItem>
                      <SelectItem value="second-person">Second person (you, your, yours)</SelectItem>
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
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="af">Afghanistan</SelectItem>
                        <SelectItem value="al">Albania</SelectItem>
                        <SelectItem value="dz">Algeria</SelectItem>
                        <SelectItem value="as">American Samoa</SelectItem>
                        <SelectItem value="ad">Andorra</SelectItem>
                        <SelectItem value="ao">Angola</SelectItem>
                        <SelectItem value="ai">Anguilla</SelectItem>
                        <SelectItem value="ag">Antigua &amp; Barbuda</SelectItem>
                        <SelectItem value="ar">Argentina</SelectItem>
                        <SelectItem value="am">Armenia</SelectItem>
                        <SelectItem value="aw">Aruba</SelectItem>
                        <SelectItem value="at">Austria</SelectItem>
                        <SelectItem value="az">Azerbaijan</SelectItem>
                        <SelectItem value="bs">Bahamas</SelectItem>
                        <SelectItem value="bh">Bahrain</SelectItem>
                        <SelectItem value="bd">Bangladesh</SelectItem>
                        <SelectItem value="bb">Barbados</SelectItem>
                        <SelectItem value="by">Belarus</SelectItem>
                        <SelectItem value="be">Belgium</SelectItem>
                        <SelectItem value="bz">Belize</SelectItem>
                        <SelectItem value="bj">Benin</SelectItem>
                        <SelectItem value="bm">Bermuda</SelectItem>
                        <SelectItem value="bt">Bhutan</SelectItem>
                        <SelectItem value="bo">Bolivia</SelectItem>
                        <SelectItem value="ba">Bosnia &amp; Herzegovina</SelectItem>
                        <SelectItem value="bw">Botswana</SelectItem>
                        <SelectItem value="bv">Bouvet Island</SelectItem>
                        <SelectItem value="br">Brazil</SelectItem>
                        <SelectItem value="io">British Indian Ocean Territory</SelectItem>
                        <SelectItem value="vg">British Virgin Islands</SelectItem>
                        <SelectItem value="bn">Brunei</SelectItem>
                        <SelectItem value="bg">Bulgaria</SelectItem>
                        <SelectItem value="bf">Burkina Faso</SelectItem>
                        <SelectItem value="bi">Burundi</SelectItem>
                        <SelectItem value="kh">Cambodia</SelectItem>
                        <SelectItem value="cm">Cameroon</SelectItem>
                        <SelectItem value="cv">Cape Verde</SelectItem>
                        <SelectItem value="ky">Cayman Islands</SelectItem>
                        <SelectItem value="cf">Central African Republic</SelectItem>
                        <SelectItem value="td">Chad</SelectItem>
                        <SelectItem value="cl">Chile</SelectItem>
                        <SelectItem value="cn">China</SelectItem>
                        <SelectItem value="cx">Christmas Island</SelectItem>
                        <SelectItem value="cc">Cocos (Keeling) Islands</SelectItem>
                        <SelectItem value="co">Colombia</SelectItem>
                        <SelectItem value="km">Comoros</SelectItem>
                        <SelectItem value="cg">Congo - Brazzaville</SelectItem>
                        <SelectItem value="cd">Congo - Kinshasa</SelectItem>
                        <SelectItem value="ck">Cook Islands</SelectItem>
                        <SelectItem value="cr">Costa Rica</SelectItem>
                        <SelectItem value="hr">Croatia</SelectItem>
                        <SelectItem value="cu">Cuba</SelectItem>
                        <SelectItem value="cy">Cyprus</SelectItem>
                        <SelectItem value="cz">Czech Republic</SelectItem>
                        <SelectItem value="ci">Côte d’Ivoire</SelectItem>
                        <SelectItem value="dk">Denmark</SelectItem>
                        <SelectItem value="dj">Djibouti</SelectItem>
                        <SelectItem value="dm">Dominica</SelectItem>
                        <SelectItem value="do">Dominican Republic</SelectItem>
                        <SelectItem value="ec">Ecuador</SelectItem>
                        <SelectItem value="eg">Egypt</SelectItem>
                        <SelectItem value="sv">El Salvador</SelectItem>
                        <SelectItem value="gq">Equatorial Guinea</SelectItem>
                        <SelectItem value="er">Eritrea</SelectItem>
                        <SelectItem value="ee">Estonia</SelectItem>
                        <SelectItem value="sz">Eswatini</SelectItem>
                        <SelectItem value="et">Ethiopia</SelectItem>
                        <SelectItem value="fo">Faroe Islands</SelectItem>
                        <SelectItem value="fj">Fiji</SelectItem>
                        <SelectItem value="fi">Finland</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="gf">French Guiana</SelectItem>
                        <SelectItem value="pf">French Polynesia</SelectItem>
                        <SelectItem value="tf">French Southern Territories</SelectItem>
                        <SelectItem value="ga">Gabon</SelectItem>
                        <SelectItem value="gm">Gambia</SelectItem>
                        <SelectItem value="ge">Georgia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="gh">Ghana</SelectItem>
                        <SelectItem value="gi">Gibraltar</SelectItem>
                        <SelectItem value="gr">Greece</SelectItem>
                        <SelectItem value="gl">Greenland</SelectItem>
                        <SelectItem value="gd">Grenada</SelectItem>
                        <SelectItem value="gp">Guadeloupe</SelectItem>
                        <SelectItem value="gu">Guam</SelectItem>
                        <SelectItem value="gt">Guatemala</SelectItem>
                        <SelectItem value="gn">Guinea</SelectItem>
                        <SelectItem value="gw">Guinea-Bissau</SelectItem>
                        <SelectItem value="gy">Guyana</SelectItem>
                        <SelectItem value="ht">Haiti</SelectItem>
                        <SelectItem value="hm">Heard &amp; McDonald Islands</SelectItem>
                        <SelectItem value="hn">Honduras</SelectItem>
                        <SelectItem value="hk">Hong Kong</SelectItem>
                        <SelectItem value="hu">Hungary</SelectItem>
                        <SelectItem value="is">Iceland</SelectItem>
                        <SelectItem value="in">India</SelectItem>
                        <SelectItem value="id">Indonesia</SelectItem>
                        <SelectItem value="ir">Iran</SelectItem>
                        <SelectItem value="iq">Iraq</SelectItem>
                        <SelectItem value="ie">Ireland</SelectItem>
                        <SelectItem value="il">Israel</SelectItem>
                        <SelectItem value="it">Italy</SelectItem>
                        <SelectItem value="jm">Jamaica</SelectItem>
                        <SelectItem value="jp">Japan</SelectItem>
                        <SelectItem value="jo">Jordan</SelectItem>
                        <SelectItem value="kz">Kazakhstan</SelectItem>
                        <SelectItem value="ke">Kenya</SelectItem>
                        <SelectItem value="ki">Kiribati</SelectItem>
                        <SelectItem value="kw">Kuwait</SelectItem>
                        <SelectItem value="kg">Kyrgyzstan</SelectItem>
                        <SelectItem value="la">Laos</SelectItem>
                        <SelectItem value="lv">Latvia</SelectItem>
                        <SelectItem value="lb">Lebanon</SelectItem>
                        <SelectItem value="ls">Lesotho</SelectItem>
                        <SelectItem value="lr">Liberia</SelectItem>
                        <SelectItem value="ly">Libya</SelectItem>
                        <SelectItem value="li">Liechtenstein</SelectItem>
                        <SelectItem value="lt">Lithuania</SelectItem>
                        <SelectItem value="lu">Luxembourg</SelectItem>
                        <SelectItem value="mo">Macao</SelectItem>
                        <SelectItem value="mg">Madagascar</SelectItem>
                        <SelectItem value="mw">Malawi</SelectItem>
                        <SelectItem value="my">Malaysia</SelectItem>
                        <SelectItem value="mv">Maldives</SelectItem>
                        <SelectItem value="ml">Mali</SelectItem>
                        <SelectItem value="mt">Malta</SelectItem>
                        <SelectItem value="mh">Marshall Islands</SelectItem>
                        <SelectItem value="mq">Martinique</SelectItem>
                        <SelectItem value="mr">Mauritania</SelectItem>
                        <SelectItem value="mu">Mauritius</SelectItem>
                        <SelectItem value="yt">Mayotte</SelectItem>
                        <SelectItem value="mx">Mexico</SelectItem>
                        <SelectItem value="fm">Micronesia</SelectItem>
                        <SelectItem value="md">Moldova</SelectItem>
                        <SelectItem value="mc">Monaco</SelectItem>
                        <SelectItem value="mn">Mongolia</SelectItem>
                        <SelectItem value="ms">Montserrat</SelectItem>
                        <SelectItem value="ma">Morocco</SelectItem>
                        <SelectItem value="mz">Mozambique</SelectItem>
                        <SelectItem value="mm">Myanmar (Burma)</SelectItem>
                        <SelectItem value="na">Namibia</SelectItem>
                        <SelectItem value="nr">Nauru</SelectItem>
                        <SelectItem value="np">Nepal</SelectItem>
                        <SelectItem value="nl">Netherlands</SelectItem>
                        <SelectItem value="nc">New Caledonia</SelectItem>
                        <SelectItem value="nz">New Zealand</SelectItem>
                        <SelectItem value="ni">Nicaragua</SelectItem>
                        <SelectItem value="ne">Niger</SelectItem>
                        <SelectItem value="ng">Nigeria</SelectItem>
                        <SelectItem value="nu">Niue</SelectItem>
                        <SelectItem value="nf">Norfolk Island</SelectItem>
                        <SelectItem value="kp">North Korea</SelectItem>
                        <SelectItem value="mk">North Macedonia</SelectItem>
                        <SelectItem value="mp">Northern Mariana Islands</SelectItem>
                        <SelectItem value="no">Norway</SelectItem>
                        <SelectItem value="om">Oman</SelectItem>
                        <SelectItem value="pk">Pakistan</SelectItem>
                        <SelectItem value="pw">Palau</SelectItem>
                        <SelectItem value="ps">Palestine</SelectItem>
                        <SelectItem value="pa">Panama</SelectItem>
                        <SelectItem value="pg">Papua New Guinea</SelectItem>
                        <SelectItem value="py">Paraguay</SelectItem>
                        <SelectItem value="pe">Peru</SelectItem>
                        <SelectItem value="ph">Philippines</SelectItem>
                        <SelectItem value="pn">Pitcairn Islands</SelectItem>
                        <SelectItem value="pl">Poland</SelectItem>
                        <SelectItem value="pt">Portugal</SelectItem>
                        <SelectItem value="pr">Puerto Rico</SelectItem>
                        <SelectItem value="qa">Qatar</SelectItem>
                        <SelectItem value="ro">Romania</SelectItem>
                        <SelectItem value="ru">Russia</SelectItem>
                        <SelectItem value="rw">Rwanda</SelectItem>
                        <SelectItem value="re">Réunion</SelectItem>
                        <SelectItem value="sm">Samoa</SelectItem>
                        <SelectItem value="sa">Saudi Arabia</SelectItem>
                        <SelectItem value="sn">Senegal</SelectItem>
                        <SelectItem value="rs">Serbia</SelectItem>
                        <SelectItem value="sc">Seychelles</SelectItem>
                        <SelectItem value="sl">Sierra Leone</SelectItem>
                        <SelectItem value="sg">Singapore</SelectItem>
                        <SelectItem value="sk">Slovakia</SelectItem>
                        <SelectItem value="si">Slovenia</SelectItem>
                        <SelectItem value="sb">Solomon Islands</SelectItem>
                        <SelectItem value="so">Somalia</SelectItem>
                        <SelectItem value="za">South Africa</SelectItem>
                        <SelectItem value="kr">South Korea</SelectItem>
                        <SelectItem value="es">Spain</SelectItem>
                        <SelectItem value="lk">Sri Lanka</SelectItem>
                        <SelectItem value="sh">St. Helena</SelectItem>
                        <SelectItem value="kn">St. Kitts &amp; Nevis</SelectItem>
                        <SelectItem value="lc">St. Lucia</SelectItem>
                        <SelectItem value="pm">St. Pierre &amp; Miquelon</SelectItem>
                        <SelectItem value="vc">St. Vincent &amp; Grenadines</SelectItem>
                        <SelectItem value="sd">Sudan</SelectItem>
                        <SelectItem value="sr">Suriname</SelectItem>
                        <SelectItem value="sj">Svalbard &amp; Jan Mayen</SelectItem>
                        <SelectItem value="se">Sweden</SelectItem>
                        <SelectItem value="ch">Switzerland</SelectItem>
                        <SelectItem value="sy">Syria</SelectItem>
                        <SelectItem value="st">São Tomé &amp; Príncipe</SelectItem>
                        <SelectItem value="tw">Taiwan</SelectItem>
                        <SelectItem value="tj">Tajikistan</SelectItem>
                        <SelectItem value="tz">Tanzania</SelectItem>
                        <SelectItem value="th">Thailand</SelectItem>
                        <SelectItem value="tg">Togo</SelectItem>
                        <SelectItem value="tk">Tokelau</SelectItem>
                        <SelectItem value="to">Tonga</SelectItem>
                        <SelectItem value="tt">Trinidad &amp; Tobago</SelectItem>
                        <SelectItem value="tn">Tunisia</SelectItem>
                        <SelectItem value="tm">Turkmenistan</SelectItem>
                        <SelectItem value="tc">Turks &amp; Caicos Islands</SelectItem>
                        <SelectItem value="tv">Tuvalu</SelectItem>
                        <SelectItem value="tr">Turkey</SelectItem>
                        <SelectItem value="um">U.S. Outlying Islands</SelectItem>
                        <SelectItem value="vi">U.S. Virgin Islands</SelectItem>
                        <SelectItem value="ug">Uganda</SelectItem>
                        <SelectItem value="ua">Ukraine</SelectItem>
                        <SelectItem value="ae">United Arab Emirates</SelectItem>
                        <SelectItem value="uy">Uruguay</SelectItem>
                        <SelectItem value="uz">Uzbekistan</SelectItem>
                        <SelectItem value="vu">Vanuatu</SelectItem>
                        <SelectItem value="va">Vatican City</SelectItem>
                        <SelectItem value="ve">Venezuela</SelectItem>
                        <SelectItem value="vn">Vietnam</SelectItem>
                        <SelectItem value="wf">Wallis &amp; Futuna</SelectItem>
                        <SelectItem value="eh">Western Sahara</SelectItem>
                        <SelectItem value="ye">Yemen</SelectItem>
                        <SelectItem value="zm">Zambia</SelectItem>
                        <SelectItem value="zw">Zimbabwe</SelectItem>
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
                      <SelectItem value="llama-serp-cta">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>Llama 4 + Real-Time SERP + CTA</span>
                            <span className="text-muted-foreground text-xs">1 credit</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Based on the latest LLAMa 4 Maverick from Meta
                          </p>
                        </div>
                      </SelectItem>
                      <SelectItem value="claude-serp-cta">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>
                              Claude 4 Sonnet + Real-Time SERP{" "}
                              <Badge variant="secondary" className="ml-1">
                                NEW
                              </Badge>
                            </span>
                            <span className="text-muted-foreground text-xs">1 credit</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Based on Claude 4 Sonnet + DeepSeek R1</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="deepseek-serp">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>DeepSeek V3 + Real-Time SERP</span>
                            <span className="text-muted-foreground text-xs">1 credit</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Based on DeepSeek V3 0324 with 671B parameters
                          </p>
                        </div>
                      </SelectItem>
                      <SelectItem value="default">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>Default</span>
                            <span className="text-muted-foreground text-xs">1 credit</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Mix of models and expertise</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="gpt-4o-mini">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>GPT-4o Mini &amp; GPT-4o</span>
                            <span className="text-muted-foreground text-xs">1 credit</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Lightweight version of GPT-4o</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="claude-3.5-haiku">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>Claude 3.5 Haiku</span>
                            <span className="text-muted-foreground text-xs">1 credit</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Latest fast model by Anthropic</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="llama-4-maverick">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>Llama 4 Maverick</span>
                            <span className="text-muted-foreground text-xs">1 credit</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Latest powerful model by Meta</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="deepseek-r1">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>DeepSeek R1</span>
                            <span className="text-muted-foreground text-xs">1 credit</span>
                          </div>
                          <p className="text-xs text-muted-foreground">671B parameter, long but powerful work</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="gpt-4o">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>GPT-4o</span>
                            <span className="text-muted-foreground text-xs">4 credits</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Latest powerful model by OpenAI</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="claude-4-sonnet">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>
                              Claude 4 Sonnet{" "}
                              <Badge variant="secondary" className="ml-1">
                                NEW
                              </Badge>
                            </span>
                            <span className="text-muted-foreground text-xs">4 credits</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Latest powerful model by Anthropic</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="gpt-4-turbo">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>GPT-4 Turbo</span>
                            <span className="text-muted-foreground text-xs">7 credits</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Legacy powerful model by OpenAI</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="claude-4-opus">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>
                              Claude 4 Opus{" "}
                              <Badge variant="secondary" className="ml-1">
                                NEW
                              </Badge>
                            </span>
                            <span className="text-muted-foreground text-xs">10 credits</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Powerful model by Anthropic</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="gpt-o1">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between w-full">
                            <span>GPT-o1</span>
                            <span className="text-muted-foreground text-xs">15 credits</span>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex justify-between items-center mt-1">
                    <Button variant="link" className="text-primary px-0 text-xs" type="button">
                      What is a Real-Time SERP?
                    </Button>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Wand2 className="w-3 h-3 text-primary" /> 1 credit
                    </span>
                  </div>
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
                      <SelectItem value="grade-5">5th grade, easily understood by 11-year-olds</SelectItem>
                      <SelectItem value="grade-6">6th grade, easy to read. Conversational language</SelectItem>
                      <SelectItem value="grade-7">7th grade, fairly easy to read</SelectItem>
                      <SelectItem value="grade-8-9">8th &amp; 9th grade, easily understood Recommended</SelectItem>
                      <SelectItem value="grade-10-12">10th to 12th grade, fairly difficult to read</SelectItem>
                      <SelectItem value="college">College, difficult to read</SelectItem>
                      <SelectItem value="college-grad">College graduate, very difficult to read</SelectItem>
                      <SelectItem value="professional">Professional, extremely difficult to read</SelectItem>
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Details to Include <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
              </h2>
              <Button variant="link" className="text-primary" type="button">
                New
              </Button>
            </div>
            <Card className="p-6">
              <Label htmlFor="details-to-include" className="flex justify-between">
                <span>
                  What details would you like to include in your article?{" "}
                  <Button variant="link" className="text-primary p-0 h-auto" type="button">
                    Learn more.
                  </Button>
                </span>
                <span className="text-muted-foreground font-normal">0/1000</span>
              </Label>
              <Textarea
                ref={detailsInputRef}
                name="details-to-include"
                id="details-to-include"
                placeholder="e.g. phone number as 212-555-1234"
                className="mt-1 min-h-[100px]"
              />
            </Card>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Media Hub <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
              </h2>
              <Button variant="link" className="text-primary" type="button">
                Feature evolution
              </Button>
            </div>
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
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="9">9</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="flex justify-between">
                    <span>Image style</span>
                    <span className="text-muted-foreground font-normal">0/50</span>
                  </Label>
                  <Select name="imageStyle" defaultValue="none">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="e.g. Andy Warhol or Star Wars" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="photo">Photo</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="cubism">Cubism</SelectItem>
                      <SelectItem value="expressionism">Expressionism</SelectItem>
                      <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="impressionism">Impressionism</SelectItem>
                      <SelectItem value="surrealism">Surrealism</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="comic-book">Comic Book</SelectItem>
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
                      <SelectItem value="5:4">960×768 (5:4)</SelectItem>
                      <SelectItem value="8:5">1024×640 (8:5)</SelectItem>
                      <SelectItem value="4:3">1024×768 (4:3)</SelectItem>
                      <SelectItem value="3:2">1152×768 (3:2)</SelectItem>
                      <SelectItem value="20:11">1280×704 (20:11)</SelectItem>
                      <SelectItem value="9:16">768×1344 (9:16)</SelectItem>
                      <SelectItem value="1:1">1024×1024 (1:1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="additional-instructions" className="flex justify-between">
                    <span>
                      Additional Instructions <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </span>
                    <span className="text-muted-foreground font-normal">0/100</span>
                  </Label>
                  <Input
                    name="additional-instructions"
                    id="additional-instructions"
                    placeholder="Enter details or creative directions"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="brand-name" className="flex justify-between">
                    <span>
                      Brand Name <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </span>
                    <span className="text-muted-foreground font-normal">0/30</span>
                  </Label>
                  <Input name="brand-name" id="brand-name" placeholder="Enter your brand name" className="mt-1" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Checkbox name="include-keyword" id="include-keyword" defaultChecked />
                  <Label htmlFor="include-keyword" className="font-normal leading-snug">
                    Include the main keyword in the first image as Alt-text. Relevant keywords will be picked up and
                    added to the rest of the images.
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
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="9">9</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
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
                      <SelectItem value="alternate-vid-img">Alternate video and image</SelectItem>
                      <SelectItem value="img-first">First images, then videos</SelectItem>
                      <SelectItem value="vid-first">First videos, then images</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox name="strict-placement" id="strict-placement" />
                <Label htmlFor="strict-placement" className="font-normal leading-snug">
                  All media elements will be placed strictly under the headings. If disabled, the AI will decide and
                  find the best placement.
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
                    If you do not provide the keywords, we will automatically generate relevant keywords from the main
                    keyword for each section and use them to generate the article.
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
                    External Linking automatically integrates authoritative and relevant external links into your
                    content, while also allowing you to manually specify desired links.
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
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <Label>Search Depth</Label>
                    <Button variant="link" className="text-primary p-0 h-auto text-sm" type="button">
                      Feel the Deep Web's Force!
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Currently, your "Connect to Web" is off, limiting you to pre-trained data. Enabling it reduces AI
                    hallucinations and improves accuracy.
                  </p>
                </div>
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
                      <SelectItem value="short-thread">Short Thread</SelectItem>
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
                      <SelectItem value="placeholder">Placeholder</SelectItem>
                      <SelectItem value="wordpress">WordPress Link</SelectItem>
                      <SelectItem value="custom">Custom Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Note</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    No link will be used in the creation of marketing materials, ensuring clean and appealing content.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Outline Editor <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
              </h2>
              <Badge variant="outline" className="border-primary/50 text-primary">
                Must-Have
              </Badge>
            </div>
            <Card className="p-6">
              <p className="text-muted-foreground">
                Enable the OUTLINE editor for your article to gain the ability to add a personalized OUTLINE to your
                upcoming article, enhancing their structure and relevance.
              </p>
              <ul className="list-disc pl-5 mt-4 text-muted-foreground space-y-2 text-sm">
                <li>
                  <span className="font-semibold text-foreground">Magic Bag Button:</span> Generates a real-time OUTLINE
                  based on the top-ranking articles on search engines for your topic, if "Connect to Web" is enabled.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Add a Headline:</span> Allows you to manually create a
                  list of headlines for your article.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Drag-and-Drop:</span> Conveniently reorganize
                  headlines by dragging and dropping them within the outline.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Top-Tier AI System:</span> The OUTLINE generation is
                  powered by the GPT-4 128K Turbo model!
                </li>
              </ul>
            </Card>
          </div>

          <Card className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Checkbox name="enableOutlineEditor" id="enable-outline-editor" />
                <Label htmlFor="enable-outline-editor" className="font-normal">
                  Enable the Outline editorAutomatic based on SERP
                </Label>
              </div>
              <span className="text-sm text-muted-foreground">Total: 0/50</span>
            </div>

            <div className="p-4 bg-secondary rounded-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div>
                  Main Keyword: <span className="font-semibold text-foreground">None</span>
                </div>
                <div>
                  Language: <span className="font-semibold text-foreground">English (US)</span>
                </div>
                <div>
                  Tone of voice: <span className="font-semibold text-foreground">Friendly</span>
                </div>
                <div>
                  Connect to Web: <span className="font-semibold text-foreground">No</span>
                </div>
                <div>
                  Title: <span className="font-semibold text-foreground">None</span>
                </div>
                <div>
                  Target country: <span className="font-semibold text-foreground">United States</span>
                </div>
                <div>
                  Include H3: <span className="font-semibold text-foreground">Yes</span>
                </div>
                <div>
                  Article size: <span className="font-semibold text-foreground">9-12 H2</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" disabled type="button">
                <Wand2 className="mr-2 h-4 w-4" />
                Magic bag
              </Button>
            </div>
          </Card>

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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Publishing to Website <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
              </h2>
              <Badge variant="outline" className="text-primary border-primary/50">
                New!
              </Badge>
            </div>
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
      </div>
    </form>
  )
}
