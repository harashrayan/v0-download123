"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  PenSquare,
  ShoppingCart,
  Copy,
  Voicemail,
  Workflow,
  Sparkles,
  LayoutGrid,
  KeyRound,
} from "lucide-react"

const isActive = (pathname: string, href: string) => {
  if (href === "/dashboard") {
    return pathname === href
  }
  return pathname.startsWith(href)
}

export function Navigation() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive(pathname, "/dashboard")} tooltip="Dashboard">
          <Link href="/dashboard">
            <LayoutDashboard />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive(pathname, "/dashboard/keyword-researcher")}
          tooltip="Keyword Researcher"
        >
          <Link href="/dashboard/keyword-researcher">
            <KeyRound />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive(pathname, "/dashboard/super-page")} tooltip="Super Page">
          <Link href="/dashboard/super-page">
            <LayoutGrid />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive(pathname, "/dashboard/article-writer")} tooltip="Article Writer">
          <Link href="/dashboard/article-writer">
            <PenSquare />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive(pathname, "/dashboard/bulk-article-generation")}
          tooltip="Bulk Generation"
        >
          <Link href="/dashboard/bulk-article-generation">
            <Workflow />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive(pathname, "/dashboard/product-description")}
          tooltip="Product Description"
        >
          <Link href="/dashboard/product-description">
            <ShoppingCart />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive(pathname, "/dashboard/humanizer")} tooltip="Humanizer">
          <Link href="/dashboard/humanizer">
            <Sparkles />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive(pathname, "/dashboard/documents")} tooltip="Documents">
          <Link href="/dashboard/documents">
            <Copy />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Voices (Coming Soon)">
          <Link href="/dashboard/voices">
            <Voicemail />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
