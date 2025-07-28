"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Car, Star, MapPin, DollarSign, Users, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatCurrency } from "@/lib/utils"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/components/auth/AuthProvider"

// Mock data - in a real app, this would come from API
const mockInstructor = {
  id: "instructor1",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@drivelearn.com.au",
  phone: "+61 412 345 678",
  licenseNumber: "ABC123456",
  adiBadgeNumber: "12345",
  experience: 8,
  specialties: ["Manual", "Automatic", "Intensive Courses"],
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
  earnings: {
    total: 12450,
    thisMonth: 1850,
    pending: 325,
  },
}

const mockBookings = [
  {
    id: "booking1",
    date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    startTime: "10:00",
    duration: 1,
    status: "confirmed",
    student: {
      id: "student1",
      firstName: "Alex",
      lastName: "Smith",
      phone: "+61 412 111 222",
    },
    price: {
      total: 65,
    },
    location: "Sydney CBD",
    notes: "First lesson, focusing on basics",
  },
  {
    id: "booking2",
    date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    startTime: "14:00",
    duration: 1.5,
    status: "pending",
    student: {
      id: "student2",
      firstName: "Samantha",
      lastName: "Jones",
      phone: "+61 423 333 444",
    },
    price: {
      total: 97.5,
    },
    location: "North Sydney",
    notes: "Wants to practice highway driving",
  },
  {
    id: "booking3",
    date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    startTime: "11:00",
    duration: 2,
    status: "completed",
    student: {
      id: "student1",
      firstName: "Alex",
      lastName: "Smith",
      phone: "+61 412 111 222",
    },
    price: {
      total: 130,
    },
    location: "Eastern Suburbs",
    notes: "Worked on parallel parking and reverse parking",
  },
  {
    id: "booking4",
    date: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    startTime: "09:00",
    duration: 1,
    status: "completed",
    student: {
      id: "student3",
      firstName: "Michael",
      lastName: "Brown",
      phone: "+61 434 555 666",
    },
    price: {
      total: 65,
    },
    location: "CBD",
    notes: "Practiced city driving and traffic management",
  },
]

const mockReviews = [
  {
    id: "review1",
    bookingId: "booking3",
    studentId: "student1",
    studentName: "Alex Smith",
    rating: 5,
    comment: "Sarah was an excellent instructor. Very patient and explained everything clearly.",
    date: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "review2",
    bookingId: "booking4",
    studentId: "student3",
    studentName: "Michael Brown",
    rating: 4,
    comment: "Good instructor, helped me improve my city driving skills.",
    date: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
  },
]

