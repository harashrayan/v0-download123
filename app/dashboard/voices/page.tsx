import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Voicemail, Clock, Zap } from "lucide-react"
import Link from "next/link"

export default function VoicesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Voice Generation</h1>
      </div>

      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Voicemail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Coming Soon</CardTitle>
          <CardDescription className="text-lg">
            Transform your articles into natural-sounding audio with AI voices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <Zap className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold">Multiple Voice Options</div>
                <div className="text-sm text-muted-foreground">Choose from various AI voices</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold">Fast Generation</div>
                <div className="text-sm text-muted-foreground">Convert articles in seconds</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              We're working hard to bring you high-quality voice generation capabilities. This feature will allow you to
              convert your written content into professional audio files.
            </p>

            <div className="flex gap-4 justify-center">
              <Button disabled>
                <Voicemail className="h-4 w-4 mr-2" />
                Try Voice Generation
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/roadmap">View Roadmap</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
