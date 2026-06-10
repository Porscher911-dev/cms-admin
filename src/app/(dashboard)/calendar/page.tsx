"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Users,
  Video, X, Send, UserCircle, Tag, FileText, Briefcase, Star,
  MapPin, Bell, Trash2, Eye
} from "lucide-react"
import { useRole, type Role } from "@/components/providers/role-provider"
import { useTranslation } from "@/contexts/TranslationContext"

/* ─────────────── Types ─────────────── */
type EventCategory = "meeting" | "deadline" | "personal" | "company" | "team"

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: number // day of month
  month: number // 0-indexed
  year: number
  startTime: string
  endTime: string
  category: EventCategory
  createdBy: string
  createdByRole: Role
  createdByAvatar: string
  createdAt: string
  visibility: "all" | "self" // "self" = only the creator can see, "all" = everyone
}

/* ─────────────── Constants ─────────────── */
const categoryConfig: Record<EventCategory, { labelKey: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  meeting: { labelKey: "calendar.category_meeting", color: "text-blue-700", bgColor: "bg-blue-100", icon: <Video className="w-3 h-3" /> },
  deadline: { labelKey: "calendar.category_deadline", color: "text-rose-700", bgColor: "bg-rose-100", icon: <Clock className="w-3 h-3" /> },
  personal: { labelKey: "calendar.category_personal", color: "text-violet-700", bgColor: "bg-violet-100", icon: <UserCircle className="w-3 h-3" /> },
  company: { labelKey: "calendar.category_company", color: "text-emerald-700", bgColor: "bg-emerald-100", icon: <Briefcase className="w-3 h-3" /> },
  team: { labelKey: "calendar.category_team", color: "text-amber-700", bgColor: "bg-amber-100", icon: <Users className="w-3 h-3" /> },
}

const roleNames: Record<Role, string> = {
  DIRECTOR: "Nguyễn Minh Đức",
  MANAGER: "Vũ Quang Huy",
  EMPLOYEE: "Toby Vu",
}
const roleAvatars: Record<Role, string> = {
  DIRECTOR: "NĐ",
  MANAGER: "VH",
  EMPLOYEE: "TV",
}
const roleLabels: Record<Role, string> = {
  DIRECTOR: "hr.role_director",
  MANAGER: "hr.role_manager",
  EMPLOYEE: "hr.role_employee",
}

/* ─────────────── Initial Events ─────────────── */
const initialEvents: CalendarEvent[] = [
  {
    id: "E1",
    title: "Họp Client X",
    description: "Họp online với Client X để review tiến độ dự án quảng cáo Q3. Chuẩn bị slide báo cáo và số liệu ROI.",
    date: 6, month: 5, year: 2026,
    startTime: "09:00", endTime: "10:30",
    category: "meeting",
    createdBy: "Vũ Quang Huy", createdByRole: "MANAGER", createdByAvatar: "VH",
    createdAt: "01/06/2026 08:00",
    visibility: "all"
  },
  {
    id: "E2",
    title: "Team Building",
    description: "Tổ chức team building ngoài trời tại khu du lịch Suối Tiên. Tập trung tại văn phòng lúc 7h sáng.",
    date: 12, month: 5, year: 2026,
    startTime: "07:00", endTime: "17:00",
    category: "team",
    createdBy: "Nguyễn Minh Đức", createdByRole: "DIRECTOR", createdByAvatar: "NĐ",
    createdAt: "28/05/2026 14:00",
    visibility: "all"
  },
  {
    id: "E3",
    title: "Deadline Báo cáo",
    description: "Hạn cuối nộp báo cáo tháng 5 cho phòng kế toán. Bao gồm bảng lương, chi phí vận hành và doanh thu.",
    date: 15, month: 5, year: 2026,
    startTime: "17:00", endTime: "17:00",
    category: "deadline",
    createdBy: "Nguyễn Minh Đức", createdByRole: "DIRECTOR", createdByAvatar: "NĐ",
    createdAt: "01/06/2026 09:00",
    visibility: "all"
  },
  {
    id: "E4",
    title: "Khám sức khỏe định kỳ",
    description: "Lịch khám sức khỏe cá nhân tại BV Đại học Y Dược.",
    date: 20, month: 5, year: 2026,
    startTime: "08:00", endTime: "11:00",
    category: "personal",
    createdBy: "Toby Vu", createdByRole: "EMPLOYEE", createdByAvatar: "TV",
    createdAt: "03/06/2026 10:00",
    visibility: "self"
  },
  {
    id: "E5",
    title: "Họp nội bộ phòng Marketing",
    description: "Review KPI tháng, brainstorm chiến dịch tháng 7, phân công task mới.",
    date: 9, month: 5, year: 2026,
    startTime: "14:00", endTime: "15:30",
    category: "meeting",
    createdBy: "Vũ Quang Huy", createdByRole: "MANAGER", createdByAvatar: "VH",
    createdAt: "02/06/2026 16:00",
    visibility: "all"
  },
  {
    id: "E6",
    title: "Kỷ niệm thành lập công ty",
    description: "Buổi tiệc kỷ niệm 5 năm thành lập Mrex Agency. Dress code: Smart Casual.",
    date: 25, month: 5, year: 2026,
    startTime: "18:00", endTime: "21:00",
    category: "company",
    createdBy: "Nguyễn Minh Đức", createdByRole: "DIRECTOR", createdByAvatar: "NĐ",
    createdAt: "01/06/2026 07:00",
    visibility: "all"
  },
]

