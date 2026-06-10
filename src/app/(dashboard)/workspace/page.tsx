"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"
import { 
  Target, 
  Megaphone, 
  BookOpen, 
  Network, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Circle, 
  CalendarDays, 
  Star, 
  ArrowUpRight, 
  ArrowDownRight,
  X,
  Plus,
  Pin,
  Edit3,
  Trash2,
  StickyNote
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRole } from "@/components/providers/role-provider"
import { MOCK_ANNOUNCEMENTS, MOCK_POLICIES, MOCK_DEPARTMENTS, Announcement } from "@/lib/company-data"
import { useTranslation } from "@/contexts/TranslationContext"

// Enriched Initial Mock Data
const initialProjects = [
  { 
    id: "P1", 
    name: "Chiến dịch SEO Tổng thể 2026", 
    client: "TechCorp Global", 
    type: "SEO", 
    status: "IN_PROGRESS", 
    progress: 65, 
    dueDate: "20/12/2026", 
    team: ["Alice", "Bob", "Charlie", "Toby Vu"],
    tasks: [
      { id: "T1", title: "Nghiên cứu từ khóa (Keyword Research)", status: "DONE", assignee: "Alice", date: "2026-06-05" },
      { id: "T2", title: "Tối ưu hóa On-page 50 bài viết cũ", status: "IN_PROGRESS", assignee: "Toby Vu", date: "2026-06-07" },
      { id: "T3", title: "Xây dựng 20 backlink chất lượng cao", status: "TODO", assignee: "Charlie", date: "2026-06-15" },
      { id: "T4", title: "Thiết kế banner vệ tinh", status: "TODO", assignee: "Toby Vu", date: "2026-06-20" }
    ]
  },
  { 
    id: "P2", 
    name: "Thiết kế UI/UX App Mobile", 
    client: "Innova Design", 
    type: "DESIGN", 
    status: "REVIEW", 
    progress: 90, 
    dueDate: "05/07/2026", 
    team: ["David", "Emma", "Toby Vu"],
    tasks: [
      { id: "T1", title: "Phác thảo Wireframe các màn hình chính", status: "DONE", assignee: "David", date: "2026-06-01" },
      { id: "T2", title: "Thiết kế High-fidelity UI", status: "DONE", assignee: "Emma", date: "2026-06-15" },
      { id: "T3", title: "Tạo Prototype tương tác", status: "IN_PROGRESS", assignee: "Toby Vu", date: "2026-06-25" }
    ]
  },
  { 
    id: "P3", 
    name: "Quay TVC Quảng Cáo Tết", 
    client: "Nexus Solutions", 
    type: "VIDEO", 
    status: "PLANNING", 
    progress: 10, 
    dueDate: "15/01/2027", 
    team: ["Frank", "Grace", "Henry", "Ivy"],
    tasks: [
      { id: "T1", title: "Lên ý tưởng & Kịch bản phân cảnh", status: "IN_PROGRESS", assignee: "Frank", date: "2026-07-10" },
      { id: "T2", title: "Tuyển chọn diễn viên & Khảo sát bối cảnh", status: "TODO", assignee: "Grace", date: "2026-08-01" }
    ]
  },
  { 
    id: "P4", 
    name: "Chạy Google Ads Q3", 
    client: "Alpha Marketing", 
    type: "GOOGLE_ADS", 
    status: "IN_PROGRESS", 
    progress: 45, 
    dueDate: "30/09/2026", 
    team: ["Jack", "Karen"],
    tasks: [
      { id: "T1", title: "Cài đặt tài khoản & Tracking pixel", status: "DONE", assignee: "Jack", date: "2026-07-01" },
      { id: "T2", title: "Thiết lập các nhóm quảng cáo & Target", status: "IN_PROGRESS", assignee: "Karen", date: "2026-07-15" }
    ]
  },
  { 
    id: "P5", 
    name: "Xây dựng Website E-commerce", 
    client: "Omega Retail", 
    type: "WEBSITE", 
    status: "COMPLETED", 
    progress: 100, 
    dueDate: "10/05/2026", 
    team: ["Liam", "Mona", "Nate"],
    tasks: [
      { id: "T1", title: "Thiết kế database & API", status: "DONE", assignee: "Liam", date: "2026-03-01" },
      { id: "T2", title: "Frontend & Code chức năng giỏ hàng", status: "DONE", assignee: "Mona", date: "2026-04-15" },
      { id: "T3", title: "Testing & Deploy Production", status: "DONE", assignee: "Nate", date: "2026-05-09" }
    ]
  },
]



