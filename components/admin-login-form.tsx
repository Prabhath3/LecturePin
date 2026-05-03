"use client"

import { useState } from "react"
import { Phone, Loader2, ShieldCheck, Building2, MapPin, Tag, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useAdminAuth } from "@/lib/admin-auth-context"
import type { Student } from "@/lib/types"

const EDUCATION_CATEGORIES = [
  { value: "school", label: "School" },
  { value: "college", label: "College" },
  { value: "university", label: "University" },
  { value: "coaching", label: "Coaching Center" },
  { value: "training", label: "Training Institute" },
  { value: "other", label: "Other" },
]

export function AdminLoginForm() {
  const { login } = useAdminAuth()
  const [mode, setMode] = useState<"login" | "register">("login")
  
  // Login state
  const [phoneNumber, setPhoneNumber] = useState("")
  
  // Register state
  const [fullName, setFullName] = useState("")
  const [institutionName, setInstitutionName] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [registerPhone, setRegisterPhone] = useState("")
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("students")
        .select("*")
        .eq("phone_number", phoneNumber.trim())
        .single()

      if (fetchError || !data) {
        setError("No admin found with this phone number. Please create an account first.")
        setIsLoading(false)
        return
      }

      login(data as Student)
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Check if phone already exists
      const { data: existing } = await supabase
        .from("students")
        .select("id")
        .eq("phone_number", registerPhone.trim())
        .single()

      if (existing) {
        setError("An account with this phone number already exists. Please login instead.")
        setIsLoading(false)
        return
      }

      // Create new admin user
      const { data, error: insertError } = await supabase
        .from("students")
        .insert({
          full_name: fullName.trim(),
          phone_number: registerPhone.trim(),
          institution_name: institutionName.trim(),
          category: category,
          location: location.trim(),
          is_admin: true,
        })
        .select()
        .single()

      if (insertError) {
        setError("Failed to create account. Please try again.")
        setIsLoading(false)
        return
      }

      login(data as Student)
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setPhoneNumber("")
    setFullName("")
    setInstitutionName("")
    setCategory("")
    setLocation("")
    setRegisterPhone("")
    setError(null)
  }

  const switchMode = (newMode: "login" | "register") => {
    resetForm()
    setMode(newMode)
  }

  return (
    <Card className="w-full max-w-md border-border shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">
          {mode === "login" ? "Admin Login" : "Create Admin Account"}
        </CardTitle>
        <CardDescription>
          {mode === "login" 
            ? "Enter your registered phone number to access the dashboard" 
            : "Register as a new admin for your educational institution"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Login to Dashboard
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">New here?</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => switchMode("register")}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Create New Admin Account
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mb-2 -ml-2 text-muted-foreground"
              onClick={() => switchMode("login")}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Button>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution / Education Section Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="institutionName"
                  type="text"
                  placeholder="e.g., ABC University, XYZ Coaching"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
                <Select value={category} onValueChange={setCategory} disabled={isLoading}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., New York, USA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registerPhone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="registerPhone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !category}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Create Admin Account
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
