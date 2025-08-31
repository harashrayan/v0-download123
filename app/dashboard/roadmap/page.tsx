import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Clock, Zap } from "lucide-react"
import Link from "next/link"

export default function RoadmapPage() {
  const roadmapItems = [
    {
      id: 1,
      title: "Voice Generation Feature",
      description: "Convert your articles to natural-sounding audio with AI voices.",
      status: "in-progress",
      quarter: "Q1 2024",
      category: "Feature",
    },
    {
      id: 2,
      title: "Advanced SEO Analytics",
      description: "Real-time SEO scoring and optimization suggestions.",
      status: "planned",
      quarter: "Q2 2024",
      category: "Enhancement",
    },
    {
      id: 3,
      title: "Team Collaboration Tools",
      description: "Share projects and collaborate with team members.",
      status: "planned",
      quarter: "Q2 2024",
      category: "Feature",
    },
    {
      id: 4,
      title: "API Access",
      description: "Integrate Floral Verse AI into your own applications.",
      status: "research",
      quarter: "Q3 2024",
      category: "Platform",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Zap className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "planned":
        return <Badge variant="secondary">Planned</Badge>
      default:
        return <Badge variant="outline">Research</Badge>
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Product Roadmap</h1>
      </div>

      <div className="space-y-6">
        {roadmapItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(item.status)}
                    <Badge variant="outline">{item.category}</Badge>
                    <span className="text-sm text-muted-foreground">{item.quarter}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{item.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
