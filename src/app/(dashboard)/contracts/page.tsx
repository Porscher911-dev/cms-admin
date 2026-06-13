"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Plus, X, Trash2, AlertCircle, FileSignature, FileText, Search, MoreVertical, Edit } from "lucide-react"
import { useTranslation } from "@/contexts/TranslationContext"
import { useRole } from "@/components/providers/role-provider"

function ContractModal({ isOpen, onClose, onSave, activeTab }: { isOpen: boolean; onClose: () => void; onSave: (r: any) => void; activeTab: string }) {
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [type, setType] = useState(activeTab === "employment" ? t("contracts.type_fulltime") || "Chính thức" : t("contracts.type_service") || "Dịch vụ")
  const [date, setDate] = useState("")
  const [fileUrl, setFileUrl] = useState("")

  if (!isOpen) return null

  const formatDate = (d: string) => {
    if (!d) return ""
    const parts = d.split("-")
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { toast.error("Vui lòng nhập tên!"); return }
    if (!date) { toast.error("Vui lòng chọn ngày!"); return }

    onSave({
      id: `HD-${String(Date.now()).slice(-4)}`,
      name: name.trim(),
      type,
      date: formatDate(date),
      status: "PENDING", // Wait, I should set it dynamically, but this is inside Modal which doesn't have role. I'll pass role or just set it later. I will just pass it out as is, and override in `handleAddContract`.
      category: activeTab,
      fileUrl: fileUrl.trim()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden text-foreground">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> {t("contracts.modal_title")}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("contracts.form_name")}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("contracts.form_type")}</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
              {activeTab === "employment" ? (
                <>
                  <option value={t("contracts.type_probation") || "Thử việc"}>{t("contracts.type_probation")}</option>
                  <option value={t("contracts.type_fulltime") || "Chính thức"}>{t("contracts.type_fulltime")}</option>
                </>
              ) : (
                <>
                  <option value={t("contracts.type_project") || "Theo dự án"}>{t("contracts.type_project") || "Theo dự án"}</option>
                  <option value={t("contracts.type_service") || "Dịch vụ"}>{t("contracts.type_service") || "Dịch vụ"}</option>
                  <option value={t("contracts.type_seo") || "Dịch vụ SEO"}>{t("contracts.type_seo") || "Dịch vụ SEO"}</option>
                  <option value={t("contracts.type_website") || "Thiết kế website"}>{t("contracts.type_website") || "Thiết kế website"}</option>
                  <option value={t("contracts.type_marketing") || "Marketing"}>{t("contracts.type_marketing") || "Marketing"}</option>
                </>
              )}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("contracts.form_date")}</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("contracts.form_file_url") || "Link file hợp đồng"}</label>
            <input type="url" value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="https://..." className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
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

export default function ContractsPage() {
  const { t } = useTranslation()
  const { role } = useRole()
  const [activeTab, setActiveTab] = useState("employment")
  const [contracts, setContracts] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadContracts = async () => {
      try {
        const res = await fetch('/api/db?collection=contracts', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setContracts(data)
            return
          }
        }
      } catch (e) {}

      // Default mock data
      const mockData = [
        { id: "HD-001", name: "Nguyễn Văn A", type: "Chính thức", date: "15/01/2026", status: "ACTIVE", category: "employment" },
        { id: "HD-002", name: "Trần Thị B", type: "Thử việc", date: "01/06/2026", status: "PENDING", category: "employment" },
        { id: "HĐ-101", name: "Công ty Cổ phần ABC", type: "Theo dự án", date: "10/05/2026", status: "ACTIVE", category: "company" },
      ]
      setContracts(mockData)
    }

    loadContracts()
  }, [])

  const persistContracts = (updated: any[]) => {
    fetch('/api/db?collection=contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
      cache: 'no-store'
    }).catch(() => {})
  }

  const handleAddContract = (c: any) => {
    c.status = role === "DIRECTOR" ? "ACTIVE" : "PENDING"
    const updated = [c, ...contracts]
    setContracts(updated)
    persistContracts(updated)
    toast.success(t("contracts.contract_added"))
    setShowModal(false)

    // Add a notification for Director/Manager
    try {
      fetch('/api/db?collection=notifications').then(r => r.json()).then(notifs => {
        const newNotif = {
          id: String(Date.now()),
          text: `Một hợp đồng mới (${c.name}) vừa được thêm.`,
          time: "Vừa xong",
          read: false,
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
    const updated = contracts.filter(c => c.id !== id)
    setContracts(updated)
    persistContracts(updated)
    toast.success(t("common.delete") + " " + id)
    setDeleteId(null)
  }

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const updated = contracts.map(c => c.id === id ? { ...c, status: newStatus } : c)
    setContracts(updated)
    persistContracts(updated)
    toast.success(`Đã cập nhật trạng thái hợp đồng: ${newStatus}`)
  }

  const filteredContracts = contracts.filter(c => 
    c.category === activeTab && 
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">{t("contracts.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("contracts.subtitle")}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> {t("contracts.add_contract")}
          </button>
        </motion.div>
      </div>

      <div className="premium-card p-2 flex flex-col md:flex-row items-center gap-2 overflow-x-auto">
        <div className="flex p-1 bg-muted/30 rounded-xl">
          <button
            onClick={() => setActiveTab("employment")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "employment" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <FileSignature className="w-4 h-4" />
            {t("contracts.tab_employment")}
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "company" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            {t("contracts.tab_company")}
          </button>
        </div>
        <div className="relative ml-auto w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("common.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-semibold">{t("contracts.col_id")}</th>
                <th className="px-6 py-4 font-semibold">{t("contracts.col_name")}</th>
                <th className="px-6 py-4 font-semibold">{t("contracts.col_type")}</th>
                <th className="px-6 py-4 font-semibold">{t("contracts.col_date")}</th>
                <th className="px-6 py-4 font-semibold">{t("contracts.col_file") || "File"}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("contracts.col_status")}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredContracts.map((contract) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    key={contract.id} 
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold">{contract.id}</td>
                    <td className="px-6 py-4 font-semibold">{contract.name}</td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">{contract.type}</span></td>
                    <td className="px-6 py-4 font-medium">{contract.date}</td>
                    <td className="px-6 py-4">
                      {contract.fileUrl ? (
                        <a href={contract.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 font-medium">
                          <FileText className="w-4 h-4" /> Xem file
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Không có</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        contract.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                        contract.status === 'PENDING' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
                      }`}>
                        {contract.status === 'ACTIVE' ? (t("contracts.status_active") || 'Có hiệu lực') : 
                         contract.status === 'PENDING' ? (t("contracts.status_pending") || 'Chờ duyệt') : 
                         (t("contracts.status_expired") || 'Hết hạn')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {role === "DIRECTOR" && contract.status === "PENDING" && (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleUpdateStatus(contract.id, "ACTIVE")} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors" title="Duyệt">
                              Duyệt
                            </button>
                            <button onClick={() => handleUpdateStatus(contract.id, "REJECTED")} className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors" title="Từ chối">
                              Từ chối
                            </button>
                          </div>
                        )}
                        <button onClick={() => setDeleteId(contract.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredContracts.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              {t("contracts.no_contracts")}
            </div>
          )}
        </div>
      </motion.div>

      {showModal && <ContractModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleAddContract} activeTab={activeTab} />}
      {deleteId && (
        <ConfirmModal isOpen={!!deleteId} title={t("common.delete")} message="Are you sure you want to delete this contract?"
          onConfirm={() => handleDelete(deleteId!)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
