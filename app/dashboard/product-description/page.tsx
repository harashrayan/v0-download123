"use client"

import { useFormStatus } from "react-dom"
import { useFormState } from "react-dom"
import { useEffect, useRef } from "react"
import { generateProductDescriptionAction, type ProductDescriptionState } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Wand2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const initialState: ProductDescriptionState = {
  description: undefined,
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-5 w-5" /> Generate Description
        </>
      )}
    </Button>
  )
}

export default function ProductDescriptionPage() {
  const [state, formAction] = useFormState(generateProductDescriptionAction, initialState)
  const { toast } = useToast()
  const descriptionDisplayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      })
    }
  }, [state.error, state.timestamp, toast])

  useEffect(() => {
    if (state.description && descriptionDisplayRef.current) {
      descriptionDisplayRef.current.scrollTop = 0
    }
  }, [state.description, state.timestamp])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create a product description</CardTitle>
          <CardDescription>Fill in the details below to generate a new product description.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-base font-medium">
                Product Name
              </Label>
              <Input
                id="productName"
                name="productName"
                type="text"
                placeholder="e.g., 'Wireless Noise-Cancelling Headphones'"
                className="text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features" className="text-base font-medium">
                Key Features
              </Label>
              <Textarea
                id="features"
                name="features"
                placeholder="e.g., '40-hour battery, Bluetooth 5.0, Ultra-soft earcups'"
                className="text-base"
                required
              />
            </div>
            <div className="pt-2">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:h-full border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Generated Description</CardTitle>
          <CardDescription>Your AI-generated content will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            ref={descriptionDisplayRef}
            className="h-[60vh] overflow-y-auto rounded-lg bg-secondary p-4 border prose prose-sm max-w-none prose-p:text-foreground/90"
          >
            {state.description ? (
              <div
                key={state.timestamp}
                className="whitespace-pre-wrap animate-fade-in"
                dangerouslySetInnerHTML={{ __html: state.description.replace(/\n/g, "<br />") }}
              ></div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-center">
                <p>Your generated product description will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
