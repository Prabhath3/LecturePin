"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ScheduleChangeForm } from "@/components/schedule-change-form"
import { StudentsList } from "@/components/students-list"
import { ScheduleChangesList } from "@/components/schedule-changes-list"
import { EventForm } from "@/components/event-form"
import { EventsList } from "@/components/events-list"
import { AdminLoginForm } from "@/components/admin-login-form"
import { AdminProfileCard } from "@/components/admin-profile-card"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Shield, Bell, CalendarPlus, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPage() {
  const { user, isLoading } = useAdminAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const [eventRefreshKey, setEventRefreshKey] = useState(0)
  
  const handleSchedulePosted = () => {
    setRefreshKey((prev) => prev + 1)
  }
  
  const handleEventPosted = () => {
    setEventRefreshKey((prev) => prev + 1)
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <AdminLoginForm />
        </main>
      </div>
    )
  }
  
  // Show dashboard for authenticated users
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user.full_name}
              </p>
            </div>
          </div>

          {/* Profile card */}
          <div className="mb-6">
            <AdminProfileCard />
          </div>
          
          {/* Alert banners */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-card-foreground">
                Schedule changes instantly alert all registered students.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 flex items-center gap-3">
              <CalendarPlus className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-sm text-card-foreground">
                Schedule events for exams, seminars, and special sessions.
              </p>
            </div>
          </div>
        </div>
        
        {/* Dashboard with tabs */}
        <Tabs defaultValue="schedules" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="schedules" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Schedule Changes
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarPlus className="w-4 h-4" />
              Events
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedules" className="space-y-0">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <ScheduleChangeForm onSuccess={handleSchedulePosted} institutionId={user.id} />
              </div>
              <div className="space-y-8">
                <StudentsList refreshKey={refreshKey} institutionId={user.id} />
                <ScheduleChangesList refreshKey={refreshKey} institutionId={user.id} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-0">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <EventForm onSuccess={handleEventPosted} institutionId={user.id} />
              </div>
              <div>
                <EventsList refreshKey={eventRefreshKey} institutionId={user.id} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
