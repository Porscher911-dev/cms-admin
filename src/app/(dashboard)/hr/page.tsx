"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { 
  Users, UserPlus, Clock, CalendarCheck, MoreVertical,
  Mail, Phone, Briefcase, Search, Edit, Trash2, X, AlertCircle
} from "lucide-react"

const initialEmployees = [
  { id: "E00", name: "Quản trị viên", role: "Administrator", systemRole: "DIRECTOR", department: "BOD", email: "admin@mrex.vn", phone: "0362777763", cccd: "", address: "", status: "ACTIVE", attendance: "100%", tasksCompleted: 0, tasksDelayed: 0 }
]

const evaluatePerformance = (completed: number, delayed: number) => {
  if (completed === 0) return { label: "Chưa đánh giá", color: "text-muted-foreground bg-muted" }
  const onTimeRate = (completed - delayed) / completed
  if (onTimeRate >= 0.95 && delayed === 0) return { label: "Xuất sắc", color: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" }
  if (onTimeRate >= 0.85) return { label: "Tốt", color: "text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" }
  if (onTimeRate >= 0.70) return { label: "Khá", color: "text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400" }
  return { label: "Cần cải thiện", color: "text-destructive bg-destructive/10 dark:bg-destructive/20 dark:text-red-400" }
}

function EmployeeModal({ isOpen, onClose, onSave, empToEdit }: { isOpen: boolean; onClose: () => void; onSave: (e: any) => void; empToEdit?: any }) {
  const [name, setName] = useState(empToEdit?.name || "")
  const [role, setRole] = useState(empToEdit?.role || "")
  const [department, setDepartment] = useState(empToEdit?.department || "")
  const [email, setEmail] = useState(empToEdit?.email || "")
  const [phone, setPhone] = useState(empToEdit?.phone || "")
  const [cccd, setCccd] = useState(empToEdit?.cccd || "")
  const [address, setAddress] = useState(empToEdit?.address || "")
  const [status, setStatus] = useState(empToEdit?.status || "ACTIVE")
  const [systemRole, setSystemRole] = useState(empToEdit?.systemRole || "EMPLOYEE")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !role.trim()) { toast.error("Vui lòng nhập đầy đủ Họ tên và Vị trí!"); return }
    if (!email.trim()) { toast.error("Vui lòng nhập Email!"); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) { toast.error("Email không hợp lệ!"); return }
    if (phone.trim() && !/^(0|\+84)[0-9]{8,10}$/.test(phone.trim())) { toast.error("Số điện thoại không hợp lệ! (VD: 0901234567)"); return }
    onSave({
      id: empToEdit?.id || `E${String(Date.now()).slice(-3)}`,
      name: name.trim(), role: role.trim(), department: department.trim(),
      systemRole, cccd: cccd.trim(), address: address.trim(),
      email: email.trim(), phone: phone.trim(), status,
      attendance: empToEdit?.attendance || "0%",
      tasksCompleted: empToEdit?.tasksCompleted || 0,
      tasksDelayed: empToEdit?.tasksDelayed || 0,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden text-foreground">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus className="w-5 h-5 text-primary" />{empToEdit ? "Cập nhật Nhân viên" : "Thêm Nhân viên mới"}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Họ và tên *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn A" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vị trí / Chức vụ *</label>
              <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="SEO Specialist" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phòng ban</label>
              <input type="text" value={department} onChange={e => setDepartment(e.target.value)} placeholder="Marketing" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email (Tài khoản) *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="a@mrex.agency" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0901234567" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Số CCCD / CMND</label>
              <input type="text" value={cccd} onChange={e => setCccd(e.target.value)} placeholder="079..." className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Địa chỉ thường trú</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Số nhà, đường, phường, quận..." className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="ACTIVE">Đang làm việc</option>
                <option value="ON_LEAVE">Nghỉ phép</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phân quyền (Quyền hệ thống)</label>
              <select value={systemRole} onChange={e => setSystemRole(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="EMPLOYEE">Nhân viên (Thường)</option>
                <option value="MANAGER">Quản lý (Duyệt đơn/Giao việc)</option>
                <option value="DIRECTOR">Ban Giám đốc (Toàn quyền)</option>
              </select>
            </div>
          </div>
          {!empToEdit && (
            <div className="bg-primary/5 text-primary border border-primary/20 rounded-lg p-3 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Lưu ý:</strong> Khi thêm nhân viên, hệ thống sẽ tự động tạo tài khoản đăng nhập dựa trên <strong>Email</strong> và cấp quyền truy cập vào hệ thống với mật khẩu mặc định là <code>Mrex@2026</code>.
              </div>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors">Hủy</button>
            <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              {empToEdit ? "Cập nhật" : "Thêm Nhân viên"}
            </button>
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

export default function HRPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [empToEdit, setEmpToEdit] = useState<any | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const res = await fetch('/api/employees', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setEmployees(data)
        } else {
          setEmployees(initialEmployees)
        }
      } catch (e) {
        setEmployees(initialEmployees)
      }
    }
    loadEmployees()
  }, [])

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeCount = employees.filter(e => e.status === "ACTIVE").length
  const leaveCount = employees.filter(e => e.status === "ON_LEAVE").length

  const handleSaveEmployee = async (saved: any) => {
    let newEmployees;
    if (empToEdit) {
      newEmployees = employees.map(e => e.id === saved.id ? saved : e)
      toast.success("Đã cập nhật thông tin nhân viên!")
    } else {
      newEmployees = [saved, ...employees]
      toast.success("Đã thêm nhân viên mới!")
    }
    setEmployees(newEmployees)
    setShowModal(false)
    setEmpToEdit(null)
    
    // Save to global database
    try {
      await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployees),
        cache: 'no-store'
      })
    } catch(e) {}
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Nhân sự & Hệ thống</h1>
          <p className="text-muted-foreground mt-1">Danh sách nhân viên, thông tin tài khoản và chấm công.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <button onClick={() => { setEmpToEdit(null); setShowModal(true) }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            <UserPlus className="w-4 h-4" /> Thêm Nhân viên
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center dark:bg-blue-900/30"><Users className="w-6 h-6" /></div>
          <div><p className="text-sm text-muted-foreground font-medium">Tổng Nhân sự</p><h3 className="text-2xl font-bold">{employees.length}</h3></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/30"><CalendarCheck className="w-6 h-6" /></div>
          <div><p className="text-sm text-muted-foreground font-medium">Đi làm hôm nay</p><h3 className="text-2xl font-bold">{activeCount}</h3></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center dark:bg-orange-900/30"><Clock className="w-6 h-6" /></div>
          <div><p className="text-sm text-muted-foreground font-medium">Nghỉ phép</p><h3 className="text-2xl font-bold">{leaveCount}</h3></div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="premium-card overflow-hidden">
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between gap-4">
          <h2 className="font-semibold text-lg">Danh sách Nhân sự</h2>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Tìm kiếm nhân viên..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full min-w-[800px] text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Nhân viên</th>
                <th className="px-6 py-4 font-semibold">Liên hệ</th>
                <th className="px-6 py-4 font-semibold">Phòng ban / Vị trí</th>
                <th className="px-6 py-4 font-semibold text-center">Tỷ lệ đi làm</th>
                <th className="px-6 py-4 font-semibold text-center">Task (Xong / Trễ)</th>
                <th className="px-6 py-4 font-semibold text-center">Hiệu suất</th>
                <th className="px-6 py-4 font-semibold text-right">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{emp.name.charAt(0)}</div>
                      <div>
                        <div className="font-semibold text-foreground">{emp.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-muted-foreground" /> {emp.email}</div>
                      <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground" /> {emp.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-primary" /> {emp.department}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      {emp.role} 
                      {emp.systemRole && (
                        <span className={`px-1.5 py-[1px] rounded text-[9px] font-bold ${
                          emp.systemRole === 'DIRECTOR' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                          emp.systemRole === 'MANAGER' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {emp.systemRole === 'DIRECTOR' ? 'GIÁM ĐỐC' : emp.systemRole === 'MANAGER' ? 'QUẢN LÝ' : 'NHÂN VIÊN'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{emp.attendance}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-sm">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold" title="Task hoàn thành">{emp.tasksCompleted}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-destructive font-bold" title="Task trễ deadline">{emp.tasksDelayed}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {(() => {
                      const perf = evaluatePerformance(emp.tasksCompleted, emp.tasksDelayed)
                      return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${perf.color}`}>{perf.label}</span>
                    })()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${emp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                      {emp.status === 'ACTIVE' ? 'Đang làm việc' : 'Nghỉ phép'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === emp.id ? null : emp.id) }}
                        className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {activeMenuId === emp.id && (
                        <div className="absolute right-0 top-10 w-40 bg-card border rounded-lg shadow-lg py-1 z-20 text-sm text-foreground">
                          <button onClick={() => { setEmpToEdit(emp); setShowModal(true); setActiveMenuId(null) }}
                            className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-muted transition-colors">
                            <Edit className="w-4 h-4 text-muted-foreground" /> Chỉnh sửa
                          </button>
                          <button onClick={() => { setDeleteId(emp.id); setActiveMenuId(null) }}
                            className="flex items-center gap-2 px-3 py-2 w-full text-left text-destructive hover:bg-destructive/10 transition-colors">
                            <Trash2 className="w-4 h-4" /> Xóa nhân viên
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">Không tìm thấy nhân viên nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showModal && <EmployeeModal isOpen={showModal} onClose={() => { setShowModal(false); setEmpToEdit(null) }} onSave={handleSaveEmployee} empToEdit={empToEdit} />}
      {deleteId && (
        <ConfirmModal isOpen={!!deleteId} title="Xóa nhân viên" message="Bạn có chắc chắn muốn xóa nhân viên này? Hành động không thể hoàn tác."
          onConfirm={async () => { 
            const newEmployees = employees.filter(e => e.id !== deleteId);
            setEmployees(newEmployees);
            
            try {
              await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEmployees)
              })
            } catch(e) {}

            toast.success("Đã xóa nhân viên!"); 
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
