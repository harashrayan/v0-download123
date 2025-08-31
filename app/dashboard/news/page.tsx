import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      title: "New Super Page Feature Released",
      description: "Clone SERP winners in seconds with our latest AI-powered tool.",
      date: "2024-01-15",
      category: "Feature",
      isNew: true,
    },
    {
      id: 2,
      title: "Enhanced Keyword Research Algorithm",
      description: "More accurate keyword difficulty scores and search volume data.",
      date: "2024-01-10",
      category: "Improvement",
      isNew: false,
    },
    {
      id: 3,
      title: "Bulk Article Generation Now Available",
      description: "Generate up to 100 articles in a single batch with WordPress integration.",
      date: "2024-01-05",
      category: "Feature",
      isNew: false,
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
        <h1 className="text-3xl font-bold">News & Updates</h1>
      </div>

      <div className="space-y-6">
        {newsItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    {item.isNew && <Badge variant="secondary">New</Badge>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mb-4">{item.description}</CardDescription>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
