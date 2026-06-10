"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslation } from "@/contexts/TranslationContext"
import { useRole } from "@/components/providers/role-provider"
import { useSidebar } from "@/contexts/SidebarContext"
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Settings,
  DollarSign,
  Calendar,
  Clock,
  UserCircle,
  ShieldAlert,
  CheckSquare,
  ClipboardList,
  CalendarCheck2,
  Building2,
  FileSignature,
  Receipt,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  { icon: UserCircle, label: "My Workspace", href: "/workspace", tKey: "workspace" },
  { icon: CalendarCheck2, label: "Time & Leave", href: "/attendance", tKey: "attendance" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks", tKey: "tasks" },
  { icon: ClipboardList, label: "Daily Reports", href: "/reports", tKey: "reports" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/", tKey: "dashboard" },
  { icon: Users, label: "Clients", href: "/clients", tKey: "clients" },
  { icon: DollarSign, label: "Sales Pipeline", href: "/sales", tKey: "sales" },
  { icon: Briefcase, label: "Projects", href: "/projects", tKey: "projects" },
  { icon: Calendar, label: "Calendar", href: "/calendar", tKey: "calendar" },
  { icon: TrendingUp, label: "Finance", href: "/finance", tKey: "finance" },
  { icon: Clock, label: "HR", href: "/hr", tKey: "hr" },
  { icon: FileSignature, label: "Contracts", href: "/contracts", tKey: "contracts" },
  { icon: FileText, label: "Approvals", href: "/approvals", tKey: "approvals" },
  { icon: Receipt, label: "Expenses", href: "/expenses", tKey: "expenses" },
  { icon: MessageSquare, label: "Chat", href: "/chat", tKey: "chat" },
  { icon: Building2, label: "Company", href: "/company", tKey: "company" },
  { icon: Settings, label: "Settings", href: "/settings", tKey: "settings" }
]

export function AppSidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { role } = useRole()
  const { isOpen, close } = useSidebar()
  const [logoUrl, setLogoUrl] = useState("/logo.png")

  useEffect(() => {
    const handleStorage = () => {
      const l = localStorage.getItem("mrex_brand_logo")
      setLogoUrl(l || "/logo.png")
    }
    handleStorage()
    window.addEventListener("storage", handleStorage)
    window.addEventListener("themeSettingsUpdated", handleStorage)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("themeSettingsUpdated", handleStorage)
    }
  }, [])

  const filteredRoutes = routes.filter(route => {
    if (role === "DIRECTOR") {
      // Directors use Executive Dashboard, not Employee Workspace or Tasks or Reports or Attendance
      if (route.href === "/workspace" || route.href === "/tasks" || route.href === "/reports" || route.href === "/attendance") return false;
      return true;
    }
    
    // Non-directors cannot see the executive dashboard
    if (route.href === "/") return false;

    if (role === "MANAGER") {
      return ["/workspace", "/attendance", "/tasks", "/reports", "/projects", "/calendar", "/approvals", "/contracts", "/expenses", "/chat", "/company", "/settings"].includes(route.href);
    }
    if (role === "EMPLOYEE") {
      return ["/workspace", "/attendance", "/tasks", "/reports", "/projects", "/calendar", "/expenses", "/chat", "/company", "/settings"].includes(route.href);
    }
    return false;
  })

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" 
          onClick={close}
        />
      )}
      
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 md:shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Link href="/" className="py-6 flex flex-col items-center justify-center border-b gap-2 hover:bg-muted/50 transition-colors">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-14 max-w-[180px] object-contain drop-shadow-sm" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <span className="text-3xl font-black tracking-tighter">M</span>
            </div>
          )}
          <div className="font-black text-xl tracking-tight text-primary">
            Mrex <span className="text-foreground font-bold">Agency</span>
          </div>
        </Link>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {filteredRoutes.map((route) => {
          const isActive = pathname === route.href
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-medium" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <route.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              {t(`sidebar.${route.tKey}`)}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="bg-primary/10 rounded-xl p-3 flex items-center gap-3 border border-primary/20">
          {logoUrl && logoUrl !== "/logo.png" ? (
            <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              M
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">MRex Agency</p>
            <p className="text-[10px] text-primary font-medium truncate">Premium CMS</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  )
}
