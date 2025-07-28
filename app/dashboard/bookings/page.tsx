"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  Car,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Plus,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatCurrency } from "@/lib/utils"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/components/auth/AuthProvider"

// Mock data
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
      phone: "+61 412 345 678",
      email: "sarah.johnson@bookingguru.com",
    },
    price: {
      total: 65,
    },
    location: "Sydney CBD",
    notes: "Worked on parallel parking and reverse parking",
    reviewed: true,
    paymentStatus: "paid",
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
      phone: "+61 412 345 678",
      email: "sarah.johnson@bookingguru.com",
    },
    price: {
      total: 97.5,
    },
    location: "North Sydney",
    notes: "Highway driving practice",
    reviewed: false,
    paymentStatus: "paid",
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
      phone: "+61 423 456 789",
      email: "michael.chen@bookingguru.com",
    },
    price: {
      total: 120,
    },
    location: "Parramatta",
    notes: "",
    reviewed: false,
    paymentStatus: "paid",
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
      phone: "+61 434 567 890",
      email: "emma.wilson@bookingguru.com",
    },
    price: {
      total: 58,
    },
    location: "Inner West",
    notes: "",
    reviewed: false,
    paymentStatus: "pending",
  },
]

export default function BookingsPage() {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState(mockBookings)
  const [filteredBookings, setFilteredBookings] = useState(mockBookings)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
  const [rescheduleForm, setRescheduleForm] = useState({
    date: "",
    time: "",
    notes: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    let filtered = bookings

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.instructor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.instructor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchQuery, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)))
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
      })
      setLoading(false)
    }, 1000)
  }

  const handleRescheduleBooking = async (bookingId: string) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Reschedule request sent",
        description: "Your reschedule request has been sent to the instructor.",
      })
      setIsRescheduleOpen(false)
      setRescheduleForm({ date: "", time: "", notes: "" })
      setLoading(false)
    }, 1000)
  }

  const upcomingBookings = filteredBookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "pending",
  )
  const pastBookings = filteredBookings.filter(
    (booking) => booking.status === "completed" || booking.status === "cancelled",
  )

  if (!user) {
    return null
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
                <Link href="/dashboard">Dashboard</Link>
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
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="default" className="w-full justify-start">
                      My Bookings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/profile">My Profile</Link>
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
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">My Bookings</h1>
                <Button asChild>
                  <Link href="/instructors">
                    <Plus className="mr-2 h-4 w-4" />
                    Book New Lesson
                  </Link>
                </Button>
              </div>

              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search bookings..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-48">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Bookings</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="upcoming" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
                  <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
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
                            <div key={booking.id} className="border rounded-lg p-6">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                                      <span className="font-medium">{formatDate(booking.date)}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2 text-primary" />
                                      <span>
                                        {booking.startTime} ({booking.duration}{" "}
                                        {booking.duration === 1 ? "hour" : "hours"})
                                      </span>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                  </div>

                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                                    <span>{booking.location}</span>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={`https://ui-avatars.com/api/?name=${booking.instructor.firstName}+${booking.instructor.lastName}`}
                                      />
                                      <AvatarFallback>
                                        {booking.instructor.firstName[0]}
                                        {booking.instructor.lastName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <Link
                                        href={`/instructors/${booking.instructor.id}`}
                                        className="font-medium text-primary hover:underline"
                                      >
                                        {booking.instructor.firstName} {booking.instructor.lastName}
                                      </Link>
                                      <div className="flex items-center">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm ml-1">{booking.instructor.rating}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {booking.notes && (
                                    <div className="text-sm text-muted-foreground">
                                      <span className="font-medium">Notes:</span> {booking.notes}
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                  <div className="text-right">
                                    <div className="text-2xl font-bold">{formatCurrency(booking.price.total)}</div>
                                    <div className="text-sm text-muted-foreground">
                                      Payment: {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button size="sm" variant="outline" onClick={() => setSelectedBooking(booking)}>
                                          <Eye className="h-4 w-4 mr-1" />
                                          View
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                          <DialogTitle>Booking Details</DialogTitle>
                                          <DialogDescription>Complete information about your lesson</DialogDescription>
                                        </DialogHeader>
                                        {selectedBooking && (
                                          <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <Label className="text-sm font-medium">Date & Time</Label>
                                                <p>
                                                  {formatDate(selectedBooking.date)} at {selectedBooking.startTime}
                                                </p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Duration</Label>
                                                <p>
                                                  {selectedBooking.duration}{" "}
                                                  {selectedBooking.duration === 1 ? "hour" : "hours"}
                                                </p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Location</Label>
                                                <p>{selectedBooking.location}</p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Status</Label>
                                                <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                                              </div>
                                            </div>

                                            <div>
                                              <Label className="text-sm font-medium">Instructor</Label>
                                              <div className="flex items-center gap-3 mt-2">
                                                <Avatar className="h-10 w-10">
                                                  <AvatarImage
                                                    src={`https://ui-avatars.com/api/?name=${selectedBooking.instructor.firstName}+${selectedBooking.instructor.lastName}`}
                                                  />
                                                  <AvatarFallback>
                                                    {selectedBooking.instructor.firstName[0]}
                                                    {selectedBooking.instructor.lastName[0]}
                                                  </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                  <p className="font-medium">
                                                    {selectedBooking.instructor.firstName}{" "}
                                                    {selectedBooking.instructor.lastName}
                                                  </p>
                                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center">
                                                      <Phone className="h-3 w-3 mr-1" />
                                                      {selectedBooking.instructor.phone}
                                                    </div>
                                                    <div className="flex items-center">
                                                      <Mail className="h-3 w-3 mr-1" />
                                                      {selectedBooking.instructor.email}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {selectedBooking.notes && (
                                              <div>
                                                <Label className="text-sm font-medium">Notes</Label>
                                                <p className="mt-1">{selectedBooking.notes}</p>
                                              </div>
                                            )}

                                            <div>
                                              <Label className="text-sm font-medium">Payment</Label>
                                              <div className="flex justify-between items-center mt-2 p-3 bg-muted rounded-lg">
                                                <span>Total Amount</span>
                                                <span className="font-bold text-lg">
                                                  {formatCurrency(selectedBooking.price.total)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </DialogContent>
                                    </Dialog>

                                    {booking.status !== "cancelled" && (
                                      <>
                                        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
                                          <DialogTrigger asChild>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => setSelectedBooking(booking)}
                                            >
                                              <Edit className="h-4 w-4 mr-1" />
                                              Reschedule
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Reschedule Lesson</DialogTitle>
                                              <DialogDescription>
                                                Request to reschedule your lesson. Your instructor will need to approve
                                                the new time.
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <div className="space-y-2">
                                                <Label htmlFor="reschedule-date">New Date</Label>
                                                <Input
                                                  id="reschedule-date"
                                                  type="date"
                                                  value={rescheduleForm.date}
                                                  onChange={(e) =>
                                                    setRescheduleForm({ ...rescheduleForm, date: e.target.value })
                                                  }
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label htmlFor="reschedule-time">New Time</Label>
                                                <Select
                                                  value={rescheduleForm.time}
                                                  onValueChange={(value) =>
                                                    setRescheduleForm({ ...rescheduleForm, time: value })
                                                  }
                                                >
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Select time" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="09:00">9:00 AM</SelectItem>
                                                    <SelectItem value="10:00">10:00 AM</SelectItem>
                                                    <SelectItem value="11:00">11:00 AM</SelectItem>
                                                    <SelectItem value="14:00">2:00 PM</SelectItem>
                                                    <SelectItem value="15:00">3:00 PM</SelectItem>
                                                    <SelectItem value="16:00">4:00 PM</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div className="space-y-2">
                                                <Label htmlFor="reschedule-notes">Reason (Optional)</Label>
                                                <Textarea
                                                  id="reschedule-notes"
                                                  placeholder="Let your instructor know why you need to reschedule..."
                                                  value={rescheduleForm.notes}
                                                  onChange={(e) =>
                                                    setRescheduleForm({ ...rescheduleForm, notes: e.target.value })
                                                  }
                                                />
                                              </div>
                                              <div className="flex gap-2">
                                                <Button
                                                  onClick={() => handleRescheduleBooking(booking.id)}
                                                  disabled={loading || !rescheduleForm.date || !rescheduleForm.time}
                                                >
                                                  {loading ? (
                                                    <>
                                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                      Sending...
                                                    </>
                                                  ) : (
                                                    "Send Request"
                                                  )}
                                                </Button>
                                                <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>
                                                  Cancel
                                                </Button>
                                              </div>
                                            </div>
                                          </DialogContent>
                                        </Dialog>

                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleCancelBooking(booking.id)}
                                          disabled={loading}
                                        >
                                          {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <>
                                              <Trash2 className="h-4 w-4 mr-1" />
                                              Cancel
                                            </>
                                          )}
                                        </Button>
                                      </>
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
                            <div key={booking.id} className="border rounded-lg p-6">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                                      <span className="font-medium">{formatDate(booking.date)}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2 text-primary" />
                                      <span>
                                        {booking.startTime} ({booking.duration}{" "}
                                        {booking.duration === 1 ? "hour" : "hours"})
                                      </span>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                  </div>

                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                                    <span>{booking.location}</span>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={`https://ui-avatars.com/api/?name=${booking.instructor.firstName}+${booking.instructor.lastName}`}
                                      />
                                      <AvatarFallback>
                                        {booking.instructor.firstName[0]}
                                        {booking.instructor.lastName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <Link
                                        href={`/instructors/${booking.instructor.id}`}
                                        className="font-medium text-primary hover:underline"
                                      >
                                        {booking.instructor.firstName} {booking.instructor.lastName}
                                      </Link>
                                      <div className="flex items-center">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm ml-1">{booking.instructor.rating}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {booking.notes && (
                                    <div className="text-sm text-muted-foreground">
                                      <span className="font-medium">Notes:</span> {booking.notes}
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                  <div className="text-right">
                                    <div className="text-2xl font-bold">{formatCurrency(booking.price.total)}</div>
                                  </div>

                                  <div className="flex gap-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button size="sm" variant="outline" onClick={() => setSelectedBooking(booking)}>
                                          <Eye className="h-4 w-4 mr-1" />
                                          View Details
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                          <DialogTitle>Booking Details</DialogTitle>
                                          <DialogDescription>Complete information about your lesson</DialogDescription>
                                        </DialogHeader>
                                        {selectedBooking && (
                                          <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <Label className="text-sm font-medium">Date & Time</Label>
                                                <p>
                                                  {formatDate(selectedBooking.date)} at {selectedBooking.startTime}
                                                </p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Duration</Label>
                                                <p>
                                                  {selectedBooking.duration}{" "}
                                                  {selectedBooking.duration === 1 ? "hour" : "hours"}
                                                </p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Location</Label>
                                                <p>{selectedBooking.location}</p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Status</Label>
                                                <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                                              </div>
                                            </div>

                                            <div>
                                              <Label className="text-sm font-medium">Instructor</Label>
                                              <div className="flex items-center gap-3 mt-2">
                                                <Avatar className="h-10 w-10">
                                                  <AvatarImage
                                                    src={`https://ui-avatars.com/api/?name=${selectedBooking.instructor.firstName}+${selectedBooking.instructor.lastName}`}
                                                  />
                                                  <AvatarFallback>
                                                    {selectedBooking.instructor.firstName[0]}
                                                    {selectedBooking.instructor.lastName[0]}
                                                  </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                  <p className="font-medium">
                                                    {selectedBooking.instructor.firstName}{" "}
                                                    {selectedBooking.instructor.lastName}
                                                  </p>
                                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center">
                                                      <Phone className="h-3 w-3 mr-1" />
                                                      {selectedBooking.instructor.phone}
                                                    </div>
                                                    <div className="flex items-center">
                                                      <Mail className="h-3 w-3 mr-1" />
                                                      {selectedBooking.instructor.email}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {selectedBooking.notes && (
                                              <div>
                                                <Label className="text-sm font-medium">Lesson Notes</Label>
                                                <p className="mt-1">{selectedBooking.notes}</p>
                                              </div>
                                            )}

                                            <div>
                                              <Label className="text-sm font-medium">Payment</Label>
                                              <div className="flex justify-between items-center mt-2 p-3 bg-muted rounded-lg">
                                                <span>Total Amount</span>
                                                <span className="font-bold text-lg">
                                                  {formatCurrency(selectedBooking.price.total)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </DialogContent>
                                    </Dialog>

                                    {booking.status === "completed" && !booking.reviewed && (
                                      <Button size="sm" asChild>
                                        <Link href={`/dashboard/reviews/new?booking=${booking.id}`}>
                                          <Star className="h-4 w-4 mr-1" />
                                          Leave Review
                                        </Link>
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
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
