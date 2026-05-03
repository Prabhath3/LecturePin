"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Clock, ArrowRight, RefreshCw, BookOpen, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { ScheduleChange } from "@/lib/types"

interface StudentScheduleViewProps {
  institutionId: string
}

export function StudentScheduleView({ institutionId }: StudentScheduleViewProps) {
  const [changes, setChanges] = useState<ScheduleChange[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChanges = async () => {
    setIsLoading(true)
    setError(null)
    const supabase = createClient()
    const { data, error: fetchError } = await supabase
      .from("schedule_changes")
      .select("*")
      .eq("institution_id", institutionId)
      .order("change_date", { ascending: true })
      .order("created_at", { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setChanges(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchChanges()
  }, [institutionId])

  return (
    <Card className="border-border">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Schedule Changes
          </CardTitle>
          <CardDescription>
            {changes.length} change{changes.length !== 1 ? "s" : ""} announced
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchChanges} disabled={isLoading}>
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
              <div key={i} className="p-4 rounded-lg bg-muted animate-pulse h-24" />
            ))}
          </div>
        ) : changes.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No schedule changes announced yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Check back later for updates
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {changes.map((change) => (
              <div
                key={change.id}
                className="p-4 rounded-lg bg-primary/5 border border-primary/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-semibold text-card-foreground truncate">
                    {change.subject_name}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-sm mb-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="line-through">{change.old_time}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <div className="flex items-center gap-1.5 text-primary font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{change.new_time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(change.change_date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>Posted {new Date(change.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
