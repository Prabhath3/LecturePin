"use client"

import { useState } from "react"
import { CalendarPlus, Clock, MapPin, FileText, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface EventFormProps {
  onSuccess?: () => void
  institutionId?: string
}

export function EventForm({ onSuccess, institutionId }: EventFormProps) {
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const supabase = createClient()
      
      const { error: insertError } = await supabase
        .from("events")
        .insert({
          event_name: eventName,
          event_description: eventDescription || null,
          event_date: eventDate,
          event_time: eventTime,
          location: location || null,
          institution_id: institutionId,
        })
      
      if (insertError) throw insertError
      
      setIsSuccess(true)
      setEventName("")
      setEventDescription("")
      setEventDate("")
      setEventTime("")
      setLocation("")
      
      onSuccess?.()
      
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to schedule event")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <CalendarPlus className="w-5 h-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl">Schedule Event</CardTitle>
            <CardDescription>
              Create events like exams, seminars, or workshops
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">Event scheduled successfully!</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="eventName"
                type="text"
                placeholder="e.g., Mid-term Examination"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eventDescription">Description (Optional)</Label>
            <Textarea
              id="eventDescription"
              placeholder="Add event details..."
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventTime">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="eventTime"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                type="text"
                placeholder="e.g., Main Auditorium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <CalendarPlus className="mr-2 w-4 h-4" />
                Schedule Event
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
