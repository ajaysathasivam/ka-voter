"use client"

import * as React from "react"
import { IconInnerShadowTop, IconDashboard } from "@tabler/icons-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Add Candidate",
      url: "/dashboard/candidate/add",
      icon: IconDashboard,
    },
    {
      title: "View Candidate",
      url: "/dashboard/candidate/view",
      icon: IconDashboard,
    },
    {
      title: "Add States & Assembly",
      url: "/dashboard/state-assembly",
      icon: IconDashboard,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <IconInnerShadowTop className="size-5" />
                <span className="text-base font-semibold ml-2">Voter</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon className="size-4" />
                  <span className="ml-2">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer (user info) */}
      <SidebarFooter>
        <div className="flex items-center gap-2 p-3">
          <img
            src={data.user.avatar}
            alt={data.user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{data.user.name}</span>
            <span className="text-xs text-muted-foreground">{data.user.email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
