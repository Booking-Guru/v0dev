"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, DollarSign, TrendingUp, Car } from "lucide-react"

// Mock data
const stats = {
  totalBookings: 1247,
  totalRevenue: 43650,
  activeInstructors: 89,
  totalStudents: 2341,
  monthlyGrowth: 12.5,
}

const recentBookings = [
  {
    id: 1,
    student: "John Smith",
    instructor: "Sarah Johnson",
    date: "2024-01-15",
    time: "10:00",
    status: "confirmed",
    amount: 35,
  },
  {
    id: 2,
    student: "Emma Wilson",
    instructor: "Mike Thompson",
    date: "2024-01-15",
    time: "14:00",
    status: "pending",
    amount: 40,
  },
  {
    id: 3,
    student: "David Brown",
    instructor: "Emma Wilson",
    date: "2024-01-16",
    time: "09:00",
    status: "completed",
    amount: 38,
  },
]

const instructors = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+44 7123 456789",
    status: "active",
    totalBookings: 127,
    rating: 4.9,
    joinDate: "2023-03-15",
  },
  {
    id: 2,
    name: "Mike Thompson",
    email: "mike@example.com",
    phone: "+44 7987 654321",
    status: "active",
    totalBookings: 89,
    rating: 4.8,
    joinDate: "2023-05-20",
  },
]

export default function AdminDashboard() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">DriveLearn Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Settings</Button>
            <Button variant="ghost">Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your driving school business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{stats.monthlyGrowth}% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Instructors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeInstructors}</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">+180 new this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="instructors">Instructors</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest booking requests and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-medium">{booking.student}</div>
                          <div className="text-sm text-muted-foreground">with {booking.instructor}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{booking.date}</div>
                          <div className="text-sm text-muted-foreground">{booking.time}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">£{booking.amount}</div>
                        </div>
                        {getStatusBadge(booking.status)}
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
                <div className="space-y-4">
                  {instructors.map((instructor) => (
                    <div key={instructor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-medium">{instructor.name}</div>
                          <div className="text-sm text-muted-foreground">{instructor.email}</div>
                          <div className="text-sm text-muted-foreground">{instructor.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{instructor.totalBookings} bookings</div>
                          <div className="text-sm text-muted-foreground">Rating: {instructor.rating}/5</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
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
                <div className="text-center py-8 text-muted-foreground">
                  Student management interface coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>Track payments and financial reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Payment management interface coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
