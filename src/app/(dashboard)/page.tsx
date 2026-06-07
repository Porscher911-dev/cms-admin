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
import { motion } from "framer-motion"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
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
  const { role } = useRole()
  
  const [projects, setProjects] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

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
    localStorage.setItem("mrex_projects", JSON.stringify(updatedProjects))
    toast.success("Đã cập nhật trạng thái công việc!")
  }

  const employeeName = "Toby Vu"
  
  const assignedProjects = projects.filter(p => p.team && p.team.includes(employeeName))
  
  const assignedTasks = projects.flatMap(p => 
    (p.tasks || []).map((t: any) => ({ ...t, projectId: p.id, projectName: p.name }))
  ).filter(t => t.assignee === employeeName)

  const revenueData = [
    { name: t("dashboard.month_1"), revenue: 40000000, profit: 24000000 },
    { name: t("dashboard.month_2"), revenue: 30000000, profit: 13980000 },
    { name: t("dashboard.month_3"), revenue: 20000000, profit: 9800000 },
    { name: t("dashboard.month_4"), revenue: 27800000, profit: 13908000 },
    { name: t("dashboard.month_5"), revenue: 48900000, profit: 24800000 },
    { name: t("dashboard.month_6"), revenue: 53900000, profit: 28800000 },
    { name: t("dashboard.month_7"), revenue: 64900000, profit: 34300000 },
  ]

  return (
    <div className="space-y-6 pb-10">
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
          <select className="bg-card border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>{t("dashboard.filter_30_days")}</option>
            <option>{t("dashboard.filter_this_month")}</option>
            <option>{t("dashboard.filter_this_quarter")}</option>
            <option>{t("dashboard.filter_this_year")}</option>
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
              title="Task Đã Hoàn Thành" 
              value={mounted ? assignedTasks.filter(t => t.status === "DONE").length.toString() : "0"} 
              change="Cập nhật tự động" 
              trend="up" 
              icon={CheckCircle2} 
            />
            <StatCard 
              title="Task Chưa Hoàn Thành" 
              value={mounted ? assignedTasks.filter(t => t.status !== "DONE").length.toString() : "0"} 
              change="Tiến trình công việc" 
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
                <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-400">Đánh Giá Hiệu Suất</h3>
                <div className="w-10 h-10 rounded-xl bg-emerald-200/50 flex items-center justify-center text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <Star className="w-5 h-5" />
                </div>
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">Xuất Sắc</h2>
                <div className="flex items-center gap-1 mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-500">
                  <span>Tỷ lệ đúng hạn: 95.7%</span>
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
              <h2 className="text-lg font-bold mb-4">Công việc được giao</h2>
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
                  Bạn chưa được giao công việc nào.
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
              <h2 className="text-lg font-bold mb-4">Dự án tham gia</h2>
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
                  Bạn chưa tham gia dự án nào.
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
            value="1.2 Tỷ VNĐ" 
            change="+14.5%" 
            trend="up" 
            icon={DollarSign} 
          />
          <StatCard 
            title={t("dashboard.active_clients") || "Khách hàng active"} 
            value="45" 
            change="+2" 
            trend="up" 
            icon={Users} 
          />
          <StatCard 
            title={t("dashboard.active_projects") || "Dự án đang chạy"} 
            value="12" 
            change="-1" 
            trend="down" 
            icon={Briefcase} 
          />
          <StatCard 
            title={t("dashboard.net_profit") || "Lợi nhuận ròng"} 
            value="452 Tr VNĐ" 
            change="+21.2%" 
            trend="up" 
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
            className="premium-card p-6 min-h-[400px]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Tiến độ Dự án</h2>
              <Link href="/projects" className="text-sm text-primary font-medium hover:underline">Xem tất cả</Link>
            </div>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex flex-col gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm line-clamp-1">{project.name}</div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${project.progress === 100 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-primary/10 text-primary'}`}>
                      {project.progress}%
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                    <span>{project.client}</span>
                    <span>Deadline: {project.dueDate}</span>
                  </div>
                </div>
              ))}
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
