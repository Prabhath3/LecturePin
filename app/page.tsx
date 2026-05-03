"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Bell, Users, Clock, Shield, WifiOff, CalendarPlus, School, GraduationCap, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Receive alerts the moment your schedule changes, ensuring you never miss important updates.",
  },
  {
    icon: WifiOff,
    title: "Offline Reminders",
    description: "Get reminders even without internet connection. Never miss a class due to connectivity issues.",
  },
  {
    icon: CalendarPlus,
    title: "Event Scheduling",
    description: "Schedule and manage events like exams, seminars, workshops, and special classes easily.",
  },
  {
    icon: School,
    title: "All Education Sectors",
    description: "Perfect for schools, colleges, universities, coaching centers, and training institutes.",
  },
  {
    icon: Users,
    title: "Easy Registration",
    description: "Simple registration process. Just your name and phone number to get started.",
  },
  {
    icon: Shield,
    title: "Reliable & Secure",
    description: "Your information is kept secure and only used for schedule notifications.",
  },
]

export default function HomePage() {
  const router = useRouter()

  const handleRegisterClick = () => {
    router.push("/register")
  }

  const handleAdminClick = () => {
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        
        {/* Features section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose LecturePin?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
                Built for all education sectors - schools, colleges, universities, coaching centers, 
                and training institutes. Streamline communication with offline support.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card 
                  key={feature.title} 
                  className="group border-border hover:border-primary/30 transition-colors duration-300"
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-card-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to stay informed about your lecture schedule.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: "01", title: "Register", description: "Enter your name and phone number to join the alert system." },
                { step: "02", title: "Stay Connected", description: "Your registration is saved securely in our system." },
                { step: "03", title: "Get Notified", description: "Receive instant alerts when schedule changes are posted." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
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
                variant="outline"
                onClick={handleAdminClick}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                Go to Admin Dashboard
              </Button>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 border-t border-border bg-card">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">LecturePin</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Schedule Alert System for All Education Sectors
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
