"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type Role = "DIRECTOR" | "MANAGER" | "EMPLOYEE"

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  jobTitle: string;
  avatar: string;
}

export interface AttendanceState {
  isCheckedIn: boolean;
  checkInTime: string | null;
}

interface RoleContextType {
  role: Role
  setRole: (role: Role) => void
  isLoaded: boolean
  userProfile: UserProfile
  setUserProfile: (profile: UserProfile) => void
  attendanceState: AttendanceState
  setAttendanceState: (state: AttendanceState) => void
}

const defaultProfiles: Record<Role, UserProfile> = {
  DIRECTOR: { name: "Toby Vu", phone: "0901234567", email: "toby.vu@mrex.agency", jobTitle: "Giám đốc điều hành", avatar: "" },
  MANAGER: { name: "Vũ Quang Huy", phone: "0901234568", email: "huy.vu@mrex.agency", jobTitle: "Trưởng phòng", avatar: "" },
  EMPLOYEE: { name: "Nhân viên mới", phone: "0901234569", email: "nv@mrex.agency", jobTitle: "Nhân viên", avatar: "" }
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("DIRECTOR")
  const [isLoaded, setIsLoaded] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfiles["DIRECTOR"])
  const [attendanceState, setAttendanceState] = useState<AttendanceState>({ isCheckedIn: false, checkInTime: null })

  // 1. Load initial role from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem("mrex_demo_role") as Role
    if (savedRole && ["DIRECTOR", "MANAGER", "EMPLOYEE"].includes(savedRole)) {
      setRoleState(savedRole)
    } else {
      setRoleState("DIRECTOR")
    }
    setIsLoaded(true)
  }, [])

  // 2. Fetch profile & attendance when role changes (only after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    const fetchRoleData = async () => {
      try {
        // Fetch profile
        let finalProfile: UserProfile | null = null

        const loginEmail = localStorage.getItem('mrex_user_email')
        if (loginEmail) {
          try {
            const empRes = await fetch('/api/employees', { cache: 'no-store' })
            if (empRes.ok) {
              const emps = await empRes.json()
              const me = emps.find((e: any) => e.email?.toLowerCase() === loginEmail.toLowerCase())
              if (me) {
                finalProfile = {
                  name: me.name,
                  jobTitle: me.role || defaultProfiles[role].jobTitle,
                  email: me.email,
                  phone: me.phone || '',
                  avatar: ''
                }
              }
            }
          } catch (e) {}
        }

        const profileKey = finalProfile?.name || defaultProfiles[role].name;
        const profileRes = await fetch(`/api/db?collection=user_profile_${encodeURIComponent(profileKey)}`, { cache: 'no-store' })
        if (profileRes.ok) {
          const data = await profileRes.json()
          if (data && data.name) {
            finalProfile = {
              name: data.name,
              phone: data.phone || finalProfile?.phone || defaultProfiles[role].phone,
              email: data.email || finalProfile?.email || defaultProfiles[role].email,
              jobTitle: data.jobTitle || finalProfile?.jobTitle || defaultProfiles[role].jobTitle,
              avatar: data.avatar || defaultProfiles[role].avatar
            }
          }
        }
        
        setUserProfile(finalProfile || defaultProfiles[role])

        // Fetch attendance
        const attendanceRes = await fetch(`/api/db?collection=attendance_${encodeURIComponent(profileKey)}`, { cache: 'no-store' })
        if (attendanceRes.ok) {
          const data = await attendanceRes.json()
          if (data && typeof data.isCheckedIn === "boolean") {
            setAttendanceState(data)
          } else {
            setAttendanceState({ isCheckedIn: false, checkInTime: null })
          }
        } else {
          setAttendanceState({ isCheckedIn: false, checkInTime: null })
        }
      } catch (err) {
        console.error("Failed to fetch role data:", err)
        setUserProfile(defaultProfiles[role])
        setAttendanceState({ isCheckedIn: false, checkInTime: null })
      }
    }

    fetchRoleData()
  }, [role, isLoaded])

  // Custom setRole
  const setRole = (newRole: Role) => {
    setRoleState(newRole)
    localStorage.setItem("mrex_demo_role", newRole)
  }

  // Custom setAttendance
  const updateAttendanceState = (newState: AttendanceState) => {
    setAttendanceState(newState)
    const profileKey = userProfile?.name || defaultProfiles[role].name;
    fetch(`/api/db?collection=attendance_${encodeURIComponent(profileKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newState)
    }).catch(e => console.error(e))
  }

  return (
    <RoleContext.Provider value={{ 
      role, setRole, isLoaded, 
      userProfile, setUserProfile, 
      attendanceState, setAttendanceState: updateAttendanceState 
    }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}

