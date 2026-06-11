"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  CheckSquare, ListTodo, Search, CheckCircle2, Clock,
  UserCircle, Users, X, MessageSquare, CalendarDays,
  FileText, GripVertical, ArrowRight, AlertCircle, Star,
  Send
} from "lucide-react"
import { useRole } from "@/components/providers/role-provider"
import { useTranslation } from "@/contexts/TranslationContext"

/* ─────────────── Types ─────────────── */
type ColumnId = "todo" | "inProgress" | "review" | "done"

interface Comment {
  id: string
  author: string
  role: "Quản lý" | "Ban Giám đốc" | "Nhân viên"
  content: string
  timestamp: string
  avatar: string
}

interface Task {
  id: string
  title: string
  description: string
  project: string
  projectId: string
  priority: "Cao" | "Bình thường" | "Thấp"
  dueDate: string
  createdAt: string
  assignee: string
  assigneeAvatar: string
  checklist: string
  comments: Comment[]
}

interface KanbanData {
  todo: Task[]
  inProgress: Task[]
  review: Task[]
  done: Task[]
}

/* ─────────────── Mock Data ─────────────── */
const initialKanbanData: KanbanData = {
  todo: [
    {
      id: "T1",
      title: "Thiết kế banner quảng cáo chiến dịch mới",
      description: "Tạo 3 phiên bản banner cho Facebook, Instagram và Google Ads. Kích thước theo chuẩn, tone màu theo brand guideline của khách hàng. Bao gồm cả video 15s và ảnh tĩnh.",
      project: "Live Stream",
      projectId: "P1",
      priority: "Cao",
      dueDate: "08/06/2026",
      createdAt: "01/06/2026 09:00",
      assignee: "Toby Vu",
      assigneeAvatar: "TV",
      checklist: "0/5",
      comments: [
        {
          id: "C1",
          author: "Vũ Quang Huy",
          role: "Quản lý",
          content: "Ưu tiên làm banner Facebook trước vì campaign chạy ngày 10/06. Chú ý contrast ratio cho text trên ảnh.",
          timestamp: "02/06/2026 10:30",
          avatar: "VH"
        },
        {
          id: "C2",
          author: "Nguyễn Minh Đức",
          role: "Ban Giám đốc",
          content: "Đảm bảo logo luôn ở góc phải trên, không che mặt KOL. Báo cáo tiến độ mỗi ngày.",
          timestamp: "02/06/2026 14:15",
          avatar: "NĐ"
        }
      ]
    },
    {
      id: "T2",
      title: "Viết kịch bản livestream sản phẩm mới",
      description: "Soạn kịch bản chi tiết cho buổi livestream 2 tiếng, bao gồm mở bài, giới thiệu sản phẩm, minigame, Q&A và kết thúc.",
      project: "Live Stream",
      projectId: "P1",
      priority: "Bình thường",
      dueDate: "09/06/2026",
      createdAt: "01/06/2026 14:00",
      assignee: "Toby Vu",
      assigneeAvatar: "TV",
      checklist: "0/5",
      comments: [
        {
          id: "C3",
          author: "Vũ Quang Huy",
          role: "Quản lý",
          content: "Nhớ thêm phần khuyến mại flash sale trong kịch bản.",
          timestamp: "03/06/2026 09:00",
          avatar: "VH"
        }
      ]
    },
    {
      id: "T3",
      title: "Chuẩn bị hệ thống OBS cho livestream",
      description: "Setup scene, overlay, camera angle và test mic cho buổi livestream. Chuẩn bị backup plan nếu mất kết nối.",
      project: "Live Stream",
      projectId: "P1",
      priority: "Bình thường",
      dueDate: "10/06/2026",
      createdAt: "02/06/2026 08:00",
      assignee: "Toby Vu",
      assigneeAvatar: "TV",
      checklist: "0/3",
      comments: []
    },
  ],
  inProgress: [
    {
      id: "T4",
      title: "Edit video highlight từ buổi live trước",
      description: "Cắt 5 đoạn highlight (mỗi đoạn 30-60s), thêm caption, nhạc nền và hiệu ứng chuyển cảnh. Export 1080p và 720p.",
      project: "Live Stream",
      projectId: "P1",
      priority: "Bình thường",
      dueDate: "10/06/2026",
      createdAt: "03/06/2026 10:00",
      assignee: "Toby Vu",
      assigneeAvatar: "TV",
      checklist: "3/5",
      comments: [
        {
          id: "C4",
          author: "Vũ Quang Huy",
          role: "Quản lý",
          content: "Đang review 2 video đầu, chất lượng tốt. Tiếp tục phát huy.",
          timestamp: "04/06/2026 16:00",
          avatar: "VH"
        },
        {
          id: "C5",
          author: "Nguyễn Minh Đức",
          role: "Ban Giám đốc",
          content: "Video cần có watermark công ty ở góc trái dưới. Đã gửi file logo qua email.",
          timestamp: "05/06/2026 09:30",
          avatar: "NĐ"
        }
      ]
    }
  ],
  review: [],
  done: []
}

