"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { Student } from "@/lib/types"

interface StudentAuthContextType {
  student: Student | null
  isLoading: boolean
  login: (student: Student) => void
  logout: () => void
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined)

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("lecturepin_student")
    if (stored) {
      try {
        setStudent(JSON.parse(stored))
      } catch {
        localStorage.removeItem("lecturepin_student")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (studentData: Student) => {
    setStudent(studentData)
    localStorage.setItem("lecturepin_student", JSON.stringify(studentData))
  }

  const logout = () => {
    setStudent(null)
    localStorage.removeItem("lecturepin_student")
  }

  return (
    <StudentAuthContext.Provider value={{ student, isLoading, login, logout }}>
      {children}
    </StudentAuthContext.Provider>
  )
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext)
  if (context === undefined) {
    throw new Error("useStudentAuth must be used within a StudentAuthProvider")
  }
  return context
}
