"use client"

import { Bell } from "lucide-react"

export function AnimatedBell() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-32 h-32 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute w-48 h-48 rounded-full border-2 border-primary/15 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
        <div className="absolute w-64 h-64 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.6s' }} />
      </div>
      
      {/* Static glow rings */}
      <div className="absolute w-40 h-40 rounded-full bg-primary/5 blur-xl" />
      <div className="absolute w-28 h-28 rounded-full bg-primary/10 blur-lg" />
      
      {/* Bell icon container with glow */}
      <div className="relative z-10 w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
        <Bell className="w-12 h-12 text-primary-foreground animate-[wiggle_1s_ease-in-out_infinite]" />
      </div>
    </div>
  )
}