const columnConfig: Record<ColumnId, { labelKey: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }> = {
  todo: {
    labelKey: "tasks.todo",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    borderColor: "border-l-slate-400",
    icon: <ListTodo className="w-4 h-4" />
  },
  inProgress: {
    labelKey: "tasks.in_progress",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-l-blue-500",
    icon: <Clock className="w-4 h-4" />
  },
  review: {
    labelKey: "tasks.review",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    borderColor: "border-l-amber-500",
    icon: <AlertCircle className="w-4 h-4" />
  },
  done: {
    labelKey: "tasks.done",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    borderColor: "border-l-emerald-500",
    icon: <CheckCircle2 className="w-4 h-4" />
  }
}

/* ─────────────── Priority Badge ─────────────── */
function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const { t } = useTranslation()
  const styles: Record<string, string> = {
    "Cao": "bg-rose-100 text-rose-600 ring-rose-200",
    "Bình thường": "bg-orange-100 text-orange-600 ring-orange-200",
    "Thấp": "bg-sky-100 text-sky-600 ring-sky-200",
  }
  const labels: Record<string, string> = {
    "Cao": t("tasks.priority_high"),
    "Bình thường": t("tasks.priority_normal"),
    "Thấp": t("tasks.priority_low"),
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ring-1 ${styles[priority]}`}>
      {labels[priority]}
    </span>
  )
}

/* ─────────────── Role Badge in Comments ─────────────── */
function RoleBadge({ role }: { role: Comment["role"] }) {
  const { t } = useTranslation()
  const styles: Record<string, string> = {
    "Quản lý": "bg-blue-100 text-blue-700",
    "Ban Giám đốc": "bg-purple-100 text-purple-700",
    "Nhân viên": "bg-gray-100 text-gray-700",
  }
  const labels: Record<string, string> = {
    "Quản lý": t("hr.role_manager"),
    "Ban Giám đốc": t("hr.role_director"),
    "Nhân viên": t("hr.role_employee"),
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles[role]}`}>
      {labels[role]}
    </span>
  )
}

