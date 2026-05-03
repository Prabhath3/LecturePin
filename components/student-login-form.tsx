"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone, Loader2, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useStudentAuth } from "@/lib/student-auth-context"

export function StudentLoginForm() {
  const { login } = useStudentAuth()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("students")
        .select("*")
        .eq("phone_number", phoneNumber.trim())
        .eq("is_admin", false)
        .single()

      if (fetchError || !data) {
        setError("Student not found. Please check your phone number or register first.")
        return
      }

      if (!data.institution_id) {
        setError("Your account is not linked to an education sector. Please contact your admin.")
        return
      }

      login(data)
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-border shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <GraduationCap className="w-7 h-7 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-card-foreground">
          Student Login
        </CardTitle>
        <CardDescription>
          Enter your registered phone number to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login to Dashboard"
            )}
          </Button>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Not registered yet?
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/register">Register as Student</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
