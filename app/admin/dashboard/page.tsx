"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Car,
  Star,
  MapPin,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Filter,
  Flag,
  UserCheck,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatCurrency } from "@/lib/utils"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/components/auth/AuthProvider"

// Mock data - in a real app, this would come from API
const mockStats = {
  totalUsers: 2341,
  activeInstructors: 89,
  pendingInstructors: 12,
  totalBookings: 1247,
  totalRevenue: 43650,
  monthlyGrowth: 12.5,
  flaggedAccounts: 3,
}

const mockInstructors = [
  {
    id: "instructor1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@drivelearn.com.au",
    phone: "+61 412 345 678",
    city: "Sydney",
    rating: 4.9,
    totalReviews: 127,
    isVerified: true,
    status: "active",
    joinDate: "2023-03-15",
  },
  {
    id: "instructor2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@drivelearn.com.au",
    phone: "+61 423 456 789",
    city: "Sydney",
    rating: 4.8,
    totalReviews: 89,
    isVerified: true,
    status: "active",
    joinDate: "2023-05-20",
  },
  {
    id: "instructor3",
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma.wilson@drivelearn.com.au",
    phone: "+61 434 567 890",
    city: "Sydney",
    rating: 4.9,
    totalReviews: 156,
    isVerified: true,
    status: "active",
    joinDate: "2023-02-10",
  },
  {
    id: "instructor4",
    firstName: "Jake",
    lastName: "Roberts",
    email: "jake.roberts@drivelearn.com.au",
    phone: "+61 445 678 901",
    city: "Gold Coast",
    rating: 0,
    totalReviews: 0,
    isVerified: false,
    status: "pending",
    joinDate: "2024-02-01",
  },
]

const mockStudents = [
  {
    id: "student1",
    firstName: "Alex",
    lastName: "Smith",
    email: "alex.smith@example.com.au",
    phone: "+61 412 111 222",
    city: "Sydney",
    totalBookings: 5,
    status: "active",
    joinDate: "2023-06-15",
  },
  {
    id: "student2",
    firstName: "Samantha",
    lastName: "Jones",
    email: "samantha.jones@example.com.au",
    phone: "+61 423 333 444",
    city: "Melbourne",
    totalBookings: 3,
    status: "active",
    joinDate: "2023-07-20",
  },
  {
    id: "student3",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@example.com.au",
    phone: "+61 434 555 666",
    city: "Brisbane",
    totalBookings: 1,
    status: "active",
    joinDate: "2023-08-10",
  },
]

const mockBookings = [
  {
    id: "booking1",
    date: new Date("2024-02-15"),
    startTime: "10:00",
    duration: 1,
    status: "completed",
    student: {
      id: "student1",
      firstName: "Alex",
      lastName: "Smith",
    },
    instructor: {
      id: "instructor1",
      firstName: "Sarah",
      lastName: "Johnson",
    },
    price: {
      total: 65,
    },
    location: "Sydney CBD",
  },
  {
    id: "booking2",
    date: new Date("2024-02-22"),
    startTime: "14:00",
    duration: 1.5,
    status: "completed",
    student: {
      id: "student2",
      firstName: "Samantha",
      lastName: "Jones",
    },
    instructor: {
      id: "instructor2",
      firstName: "Michael",
      lastName: "Chen",
    },
    price: {
      total: 97.5,
    },
    location: "North Sydney",
  },
  {
    id: "booking3",
    date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    startTime: "11:00",
    duration: 2,
    status: "confirmed",
    student: {
      id: "student1",
      firstName: "Alex",
      lastName: "Smith",
    },
    instructor: {
      id: "instructor3",
      firstName: "Emma",
      lastName: "Wilson",
    },
    price: {
      total: 120,
    },
    location: "Inner West",
  },
  {
    id: "booking4",
    date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    startTime: "09:00",
    duration: 1,
    status: "pending",
    student: {
      id: "student3",
      firstName: "Michael",
      lastName: "Brown",
    },
    instructor: {
      id: "instructor1",
      firstName: "Sarah",
      lastName: "Johnson",
    },
    price: {
      total: 58,
    },
    location: "CBD",
  },
]

const mockPendingInstructors = [
  {
    id: "pending1",
    firstName: "Jake",
    lastName: "Roberts",
    email: "jake.roberts@drivelearn.com.au",
    phone: "+61 445 678 901",
    city: "Gold Coast",
    experience: 7,
    licenseNumber: "ABC123456",
    adiBadgeNumber: "12345",
    submittedAt: new Date("2024-02-01"),
  },
  {
    id: "pending2",
    firstName: "Mia",
    lastName: "Garcia",
    email: "mia.garcia@drivelearn.com.au",
    phone: "+61 456 789 012",
    city: "Gold Coast",
    experience: 4,
    licenseNumber: "DEF789012",
    adiBadgeNumber: "67890",
    submittedAt: new Date("2024-02-05"),
  },
]

