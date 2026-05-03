"use client"

import { useState } from "react"
import { BookOpen, Clock, Calendar, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface ScheduleChangeFormProps {
  onSuccess?: () => void
  institutionId?: string
}

export function ScheduleChangeForm({ onSuccess, institutionId }: ScheduleChangeFormProps) {
  const [subjectName, setSubjectName] = useState("")
  const [oldTime, setOldTime] = useState("")
  const [newTime, setNewTime] = useState("")
  const [changeDate, setChangeDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      const supabase = createClient()
      
      const { error: insertError } = await supabase
        .from("schedule_changes")
        .insert({
          subject_name: subjectName.trim(),
          old_time: oldTime.trim(),
          new_time: newTime.trim(),
          change_date: changeDate,
          institution_id: institutionId,
        })
      
      if (insertError) {
        throw insertError
      }
      
      setSuccess(true)
      setSubjectName("")
      setOldTime("")
      setNewTime("")
      setChangeDate("")
      
      if (onSuccess) {
        onSuccess()
      }
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post schedule change.")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card className="border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
          <Send className="w-5 h-5 text-primary" />
          Post Schedule Change
        </CardTitle>
        <CardDescription>
          Post a new schedule change to notify all registered students instantly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="subjectName">Subject Name</Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="subjectName"
                type="text"
                placeholder="e.g., Computer Science 101"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oldTime">Old Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="oldTime"
                  type="text"
                  placeholder="e.g., 9:00 AM"
                  value={oldTime}
                  onChange={(e) => setOldTime(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newTime">New Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="newTime"
                  type="text"
                  placeholder="e.g., 2:00 PM"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="changeDate">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="changeDate"
                type="date"
                value={changeDate}
                onChange={(e) => setChangeDate(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 rounded-lg bg-green-100 text-green-700 text-sm">
              Schedule change posted successfully! All students have been notified.
            </div>
          )}
          
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Post & Notify Students
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
