"use client"

import { CalendarDays, ArrowRight, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"

export function CalendarPreview() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
  const currentDay = 2 // Wednesday
  
  return (
    <Card className="w-full max-w-md p-6 bg-card border-border shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-card-foreground">May 2026</h3>
          <p className="text-sm text-muted-foreground">Week 18</p>
        </div>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {days.map((day, i) => (
          <div 
            key={day} 
            className={`text-center text-xs font-medium py-2 rounded-md ${
              i === currentDay 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Schedule change highlight */}
      <div className="relative p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="absolute -top-2 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
          Schedule Changed
        </div>
        
        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-card-foreground">Computer Science 101</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground line-through">
              <Clock className="w-3.5 h-3.5" />
              <span>9:00 AM</span>
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
            <div className="flex items-center gap-1.5 text-primary font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>2:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
