"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { ClipboardList, Send, FileText, CheckCircle2, History, Search, Heart, MessageSquare, Clock, Trash2, Paperclip, X, Image as ImageIcon } from "lucide-react"
import { useRole } from "@/components/providers/role-provider"
import { useTranslation } from "@/contexts/TranslationContext"

// No hardcoded reports - start empty, load from DB
const initialReports: any[] = []

export default function ReportsPage() {
  const { t } = useTranslation()
  const { role, userProfile } = useRole()
  const [reportText, setReportText] = useState("")
  // Structured form states
  const [doneWork, setDoneWork] = useState("")
  const [issues, setIssues] = useState("")
  const [tomorrowPlan, setTomorrowPlan] = useState("")
  const [notes, setNotes] = useState("")
  const [attachments, setAttachments] = useState<{name: string, url: string, type: string}[]>([])
  
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
    if (!doneWork.trim() && !reportText.trim()) {
      toast.error(t("reports.error_empty_done_work"))
      return
    }

    // Fallback to reportText if using old format, otherwise use structured
    const content = doneWork.trim() ? 
      `✅ ${t("reports.section_done_work")}:\n${doneWork}\n\n⚠️ ${t("reports.section_issues")}:\n${issues || t("common.none")}\n\n📅 ${t("reports.section_tomorrow_plan")}:\n${tomorrowPlan || t("common.not_yet")}\n\n📝 ${t("reports.section_notes")}:\n${notes || t("common.none")}` 
      : reportText;
    
    
    const newReport = {
      id: crypto.randomUUID(),
      sender: userProfile?.name || "Toby Vu",
      role: userProfile?.jobTitle || "Nhân viên",
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + " Hôm nay",
      content: content,
      attachments: attachments,
      liked: false,
      status: t("reports.status_pending")
    }
    
    const updated = [newReport, ...reports]
    setReports(updated)
    saveReportsToDb(updated)
    toast.success(t("reports.report_sent"))
    setReportText("")
    setDoneWork("")
    setIssues("")
    setTomorrowPlan("")
    setNotes("")
    setAttachments([])
  }

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("reports.file_too_large"))
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setAttachments(prev => [...prev, {
        name: file.name,
        url: reader.result as string,
        type: file.type.startsWith('image/') ? 'image' : 'file'
      }])
    }
    reader.readAsDataURL(file)
  }

  const handleDelete = (id: string, sender: string) => {
    const updated = reports.filter(item => item.id !== id)
    setReports(updated)
    saveReportsToDb(updated)
    toast.success(t("reports.report_deleted") + " " + sender + "!")
  }

  const toggleLike = (id: string, sender: string, currentlyLiked: boolean) => {
    const updated = reports.map(item => item.id === id ? { ...item, liked: !item.liked, status: !item.liked ? t("reports.status_approved") : t("reports.status_pending") } : item)
    setReports(updated)
    saveReportsToDb(updated)
    if (!currentlyLiked) {
      toast.success(t("reports.report_approved") + " " + sender + "!")
    }
  }

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const submitReply = (id: string, sender: string) => {
    if (replyText.trim() !== "") {
      const updated = reports.map(item => item.id === id ? { ...item, status: t("reports.status_replied"), managerReply: replyText.trim(), repliedAt: new Date().toLocaleString('vi-VN') } : item)
      setReports(updated)
      saveReportsToDb(updated)
      toast.success(t("reports.reply_sent") + " " + sender + "!")
      setActiveReplyId(null)
      setReplyText("")
    } else {
      toast.error(t("reports.error_empty_reply"))
    }
  }

  const myReports = reports.filter(r => r.sender === "Toby Vu")

  // EMPLOYEE VIEW
  if (role === "EMPLOYEE") {
    return (
      <div className="space-y-6 pb-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-primary" /> {t("reports.title_employee")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("reports.subtitle_employee")}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="premium-card p-6 h-full flex flex-col">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" /> {t("reports.compose_report")}
              </h2>
              <div className="flex-1 space-y-4 pr-2 custom-scrollbar overflow-y-auto max-h-[60vh]">
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t("reports.done_work")} <span className="text-destructive">*</span>
                  </label>
                  <textarea 
                    value={doneWork}
                    onChange={(e) => setDoneWork(e.target.value)}
                    className="w-full min-h-[100px] bg-muted/30 border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                    placeholder={t("reports.done_work_placeholder")}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-500" /> {t("reports.issues")}
                  </label>
                  <textarea 
                    value={issues}
                    onChange={(e) => setIssues(e.target.value)}
                    className="w-full min-h-[80px] bg-muted/30 border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                    placeholder={t("reports.issues_placeholder")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" /> {t("reports.tomorrow_plan")}
                  </label>
                  <textarea 
                    value={tomorrowPlan}
                    onChange={(e) => setTomorrowPlan(e.target.value)}
                    className="w-full min-h-[80px] bg-muted/30 border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    placeholder={t("reports.tomorrow_plan_placeholder")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" /> {t("reports.notes")}
                  </label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full min-h-[60px] bg-muted/30 border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                    placeholder={t("reports.notes_placeholder")}
                  />
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2 pt-2 border-t">
                    <label className="text-sm font-bold">{t("reports.attachments")} ({attachments.length})</label>
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((att, idx) => (
                        <div key={idx} className="relative group border rounded-lg p-2 pr-8 bg-card flex items-center gap-2 text-sm max-w-[200px]">
                          {att.type === 'image' ? (
                            <img src={att.url} alt="attachment" className="w-8 h-8 object-cover rounded" />
                          ) : (
                            <FileText className="w-8 h-8 text-muted-foreground" />
                          )}
                          <span className="truncate flex-1 text-xs">{att.name}</span>
                          <button 
                            onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute right-1 top-1 p-1 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div>
                  <input type="file" id="report-attachment" className="hidden" onChange={handleAttachment} />
                  <label htmlFor="report-attachment" className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted text-sm font-medium rounded-lg cursor-pointer transition-colors">
                    <Paperclip className="w-4 h-4" /> {t("reports.attach_file")}
                  </label>
                </div>
                <button 
                  onClick={handleSendReport}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 transform hover:scale-[1.02] active:scale-95"
                >
                  <Send className="w-5 h-5" /> {t("reports.send_to_manager")}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
            <div className="premium-card p-6 h-full">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-muted-foreground" /> {t("reports.history")}
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
                        title={t("reports.delete_report")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center justify-between mb-2 pr-6">
                        <span className="text-sm font-bold">{report.time}</span>
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${report.status === t("reports.status_approved") ? 'bg-emerald-100 text-emerald-700' : report.status === t("reports.status_pending") ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                          <CheckCircle2 className="w-3 h-3" /> {report.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{report.content}</p>
                      {report.attachments && report.attachments.length > 0 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                          {report.attachments.map((att: any, idx: number) => (
                            <div key={idx} className="shrink-0">
                              {att.type === 'image' ? (
                                <img src={att.url} alt="attachment" className="h-12 w-auto object-cover rounded-md border shadow-sm" />
                              ) : (
                                <div className="h-12 px-3 flex items-center gap-1 bg-muted rounded-md border shadow-sm text-xs">
                                  <FileText className="w-3 h-3" /> <span className="truncate max-w-[80px]">{att.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {report.managerReply && (
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-1 mb-1">
                            <MessageSquare className="w-3 h-3 text-blue-600" />
                            <span className="text-[10px] font-bold text-blue-600">{t("reports.manager_reply")}</span>
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
              <ClipboardList className="w-8 h-8 text-primary" /> {t("reports.title_manager")}
            </h1>
            <p className="text-muted-foreground mt-1">{t("reports.subtitle_manager")}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder={t("reports.search_placeholder")} 
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

                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {msg.attachments.map((att: any, idx: number) => (
                      <div key={idx}>
                        {att.type === 'image' ? (
                          <a href={att.url} target="_blank" rel="noreferrer">
                            <img src={att.url} alt="attachment" className="h-16 w-auto object-cover rounded-lg border hover:opacity-80 transition-opacity cursor-zoom-in" />
                          </a>
                        ) : (
                          <div className="h-16 px-4 flex items-center gap-2 bg-card rounded-lg border text-xs cursor-pointer hover:bg-muted transition-colors">
                            <FileText className="w-4 h-4 text-blue-500" /> <span className="truncate max-w-[120px] font-medium">{att.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {msg.managerReply && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-xs">
                    <div className="flex items-center gap-1 mb-1 font-bold text-blue-600">
                      <MessageSquare className="w-3 h-3" /> {t("reports.manager_replied")}
                    </div>
                    <p className="text-blue-700 dark:text-blue-300">{msg.managerReply}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-4">
                    <button onClick={() => { setActiveReplyId(activeReplyId === msg.id ? null : msg.id); setReplyText(""); }} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="w-4 h-4" /> {t("reports.reply")}
                    </button>
                    <button onClick={() => handleDelete(msg.id, msg.sender)} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" /> {t("common.delete")}
                    </button>
                  </div>
                  <button 
                    onClick={() => toggleLike(msg.id, msg.sender, msg.liked)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${msg.liked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`}
                  >
                    <Heart className={`w-4 h-4 ${msg.liked ? 'fill-current' : ''}`} /> {msg.liked ? t("reports.status_approved") : t("reports.approve")}
                  </button>
                </div>

                {activeReplyId === msg.id && (
                  <div className="pt-3 border-t flex flex-col gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
                    <textarea 
                      autoFocus
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder={t("reports.reply_placeholder")}
                      className="w-full text-xs p-2 border rounded-lg resize-none bg-muted/20 focus:outline-none focus:ring-1 focus:ring-primary/50"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setActiveReplyId(null)} className="text-xs px-3 py-1.5 border hover:bg-muted rounded-md transition-colors font-medium">{t("common.cancel")}</button>
                      <button onClick={() => submitReply(msg.id, msg.sender)} className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">{t("reports.send_reply")}</button>
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
      <h2 className="text-xl font-bold">{t("reports.no_data")}</h2>
      <p className="text-muted-foreground">{t("reports.no_data_desc")}</p>
    </div>
  )
}
