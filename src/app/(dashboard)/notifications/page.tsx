"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Bell, CheckCircle2, Trash2 } from "lucide-react"
import { useTranslation } from "@/contexts/TranslationContext"

export default function NotificationsPage() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const loadNotifs = async () => {
      try {
        const res = await fetch('/api/db?collection=notifications', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setNotifications(data)
          }
        }
      } catch (e) {}
    }

    loadNotifs()
  }, [])

  const persistNotifications = (updatedList: any[]) => {
    fetch('/api/db?collection=notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedList),
      cache: 'no-store'
    }).catch(() => {})
  }

  const handleMarkAsRead = (id: number) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifications(updated)
    persistNotifications(updated)
    toast.success(t("notifications.marked_as_read"))
  }

  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    persistNotifications(updated)
    toast.success(t("notifications.marked_all_read"))
  }

  const handleDelete = (id: number) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    persistNotifications(updated)
    toast.success(t("notifications.deleted"))
  }

  const handleDeleteAll = () => {
    if (confirm(t("notifications.confirm_delete_all"))) {
      setNotifications([])
      persistNotifications([])
      toast.success(t("notifications.deleted_all"))
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="w-8 h-8 text-primary" /> {t("notifications.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("notifications.subtitle")}</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
          <button onClick={handleMarkAllAsRead} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            {t("notifications.mark_all_read_btn")}
          </button>
          <button onClick={handleDeleteAll} className="px-4 py-2 bg-destructive text-white rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors">
            {t("notifications.delete_all_btn")}
          </button>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card overflow-hidden">
        <div className="divide-y">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {t("notifications.no_notifications")}
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/30 ${!n.read ? 'bg-primary/5' : ''}`}>
                <div className="flex gap-4 items-start sm:items-center">
                  <div className={`mt-1 sm:mt-0 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
                  <div>
                    <h3 className={`text-base ${!n.read ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                      {n.text}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{n.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:shrink-0 ml-6 sm:ml-0">
                  {!n.read && (
                    <button onClick={() => handleMarkAsRead(n.id)} className="p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title={t("notifications.mark_as_read_title")}>
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(n.id)} className="p-2 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors" title={t("notifications.delete_title")}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
