"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { ShieldAlert, Users, Search, Plus, UserPlus, X, MoreVertical, CheckCircle2, Lock, Edit, Trash2, AlertCircle, Unlock } from "lucide-react"
import { useRole } from "@/components/providers/role-provider"

const initialUsers = [
  { id: "U001", name: "Toby Vu", email: "toby.vu@mrex.agency", role: "DIRECTOR", department: "Board of Directors", status: "ACTIVE" },
  { id: "U002", name: "Alice Smith", email: "alice@mrex.agency", role: "MANAGER", department: "Marketing", status: "ACTIVE" },
  { id: "U003", name: "Bob Johnson", email: "bob@mrex.agency", role: "EMPLOYEE", department: "Design", status: "ACTIVE" },
  { id: "U004", name: "Charlie Davis", email: "charlie@mrex.agency", role: "EMPLOYEE", department: "SEO", status: "LOCKED" },
  { id: "U005", name: "Diana Prince", email: "diana@mrex.agency", role: "MANAGER", department: "Sales", status: "ACTIVE" },
]

const getRoleColor = (role: string) => {
  switch (role) {
    case "DIRECTOR": return "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
    case "MANAGER": return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
    case "EMPLOYEE": return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
    default: return "bg-gray-100 text-gray-700"
  }
}

