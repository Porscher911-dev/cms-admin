"use client"

import { use, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { 
  ArrowLeft, 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  CheckCircle2, 
  Circle,
  Clock,
  MessageSquare,
  Trash2,
  X,
  Edit,
  FolderKanban,
  AlertCircle,
  Search
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRole } from "@/components/providers/role-provider"

// Helpers
const getStatusBadge = (status: string) => {
  switch (status) {
    case "PLANNING": return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"><Clock className="w-3.5 h-3.5" /> Lên kế hoạch</span>
    case "IN_PROGRESS": return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"><FolderKanban className="w-3.5 h-3.5" /> Đang thực hiện</span>
    case "REVIEW": return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"><AlertCircle className="w-3.5 h-3.5" /> Đang chờ duyệt</span>
    case "COMPLETED": return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Đã hoàn thành</span>
    default: return null
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "SEO": return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
    case "DESIGN": return "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400"
    case "VIDEO": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
    case "GOOGLE_ADS": return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
    case "WEBSITE": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
    default: return "bg-gray-100 text-gray-700"
  }
}

// Modals
interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (project: any) => void
  projectToEdit?: any
}

function ProjectModal({ isOpen, onClose, onSave, projectToEdit }: ProjectModalProps) {
  const [name, setName] = useState("")
  const [client, setClient] = useState("")
  const [type, setType] = useState("SEO")
  const [status, setStatus] = useState("PLANNING")
  const [progress, setProgress] = useState(0)
  const [dueDate, setDueDate] = useState("")
  const [teamInput, setTeamInput] = useState("")

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name)
      setClient(projectToEdit.client)
      setType(projectToEdit.type)
      setStatus(projectToEdit.status)
      setProgress(projectToEdit.progress)
      
      const dateParts = projectToEdit.dueDate.split('/')
      if (dateParts.length === 3) {
        setDueDate(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)
      } else {
        setDueDate(projectToEdit.dueDate)
      }
      
      setTeamInput(projectToEdit.team.join(", "))
    }
  }, [projectToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !client.trim()) {
      toast.error("Vui lòng điền đầy đủ Tên dự án và Khách hàng!")
      return
    }

    let formattedDate = dueDate
    if (dueDate.includes("-")) {
      const dateParts = dueDate.split("-")
      formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
    }

    const team = teamInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    onSave({
      ...projectToEdit,
      name: name.trim(),
      client: client.trim(),
      type,
      status,
      progress: Number(progress),
      dueDate: formattedDate || new Date().toLocaleDateString('vi-VN'),
      team
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card w-full max-w-lg rounded-2xl border border-border/80 shadow-2xl overflow-hidden flex flex-col p-6 space-y-4 text-foreground"
      >
        <div className="flex items-center justify-between border-b pb-3 border-border/60">
          <h3 className="text-xl font-bold">Chỉnh sửa Dự án</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Tên Dự án</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Khách hàng (Client)</label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Loại dự án</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none"
              >
                <option value="SEO">SEO</option>
                <option value="DESIGN">DESIGN</option>
                <option value="VIDEO">VIDEO</option>
                <option value="GOOGLE_ADS">GOOGLE ADS</option>
                <option value="WEBSITE">WEBSITE</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none"
              >
                <option value="PLANNING">Lên kế hoạch</option>
                <option value="IN_PROGRESS">Đang thực hiện</option>
                <option value="REVIEW">Đang chờ duyệt</option>
                <option value="COMPLETED">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Thời hạn (Due Date)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Tiến độ (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Thành viên tham gia (cách nhau bằng dấu phẩy)</label>
            <input
              type="text"
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value)}
              className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg">Lưu lại</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: any) => void
  teamMembers: string[]
}

