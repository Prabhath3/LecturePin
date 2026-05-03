"use client"

import { User, Phone, Building2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useStudentAuth } from "@/lib/student-auth-context"

interface StudentProfileCardProps {
  institutionName?: string | null
}

export function StudentProfileCard({ institutionName }: StudentProfileCardProps) {
  const { student, logout } = useStudentAuth()

  if (!student) return null

  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-card-foreground truncate">{student.full_name}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {student.phone_number}
                </span>
                {institutionName && (
                  <span className="flex items-center gap-1 text-primary">
                    <Building2 className="w-3 h-3" />
                    {institutionName}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex-shrink-0 self-start sm:self-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
