"use client"

import { useState, useEffect } from "react"
import { User, Phone, Loader2, CheckCircle2, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { Student } from "@/lib/types"

export function RegistrationForm() {
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [institutionId, setInstitutionId] = useState("")
  const [institutions, setInstitutions] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInstitutions = async () => {
      setIsLoadingInstitutions(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("is_admin", true)
        .order("institution_name", { ascending: true })
      
      if (!error && data) {
        setInstitutions(data)
      }
      setIsLoadingInstitutions(false)
    }
    fetchInstitutions()
  }, [])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    if (!institutionId) {
      setError("Please select your education sector")
      setIsLoading(false)
      return
    }
    
    try {
      const supabase = createClient()
      
      const { error: insertError } = await supabase
        .from("students")
        .insert({
          full_name: fullName.trim(),
          phone_number: phoneNumber.trim(),
          institution_id: institutionId,
          is_admin: false,
        })
      
      if (insertError) {
        throw insertError
      }
      
      setIsSuccess(true)
      setFullName("")
      setPhoneNumber("")
      setInstitutionId("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card className="w-full max-w-md border-border shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-card-foreground">
          Student Registration
        </CardTitle>
        <CardDescription className="text-center">
          Register to receive instant schedule change alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-card-foreground">Registration Successful!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You will now receive alerts for schedule changes and events.
              </p>
              <p className="text-sm text-primary mt-2">
                Use your phone number to login to your Student Dashboard.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsSuccess(false)}
            >
              Register Another Student
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Education Sector</Label>
                <Select value={institutionId} onValueChange={setInstitutionId} disabled={isLoadingInstitutions}>
                  <SelectTrigger id="institution" className="w-full">
                    <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder={isLoadingInstitutions ? "Loading institutions..." : "Select your institution"} />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No institutions available
                      </SelectItem>
                    ) : (
                      institutions.map((inst) => (
                        <SelectItem key={inst.id} value={inst.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{inst.institution_name}</span>
                            {inst.location && (
                              <span className="text-xs text-muted-foreground">{inst.location}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {institutions.length === 0 && !isLoadingInstitutions && (
                  <p className="text-xs text-muted-foreground">
                    No education sectors available. Ask your admin to register first.
                  </p>
                )}
              </div>

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
            </div>
            
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              size="lg" 
              disabled={isLoading || institutions.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register for Alerts"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
