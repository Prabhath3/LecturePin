"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const pathname = usePathname()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">LecturePin</span>
        </Link>
        
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant={pathname === "/dashboard" ? "default" : "ghost"} 
            size="sm" 
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Student</span>
            </Link>
          </Button>
          <Button 
            variant={pathname === "/register" ? "default" : "ghost"} 
            size="sm" 
            asChild
          >
            <Link href="/register">
              <span className="hidden sm:inline">Register</span>
              <span className="sm:hidden">Sign Up</span>
            </Link>
          </Button>
          <Button 
            variant={pathname === "/admin" ? "default" : "outline"} 
            size="sm" 
            asChild
          >
            <Link href="/admin">Admin</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