/* ─────────────── Helper: Calendar grid ─────────────── */
function getCalendarDays(month: number, year: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: { day: number; inMonth: boolean; month: number; year: number }[] = []

  // Previous month fill
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, inMonth: false, month: month - 1, year })
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, month, year })
  }
  // Next month fill
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, inMonth: false, month: month + 1, year })
  }
  return cells
}

const monthNames = [
  "1", "2", "3", "4", "5", "6",
  "7", "8", "9", "10", "11", "12"
]

/* ─────────────── Create Event Modal ─────────────── */
function CreateEventModal({
  onClose,
  onSave,
  currentRole,
  preselectedDate,
  currentMonth,
  currentYear,
}: {
  onClose: () => void
  onSave: (event: CalendarEvent) => void
  currentRole: Role
  preselectedDate: number | null
  currentMonth: number
  currentYear: number
}) {
  const { t } = useTranslation()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(preselectedDate || new Date().getDate())
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [category, setCategory] = useState<EventCategory>("personal")
  const [visibility, setVisibility] = useState<"all" | "self">(currentRole === "EMPLOYEE" ? "self" : "all")

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề sự kiện!")
      return
    }
    // Bug #6: Prevent creating events in the past
    const now = new Date()
    const eventDate = new Date(currentYear, currentMonth, date)
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    if (eventDate < todayMidnight) {
      toast.error("Không thể tạo sự kiện ở ngày đã qua!")
      return
    }
    const event: CalendarEvent = {
      id: `E${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      date,
      month: currentMonth,
      year: currentYear,
      startTime,
      endTime,
      category,
      createdBy: roleNames[currentRole],
      createdByRole: currentRole,
      createdByAvatar: roleAvatars[currentRole],
      createdAt: new Date().toLocaleString("vi-VN"),
      visibility,
    }
    onSave(event)
    toast.success(`Đã tạo sự kiện "${title}" thành công!`)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> {t("calendar.new_event")}
            </h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t("calendar.created_by")} <span className="font-semibold text-foreground">{roleNames[currentRole]}</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{t(roleLabels[currentRole])}</span>
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-sm font-bold text-foreground mb-1.5 block">{t("calendar.event_title")} *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("calendar.title_placeholder")}
              className="w-full px-4 py-2.5 bg-muted/30 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-bold text-foreground mb-1.5 block">{t("calendar.description")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("calendar.description_placeholder")}
              rows={3}
              className="w-full px-4 py-2.5 bg-muted/30 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-bold text-foreground mb-1.5 block">{t("calendar.date")}</label>
              <select
                value={date}
                onChange={(e) => setDate(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-muted/30 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-foreground mb-1.5 block">{t("calendar.start_time")}</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-muted/30 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground mb-1.5 block">{t("calendar.end_time")}</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-muted/30 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">{t("calendar.event_category")}</label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(categoryConfig) as [EventCategory, typeof categoryConfig.meeting][]).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    category === key
                      ? `${config.bgColor} ${config.color} ring-2 ring-offset-1 ring-current`
                      : "bg-muted/30 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {config.icon} {t(config.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">{t("calendar.visibility")}</label>
            <div className="flex gap-3">
              <button
                onClick={() => setVisibility("self")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  visibility === "self"
                    ? "bg-violet-100 text-violet-700 ring-2 ring-violet-300"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted"
                }`}
              >
                <UserCircle className="w-4 h-4" /> {t("calendar.only_me")}
              </button>
              <button
                onClick={() => setVisibility("all")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  visibility === "all"
                    ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted"
                }`}
              >
                <Users className="w-4 h-4" /> {t("calendar.everyone")}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex gap-3 justify-end bg-muted/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold border hover:bg-muted transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> {t("calendar.add_event")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────── Event Detail Modal ─────────────── */
function EventDetailModal({
  event,
  onClose,
  onDelete,
  currentRole,
}: {
  event: CalendarEvent
  onClose: () => void
  onDelete: (id: string) => void
  currentRole: Role
}) {
  const { t } = useTranslation()
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const config = categoryConfig[event.category]
  const canDelete = event.createdByRole === currentRole || currentRole === "DIRECTOR"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
      >
        {/* Color stripe */}
        <div className={`h-1.5 ${config.bgColor.replace("100", "400")}`} style={{
          background: event.category === "meeting" ? "#3b82f6" :
                     event.category === "deadline" ? "#ef4444" :
                     event.category === "personal" ? "#8b5cf6" :
                     event.category === "company" ? "#10b981" : "#f59e0b"
        }} />

        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${config.bgColor} ${config.color}`}>
                  {config.icon} {t(config.labelKey)}
                </span>
                {event.visibility === "self" && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-600">
                    <Eye className="w-3 h-3" /> {t("calendar.private")}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-foreground">{event.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">
          {event.description && (
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border">
              {event.description}
            </p>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border bg-muted/20">
              <div className="text-[11px] font-bold text-muted-foreground mb-1 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" /> {t("calendar.date")}
              </div>
              <div className="text-sm font-bold">{event.date}/{event.month + 1}/{event.year}</div>
            </div>
            <div className="p-3 rounded-xl border bg-muted/20">
              <div className="text-[11px] font-bold text-muted-foreground mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {t("calendar.time")}
              </div>
              <div className="text-sm font-bold">{event.startTime} – {event.endTime}</div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="p-4 rounded-xl border bg-gradient-to-r from-primary/5 to-transparent">
            <div className="text-[11px] font-bold text-muted-foreground mb-2 flex items-center gap-1">
              <UserCircle className="w-3 h-3" /> {t("calendar.creator")}
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                event.createdByRole === "DIRECTOR" ? "bg-purple-100 text-purple-700" :
                event.createdByRole === "MANAGER" ? "bg-blue-100 text-blue-700" :
                "bg-emerald-100 text-emerald-700"
              }`}>
                {event.createdByAvatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{event.createdBy}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    event.createdByRole === "DIRECTOR" ? "bg-purple-100 text-purple-700" :
                    event.createdByRole === "MANAGER" ? "bg-blue-100 text-blue-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>
                    {t(roleLabels[event.createdByRole])}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">{event.createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {canDelete && (
          <div className="px-6 pb-6">
            <button
              onClick={() => {
                onDelete(event.id)
                onClose()
                toast.success("Đã xóa sự kiện!")
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> {t("common.delete")}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ─────────────── Event Chip on Calendar ─────────────── */
function EventChip({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const config = categoryConfig[event.category]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-[10px] p-1.5 rounded-lg ${config.bgColor} ${config.color} font-medium cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-current transition-all group`}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      <div className="flex items-center gap-1 truncate">
        {config.icon}
        <span className="truncate">{event.title}</span>
      </div>
      <div className="flex items-center gap-1 mt-0.5 opacity-70">
        <div className={`w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-bold ${
          event.createdByRole === "DIRECTOR" ? "bg-purple-200 text-purple-800" :
          event.createdByRole === "MANAGER" ? "bg-blue-200 text-blue-800" :
          "bg-emerald-200 text-emerald-800"
        }`}>
          {event.createdByAvatar.charAt(0)}
        </div>
        <span className="truncate text-[9px]">{event.createdBy}</span>
      </div>
    </motion.div>
  )
}

