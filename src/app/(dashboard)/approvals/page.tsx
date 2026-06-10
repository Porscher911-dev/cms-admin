"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { CheckCircle2, XCircle, Clock, FileText, Plus, X, Trash2, AlertCircle } from "lucide-react"
import { useRole } from "@/components/providers/role-provider"
import { useTranslation } from "@/contexts/TranslationContext"

function CreateProposalModal({ isOpen, onClose, onSave, currentUser }: { isOpen: boolean; onClose: () => void; onSave: (r: any) => void; currentUser: string }) {
  const { t } = useTranslation()
  const [type, setType] = useState("Nghỉ phép năm")
  const [reason, setReason] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  if (!isOpen) return null

  const formatDate = (d: string) => {
    if (!d) return ""
    const parts = d.split("-")
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) { toast.error(t("approvals.error_empty_reason")); return }
    if (!dateFrom) { toast.error(t("approvals.error_empty_date")); return }

    const fromFormatted = formatDate(dateFrom)
    const toFormatted = dateTo ? formatDate(dateTo) : fromFormatted

    onSave({
      id: `REQ-${String(Date.now()).slice(-3)}`,
      type,
      user: currentUser,
      date: fromFormatted === toFormatted ? fromFormatted : `${fromFormatted} - ${toFormatted}`,
      reason: reason.trim(),
      status: "PENDING"
    })
    toast.success(t("approvals.proposal_sent"))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden text-foreground">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> {t("approvals.create_proposal")}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("approvals.proposal_type")}</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="Nghỉ phép năm">{t("approvals.type_annual_leave")}</option>
              <option value="Nghỉ ốm">{t("approvals.type_sick_leave")}</option>
              <option value="Nghỉ việc riêng">{t("approvals.type_personal_leave")}</option>
              <option value="Work From Home">{t("approvals.type_wfh")}</option>
              <option value="Tạm ứng">{t("approvals.type_advance_salary")}</option>
              <option value="Đề xuất khác">{t("approvals.type_other")}</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("approvals.from_date")}</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("approvals.to_date")}</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("approvals.reason")}</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder={t("approvals.reason_placeholder")} rows={3}
              className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" required />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors">{t("common.cancel")}</button>
            <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">{t("approvals.send_proposal")}</button>
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

