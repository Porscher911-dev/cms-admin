"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Building2,
  X,
  Edit,
  Trash2,
  MoreVertical,
  AlertCircle
} from "lucide-react"
import { useTranslation } from "@/contexts/TranslationContext"

const initialClients = [
  { id: "C001", name: "TechCorp Global", contact: "Alice Smith", email: "alice@techcorp.com", phone: "0901 234 567", status: "ACTIVE", value: "1.125.000.000 VNĐ", lastActive: "2 giờ trước" },
  { id: "C002", name: "Innova Design", contact: "Bob Johnson", email: "bob@innova.com", phone: "0987 654 321", status: "LEAD", value: "312.500.000 VNĐ", lastActive: "1 ngày trước" },
  { id: "C003", name: "Nexus Solutions", contact: "Charlie Davis", email: "charlie@nexus.com", phone: "0456 789 012", status: "NEGOTIATING", value: "2.125.000.000 VNĐ", lastActive: "Vừa xong" },
  { id: "C004", name: "Alpha Marketing", contact: "Diana Prince", email: "diana@alpha.com", phone: "0321 654 098", status: "ACTIVE", value: "600.000.000 VNĐ", lastActive: "5 ngày trước" },
  { id: "C005", name: "Omega Retail", contact: "Evan Wright", email: "evan@omega.com", phone: "0654 321 987", status: "INACTIVE", value: "200.000.000 VNĐ", lastActive: "2 tháng trước" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
    case "LEAD": return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
    case "NEGOTIATING": return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
    case "INACTIVE": return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
    default: return "bg-gray-100 text-gray-700"
  }
}
const statusLabel = (s: string) => {
  switch(s) { case "ACTIVE": return "Hoạt động"; case "LEAD": return "Lead mới"; case "NEGOTIATING": return "Đang đàm phán"; case "INACTIVE": return "Ngừng HĐ"; default: return s }
}