function CreateAccountModal({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (u: any) => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("EMPLOYEE")
  const [department, setDepartment] = useState("Marketing")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { toast.error("Vui lòng nhập đầy đủ họ tên và email!"); return }
    onSave({
      id: `U${String(Date.now()).slice(-4)}`,
      name: name.trim(), email: email.trim(), role, department, status: "ACTIVE"
    })
    toast.success("Đã tạo tài khoản và gửi Email cấp phép thành công!")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-rose-100 overflow-hidden text-foreground">
        <div className="flex items-center justify-between p-6 border-b bg-rose-50/30 dark:bg-rose-950/10">
          <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus className="w-5 h-5 text-rose-600" /> Cấp Tài khoản Mới</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Họ và tên nhân viên *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn A" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/50" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email đăng nhập (Tài khoản) *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="a.nguyen@mrex.agency" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/50" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mật khẩu khởi tạo</label>
            <input type="text" defaultValue="Mrex@2026" className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
            <p className="text-xs text-muted-foreground">Nhân viên sẽ được yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phân quyền (Role)</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-sm">
                <option value="EMPLOYEE">Nhân viên (Employee)</option>
                <option value="MANAGER">Quản lý (Manager)</option>
                <option value="DIRECTOR">Giám đốc (Director)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phòng ban</label>
              <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-sm">
                <option>Marketing</option><option>Design</option><option>Sales</option><option>Nhân sự (HR)</option><option>SEO</option><option>Content</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors">Hủy bỏ</button>
            <button type="submit" className="bg-rose-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-700 transition-colors shadow-lg shadow-rose-500/20 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tạo Tài khoản
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function EditUserModal({ isOpen, onClose, onSave, user }: { isOpen: boolean; onClose: () => void; onSave: (u: any) => void; user: any }) {
  const [role, setRole] = useState(user?.role || "EMPLOYEE")
  const [department, setDepartment] = useState(user?.department || "")

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden text-foreground">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2"><Edit className="w-5 h-5 text-primary" /> Chỉnh sửa — {user.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Phân quyền (Role)</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
              <option value="EMPLOYEE">Nhân viên (Employee)</option>
              <option value="MANAGER">Quản lý (Manager)</option>
              <option value="DIRECTOR">Giám đốc (Director)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phòng ban</label>
            <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
              <option>Marketing</option><option>Design</option><option>Sales</option><option>Nhân sự (HR)</option><option>SEO</option><option>Content</option><option>Board of Directors</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button onClick={onClose} className="px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors">Hủy</button>
            <button onClick={() => { onSave({ ...user, role, department }); toast.success(`Đã cập nhật quyền cho ${user.name}`); onClose() }}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Lưu thay đổi</button>
          </div>
        </div>
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

export default function AdminUsersPage() {
  const { role } = useRole()
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editUser, setEditUser] = useState<any | null>(null)

  if (role !== "DIRECTOR") {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4"><ShieldAlert className="w-10 h-10" /></div>
        <h1 className="text-3xl font-bold text-foreground">Truy cập bị từ chối</h1>
        <p className="text-muted-foreground max-w-md">Chỉ có Ban Giám Đốc (DIRECTOR) mới có quyền truy cập vào trang Quản trị Hệ thống.</p>
      </div>
    )
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = (u: any) => { setUsers(prev => [u, ...prev]) }

  const handleToggleLock = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const newStatus = u.status === "LOCKED" ? "ACTIVE" : "LOCKED"
        toast.success(`Đã ${newStatus === "LOCKED" ? "khóa" : "mở khóa"} tài khoản ${u.name}`)
        return { ...u, status: newStatus }
      }
      return u
    }))
    setActiveMenuId(null)
  }

  const handleEditSave = (u: any) => {
    setUsers(prev => prev.map(existing => existing.id === u.id ? u : existing))
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight text-rose-600 flex items-center gap-2">
            <ShieldAlert className="w-8 h-8" /> Quản trị Hệ thống
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý tài khoản và phân quyền truy cập nhân sự.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors shadow-lg shadow-rose-500/20">
            <UserPlus className="w-4 h-4" /> Tạo Tài khoản mới
          </button>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="premium-card overflow-hidden border-rose-100 shadow-sm">
        <div className="p-4 border-b flex items-center justify-between gap-4 bg-rose-50/50 dark:bg-rose-950/10">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-semibold"><Users className="w-5 h-5" /> Danh sách Nhân sự ({users.length})</div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Tìm kiếm Email hoặc Tên..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-semibold">Nhân viên</th>
                <th className="px-6 py-4 font-semibold">Phân quyền (Role)</th>
                <th className="px-6 py-4 font-semibold">Phòng ban</th>
                <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        user.status === 'LOCKED' ? 'bg-gray-200 text-gray-500 dark:bg-gray-700' : 'bg-primary/10 text-primary'
                      }`}>{user.name.charAt(0)}</div>
                      <div>
                        <div className="font-semibold text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wider ${getRoleColor(user.role)}`}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-muted-foreground">{user.department}</td>
                  <td className="px-6 py-4 text-center">
                    {user.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        <Lock className="w-3.5 h-3.5" /> Đã Khóa
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === user.id ? null : user.id) }}
                        className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {activeMenuId === user.id && (
                        <div className="absolute right-0 top-10 w-48 bg-card border rounded-lg shadow-lg py-1 z-20 text-sm text-foreground">
                          <button onClick={() => { setEditUser(user); setActiveMenuId(null) }}
                            className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-muted transition-colors">
                            <Edit className="w-4 h-4 text-muted-foreground" /> Chỉnh sửa Role
                          </button>
                          <button onClick={() => handleToggleLock(user.id)}
                            className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-muted transition-colors">
                            {user.status === "LOCKED" ? <><Unlock className="w-4 h-4 text-emerald-600" /> Mở khóa</> : <><Lock className="w-4 h-4 text-orange-600" /> Khóa tài khoản</>}
                          </button>
                          <button onClick={() => { setDeleteId(user.id); setActiveMenuId(null) }}
                            className="flex items-center gap-2 px-3 py-2 w-full text-left text-destructive hover:bg-destructive/10 transition-colors">
                            <Trash2 className="w-4 h-4" /> Xóa tài khoản
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showAddModal && <CreateAccountModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddUser} />}
      {editUser && <EditUserModal isOpen={!!editUser} onClose={() => setEditUser(null)} onSave={handleEditSave} user={editUser} />}
      {deleteId && (
        <ConfirmModal isOpen={!!deleteId} title="Xóa tài khoản" message="Bạn có chắc chắn muốn xóa tài khoản này? Hành động không thể hoàn tác."
          onConfirm={() => { setUsers(prev => prev.filter(u => u.id !== deleteId)); toast.success("Đã xóa tài khoản!"); setDeleteId(null) }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
