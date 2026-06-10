"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { CalendarCheck2, Clock, LogOut, CheckCircle2, CalendarDays, FilePlus2, X, Send, MapPin, Globe, Wifi, Trash2, Users, Download } from "lucide-react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { useRole } from "@/components/providers/role-provider"
import { useTranslation } from "@/contexts/TranslationContext"

interface AttendanceLog {
  id: string
  type: "CHECK_IN" | "CHECK_OUT"
  timestamp: Date
  ip: string
  location: string
  isp?: string
}

export default function AttendancePage() {
  const { t } = useTranslation()
  const { role, userProfile, attendanceState, setAttendanceState } = useRole()
  const currentUser = userProfile?.name || "Toby Vu"

  const [currentTime, setCurrentTime] = useState(new Date())
  const [showLeaveForm, setShowLeaveForm] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  
  const canViewCompany = role === "DIRECTOR" || role === "MANAGER"
  
  const [cooldown, setCooldown] = useState(0)
  const [logs, setLogs] = useState<AttendanceLog[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [userIp, setUserIp] = useState<string>("113.161.79.120")
  const [userIsp, setUserIsp] = useState<string>("Viettel Telecom")
  const [userLocation, setUserLocation] = useState<string>("10.7769° N, 106.7009° E (Quận 1, TP.HCM)")

  // Leave Form states
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [leaveType, setLeaveType] = useState(t("attendance.annual_leave"))
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [leaveReason, setLeaveReason] = useState("")

  useEffect(() => {
    setLeaveType(t("attendance.annual_leave"))
  }, [t])

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Helper to check if a date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Load from localStorage & fetch geolocation/ISP on mount
  useEffect(() => {
    setIsMounted(true)
    
    const loadAttendance = async () => {
      try {
        const res = await fetch(`/api/db?collection=attendance_${role}`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data) {
            const { checkedIn, checkInTime, lastCheckInMs, logs } = data
            
            let checkedInToday = false
            if (lastCheckInMs) {
              const lastCheckInDate = new Date(parseInt(lastCheckInMs, 10))
              if (isToday(lastCheckInDate)) {
                checkedInToday = true
                setAttendanceState({ isCheckedIn: (checkedIn === "true" || checkedIn === true), checkInTime })
              }
            }
            
            if (!checkedInToday) {
              setAttendanceState({ isCheckedIn: false, checkInTime: null })
            }
            
            if (logs) {
              const parsedLogs = logs.map((log: any) => ({
                ...log,
                timestamp: new Date(log.timestamp)
              }))
              const todaysLogs = parsedLogs.filter((log: any) => isToday(log.timestamp))
              setLogs(todaysLogs)
            }
            
            if (lastCheckInMs && (checkedIn === "true" || checkedIn === true) && checkedInToday) {
              const elapsed = Date.now() - parseInt(lastCheckInMs, 10)
              const remaining = Math.max(0, 5 - Math.floor(elapsed / 1000))
              if (remaining > 0) {
                setCooldown(remaining)
              }
            }
          } else {
             // No data yet — start with empty logs (new employee)
             setLogs([])
          }
        }
      } catch (e) {}
    }
    
    const loadLeaveRequests = async () => {
      try {
        const res = await fetch('/api/db?collection=leave_requests', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setLeaveRequests(data)
          } else {
            setLeaveRequests([])
          }
        }
      } catch (e) {}
    }

    loadAttendance()
    loadLeaveRequests()

    // Get IP and ISP info in a single call
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.ip) setUserIp(data.ip)
        if (data.org) setUserIsp(data.org)
      })
      .catch(() => {
        setUserIp("113.161.79.120")
        setUserIsp("Viettel Telecom")
      })

    // Get Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation(`${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (GPS)`)
        },
        () => {
          setUserLocation("10.7769° N, 106.7009° E (Quận 1, TP.HCM)")
        },
        { enableHighAccuracy: true, timeout: 5000 }
      )
    }
  }, [])

  // Listener to keep leave request list updated if approved on Approvals page
  useEffect(() => {
    if (!isMounted) return
    const handleStorageChange = async () => {
      try {
        const res = await fetch('/api/db?collection=leave_requests', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data) setLeaveRequests(data)
        }
      } catch (e) {}
    }
    window.addEventListener("storage", handleStorageChange)
    // Also poll every 2 seconds for a seamless realtime feel during dual role demo!
    const interval = setInterval(handleStorageChange, 2000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [isMounted])

  // Cooldown countdown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const saveAttendanceData = (newLogs: AttendanceLog[], checkedIn: boolean, time: string | null) => {
    setLogs(newLogs)
    setAttendanceState({ isCheckedIn: checkedIn, checkInTime: time })
    
    const attendanceData = {
      logs: newLogs,
      checkedIn,
      checkInTime: time,
      lastCheckInMs: time ? String(Date.now()) : null
    }
    
    fetch(`/api/db?collection=attendance_${role}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attendanceData),
      cache: 'no-store'
    }).catch(() => {})
  }

  const handleCheckIn = () => {
    if (attendanceState.isCheckedIn) {
      if (cooldown > 0) return
      
      const now = new Date()
      const newLog: AttendanceLog = {
        id: Math.random().toString(36).substring(2, 9),
        type: "CHECK_OUT",
        timestamp: now,
        ip: userIp,
        location: userLocation,
        isp: userIsp
      }
      
      const updatedLogs = [newLog, ...logs]
      saveAttendanceData(updatedLogs, false, null)
      toast.success(t("attendance.checkout_success"))
    } else {
      const now = new Date()
      const timeStr = now.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
      
      const newLog: AttendanceLog = {
        id: Math.random().toString(36).substring(2, 9),
        type: "CHECK_IN",
        timestamp: now,
        ip: userIp,
        location: userLocation,
        isp: userIsp
      }
      
      const updatedLogs = [newLog, ...logs]
      saveAttendanceData(updatedLogs, true, timeStr)
      setCooldown(5)
      toast.success(t("attendance.checkin_success"))
    }
  }

  const handleCreateLeaveRequest = () => {
    if (!fromDate || !toDate || !leaveReason.trim()) {
      toast.error(t("attendance.error_empty_fields"))
      return
    }

    const formatDate = (dateStr: string) => {
      if (!dateStr) return ""
      const [year, month, day] = dateStr.split("-")
      return `${day}/${month}/${year}`
    }

    const newRequest = {
      id: "REQ-" + Math.floor(100 + Math.random() * 900),
      date: `${formatDate(fromDate)} - ${formatDate(toDate)}`,
      type: leaveType,
      reason: leaveReason,
      status: "PENDING",
      user: currentUser
    }

    const updated = [newRequest, ...leaveRequests]
    setLeaveRequests(updated)
    fetch('/api/db?collection=leave_requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
      cache: 'no-store'
    }).catch(() => {})

    // Send notification to DIRECTOR and MANAGER
    fetch('/api/db?collection=notifications', { cache: 'no-store' })
      .then(res => res.json())
      .then(notifs => {
        const newNotif = {
          id: Date.now() + Math.random(),
          text: t("attendance.notif_new_leave").replace("{user}", currentUser).replace("{type}", newRequest.type),
          time: t("common.just_now"),
          read: false
        }
        const updatedNotifs = [newNotif, ...(notifs || [])]
        fetch('/api/db?collection=notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedNotifs),
          cache: 'no-store'
        }).catch(() => {})
      })
      .catch(() => {})

    toast.success(t("attendance.leave_request_sent"))
    setShowLeaveForm(false)
    
    // Clear form
    setFromDate("")
    setToDate("")
    setLeaveReason("")
  }

  const timeString = currentTime.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateString = currentTime.toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const isCheckOutDisabled = attendanceState.isCheckedIn && cooldown > 0
  const hasCheckedOutToday = logs.some(log => log.type === "CHECK_OUT" && isToday(log.timestamp))
  const isButtonDisabled = isCheckOutDisabled || (hasCheckedOutToday && !attendanceState.isCheckedIn)

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { "Nhân viên": "Nguyễn Văn A", "Ngày công": 22, "Đi trễ": 1, "Nghỉ phép": 0 },
      { "Nhân viên": "Trần Thị B", "Ngày công": 21, "Đi trễ": 0, "Nghỉ phép": 1 }
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Báo cáo Tháng")
    XLSX.writeFile(wb, "Bao_cao_cham_cong_thang.xlsx")
    toast.success("Xuất báo cáo Excel thành công!")
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text("BAO CAO CHAM CONG", 14, 15)
    
    const tableColumn = ["Nhan vien", "Ngay cong", "Di tre", "Nghi phep"]
    const tableRows = [
      ["Nguyen Van A", "22", "1", "0"],
      ["Tran Thi B", "21", "0", "1"]
    ]

    ;(doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    })

    doc.save("Bao_cao_cham_cong.pdf")
    toast.success("Xuất báo cáo PDF thành công!")
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarCheck2 className="w-8 h-8 text-primary" /> {t("attendance.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("attendance.subtitle")}</p>
        </motion.div>
        
        {canViewCompany && (
          <div className="flex p-1 bg-muted/30 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "personal" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <CalendarCheck2 className="w-4 h-4" />
              {t("attendance_admin.tab_personal") || "Cá nhân"}
            </button>
            <button
              onClick={() => setActiveTab("company")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "company" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Users className="w-4 h-4" />
              {t("attendance_admin.tab_company") || "Toàn công ty"}
            </button>
          </div>
        )}
      </div>

      {activeTab === "personal" ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TIME CLOCK */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 premium-card p-6 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
          
          <h2 className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-widest">{t("attendance.today_attendance")}</h2>
          
          <div className="mb-8">
            <div className="text-5xl font-bold tracking-tighter text-foreground mb-2">
              {timeString}
            </div>
            <div className="text-muted-foreground font-medium">
              {dateString}
            </div>
          </div>

          <button 
            onClick={handleCheckIn}
            disabled={isButtonDisabled}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 transform ${
              isButtonDisabled 
                ? "bg-muted text-muted-foreground opacity-60 cursor-not-allowed" 
                : attendanceState.isCheckedIn 
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20 hover:scale-[1.02] active:scale-95 shadow-xl" 
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 shadow-xl"
            }`}
          >
            {hasCheckedOutToday && !attendanceState.isCheckedIn ? (
              <><CheckCircle2 className="w-5 h-5 text-emerald-500" /> {t("attendance.attendance_completed")}</>
            ) : attendanceState.isCheckedIn ? (
              isCheckOutDisabled ? (
                <><Clock className="w-5 h-5 animate-spin" /> {t("attendance.checkout_wait").replace("{cooldown}", cooldown.toString())}</>
              ) : (
                <><LogOut className="w-5 h-5" /> {t("attendance.checkout")}</>
              )
            ) : (
              <><CheckCircle2 className="w-5 h-5" /> {t("attendance.checkin")}</>
            )}
          </button>

          {isMounted && (
            <div className="mt-4 w-full">
              {attendanceState.isCheckedIn && attendanceState.checkInTime ? (
                <div className="flex flex-col items-center gap-1 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> {t("attendance.checked_in_today")}
                  </div>
                  <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                    {t("attendance.at_time")} {attendanceState.checkInTime} • {dateString}
                  </div>
                </div>
              ) : (
                logs.length > 0 && logs[0].type === "CHECK_OUT" && (
                  <div className="flex flex-col items-center gap-1 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl">
                    <div className="flex items-center gap-1.5 text-sm text-rose-600 dark:text-rose-400 font-bold">
                      <LogOut className="w-4 h-4" /> {t("attendance.checked_out_today")}
                    </div>
                    <div className="text-xs text-rose-600/80 dark:text-rose-400/80">
                      {t("attendance.at_time")} {logs[0].timestamp.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })} • {dateString}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {isMounted && (
            <div className="mt-6 w-full text-xs text-muted-foreground border-t border-muted/40 pt-4 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-primary/70" /> {t("attendance.ip_address")}</span>
                <span className="font-mono font-medium">{userIp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><Wifi className="w-3.5 h-3.5 text-primary/70" /> {t("attendance.isp")}</span>
                <span className="font-medium truncate max-w-[160px] text-right" title={userIsp}>{userIsp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary/70" /> {t("attendance.location")}</span>
                <span className="font-medium truncate max-w-[160px] text-right" title={userLocation}>{userLocation}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* LEAVE MANAGEMENT */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 premium-card p-6 h-full flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" /> {t("attendance.leave_history")}
            </h2>
            <button 
              onClick={() => setShowLeaveForm(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              <FilePlus2 className="w-4 h-4" /> {t("attendance.create_leave_btn")}
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-lg">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-lg rounded-bl-lg">{t("attendance.leave_date")}</th>
                  <th className="px-4 py-3 font-semibold">{t("attendance.leave_type_col")}</th>
                  <th className="px-4 py-3 font-semibold">{t("attendance.reason_col")}</th>
                  <th className="px-4 py-3 font-semibold text-right rounded-tr-lg rounded-br-lg">{t("attendance.status_col")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/30">
                {leaveRequests.map(req => (
                  <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4 font-medium">{req.date}</td>
                    <td className="px-4 py-4"><span className="bg-muted px-2.5 py-1 rounded-md text-xs font-medium">{req.type}</span></td>
                    <td className="px-4 py-4 text-muted-foreground">{req.reason}</td>
                    <td className="px-4 py-4 text-right">
                      {req.status === "APPROVED" || req.status === "Đã duyệt" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t("attendance.status_approved")}
                        </span>
                      ) : req.status === "REJECTED" || req.status === "Từ chối" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full">
                          <X className="w-3.5 h-3.5" /> {t("attendance.status_rejected")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5" /> {t("attendance.status_pending")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* REAL-TIME ATTENDANCE LOG LIST */}
      {isMounted && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> {t("attendance.attendance_log")}
            </h2>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> {t("attendance.active")}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-lg">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-lg rounded-bl-lg">{t("attendance.action_type")}</th>
                  <th className="px-4 py-3 font-semibold">{t("attendance.time_col")}</th>
                  <th className="px-4 py-3 font-semibold">{t("attendance.date_col")}</th>
                  <th className="px-4 py-3 font-semibold">{t("attendance.ip_isp_col")}</th>
                  <th className="px-4 py-3 font-semibold rounded-tr-lg rounded-br-lg">{t("attendance.location_col")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/30">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      {t("attendance.no_logs_today")}
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-4 font-medium">
                        {log.type === "CHECK_IN" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Check In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-100 dark:bg-rose-900/30 px-2.5 py-1 rounded-full">
                            <LogOut className="w-3.5 h-3.5" /> Check Out
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 font-mono font-medium">
                        {log.timestamp.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {log.timestamp.toLocaleDateString("vi-VN", { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground font-mono text-xs">
                        <div>{log.ip}</div>
                        <div className="text-[10px] text-muted-foreground/70 font-sans mt-0.5">{log.isp || "Viettel Telecom"}</div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground/60" /> {log.location}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* CREATE LEAVE MODAL */}
      <AnimatePresence>
        {showLeaveForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b bg-muted/20">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FilePlus2 className="w-5 h-5 text-primary" /> {t("attendance.create_leave_modal_title")}
                </h2>
                <button 
                  onClick={() => setShowLeaveForm(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("attendance.leave_type_label")}</label>
                  <select 
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full bg-muted/50 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="Nghỉ phép năm">{t("attendance.annual_leave_paid")}</option>
                    <option value="Nghỉ việc riêng">{t("attendance.personal_leave_unpaid")}</option>
                    <option value="Nghỉ ốm">{t("attendance.sick_leave")}</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("attendance.from_date")}</label>
                    <input 
                      type="date" 
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full bg-muted/50 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("attendance.to_date")}</label>
                    <input 
                      type="date" 
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full bg-muted/50 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("attendance.detailed_reason")}</label>
                  <textarea 
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full min-h-[100px] bg-muted/50 border rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder={t("attendance.reason_placeholder")}
                  ></textarea>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/10">
                <button 
                  onClick={() => setShowLeaveForm(false)}
                  className="px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button 
                  onClick={handleCreateLeaveRequest}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> {t("attendance.submit_btn")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="premium-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" /> {t("attendance_admin.monthly_report") || "Báo cáo Tháng"}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={exportToExcel} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-xs font-semibold transition-colors">
                  <Download className="w-3.5 h-3.5" /> Excel
                </button>
                <button onClick={exportToPDF} className="flex items-center gap-2 px-3 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg text-xs font-semibold transition-colors">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-lg">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-tl-lg rounded-bl-lg">{t("attendance_admin.col_employee") || "Nhân viên"}</th>
                    <th className="px-4 py-3 font-semibold text-center">{t("attendance_admin.col_workdays") || "Ngày công"}</th>
                    <th className="px-4 py-3 font-semibold text-center">{t("attendance_admin.col_late") || "Đi trễ"}</th>
                    <th className="px-4 py-3 font-semibold text-center rounded-tr-lg rounded-br-lg">{t("attendance_admin.col_leave") || "Nghỉ phép"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/30">
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground">Nguyễn Văn A</td>
                    <td className="px-4 py-4 text-center font-bold text-emerald-600">22</td>
                    <td className="px-4 py-4 text-center text-rose-500 font-medium">1</td>
                    <td className="px-4 py-4 text-center text-muted-foreground">0</td>
                  </tr>
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground">Trần Thị B</td>
                    <td className="px-4 py-4 text-center font-bold text-emerald-600">21</td>
                    <td className="px-4 py-4 text-center text-rose-500 font-medium">0</td>
                    <td className="px-4 py-4 text-center text-orange-500 font-medium">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="premium-card p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" /> {t("attendance_admin.today_overview") || "Tổng quan Hôm nay"}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-lg">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-tl-lg rounded-bl-lg">{t("attendance_admin.col_employee") || "Nhân viên"}</th>
                    <th className="px-4 py-3 font-semibold">{t("attendance_admin.col_checkin") || "Check-in"}</th>
                    <th className="px-4 py-3 font-semibold">{t("attendance_admin.col_checkout") || "Check-out"}</th>
                    <th className="px-4 py-3 font-semibold text-right rounded-tr-lg rounded-br-lg">{t("attendance_admin.col_status") || "Trạng thái"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/30">
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground">Nguyễn Văn A</td>
                    <td className="px-4 py-4 text-muted-foreground font-mono">08:20 AM</td>
                    <td className="px-4 py-4 text-muted-foreground font-mono">--</td>
                    <td className="px-4 py-4 text-right">
                      <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">{t("attendance_admin.status_on_time") || "Đúng giờ"}</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground">Trần Thị B</td>
                    <td className="px-4 py-4 text-muted-foreground font-mono">09:45 AM</td>
                    <td className="px-4 py-4 text-muted-foreground font-mono">--</td>
                    <td className="px-4 py-4 text-right">
                      <span className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full text-xs font-semibold">{t("attendance_admin.status_late") || "Đi trễ"}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
