"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { StudentLoginForm } from "@/components/student-login-form"
import { StudentProfileCard } from "@/components/student-profile-card"
import { StudentScheduleView } from "@/components/student-schedule-view"
import { StudentEventsView } from "@/components/student-events-view"
import { useStudentAuth } from "@/lib/student-auth-context"
import { createClient } from "@/lib/supabase/client"
import { GraduationCap, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StudentDashboardPage() {
  const { student, isLoading: authLoading } = useStudentAuth()
  const [institutionName, setInstitutionName] = useState<string | null>(null)
  const [isLoadingInstitution, setIsLoadingInstitution] = useState(false)

  useEffect(() => {
    const fetchInstitution = async () => {
      if (!student?.institution_id) return
      setIsLoadingInstitution(true)
      const supabase = createClient()
      const { data } = await supabase
        .from("students")
        .select("institution_name")
        .eq("id", student.institution_id)
        .single()
      if (data) {
        setInstitutionName(data.institution_name)
      }
      setIsLoadingInstitution(false)
    }
    fetchInstitution()
  }, [student?.institution_id])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <StudentLoginForm />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
              <p className="text-muted-foreground">
                {isLoadingInstitution ? "Loading..." : institutionName || "Your institution"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="mb-8">
          <StudentProfileCard institutionName={institutionName} />
        </div>

        {/* Dashboard Content */}
        {student.institution_id ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <StudentScheduleView institutionId={student.institution_id} />
            <StudentEventsView institutionId={student.institution_id} />
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              Your account is not linked to an education sector.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Please contact your admin to link your account.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
