"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useRole } from "@/components/providers/role-provider"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { SidebarProvider } from "@/contexts/SidebarContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { role, isLoaded } = useRole()

  useEffect(() => {
    if (!isLoaded) return

    if (role === "DIRECTOR") {
      // Director cannot access employee-only pages
      if (
        pathname === "/workspace" || 
        pathname === "/tasks" || 
        pathname === "/reports" || 
        pathname === "/attendance"
      ) {
        router.push("/")
      }
    } else if (role === "MANAGER") {
      // Manager can access most pages except admin and executive dashboard
      if (pathname === "/admin" || pathname === "/") {
        router.push("/workspace")
      }
    } else if (role === "EMPLOYEE") {
      // Employee has restricted pages
      const allowedPaths = ["/workspace", "/attendance", "/tasks", "/reports", "/calendar", "/settings", "/projects", "/company"]
      const isProjectSubpath = pathname.startsWith("/projects/")
      if (!allowedPaths.includes(pathname) && !isProjectSubpath) {
        router.push("/workspace")
      }
    }
  }, [role, isLoaded, pathname, router])

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background relative">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 w-full">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