/* ─────────────── Main Calendar Page ─────────────── */
export default function CalendarPage() {
  const { t } = useTranslation()
  const { role } = useRole()
  // Bug #7: Make 'today' reactive so it updates when date changes
  const [today, setToday] = useState(new Date())
  useEffect(() => {
    const checkDateChange = setInterval(() => {
      const now = new Date()
      setToday(prev => {
        if (prev.getDate() !== now.getDate() || prev.getMonth() !== now.getMonth() || prev.getFullYear() !== now.getFullYear()) {
          return now
        }
        return prev
      })
    }, 30000) // check every 30 seconds
    return () => clearInterval(checkDateChange)
  }, [])
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [preselectedDate, setPreselectedDate] = useState<number | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  useEffect(() => {
    fetch('/api/db?collection=calendar_events', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setEvents(data) })
      .catch(() => {})
  }, [])

  const saveEvents = async (updated: CalendarEvent[]) => {
    try {
      await fetch('/api/db?collection=calendar_events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
    } catch {}
  }

  const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const calendarCells = getCalendarDays(currentMonth, currentYear)
  const isToday = (day: number, inMonth: boolean) =>
    inMonth && day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }
  const goToday = () => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()) }

  const handleSaveEvent = useCallback((event: CalendarEvent) => {
    const updated = [...events, event]
    setEvents(updated)
    saveEvents(updated)
  }, [events])

  const handleDeleteEvent = useCallback((id: string) => {
    const updated = events.filter(e => e.id !== id)
    setEvents(updated)
    saveEvents(updated)
  }, [events])

  const handleDayClick = (day: number, inMonth: boolean) => {
    if (!inMonth) return
    setPreselectedDate(day)
    setShowCreateModal(true)
  }

  // Filter events based on visibility and role
  // Bug #5: "self" events should ONLY be visible to the creator, not even Director
  const getVisibleEvents = (day: number, month: number) => {
    return events.filter(e => {
      if (e.date !== day || e.month !== month) return false
      // "self" events are strictly private - only the creator can see them
      if (e.visibility === "self") {
        return e.createdByRole === role
      }
      // "all" events are visible to everyone
      return true
    })
  }

  // Stats
  const monthEvents = events.filter(e => e.month === currentMonth && e.year === currentYear)
  const myEvents = monthEvents.filter(e => e.createdByRole === role)

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-primary" /> {t("calendar.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("calendar.subtitle")}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
          <button
            onClick={goToday}
            className="flex items-center gap-2 bg-card border px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors shadow-sm"
          >
            {t("calendar.today")}
          </button>
          <button
            onClick={() => { setPreselectedDate(null); setShowCreateModal(true) }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> {t("calendar.add_event")}
          </button>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex items-center gap-4 flex-wrap"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border text-sm">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <span className="font-bold">{monthEvents.length}</span>
          <span className="text-muted-foreground">{t("calendar.events_this_month")}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border text-sm">
          <Star className="w-4 h-4 text-amber-500" />
          <span className="font-bold">{myEvents.length}</span>
          <span className="text-muted-foreground">{t("calendar.my_events")}</span>
        </div>
        <div className="flex items-center gap-3 ml-auto text-xs text-muted-foreground">
          {(Object.entries(categoryConfig) as [EventCategory, typeof categoryConfig.meeting][]).map(([key, c]) => (
            <span key={key} className={`flex items-center gap-1 ${c.color}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${c.bgColor}`} />
              {t(c.labelKey)}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="premium-card p-6"
      >
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            {t("common.month")} {monthNames[currentMonth]}, {currentYear}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 border rounded-lg hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className="p-2 border rounded-lg hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-muted/30 rounded-xl overflow-hidden border">
          {/* Day Labels */}
          {dayLabels.map(day => (
            <div key={day} className="bg-muted/50 p-3 text-center text-xs font-bold text-muted-foreground tracking-widest">
              {day}
            </div>
          ))}

          {/* Date Cells */}
          {calendarCells.map((cell, idx) => {
            const dayEvents = cell.inMonth ? getVisibleEvents(cell.day, currentMonth) : []
            const todayCell = isToday(cell.day, cell.inMonth)

            return (
              <div
                key={idx}
                onClick={() => handleDayClick(cell.day, cell.inMonth)}
                className={`bg-card min-h-[120px] p-2 transition-colors cursor-pointer border-t ${
                  cell.inMonth ? "hover:bg-accent/50" : "opacity-40"
                } ${todayCell ? "bg-primary/5" : ""}`}
              >
                <span className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  todayCell
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : cell.inMonth ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {cell.day}
                </span>

                {/* Events */}
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 2).map(evt => (
                    <EventChip key={evt.id} event={evt} onClick={() => setSelectedEvent(evt)} />
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-muted-foreground font-bold text-center py-0.5">
                      +{dayEvents.length - 2} {t("calendar.other_events")}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Upcoming Events List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="premium-card p-6"
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" /> {t("calendar.upcoming_events")}
        </h2>
        <div className="space-y-3">
          {events
            .filter(e => {
              if (e.visibility === "self" && e.createdByRole !== role) return false
              const evtDate = new Date(e.year, e.month, e.date)
              return evtDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate())
            })
            .sort((a, b) => {
              const da = new Date(a.year, a.month, a.date)
              const db = new Date(b.year, b.month, b.date)
              return da.getTime() - db.getTime()
            })
            .slice(0, 5)
            .map(evt => {
              const config = categoryConfig[evt.category]
              return (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedEvent(evt)}
                  className="flex items-center gap-4 p-4 rounded-xl border hover:bg-muted/20 transition-colors cursor-pointer group"
                >
                  {/* Date */}
                  <div className="flex flex-col items-center min-w-[50px]">
                    <span className="text-2xl font-black text-primary">{evt.date}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{t("common.month")} {evt.month + 1}</span>
                  </div>

                  {/* Divider */}
                  <div className={`w-1 h-12 rounded-full`} style={{
                    background: evt.category === "meeting" ? "#3b82f6" :
                               evt.category === "deadline" ? "#ef4444" :
                               evt.category === "personal" ? "#8b5cf6" :
                               evt.category === "company" ? "#10b981" : "#f59e0b"
                  }} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{evt.title}</h3>
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${config.bgColor} ${config.color} whitespace-nowrap`}>
                        {t(config.labelKey)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {evt.startTime} – {evt.endTime}
                      </span>
                    </div>
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      evt.createdByRole === "DIRECTOR" ? "bg-purple-100 text-purple-700" :
                      evt.createdByRole === "MANAGER" ? "bg-blue-100 text-blue-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>
                      {evt.createdByAvatar}
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-xs font-bold">{evt.createdBy}</div>
                      <div className="text-[10px] text-muted-foreground">{t(roleLabels[evt.createdByRole])}</div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          {events.filter(e => {
              if (e.visibility === "self" && e.createdByRole !== role) return false
            const evtDate = new Date(e.year, e.month, e.date)
            return evtDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate())
          }).length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-xl">
              {t("calendar.no_upcoming_events")}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateEventModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleSaveEvent}
            currentRole={role}
            preselectedDate={preselectedDate}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onDelete={handleDeleteEvent}
            currentRole={role}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
