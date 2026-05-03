"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Clock, ArrowRight, RefreshCw, BookOpen, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { ScheduleChange } from "@/lib/types"

interface ScheduleChangesListProps {
  refreshKey?: number
  institutionId?: string
}

export function ScheduleChangesList({ refreshKey, institutionId }: ScheduleChangesListProps) {
  const [changes, setChanges] = useState<ScheduleChange[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const fetchChanges = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      let query = supabase
        .from("schedule_changes")
        .select("*")
      
      if (institutionId) {
        query = query.eq("institution_id", institutionId)
      }
      
      const { data, error: fetchError } = await query.order("created_at", { ascending: false })
      
      if (fetchError) {
        throw fetchError
      }
      
      setChanges(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch schedule changes")
    } finally {
      setIsLoading(false)
    }
  }
  
  const deleteChange = async (id: string) => {
    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase
        .from("schedule_changes")
        .delete()
        .eq("id", id)
      if (!deleteError) {
        setChanges((prev) => prev.filter((c) => c.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchChanges()
  }, [refreshKey])
  
  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Schedule Changes
          </CardTitle>
          <CardDescription>
            {changes.length} schedule change{changes.length !== 1 ? "s" : ""} posted
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
          <div className="text-center py-8 text-muted-foreground">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No schedule changes posted yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {changes.map((change) => (
              <div
                key={change.id}
                className="p-4 rounded-lg bg-primary/5 border border-primary/10"
              >
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-semibold text-card-foreground truncate">
                      {change.subject_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded hidden sm:block">
                      {new Date(change.change_date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteChange(change.id)}
                      disabled={deletingId === change.id}
                      aria-label="Delete schedule change"
                    >
                      {deletingId === change.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
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
                
                <div className="mt-2 text-xs text-muted-foreground">
                  Posted {new Date(change.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
