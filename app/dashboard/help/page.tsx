import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, BookOpen, MessageCircle, Mail, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using Floral Verse AI tools",
      icon: BookOpen,
      articles: ["How to write your first article", "Understanding keyword research", "Setting up your workspace"],
    },
    {
      title: "Article Writing",
      description: "Master the art of AI-powered content creation",
      icon: MessageCircle,
      articles: ["Advanced article customization", "SEO optimization tips", "Using the humanizer tool"],
    },
    {
      title: "Troubleshooting",
      description: "Common issues and solutions",
      icon: Mail,
      articles: ["Generation failed errors", "Storage and quota limits", "Browser compatibility"],
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Help Center</h1>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search for help articles..." className="pl-10 h-12 text-base" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {helpCategories.map((category, index) => {
          const IconComponent = category.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-left justify-start">
                        <ExternalLink className="h-3 w-3 mr-2" />
                        {article}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
          <CardDescription>Can't find what you're looking for? Get in touch with our support team.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