/* ─────────────── Task Detail Modal ─────────────── */
function TaskModal({
  task,
  column,
  onClose,
  onAddComment,
  currentRole
}: {
  task: Task
  column: ColumnId
  onClose: () => void
  onAddComment: (taskId: string, comment: Comment) => void
  currentRole: string
}) {
  const { t } = useTranslation()
  const [newComment, setNewComment] = useState("")
  const modalRef = useRef<HTMLDivElement>(null)
  const { userProfile } = useRole()

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    const roleLabel = currentRole === "DIRECTOR" ? "Ban Giám đốc" : currentRole === "MANAGER" ? "Quản lý" : "Nhân viên"
    const comment: Comment = {
      id: `C${Math.random()}`,
      author: userProfile.name,
      role: roleLabel,
      content: newComment.trim(),
      timestamp: new Date().toLocaleString("vi-VN"),
      avatar: userProfile.avatar || userProfile.name.charAt(0).toUpperCase()
    }
    onAddComment(task.id, comment)
    setNewComment("")
    toast.success(t("tasks.comment_added"))
  }

  const config = columnConfig[column]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card w-full max-w-2xl max-h-[90vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${config.bgColor} ${config.color}`}>
                  {t(config.labelKey)}
                </span>
                <PriorityBadge priority={task.priority} />
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-200">
                  {task.project}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground leading-tight">{task.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> {t("tasks.detailed_description")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border">
              {task.description}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-muted/20">
              <div className="text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> {t("tasks.created_date")}
              </div>
              <div className="text-sm font-bold">{task.createdAt}</div>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20">
              <div className="text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {t("tasks.deadline")}
              </div>
              <div className="text-sm font-bold text-orange-600">{task.dueDate}</div>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20">
              <div className="text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1.5">
                <UserCircle className="w-3.5 h-3.5" /> {t("tasks.assignee")}
              </div>
              <div className="text-sm font-bold flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  {task.assigneeAvatar}
                </div>
                {task.assignee}
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20">
              <div className="text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t("tasks.checklist")}
              </div>
              <div className="text-sm font-bold">{task.checklist}</div>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              {t("tasks.comments")}
              <span className="text-xs font-normal text-muted-foreground">({task.comments.length})</span>
            </h3>

            {task.comments.length === 0 ? (
              <div className="border border-dashed rounded-xl p-6 text-center text-sm text-muted-foreground bg-muted/10">
                {t("tasks.no_comments")}
              </div>
            ) : (
              <div className="space-y-3">
                {task.comments.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-xl border bg-muted/10 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        c.role === "Ban Giám đốc" ? "bg-purple-100 text-purple-700" :
                        c.role === "Quản lý" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {c.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{c.author}</span>
                          <RoleBadge role={c.role} />
                        </div>
                        <span className="text-[11px] text-muted-foreground">{c.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-10">{c.content}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmitComment() }}
                placeholder={t("tasks.write_comment")}
                className="flex-1 px-4 py-2.5 bg-muted/30 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> {t("common.send")}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────── Task Card (Draggable) ─────────────── */
function TaskCard({
  task,
  columnId,
  onDragStart,
  onClick
}: {
  task: Task
  columnId: ColumnId
  onDragStart: (e: React.DragEvent, taskId: string, fromColumn: ColumnId) => void
  onClick: () => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const config = columnConfig[columnId]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      draggable
      onDragStart={(e) => {
        setIsDragging(true)
        onDragStart(e as unknown as React.DragEvent, task.id, columnId)
      }}
      onDragEnd={() => setIsDragging(false)}
      onClick={onClick}
      className={`bg-card border p-4 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-grab active:cursor-grabbing group border-l-4 ${config.borderColor} ${isDragging ? "ring-2 ring-primary/30 rotate-2" : ""}`}
    >
      {/* Top Badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-200">{task.project}</span>
        <PriorityBadge priority={task.priority} />
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Title */}
      <h4 className="font-bold text-sm mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">{task.title}</h4>

      {/* Description Preview */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{task.description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
            <Clock className="w-3 h-3" /> {task.dueDate}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="w-3 h-3" /> {task.comments.length}
            </div>
          )}
          <div className="flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3" /> {task.checklist}
          </div>
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
            {task.assigneeAvatar}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────── Kanban Column (Drop Zone) ─────────────── */
function KanbanColumn({
  columnId,
  tasks,
  onDragStart,
  onDrop,
  onTaskClick
}: {
  columnId: ColumnId
  tasks: Task[]
  onDragStart: (e: React.DragEvent, taskId: string, fromColumn: ColumnId) => void
  onDrop: (columnId: ColumnId) => void
  onTaskClick: (task: Task, column: ColumnId) => void
}) {
  const { t } = useTranslation()
  const [isOver, setIsOver] = useState(false)
  const config = columnConfig[columnId]

  return (
    <div
      className={`space-y-3 min-h-[300px] rounded-2xl p-3 transition-all duration-200 ${
        isOver ? "bg-primary/5 ring-2 ring-primary/20 ring-dashed" : "bg-muted/10"
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true) }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsOver(false); onDrop(columnId) }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className={`font-bold text-sm flex items-center gap-2 ${config.color}`}>
          {config.icon}
          {t(config.labelKey)}
          <span className={`${config.bgColor} ${config.color} px-2 py-0.5 rounded-full text-xs`}>
            {tasks.length}
          </span>
        </h3>
      </div>

      {/* Drop Indicator */}
      <AnimatePresence>
        {isOver && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 60 }}
            exit={{ opacity: 0, height: 0 }}
            className="border-2 border-dashed border-primary/40 rounded-xl flex items-center justify-center text-xs text-primary font-medium bg-primary/5"
          >
            <ArrowRight className="w-4 h-4 mr-1" /> {t("tasks.drop_here")}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Cards */}
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={columnId}
            onDragStart={onDragStart}
            onClick={() => onTaskClick(task, columnId)}
          />
        ))}
      </AnimatePresence>

      {tasks.length === 0 && !isOver && (
        <div className="border border-dashed border-muted-foreground/20 rounded-xl flex items-center justify-center h-24 text-sm text-muted-foreground bg-muted/5">
          {t("tasks.no_tasks")}
        </div>
      )}
    </div>
  )
}

