"use client"

import { useState } from "react"
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

const initialClients = [
  { id: "C001", name: "TechCorp Global", contact: "Alice Smith", email: "alice@techcorp.com", phone: "+1 234 567 890", status: "ACTIVE", value: "$45,000", lastActive: "2 giờ trước" },
  { id: "C002", name: "Innova Design", contact: "Bob Johnson", email: "bob@innova.com", phone: "+1 987 654 321", status: "LEAD", value: "$12,500", lastActive: "1 ngày trước" },
  { id: "C003", name: "Nexus Solutions", contact: "Charlie Davis", email: "charlie@nexus.com", phone: "+1 456 789 012", status: "NEGOTIATING", value: "$85,000", lastActive: "Vừa xong" },
  { id: "C004", name: "Alpha Marketing", contact: "Diana Prince", email: "diana@alpha.com", phone: "+1 321 654 098", status: "ACTIVE", value: "$24,000", lastActive: "5 ngày trước" },
  { id: "C005", name: "Omega Retail", contact: "Evan Wright", email: "evan@omega.com", phone: "+1 654 321 987", status: "INACTIVE", value: "$8,000", lastActive: "2 tháng trước" },
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
      value: value.trim() || "$0",
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
          <h2 className="text-xl font-bold">{clientToEdit ? "Cập nhật Khách hàng" : "Thêm Khách hàng mới"}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên công ty / Khách hàng *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nhập tên khách hàng" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Người liên hệ *</label>
              <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Tên người đại diện" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="090..." className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email liên hệ</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.com" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Giá trị HĐ</label>
              <input type="text" value={value} onChange={e => setValue(e.target.value)} placeholder="$10,000" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Trạng thái</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="LEAD">Lead mới</option>
              <option value="NEGOTIATING">Đang đàm phán</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Ngừng HĐ</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors">Hủy bỏ</button>
            <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              {clientToEdit ? "Cập nhật" : "Lưu Khách hàng"}
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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [clients, setClients] = useState(initialClients)
  const [showModal, setShowModal] = useState(false)
  const [clientToEdit, setClientToEdit] = useState<any | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

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
    if (clientToEdit) {
      setClients(prev => prev.map(c => c.id === saved.id ? saved : c))
      toast.success("Đã cập nhật khách hàng thành công!")
    } else {
      setClients(prev => [saved, ...prev])
      toast.success("Đã thêm khách hàng mới thành công!")
    }
    setShowModal(false)
    setClientToEdit(null)
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Khách hàng</h1>
          <p className="text-muted-foreground mt-1">Danh sách đối tác và khách hàng của Agency.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
          <button 
            onClick={() => { setClientToEdit(null); setShowModal(true) }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Thêm Khách hàng
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
              type="text" placeholder="Tìm kiếm theo tên công ty, người liên hệ..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Khách hàng / Công ty</th>
                <th className="px-6 py-4 font-semibold">Người liên hệ</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold">Giá trị HĐ</th>
                <th className="px-6 py-4 font-semibold text-right">Hành động</th>
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
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {client.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</span>
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
                            <Edit className="w-4 h-4 text-muted-foreground" /> Chỉnh sửa
                          </button>
                          <button onClick={() => { setDeleteId(client.id); setActiveMenuId(null) }}
                            className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-muted text-destructive hover:bg-destructive/10 transition-colors">
                            <Trash2 className="w-4 h-4" /> Xóa khách hàng
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredClients.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Không tìm thấy khách hàng nào.</td></tr>
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
          onConfirm={() => { setClients(prev => prev.filter(c => c.id !== deleteId)); toast.success("Đã xóa khách hàng!"); setDeleteId(null) }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
