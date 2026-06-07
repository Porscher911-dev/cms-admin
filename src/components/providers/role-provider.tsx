"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type Role = "DIRECTOR" | "MANAGER" | "EMPLOYEE"

interface RoleContextType {
  role: Role
  setRole: (role: Role) => void
  isLoaded: boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("DIRECTOR")
  const [isLoaded, setIsLoaded] = useState(false)

  // Optional: Persist role to local storage so it survives reloads during demo
  useEffect(() => {
    const savedRole = localStorage.getItem("mrex_demo_role") as Role
    if (savedRole && ["DIRECTOR", "MANAGER", "EMPLOYEE"].includes(savedRole)) {
      setRoleState(savedRole)
    }
    setIsLoaded(true)
  }, [])

  const setRole = (newRole: Role) => {
    setRoleState(newRole)
    localStorage.setItem("mrex_demo_role", newRole)
  }

  return (
    <RoleContext.Provider value={{ role, setRole, isLoaded }}>
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

