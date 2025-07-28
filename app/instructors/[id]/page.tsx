"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Car, Star, MapPin, Clock, CheckCircle, Phone, Mail, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"

// Mock data - in a real app, this would come from API
const mockInstructor = {
  id: "instructor1",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@drivelearn.com.au",
  phone: "+61 412 345 678",
  bio: "I'm a patient and experienced driving instructor with over 8 years of teaching experience. I specialize in helping nervous drivers build confidence on the road. My teaching style is calm and methodical, focusing on developing good driving habits from the start.",
  licenseNumber: "ABC123456",
  adiBadgeNumber: "12345",
  experience: 8,
  specialties: ["Manual", "Automatic", "Intensive Courses", "Nervous Drivers", "Test Preparation"],
  hourlyRate: 65,
  rating: 4.9,
  totalReviews: 127,
  location: {
    city: "Sydney",
    areas: ["CBD", "North Shore", "Eastern Suburbs"],
  },
  vehicle: {
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    transmission: "manual",
    dualControls: true,
  },
  availability: {
    monday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    thursday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    friday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    saturday: ["09:00", "10:00", "11:00"],
    sunday: [],
  },
  isVerified: true,
}

const mockReviews = [
  {
    id: "review1",
    studentName: "Alex Smith",
    rating: 5,
    comment:
      "Sarah was an excellent instructor. Very patient and explained everything clearly. I passed my test on the first attempt thanks to her guidance!",
    date: new Date("2024-01-15"),
  },
  {
    id: "review2",
    studentName: "Michael Brown",
    rating: 4,
    comment:
      "Good instructor, helped me improve my city driving skills. Would recommend for anyone who needs to build confidence in busy traffic.",
    date: new Date("2024-01-06"),
  },
  {
    id: "review3",
    studentName: "Emma Wilson",
    rating: 5,
    comment:
      "I was a very nervous driver but Sarah helped me overcome my fears. Her calm approach and clear instructions made all the difference.",
    date: new Date("2023-12-20"),
  },
  {
    id: "review4",
    studentName: "James Taylor",
    rating: 5,
    comment:
      "Excellent instructor! Sarah is very knowledgeable and professional. The dual control car was modern and easy to drive.",
    date: new Date("2023-12-10"),
  },
]

export default function InstructorProfilePage({ params }: { params: { id: string } }) {
  const [instructor, setInstructor] = useState(mockInstructor)
  const [reviews, setReviews] = useState(mockReviews)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // In a real app, fetch instructor data from API
  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  // Update available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const dayName = selectedDate
        .toLocaleDateString("en-US", {
          weekday: "long",
        })
        .toLowerCase() as keyof typeof instructor.availability
      setAvailableSlots(instructor.availability[dayName] || [])
      setSelectedTime(null)
    }
  }, [selectedDate, instructor.availability])

  const handleBookLesson = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select a date and time",
        description: "You need to select both a date and time to book a lesson.",
        variant: "destructive",
      })
      return
    }

    // Navigate to booking page with pre-selected instructor, date and time
    router.push(`/booking/${instructor.id}?date=${selectedDate.toISOString()}&time=${selectedTime}`)
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today || date.getDay() === 0 // Disable past dates and Sundays
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">DriveLearn</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/instructors">All Instructors</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/instructors" className="text-primary hover:underline">
            ← Back to Instructors
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Instructor Profile */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Image
                      src={`https://ui-avatars.com/api/?name=${instructor.firstName}+${instructor.lastName}&size=200`}
                      alt={`${instructor.firstName} ${instructor.lastName}`}
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h1 className="text-3xl font-bold">
                        {instructor.firstName} {instructor.lastName}
                      </h1>
                      {instructor.isVerified && (
                        <Badge className="ml-2 bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-medium">{instructor.rating}</span>
                      </div>
                      <span className="text-muted-foreground ml-2">({instructor.totalReviews} reviews)</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-primary mr-2" />
                        <span>{instructor.location.city}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-primary mr-2" />
                        <span>{instructor.experience} years experience</span>
                      </div>
                      <div className="flex items-center">
                        <Car className="h-4 w-4 text-primary mr-2" />
                        <span>
                          {instructor.vehicle.make} {instructor.vehicle.model} ({instructor.vehicle.year}) -{" "}
                          {instructor.vehicle.transmission.charAt(0).toUpperCase() +
                            instructor.vehicle.transmission.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {instructor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <Button asChild>
                        <Link href={`/booking/${instructor.id}`}>Book Lesson</Link>
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <Phone className="h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="about" className="space-y-6">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                <TabsTrigger value="areas">Service Areas</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>About {instructor.firstName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6">{instructor.bio}</p>

                    <h3 className="text-lg font-semibold mb-2">Teaching Style</h3>
                    <p className="mb-6">
                      My teaching approach is patient and methodical. I believe in creating a relaxed learning
                      environment where students can build confidence at their own pace. I focus on developing good
                      driving habits from the start and provide clear, concise instructions.
                    </p>

                    <h3 className="text-lg font-semibold mb-2">Qualifications</h3>
                    <ul className="list-disc pl-5 space-y-1 mb-6">
                      <li>Fully qualified ADI (Approved Driving Instructor)</li>
                      <li>Advanced driving certification</li>
                      <li>Specialized training for teaching nervous drivers</li>
                      <li>First aid certified</li>
                    </ul>

                    <h3 className="text-lg font-semibold mb-2">Vehicle Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Make & Model</p>
                        <p className="text-muted-foreground">
                          {instructor.vehicle.make} {instructor.vehicle.model}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Year</p>
                        <p className="text-muted-foreground">{instructor.vehicle.year}</p>
                      </div>
                      <div>
                        <p className="font-medium">Transmission</p>
                        <p className="text-muted-foreground">
                          {instructor.vehicle.transmission.charAt(0).toUpperCase() +
                            instructor.vehicle.transmission.slice(1)}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Dual Controls</p>
                        <p className="text-muted-foreground">{instructor.vehicle.dualControls ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <CardDescription>See what other students are saying</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{review.studentName}</div>
                            <div className="text-sm text-muted-foreground">{review.date.toLocaleDateString()}</div>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="areas">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Areas</CardTitle>
                    <CardDescription>Areas where {instructor.firstName} provides driving lessons</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Primary Location</h3>
                      <p className="text-muted-foreground">{instructor.location.city}</p>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">Areas Covered</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {instructor.location.areas.map((area) => (
                        <li key={area} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book a Lesson</CardTitle>
                <CardDescription>Select a date and time to book with {instructor.firstName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold text-center">
                  {formatCurrency(instructor.hourlyRate)}
                  <span className="text-sm font-normal text-muted-foreground"> / hour</span>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    className="rounded-md border"
                  />
                </div>

                {selectedDate && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Available Times</h3>
                    {availableSlots.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No available slots for this date.</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <Button className="w-full" disabled={!selectedDate || !selectedTime} onClick={handleBookLesson}>
                  Book Now
                </Button>

                <div className="text-xs text-center text-muted-foreground">
                  You can cancel or reschedule up to 24 hours before your lesson
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">{instructor.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">{instructor.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
