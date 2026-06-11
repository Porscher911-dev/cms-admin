"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, X, ArrowRight, Bell } from "lucide-react"
import Link from "next/link"
import { useRole } from "@/components/providers/role-provider"
import { useTranslation } from "@/contexts/TranslationContext"

export function AttendanceReminder() {
  const { t } = useTranslation()
  const { role } = useRole()
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Only show for EMPLOYEE and MANAGER, not DIRECTOR (no attendance page)
    if (role === "DIRECTOR") return

    const checkReminder = async () => {
      const now = new Date()
      const hour = now.getHours()
      const minute = now.getMinutes()
      const todayKey = `attendance_reminder_${now.toDateString()}`

      // Only show between 07:30 – 09:30
      const afterStart = hour > 7 || (hour === 7 && minute >= 30)
      const beforeEnd = hour < 9 || (hour === 9 && minute <= 30)
      if (!afterStart || !beforeEnd) return

      // Check if already dismissed today
      if (sessionStorage.getItem(todayKey)) return

      // Check if already checked in today
      try {
        const res = await fetch(`/api/db?collection=attendance_${role}`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data && data.lastCheckInMs) {
            const lastCheckIn = new Date(parseInt(data.lastCheckInMs, 10))
            const isToday =
              lastCheckIn.getDate() === now.getDate() &&
              lastCheckIn.getMonth() === now.getMonth() &&
              lastCheckIn.getFullYear() === now.getFullYear()
            if (isToday) return // Already checked in
          }
        }
      } catch (e) {}

      setShow(true)
    }

    checkReminder()
    // Re-check every 5 minutes
    const interval = setInterval(checkReminder, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [role])

  const handleDismiss = () => {
    const todayKey = `attendance_reminder_${new Date().toDateString()}`
    sessionStorage.setItem(todayKey, "1")
    setDismissed(true)
    setTimeout(() => setShow(false), 300)
  }

  // Play gentle bell sound
  useEffect(() => {
    if (!show) return
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()

      const playBell = (freq: number, startTime: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0, startTime)
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startTime)
        osc.stop(startTime + 1.2)
      }

      playBell(523, ctx.currentTime)        // C5
      playBell(659, ctx.currentTime + 0.15) // E5
      playBell(784, ctx.currentTime + 0.30) // G5
    } catch (e) {}
  }, [show])

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed top-16 left-0 right-0 z-[60] px-4 py-2 flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto w-full max-w-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-2xl shadow-orange-500/30 px-5 py-3.5 flex items-center gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-tight">{t("attendance.reminder_title")}</p>
              <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 inline" />
                {new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} {t("attendance.reminder_subtitle")}
              </p>
            </div>
            <Link
              href="/attendance"
              onClick={handleDismiss}
              className="flex-shrink-0 flex items-center gap-1.5 bg-white text-orange-600 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-orange-50 transition-colors"
            >
              {t("attendance.check_in_now")} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              title={t("common.dismiss")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
