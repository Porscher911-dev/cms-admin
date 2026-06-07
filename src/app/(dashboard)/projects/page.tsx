"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FolderKanban,
  CalendarDays,
  Edit,
  Trash2,
  X
} from "lucide-react"
import Link from "next/link"
import { useRole } from "@/components/providers/role-provider"

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
      
      // format date from DD/MM/YYYY to YYYY-MM-DD for date input
      const dateParts = projectToEdit.dueDate.split('/')
      if (dateParts.length === 3) {
        setDueDate(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)
      } else {
        setDueDate(projectToEdit.dueDate)
      }
      
      setTeamInput(projectToEdit.team.join(", "))
    } else {
      setName("")
      setClient("")
      setType("SEO")
      setStatus("PLANNING")
      setProgress(0)
      setDueDate("")
      setTeamInput("")
    }
  }, [projectToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !client.trim()) {
      toast.error("Vui lòng điền đầy đủ Tên dự án và Khách hàng!")
      return
    }

    // Format date back to DD/MM/YYYY
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
      id: projectToEdit?.id || `P-${crypto.randomUUID()}`,
      name: name.trim(),
      client: client.trim(),
      type,
      status,
      progress: Number(progress),
      dueDate: formattedDate || new Date().toLocaleDateString('vi-VN'),
      team,
      tasks: projectToEdit?.tasks || []
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
          <h3 className="text-xl font-bold text-foreground">
            {projectToEdit ? "Cập nhật Dự án" : "Thêm Dự án mới"}
          </h3>
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
              placeholder="VD: Chiến dịch SEO Tổng thể 2026"
              className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Khách hàng (Client)</label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="VD: TechCorp Global"
              className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Loại dự án</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Thành viên tham gia (cách nhau bằng dấu phẩy)</label>
            <input
              type="text"
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value)}
              placeholder="VD: Alice, Bob, Charlie"
              className="w-full px-3 py-2 border border-border/80 rounded-lg bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border/80 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Lưu lại
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<any | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null)
  const { role } = useRole()

  const statuses = [
    { id: "ALL", label: "Tất cả" },
    { id: "PLANNING", label: "Lên kế hoạch" },
    { id: "IN_PROGRESS", label: "Đang thực hiện" },
    { id: "REVIEW", label: "Chờ duyệt" },
    { id: "COMPLETED", label: "Đã hoàn thành" }
  ]

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("mrex_projects")
    if (saved) {
      try {
        setProjects(JSON.parse(saved))
      } catch (e) {
        setProjects(initialProjects)
      }
    } else {
      setProjects(initialProjects)
      localStorage.setItem("mrex_projects", JSON.stringify(initialProjects))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mrex_projects", JSON.stringify(projects))
    }
  }, [projects, mounted])

  // Close active dropdown menu when clicking anywhere
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuId(null)
    }
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [])

  const handleSaveProject = (savedProject: any) => {
    if (projectToEdit) {
      // Edit
      setProjects(prev => prev.map(p => p.id === savedProject.id ? savedProject : p))
      toast.success("Đã cập nhật dự án thành công!")
    } else {
      // Add
      setProjects(prev => [savedProject, ...prev])
      toast.success("Đã thêm dự án mới thành công!")
    }
    setIsModalOpen(false)
    setProjectToEdit(null)
  }

  const handleEditClick = (project: any) => {
    setProjectToEdit(project)
    setIsModalOpen(true)
  }

  const handleDeleteProject = (id: string) => {
    setProjectToDeleteId(id)
  }

  const canManage = role === "MANAGER" || role === "DIRECTOR"

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter
    const matchesType = typeFilter === "ALL" || p.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Dự án</h1>
          <p className="text-muted-foreground mt-1">Theo dõi tiến độ tất cả dự án của các phòng ban.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm tên dự án hoặc client..." 
              className="pl-9 pr-4 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {canManage && (
            <button 
              onClick={() => {
                setProjectToEdit(null)
                setIsModalOpen(true)
              }}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" /> Thêm Dự án
            </button>
          )}
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-muted/20 p-4 rounded-xl border border-border/40">
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`relative px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                statusFilter === s.id
                  ? "bg-primary text-primary-foreground shadow shadow-primary/20"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase whitespace-nowrap">Lọc theo loại:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-card text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">Tất cả loại</option>
            <option value="SEO">SEO</option>
            <option value="DESIGN">DESIGN</option>
            <option value="VIDEO">VIDEO</option>
            <option value="GOOGLE_ADS">GOOGLE ADS</option>
            <option value="WEBSITE">WEBSITE</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {mounted && filteredProjects.map((project, index) => {
            // Recalculate progress based on tasks if tasks are present
            const totalTasks = project.tasks?.length || 0
            const doneTasks = project.tasks?.filter((t: any) => t.status === "DONE").length || 0
            const displayProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : project.progress

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                key={project.id}
              >
                <Link href={`/projects/${project.id}`}>
                  <div className="premium-card p-6 hover:border-primary/50 cursor-pointer h-full flex flex-col group relative">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold tracking-wide ${getTypeColor(project.type)}`}>
                        {project.type}
                      </span>
                      {canManage && (
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setActiveMenuId(activeMenuId === project.id ? null : project.id)
                            }}
                            className={`text-muted-foreground hover:text-foreground transition-opacity p-1 rounded hover:bg-muted ${activeMenuId === project.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {activeMenuId === project.id && (
                            <div className="absolute right-0 top-8 w-36 bg-card border border-border/80 rounded-lg shadow-lg py-1 z-20 text-sm text-foreground">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleEditClick(project)
                                }}
                                className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-muted transition-colors"
                              >
                                <Edit className="w-4.5 h-4.5 text-muted-foreground" /> Chỉnh sửa
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDeleteProject(project.id)
                                }}
                                className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-muted text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="w-4.5 h-4.5" /> Xóa dự án
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Client: <span className="font-medium text-foreground">{project.client}</span>
                    </p>

                    <div className="mt-auto space-y-5">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Tiến độ</span>
                          <span className="font-bold text-primary">{displayProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${displayProgress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div>
                          {getStatusBadge(project.status)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <CalendarDays className="w-4 h-4" />
                          {project.dueDate}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
      </div>

      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setProjectToEdit(null)
          }}
          onSave={handleSaveProject}
          projectToEdit={projectToEdit}
        />
      )}

      {projectToDeleteId && (
        <ConfirmModal
          isOpen={!!projectToDeleteId}
          title="Xóa dự án"
          message="Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác."
          onConfirm={() => {
            setProjects(prev => prev.filter(p => p.id !== projectToDeleteId))
            toast.success("Đã xóa dự án thành công!")
            setProjectToDeleteId(null)
          }}
          onCancel={() => setProjectToDeleteId(null)}
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
