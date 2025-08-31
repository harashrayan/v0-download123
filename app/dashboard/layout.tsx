import type React from "react"
import { Suspense } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/icons"
import { Navigation } from "@/components/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Newspaper, Map, HelpCircle, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-center p-2">
            <Logo className="w-8 h-8 text-primary" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Navigation />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="News">
                <Link href="/dashboard/news">
                  <Newspaper />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Roadmap">
                <Link href="/dashboard/roadmap">
                  <Map />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Help">
                <Link href="/dashboard/help">
                  <HelpCircle />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Avatar className="w-8 h-8">
                  <AvatarFallback>WI</AvatarFallback>
                </Avatar>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Suspense fallback={<div>Loading...</div>}>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="w-full max-w-sm pl-9 bg-transparent" />
            </div>
          </header>
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
