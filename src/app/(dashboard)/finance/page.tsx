"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { 
  DollarSign, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Receipt,
  Download, Plus, X, Trash2, AlertCircle, CheckCircle2, ArrowUpCircle, ArrowDownCircle, FileText, Eye
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { useTranslation } from "@/contexts/TranslationContext"

const financeData = [
  { name: 'Tháng 1', Thu: 40000000, Chi: 24000000 },
  { name: 'Tháng 2', Thu: 30000000, Chi: 13980000 },
  { name: 'Tháng 3', Thu: 20000000, Chi: 98000000 },
  { name: 'Tháng 4', Thu: 27800000, Chi: 39080000 },
  { name: 'Tháng 5', Thu: 18900000, Chi: 48000000 },
  { name: 'Tháng 6', Thu: 23900000, Chi: 38000000 },
  { name: 'Tháng 7', Thu: 34900000, Chi: 43000000 },
]

const initialTransactions = [
  { id: "TXN-001", title: "Thanh toán hợp đồng TechCorp", type: "THU", source: "COMPANY_ACC", category: "MREX", amount: 15000000, date: "05/06/2026", note: "Thanh toán đợt 1 hợp đồng thiết kế" },
  { id: "TXN-002", title: "Chi phí quảng cáo Google", type: "CHI", source: "COMPANY_ACC", category: "MREX", amount: 4200000, date: "02/06/2026", note: "Ngân sách chiến dịch Mùa hè" },
  { id: "TXN-003", title: "Bán đơn hàng Yến sào 100g", type: "THU", source: "PERSONAL_ACC", category: "YEN", amount: 8500000, date: "28/05/2026", note: "Khách VIP" },
  { id: "TXN-004", title: "Nhập hàng sỉ Găng tay", type: "CHI", source: "PERSONAL_ACC", category: "GANG_TAY", amount: 12000000, date: "25/05/2026", note: "Chuyển khoản xưởng" },
  { id: "TXN-005", title: "Chi phí dụng cụ Live Stream", type: "CHI", source: "COMPANY_ACC", category: "LIVESTREAM", amount: 500000, date: "01/06/2026", note: "Mua đèn và mic" },
]