function AddTaskModal({ isOpen, onClose, onSave, teamMembers }: AddTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("Bình thường")
  const [assignee, setAssignee] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTitle("")
      setDescription("")
      setPriority("Bình thường")
      setAssignee(teamMembers[0] || "Chưa giao")
      setDate("")
    }
  }, [isOpen, teamMembers])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Vui lòng điền tiêu đề công việc!")
      return
    }

    onSave({
      id: `T-${crypto.randomUUID()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      status: "TODO",
      assignee: assignee || "Chưa giao",
      date: date.trim() || "Hôm nay",
      comments: []
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card w-full max-w-md rounded-2xl border border-border/80 shadow-2xl p-6 space-y-4 text-foreground"
      >
        <div className="flex items-center justify-between border-b pb-3 border-border/60">
          <h3 className="text-lg font-bold">Thêm Công việc mới</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Thiết kế banner quảng cáo"
              className="w-full px-3 py-2 border rounded-lg bg-card text-sm focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Mô tả công việc</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Phác thảo 3 mẫu banner kích thước chuẩn..."
              className="w-full h-20 px-3 py-2 border rounded-lg bg-card text-sm focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Độ ưu tiên</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-card text-sm focus:outline-none"
              >
                <option value="Cao">Cao</option>
                <option value="Bình thường">Bình thường</option>
                <option value="Thấp">Thấp</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Thời hạn / Hạn chót</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="VD: Hôm nay, Ngày mai, hoặc 20/12"
                className="w-full px-3 py-2 border rounded-lg bg-card text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Người thực hiện</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-card text-sm focus:outline-none"
            >
              {teamMembers.map((member) => (
                <option key={member} value={member}>{member}</option>
              ))}
              <option value="Chưa giao">Chưa giao (Không có trong danh sách)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm hover:bg-muted">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Thêm</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

interface TaskDetailsModalProps {
  isOpen: boolean
  task: any
  onClose: () => void
  onSave: (updatedTask: any) => void
  onDelete: (taskId: string) => void
  teamMembers: string[]
  canManage: boolean
  role: string
}

function TaskDetailsModal({ isOpen, task, onClose, onSave, onDelete, teamMembers, canManage, role }: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("Bình thường")
  const [dueDate, setDueDate] = useState("")
  const [assignee, setAssignee] = useState("")
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    if (task) {
      setTitle(task.title || "")
      setDescription(task.description || "")
      setPriority(task.priority || "Bình thường")
      setDueDate(task.date || "")
      setAssignee(task.assignee || "")
      setIsEditing(false)
    }
  }, [task, isOpen])

  if (!isOpen || !task) return null

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc!")
      return
    }
    onSave({
      ...task,
      title: title.trim(),
      description: description.trim(),
      priority,
      date: dueDate.trim(),
      assignee
    })
    setIsEditing(false)
  }

  const handleStatusChange = (newStatus: string) => {
    onSave({
      ...task,
      status: newStatus
    })
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return
    const authorName = role === "DIRECTOR" ? "Nguyễn Minh Đức" : role === "MANAGER" ? "Vũ Quang Huy" : "Toby Vu"
    const roleLabel = role === "DIRECTOR" ? "Ban Giám đốc" : role === "MANAGER" ? "Quản lý" : "Nhân viên"
    const avatarLabel = role === "DIRECTOR" ? "NĐ" : role === "MANAGER" ? "VH" : "TV"

    const comment = {
      id: `C-${crypto.randomUUID()}`,
      author: authorName,
      role: roleLabel,
      content: newComment.trim(),
      timestamp: new Date().toLocaleString("vi-VN"),
      avatar: avatarLabel
    }

    onSave({
      ...task,
      comments: [...(task.comments || []), comment]
    })
    setNewComment("")
    toast.success("Đã thêm nhận xét!")
  }

  const handleDeleteComment = (commentId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhận xét này?")) {
      onSave({
        ...task,
        comments: (task.comments || []).filter((c: any) => c.id !== commentId)
      })
      toast.success("Đã xóa nhận xét!")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card w-full max-w-2xl max-h-[85vh] rounded-2xl border border-border/80 shadow-2xl overflow-y-auto flex flex-col p-6 space-y-4 text-foreground"
      >
        <div className="flex items-start justify-between border-b pb-3 border-border/60">
          <div className="flex-1 space-y-1">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-bold w-full bg-muted/40 border border-border/80 rounded px-2 py-1 focus:outline-none"
              />
            ) : (
              <h3 className="text-xl font-bold">{task.title}</h3>
            )}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className={`px-2 py-0.5 rounded font-bold ${
                task.status === 'DONE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
              }`}>
                Trạng thái: {task.status}
              </span>
              <span className={`px-2 py-0.5 rounded font-bold ${
                task.priority === 'Cao' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
              }`}>
                Độ ưu tiên: {task.priority || "Bình thường"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Mô tả công việc</h4>
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-24 text-sm bg-muted/40 border border-border/80 rounded p-2 focus:outline-none resize-none"
                  placeholder="Nhập mô tả..."
                />
              ) : (
                <p className="text-sm bg-muted/20 p-3 rounded-lg border border-border/30 whitespace-pre-wrap">
                  {task.description || "Chưa có mô tả chi tiết."}
                </p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-primary" /> Nhận xét ({task.comments?.length || 0})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((c: any) => (
                    <div key={c.id} className="p-3 border rounded-xl bg-muted/10 hover:bg-muted/25 transition-colors relative group">
                      {canManage && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Xóa nhận xét"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                          {c.avatar || "U"}
                        </div>
                        <div>
                          <span className="text-xs font-bold">{c.author}</span>
                          <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground ml-1.5">{c.role}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground ml-auto">{c.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground pl-8">{c.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 border border-dashed rounded-lg text-xs text-muted-foreground">Chưa có nhận xét nào.</div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Viết nhận xét..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment() }}
                  className="flex-1 px-3 py-1.5 bg-muted/30 border border-border/80 rounded-lg text-xs focus:outline-none"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary/95 disabled:opacity-50"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>

          <div className="bg-muted/10 border border-border/80 p-4 rounded-xl space-y-4 h-fit">
            <h4 className="text-xs font-bold text-muted-foreground uppercase border-b pb-1 border-border/60">Chi tiết công việc</h4>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground block">Người thực hiện</span>
                {isEditing ? (
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full border border-border/80 rounded p-1.5 bg-card"
                  >
                    {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
                    <option value="Chưa giao">Chưa giao</option>
                  </select>
                ) : (
                  <span className="font-semibold block">{task.assignee || "Chưa giao"}</span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block">Độ ưu tiên</span>
                {isEditing ? (
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border border-border/80 rounded p-1.5 bg-card"
                  >
                    <option value="Cao">Cao</option>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Thấp">Thấp</option>
                  </select>
                ) : (
                  <span className={`font-semibold px-2 py-0.5 rounded text-[10px] inline-block ${
                    task.priority === 'Cao' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : task.priority === 'Thấp' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                  }`}>
                    {task.priority || "Bình thường"}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block">Hạn chót</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-border/80 rounded p-1.5 bg-card"
                  />
                ) : (
                  <span className="font-semibold block">{task.date || "Hôm nay"}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-muted-foreground block">Trạng thái</span>
                {canManage || task.assignee === (role === "DIRECTOR" ? "Nguyễn Minh Đức" : role === "MANAGER" ? "Vũ Quang Huy" : "Toby Vu") ? (
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full border border-border/80 rounded p-1.5 bg-card font-semibold"
                  >
                    <option value="TODO">Cần làm (TODO)</option>
                    <option value="IN_PROGRESS">Đang thực hiện</option>
                    <option value="DONE">Hoàn thành (DONE)</option>
                  </select>
                ) : (
                  <span className="w-full block border border-border/80 rounded p-1.5 bg-muted/50 font-semibold text-muted-foreground">
                    {task.status === "TODO" ? "Cần làm (TODO)" : task.status === "IN_PROGRESS" ? "Đang thực hiện" : "Hoàn thành (DONE)"}
                  </span>
                )}
              </div>
            </div>

            {canManage && (
              <div className="pt-2 border-t border-border/60 space-y-2">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-1.5 rounded text-xs font-semibold hover:bg-primary/95">Lưu</button>
                    <button onClick={() => setIsEditing(false)} className="flex-1 border border-border/80 py-1.5 rounded text-xs hover:bg-muted">Hủy</button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-center gap-1.5 border border-border/80 hover:bg-muted py-1.5 rounded text-xs font-semibold">
                    <Edit className="w-3.5 h-3.5" /> Chỉnh sửa
                  </button>
                )}
                <button onClick={() => onDelete(task.id)} className="w-full flex items-center justify-center gap-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive py-1.5 rounded text-xs font-semibold">
                  <Trash2 className="w-3.5 h-3.5" /> Xóa công việc
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

interface AddTeamMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (selectedMembers: string[]) => void
  currentTeam: string[]
  employees: any[]
}

function AddTeamMemberModal({ isOpen, onClose, onSave, currentTeam, employees }: AddTeamMemberModalProps) {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) setSelected(currentTeam || [])
  }, [isOpen, currentTeam])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card w-full max-w-md rounded-2xl border border-border/80 shadow-2xl p-6 space-y-4 text-foreground flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between border-b pb-3 border-border/60">
          <h3 className="text-lg font-bold">Thêm thành viên</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-2 border rounded-lg bg-muted/20">
          {employees.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-4">Đang tải danh sách nhân viên...</div>
          ) : (
            employees.map(emp => (
              <label key={emp.id} className="flex items-center gap-3 text-sm cursor-pointer hover:bg-muted p-2 rounded transition-colors">
                <input 
                  type="checkbox" 
                  checked={selected.includes(emp.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected([...selected, emp.name])
                    } else {
                      setSelected(selected.filter(n => n !== emp.name))
                    }
                  }}
                  className="rounded border-border/80 text-primary focus:ring-primary/20 w-4 h-4"
                />
                <span className="font-medium">{emp.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{emp.role}</span>
              </label>
            ))
          )}
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm hover:bg-muted font-medium">Hủy</button>
          <button onClick={() => onSave(selected)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 shadow-md">Lưu thay đổi</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { role } = useRole()
  const router = useRouter()
  
  const [mounted, setMounted] = useState(false)
  const [project, setProject] = useState<any | null>(null)
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  
  // New States for Task Filters & Details
  const [taskSearch, setTaskSearch] = useState("")
  const [taskStatusFilter, setTaskStatusFilter] = useState("ALL")
  const [selectedTask, setSelectedTask] = useState<any | null>(null)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null)
  const [employees, setEmployees] = useState<any[]>([])

  const taskFilters = [
    { id: "ALL", label: "Tất cả" },
    { id: "TODO", label: "Cần làm" },
    { id: "IN_PROGRESS", label: "Đang làm" },
    { id: "DONE", label: "Hoàn thành" }
  ]

  useEffect(() => {
    setMounted(true)
    const loadData = async () => {
      try {
        const resEmp = await fetch('/api/db?collection=employees', { cache: 'no-store' })
        if (resEmp.ok) {
          const empData = await resEmp.json()
          if (empData) setEmployees(empData)
        }
      } catch (e) {}

      try {
        const res = await fetch('/api/db?collection=projects', { cache: 'no-store' })
        if (res.ok) {
          const parsed = await res.json()
          if (parsed) {
            const found = parsed.find((p: any) => p.id === id)
            if (found) {
              setProject(found)
            }
          }
        }
      } catch (e) {}
    }
    loadData()
  }, [id])

  const updateProject = async (updatedProject: any) => {
    setProject(updatedProject)
    try {
      const res = await fetch('/api/db?collection=projects', { cache: 'no-store' })
      if (res.ok) {
        const parsed = await res.json()
        if (parsed) {
          const updatedList = parsed.map((p: any) => p.id === updatedProject.id ? updatedProject : p)
          await fetch('/api/db?collection=projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList),
            cache: 'no-store'
          })
        }
      }
    } catch (e) {}
  }

  const handleSaveProjectInfo = (editedProj: any) => {
    updateProject(editedProj)
    toast.success("Đã cập nhật dự án thành công!")
    setIsEditModalOpen(false)
  }

  const handleDeleteProject = () => {
    setIsConfirmDeleteOpen(true)
  }

  const currentUser = role === "DIRECTOR" ? "Nguyễn Minh Đức" : role === "MANAGER" ? "Vũ Quang Huy" : "Toby Vu"
  const canManage = role === "MANAGER" || role === "DIRECTOR"

  const handleToggleTask = (taskId: string) => {
    const task = project.tasks.find((t: any) => t.id === taskId)
    if (!task) return

    if (!canManage && task.assignee !== currentUser) {
      toast.error("Bạn chỉ có thể cập nhật trạng thái công việc của chính mình!")
      return
    }

    const updatedTasks = project.tasks.map((t: any) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: t.status === "DONE" ? "TODO" : "DONE"
        }
      }
      return t
    })

    const doneCount = updatedTasks.filter((t: any) => t.status === "DONE").length
    const calculatedProgress = updatedTasks.length > 0 ? Math.round((doneCount / updatedTasks.length) * 100) : 0

    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      progress: calculatedProgress
    }

    updateProject(updatedProject)
    toast.success("Đã cập nhật trạng thái công việc!")
  }

  const handleAddTask = (newTask: any) => {
    const updatedTasks = [...(project.tasks || []), newTask]
    const doneCount = updatedTasks.filter((t: any) => t.status === "DONE").length
    const calculatedProgress = Math.round((doneCount / updatedTasks.length) * 100)

    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      progress: calculatedProgress
    }

    updateProject(updatedProject)
    toast.success("Đã thêm công việc thành công!")
    setIsAddTaskModalOpen(false)
  }

  const handleSaveTaskDetails = (updatedTask: any) => {
    const updatedTasks = project.tasks.map((t: any) => t.id === updatedTask.id ? updatedTask : t)
    const doneCount = updatedTasks.filter((t: any) => t.status === "DONE").length
    const calculatedProgress = updatedTasks.length > 0 ? Math.round((doneCount / updatedTasks.length) * 100) : 0

    updateProject({
      ...project,
      tasks: updatedTasks,
      progress: calculatedProgress
    })
    setSelectedTask(updatedTask)
  }

  const handleDeleteTask = (taskId: string) => {
    setTaskToDeleteId(taskId)
  }

  const handleAddTeamMemberClick = () => {
    setIsAddMemberModalOpen(true)
  }

  const handleSaveTeamMembers = (selectedMembers: string[]) => {
    const updated = {
      ...project,
      team: selectedMembers
    }
    updateProject(updated)
    toast.success("Đã cập nhật danh sách thành viên!")
    setIsAddMemberModalOpen(false)
  }

  const handleRemoveTeamMember = (name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa ${name} khỏi dự án?`)) {
      const updated = {
        ...project,
        team: project.team.filter((t: string) => t !== name)
      }
      updateProject(updated)
      toast.success(`Đã xóa ${name} khỏi dự án!`)
    }
  }

  if (mounted && !project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <h2 className="text-2xl font-bold">Không tìm thấy dự án!</h2>
        <Link href="/projects" className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>
      </div>
    )
  }

  if (!mounted || !project) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Filter Tasks
  const filteredTasks = (project.tasks || []).filter((t: any) => {
    const matchesSearch = t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
                          t.assignee.toLowerCase().includes(taskSearch.toLowerCase())
    const matchesStatus = taskStatusFilter === "ALL" || t.status === taskStatusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full"
      >
        <div className="flex items-center gap-4">
          <Link href="/projects" className="p-2 bg-card border rounded-lg hover:bg-accent text-muted-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold tracking-wide ${getTypeColor(project.type)}`}>
                {project.type}
              </span>
              <span className="text-sm text-muted-foreground font-medium">Project ID: {id}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">{project.name}</h1>
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 bg-card border border-border/80 hover:bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" /> Sửa thông tin
            </button>
            <button
              onClick={handleDeleteProject}
              className="flex items-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Xóa Dự án
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="premium-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Danh sách Công việc (Tasks)</h2>
              {canManage && (
                <button 
                  onClick={() => setIsAddTaskModalOpen(true)} 
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Thêm Task
                </button>
              )}
            </div>

            {/* Task Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 mb-4 border-border/40">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm công việc hoặc người nhận..."
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-muted/20 border rounded-lg text-xs w-full focus:outline-none"
                />
              </div>
              <div className="flex gap-1 flex-wrap">
                {taskFilters.map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setTaskStatusFilter(tf.id)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-colors ${
                      taskStatusFilter === tf.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredTasks && filteredTasks.length > 0 ? (
                filteredTasks.map((task: any) => (
                  <div 
                    key={task.id} 
                    onClick={() => setSelectedTask(task)}
                    className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleTask(task.id)
                        }}
                        className={`${task.status === 'DONE' ? 'text-emerald-500' : 'text-muted-foreground hover:text-primary'} transition-colors`}
                      >
                        {task.status === 'DONE' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </button>
                      <div>
                        <h4 className={`font-semibold ${task.status === 'DONE' ? 'line-through text-muted-foreground' : 'text-foreground group-hover:text-primary transition-colors'}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground font-medium">
                          <span className="bg-muted px-2 py-0.5 rounded text-foreground">{task.assignee}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {task.date}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            task.priority === 'Cao' ? 'bg-red-100 text-red-700' : task.priority === 'Thấp' ? 'bg-slate-100 text-slate-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {task.priority || "Bình thường"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {canManage && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTask(task.id)
                        }}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded-lg"
                        title="Xóa công việc"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground text-sm">
                  Không tìm thấy công việc nào phù hợp.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="premium-card p-6"
          >
            <h2 className="text-lg font-bold mb-4">Thông tin chung</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Khách hàng</span>
                <span className="font-semibold text-foreground">{project.client}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Trạng thái</span>
                <div className="flex items-center gap-2">
                  {canManage ? (
                    <select
                      value={project.status}
                      onChange={(e) => {
                        const updated = {
                          ...project,
                          status: e.target.value
                        }
                        updateProject(updated)
                        toast.success("Đã cập nhật trạng thái dự án!")
                      }}
                      className="bg-card border border-border/80 rounded px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/20"
                    >
                      <option value="PLANNING">Lên kế hoạch</option>
                      <option value="IN_PROGRESS">Đang thực hiện</option>
                      <option value="REVIEW">Đang chờ duyệt</option>
                      <option value="COMPLETED">Đã hoàn thành</option>
                    </select>
                  ) : (
                    getStatusBadge(project.status)
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Thời hạn</span>
                <span className="font-semibold flex items-center gap-1.5"><Clock className="w-4 h-4 text-rose-500" /> {project.dueDate}</span>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Tiến độ tổng thể</span>
                <span className="text-primary font-bold">{project.progress}%</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="premium-card p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Nhân sự tham gia</h2>
              {canManage && (
                <button 
                  onClick={handleAddTeamMemberClick} 
                  className="text-primary hover:bg-primary/10 p-1.5 rounded transition-colors"
                  title="Thêm nhân sự"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.team && project.team.length > 0 ? (
                project.team.map((member: string) => (
                  <div 
                    key={member} 
                    className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-full text-xs font-semibold relative group"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {member.charAt(0).toUpperCase()}
                    </div>
                    <span>{member}</span>
                    {canManage && (
                      <button 
                        onClick={() => handleRemoveTeamMember(member)}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity ml-1.5"
                        title={`Xóa ${member}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground">Chưa có nhân sự nào tham gia.</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {isEditModalOpen && (
        <ProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProjectInfo}
          projectToEdit={project}
        />
      )}

      {isAddTaskModalOpen && (
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          onSave={handleAddTask}
          teamMembers={project.team || []}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          isOpen={!!selectedTask}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTaskDetails}
          onDelete={handleDeleteTask}
          teamMembers={project.team || []}
          canManage={canManage}
          role={role}
        />
      )}

      {isConfirmDeleteOpen && (
        <ConfirmModal
          isOpen={isConfirmDeleteOpen}
          title="Xóa dự án"
          message="Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác."
          onConfirm={() => {
            const saved = localStorage.getItem("mrex_projects")
            if (saved) {
              try {
                const parsed = JSON.parse(saved)
                const updated = parsed.filter((p: any) => p.id !== id)
                localStorage.setItem("mrex_projects", JSON.stringify(updated))
                toast.success("Đã xóa dự án thành công!")
                window.location.href = "/projects" // Hard refresh redirect
              } catch (e) {}
            }
            setIsConfirmDeleteOpen(false)
          }}
          onCancel={() => setIsConfirmDeleteOpen(false)}
        />
      )}

      {taskToDeleteId && (
        <ConfirmModal
          isOpen={!!taskToDeleteId}
          title="Xóa công việc"
          message="Bạn có chắc chắn muốn xóa công việc này?"
          onConfirm={() => {
            const updatedTasks = project.tasks.filter((t: any) => t.id !== taskToDeleteId)
            const doneCount = updatedTasks.filter((t: any) => t.status === "DONE").length
            const calculatedProgress = updatedTasks.length > 0 ? Math.round((doneCount / updatedTasks.length) * 100) : 0

            const updatedProject = {
              ...project,
              tasks: updatedTasks,
              progress: calculatedProgress
            }

            updateProject(updatedProject)
            setSelectedTask(null)
            setTaskToDeleteId(null)
            toast.success("Đã xóa công việc!")
          }}
          onCancel={() => setTaskToDeleteId(null)}
        />
      )}
    </div>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card w-full max-w-sm rounded-2xl border border-border/80 shadow-2xl p-6 space-y-4 text-foreground"
      >
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-6 h-6" />
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border/80 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors shadow-lg shadow-destructive/20"
          >
            Xác nhận
          </button>
        </div>
      </motion.div>
    </div>
  )
}