export default function WorkspacePage() {
  const { t } = useTranslation()
  const { role, userProfile } = useRole()
  const [projects, setProjects] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<"tasks" | "portal" | "notes">("tasks")

  // Notes State
  const [notes, setNotes] = useState<any[]>([])
  const [showAddNote, setShowAddNote] = useState(false)
  const [editingNote, setEditingNote] = useState<any>(null)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [noteColor, setNoteColor] = useState("yellow")

  // Portal State
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS)
  const [policies, setPolicies] = useState(MOCK_POLICIES)
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [selectedDept, setSelectedDept] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const loadProjects = async () => {
      try {
        const res = await fetch('/api/db?collection=projects', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data) setProjects(data)
          else setProjects(initialProjects)
        } else {
          setProjects(initialProjects)
        }
      } catch (e) {
        setProjects(initialProjects)
      }
    }
    loadProjects()

    const savedAnnouncements = localStorage.getItem("mrex_announcements")
    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements))
    
    const savedPolicies = localStorage.getItem("mrex_policies")
    if (savedPolicies) setPolicies(savedPolicies)
      
    const savedDepartments = localStorage.getItem("mrex_departments")
    if (savedDepartments) setDepartments(JSON.parse(savedDepartments))

    // Load notes
    fetch(`/api/db?collection=notes_${role}`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data && Array.isArray(data)) setNotes(data) })
      .catch(() => {})
  }, [])

  const handleToggleTaskStatus = (projectId: string, taskId: string) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedTasks = p.tasks.map((t: any) => {
          if (t.id === taskId) {
            return {
              ...t,
              status: t.status === "DONE" ? "TODO" : "DONE"
            }
          }
          return t
        })

        const doneCount = updatedTasks.filter((t: any) => t.status === "DONE").length
        const progress = updatedTasks.length > 0 ? Math.round((doneCount / updatedTasks.length) * 100) : p.progress

        return {
          ...p,
          tasks: updatedTasks,
          progress
        }
      }
      return p
    })

    setProjects(updatedProjects)
    localStorage.setItem("mrex_projects", JSON.stringify(updatedProjects))
    toast.success(t("workspace.task_status_updated"))
  }

  // Notes Actions
  const saveNotes = (newNotes: any[]) => {
    setNotes(newNotes)
    fetch(`/api/db?collection=notes_${role}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotes),
      cache: 'no-store'
    }).catch(() => {})
  }

  const handleSaveNote = () => {
    if (!noteTitle.trim() && !noteContent.trim()) {
      toast.error(t("workspace.error_empty_note"))
      return
    }
    
    if (editingNote) {
      const updated = notes.map(n => n.id === editingNote.id ? { ...n, title: noteTitle, content: noteContent, color: noteColor, updatedAt: new Date().toISOString() } : n)
      saveNotes(updated)
      toast.success(t("workspace.note_updated"))
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        title: noteTitle || t("workspace.no_title"),
        content: noteContent,
        color: noteColor,
        pinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      saveNotes([newNote, ...notes])
      toast.success(t("workspace.note_added"))
    }
    setShowAddNote(false)
    setEditingNote(null)
    setNoteTitle("")
    setNoteContent("")
  }

  const handleDeleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id))
    toast.success(t("workspace.note_deleted"))
  }

  const handleTogglePinNote = (id: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)
    // Sort pinned to top
    updated.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
    saveNotes(updated)
  }

  const openEditNote = (note: any) => {
    setEditingNote(note)
    setNoteTitle(note.title)
    setNoteContent(note.content)
    setNoteColor(note.color)
    setShowAddNote(true)
  }

  const employeeName = userProfile?.name || "Toby Vu"
  // Filter projects where Toby Vu is a member
  const assignedProjects = projects.filter(p => p.team && p.team.includes(employeeName))

  // Flatten tasks assigned to Toby Vu
  const assignedTasks = projects.flatMap(p => 
    (p.tasks || []).map((t: any) => ({ ...t, projectId: p.id, projectName: p.name }))
  ).filter(t => t.assignee === employeeName)

  const completedCount = assignedTasks.filter(t => t.status === "DONE").length
  const pendingCount = assignedTasks.filter(t => t.status !== "DONE").length

  // Calculate late tasks: deadline in past and status is not DONE
  const todayStr = new Date().toISOString().split('T')[0]
  const lateCount = assignedTasks.filter(t => t.status !== "DONE" && t.date && t.date < todayStr).length

  // Calculate performance rating
  const completionRate = assignedTasks.length > 0 ? (completedCount / assignedTasks.length) * 100 : 0
  let performanceRating = t("workspace.none")
  let ratingColor = "text-muted-foreground"
  if (assignedTasks.length > 0) {
    if (lateCount > 0) {
      performanceRating = t("workspace.rating_needs_improvement")
      ratingColor = "text-rose-500 dark:text-rose-400"
    } else if (completionRate >= 90) {
      performanceRating = t("workspace.rating_excellent")
      ratingColor = "text-emerald-500 dark:text-emerald-400"
    } else if (completionRate >= 60) {
      performanceRating = t("workspace.rating_good")
      ratingColor = "text-blue-500 dark:text-blue-400"
    } else {
      performanceRating = t("workspace.rating_average")
      ratingColor = "text-amber-500 dark:text-amber-400"
    }
  }

  // Live company-wide stats for DIRECTOR/MANAGER
  const allTasks = projects.flatMap(p => p.tasks || [])
  const liveActiveProjects = projects.filter(p => p.status !== 'COMPLETED').length
  const liveTotalTasks = allTasks.length
  const liveDoneTasks = allTasks.filter((t: any) => t.status === 'DONE').length
  const liveAvgProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
    : 0

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">{t("workspace.title")}</h1>
        <p className="text-muted-foreground mt-1">
          {role === "EMPLOYEE" ? t("workspace.welcome_employee").replace("{name}", employeeName) : t("workspace.subtitle_director")}
        </p>
      </motion.div>

      {/* Stats Cards Section */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {role === "EMPLOYEE" ? (
          <>
            <StatCard 
              title={t("workspace.tasks_completed")} 
              value={mounted ? completedCount.toString() : "0"} 
              change={t("workspace.auto_update")} 
              trend="up" 
              icon={CheckCircle2} 
            />
            <StatCard 
              title={t("workspace.tasks_overdue")} 
              value={mounted ? lateCount.toString() : "0"} 
              change={lateCount > 0 ? t("workspace.require_immediate") : t("workspace.progress_good")} 
              trend={lateCount > 0 ? "down" : "up"} 
              icon={Clock} 
              isWarning={lateCount > 0}
            />
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
              }} 
              className="premium-card p-6 relative overflow-hidden group bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <Star className="w-24 h-24 text-emerald-600" />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-400">{t("workspace.performance_rating")}</h3>
                <div className="w-10 h-10 rounded-xl bg-emerald-200/50 flex items-center justify-center text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <Star className="w-5 h-5" />
                </div>
              </div>
              <div className="relative z-10">
                <h2 className={`text-3xl font-bold tracking-tight ${ratingColor}`}>{mounted ? performanceRating : t("workspace.none")}</h2>
                <div className="flex items-center gap-1 mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-500">
                  <span>{t("workspace.on_time")} {mounted && assignedTasks.length > 0 ? `${Math.round(((assignedTasks.length - lateCount) / assignedTasks.length) * 100)}%` : "100%"}</span>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            <StatCard 
              title={t("workspace.active_projects")} 
              value={mounted ? liveActiveProjects.toString() : "–"} 
              change={mounted ? t("workspace.total_projects").replace("{count}", projects.length.toString()) : t("common.loading")} 
              trend="up" 
              icon={CheckCircle2} 
            />
            <StatCard 
              title={t("workspace.tasks_done")} 
              value={mounted ? `${liveDoneTasks}/${liveTotalTasks}` : "–"} 
              change={mounted ? t("workspace.completion_rate").replace("{rate}", (liveTotalTasks > 0 ? Math.round((liveDoneTasks/liveTotalTasks)*100) : 0).toString()) : t("common.loading")} 
              trend={liveDoneTasks > 0 ? "up" : "down"} 
              icon={Clock} 
            />
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
              }} 
              className="premium-card p-6 relative overflow-hidden group bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <Star className="w-24 h-24 text-emerald-600" />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-400">{t("workspace.average_progress")}</h3>
                <div className="w-10 h-10 rounded-xl bg-emerald-200/50 flex items-center justify-center text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <Star className="w-5 h-5" />
                </div>
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">{mounted ? `${liveAvgProgress}%` : "–"}</h2>
                <div className="flex items-center gap-1 mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-500">
                  <span>{t("workspace.all_projects").replace("{count}", projects.length.toString())}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`relative pb-3 text-sm font-semibold transition-colors ${
            activeTab === "tasks" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>{t("workspace.tab_tasks")}</span>
          {mounted && assignedTasks.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs font-bold rounded-full bg-primary/10 text-primary">
              {pendingCount}
            </span>
          )}
          {activeTab === "tasks" && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("portal")}
          className={`relative pb-3 text-sm font-semibold transition-colors ml-6 ${
            activeTab === "portal" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{t("workspace.tab_portal")}</span>
            {mounted && announcements.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                {announcements.length} {t("workspace.new")}
              </span>
            )}
          </div>
          {activeTab === "portal" && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("notes")}
          className={`relative pb-3 text-sm font-semibold transition-colors ml-6 ${
            activeTab === "notes" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{t("workspace.tab_notes")}</span>
            {notes.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                {notes.filter(n => n.pinned).length > 0 ? `${notes.filter(n => n.pinned).length} ${t("workspace.pinned")}` : notes.length}
              </span>
            )}
          </div>
          {activeTab === "notes" && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          {activeTab === "tasks" ? (
            <motion.div
              key="tasks-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Pinned Notes (Full Width) */}
              {notes.filter(n => n.pinned).length > 0 && (
                <div className="lg:col-span-3 mb-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2"><Pin className="w-5 h-5 text-amber-500 fill-amber-500" /> {t("workspace.pinned_notes")}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {notes.filter(n => n.pinned).map((note) => {
                      const colorClasses = ({
                        yellow: "bg-amber-100 border-amber-200 text-amber-900 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-100",
                        blue: "bg-blue-100 border-blue-200 text-blue-900 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-100",
                        green: "bg-emerald-100 border-emerald-200 text-emerald-900 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-100",
                        red: "bg-rose-100 border-rose-200 text-rose-900 dark:bg-rose-500/20 dark:border-rose-500/30 dark:text-rose-100",
                        purple: "bg-purple-100 border-purple-200 text-purple-900 dark:bg-purple-500/20 dark:border-purple-500/30 dark:text-purple-100",
                      } as Record<string, string>)[note.color] || "bg-card"

                      return (
                        <div key={note.id} className={`p-4 rounded-2xl border ${colorClasses} shadow-sm relative flex flex-col h-[160px]`}>
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-bold line-clamp-1 pr-6">{note.title}</h3>
                            <button onClick={() => handleTogglePinNote(note.id)} className="absolute top-3 right-3 p-1.5 rounded-full text-foreground bg-foreground/10 hover:bg-foreground/20 transition-colors">
                              <Pin className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </div>
                          <p className="text-sm opacity-90 line-clamp-3 flex-1 whitespace-pre-wrap mt-1">{note.content}</p>
                          <div className="mt-2 pt-2 border-t border-foreground/10 text-[10px] opacity-60 font-medium">
                            {new Date(note.updatedAt).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Left Col: Tasks Checklist */}
              <div className="lg:col-span-2 premium-card p-6">
                <h2 className="text-lg font-bold mb-4">{t("workspace.assigned_tasks")}</h2>
                {mounted && assignedTasks.length > 0 ? (
                  <div className="space-y-3">
                    {assignedTasks.map((task: any) => (
                      <div 
                        key={`${task.projectId}-${task.id}`}
                        onClick={() => handleToggleTaskStatus(task.projectId, task.id)}
                        className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors group cursor-pointer text-foreground"
                      >
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleTaskStatus(task.projectId, task.id)
                            }}
                            className={`${task.status === 'DONE' ? 'text-emerald-500' : 'text-muted-foreground hover:text-primary'} transition-colors`}
                          >
                            {task.status === 'DONE' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                          </button>
                          <div>
                            <h4 className={`font-semibold ${task.status === 'DONE' ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground font-medium">
                              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">{task.projectName}</span>
                              <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {task.date}</span>
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                task.priority === 'Cao' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                              }`}>{task.priority || t("workspace.priority_normal")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground text-sm">
                    {t("workspace.no_tasks_assigned")}
                  </div>
                )}
              </div>

              {/* Right Col: Projects participated */}
              <div className="premium-card p-6">
                <h2 className="text-lg font-bold mb-4">{t("workspace.participated_projects")}</h2>
                {mounted && assignedProjects.length > 0 ? (
                  <div className="space-y-4">
                    {assignedProjects.map((project: any) => {
                      // Recalculate dynamic progress
                      const totalPTasks = project.tasks?.length || 0
                      const donePTasks = project.tasks?.filter((t: any) => t.status === "DONE").length || 0
                      const dynProgress = totalPTasks > 0 ? Math.round((donePTasks / totalPTasks) * 100) : project.progress

                      return (
                        <Link key={project.id} href={`/projects/${project.id}`}>
                          <div className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors cursor-pointer space-y-3 text-foreground">
                            <div className="flex justify-between items-start">
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-primary/10 text-primary">
                                {project.type}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-medium">{project.dueDate}</span>
                            </div>
                            <h4 className="font-bold text-sm line-clamp-1">{project.name}</h4>
                            <div>
                              <div className="flex justify-between text-xs mb-1 font-medium">
                                <span>{t("workspace.progress")}</span>
                                <span className="text-primary font-bold">{dynProgress}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${dynProgress}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground text-sm">
                    {t("workspace.no_projects")}
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeTab === "portal" ? (
            <motion.div
              key="portal-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="premium-card p-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
                    <Megaphone className="w-5 h-5 text-rose-500" /> {t("workspace.company_news")}
                  </h2>
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div key={ann.id} onClick={() => setSelectedAnnouncement(ann)} className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-500/5 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border border-rose-100 dark:border-rose-500/10 cursor-pointer group">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-700 dark:bg-rose-500/30 dark:text-rose-400">
                            {ann.isUrgent ? t("company.urgent") : ann.isPinned ? t("company.pinned") : t("company.news")}
                          </span>
                          <span className="text-xs text-muted-foreground">{ann.date}</span>
                        </div>
                        <h3 className="font-bold text-foreground group-hover:text-rose-600 transition-colors">{ann.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => toast.info(t("workspace.opening_news_list"))} className="w-full mt-4 py-2 text-sm text-rose-600 font-medium hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                    {t("workspace.view_all_news")} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div onClick={() => setShowPolicyModal(true)} className="premium-card p-6 border-t-4 border-t-blue-500 h-fit cursor-pointer hover:border-blue-500/50 transition-colors group">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-500" /> {t("workspace.policy_handbook")}
                    </h2>
                    <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"><span dangerouslySetInnerHTML={{ __html: t("workspace.view_details") }}></span></span>
                  </div>
                  <div className="bg-muted/30 p-5 rounded-xl border space-y-3">
                    <div className="prose dark:prose-invert prose-sm line-clamp-6 text-foreground/80">
                      {policies.split('\n').map((line, idx) => {
                        if (line.startsWith('# ')) return <h3 key={idx} className="font-bold mt-2">{line.replace('# ', '')}</h3>
                        if (line.startsWith('## ')) return <h4 key={idx} className="font-semibold mt-1">{line.replace('## ', '')}</h4>
                        if (line.startsWith('- ')) return <li key={idx} className="ml-4">{line.replace('- ', '')}</li>
                        return <p key={idx}>{line}</p>
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Org chart */}
              <div className="premium-card p-8 border-t-4 border-t-emerald-500 overflow-x-auto min-h-[400px]">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-8">
                  <Network className="w-5 h-5 text-emerald-500" /> {t("workspace.org_chart")}
                </h2>
                <div className="flex flex-col items-center gap-8 py-4">
                  {/* Director */}
                  <div className="relative bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 text-center p-4 rounded-xl shadow-sm min-w-[200px] border border-emerald-200">
                    <h3 className="font-bold text-lg">{t("company.board_of_directors")}</h3>
                    <p className="text-xs mt-1 opacity-80">Board of Directors</p>
                    <div className="absolute w-0.5 h-8 bg-border left-1/2 -bottom-8"></div>
                  </div>
                  
                  {/* Branches */}
                  <div className="flex gap-4 sm:gap-8 relative mt-8 pt-4">
                    <div className="absolute w-[calc(100%-140px)] sm:w-[calc(100%-180px)] h-0.5 bg-border top-0 left-1/2 -translate-x-1/2"></div>
                    
                    {departments.map((dept) => (
                      <div key={dept.id} className="relative flex flex-col items-center">
                        <div className="absolute w-0.5 h-4 bg-border left-1/2 -top-4"></div>
                        <div onClick={() => setSelectedDept(dept)} className="border bg-card text-center p-4 rounded-xl shadow-sm min-w-[140px] sm:min-w-[180px] z-10 relative cursor-pointer hover:border-emerald-500/50 transition-colors group">
                          <h3 className="font-semibold text-sm group-hover:text-emerald-600 transition-colors">{dept.name}</h3>
                          <p className="text-[10px] text-muted-foreground mt-1">{dept.desc}</p>
                        </div>
                        
                        {dept.employees && dept.employees.trim() !== '' && (
                          <>
                            <div className="w-0.5 h-6 bg-border"></div>
                            <div className="flex flex-col gap-2">
                              {dept.employees.split(',').map((emp, idx) => (
                                <div key={idx} className="bg-muted px-3 py-1.5 rounded-lg text-xs font-medium border border-border/50 text-center shadow-sm">
                                  {emp.trim()}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "notes" ? (
            <motion.div
              key="notes-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <StickyNote className="w-6 h-6 text-amber-500" /> {t("workspace.notes_board")}
                </h2>
                <button
                  onClick={() => { setEditingNote(null); setNoteTitle(""); setNoteContent(""); setNoteColor("yellow"); setShowAddNote(true); }}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" /> {t("workspace.create_note")}
                </button>
              </div>

              {notes.length === 0 ? (
                <div className="text-center py-16 border border-dashed rounded-2xl text-muted-foreground flex flex-col items-center justify-center">
                  <StickyNote className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p>{t("workspace.no_notes")}</p>
                  <button onClick={() => { setEditingNote(null); setNoteTitle(""); setNoteContent(""); setNoteColor("yellow"); setShowAddNote(true); }} className="text-amber-500 font-medium hover:underline mt-2">{t("workspace.create_now")}</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {notes.map((note) => {
                    const colorClasses = ({
                      yellow: "bg-amber-100 border-amber-200 text-amber-900 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-100",
                      blue: "bg-blue-100 border-blue-200 text-blue-900 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-100",
                      green: "bg-emerald-100 border-emerald-200 text-emerald-900 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-100",
                      red: "bg-rose-100 border-rose-200 text-rose-900 dark:bg-rose-500/20 dark:border-rose-500/30 dark:text-rose-100",
                      purple: "bg-purple-100 border-purple-200 text-purple-900 dark:bg-purple-500/20 dark:border-purple-500/30 dark:text-purple-100",
                    } as Record<string, string>)[note.color] || "bg-card"

                    return (
                      <motion.div
                        layout
                        key={note.id}
                        className={`p-5 rounded-2xl border ${colorClasses} shadow-sm group relative flex flex-col h-[200px]`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold line-clamp-1 pr-6">{note.title}</h3>
                          <button
                            onClick={() => handleTogglePinNote(note.id)}
                            className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${note.pinned ? "text-foreground bg-foreground/10" : "text-foreground/30 hover:bg-foreground/10 opacity-0 group-hover:opacity-100"}`}
                          >
                            <Pin className={`w-4 h-4 ${note.pinned ? "fill-current" : ""}`} />
                          </button>
                        </div>
                        <p className="text-sm opacity-90 line-clamp-4 flex-1 whitespace-pre-wrap">{note.content}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-foreground/10">
                          <span className="text-[10px] opacity-60 font-medium">
                            {new Date(note.updatedAt).toLocaleDateString("vi-VN")}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditNote(note)} className="p-1.5 rounded-md hover:bg-foreground/10 transition-colors">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteNote(note.id)} className="p-1.5 rounded-md hover:bg-rose-500/20 text-rose-600 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-700 dark:bg-rose-500/30 dark:text-rose-400">
                    {selectedAnnouncement.isUrgent ? t("company.urgent") : selectedAnnouncement.isPinned ? t("company.pinned") : t("company.news")}
                  </span>
                  <span className="text-xs text-muted-foreground">{selectedAnnouncement.date}</span>
                </div>
                <h2 className="text-xl font-bold">{selectedAnnouncement.title}</h2>
              </div>
              <button onClick={() => setSelectedAnnouncement(null)} className="p-2 rounded-full hover:bg-muted transition-colors shrink-0">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {selectedAnnouncement.content}
            </div>
            <div className="p-4 border-t bg-muted/30 flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{t("company.posted_by")} <span className="font-semibold text-foreground">{selectedAnnouncement.author}</span></span>
              <button onClick={() => setSelectedAnnouncement(null)} className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">{t("common.close")}</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Policy Detail Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden border flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex items-start justify-between gap-4 bg-blue-50/50 dark:bg-blue-900/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">{t("workspace.policy_handbook_title")}</h2>
              </div>
              <button onClick={() => setShowPolicyModal(false)} className="p-2 rounded-full hover:bg-muted transition-colors shrink-0">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 font-medium">
              <div className="prose dark:prose-invert max-w-none">
                {policies.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) return <h2 key={idx} className="font-bold text-lg mt-4 mb-2 text-primary">{line.replace('# ', '')}</h2>
                  if (line.startsWith('## ')) return <h3 key={idx} className="font-semibold text-base mt-3 mb-1">{line.replace('## ', '')}</h3>
                  if (line.startsWith('- ')) return <li key={idx} className="ml-4 mb-1">{line.replace('- ', '')}</li>
                  return <p key={idx} className="mb-2">{line}</p>
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Department Detail Modal */}
      {selectedDept && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden border flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex items-start justify-between gap-4 bg-emerald-50/50 dark:bg-emerald-900/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedDept.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedDept.desc}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDept(null)} className="p-2 rounded-full hover:bg-muted transition-colors shrink-0">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <h3 className="font-semibold mb-4">{t("workspace.employee_list")} ({selectedDept.employees && selectedDept.employees.trim() !== '' ? selectedDept.employees.split(',').length : 0})</h3>
              {selectedDept.employees && selectedDept.employees.trim() !== '' ? (
                <div className="space-y-2">
                  {selectedDept.employees.split(',').map((emp: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg border bg-muted/30 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {emp.trim().substring(0, 1).toUpperCase()}
                      </div>
                      <span className="font-medium text-sm">{emp.trim()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">{t("workspace.no_employees_in_dept")}</p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden border flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingNote ? t("workspace.edit_note") : t("workspace.create_new_note")}</h2>
              <button onClick={() => setShowAddNote(false)} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <input
                type="text"
                placeholder={t("workspace.note_title_placeholder")}
                value={noteTitle}
                onChange={e => setNoteTitle(e.target.value)}
                className="w-full font-bold text-lg bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50 px-1"
                autoFocus
              />
              <textarea
                placeholder={t("workspace.note_content_placeholder")}
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                className="w-full min-h-[150px] bg-transparent border-none focus:outline-none focus:ring-0 resize-none px-1 text-sm text-foreground/90"
              />
              <div className="flex items-center gap-2 pt-4 border-t">
                <span className="text-xs font-medium text-muted-foreground mr-2">{t("workspace.color_label")}</span>
                {['yellow', 'blue', 'green', 'red', 'purple'].map(color => (
                  <button
                    key={color}
                    onClick={() => setNoteColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      color === 'yellow' ? 'bg-amber-300 border-amber-400' :
                      color === 'blue' ? 'bg-blue-300 border-blue-400' :
                      color === 'green' ? 'bg-emerald-300 border-emerald-400' :
                      color === 'red' ? 'bg-rose-300 border-rose-400' :
                      'bg-purple-300 border-purple-400'
                    } ${noteColor === color ? 'ring-2 ring-offset-2 ring-foreground scale-110' : 'hover:scale-110'}`}
                  />
                ))}
              </div>
            </div>
            <div className="p-4 border-t bg-muted/30 flex justify-end gap-2">
              <button onClick={() => setShowAddNote(false)} className="px-4 py-2 font-medium hover:bg-muted rounded-lg transition-colors text-sm">{t("common.cancel")}</button>
              <button onClick={handleSaveNote} className="px-5 py-2 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-sm text-sm">{t("workspace.save_note")}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, change, trend, icon: Icon, isWarning = false }: { title: string, value: string, change: string, trend: "up" | "down", icon: any, isWarning?: boolean }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
      }} 
      className={`premium-card p-6 relative overflow-hidden group ${
        isWarning ? "bg-rose-50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/30" : ""
      }`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
        <Icon className={`w-24 h-24 ${isWarning ? "text-rose-500" : "text-primary"}`} />
      </div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className={`text-sm font-medium ${isWarning ? "text-rose-800 dark:text-rose-400" : "text-muted-foreground"}`}>{title}</h3>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
          isWarning 
            ? "bg-rose-200/50 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white" 
            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
        }`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="relative z-10">
        <h2 className={`text-3xl font-bold tracking-tight ${isWarning ? "text-rose-700 dark:text-rose-400" : "text-foreground"}`}>{value}</h2>
        <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
          {trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span>{change}</span>
        </div>
      </div>
    </motion.div>
  )
}