// Client Modal
function ClientModal({ isOpen, onClose, onSave, clientToEdit }: { isOpen: boolean; onClose: () => void; onSave: (c: any) => void; clientToEdit?: any }) {
  const { t } = useTranslation()
  const [name, setName] = useState(clientToEdit?.name || "")
  const [contact, setContact] = useState(clientToEdit?.contact || "")
  const [email, setEmail] = useState(clientToEdit?.email || "")
  const [phone, setPhone] = useState(clientToEdit?.phone || "")
  const [status, setStatus] = useState(clientToEdit?.status || "LEAD")
  const [value, setValue] = useState(clientToEdit?.value || "")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) {
      toast.error("Vui lòng nhập đầy đủ Tên công ty và Người liên hệ!")
      return
    }
    onSave({
      id: clientToEdit?.id || `C${String(Date.now()).slice(-4)}`,
      name: name.trim(),
      contact: contact.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status,
      value: value.trim() || "0 VNĐ",
      lastActive: clientToEdit?.lastActive || "Vừa xong"
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden text-foreground"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">{clientToEdit ? t("clients.edit_client") : t("clients.new_client")}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("clients.client_name")} *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t("clients.name")} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("clients.contact_person")} *</label>
              <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder={t("clients.contact")} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("clients.phone")}</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="090..." className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("clients.email")}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.com" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("clients.contract_value")}</label>
              <input type="text" value={value} onChange={e => setValue(e.target.value)} placeholder={t("clients.contract_value_placeholder")} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("clients.status")}</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="LEAD">Lead mới</option>
              <option value="NEGOTIATING">Đang đàm phán</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Ngừng HĐ</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors">{t("common.cancel")}</button>
            <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              {clientToEdit ? t("common.update") : t("common.save")}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Confirm Modal
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-card w-full max-w-sm rounded-2xl border shadow-2xl p-6 space-y-4 text-foreground">
        <div className="flex items-center gap-2 text-destructive"><AlertCircle className="w-6 h-6" /><h3 className="text-lg font-bold">{title}</h3></div>
        <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">Hủy</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors shadow-lg shadow-destructive/20">Xác nhận</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function ClientsPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [clients, setClients] = useState(initialClients)
  const [showModal, setShowModal] = useState(false)
  const [clientToEdit, setClientToEdit] = useState<any | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/db?collection=clients', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setClients(data) })
      .catch(() => {})
  }, [])

  const saveClients = async (updated: any[]) => {
    try {
      await fetch('/api/db?collection=clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
    } catch {}
  }

  const statuses = [
    { id: "ALL", label: "Tất cả" },
    { id: "ACTIVE", label: "Hoạt động" },
    { id: "LEAD", label: "Lead mới" },
    { id: "NEGOTIATING", label: "Đàm phán" },
    { id: "INACTIVE", label: "Ngừng HĐ" },
  ]

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.contact.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSaveClient = (saved: any) => {
    let updated: any[]
    if (clientToEdit) {
      updated = clients.map(c => c.id === saved.id ? saved : c)
      toast.success("Đã cập nhật khách hàng thành công!")
    } else {
      updated = [saved, ...clients]
      toast.success("Đã thêm khách hàng mới thành công!")
    }
    setClients(updated)
    setShowModal(false)
    setClientToEdit(null)
    saveClients(updated)
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">{t("clients.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("clients.subtitle")}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
          <button 
            onClick={() => { setClientToEdit(null); setShowModal(true) }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> {t("clients.add_client")}
          </button>
        </motion.div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map(s => (
          <button key={s.id} onClick={() => setStatusFilter(s.id)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${statusFilter === s.id ? "bg-primary text-primary-foreground shadow shadow-primary/20" : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border"}`}
          >{s.label}</button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="premium-card overflow-hidden">
        <div className="p-4 border-b flex items-center gap-4 bg-muted/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" placeholder={t("clients.search_placeholder")} 
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full min-w-[700px] text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-semibold">{t("clients.name")}</th>
                <th className="px-6 py-4 font-semibold">{t("clients.contact")}</th>
                <th className="px-6 py-4 font-semibold">{t("clients.status")}</th>
                <th className="px-6 py-4 font-semibold">{t("clients.value")}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredClients.map((client, index) => (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * index }} key={client.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{client.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">ID: {client.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{client.contact}</div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 whitespace-nowrap"><Mail className="w-3 h-3 shrink-0" /> {client.email}</span>
                      <span className="flex items-center gap-1 whitespace-nowrap"><Phone className="w-3 h-3 shrink-0" /> {client.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(client.status)}`}>
                      {statusLabel(client.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{client.value}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === client.id ? null : client.id) }}
                        className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {activeMenuId === client.id && (
                        <div className="absolute right-0 top-10 w-40 bg-card border rounded-lg shadow-lg py-1 z-20 text-sm text-foreground">
                          <button onClick={() => { setClientToEdit(client); setShowModal(true); setActiveMenuId(null) }}
                            className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-muted transition-colors">
                            <Edit className="w-4 h-4 text-muted-foreground" /> {t("common.edit")}
                          </button>
                          <button onClick={() => { setDeleteId(client.id); setActiveMenuId(null) }}
                            className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-muted text-destructive hover:bg-destructive/10 transition-colors">
                            <Trash2 className="w-4 h-4" /> {t("common.delete")}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredClients.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">{t("clients.no_clients")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showModal && (
        <ClientModal isOpen={showModal} onClose={() => { setShowModal(false); setClientToEdit(null) }} onSave={handleSaveClient} clientToEdit={clientToEdit} />
      )}

      {deleteId && (
        <ConfirmModal isOpen={!!deleteId} title="Xóa khách hàng" message="Bạn có chắc chắn muốn xóa khách hàng này? Hành động không thể hoàn tác."
          onConfirm={() => { const updated = clients.filter(c => c.id !== deleteId); setClients(updated); saveClients(updated); toast.success("Đã xóa khách hàng!"); setDeleteId(null) }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
