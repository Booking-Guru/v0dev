"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Car, Clock, Calendar, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/components/auth/AuthProvider"

const timeSlots = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
]

const daysOfWeek = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
]

export default function AvailabilityPage() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [availability, setAvailability] = useState({
    monday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    thursday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    friday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    saturday: ["09:00", "10:00", "11:00"],
    sunday: [],
  })

  const { toast } = useToast()

  const handleTimeSlotToggle = (day: string, time: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day as keyof typeof prev].includes(time)
        ? prev[day as keyof typeof prev].filter((t) => t !== time)
        : [...prev[day as keyof typeof prev], time].sort(),
    }))
  }

  const handleDayToggle = (day: string, enabled: boolean) => {
    if (enabled) {
      setAvailability((prev) => ({
        ...prev,
        [day]: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      }))
    } else {
      setAvailability((prev) => ({
        ...prev,
        [day]: [],
      }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Availability updated",
        description: "Your availability has been saved successfully.",
      })
      setLoading(false)
    }, 1000)
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute requiredRole="instructor">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">BookingGuru</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/instructor/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} />
                      <AvatarFallback>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <CardDescription>Instructor</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/instructor/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/instructor/bookings">Bookings</Link>
                    </Button>
                    <Button variant="default" className="w-full justify-start">
                      Availability
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/instructor/earnings">Earnings</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/instructor/reviews">Reviews</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/instructor/profile">Profile</Link>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold">Availability Settings</h1>
                  <p className="text-muted-foreground">Set your weekly availability for driving lessons</p>
                </div>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Weekly Schedule
                  </CardTitle>
                  <CardDescription>
                    Select the days and times when you're available to teach driving lessons
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {daysOfWeek.map((day) => {
                    const dayAvailability = availability[day.key as keyof typeof availability]
                    const isDayEnabled = dayAvailability.length > 0

                    return (
                      <div key={day.key} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Switch
                              checked={isDayEnabled}
                              onCheckedChange={(checked) => handleDayToggle(day.key, checked)}
                            />
                            <Label className="text-lg font-medium">{day.label}</Label>
                            {isDayEnabled && (
                              <Badge variant="secondary">
                                {dayAvailability.length} slot{dayAvailability.length !== 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                          {isDayEnabled && (
                            <div className="text-sm text-muted-foreground">
                              {dayAvailability.length > 0
                                ? `${dayAvailability[0]} - ${dayAvailability[dayAvailability.length - 1]}`
                                : "No times selected"}
                            </div>
                          )}
                        </div>

                        {isDayEnabled && (
                          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 ml-8">
                            {timeSlots.map((time) => {
                              const isSelected = dayAvailability.includes(time)
                              return (
                                <Button
                                  key={time}
                                  variant={isSelected ? "default" : "outline"}
                                  size="sm"
                                  className="h-8 text-xs"
                                  onClick={() => handleTimeSlotToggle(day.key, time)}
                                >
                                  {time}
                                </Button>
                              )
                            })}
                          </div>
                        )}

                        {day.key !== "sunday" && <Separator />}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    const standardHours = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
                    setAvailability({
                      monday: standardHours,
                      tuesday: standardHours,
                      wednesday: standardHours,
                      thursday: standardHours,
                      friday: standardHours,
                      saturday: ["09:00", "10:00", "11:00"],
                      sunday: [],
                    })
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Standard Hours</h3>
                      <p className="text-sm text-muted-foreground">
                        Mon-Fri: 9AM-12PM, 2PM-6PM
                        <br />
                        Sat: 9AM-12PM
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    const fullDayHours = [
                      "08:00",
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                    ]
                    setAvailability({
                      monday: fullDayHours,
                      tuesday: fullDayHours,
                      wednesday: fullDayHours,
                      thursday: fullDayHours,
                      friday: fullDayHours,
                      saturday: fullDayHours,
                      sunday: fullDayHours,
                    })
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Full Availability</h3>
                      <p className="text-sm text-muted-foreground">
                        Available all days
                        <br />
                        8AM-6PM
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setAvailability({
                      monday: [],
                      tuesday: [],
                      wednesday: [],
                      thursday: [],
                      friday: [],
                      saturday: [],
                      sunday: [],
                    })
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <Clock className="h-6 w-6 text-red-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Clear All</h3>
                      <p className="text-sm text-muted-foreground">
                        Remove all availability
                        <br />
                        Start fresh
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Availability Summary</CardTitle>
                  <CardDescription>Overview of your weekly availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Total Hours per Week</h4>
                      <div className="text-3xl font-bold text-primary">
                        {Object.values(availability).flat().length} hours
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Active Days</h4>
                      <div className="text-3xl font-bold text-primary">
                        {Object.values(availability).filter((day) => day.length > 0).length} days
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h4 className="font-medium mb-3">Peak Hours</h4>
                    <div className="flex flex-wrap gap-2">
                      {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => {
                        const count = Object.values(availability).filter((day) => day.includes(time)).length
                        return (
                          <Badge key={time} variant={count >= 5 ? "default" : "secondary"}>
                            {time} ({count} days)
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
