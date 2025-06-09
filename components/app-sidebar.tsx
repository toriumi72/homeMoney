"use client"

import * as React from "react"
import {
  Home,
  TrendingDown,
  TrendingUp,
  FolderOpen,
  Settings,
  HelpCircle,
  Search,
  Wallet,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "田中太郎",
    email: "demo@moneyflow.app",
    avatar: "/avatars/demo-user.jpg",
  },
  navMain: [
    {
      title: "ダッシュボード",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "支出管理",
      url: "/expenses",
      icon: TrendingDown,
    },
    {
      title: "収入管理",
      url: "/income",
      icon: TrendingUp,
    },
    {
      title: "カテゴリ管理",
      url: "/categories",
      icon: FolderOpen,
    },
  ],
  navSecondary: [
    {
      title: "設定",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "ヘルプ",
      url: "#",
      icon: HelpCircle,
    },
    {
      title: "検索",
      url: "#",
      icon: Search,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <Wallet className="!size-5" />
                <span className="text-base font-semibold">💰 MoneyFlow</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
