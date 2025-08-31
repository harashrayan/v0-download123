"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Sparkles,
  LayoutGrid,
  Workflow,
  Rocket,
  Zap,
  BrainCircuit,
  Info,
  KeyRound,
  ExternalLink,
  TrendingUp,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [showWelcomeCard, setShowWelcomeCard] = useState(true)
  const [userName, setUserName] = useState("User")
  const { toast } = useToast()

  useEffect(() => {
    const storedName = localStorage.getItem("userName")
    if (storedName) {
      setUserName(storedName)
    } else {
      const friendlyNames = ["Creator", "Writer", "Content Master", "AI Explorer", "Digital Creator"]
      const randomName = friendlyNames[Math.floor(Math.random() * friendlyNames.length)]
      setUserName(randomName)
      localStorage.setItem("userName", randomName)
    }
  }, [])

  const handleLearnNow = () => {
    toast({
      title: "Welcome Tutorial",
      description: "Starting your guided tour of Floral Verse AI tools...",
    })
    // Navigate to article writer with tutorial mode
    window.location.href = "/dashboard/article-writer?tutorial=true"
  }

  const handleUpgradeNow = () => {
    toast({
      title: "Upgrade Plan",
      description: "Redirecting to upgrade options...",
    })
    // In a real app, this would open a pricing modal or redirect to billing
    setTimeout(() => {
      toast({
        title: "Coming Soon",
        description: "Premium plans will be available soon! Stay tuned for updates.",
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {showWelcomeCard && (
        <Card className="p-6 bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground overflow-hidden relative group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <h2 className="text-2xl font-bold tracking-tight">WELCOME {userName.toUpperCase()}</h2>
              </div>
              <p className="max-w-md text-primary-foreground/90 leading-relaxed">
                Use this guide to learn how to write your first article using our AI writing tool.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleLearnNow}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Learn Now
                </Button>
                <Button
                  variant="ghost"
                  className="text-primary-foreground hover:bg-white/20 hover:scale-105 transition-all duration-200"
                  onClick={() => setShowWelcomeCard(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
            <div className="relative w-48 h-36 -mr-8 -mt-8">
              <Image
                src="/professional-person-working-on-laptop-with-ai-writ.png"
                alt="Professional working with AI writing tools"
                width={200}
                height={160}
                className="absolute right-0 bottom-0 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </Card>
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-balance">Tools to help you create</h3>
          <Badge variant="outline" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />6 Active Tools
          </Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/keyword-researcher" className="group">
            <Card className="p-6 flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all duration-300 h-full group-hover:scale-[1.02]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors duration-300">
                    <KeyRound className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg">Keyword Researcher</h4>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Discover thousands of keyword ideas and analyze their ranking difficulty.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/super-page" className="group">
            <Card className="p-6 flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all duration-300 h-full group-hover:scale-[1.02]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors duration-300">
                    <LayoutGrid className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      Super Page
                      <Badge className="text-xs bg-gradient-to-r from-primary to-accent">New!</Badge>
                    </h4>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  <Rocket className="w-4 h-4 mr-1" /> Conversion Rocket
                </Button>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Clone SERP winners in seconds. Your CTA lands where conversions peak.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/article-writer" className="group">
            <Card className="p-6 flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all duration-300 h-full group-hover:scale-[1.02]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors duration-300">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg">1-Click Blog Post</h4>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  <Zap className="w-4 h-4 mr-1" /> Lightning-Fast
                </Button>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Create the perfect article using only the title. Generate and publish it in 1 click.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/bulk-article-generation" className="group">
            <Card className="p-6 flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all duration-300 h-full group-hover:scale-[1.02]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors duration-300">
                    <Workflow className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg">Bulk Article Generation</h4>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  <BrainCircuit className="w-4 h-4 mr-1" /> Power That Scares
                </Button>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Bulk generate and auto-post up to 100 articles in a batch to WordPress in 1-click.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/humanizer" className="group">
            <Card className="p-6 flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all duration-300 h-full group-hover:scale-[1.02]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors duration-300">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg">Humanizer Tool</h4>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  Readability
                </Button>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Rewrite your article, enhancing humanization and readability, improving your Google ranking.
              </p>
            </Card>
          </Link>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-balance">Recent Activity</h3>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/documents">
              <Clock className="w-4 h-4 mr-2" />
              View All
            </Link>
          </Button>
        </div>
        <Card className="p-12 flex flex-col items-center justify-center text-center bg-gradient-to-br from-secondary/30 to-secondary/10 border-dashed border-2 hover:border-primary/30 transition-colors duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h4 className="text-xl font-semibold mb-2">No documents yet!</h4>
          <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
            Create Articles That Are SEO-Optimized & Ready To Hit The Top of Google Searches.
          </p>
          <Button asChild className="hover:scale-105 transition-transform duration-200">
            <Link href="/dashboard/article-writer">
              <Sparkles className="mr-2 h-4 w-4" />
              Create Your First Article
            </Link>
          </Button>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6 text-balance">Your plan</h3>
        <Card className="p-6 bg-gradient-to-r from-card to-secondary/20 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="text-primary border-primary/50">
                  Free Plan
                </Badge>
                <span className="text-sm text-muted-foreground">Perfect for getting started</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>
                    <span className="font-semibold text-foreground">0</span> / 25,000 words used
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="flex items-center gap-1">
                    <span className="font-semibold text-foreground">0</span> / 5 Articles
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="flex items-center gap-1">
                    <span className="font-semibold text-foreground">0</span> / 1 Super Pages
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
              <Progress value={5} className="h-3 bg-secondary" />
              <p className="text-xs text-muted-foreground mt-2">5% of your monthly quota used</p>
            </div>
            <Button
              className="ml-8 hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              onClick={handleUpgradeNow}
            >
              <Rocket className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
