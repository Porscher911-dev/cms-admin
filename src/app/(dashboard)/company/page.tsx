"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MOCK_ANNOUNCEMENTS, MOCK_POLICIES, MOCK_DEPARTMENTS, Announcement } from "@/lib/company-data"
import { 
  Megaphone, 
  Network, 
  BookOpenText, 
  Plus, 
  Edit3, 
  Pin, 
  Clock, 
  User, 
  ChevronRight,
  AlertCircle,
  FileText,
  Trash2,
  X
} from "lucide-react"
import { useRole } from "@/components/providers/role-provider"
import { toast } from "sonner"
import { useTranslation } from "@/contexts/TranslationContext"

// Types
type TabType = 'ANNOUNCEMENTS' | 'ORG_CHART' | 'POLICIES'

export default function CompanyPortalPage() {
  const { t } = useTranslation()
  const { role } = useRole()
  const [activeTab, setActiveTab] = useState<TabType>('ANNOUNCEMENTS')
  
  // State for content
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS)
  const [policies, setPolicies] = useState(MOCK_POLICIES)

  // Modals state
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false)
  const [showEditPolicies, setShowEditPolicies] = useState(false)
  const [showEditOrgChart, setShowEditOrgChart] = useState(false)
  
  // Org Chart State
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS)
  const [editDepartments, setEditDepartments] = useState(departments)

  useEffect(() => {
    const loadData = async () => {
      try {
        const resAnn = await fetch('/api/db?collection=announcements', { cache: 'no-store' })
        if (resAnn.ok) {
          const data = await resAnn.json()
          if (data && data.length > 0) setAnnouncements(data)
          else setAnnouncements(MOCK_ANNOUNCEMENTS)
        }
      } catch (e) {}

      try {
        const resPol = await fetch('/api/db?collection=policies', { cache: 'no-store' })
        if (resPol.ok) {
          const data = await resPol.json()
          if (data && data.text) {
            setPolicies(data.text)
            setEditPolicyText(data.text)
          } else {
            setPolicies(MOCK_POLICIES)
            setEditPolicyText(MOCK_POLICIES)
          }
        }
      } catch (e) {}

      try {
        const resEmp = await fetch('/api/employees', { cache: 'no-store' })
        if (resEmp.ok) {
          const emps = await resEmp.json()
          if (emps && emps.length > 0) {
            const deptMap: Record<string, string[]> = {}
            emps.forEach((e: any) => {
              if (e.systemRole === 'DIRECTOR') return // Skip director for departments
              const d = e.department || 'Phòng ban khác'
              if (!deptMap[d]) deptMap[d] = []
              deptMap[d].push(e.name)
            })
            const newDepts = Object.keys(deptMap).map((d, i) => ({
              id: String(i + 1),
              name: d,
              desc: "Nhân sự chuyên môn",
              employees: deptMap[d].join(', ')
            }))
            if (newDepts.length > 0) {
              setDepartments(newDepts)
              return // Successfully built from employees
            }
          }
        }
      } catch (e) {}

      try {
        const resDept = await fetch('/api/db?collection=departments', { cache: 'no-store' })
        if (resDept.ok) {
          const data = await resDept.json()
          if (data && data.length > 0) setDepartments(data)
          else setDepartments(MOCK_DEPARTMENTS)
        }
      } catch (e) {}
    }
    loadData()
  }, [])

  // Form State
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', isPinned: false, isUrgent: false })
  const [editPolicyText, setEditPolicyText] = useState(policies)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast.error(t("company.error_empty_fields"))
      return
    }
    
    const newItem: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      date: new Date().toLocaleDateString('vi-VN'),
      author: t("company.board_of_directors"),
      isPinned: newAnnouncement.isPinned,
      isUrgent: newAnnouncement.isUrgent
    }
    
    const newAnns = [newItem, ...announcements]
    setAnnouncements(newAnns)
    fetch('/api/db?collection=announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnns),
      cache: 'no-store'
    }).catch(() => {})

    // Push global notification
    fetch('/api/db?collection=notifications', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const notifs = Array.isArray(data) ? data : []
        const newNotif = {
          id: Date.now(),
          text: `${t("company.new_announcement_prefix")} ${newAnnouncement.title}`,
          time: t("common.just_now"),
          read: false
        }
        fetch('/api/db?collection=notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([newNotif, ...notifs]),
          cache: 'no-store'
        }).catch(() => {})
      }).catch(() => {})

    setShowAddAnnouncement(false)
    setNewAnnouncement({ title: '', content: '', isPinned: false, isUrgent: false })
    toast.success(t("company.announcement_posted"))
  }

  const handleDeleteAnnouncement = (id: string) => {
    const newAnns = announcements.filter(a => a.id !== id)
    setAnnouncements(newAnns)
    fetch('/api/db?collection=announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnns),
      cache: 'no-store'
    }).catch(() => {})
    toast.success(t("company.announcement_deleted"))
  }

  const handleSavePolicies = () => {
    setPolicies(editPolicyText)
    fetch('/api/db?collection=policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editPolicyText }),
      cache: 'no-store'
    }).catch(() => {})
    setShowEditPolicies(false)
    toast.success(t("company.policies_updated"))
  }

  const handleEditOrgChartOpen = () => {
    setEditDepartments([...departments])
    setShowEditOrgChart(true)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("company.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("company.subtitle")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-xl w-full sm:w-fit overflow-x-auto">
        <TabButton active={activeTab === 'ANNOUNCEMENTS'} onClick={() => setActiveTab('ANNOUNCEMENTS')} icon={Megaphone} label={t("company.tab_announcements")} />
        <TabButton active={activeTab === 'ORG_CHART'} onClick={() => setActiveTab('ORG_CHART')} icon={Network} label={t("company.tab_org_chart")} />
        <TabButton active={activeTab === 'POLICIES'} onClick={() => setActiveTab('POLICIES')} icon={BookOpenText} label={t("company.tab_policies")} />
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* TAB 1: ANNOUNCEMENTS */}
          {activeTab === 'ANNOUNCEMENTS' && (
            <div className="space-y-6">
              {role === 'DIRECTOR' && (
                <div className="flex justify-end">
                  <button onClick={() => setShowAddAnnouncement(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" /> {t("company.post_announcement_btn")}
                  </button>
                </div>
              )}
              
              <div className="grid gap-4">
                {announcements.map((ann) => (
                  <div key={ann.id} onClick={() => setSelectedAnnouncement(ann)} className="premium-card p-6 flex flex-col sm:flex-row gap-4 group cursor-pointer hover:border-primary/30 transition-colors">
                    <div className="shrink-0 pt-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        ann.isUrgent ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' : 
                        ann.isPinned ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                      }`}>
                        {ann.isUrgent ? <AlertCircle className="w-6 h-6" /> : ann.isPinned ? <Pin className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold">{ann.title}</h3>
                        {ann.isUrgent && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-800">{t("company.urgent")}</span>}
                        {ann.isPinned && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800">{t("company.pinned")}</span>}
                        <div className="flex-1"></div>
                        {role === 'DIRECTOR' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteAnnouncement(ann.id) }}
                            className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title={t("company.delete_announcement")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{ann.content}</p>
                      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {ann.author}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {ann.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ORG CHART */}
          {activeTab === 'ORG_CHART' && (
            <div className="premium-card p-8 min-h-[500px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold">{t("company.org_chart_title")}</h2>
                {role === 'DIRECTOR' && (
                  <button onClick={handleEditOrgChartOpen} className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                    <Edit3 className="w-4 h-4" /> {t("company.edit_org_chart")}
                  </button>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-8 py-10 overflow-x-auto">
                {/* Director */}
                <div className="relative border-2 border-primary bg-primary/5 text-center p-4 rounded-xl shadow-sm min-w-[200px]">
                  <h3 className="font-bold text-primary">{t("company.board_of_directors")}</h3>
                  <p className="text-xs text-muted-foreground mt-1">CEO / Director</p>
                  <div className="absolute w-0.5 h-8 bg-border left-1/2 -bottom-8"></div>
                </div>
                
                {/* Branches */}
                <div className="flex gap-4 sm:gap-8 relative mt-8 pt-4">
                  <div className="absolute w-[calc(100%-140px)] sm:w-[calc(100%-180px)] h-0.5 bg-border top-0 left-1/2 -translate-x-1/2"></div>
                  
                  {departments.map((dept) => (
                    <div key={dept.id} className="relative flex flex-col items-center">
                      <div className="absolute w-0.5 h-4 bg-border left-1/2 -top-4"></div>
                      <div className="border bg-card text-center p-4 rounded-xl shadow-sm min-w-[140px] sm:min-w-[180px] z-10 relative">
                        <h3 className="font-semibold text-sm">{dept.name}</h3>
                        <p className="text-[10px] text-muted-foreground mt-1">{dept.desc}</p>
                      </div>
                      
                      {dept.employees && dept.employees.trim() !== '' && (
                        <>
                          <div className="w-0.5 h-6 bg-border"></div>
                          <div className="flex flex-col gap-2">
                            {dept.employees.split(',').map((emp, idx) => (
                              <div key={idx} className="bg-muted px-3 py-1.5 rounded-lg text-xs font-medium border border-border/50 text-center shadow-sm">
                                {emp.trim()}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POLICIES */}
          {activeTab === 'POLICIES' && (
            <div className="premium-card p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2"><BookOpenText className="w-5 h-5 text-primary" /> {t("company.tab_policies")}</h2>
                {role === 'DIRECTOR' && (
                  <button onClick={() => setShowEditPolicies(true)} className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                    <Edit3 className="w-4 h-4" /> {t("company.edit_policies")}
                  </button>
                )}
              </div>
              <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base prose-headings:text-primary prose-a:text-primary">
                {policies.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) return <h1 key={idx} className="text-2xl font-bold mt-6 mb-4">{line.replace('# ', '')}</h1>
                  if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-semibold mt-5 mb-3">{line.replace('## ', '')}</h2>
                  if (line.startsWith('- ')) return <li key={idx} className="ml-4 mb-1">{line.replace('- ', '')}</li>
                  return <p key={idx} className="mb-2">{line}</p>
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* MODALS */}
      
      {/* Modal Add Announcement */}
      {showAddAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">{t("company.create_announcement_title")}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">{t("company.announcement_title")}</label>
                <input 
                  type="text" 
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  className="w-full bg-muted border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  placeholder={t("company.announcement_title_placeholder")} 
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">{t("company.announcement_content")}</label>
                <textarea 
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  className="w-full bg-muted border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px] resize-none" 
                  placeholder={t("company.announcement_content_placeholder")} 
                />
              </div>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={newAnnouncement.isPinned} onChange={(e) => setNewAnnouncement({...newAnnouncement, isPinned: e.target.checked})} className="rounded text-primary focus:ring-primary" />
                  {t("company.pin_to_top")}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer text-rose-600">
                  <input type="checkbox" checked={newAnnouncement.isUrgent} onChange={(e) => setNewAnnouncement({...newAnnouncement, isUrgent: e.target.checked})} className="rounded text-rose-600 focus:ring-rose-600" />
                  {t("company.mark_urgent")}
                </label>
              </div>
            </div>
            <div className="p-4 border-t bg-muted/30 flex justify-end gap-3">
              <button onClick={() => setShowAddAnnouncement(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">{t("common.cancel")}</button>
              <button onClick={handleCreateAnnouncement} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">{t("company.post_announcement")}</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Edit Org Chart */}
      {showEditOrgChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("company.edit_org_chart_title")}</h2>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {editDepartments.map((dept, index) => (
                  <div key={dept.id} className="flex gap-3 items-center bg-muted/50 p-3 rounded-xl border">
                    <div className="flex-1 space-y-2">
                      <input 
                        type="text" 
                        value={dept.name}
                        onChange={(e) => {
                          const newDepts = [...editDepartments]
                          newDepts[index].name = e.target.value
                          setEditDepartments(newDepts)
                        }}
                        className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                        placeholder={t("company.dept_name")} 
                      />
                      <input 
                        type="text" 
                        value={dept.desc}
                        onChange={(e) => {
                          const newDepts = [...editDepartments]
                          newDepts[index].desc = e.target.value
                          setEditDepartments(newDepts)
                        }}
                        className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                        placeholder={t("company.dept_desc")} 
                      />
                      <input 
                        type="text" 
                        value={dept.employees || ''}
                        onChange={(e) => {
                          const newDepts = [...editDepartments]
                          newDepts[index].employees = e.target.value
                          setEditDepartments(newDepts)
                        }}
                        className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                        placeholder={t("company.dept_employees")} 
                      />
                    </div>
                    <button 
                      onClick={() => setEditDepartments(editDepartments.filter(d => d.id !== dept.id))}
                      className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setEditDepartments([...editDepartments, { id: Date.now().toString(), name: '', desc: '', employees: '' }])}
                className="w-full py-3 border-2 border-dashed border-primary/30 text-primary font-medium rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> {t("company.add_dept")}
              </button>
            </div>
            <div className="p-4 border-t bg-muted/30 flex justify-end gap-3">
              <button onClick={() => setShowEditOrgChart(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">{t("common.cancel")}</button>
              <button onClick={() => { 
                setDepartments(editDepartments); 
                fetch('/api/db?collection=departments', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(editDepartments),
                  cache: 'no-store'
                }).catch(() => {});
                setShowEditOrgChart(false); 
                toast.success(t("company.org_chart_updated")) 
              }} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">{t("common.save_updates")}</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Edit Policies */}
      {showEditPolicies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden border flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("company.edit_policies_title")}</h2>
              <span className="text-xs text-muted-foreground">{t("company.markdown_support")}</span>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <textarea 
                value={editPolicyText}
                onChange={(e) => setEditPolicyText(e.target.value)}
                className="w-full bg-muted border-none rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[400px] font-mono leading-relaxed resize-none" 
              />
            </div>
            <div className="p-4 border-t bg-muted/30 flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowEditPolicies(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors">{t("common.cancel")}</button>
              <button onClick={handleSavePolicies} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">{t("common.save_updates")}</button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedAnnouncement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-700 dark:bg-rose-500/30 dark:text-rose-400">
                    {selectedAnnouncement.isUrgent ? t("company.urgent") : selectedAnnouncement.isPinned ? t("company.pinned") : t("company.news")}
                  </span>
                  <span className="text-xs text-muted-foreground">{selectedAnnouncement.date}</span>
                </div>
                <h2 className="text-xl font-bold">{selectedAnnouncement.title}</h2>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setSelectedAnnouncement(null); }} className="p-2 rounded-full hover:bg-muted transition-colors shrink-0">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {selectedAnnouncement.content}
            </div>
            <div className="p-4 border-t bg-muted/30 flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{t("company.posted_by")} <span className="font-semibold text-foreground">{selectedAnnouncement.author}</span></span>
              <button onClick={(e) => { e.stopPropagation(); setSelectedAnnouncement(null); }} className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">{t("common.close")}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
        active 
          ? 'bg-background text-foreground shadow-sm' 
          : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}
