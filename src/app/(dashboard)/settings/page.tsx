"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { User, Lock, Bell, Globe, Save, Camera, X } from "lucide-react"
import { useTheme } from "next-themes"
import { hexToHSL } from "@/lib/utils"
import { useTranslation } from "@/contexts/TranslationContext"
import { useRole } from "@/components/providers/role-provider"

type SettingsTab = "profile" | "security" | "notifications" | "appearance"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile")

  const { t, locale, setLocale } = useTranslation()
  const { role, userProfile, setUserProfile } = useRole()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [avatar, setAvatar] = useState("") // base64 string
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // Checkbox states
  const [emailNotif, setEmailNotif] = useState(true)
  const [taskNotif, setTaskNotif] = useState(true)
  const [reportNotif, setReportNotif] = useState(false)
  
  // Brand states
  const [brandColor, setBrandColor] = useState("#2563eb")
  const [brandLogo, setBrandLogo] = useState("")
  const [companyName, setCompanyName] = useState("MRex Agency")
  const [brandBanner, setBrandBanner] = useState("")
  
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name)
      setPhone(userProfile.phone)
      setEmail(userProfile.email)
      setJobTitle(userProfile.jobTitle)
      setAvatar(userProfile.avatar)
    }
  }, [userProfile])

  useEffect(() => {
    setMounted(true)
    const storedColor = localStorage.getItem("mrex_brand_color_hex")
    if (storedColor) setBrandColor(storedColor)
    const storedLogo = localStorage.getItem("mrex_brand_logo")
    if (storedLogo) setBrandLogo(storedLogo)
    const storedName = localStorage.getItem("mrex_company_name")
    if (storedName) setCompanyName(storedName)
    const storedBanner = localStorage.getItem("mrex_brand_banner")
    if (storedBanner) setBrandBanner(storedBanner)

    // Bug #11: Load notification settings from DB
    fetch('/api/db?collection=notification_settings', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          if (typeof data.emailNotif === 'boolean') setEmailNotif(data.emailNotif)
          if (typeof data.taskNotif === 'boolean') setTaskNotif(data.taskNotif)
          if (typeof data.reportNotif === 'boolean') setReportNotif(data.reportNotif)
        }
      })
      .catch(() => {})
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
      
      if (companyName) {
        localStorage.setItem("mrex_company_name", companyName)
      } else {
        localStorage.removeItem("mrex_company_name")
      }

      if (brandBanner) {
        localStorage.setItem("mrex_brand_banner", brandBanner)
      } else {
        localStorage.removeItem("mrex_brand_banner")
      }
      // Dispatch custom event to update other components immediately
      window.dispatchEvent(new Event("themeSettingsUpdated"))
      toast.success(t("settings.appearance_saved"))
    } catch (e) {
      toast.error(t("settings.color_invalid"))
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Resize image using canvas to avoid large base64 strings
    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 200
        const MAX_HEIGHT = 200
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8)
        
        setAvatar(resizedBase64)
        toast.success(t("settings.avatar_selected"))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    try {
      await fetch(`/api/db?collection=user_profile_${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, jobTitle, avatar }),
        cache: 'no-store'
      })
      setUserProfile({ name, phone, email, jobTitle, avatar })
      window.dispatchEvent(new Event("profileUpdated"))
      toast.success(t("settings.profile_saved"))
    } catch (e) {
      toast.error(t("settings.profile_error"))
    }
  }

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error(t("settings.password_empty_error"))
      return
    }
    if (newPassword.length < 6) {
      toast.error(t("settings.password_length_error"))
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("settings.password_mismatch_error"))
      return
    }
    try {
      // Verify old password against stored one
      const res = await fetch(`/api/db?collection=user_password_${role}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (data && data.password && data.password !== oldPassword) {
          toast.error(t("settings.old_password_error"))
          return
        }
      }
      // Save new password
      await fetch(`/api/db?collection=user_password_${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
        cache: 'no-store'
      })
      toast.success(t("settings.password_saved"))
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      toast.error(t("settings.password_error"))
    }
  }

  const handleSaveNotifications = async () => {
    try {
      await fetch('/api/db?collection=notification_settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailNotif, taskNotif, reportNotif }),
        cache: 'no-store'
      })
      toast.success(t("settings.notifications_saved"))
    } catch (e) {
      toast.error(t("settings.notifications_error"))
    }
  }

  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("settings.subtitle")}</p>
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
            <User className="w-5 h-5" /> {t("settings.tab_profile")}
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 text-sm md:text-base ${
              activeTab === "security" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Lock className="w-5 h-5" /> {t("settings.tab_security")}
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 text-sm md:text-base ${
              activeTab === "notifications" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Bell className="w-5 h-5" /> {t("settings.tab_notifications")}
          </button>
          <button 
            onClick={() => setActiveTab("appearance")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors shrink-0 text-sm md:text-base ${
              activeTab === "appearance" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Globe className="w-5 h-5" /> {t("settings.tab_appearance")}
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
              <h2 className="text-lg font-bold mb-4">{t("settings.profile_info")}</h2>
              <div className="flex items-center gap-6 mb-6">
                <div className="relative group">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-card shadow-md" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/40 to-primary flex items-center justify-center text-white text-2xl font-bold border-4 border-card shadow-md">
                      {name.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar("")}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                      title={t("settings.delete_avatar")}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{name || t("settings.username")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{jobTitle || t("settings.job_title")}</p>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="mt-2 bg-muted px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-accent transition-colors flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" /> {t("settings.change_avatar")}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("settings.full_name")}</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("settings.email")}</label>
                  <input 
                    type="email" 
                    value={email} 
                    disabled
                    className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none transition-all opacity-70 cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("settings.phone")}</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("settings.job_title")}</label>
                  <input 
                    type="text" 
                    value={jobTitle} 
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4" /> {t("settings.save_changes")}
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="premium-card p-6">
              <h2 className="text-lg font-bold mb-4">{t("settings.security_title")}</h2>
              <form onSubmit={handleSaveSecurity} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("settings.old_password")}</label>
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
                    <label className="text-sm font-medium">{t("settings.new_password")}</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-muted/50 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("settings.confirm_password")}</label>
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
                    <Save className="w-4 h-4" /> {t("settings.change_password")}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="premium-card p-6">
              <h2 className="text-lg font-bold mb-4">{t("settings.notifications_title")}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm">{t("settings.email_notif")}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("settings.email_notif_desc")}</p>
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
                    <h4 className="font-semibold text-sm">{t("settings.task_notif")}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("settings.task_notif_desc")}</p>
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
                    <h4 className="font-semibold text-sm">{t("settings.report_notif")}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("settings.report_notif_desc")}</p>
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
                  <Save className="w-4 h-4" /> {t("settings.save_config")}
                </button>
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <div className="premium-card p-6">
              <h2 className="text-lg font-bold mb-4">{t("settings.tab_appearance")}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm">{t("settings.dark_mode")}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("settings.dark_mode_desc")}</p>
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
                          toast.success(t("settings.mode_changed") + " " + (e.target.checked ? t("settings.mode_dark") : t("settings.mode_light")))
                        }}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                      />
                    )}
                    <label htmlFor="toggleDarkMode" className="toggle-label block overflow-hidden h-6 rounded-full bg-primary cursor-pointer"></label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm">{t("settings.default_language")}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("settings.default_language_desc")}</p>
                  </div>
                  <select 
                    value={locale}
                    onChange={(e) => {
                      setLocale(e.target.value as "vi" | "en")
                      toast.success(`Đã chuyển ngôn ngữ sang ${e.target.value === 'en' ? 'English' : 'Tiếng Việt'}!`)
                    }}
                    className="bg-muted border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="vi">{t("settings.lang_vi")}</option>
                    <option value="en">{t("settings.lang_en")}</option>
                  </select>
                </div>

                <div className="p-4 border rounded-xl space-y-4">
                  <h4 className="font-semibold text-sm">{t("settings.brand_title")}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">{t("settings.company_name")}</label>
                      <input 
                        type="text" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="MRex Agency"
                        className="w-full bg-muted border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">{t("settings.brand_color")}</label>
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
                      <label className="text-xs font-medium text-muted-foreground block mb-1">{t("settings.brand_logo")}</label>
                      <input 
                        type="text" 
                        value={brandLogo}
                        onChange={(e) => setBrandLogo(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full bg-muted border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">{t("settings.brand_logo_desc")}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">{t("settings.brand_banner")}</label>
                      <input 
                        type="text" 
                        value={brandBanner}
                        onChange={(e) => setBrandBanner(e.target.value)}
                        placeholder="https://example.com/banner.jpg"
                        className="w-full bg-muted border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleSaveAppearance}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4" /> {t("settings.save_config")}
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
