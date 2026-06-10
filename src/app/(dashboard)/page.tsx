"use client"

import { useState, useEffect } from "react"
import { 
  DollarSign, 
  Users, 
  Briefcase, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Star,
  Circle,
  CalendarDays
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import { useTranslation } from "@/contexts/TranslationContext"
import { toast } from "sonner"

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

export default function Dashboard() {
  const { t } = useTranslation()
  const { role, userProfile, attendanceState } = useRole()
  
  const [projects, setProjects] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [timeFilter, setTimeFilter] = useState("30_days")
  const [logoUrl, setLogoUrl] = useState("")
  const [companyName, setCompanyName] = useState("MRex Agency")
  const [brandBanner, setBrandBanner] = useState("")
  const [showMorningReminder, setShowMorningReminder] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loadProjects = async () => {
      try {
        const res = await fetch('/api/db?collection=projects', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data) setProjects(data)
        } else {
          await fetch('/api/db?collection=projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(initialProjects),
            cache: 'no-store'
          })
          setProjects(initialProjects)
        }
      } catch (e) {
        setProjects(initialProjects)
      }
    }
    
    const loadAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setAnalytics(data)
        }
      } catch (e) {}
    }

    loadProjects()
    loadAnalytics()

    const l = localStorage.getItem("mrex_brand_logo")
    if (l) setLogoUrl(l)
    
    // Fetch company name from API/LocalStorage if available, or just fallback
    const cn = localStorage.getItem("mrex_company_name")
    if (cn) setCompanyName(cn)

    const bb = localStorage.getItem("mrex_brand_banner")
    if (bb) setBrandBanner(bb)

    // Check morning reminder
    const hour = new Date().getHours()
    // Show reminder if it's morning (before 10 AM) and not checked in
    if (hour >= 6 && hour < 10 && !attendanceState.isCheckedIn) {
      setShowMorningReminder(true)
    } else {
      setShowMorningReminder(false)
    }
  }, [attendanceState.isCheckedIn])

  const handleToggleDashboardTask = (projectId: string, taskId: string) => {
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
    fetch('/api/db?collection=projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProjects),
      cache: 'no-store'
    }).catch(() => {})
    toast.success(t("workspace.toast_task_updated"))
  }

  const employeeName = userProfile?.name || "Toby Vu"

  const assignedProjects = projects.filter(p => p.team && p.team.includes(employeeName))
  
  const assignedTasks = projects.flatMap(p => 
    (p.tasks || []).map((t: any) => ({ ...t, projectId: p.id, projectName: p.name }))
  ).filter(t => t.assignee === employeeName)

  // Live director stats (computed from real projects data)
  const allTasks = projects.flatMap(p => p.tasks || [])
  const liveActiveProjects = projects.filter(p => p.status !== 'COMPLETED').length
  const liveCompletedProjects = projects.filter(p => p.status === 'COMPLETED').length
  const liveTotalTasks = allTasks.length
  const liveDoneTasks = allTasks.filter((t: any) => t.status === 'DONE').length
  const liveAvgProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
    : 0

  const mockDataSets = {
    "30_days": {
      stats: { rev: "1.2 Tỷ VNĐ", revChange: "+14.5%", clients: "45", clientsChange: "+2", proj: "12", projChange: "-1", profit: "452 Tr VNĐ", profitChange: "+21.2%" },
      chart: [
        { name: t("dashboard.month_1"), revenue: 40000000, profit: 24000000 },
        { name: t("dashboard.month_2"), revenue: 30000000, profit: 13980000 },
        { name: t("dashboard.month_3"), revenue: 20000000, profit: 9800000 },
        { name: t("dashboard.month_4"), revenue: 27800000, profit: 13908000 },
        { name: t("dashboard.month_5"), revenue: 48900000, profit: 24800000 },
        { name: t("dashboard.month_6"), revenue: 53900000, profit: 28800000 },
        { name: t("dashboard.month_7"), revenue: 64900000, profit: 34300000 },
      ]
    },
    "this_month": {
      stats: { rev: "400 Tr VNĐ", revChange: "+5.2%", clients: "40", clientsChange: "+5", proj: "15", projChange: "+3", profit: "150 Tr VNĐ", profitChange: "+8.1%" },
      chart: [
        { name: "Tuần 1", revenue: 80000000, profit: 30000000 },
        { name: "Tuần 2", revenue: 120000000, profit: 45000000 },
        { name: "Tuần 3", revenue: 90000000, profit: 35000000 },
        { name: "Tuần 4", revenue: 110000000, profit: 40000000 },
      ]
    },
    "this_quarter": {
      stats: { rev: "3.5 Tỷ VNĐ", revChange: "+22.4%", clients: "52", clientsChange: "+12", proj: "24", projChange: "+8", profit: "1.2 Tỷ VNĐ", profitChange: "+30.5%" },
      chart: [
        { name: "Tháng 1", revenue: 1000000000, profit: 350000000 },
        { name: "Tháng 2", revenue: 1200000000, profit: 400000000 },
        { name: "Tháng 3", revenue: 1300000000, profit: 450000000 },
      ]
    },
    "this_year": {
      stats: { rev: "14.2 Tỷ VNĐ", revChange: "+45.1%", clients: "85", clientsChange: "+30", proj: "65", projChange: "+20", profit: "5.1 Tỷ VNĐ", profitChange: "+52.3%" },
      chart: [
        { name: "Q1", revenue: 3500000000, profit: 1200000000 },
        { name: "Q2", revenue: 4200000000, profit: 1500000000 },
        { name: "Q3", revenue: 3800000000, profit: 1300000000 },
        { name: "Q4", revenue: 2700000000, profit: 1100000000 },
      ]
    }
  }

  const currentData = mockDataSets[timeFilter as keyof typeof mockDataSets] || mockDataSets["30_days"]
  const revenueData = analytics?.financialTrend || currentData.chart
  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#f43f5e', '#8b5cf6'];

  return (
    <div className="space-y-6 pb-10">
      {/* Morning Attendance Reminder */}
      <AnimatePresence>
        {showMorningReminder && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start sm:items-center justify-between gap-4 overflow-hidden"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300">{t("reminder.title")}</h3>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">{t("reminder.please_checkin")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link 
                href="/attendance"
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                {t("reminder.checkin_now")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner Chào Mừng */}
      {role === "DIRECTOR" && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={brandBanner ? { backgroundImage: `url(${brandBanner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          className={`relative overflow-hidden rounded-2xl shadow-lg mb-8 p-8 ${brandBanner ? 'text-white' : 'bg-gradient-to-r from-primary/90 to-primary text-primary-foreground'}`}
        >
          {brandBanner && <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {logoUrl ? (
                <div className="w-20 h-20 bg-white/10 rounded-xl p-2 backdrop-blur-sm border border-white/20 shadow-inner flex items-center justify-center shrink-0">
                  <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center text-4xl font-bold backdrop-blur-sm border border-white/20 shadow-inner shrink-0">
                  {companyName.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Chào mừng đến với {companyName}!</h1>
                <p className="text-white/90 text-sm sm:text-base max-w-xl">Hệ thống quản trị doanh nghiệp toàn diện. Theo dõi hiệu suất, quản lý dự án và phát triển tổ chức của bạn một cách dễ dàng.</p>
              </div>
            </div>
            <div className="hidden lg:block text-right shrink-0">
              <p className="text-sm font-medium text-white/80 mb-1">Ngày làm việc</p>
              <p className="text-xl font-bold">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          
          {/* Decorative background elements */}
          {!brandBanner && (
            <>
              <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            </>
          )}
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("dashboard.subtitle")}</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-card border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="30_days">{t("dashboard.filter_30_days")}</option>
            <option value="this_month">{t("dashboard.filter_this_month")}</option>
            <option value="this_quarter">{t("dashboard.filter_this_quarter")}</option>
            <option value="this_year">{t("dashboard.filter_this_year")}</option>
          </select>
          <button 
            onClick={() => toast.info("Đang tải báo cáo xuống dạng PDF...")}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            {t("dashboard.download_report")}
          </button>
        </motion.div>
      </div>

      {role === "EMPLOYEE" ? (
        <div className="space-y-6">
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <StatCard 
              title={t("workspace.tasks_completed")} 
              value={mounted ? assignedTasks.filter(t => t.status === "DONE").length.toString() : "0"} 
              change={t("workspace.auto_update")} 
              trend="up" 
              icon={CheckCircle2} 
            />
            <StatCard 
              title={t("workspace.tasks_overdue")} 
              value={mounted ? assignedTasks.filter(t => t.status !== "DONE").length.toString() : "0"} 
              change={t("workspace.auto_update")} 
              trend="down" 
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
                <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-400">{t("workspace.performance_rating")}</h3>
                <div className="w-10 h-10 rounded-xl bg-emerald-200/50 flex items-center justify-center text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <Star className="w-5 h-5" />
                </div>
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">{t("workspace.perf_excellent")}</h2>
                <div className="flex items-center gap-1 mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-500">
                  <span>{t("workspace.on_time")} 95.7%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Assigned Projects and Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks list (Col-span 2) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 premium-card p-6"
            >
              <h2 className="text-lg font-bold mb-4">{t("workspace.assigned_tasks")}</h2>
              {mounted && assignedTasks.length > 0 ? (
                <div className="space-y-3">
                  {assignedTasks.map((task: any) => (
                    <div 
                      key={`${task.projectId}-${task.id}`}
                      onClick={() => handleToggleDashboardTask(task.projectId, task.id)}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors group cursor-pointer text-foreground"
                    >
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleDashboardTask(task.projectId, task.id)
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
                            }`}>{task.priority || "Bình thường"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground text-sm">
                  {t("workspace.no_assigned_tasks")}
                </div>
              )}
            </motion.div>

            {/* Projects list (Col-span 1) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-card p-6"
            >
              <h2 className="text-lg font-bold mb-4">{t("workspace.participating_projects")}</h2>
              {mounted && assignedProjects.length > 0 ? (
                <div className="space-y-4">
                  {assignedProjects.map((project: any) => (
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
                            <span>Tiến độ</span>
                            <span className="text-primary font-bold">{project.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground text-sm">
                  {t("workspace.no_projects")}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      ) : (
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard 
            title={t("dashboard.total_revenue") || "Tổng doanh thu"} 
            value={analytics ? `${(analytics.summary.totalRevenue / 1000000).toFixed(1)} Tr` : currentData.stats.rev} 
            change={currentData.stats.revChange} 
            trend="up" 
            icon={DollarSign} 
          />
          <StatCard 
            title={t("dashboard.active_clients") || "Chi phí hoạt động"} 
            value={analytics ? `${(analytics.summary.totalExpenses / 1000000).toFixed(1)} Tr` : currentData.stats.clients} 
            change="+1.2%" 
            trend="down" 
            icon={Users} 
          />
          <StatCard 
            title={t("dashboard.active_projects") || "Dự án đang chạy"} 
            value={mounted ? liveActiveProjects.toString() : currentData.stats.proj} 
            change={mounted ? `${liveCompletedProjects} dự án đã hoàn thành` : currentData.stats.projChange} 
            trend={liveCompletedProjects > 0 ? "up" : "down"} 
            icon={Briefcase} 
          />
          <StatCard 
            title={t("workspace.tasks_completed")} 
            value={mounted ? `${liveDoneTasks}/${liveTotalTasks}` : "–"} 
            change={mounted ? `${t("workspace.avg_progress")}: ${liveAvgProgress}%` : "..."} 
            trend={liveDoneTasks > 0 ? "up" : "down"} 
            icon={TrendingUp} 
          />
        </motion.div>
      )}

      {role !== "EMPLOYEE" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 premium-card p-6 min-h-[400px]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{t("dashboard.chart_title")}</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">{t("dashboard.revenue")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-muted-foreground">{t("dashboard.profit")}</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [`${value.toLocaleString('vi-VN')} VNĐ`, '']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="profit" stroke="hsl(var(--secondary))" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="premium-card p-6 min-h-[400px] flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Trạng thái Dự án</h2>
              <Link href="/projects" className="text-sm text-primary font-medium hover:underline">Xem chi tiết</Link>
            </div>
            
            <div className="flex-1 w-full h-[300px]">
              {analytics?.projectStatusData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.projectStatusData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Đang tải dữ liệu...
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, change, trend, icon: Icon }: { title: string, value: string, change: string, trend: "up" | "down", icon: any }) {
  const { t } = useTranslation()
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
      }} 
      className="premium-card p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
        <Icon className="w-24 h-24 text-primary" />
      </div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
        <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
          {trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span>{change}</span>
          <span className="text-muted-foreground ml-1 font-normal">{t("dashboard.vs_last_month")}</span>
        </div>
      </div>
    </motion.div>
  )
}
