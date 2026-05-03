"use client"

import { useEffect, useState } from "react"
import { Users, Phone, User, RefreshCw, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { Student } from "@/lib/types"

interface StudentsListProps {
  refreshKey?: number
  institutionId?: string
}

export function StudentsList({ refreshKey, institutionId }: StudentsListProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const fetchStudents = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      let query = supabase
        .from("students")
        .select("*")
        .eq("is_admin", false)
      
      if (institutionId) {
        query = query.eq("institution_id", institutionId)
      }
      
      const { data, error: fetchError } = await query.order("created_at", { ascending: false })
      
      if (fetchError) {
        throw fetchError
      }
      
      setStudents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch students")
    } finally {
      setIsLoading(false)
    }
  }
  
  const deleteStudent = async (id: string) => {
    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase
        .from("students")
        .delete()
        .eq("id", id)
      if (!deleteError) {
        setStudents((prev) => prev.filter((s) => s.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [refreshKey])
  
  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Registered Students
          </CardTitle>
          <CardDescription>
            {students.length} student{students.length !== 1 ? "s" : ""} registered for alerts
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStudents} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-muted animate-pulse h-16" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No students registered yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-card-foreground truncate">{student.full_name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      {student.phone_number}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {new Date(student.created_at).toLocaleDateString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteStudent(student.id)}
                    disabled={deletingId === student.id}
                    aria-label="Remove student"
                  >
                    {deletingId === student.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
