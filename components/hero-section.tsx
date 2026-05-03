"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, WifiOff, CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedBell } from "@/components/animated-bell"
import { CalendarPreview } from "@/components/calendar-preview"

export function HeroSection() {
  const router = useRouter()

  const handleRegisterClick = () => {
    router.push("/register")
  }

  const handleDashboardClick = () => {
    router.push("/dashboard")
  }

  const handleAdminClick = () => {
    router.push("/admin")
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Real-time Alerts
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  <WifiOff className="w-3.5 h-3.5" />
                  Offline Reminders
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <CalendarPlus className="w-3.5 h-3.5" />
                  Event Scheduling
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Never Miss a{" "}
                <span className="text-primary">Class</span>{" "}
                Again
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl text-pretty">
                The ultimate schedule management platform for schools, colleges, universities, 
                and coaching centers. Get instant alerts, schedule events, and stay connected 
                with offline reminders - even without internet access.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                type="button"
                size="lg" 
                onClick={handleRegisterClick}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                Register as Student
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                type="button"
                size="lg" 
                variant="secondary"
                onClick={handleDashboardClick}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                Student Dashboard
              </Button>
              <Button 
                type="button"
                size="lg" 
                variant="outline"
                onClick={handleAdminClick}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                Admin
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div>
                <div className="text-2xl font-bold text-foreground">Instant</div>
                <div className="text-sm text-muted-foreground">Notifications</div>
              </div>
              <div className="w-px bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground">Offline</div>
                <div className="text-sm text-muted-foreground">Reminders</div>
              </div>
              <div className="w-px bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground">Events</div>
                <div className="text-sm text-muted-foreground">Scheduling</div>
              </div>
              <div className="w-px bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground">All</div>
                <div className="text-sm text-muted-foreground">Education</div>
              </div>
            </div>
          </div>
          
          {/* Right content - Bell and Calendar */}
          <div className="relative flex flex-col items-center gap-8">
            <div className="relative h-72 flex items-center justify-center">
              <AnimatedBell />
            </div>
            <CalendarPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