export default function ApprovalsPage() {
  const { t } = useTranslation()
  const { role } = useRole()
  const [requests, setRequests] = useState<any[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const canApprove = role === "DIRECTOR" || role === "MANAGER"
  const currentUser = role === "DIRECTOR" ? "Nguyễn Minh Đức" : role === "MANAGER" ? "Vũ Quang Huy" : "Toby Vu"

  useEffect(() => {
    const loadRequests = async () => {
      let leaveList: any[] = []
      let otherList: any[] = []

      try {
        const resLeave = await fetch('/api/db?collection=leave_requests', { cache: 'no-store' })
        if (resLeave.ok) {
          const data = await resLeave.json()
          if (data && data.length > 0) leaveList = data
        }
      } catch (e) {}

      if (leaveList.length === 0) {
        leaveList = [
          { id: "REQ-001", date: "15/06/2026 - 16/06/2026", type: "Nghỉ phép năm", status: "PENDING", reason: "Đi khám sức khỏe định kỳ", user: "Nguyễn Văn A" },
          { id: "REQ-002", date: "02/05/2026 - 02/05/2026", type: "Nghỉ ốm", status: "APPROVED", reason: "Sốt siêu vi", user: "Toby Vu" }
        ]
      }

      try {
        const resOther = await fetch('/api/db?collection=other_requests', { cache: 'no-store' })
        if (resOther.ok) {
          const data = await resOther.json()
          if (data && data.length > 0) otherList = data
        }
      } catch (e) {}

      if (otherList.length === 0) {
        otherList = [
          { id: "REQ-003", type: "Tạm ứng", user: "Trần Thị B", date: "06/06/2026", reason: "Mua thiết bị văn phòng (12.500.000 VNĐ)", status: "APPROVED" },
          { id: "REQ-004", type: "Work From Home", user: "Lê Hoàng C", date: "08/06/2026", reason: "Lý do cá nhân", status: "REJECTED" },
        ]
      }

      setRequests([...leaveList, ...otherList])
    }

    loadRequests()
    const interval = setInterval(loadRequests, 2000)
    return () => { clearInterval(interval) }
  }, [])

  const persistRequests = (updatedList: any[]) => {
    const leaveTypes = ["Nghỉ phép", "Nghỉ phép năm", "Nghỉ việc riêng", "Nghỉ ốm"]
    const leaveList = updatedList.filter(r => leaveTypes.includes(r.type))
    const otherList = updatedList.filter(r => !leaveTypes.includes(r.type))
    
    fetch('/api/db?collection=leave_requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveList),
      cache: 'no-store'
    }).catch(() => {})

    fetch('/api/db?collection=other_requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(otherList),
      cache: 'no-store'
    }).catch(() => {})
  }

  const handleApprove = (id: string) => {
    if (!canApprove) { toast.error(t("approvals.error_no_approve_permission")); return }
    const updated = requests.map(req => req.id === id ? { ...req, status: "APPROVED" } : req)
    setRequests(updated)
    persistRequests(updated)
    toast.success(t("approvals.approved_request") + " " + id)
  }

  const handleReject = (id: string) => {
    if (!canApprove) { toast.error(t("approvals.error_no_reject_permission")); return }
    const updated = requests.map(req => req.id === id ? { ...req, status: "REJECTED" } : req)
    setRequests(updated)
    persistRequests(updated)
    toast.error(t("approvals.rejected_request") + " " + id)
  }

  const handleAddProposal = (r: any) => {
    const updated = [r, ...requests]
    setRequests(updated)
    persistRequests(updated)
  }

  const handleDelete = (id: string) => {
    const updated = requests.filter(r => r.id !== id)
    setRequests(updated)
    persistRequests(updated)
    toast.success(t("approvals.proposal_deleted"))
    setDeleteId(null)
  }

  const pendingCount = requests.filter(r => r.status === "PENDING").length
  const approvedCount = requests.filter(r => r.status === "APPROVED").length
  const rejectedCount = requests.filter(r => r.status === "REJECTED").length

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">{t("approvals.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("approvals.subtitle")}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> {t("approvals.create_proposal")}
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6 flex flex-col justify-center items-center">
          <Clock className="w-8 h-8 text-orange-500 mb-2" />
          <h3 className="text-2xl font-bold text-orange-500">{pendingCount}</h3>
          <p className="text-sm text-muted-foreground">{t("approvals.pending")}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card p-6 flex flex-col justify-center items-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
          <h3 className="text-2xl font-bold text-emerald-500">{approvedCount}</h3>
          <p className="text-sm text-muted-foreground">{t("approvals.approved")}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card p-6 flex flex-col justify-center items-center">
          <XCircle className="w-8 h-8 text-rose-500 mb-2" />
          <h3 className="text-2xl font-bold text-rose-500">{rejectedCount}</h3>
          <p className="text-sm text-muted-foreground">{t("approvals.rejected")}</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="premium-card overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <h2 className="font-semibold text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> {t("approvals.proposal_list").replace('{count}', requests.length.toString())}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-semibold">{t("approvals.col_id")}</th>
                <th className="px-6 py-4 font-semibold">{t("approvals.col_creator")}</th>
                <th className="px-6 py-4 font-semibold">{t("approvals.col_type")}</th>
                <th className="px-6 py-4 font-semibold">{t("approvals.col_time")}</th>
                <th className="px-6 py-4 font-semibold">{t("approvals.col_reason")}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("approvals.col_status")}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("approvals.col_action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{req.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {req.user ? req.user.charAt(0) : "N"}
                      </div>
                      <span className="font-medium">{req.user || "Nguyễn Văn A"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {req.type === "Nghỉ phép năm" ? t("approvals.type_annual_leave") :
                     req.type === "Nghỉ ốm" ? t("approvals.type_sick_leave") :
                     req.type === "Nghỉ việc riêng" ? t("approvals.type_personal_leave") :
                     req.type === "Work From Home" ? t("approvals.type_wfh") :
                     req.type === "Tạm ứng" ? t("approvals.type_advance_salary") :
                     t("approvals.type_other")}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{req.date}</td>
                  <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{req.reason}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                      req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {req.status === 'APPROVED' ? t("approvals.status_approved") : req.status === 'REJECTED' ? t("approvals.status_rejected") : t("approvals.status_pending")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {req.status === 'PENDING' ? (
                        canApprove && (role === "DIRECTOR" || req.user !== currentUser) ? (
                          <>
                            <button onClick={() => handleApprove(req.id)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title={t("approvals.approve")}>
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleReject(req.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors" title={t("approvals.status_rejected")}>
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">
                            {req.user === currentUser ? t("approvals.waiting_superior") : t("approvals.no_permission")}
                          </span>
                        )
                      ) : (
                        <span className="text-muted-foreground text-xs italic whitespace-nowrap">{t("approvals.processed")}</span>
                      )}
                      <button onClick={() => setDeleteId(req.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-1" title={t("common.delete")}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">{t("approvals.no_proposals")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showCreateModal && <CreateProposalModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={handleAddProposal} currentUser={currentUser} />}
      {deleteId && (
        <ConfirmModal isOpen={!!deleteId} title={t("approvals.delete_title")} message={t("approvals.delete_confirm")}
          onConfirm={() => handleDelete(deleteId!)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
