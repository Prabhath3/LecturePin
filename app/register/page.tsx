import { Header } from "@/components/header"
import { RegistrationForm } from "@/components/registration-form"
import { GraduationCap } from "lucide-react"

export const metadata = {
  title: "Student Registration - LecturePin",
  description: "Register to receive instant schedule change alerts and event notifications",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Join LecturePin
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
              Register with your details to start receiving instant notifications 
              for schedule changes, events, and reminders - even offline!
            </p>
          </div>
          
          {/* Registration form */}
          <div className="flex justify-center">
            <RegistrationForm />
          </div>
          
          {/* Info cards */}
          <div className="mt-16 grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-primary mb-2">1</div>
              <h3 className="font-semibold text-card-foreground mb-1">Register</h3>
              <p className="text-sm text-muted-foreground">
                Enter your name and phone number
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-primary mb-2">2</div>
              <h3 className="font-semibold text-card-foreground mb-1">Secure</h3>
              <p className="text-sm text-muted-foreground">
                Your info is stored securely
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <h3 className="font-semibold text-card-foreground mb-1">Get Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Receive schedule and event alerts
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-accent mb-2">4</div>
              <h3 className="font-semibold text-card-foreground mb-1">Offline</h3>
              <p className="text-sm text-muted-foreground">
                Reminders work without internet
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
