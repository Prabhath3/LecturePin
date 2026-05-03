"use client"

import { User, Phone, CalendarDays, LogOut, Building2, MapPin, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAdminAuth } from "@/lib/admin-auth-context"

export function AdminProfileCard() {
  const { user, logout } = useAdminAuth()

  if (!user) return null

  const getCategoryLabel = (cat: string | null | undefined) => {
    const categories: Record<string, string> = {
      school: "School",
      college: "College",
      university: "University",
      coaching: "Coaching Center",
      training: "Training Institute",
      other: "Other",
    }
    return cat ? categories[cat] || cat : null
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="font-semibold text-card-foreground truncate">{user.full_name}</p>
              
              {user.institution_name && (
                <p className="text-sm text-primary font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{user.institution_name}</span>
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {user.phone_number}
                </span>
                {user.category && (
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {getCategoryLabel(user.category)}
                  </span>
                )}
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {user.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex-shrink-0 self-start"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
