"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Plus, X, Trash2, AlertCircle, CheckCircle2, XCircle, Clock, Receipt, FileText, Download } from "lucide-react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { useTranslation } from "@/contexts/TranslationContext"
import { useRole } from "@/components/providers/role-provider"

function ExpenseModal({ isOpen, onClose, onSave, currentUser }: { isOpen: boolean; onClose: () => void; onSave: (r: any) => void; currentUser: string }) {
  const { t } = useTranslation()
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [project, setProject] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount.trim()) { toast.error("Vui lòng nhập số tiền!"); return }
    if (!reason.trim()) { toast.error("Vui lòng nhập lý do!"); return }

    onSave({
      id: `EX-${String(Date.now()).slice(-4)}`,
      user: currentUser,
      amount: amount.trim(),
      reason: reason.trim(),
      project: project.trim() || null,
      status: "PENDING",
      date: new Date().toLocaleDateString('vi-VN')
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden text-foreground">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> {t("expenses.modal_title")}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("expenses.form_amount")}</label>
            <input type="text" placeholder="Ví dụ: 5.000.000" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("expenses.form_reason")}</label>
            <textarea placeholder="Lý do chi..." value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("expenses.form_project")}</label>
            <input type="text" placeholder="Nhập tên dự án nếu có..." value={project} onChange={e => setProject(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors">{t("common.cancel")}</button>
            <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">{t("common.save")}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  const { t } = useTranslation()
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-card w-full max-w-sm rounded-2xl border shadow-2xl p-6 space-y-4 text-foreground">
        <div className="flex items-center gap-2 text-destructive"><AlertCircle className="w-6 h-6" /><h3 className="text-lg font-bold">{title}</h3></div>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">{t("common.cancel")}</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors">{t("common.confirm")}</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function ExpensesPage() {
  const { t } = useTranslation()
  const { role, userProfile } = useRole()
  const [requests, setRequests] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const canApprove = role === "DIRECTOR" || role === "MANAGER"
  const currentUser = userProfile?.name || "Toby Vu"

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/db?collection=expenses', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setRequests(data)
            return
          }
        }
      } catch (e) {}

      const mockData = [
        { id: "EX-001", user: "Toby Vu", amount: "2.500.000", reason: "Mua màn hình phụ", project: "", status: "PENDING", date: "10/06/2026" },
        { id: "EX-002", user: "Vũ Quang Huy", amount: "15.000.000", reason: "Chi phí server dự án Vinamilk", project: "Vinamilk Campaign", status: "APPROVED", date: "08/06/2026" },
      ]
      setRequests(mockData)
    }
    loadData()
  }, [])

  const persistData = (updated: any[]) => {
    fetch('/api/db?collection=expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
      cache: 'no-store'
    }).catch(() => {})
  }

  const handleAddRequest = (r: any) => {
    const updated = [r, ...requests]
    setRequests(updated)
    persistData(updated)
    toast.success(t("expenses.request_sent"))
    setShowModal(false)

    // Notify Manager/Director
    if (!canApprove) {
      try {
        fetch('/api/db?collection=notifications').then(res => res.json()).then(notifs => {
          const newNotif = {
            id: String(Date.now()),
            title: "Yêu cầu chi tiêu mới",
            message: `${currentUser} ${t("expenses.notification_new")} ${r.amount} VNĐ.`,
            time: "Vừa xong",
            read: false,
            type: "warning"
          }
          const updatedNotifs = [newNotif, ...(Array.isArray(notifs) ? notifs : [])]
          fetch('/api/db?collection=notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedNotifs)
          })
        })
      } catch (e) {}
    }
  }

  const handleApprove = (id: string, user: string) => {
    if (!canApprove) return
    const updated = requests.map(req => req.id === id ? { ...req, status: "APPROVED" } : req)
    setRequests(updated)
    persistData(updated)
    toast.success(t("expenses.request_approved"))

    // Notify requester
    try {
      fetch('/api/db?collection=notifications').then(res => res.json()).then(notifs => {
        const newNotif = {
          id: String(Date.now()),
          title: "Chi tiêu đã duyệt",
          message: `${t("expenses.notification_approved")} (${id}).`,
          time: "Vừa xong",
          read: false,
          type: "success"
        }
        const updatedNotifs = [newNotif, ...(Array.isArray(notifs) ? notifs : [])]
        fetch('/api/db?collection=notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedNotifs)
        })
      })
    } catch (e) {}
  }

  const handleReject = (id: string, user: string) => {
    if (!canApprove) return
    const updated = requests.map(req => req.id === id ? { ...req, status: "REJECTED" } : req)
    setRequests(updated)
    persistData(updated)
    toast.error(t("expenses.request_rejected"))

    // Notify requester
    try {
      fetch('/api/db?collection=notifications').then(res => res.json()).then(notifs => {
        const newNotif = {
          id: String(Date.now()),
          title: "Chi tiêu bị từ chối",
          message: `${t("expenses.notification_rejected")} (${id}).`,
          time: "Vừa xong",
          read: false,
          type: "error"
        }
        const updatedNotifs = [newNotif, ...(Array.isArray(notifs) ? notifs : [])]
        fetch('/api/db?collection=notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedNotifs)
        })
      })
    } catch (e) {}
  }

  const handleDelete = (id: string) => {
    const updated = requests.filter(r => r.id !== id)
    setRequests(updated)
    persistData(updated)
    toast.success(t("common.delete") + " " + id)
    setDeleteId(null)
  }

  // Filter requests based on role
  // Employees only see their own. Managers/Directors see all.
  const visibleRequests = canApprove ? requests : requests.filter(r => r.user === currentUser)

  const pendingCount = visibleRequests.filter(r => r.status === "PENDING").length
  const approvedCount = visibleRequests.filter(r => r.status === "APPROVED").length
  const rejectedCount = visibleRequests.filter(r => r.status === "REJECTED").length

  const exportToExcel = () => {
    if (visibleRequests.length === 0) {
      toast.error("Không có dữ liệu để xuất!")
      return
    }
    const wsData = visibleRequests.map(r => ({
      "Mã yêu cầu": r.id,
      "Người đề xuất": r.user,
      "Số tiền (VNĐ)": r.amount,
      "Lý do": r.reason,
      "Dự án": r.project || "Không có",
      "Ngày tạo": r.date,
      "Trạng thái": r.status === "APPROVED" ? "Đã duyệt" : r.status === "REJECTED" ? "Từ chối" : "Chờ duyệt"
    }))
    const ws = XLSX.utils.json_to_sheet(wsData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Chi tiêu")
    XLSX.writeFile(wb, "Bao_cao_chi_tieu.xlsx")
    toast.success("Xuất báo cáo Excel thành công!")
  }

  const exportToPDF = () => {
    if (visibleRequests.length === 0) {
      toast.error("Không có dữ liệu để xuất!")
      return
    }
    const doc = new jsPDF()
    doc.text("BAO CAO CHI TIEU", 14, 15)
    
    const tableColumn = ["Ma Y/C", "Nguoi tao", "So tien", "Ly do", "Trang thai"]
    const tableRows = visibleRequests.map(r => [
      r.id,
      r.user,
      r.amount,
      r.reason,
      r.status
    ])

    ;(doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    })

    doc.save("Bao_cao_chi_tieu.pdf")
    toast.success("Xuất báo cáo PDF thành công!")
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">{t("expenses.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("expenses.subtitle")}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> {t("expenses.create_request")}
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6 flex flex-col justify-center items-center">
          <Clock className="w-8 h-8 text-orange-500 mb-2" />
          <h3 className="text-2xl font-bold text-orange-500">{pendingCount}</h3>
          <p className="text-sm text-muted-foreground">{t("expenses.pending_count")}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card p-6 flex flex-col justify-center items-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
          <h3 className="text-2xl font-bold text-emerald-500">{approvedCount}</h3>
          <p className="text-sm text-muted-foreground">{t("expenses.approved_count")}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card p-6 flex flex-col justify-center items-center">
          <XCircle className="w-8 h-8 text-rose-500 mb-2" />
          <h3 className="text-2xl font-bold text-rose-500">{rejectedCount}</h3>
          <p className="text-sm text-muted-foreground">{t("expenses.rejected_count")}</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="premium-card overflow-hidden">
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <h2 className="font-semibold text-lg flex items-center gap-2"><Receipt className="w-5 h-5 text-primary" /> {t("expenses.request_list")}</h2>
          <div className="flex items-center gap-2">
            <button onClick={exportToExcel} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-xs font-semibold transition-colors">
              <Download className="w-3.5 h-3.5" /> Excel
            </button>
            <button onClick={exportToPDF} className="flex items-center gap-2 px-3 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg text-xs font-semibold transition-colors">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-semibold">{t("expenses.col_id")}</th>
                <th className="px-6 py-4 font-semibold">{t("expenses.col_creator")}</th>
                <th className="px-6 py-4 font-semibold">{t("expenses.col_amount")}</th>
                <th className="px-6 py-4 font-semibold">{t("expenses.col_reason")}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("expenses.col_status")}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("expenses.col_action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {visibleRequests.map((req) => (
                <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{req.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {req.user.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium block">{req.user}</span>
                        <span className="text-xs text-muted-foreground block">{req.date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    {req.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="block text-foreground">{req.reason}</span>
                    {req.project && <span className="text-xs text-primary font-medium mt-1 inline-block bg-primary/10 px-2 py-0.5 rounded">Dự án: {req.project}</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                      req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {req.status === 'APPROVED' ? t("expenses.status_approved") : req.status === 'REJECTED' ? t("expenses.status_rejected") : t("expenses.status_pending")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {req.status === 'PENDING' ? (
                        canApprove && (role === "DIRECTOR" || req.user !== currentUser) ? (
                          <>
                            <button onClick={() => handleApprove(req.id, req.user)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title={t("expenses.approve")}>
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleReject(req.id, req.user)}
                              className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors" title={t("expenses.reject")}>
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        ) : null
                      ) : null}
                      <button onClick={() => setDeleteId(req.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-1" title={t("common.delete")}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleRequests.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">{t("expenses.no_requests")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showModal && <ExpenseModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleAddRequest} currentUser={currentUser} />}
      {deleteId && (
        <ConfirmModal isOpen={!!deleteId} title={t("common.delete")} message="Are you sure you want to delete this?"
          onConfirm={() => handleDelete(deleteId!)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