function TransactionModal({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (txn: any) => void }) {
  const { t } = useTranslation()
  const [title, setTitle] = useState("")
  const [type, setType] = useState("THU")
  const [source, setSource] = useState("COMPANY_ACC")
  const [category, setCategory] = useState("MREX")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [note, setNote] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !amount.trim()) { toast.error("Vui lòng nhập đầy đủ thông tin!"); return }
    
    let formattedDate = date
    if (date.includes("-")) {
      const parts = date.split("-")
      formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`
    }
    
    onSave({
      id: `TXN-${String(Date.now()).slice(-4)}`,
      title: title.trim(),
      type,
      source,
      category,
      amount: parseFloat(amount.replace(/,/g, '')) || 0,
      date: formattedDate || new Date().toLocaleDateString("vi-VN"),
      note: note.trim()
    })
    toast.success("Đã ghi nhận giao dịch mới!")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden text-foreground">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">{t("finance.new_transaction")}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("finance.description")} *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Thanh toán hợp đồng A" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("finance.type")}</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="THU">{t("finance.income")}</option>
                <option value="CHI">{t("finance.expense")}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nguồn tiền (Tài khoản)</label>
              <select value={source} onChange={e => setSource(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="COMPANY_ACC">STK Công ty</option>
                <option value="PERSONAL_ACC">STK Cá nhân</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("finance.category")}</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="MREX">MREX (Tổng công ty)</option>
              <option value="YEN">Yến sào</option>
              <option value="GANG_TAY">Găng tay</option>
              <option value="HOA_SAP">Hoa sáp</option>
              <option value="LIVESTREAM">Phòng Live Stream</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("finance.amount")} *</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="10000000" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("finance.date")}</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Ghi chú (Note)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Nhập ghi chú chi tiết cho khoản thu/chi này..." rows={3} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
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

function TransactionDetailModal({ txn, onClose }: { txn: any; onClose: () => void }) {
  if (!txn) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden text-foreground">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Chi tiết giao dịch</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <div className="text-sm text-muted-foreground">Mã GD</div>
            <div className="font-mono font-medium">{txn.id}</div>
          </div>
          <div className="flex justify-between items-center pb-4 border-b">
            <div className="text-sm text-muted-foreground">Loại</div>
            <div className={`font-bold px-2 py-0.5 rounded ${txn.type === 'THU' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'}`}>
              {txn.type === 'THU' ? 'THU (+)' : 'CHI (-)'}
            </div>
          </div>
          <div className="flex justify-between items-center pb-4 border-b">
            <div className="text-sm text-muted-foreground">Nguồn tiền</div>
            <div className="font-medium">
              {txn.source === 'COMPANY_ACC' ? 'STK Công ty' : 'STK Cá nhân'}
            </div>
          </div>
          <div className="flex justify-between items-center pb-4 border-b">
            <div className="text-sm text-muted-foreground">Mảng KD / Dự án</div>
            <div className="font-medium">
              {txn.category === 'MREX' ? 'MREX (Tổng)' :
               txn.category === 'YEN' ? 'Yến sào' :
               txn.category === 'GANG_TAY' ? 'Găng tay' :
               txn.category === 'HOA_SAP' ? 'Hoa sáp' :
               txn.category === 'LIVESTREAM' ? 'Phòng Live Stream' : 'Khác'}
            </div>
          </div>
          <div className="flex justify-between items-center pb-4 border-b">
            <div className="text-sm text-muted-foreground">Số tiền</div>
            <div className="font-bold text-lg">{txn.amount.toLocaleString('vi-VN')} VNĐ</div>
          </div>
          <div className="flex justify-between items-center pb-4 border-b">
            <div className="text-sm text-muted-foreground">Ngày GD</div>
            <div className="font-medium">{txn.date}</div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="text-sm text-muted-foreground">Nội dung</div>
            <div className="font-medium bg-muted/30 p-3 rounded-lg">{txn.title}</div>
          </div>
          {txn.note && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Ghi chú</div>
              <div className="text-sm bg-muted/30 p-3 rounded-lg italic">"{txn.note}"</div>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-muted/10 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">Đóng</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function FinancePage() {
  const { t } = useTranslation()
  const [transactions, setTransactions] = useState(initialTransactions)
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filterSource, setFilterSource] = useState("ALL")
  const [filterCategory, setFilterCategory] = useState("ALL")
  const [filterTime, setFilterTime] = useState("ALL")
  const [selectedTxn, setSelectedTxn] = useState<any>(null)

  useEffect(() => {
    fetch('/api/db?collection=finance', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setTransactions(data) })
      .catch(() => {})
  }, [])

  const saveTransactions = async (updated: any[]) => {
    try {
      await fetch('/api/db?collection=finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
    } catch {}
  }

  const handleAddTransaction = (txn: any) => {
    const updated = [txn, ...transactions]
    setTransactions(updated)
    saveTransactions(updated)
  }

  const parseDate = (dateStr: string) => {
    const parts = dateStr.split("/")
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
    }
    return new Date()
  }

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const currentQuarter = Math.floor(currentMonth / 3)

  const filteredTransactions = transactions.filter(t => {
    if (filterSource !== "ALL" && t.source !== filterSource) return false
    if (filterCategory !== "ALL" && t.category !== filterCategory) return false
    
    if (filterTime === "ALL") return true
    
    const tDate = parseDate(t.date)
    if (filterTime === "TODAY") {
      return tDate.getDate() === now.getDate() && tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear
    }
    if (filterTime === "THIS_MONTH") {
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear
    }
    if (filterTime === "THIS_QUARTER") {
      return Math.floor(tDate.getMonth() / 3) === currentQuarter && tDate.getFullYear() === currentYear
    }
    return true
  })

  // Calculate totals from filtered transactions
  const totalThu = filteredTransactions.filter(t => t.type === "THU").reduce((acc, curr) => acc + curr.amount, 0)
  const totalChi = filteredTransactions.filter(t => t.type === "CHI").reduce((acc, curr) => acc + curr.amount, 0)
  const profit = totalThu - totalChi

  const handleExportReport = () => {
    try {
      // Create CSV content with headers
      const headers = ["Mã GD", "Nguồn tiền", "Mảng KD", "Loại", "Nội dung/Đối tác", "Số tiền (VNĐ)", "Ngày", "Ghi chú"]
      const csvContent = [
        headers.join(","),
        ...filteredTransactions.map(t => 
          `"${t.id}","${t.source === 'COMPANY_ACC' ? 'STK Công ty' : 'STK Cá nhân'}","${t.category === 'MREX' ? 'MREX' : t.category === 'YEN' ? 'Yến' : t.category === 'GANG_TAY' ? 'Găng tay' : t.category === 'HOA_SAP' ? 'Hoa sáp' : t.category === 'LIVESTREAM' ? 'Live Stream' : 'Khác'}","${t.type}","${t.title}","${t.amount}","${t.date}","${t.note || ''}"`
        )
      ].join("\n")

      // Add UTF-8 BOM for Excel compatibility
      const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `BaoCao_TaiChinh_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Đã xuất báo cáo CSV thành công!")
    } catch (error) {
      toast.error("Lỗi khi xuất báo cáo")
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">{t("finance.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("finance.subtitle")}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
          <button onClick={handleExportReport}
            className="flex items-center gap-2 bg-card border px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors shadow-sm">
            <Download className="w-4 h-4" /> {t("dashboard.download_report")}
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> {t("finance.add_transaction")}
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t("finance.total_revenue")}</h3>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/30"><ArrowUpRight className="w-5 h-5" /></div>
          </div>
          <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{totalThu.toLocaleString('vi-VN')} VNĐ</h2>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center mt-2 font-medium">+12.5% so với tháng trước</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t("finance.total_expenses")}</h3>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center dark:bg-rose-900/30"><ArrowDownRight className="w-5 h-5" /></div>
          </div>
          <h2 className="text-3xl font-bold text-rose-600 dark:text-rose-400">{totalChi.toLocaleString('vi-VN')} VNĐ</h2>
          <p className="text-sm text-rose-600 dark:text-rose-400 flex items-center mt-2 font-medium">+4.1% so với tháng trước</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t("finance.net_profit")}</h3>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center dark:bg-blue-900/30"><Wallet className="w-5 h-5" /></div>
          </div>
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{profit.toLocaleString('vi-VN')} VNĐ</h2>
          <p className="text-sm text-muted-foreground flex items-center mt-2">{t("finance.profit_margin")}: {totalThu > 0 ? Math.round((profit/totalThu)*100) : 0}%</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t("finance.transaction_list")}</h3>
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center dark:bg-orange-900/30"><FileText className="w-5 h-5" /></div>
          </div>
          <h2 className="text-3xl font-bold text-orange-600 dark:text-orange-400">{transactions.length}</h2>
          <p className="text-sm text-muted-foreground flex items-center mt-2">Giao dịch đã được ghi nhận</p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-6 mt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="premium-card p-6 min-h-[400px]">
          <h2 className="text-lg font-semibold mb-6">Tổng kết tháng (Cash Flow)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{fill: 'hsl(var(--muted)/0.4)'}}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Thu" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Chi" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="premium-card overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-6 border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold">{t("finance.transaction_list")}</h2>
            <div className="flex items-center gap-2">
              <select value={filterTime} onChange={e => setFilterTime(e.target.value)} className="text-xs bg-muted border-none rounded-lg px-2 py-1.5 font-medium focus:ring-0 cursor-pointer outline-none w-full sm:w-auto">
                <option value="ALL">Mọi thời gian</option>
                <option value="TODAY">Hôm nay</option>
                <option value="THIS_MONTH">Tháng này</option>
                <option value="THIS_QUARTER">Quý này</option>
              </select>
              <select value={filterSource} onChange={e => setFilterSource(e.target.value)} className="text-xs bg-muted border-none rounded-lg px-2 py-1.5 font-medium focus:ring-0 cursor-pointer outline-none w-full sm:w-auto">
                <option value="ALL">Mọi nguồn tiền</option>
                <option value="COMPANY_ACC">STK Công ty</option>
                <option value="PERSONAL_ACC">STK Cá nhân</option>
              </select>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="text-xs bg-muted border-none rounded-lg px-2 py-1.5 font-medium focus:ring-0 cursor-pointer outline-none w-full sm:w-auto">
                <option value="ALL">Mọi mảng KD</option>
                <option value="MREX">MREX</option>
                <option value="YEN">Yến sào</option>
                <option value="GANG_TAY">Găng tay</option>
                <option value="HOA_SAP">Hoa sáp</option>
                <option value="LIVESTREAM">Live Stream</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">{t("finance.no_transactions")}</div>
            ) : filteredTransactions.map((txn) => (
              <div key={txn.id} onClick={() => setSelectedTxn(txn)} className="p-3 sm:p-4 rounded-xl border bg-card hover:border-primary/30 transition-colors flex items-start justify-between group cursor-pointer gap-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    txn.type === 'THU' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'
                  }`}>
                    {txn.type === 'THU' ? <ArrowUpCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowDownCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm truncate" title={txn.title}>{txn.title}</h4>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      <span>{txn.id} • {txn.date}</span>
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        <span className={`px-1.5 py-[1px] rounded text-[9px] font-bold border whitespace-nowrap ${txn.source === 'COMPANY_ACC' ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                          {txn.source === 'COMPANY_ACC' ? 'CÔNG TY' : 'CÁ NHÂN'}
                        </span>
                        <span className={`px-1.5 py-[1px] rounded text-[9px] font-bold border whitespace-nowrap ${
                          txn.category === 'MREX' ? 'border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300' : 
                          txn.category === 'YEN' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                          txn.category === 'GANG_TAY' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          txn.category === 'HOA_SAP' ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400' :
                          txn.category === 'LIVESTREAM' ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' :
                          'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {txn.category === 'MREX' ? 'MREX' : txn.category === 'YEN' ? 'YẾN SÀO' : txn.category === 'GANG_TAY' ? 'GĂNG TAY' : txn.category === 'HOA_SAP' ? 'HOA SÁP' : txn.category === 'LIVESTREAM' ? 'LIVE STREAM' : 'KHÁC'}
                        </span>
                      </div>
                    </div>
                    {txn.note && (
                      <div className="text-xs text-muted-foreground mt-1.5 bg-muted/50 p-2 rounded-r-md rounded-l-sm italic border-l-4 border-primary/50 line-clamp-1">
                        "{txn.note}"
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right flex items-start gap-2 shrink-0">
                  <div>
                    <div className={`font-bold text-sm ${txn.type === 'THU' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {txn.type === 'THU' ? '+' : '-'}{txn.amount.toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end ml-2">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedTxn(txn) }}
                      className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all mt-[-4px]" title="Xem chi tiết">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(txn.id) }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all" title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {showModal && <TransactionModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleAddTransaction} />}
      {selectedTxn && <TransactionDetailModal txn={selectedTxn} onClose={() => setSelectedTxn(null)} />}
      {deleteId && (
        <ConfirmModal isOpen={!!deleteId} title="Xóa giao dịch" message="Bạn có chắc chắn muốn xóa giao dịch này?"
          onConfirm={() => { const updated = transactions.filter(i => i.id !== deleteId); setTransactions(updated); saveTransactions(updated); toast.success("Đã xóa giao dịch!"); setDeleteId(null); setSelectedTxn(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
