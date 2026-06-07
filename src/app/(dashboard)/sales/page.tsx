"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Plus, MoreHorizontal, MessageCircle, Phone, Calendar as CalendarIcon, X, ChevronRight, Trash2, AlertCircle } from "lucide-react"

const pipelineStages = [
  { id: "s1", name: "Lead Mới", color: "bg-blue-500" },
  { id: "s2", name: "Đã liên hệ", color: "bg-purple-500" },
  { id: "s3", name: "Đàm phán", color: "bg-orange-500" },
  { id: "s4", name: "Chốt thành công", color: "bg-emerald-500" },
]

const initialLeads = [
  { id: "L1", stage: "s1", company: "NextGen Tech", value: "$12,000", contact: "John Doe", date: "Hôm nay" },
  { id: "L2", stage: "s1", company: "Alpha Retail", value: "$8,500", contact: "Sarah Jane", date: "Hôm qua" },
  { id: "L3", stage: "s1", company: "Beta Solutions", value: "$4,200", contact: "Mike Ross", date: "2 ngày trước" },
  { id: "L4", stage: "s2", company: "Innova Group", value: "$15,000", contact: "Emily Blunt", date: "3 ngày trước" },
  { id: "L5", stage: "s2", company: "Global Corp", value: "$25,000", contact: "Chris Evans", date: "3 ngày trước" },
  { id: "L6", stage: "s3", company: "Mega Store", value: "$45,000", contact: "Tom Holland", date: "Tuần trước" },
  { id: "L7", stage: "s3", company: "EduTech VN", value: "$18,500", contact: "Zendaya", date: "Tuần trước" },
]

function AddLeadModal({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (lead: any) => void }) {
  const [company, setCompany] = useState("")
  const [contact, setContact] = useState("")
  const [value, setValue] = useState("")
  const [stage, setStage] = useState("s1")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company.trim()) { toast.error("Vui lòng nhập tên công ty!"); return }
    onSave({
      id: `L${Date.now()}`,
      company: company.trim(),
      contact: contact.trim() || "N/A",
      value: value.trim() || "$0",
      stage,
      date: "Vừa xong"
    })
    toast.success("Đã thêm Lead mới!")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden text-foreground">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Thêm Lead mới</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên công ty *</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="VD: NextGen Tech" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Người liên hệ</label>
              <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="John Doe" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Giá trị</label>
              <input type="text" value={value} onChange={e => setValue(e.target.value)} placeholder="$10,000" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Giai đoạn</label>
            <select value={stage} onChange={e => setStage(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
              {pipelineStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors">Hủy</button>
            <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Thêm Lead</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-card w-full max-w-sm rounded-2xl border shadow-2xl p-6 space-y-4 text-foreground">
        <div className="flex items-center gap-2 text-destructive"><AlertCircle className="w-6 h-6" /><h3 className="text-lg font-bold">{title}</h3></div>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">Hủy</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors">Xác nhận</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function SalesPipelinePage() {
  const [leads, setLeads] = useState(initialLeads)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/db?collection=sales_leads', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setLeads(data) })
      .catch(() => {})
  }, [])

  const saveLeads = async (updated: any[]) => {
    try {
      await fetch('/api/db?collection=sales_leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
    } catch {}
  }

  const handleAddLead = (lead: any) => {
    const updated = [lead, ...leads]
    setLeads(updated)
    saveLeads(updated)
  }

  const handleMoveNext = (leadId: string) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const currentIdx = pipelineStages.findIndex(s => s.id === l.stage)
        if (currentIdx < pipelineStages.length - 1) {
          toast.success(`Đã chuyển "${l.company}" sang ${pipelineStages[currentIdx + 1].name}`)
          return { ...l, stage: pipelineStages[currentIdx + 1].id }
        } else {
          toast.info("Lead đã ở giai đoạn cuối cùng!")
        }
      }
      return l
    })
    setLeads(updated)
    saveLeads(updated)
  }

  const handleMovePrev = (leadId: string) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const currentIdx = pipelineStages.findIndex(s => s.id === l.stage)
        if (currentIdx > 0) {
          toast.success(`Đã chuyển "${l.company}" về ${pipelineStages[currentIdx - 1].name}`)
          return { ...l, stage: pipelineStages[currentIdx - 1].id }
        }
      }
      return l
    })
    setLeads(updated)
    saveLeads(updated)
  }

  return (
    <div className="space-y-6 pb-10 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground mt-1">Quản lý cơ hội kinh doanh và phễu khách hàng.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Thêm Lead
          </button>
        </motion.div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pt-2">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {pipelineStages.map((stage, index) => {
            const stageLeads = leads.filter(l => l.stage === stage.id)
            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}
                key={stage.id} className="w-80 flex flex-col bg-muted/30 rounded-2xl p-4 border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <h3 className="font-semibold">{stage.name}</h3>
                    <span className="bg-background text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full border">{stageLeads.length}</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {stageLeads.map((lead) => {
                    const stageIdx = pipelineStages.findIndex(s => s.id === lead.stage)
                    return (
                      <div key={lead.id} className="premium-card p-4 hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-sm group-hover:text-primary transition-colors">{lead.company}</div>
                          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{lead.value}</div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">{lead.contact}</div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                          <div className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5" /> {lead.date}</div>
                          <div className="flex gap-1.5">
                            {stageIdx > 0 && (
                              <button onClick={() => handleMovePrev(lead.id)} className="p-1 hover:bg-muted rounded transition-colors rotate-180 hover:text-primary" title="Chuyển về trước">
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {stageIdx < pipelineStages.length - 1 && (
                              <button onClick={() => handleMoveNext(lead.id)} className="p-1 hover:bg-muted rounded transition-colors hover:text-primary" title="Chuyển tiếp">
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button onClick={() => setDeleteId(lead.id)} className="p-1 hover:bg-destructive/10 rounded transition-colors text-muted-foreground hover:text-destructive" title="Xóa">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {stageLeads.length === 0 && (
                    <div className="h-24 rounded-xl border-2 border-dashed flex items-center justify-center text-sm text-muted-foreground">
                      Chưa có Lead nào
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {showAddModal && <AddLeadModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddLead} />}
      {deleteId && (
        <ConfirmModal isOpen={!!deleteId} title="Xóa Lead" message="Bạn có chắc chắn muốn xóa Lead này?"
          onConfirm={() => { const updated = leads.filter(l => l.id !== deleteId); setLeads(updated); saveLeads(updated); toast.success("Đã xóa Lead!"); setDeleteId(null) }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
