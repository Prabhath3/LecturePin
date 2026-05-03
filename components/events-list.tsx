"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Clock, MapPin, Loader2, RefreshCw, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { Event } from "@/lib/types"

interface EventsListProps {
  refreshKey?: number
  institutionId?: string
}

export function EventsList({ refreshKey, institutionId }: EventsListProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchEvents = async () => {
    setIsLoading(true)
    setError(null)
    const supabase = createClient()
    let query = supabase
      .from("events")
      .select("*")
    
    if (institutionId) {
      query = query.eq("institution_id", institutionId)
    }
    
    const { data, error: fetchError } = await query
      .order("event_date", { ascending: true })
      .order("event_time", { ascending: true })
    if (fetchError) {
      setError(fetchError.message)
    } else {
      setEvents(data || [])
    }
    setIsLoading(false)
  }

  const deleteEvent = async (id: string) => {
    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase
        .from("events")
        .delete()
        .eq("id", id)
      if (!deleteError) {
        setEvents((prev) => prev.filter((e) => e.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }
  
  useEffect(() => {
    fetchEvents()
  }, [refreshKey])
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
  
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }
  
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-accent" />
            Scheduled Events
          </CardTitle>
          <CardDescription>
            {events.length} event{events.length !== 1 ? "s" : ""} scheduled
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchEvents} disabled={isLoading}>
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
              <div key={i} className="p-4 rounded-lg bg-muted animate-pulse h-20" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No events scheduled yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-lg bg-muted/30 border border-border hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-card-foreground truncate">
                      {event.event_name}
                    </h4>
                    {event.event_description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {event.event_description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(event.event_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(event.event_time)}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteEvent(event.id)}
                    disabled={deletingId === event.id}
                    aria-label="Delete event"
                  >
                    {deletingId === event.id ? (
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