/* ─────────────── Main Page ─────────────── */
export default function TasksPage() {
  const { t } = useTranslation()
  const { role, userProfile } = useRole()
  const [search, setSearch] = useState("")
  const [taskView, setTaskView] = useState<"my_tasks" | "team_tasks">(role === "EMPLOYEE" ? "my_tasks" : "team_tasks")
  const [kanban, setKanban] = useState<KanbanData>({ todo: [], inProgress: [], review: [], done: [] })
  const [selectedTask, setSelectedTask] = useState<{ task: Task; column: ColumnId } | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/db?collection=projects', { cache: 'no-store' })
        if (res.ok) {
          const projectsData = await res.json()
          if (projectsData && projectsData.length > 0) {
            const newKanban: KanbanData = { todo: [], inProgress: [], review: [], done: [] }
            projectsData.forEach((p: any) => {
              if (p.tasks) {
                p.tasks.forEach((t: any) => {
                  const taskToKanban = {
                    ...t,
                    project: p.name,
                    projectId: p.id,
                    comments: t.comments || [],
                    checklist: t.checklist || "0/0"
                  }
                  if (t.status === "DONE" || t.status === "done") newKanban.done.push(taskToKanban)
                  else if (t.status === "IN_PROGRESS" || t.status === "inProgress") newKanban.inProgress.push(taskToKanban)
                  else if (t.status === "REVIEW" || t.status === "review") newKanban.review.push(taskToKanban)
                  else newKanban.todo.push(taskToKanban)
                })
              }
            })
            setKanban(newKanban)
          }
        }
      } catch (e) {}
    }
    loadData()
  }, [])

  useEffect(() => {
    setTaskView(role === "EMPLOYEE" ? "my_tasks" : "team_tasks")
  }, [role])

  // DnD state
  const dragTaskIdRef = useRef<string | null>(null)
  const dragFromColumnRef = useRef<ColumnId | null>(null)

  const handleDragStart = useCallback((_e: React.DragEvent, taskId: string, fromColumn: ColumnId) => {
    dragTaskIdRef.current = taskId
    dragFromColumnRef.current = fromColumn
  }, [])

  const handleDrop = useCallback((toColumn: ColumnId) => {
    const taskId = dragTaskIdRef.current
    const fromColumn = dragFromColumnRef.current
    if (!taskId || !fromColumn || fromColumn === toColumn) return

    setKanban(prev => {
      const sourceTasks = [...prev[fromColumn]]
      const taskIndex = sourceTasks.findIndex(t => t.id === taskId)
      if (taskIndex === -1) return prev

      const [movedTask] = sourceTasks.splice(taskIndex, 1)
      const destTasks = [...prev[toColumn], movedTask]

      const updated = { ...prev, [fromColumn]: sourceTasks, [toColumn]: destTasks }

      // Toast notification
      const colLabel = t(columnConfig[toColumn].labelKey)
      if (toColumn === "done") {
        toast.success(`✅ "${movedTask.title}" đã hoàn thành! Tiến độ dự án đã cập nhật.`)
      } else if (toColumn === "review") {
        toast(`📋 "${movedTask.title}" đã chuyển sang REVIEW`, { duration: 5000 })
      } else {
        toast.info(`Đã chuyển "${movedTask.title}" sang ${colLabel}`)
      }

      const newStatus = toColumn === "todo" ? "TODO" : toColumn === "inProgress" ? "IN_PROGRESS" : toColumn === "review" ? "REVIEW" : "DONE"
      fetch('/api/db?collection=projects', { cache: 'no-store' })
        .then(res => res.json())
        .then(projectsData => {
          const updatedProjects = projectsData.map((p: any) => {
            if (p.id === movedTask.projectId) {
               const pTasks = p.tasks.map((pt: any) => pt.id === movedTask.id ? { ...pt, status: newStatus } : pt)
               const dCount = pTasks.filter((pt: any) => pt.status === "DONE" || pt.status === "done").length
               const prog = pTasks.length > 0 ? Math.round((dCount / pTasks.length) * 100) : 0
               return { ...p, tasks: pTasks, progress: prog }
            }
            return p
          })
          fetch('/api/db?collection=projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProjects),
            cache: 'no-store'
          }).catch(() => {})
        }).catch(() => {})

      return updated
    })

    dragTaskIdRef.current = null
    dragFromColumnRef.current = null
  }, [])

  const handleTaskClick = useCallback((task: Task, column: ColumnId) => {
    setSelectedTask({ task, column })
  }, [])

  const handleAddComment = useCallback((taskId: string, comment: Comment) => {
    setKanban(prev => {
      const updated = { ...prev }
      for (const col of Object.keys(updated) as ColumnId[]) {
        const idx = updated[col].findIndex(t => t.id === taskId)
        if (idx !== -1) {
          updated[col] = [...updated[col]]
          updated[col][idx] = {
            ...updated[col][idx],
            comments: [...updated[col][idx].comments, comment]
          }
          
          const changedTask = updated[col][idx]
          fetch('/api/db?collection=projects', { cache: 'no-store' })
            .then(res => res.json())
            .then(projectsData => {
              const updatedProjects = projectsData.map((p: any) => {
                if (p.id === changedTask.projectId) {
                   const pTasks = p.tasks.map((pt: any) => pt.id === changedTask.id ? { ...pt, comments: changedTask.comments } : pt)
                   return { ...p, tasks: pTasks }
                }
                return p
              })
              fetch('/api/db?collection=projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProjects),
                cache: 'no-store'
              }).catch(() => {})
            }).catch(() => {})

          break
        }
      }

      return updated
    })

    // Also update the selected task view
    setSelectedTask(prev => {
      if (!prev || prev.task.id !== taskId) return prev
      return {
        ...prev,
        task: {
          ...prev.task,
          comments: [...prev.task.comments, comment]
        }
      }
    })
  }, [])

  /* ─── Compute project progress ─── */
  const allTasks = [...kanban.todo, ...kanban.inProgress, ...kanban.review, ...kanban.done]
  const currentUser = userProfile?.name || "Toby Vu"
  const isEmployee = role === "EMPLOYEE"

  // Only show projects where the user is involved (or all projects if manager/director)
  const lowerUser = currentUser.toLowerCase()
  const matchUser = (a: string) => {
    const al = a?.toLowerCase() || ""
    return al.includes(lowerUser) || lowerUser.includes(al)
  }
  const relevantTasks = isEmployee ? allTasks.filter(t => matchUser(t.assignee)) : allTasks
  
  const visibleProjectIds = Array.from(new Set(relevantTasks.map(t => t.projectId))).filter(Boolean)
  
  const projectsData = visibleProjectIds.map(pId => {
    const pTasks = allTasks.filter(t => t.projectId === pId)
    const dTasks = kanban.done.filter(t => t.projectId === pId)
    const progress = pTasks.length > 0 ? Math.round((dTasks.length / pTasks.length) * 100) : 0
    const status = progress === 100 ? t("tasks.status_completed") : progress > 0 ? t("tasks.status_in_progress") : t("tasks.status_planning")
    const name = pTasks[0]?.project || "Unknown Project"
    return { id: pId, name, total: pTasks.length, done: dTasks.length, progress, status }
  })

  /* ─── Filter by search and role ─── */
  const filterTasks = (tasks: Task[]) => {
    let filtered = tasks
    if ((role as string) === "EMPLOYEE" || ((role as string) !== "EMPLOYEE" && taskView === "my_tasks")) {
      filtered = filtered.filter(t => matchUser(t.assignee))
    }
    if (!search.trim()) return filtered
    const q = search.toLowerCase()
    return filtered.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.assignee && t.assignee.toLowerCase().includes(q))
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CheckSquare className="w-8 h-8 text-primary" /> {t("tasks.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("tasks.subtitle")}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("tasks.search_placeholder")}
              className="w-full pl-9 pr-4 py-2 bg-card border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {role !== "EMPLOYEE" && (
            <>
              <button onClick={() => toast.success("Đã mở form giao việc mới!")} className="bg-card border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">+ Giao việc</button>
              <button onClick={() => toast.success("Đã mở tạo Campaign!")} className="bg-card border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">+ Campaign</button>
            </>
          )}
        </motion.div>
      </div>

      {role !== "EMPLOYEE" && (
        <div className="flex items-center gap-2 border-b border-border pb-px">
          <button
            onClick={() => setTaskView("my_tasks")}
            className={`relative pb-3 text-sm font-semibold transition-colors ${
              taskView === "my_tasks" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("tasks.my_tasks")}
            {taskView === "my_tasks" && (
              <motion.div layoutId="taskTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>

          <button
            onClick={() => setTaskView("team_tasks")}
            className={`relative pb-3 text-sm font-semibold transition-colors ml-6 ${
              taskView === "team_tasks" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("tasks.team_tasks")}
            {taskView === "team_tasks" && (
              <motion.div layoutId="taskTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      )}

      {/* Tiến độ dự án - REALTIME */}
      {projectsData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="premium-card p-6 border-t-4 border-t-primary"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">{t("tasks.project_progress")}</h2>
              <p className="text-sm text-muted-foreground">{t("tasks.progress_desc")}</p>
            </div>
            <button onClick={() => toast.info("Đang chuyển hướng tới trang Dự án...")} className="text-sm text-primary font-medium hover:underline">{t("common.view_all")}</button>
          </div>

          <div className="space-y-4">
            {projectsData.map(proj => (
              <div key={proj.id} className="p-5 border rounded-xl bg-muted/20 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{proj.name}</h3>
                      <motion.span
                        key={proj.status}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          proj.progress === 100 ? "bg-emerald-100 text-emerald-700" :
                          proj.progress > 0 ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {proj.status}
                      </motion.span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1"><UserCircle className="w-3.5 h-3.5" /> {t("tasks.manager")}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {t("tasks.client_unassigned")}</span>
                      <span className="flex items-center gap-1"><ListTodo className="w-3.5 h-3.5" /> {t("tasks.task")} {proj.done}/{proj.total}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <motion.div
                      key={proj.progress}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl font-black text-primary mb-1"
                    >
                      {proj.progress}%
                    </motion.div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                      {proj.progress === 100 && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                      {proj.progress === 100 ? t("tasks.completed_excl") : t("tasks.progress")}
                    </div>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="relative z-10 mx-2">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${proj.progress === 100 ? "bg-emerald-500" : "bg-primary"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${proj.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    {[t("tasks.status_planning"), t("tasks.executing"), t("tasks.reviewing"), t("tasks.status_completed")].map((stage, i) => {
                      const stageProgress = (i / 3) * 100
                      return (
                        <div key={stage} className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full -mt-3.5 border-2 border-background shadow-sm transition-colors duration-500 ${
                            proj.progress >= stageProgress ? "bg-primary" : "bg-muted"
                          }`} />
                          <span className="text-[10px] text-muted-foreground mt-1">{stage}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Kanban Board */}
      <div className="pt-2">
        <h2 className="text-xl font-bold mb-1">My Tasks</h2>
        <p className="text-sm text-muted-foreground mb-6">{t("tasks.kanban_desc")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(kanban) as ColumnId[]).map((colId) => (
            <KanbanColumn
              key={colId}
              columnId={colId}
              tasks={filterTasks(kanban[colId])}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskModal
            task={selectedTask.task}
            column={selectedTask.column}
            onClose={() => setSelectedTask(null)}
            onAddComment={handleAddComment}
            currentRole={role}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
