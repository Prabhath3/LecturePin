"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { Student } from "@/lib/types"

interface AdminAuthContextType {
  user: Student | null
  isLoading: boolean
  login: (student: Student) => void
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const stored = localStorage.getItem("lecturepin_admin_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem("lecturepin_admin_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (student: Student) => {
    setUser(student)
    localStorage.setItem("lecturepin_admin_user", JSON.stringify(student))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("lecturepin_admin_user")
  }

  return (
    <AdminAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
