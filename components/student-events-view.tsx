"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Clock, MapPin, RefreshCw, CalendarCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { Event } from "@/lib/types"

interface StudentEventsViewProps {
  institutionId: string
}

export function StudentEventsView({ institutionId }: StudentEventsViewProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    setIsLoading(true)
    setError(null)
    const supabase = createClient()
    const { data, error: fetchError } = await supabase
      .from("events")
      .select("*")
      .eq("institution_id", institutionId)
      .order("event_date", { ascending: true })
      .order("event_time", { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setEvents(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [institutionId])

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
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const isUpcoming = (dateStr: string) => {
    const eventDate = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return eventDate >= today
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-accent" />
            Upcoming Events
          </CardTitle>
          <CardDescription>
            {events.filter(e => isUpcoming(e.event_date)).length} upcoming event{events.filter(e => isUpcoming(e.event_date)).length !== 1 ? "s" : ""}
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
              <div key={i} className="p-4 rounded-lg bg-muted animate-pulse h-24" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No events scheduled yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Check back later for upcoming events
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => {
              const upcoming = isUpcoming(event.event_date)
              return (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${
                    upcoming 
                      ? "bg-accent/5 border-accent/20" 
                      : "bg-muted/50 border-border opacity-60"
                  }`}
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
                    {upcoming && (
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded flex-shrink-0">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
