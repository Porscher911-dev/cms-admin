"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { User, Lock, Bell, Globe, Save } from "lucide-react"
import { useTheme } from "next-themes"
import { hexToHSL } from "@/lib/utils"

type SettingsTab = "profile" | "security" | "notifications" | "appearance"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile")

  // Form states
  const [name, setName] = useState("Toby Vu")
  const [phone, setPhone] = useState("0901234567")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Checkbox states
  const [emailNotif, setEmailNotif] = useState(true)
  const [taskNotif, setTaskNotif] = useState(true)
  const [reportNotif, setReportNotif] = useState(false)
  
  // Brand states
  const [brandColor, setBrandColor] = useState("#2563eb")
  const [brandLogo, setBrandLogo] = useState("")
  
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedColor = localStorage.getItem("mrex_brand_color_hex")
    if (storedColor) setBrandColor(storedColor)
    const storedLogo = localStorage.getItem("mrex_brand_logo")
    if (storedLogo) setBrandLogo(storedLogo)
  }, [])

  const handleSaveAppearance = () => {
    try {
      const hslColor = hexToHSL(brandColor)
      localStorage.setItem("mrex_brand_color", hslColor)
      localStorage.setItem("mrex_brand_color_hex", brandColor)
      if (brandLogo) {
        localStorage.setItem("mrex_brand_logo", brandLogo)
      } else {
        localStorage.removeItem("mrex_brand_logo")
      }
      // Dispatch custom event to update other components immediately
      window.dispatchEvent(new Event("themeSettingsUpdated"))
      toast.success("Đã cập nhật giao diện và logo!")
    } catch (e) {
      toast.error("Màu sắc không hợp lệ!")
    }
  }

  const handleSaveProfile = () => {
    toast.success("Đã lưu thông tin cá nhân thành công!")
  }

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ các trường mật khẩu!")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!")
      return
    }
    toast.success("Đã thay đổi mật khẩu tài khoản thành công!")
    setOldPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleSaveNotifications = () => {
    toast.success("Đã cập nhật tùy chọn nhận thông báo!")
  }

  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt Hệ thống</h1>
        <p className="text-muted-foreground mt-1">Quản lý tài khoản, bảo mật và tùy chọn cá nhân.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Sidebar Menu */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.1 }}
          className="md:col-span-1 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0"
        >
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 text-sm md:text-base ${
              activeTab === "profile" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <User className="w-5 h-5" /> Hồ sơ cá nhân
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 text-sm md:text-base ${
              activeTab === "security" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Lock className="w-5 h-5" /> Bảo mật
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 text-sm md:text-base ${
              activeTab === "notifications" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Bell className="w-5 h-5" /> Thông báo
          </button>
          <button 
            onClick={() => setActiveTab("appearance")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 text-sm md:text-base ${
              activeTab === "appearance" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Globe className="w-5 h-5" /> Hiển thị & Giao diện
          </button>
        </motion.div>

        {/* Settings Content Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.2 }}
          className="md:col-span-3 space-y-6"
        >
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="premium-card p-6">
              <h2 className="text-lg font-bold mb-4">Thông tin cá nhân</h2>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold border-4 border-card shadow-sm">
                  {name.charAt(0)}
                </div>
                <div>
                  <button 
                    onClick={() => toast.info("Tính năng tải ảnh lên đang được phát triển")}
                    className="bg-muted px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Đổi Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Họ và tên</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input 
                    type="email" 
                    value="toby.vu@mrex.agency" 
                    disabled 
                    className="w-full bg-muted/50 border rounded-lg px-4 py-2 opacity-70 cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Số điện thoại</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chức vụ</label>
                  <input 
                    type="text" 
                    value="Giám đốc điều hành" 
                    disabled 
                    className="w-full bg-muted/50 border rounded-lg px-4 py-2 opacity-70 cursor-not-allowed" 
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4" /> Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="premium-card p-6">
              <h2 className="text-lg font-bold mb-4">Mật khẩu & Bảo mật</h2>
              <form onSubmit={handleSaveSecurity} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mật khẩu cũ</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Xác nhận mật khẩu mới</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    <Save className="w-4 h-4" /> Đổi mật khẩu
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="premium-card p-6">
              <h2 className="text-lg font-bold mb-4">Cấu hình thông báo</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm">Thông báo qua Email</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Gửi email khi có yêu cầu phê duyệt mới hoặc tài liệu được ký.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={emailNotif}
                    onChange={(e) => setEmailNotif(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm">Cập nhật công việc (Task updates)</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Nhận thông báo khi có người bình luận hoặc hoàn thành task được giao.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={taskNotif}
                    onChange={(e) => setTaskNotif(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm">Nhắc nhở báo cáo ngày</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Nhận thông báo nhắc gửi báo cáo ngày vào lúc 17h00 hàng ngày.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={reportNotif}
                    onChange={(e) => setReportNotif(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleSaveNotifications}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4" /> Lưu cấu hình
                </button>
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <div className="premium-card p-6">
              <h2 className="text-lg font-bold mb-4">Hiển thị & Giao diện</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm">Chế độ tối (Dark Mode)</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Tự động điều chỉnh giao diện sáng tối theo cấu hình hệ thống.</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    {mounted && (
                      <input 
                        type="checkbox" 
                        name="toggle" 
                        id="toggleDarkMode" 
                        checked={theme === "dark"}
                        onChange={(e) => {
                          setTheme(e.target.checked ? "dark" : "light")
                          toast.success(`Đã chuyển sang chế độ ${e.target.checked ? "Tối" : "Sáng"}`)
                        }}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                      />
                    )}
                    <label htmlFor="toggleDarkMode" className="toggle-label block overflow-hidden h-6 rounded-full bg-primary cursor-pointer"></label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm">Ngôn ngữ mặc định</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Ngôn ngữ hệ thống hiển thị (Bạn cũng có thể thay đổi nhanh tại header).</p>
                  </div>
                  <select className="bg-muted border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="vi">Tiếng Việt (VI)</option>
                    <option value="en">English (EN)</option>
                  </select>
                </div>

                <div className="p-4 border rounded-xl space-y-4">
                  <h4 className="font-semibold text-sm">Thương hiệu Công ty</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Màu sắc chủ đạo (Hex)</label>
                      <div className="flex gap-3 items-center">
                        <input 
                          type="color" 
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                        />
                        <input 
                          type="text" 
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                          placeholder="#000000"
                          className="bg-muted border rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 flex-1 max-w-[120px]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">URL Logo Công ty</label>
                      <input 
                        type="text" 
                        value={brandLogo}
                        onChange={(e) => setBrandLogo(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full bg-muted border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">Để trống nếu muốn sử dụng logo mặc định của hệ thống.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleSaveAppearance}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4" /> Lưu cấu hình
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked { right: 0; border-color: hsl(var(--primary)); }
        .toggle-checkbox:checked + .toggle-label { background-color: hsl(var(--primary)); }
        .toggle-checkbox { right: 24px; z-index: 1; border-color: #e2e8f0; transition: all 0.3s; }
        .toggle-label { background-color: #cbd5e1; transition: all 0.3s; }
      `}} />
    </div>
  )
}
