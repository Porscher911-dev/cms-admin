"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { ClipboardList, Send, FileText, CheckCircle2, History, Search, Heart, MessageSquare, Clock, Trash2 } from "lucide-react"
import { useRole } from "@/components/providers/role-provider"

// No hardcoded reports - start empty, load from DB
const initialReports: any[] = []

export default function ReportsPage() {
  const { role } = useRole()
  const [reportText, setReportText] = useState("")
  const [reports, setReports] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loadReports = async () => {
      try {
        const res = await fetch('/api/db?collection=reports', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data && Array.isArray(data) && data.length > 0) {
            setReports(data)
          }
          // If no data, keep empty — new employees have no reports
        }
      } catch (e) {}
    }
    loadReports()
  }, [])

  const saveReportsToDb = (updated: any[]) => {
    fetch('/api/db?collection=reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
      cache: 'no-store'
    }).catch(() => {})
  }

  const handleSendReport = () => {
    if (!reportText.trim()) {
      toast.error("Vui lòng nhập nội dung báo cáo!")
      return
    }
    
    const newReport = {
      id: crypto.randomUUID(),
      sender: "Toby Vu",
      role: "Design",
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + " Hôm nay",
      content: reportText,
      liked: false,
      status: "Chờ duyệt"
    }
    
    const updated = [newReport, ...reports]
    setReports(updated)
    saveReportsToDb(updated)
    toast.success("Đã gửi báo cáo thành công!")
    setReportText("")
  }

  const handleDelete = (id: string, sender: string) => {
    const updated = reports.filter(item => item.id !== id)
    setReports(updated)
    saveReportsToDb(updated)
    toast.success(`Đã xóa báo cáo của ${sender}!`)
  }

  const toggleLike = (id: string, sender: string, currentlyLiked: boolean) => {
    const updated = reports.map(item => item.id === id ? { ...item, liked: !item.liked, status: !item.liked ? "Đã duyệt" : "Chờ duyệt" } : item)
    setReports(updated)
    saveReportsToDb(updated)
    if (!currentlyLiked) {
      toast.success(`Đã duyệt báo cáo của ${sender}!`)
    }
  }

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const submitReply = (id: string, sender: string) => {
    if (replyText.trim() !== "") {
      const updated = reports.map(item => item.id === id ? { ...item, status: "Đã phản hồi", managerReply: replyText.trim(), repliedAt: new Date().toLocaleString('vi-VN') } : item)
      setReports(updated)
      saveReportsToDb(updated)
      toast.success(`Đã gửi phản hồi đến ${sender} thành công!`)
      setActiveReplyId(null)
      setReplyText("")
    } else {
      toast.error("Vui lòng nhập nội dung phản hồi!")
    }
  }

  const myReports = reports.filter(r => r.sender === "Toby Vu")

  // EMPLOYEE VIEW
  if (role === "EMPLOYEE") {
    return (
      <div className="space-y-6 pb-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-primary" /> Báo cáo / Kế hoạch ngày
          </h1>
          <p className="text-muted-foreground mt-1">Tổng kết công việc trong ngày và lập kế hoạch cho ngày tiếp theo.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="premium-card p-6 h-full flex flex-col">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" /> Soạn Báo Cáo
              </h2>
              <textarea 
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="w-full flex-1 min-h-[300px] bg-muted/30 border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
                placeholder={`1. CÔNG VIỆC ĐÃ HOÀN THÀNH:\n- ...\n- ...\n\n2. VẤN ĐỀ VƯỚNG MẮC:\n- ...\n\n3. KẾ HOẠCH NGÀY MAI:\n- ...`}
              ></textarea>
              <div className="flex justify-end mt-4 pt-4 border-t">
                <button 
                  onClick={handleSendReport}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 transform hover:scale-[1.02] active:scale-95"
                >
                  <Send className="w-5 h-5" /> Gửi Báo Cáo Cho Quản Lý
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
            <div className="premium-card p-6 h-full">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-muted-foreground" /> Lịch sử gửi
              </h2>
              <div className="space-y-4">
                <AnimatePresence>
                  {myReports.map((report, i) => (
                    <motion.div 
                      key={`${report.id}-${i}`} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-4 border rounded-xl bg-card hover:border-primary/30 transition-colors relative group"
                    >
                      <button 
                        onClick={() => handleDelete(report.id, "bạn")}
                        className="absolute top-2 right-2 p-1.5 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                        title="Xóa báo cáo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center justify-between mb-2 pr-6">
                        <span className="text-sm font-bold">{report.time}</span>
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${report.status === 'Đã duyệt' ? 'bg-emerald-100 text-emerald-700' : report.status === 'Chờ duyệt' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                          <CheckCircle2 className="w-3 h-3" /> {report.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{report.content}</p>
                      {report.managerReply && (
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-1 mb-1">
                            <MessageSquare className="w-3 h-3 text-blue-600" />
                            <span className="text-[10px] font-bold text-blue-600">Nhận xét Quản lý</span>
                            {report.repliedAt && <span className="text-[9px] text-muted-foreground ml-auto">{report.repliedAt}</span>}
                          </div>
                          <p className="text-xs text-blue-700 dark:text-blue-300">{report.managerReply}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // MANAGER VIEW
  if (role === "MANAGER") {
    return (
      <div className="space-y-6 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ClipboardList className="w-8 h-8 text-primary" /> Inbox Báo cáo
            </h1>
            <p className="text-muted-foreground mt-1">Duyệt và phản hồi báo cáo công việc hàng ngày của Team.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm theo tên nhân viên..." 
              className="w-full pl-9 pr-4 py-2 bg-card border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {reports.map((msg, i) => (
              <motion.div 
                key={`${msg.id}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="premium-card p-5 border-t-4 border-t-blue-500 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      {msg.sender.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-tight">{msg.sender}</h3>
                      <p className="text-[11px] font-medium text-muted-foreground">{msg.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" /> {msg.time}
                  </div>
                </div>
                
                <div className="flex-1 bg-muted/30 p-4 rounded-xl text-sm text-foreground/80 mb-4 whitespace-pre-wrap">
                  {msg.content}
                </div>
                
                {msg.managerReply && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-xs">
                    <div className="flex items-center gap-1 mb-1 font-bold text-blue-600">
                      <MessageSquare className="w-3 h-3" /> Quản lý đã phản hồi
                    </div>
                    <p className="text-blue-700 dark:text-blue-300">{msg.managerReply}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-4">
                    <button onClick={() => { setActiveReplyId(activeReplyId === msg.id ? null : msg.id); setReplyText(""); }} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="w-4 h-4" /> Phản hồi
                    </button>
                    <button onClick={() => handleDelete(msg.id, msg.sender)} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  </div>
                  <button 
                    onClick={() => toggleLike(msg.id, msg.sender, msg.liked)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${msg.liked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`}
                  >
                    <Heart className={`w-4 h-4 ${msg.liked ? 'fill-current' : ''}`} /> {msg.liked ? 'Đã duyệt' : 'Duyệt'}
                  </button>
                </div>

                {activeReplyId === msg.id && (
                  <div className="pt-3 border-t flex flex-col gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
                    <textarea 
                      autoFocus
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Nhập nội dung phản hồi..."
                      className="w-full text-xs p-2 border rounded-lg resize-none bg-muted/20 focus:outline-none focus:ring-1 focus:ring-primary/50"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setActiveReplyId(null)} className="text-xs px-3 py-1.5 border hover:bg-muted rounded-md transition-colors font-medium">Hủy</button>
                      <button onClick={() => submitReply(msg.id, msg.sender)} className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">Gửi phản hồi</button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Fallback for DIRECTOR or others (though sidebar hides it)
  return (
    <div className="h-[50vh] flex flex-col items-center justify-center text-center">
      <ClipboardList className="w-16 h-16 text-muted-foreground/30 mb-4" />
      <h2 className="text-xl font-bold">Không có dữ liệu</h2>
      <p className="text-muted-foreground">Trang báo cáo chỉ dành cho Quản lý và Nhân viên.</p>
    </div>
  )
}