const mockFlaggedAccounts = [
  {
    id: "flag1",
    type: "instructor",
    name: "David Brown",
    email: "david.brown@drivelearn.com.au",
    reason: "Multiple student complaints about cancellations",
    reportedAt: new Date("2024-02-10"),
    status: "under review",
  },
  {
    id: "flag2",
    type: "student",
    name: "John Wilson",
    email: "john.wilson@example.com.au",
    reason: "No-show for multiple bookings",
    reportedAt: new Date("2024-02-08"),
    status: "under review",
  },
  {
    id: "flag3",
    type: "instructor",
    name: "Lisa Taylor",
    email: "lisa.taylor@drivelearn.com.au",
    reason: "Suspected fake credentials",
    reportedAt: new Date("2024-02-12"),
    status: "under review",
  },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockStats)
  const [instructors, setInstructors] = useState(mockInstructors)
  const [students, setStudents] = useState(mockStudents)
  const [bookings, setBookings] = useState(mockBookings)
  const [pendingInstructors, setPendingInstructors] = useState(mockPendingInstructors)
  const [flaggedAccounts, setFlaggedAccounts] = useState(mockFlaggedAccounts)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { logout } = useAuth()

  // In a real app, fetch admin data from API
  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const handleVerifyInstructor = (instructorId: string) => {
    // In a real app, make API call to verify instructor
    toast({
      title: "Instructor verified",
      description: "The instructor has been verified and can now accept bookings.",
    })

    // Update local state
    setPendingInstructors(pendingInstructors.filter((instructor) => instructor.id !== instructorId))
    setInstructors([
      ...instructors,
      {
        ...pendingInstructors.find((instructor) => instructor.id === instructorId)!,
        isVerified: true,
        status: "active",
        rating: 0,
        totalReviews: 0,
      },
    ])
  }

  const handleRejectInstructor = (instructorId: string) => {
    // In a real app, make API call to reject instructor
    toast({
      title: "Instructor rejected",
      description: "The instructor application has been rejected.",
    })

    // Update local state
    setPendingInstructors(pendingInstructors.filter((instructor) => instructor.id !== instructorId))
  }

  const handleResolveFlaggedAccount = (flagId: string) => {
    // In a real app, make API call to resolve flagged account
    toast({
      title: "Flag resolved",
      description: "The flagged account has been reviewed and resolved.",
    })

    // Update local state
    setFlaggedAccounts(flaggedAccounts.filter((flag) => flag.id !== flagId))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      case "under review":
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getBookingStatusBadge = (status: string) => {
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
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-white">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">BookingGuru Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Settings</Button>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your driving school business</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">+180 new this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Instructors</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeInstructors}</div>
                    <p className="text-xs text-muted-foreground">+3 new this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+{stats.monthlyGrowth}% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Flagged Accounts</CardTitle>
                    <Flag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.flaggedAccounts}</div>
                    <p className="text-xs text-muted-foreground">Requires attention</p>
                  </CardContent>
                </Card>
              </div>

              {/* Alert for pending instructors */}
              {pendingInstructors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <h3 className="font-semibold text-yellow-800">
                      {pendingInstructors.length} instructor{" "}
                      {pendingInstructors.length === 1 ? "application" : "applications"} pending review
                    </h3>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    New instructor applications require your verification before they can start accepting bookings.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2 border-yellow-300 text-yellow-800 hover:bg-yellow-100 bg-transparent"
                    onClick={() =>
                      document.getElementById("pending-instructors")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Review Applications
                  </Button>
                </div>
              )}

              {/* Main Content */}
              <Tabs defaultValue="instructors" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="instructors">Instructors</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="pending">Pending Applications</TabsTrigger>
                  <TabsTrigger value="flagged">Flagged Accounts</TabsTrigger>
                </TabsList>

                <TabsContent value="instructors">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Instructors</CardTitle>
                        <CardDescription>Manage your driving instructors</CardDescription>
                      </div>
                      <Button>Add New Instructor</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative flex-1 max-w-sm">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search instructors..." className="pl-10" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                              <Filter className="h-4 w-4 mr-2" />
                              <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {instructors.map((instructor) => (
                          <div key={instructor.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div>
                                <div className="font-medium">
                                  {instructor.firstName} {instructor.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">{instructor.email}</div>
                                <div className="text-sm text-muted-foreground">{instructor.phone}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-sm font-medium">{instructor.city}</div>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span className="text-sm">
                                    {instructor.rating} ({instructor.totalReviews})
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Joined {new Date(instructor.joinDate).toLocaleDateString()}
                                </div>
                              </div>
                              {getStatusBadge(instructor.status)}
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                                <Button size="sm">Edit</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="students">
                  <Card>
                    <CardHeader>
                      <CardTitle>Students</CardTitle>
                      <CardDescription>Manage student accounts and progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative flex-1 max-w-sm">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search students..." className="pl-10" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {students.map((student) => (
                          <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div>
                                <div className="font-medium">
                                  {student.firstName} {student.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">{student.email}</div>
                                <div className="text-sm text-muted-foreground">{student.phone}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-sm font-medium">{student.city}</div>
                                <div className="text-sm text-muted-foreground">{student.totalBookings} bookings</div>
                                <div className="text-sm text-muted-foreground">
                                  Joined {new Date(student.joinDate).toLocaleDateString()}
                                </div>
                              </div>
                              {getStatusBadge(student.status)}
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                                <Button size="sm">Edit</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="bookings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bookings</CardTitle>
                      <CardDescription>Manage all driving lesson bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative flex-1 max-w-sm">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search bookings..." className="pl-10" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                              <Filter className="h-4 w-4 mr-2" />
                              <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div>
                                <div className="font-medium">
                                  {booking.student.firstName} {booking.student.lastName} with{" "}
                                  {booking.instructor.firstName} {booking.instructor.lastName}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(booking.date)} at {booking.startTime} ({booking.duration}h)
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {booking.location}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="font-medium">{formatCurrency(booking.price.total)}</div>
                              </div>
                              {getBookingStatusBadge(booking.status)}
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                                <Button size="sm">Edit</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pending" id="pending-instructors">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Instructor Applications</CardTitle>
                      <CardDescription>Review and approve new instructor applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {pendingInstructors.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <CheckCircle className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">No pending applications</h3>
                          <p className="text-muted-foreground mb-4">All instructor applications have been reviewed.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {pendingInstructors.map((instructor) => (
                            <div key={instructor.id} className="border rounded-lg p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="font-medium text-lg">
                                    {instructor.firstName} {instructor.lastName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {instructor.email} • {instructor.phone}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                                    <span>{instructor.city}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Experience:</span> {instructor.experience} years
                                    </div>
                                    <div>
                                      <span className="font-medium">License:</span> {instructor.licenseNumber}
                                    </div>
                                    <div>
                                      <span className="font-medium">ADI Badge:</span> {instructor.adiBadgeNumber}
                                    </div>
                                    <div>
                                      <span className="font-medium">Applied:</span> {formatDate(instructor.submittedAt)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    variant="outline"
                                    className="w-full bg-transparent"
                                    onClick={() => handleRejectInstructor(instructor.id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                  <Button className="w-full" onClick={() => handleVerifyInstructor(instructor.id)}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Verify
                                  </Button>
                                  <Button variant="ghost" className="w-full">
                                    View Details
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

                <TabsContent value="flagged">
                  <Card>
                    <CardHeader>
                      <CardTitle>Flagged Accounts</CardTitle>
                      <CardDescription>Review accounts that have been flagged for suspicious activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {flaggedAccounts.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <CheckCircle className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">No flagged accounts</h3>
                          <p className="text-muted-foreground mb-4">
                            There are no accounts currently flagged for review.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {flaggedAccounts.map((flag) => (
                            <div key={flag.id} className="border rounded-lg p-4 border-red-200 bg-red-50">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <Flag className="h-4 w-4 text-red-600 mr-2" />
                                    <span className="font-medium text-lg">{flag.name}</span>
                                    <Badge className="ml-2 bg-red-100 text-red-800">
                                      {flag.type.charAt(0).toUpperCase() + flag.type.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">{flag.email}</div>
                                  <div className="text-sm">
                                    <span className="font-medium">Reason:</span> {flag.reason}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Reported on {formatDate(flag.reportedAt)}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    variant="outline"
                                    className="w-full bg-transparent"
                                    onClick={() => handleResolveFlaggedAccount(flag.id)}
                                  >
                                    Resolve
                                  </Button>
                                  <Button className="w-full">Investigate</Button>
                                  <Button variant="destructive" className="w-full">
                                    Suspend Account
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
              </Tabs>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
