"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Search, Menu, Globe, X, LogOut, User, Sun, Moon } from "lucide-react"
import { useTranslation } from "@/contexts/TranslationContext"
import { useRole, Role } from "@/components/providers/role-provider"
import { useTheme } from "next-themes"
import { useSidebar } from "@/contexts/SidebarContext"
import { toast } from "sonner"

export function AppHeader() {
  const { locale, setLocale, t } = useTranslation()
  const { role, setRole } = useRole()
  const { toggle } = useSidebar()
  const { theme, setTheme } = useTheme()
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showRoleMenu, setShowRoleMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const [notifications, setNotifications] = useState<any[]>([])

  const langRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLDivElement>(null)
  const notiRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Load notifications from API and listen to updates
  useEffect(() => {
    const loadNotifs = async () => {
      try {
        const res = await fetch('/api/db?collection=notifications', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setNotifications(data)
          } else {
            const defaultNotifs = [
              { id: 1, text: "Bạn có 1 đơn nghỉ phép mới cần duyệt", time: "5 phút trước", read: false },
              { id: 2, text: "Task 'Thiết kế banner' đã được hoàn thành", time: "30 phút trước", read: false },
              { id: 3, text: "Company Trip 2026 vừa được công bố!", time: "1 giờ trước", read: true },
            ]
            setNotifications(defaultNotifs)
            fetch('/api/db?collection=notifications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(defaultNotifs),
              cache: 'no-store'
            }).catch(() => {})
          }
        }
      } catch (e) {}
    }

    loadNotifs()

    const interval = setInterval(loadNotifs, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMarkAsRead = (id: number) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifications(updated)
    fetch('/api/db?collection=notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
      cache: 'no-store'
    }).catch(() => {})
  }

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLangMenu(false)
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setShowRoleMenu(false)
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter notifications by role
  const visibleNotifications = notifications.filter(n => {
    if (!n.forRoles) return true // visible to all if not specified
    return n.forRoles.includes(role)
  })

  const handleLogout = () => {
    document.cookie = 'mrex_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    window.location.href = '/login'
  }

  const unreadCount = visibleNotifications.filter(n => !n.read).length

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="md:hidden text-muted-foreground hover:text-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder={t("header.search")} 
            className="pl-9 pr-4 py-2 bg-muted/50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        )}

        {/* Language Switcher */}
        <div ref={langRef} className="relative">
          <button 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
            onClick={() => { setShowLangMenu(!showLangMenu); setShowRoleMenu(false); setShowNotifications(false); }}
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{locale}</span>
          </button>
          
          {showLangMenu && (
            <div className="absolute top-full right-0 mt-2 w-36 bg-card border rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <button 
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${locale === 'vi' ? 'text-primary font-semibold bg-primary/5' : 'text-muted-foreground'}`}
                onClick={() => { setLocale("vi"); setShowLangMenu(false); }}
              >
                🇻🇳 {t("header.lang_vi")}
              </button>
              <button 
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${locale === 'en' ? 'text-primary font-semibold bg-primary/5' : 'text-muted-foreground'}`}
                onClick={() => { setLocale("en"); setShowLangMenu(false); }}
              >
                🇬🇧 {t("header.lang_en")}
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notiRef} className="relative">
          <button 
            className="relative text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
            onClick={() => { setShowNotifications(!showNotifications); setShowRoleMenu(false); setShowLangMenu(false); }}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-card border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <h3 className="font-bold text-sm">Thông báo</h3>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{unreadCount} mới</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {visibleNotifications.map((n, idx) => (
                  <div 
                    key={`${n.id}-${idx}`} 
                    onClick={() => handleMarkAsRead(n.id)}
                    className={`px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer ${!n.read ? 'bg-primary/5 font-semibold border-l-4 border-l-primary' : ''}`}
                  >
                    <p className="text-sm text-foreground leading-snug">{n.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t text-center">
                <button onClick={() => toast.info("Đang mở danh sách thông báo...")} className="text-xs text-primary font-semibold hover:underline">Xem tất cả thông báo</button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div ref={profileRef} className="relative">
          <button 
            type="button"
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowLangMenu(false); }}
            className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-medium cursor-pointer hover:bg-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            T
          </button>

          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-card border rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-semibold text-foreground">Toby Vu</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
              <button 
                onClick={() => { window.location.href = '/settings'; setShowProfileMenu(false); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <User className="w-4 h-4" /> Cài đặt tài khoản
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-destructive/10 transition-colors flex items-center gap-2 text-destructive font-medium border-t mt-1"
              >
                <LogOut className="w-4 h-4" /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