export default function InstructorDashboard() {
  const { logout } = useAuth()
  const [instructor, setInstructor] = useState(mockInstructor)
  const [bookings, setBookings] = useState(mockBookings)
  const [reviews, setReviews] = useState(mockReviews)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // In a real app, fetch instructor data, bookings, and reviews from API
  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const upcomingBookings = bookings.filter((booking) => booking.status === "confirmed" || booking.status === "pending")
  const pastBookings = bookings.filter(
    (booking) => booking.status === "completed" || booking.status === "cancelled" || booking.status === "no-show",
  )

  const handleAcceptBooking = (bookingId: string) => {
    // In a real app, make API call to accept booking
    toast({
      title: "Booking accepted",
      description: "The booking has been confirmed.",
    })

    // Update local state
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "confirmed" } : booking)))
  }

  const handleRejectBooking = (bookingId: string) => {
    // In a real app, make API call to reject booking
    toast({
      title: "Booking rejected",
      description: "The booking has been rejected.",
    })

    // Update local state
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)))
  }

  const handleCompleteBooking = (bookingId: string) => {
    // In a real app, make API call to mark booking as completed
    toast({
      title: "Lesson completed",
      description: "The lesson has been marked as completed.",
    })

    // Update local state
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "completed" } : booking)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      case "no-show":
        return <Badge className="bg-gray-100 text-gray-800">No Show</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
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
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${instructor.firstName}+${instructor.lastName}`}
                      />
                      <AvatarFallback>
                        {instructor.firstName[0]}
                        {instructor.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>
                        {instructor.firstName} {instructor.lastName}
                      </CardTitle>
                      <CardDescription>Instructor</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-medium">{instructor.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">({instructor.totalReviews} reviews)</span>
                  </div>

                  <Separator className="my-4" />

                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/instructor/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/instructor/bookings">Bookings</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/instructor/availability">Availability</Link>
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
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/instructor/payouts">Payout Settings</Link>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(instructor.earnings.total)}</div>
                        <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(instructor.earnings.thisMonth)}</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {bookings.filter((b) => b.status === "pending").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Awaiting your confirmation</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Tabs defaultValue="upcoming" className="space-y-6">
                    <TabsList>
                      <TabsTrigger value="upcoming">Upcoming Lessons</TabsTrigger>
                      <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                      <TabsTrigger value="past">Past Lessons</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming">
                      <Card>
                        <CardHeader>
                          <CardTitle>Upcoming Lessons</CardTitle>
                          <CardDescription>Your confirmed upcoming driving lessons</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {upcomingBookings.filter((b) => b.status === "confirmed").length === 0 ? (
                            <div className="text-center py-8">
                              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Calendar className="h-6 w-6 text-primary" />
                              </div>
                              <h3 className="text-lg font-semibold mb-2">No upcoming lessons</h3>
                              <p className="text-muted-foreground mb-4">
                                You don't have any confirmed upcoming lessons.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {upcomingBookings
                                .filter((b) => b.status === "confirmed")
                                .map((booking) => (
                                  <div key={booking.id} className="border rounded-lg p-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center">
                                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                                          <span className="font-medium">{formatDate(booking.date)}</span>
                                          <span className="mx-2">•</span>
                                          <Clock className="h-4 w-4 mr-2 text-primary" />
                                          <span>
                                            {booking.startTime} ({booking.duration}{" "}
                                            {booking.duration === 1 ? "hour" : "hours"})
                                          </span>
                                        </div>
                                        <div className="flex items-center">
                                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                                          <span>{booking.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <span className="font-medium mr-2">Student:</span>
                                          <span>
                                            {booking.student.firstName} {booking.student.lastName}
                                          </span>
                                          <span className="text-sm text-muted-foreground ml-2">
                                            ({booking.student.phone})
                                          </span>
                                        </div>
                                        {booking.notes && (
                                          <div className="text-sm text-muted-foreground">
                                            <span className="font-medium">Notes:</span> {booking.notes}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex flex-col items-end gap-2">
                                        <div className="text-right">
                                          <div className="font-semibold">{formatCurrency(booking.price.total)}</div>
                                          {getStatusBadge(booking.status)}
                                        </div>
                                        <div className="flex gap-2">
                                          <Button size="sm" variant="outline" asChild>
                                            <Link href={`/instructor/bookings/${booking.id}`}>View Details</Link>
                                          </Button>
                                          <Button size="sm" onClick={() => handleCompleteBooking(booking.id)}>
                                            Mark Complete
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="pending">
                      <Card>
                        <CardHeader>
                          <CardTitle>Pending Requests</CardTitle>
                          <CardDescription>Lesson requests awaiting your confirmation</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {upcomingBookings.filter((b) => b.status === "pending").length === 0 ? (
                            <div className="text-center py-8">
                              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6 text-primary" />
                              </div>
                              <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                              <p className="text-muted-foreground mb-4">You don't have any pending lesson requests.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {upcomingBookings
                                .filter((b) => b.status === "pending")
                                .map((booking) => (
                                  <div key={booking.id} className="border rounded-lg p-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center">
                                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                                          <span className="font-medium">{formatDate(booking.date)}</span>
                                          <span className="mx-2">•</span>
                                          <Clock className="h-4 w-4 mr-2 text-primary" />
                                          <span>
                                            {booking.startTime} ({booking.duration}{" "}
                                            {booking.duration === 1 ? "hour" : "hours"})
                                          </span>
                                        </div>
                                        <div className="flex items-center">
                                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                                          <span>{booking.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <span className="font-medium mr-2">Student:</span>
                                          <span>
                                            {booking.student.firstName} {booking.student.lastName}
                                          </span>
                                          <span className="text-sm text-muted-foreground ml-2">
                                            ({booking.student.phone})
                                          </span>
                                        </div>
                                        {booking.notes && (
                                          <div className="text-sm text-muted-foreground">
                                            <span className="font-medium">Notes:</span> {booking.notes}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex flex-col items-end gap-2">
                                        <div className="text-right">
                                          <div className="font-semibold">{formatCurrency(booking.price.total)}</div>
                                          {getStatusBadge(booking.status)}
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRejectBooking(booking.id)}
                                          >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reject
                                          </Button>
                                          <Button size="sm" onClick={() => handleAcceptBooking(booking.id)}>
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Accept
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="past">
                      <Card>
                        <CardHeader>
                          <CardTitle>Past Lessons</CardTitle>
                          <CardDescription>Your completed and cancelled lessons</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {pastBookings.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6 text-primary" />
                              </div>
                              <h3 className="text-lg font-semibold mb-2">No past lessons</h3>
                              <p className="text-muted-foreground mb-4">You haven't conducted any lessons yet.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {pastBookings.map((booking) => (
                                <div key={booking.id} className="border rounded-lg p-4">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                                        <span className="font-medium">{formatDate(booking.date)}</span>
                                        <span className="mx-2">•</span>
                                        <Clock className="h-4 w-4 mr-2 text-primary" />
                                        <span>
                                          {booking.startTime} ({booking.duration}{" "}
                                          {booking.duration === 1 ? "hour" : "hours"})
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                                        <span>{booking.location}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="font-medium mr-2">Student:</span>
                                        <span>
                                          {booking.student.firstName} {booking.student.lastName}
                                        </span>
                                      </div>
                                      {booking.notes && (
                                        <div className="text-sm text-muted-foreground">
                                          <span className="font-medium">Notes:</span> {booking.notes}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                      <div className="text-right">
                                        <div className="font-semibold">{formatCurrency(booking.price.total)}</div>
                                        {getStatusBadge(booking.status)}
                                      </div>
                                      <Button size="sm" variant="outline" asChild>
                                        <Link href={`/instructor/bookings/${booking.id}`}>View Details</Link>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="reviews">
                      <Card>
                        <CardHeader>
                          <CardTitle>Reviews</CardTitle>
                          <CardDescription>Reviews from your students</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {reviews.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Star className="h-6 w-6 text-primary" />
                              </div>
                              <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                              <p className="text-muted-foreground mb-4">You haven't received any reviews yet.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {reviews.map((review) => (
                                <div key={review.id} className="border rounded-lg p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium mb-1">{review.studentName}</div>
                                      <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                          />
                                        ))}
                                        <span className="text-sm text-muted-foreground ml-2">
                                          {new Date(review.date).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm">{review.comment}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
