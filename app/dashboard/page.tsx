"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Car, Star, MapPin, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatCurrency } from "@/lib/utils"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/components/auth/AuthProvider"

// Mock data - in a real app, this would come from API
const mockBookings = [
  {
    id: "booking1",
    date: new Date("2024-02-15"),
    startTime: "10:00",
    duration: 1,
    status: "completed",
    instructor: {
      id: "instructor1",
      firstName: "Sarah",
      lastName: "Johnson",
      rating: 4.9,
    },
    price: {
      total: 65,
    },
    location: "Sydney CBD",
    notes: "Worked on parallel parking and reverse parking",
    reviewed: true,
  },
  {
    id: "booking2",
    date: new Date("2024-02-22"),
    startTime: "14:00",
    duration: 1.5,
    status: "completed",
    instructor: {
      id: "instructor1",
      firstName: "Sarah",
      lastName: "Johnson",
      rating: 4.9,
    },
    price: {
      total: 97.5,
    },
    location: "North Sydney",
    notes: "Highway driving practice",
    reviewed: false,
  },
  {
    id: "booking3",
    date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    startTime: "11:00",
    duration: 2,
    status: "confirmed",
    instructor: {
      id: "instructor2",
      firstName: "Michael",
      lastName: "Chen",
      rating: 4.8,
    },
    price: {
      total: 120,
    },
    location: "Parramatta",
    notes: "",
    reviewed: false,
  },
  {
    id: "booking4",
    date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    startTime: "09:00",
    duration: 1,
    status: "pending",
    instructor: {
      id: "instructor3",
      firstName: "Emma",
      lastName: "Wilson",
      rating: 4.9,
    },
    price: {
      total: 58,
    },
    location: "Inner West",
    notes: "",
    reviewed: false,
  },
]

const mockReviews = [
  {
    id: "review1",
    bookingId: "booking1",
    instructorId: "instructor1",
    instructorName: "Sarah Johnson",
    rating: 5,
    comment: "Sarah was an excellent instructor. Very patient and explained everything clearly.",
    date: new Date("2024-02-16"),
  },
]

export default function UserDashboard() {
  const { user, logout, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState(mockBookings)
  const [reviews, setReviews] = useState(mockReviews)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // In a real app, fetch user data, bookings, and reviews from API
  useEffect(() => {
    if (user) {
      // Simulate API call
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }, [user])

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Don't render if user is null
  if (!user) {
    return null
  }

  const upcomingBookings = bookings.filter((booking) => booking.status === "confirmed" || booking.status === "pending")
  const pastBookings = bookings.filter(
    (booking) => booking.status === "completed" || booking.status === "cancelled" || booking.status === "no-show",
  )

  const handleCancelBooking = (bookingId: string) => {
    // In a real app, make API call to cancel booking
    toast({
      title: "Booking cancelled",
      description: "Your booking has been cancelled successfully.",
    })

    // Update local state
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)))
  }

  const handleSubmitReview = (bookingId: string, rating: number, comment: string) => {
    // In a real app, make API call to submit review
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return

    const newReview = {
      id: `review-${Date.now()}`,
      bookingId,
      instructorId: booking.instructor.id,
      instructorName: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
      rating,
      comment,
      date: new Date(),
    }

    setReviews([...reviews, newReview])

    // Mark booking as reviewed
    setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, reviewed: true } : b)))

    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    })
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
    <ProtectedRoute requiredRole="student">
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
                <Link href="/instructors">Find Instructors</Link>
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
                        {user.firstName?.[0] || "U"}
                        {user.lastName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>
                        {user.firstName || "User"} {user.lastName || ""}
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/profile">My Profile</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/bookings">My Bookings</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/reviews">My Reviews</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/payments">Payment History</Link>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Tabs defaultValue="upcoming" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming Lessons</TabsTrigger>
                    <TabsTrigger value="past">Past Lessons</TabsTrigger>
                    <TabsTrigger value="reviews">My Reviews</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Lessons</CardTitle>
                        <CardDescription>Your scheduled and pending driving lessons</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {upcomingBookings.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                              <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No upcoming lessons</h3>
                            <p className="text-muted-foreground mb-4">
                              You don't have any upcoming driving lessons scheduled.
                            </p>
                            <Button asChild>
                              <Link href="/instructors">Book a Lesson</Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {upcomingBookings.map((booking) => (
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
                                      <span className="font-medium mr-2">Instructor:</span>
                                      <Link
                                        href={`/instructors/${booking.instructor.id}`}
                                        className="text-primary hover:underline"
                                      >
                                        {booking.instructor.firstName} {booking.instructor.lastName}
                                      </Link>
                                      <div className="flex items-center ml-2">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm ml-1">{booking.instructor.rating}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <div className="text-right">
                                      <div className="font-semibold">{formatCurrency(booking.price.total)}</div>
                                      {getStatusBadge(booking.status)}
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" asChild>
                                        <Link href={`/dashboard/bookings/${booking.id}`}>View Details</Link>
                                      </Button>
                                      {booking.status !== "cancelled" && (
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleCancelBooking(booking.id)}
                                        >
                                          Cancel
                                        </Button>
                                      )}
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
                            <p className="text-muted-foreground mb-4">You haven't taken any driving lessons yet.</p>
                            <Button asChild>
                              <Link href="/instructors">Book Your First Lesson</Link>
                            </Button>
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
                                      <span className="font-medium mr-2">Instructor:</span>
                                      <Link
                                        href={`/instructors/${booking.instructor.id}`}
                                        className="text-primary hover:underline"
                                      >
                                        {booking.instructor.firstName} {booking.instructor.lastName}
                                      </Link>
                                      <div className="flex items-center ml-2">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm ml-1">{booking.instructor.rating}</span>
                                      </div>
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
                                        <Link href={`/dashboard/bookings/${booking.id}`}>View Details</Link>
                                      </Button>
                                      {booking.status === "completed" && !booking.reviewed && (
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            // In a real app, open a review modal
                                            handleSubmitReview(booking.id, 5, "Great instructor!")
                                          }}
                                        >
                                          Leave Review
                                        </Button>
                                      )}
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

                  <TabsContent value="reviews">
                    <Card>
                      <CardHeader>
                        <CardTitle>My Reviews</CardTitle>
                        <CardDescription>Reviews you've left for instructors</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {reviews.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                              <Star className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                            <p className="text-muted-foreground mb-4">
                              You haven't left any reviews for your instructors yet.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {reviews.map((review) => (
                              <div key={review.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium mb-1">
                                      <Link
                                        href={`/instructors/${review.instructorId}`}
                                        className="text-primary hover:underline"
                                      >
                                        {review.instructorName}
                                      </Link>
                                    </div>
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
                                  <Button size="sm" variant="ghost">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}

              {/* Quick Actions */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Book a Lesson</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Find an instructor and book your next driving lesson
                        </p>
                        <Button asChild>
                          <Link href="/instructors">Find Instructors</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Car className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Update Preferences</h3>
                        <p className="text-sm text-muted-foreground mb-4">Update your driving lesson preferences</p>
                        <Button variant="outline" asChild>
                          <Link href="/dashboard/profile">Edit Preferences</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <AlertCircle className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Need Help?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get support or read our frequently asked questions
                        </p>
                        <Button variant="outline" asChild>
                          <Link href="/help">Help Center</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
