"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Car, CreditCard, Search, Filter, Calendar, DollarSign, Receipt, Download } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatCurrency } from "@/lib/utils"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/components/auth/AuthProvider"

// Mock data
const mockPayments = [
  {
    id: "pay_001",
    bookingId: "booking1",
    amount: 65.0,
    status: "completed",
    method: "Credit Card",
    cardLast4: "4242",
    date: new Date("2024-02-15"),
    instructorName: "Sarah Johnson",
    lessonDate: new Date("2024-02-15"),
    transactionId: "txn_1234567890",
    receiptUrl: "/receipts/pay_001.pdf",
  },
  {
    id: "pay_002",
    bookingId: "booking2",
    amount: 97.5,
    status: "completed",
    method: "PayPal",
    cardLast4: null,
    date: new Date("2024-02-22"),
    instructorName: "Sarah Johnson",
    lessonDate: new Date("2024-02-22"),
    transactionId: "txn_0987654321",
    receiptUrl: "/receipts/pay_002.pdf",
  },
  {
    id: "pay_003",
    bookingId: "booking3",
    amount: 120.0,
    status: "completed",
    method: "Credit Card",
    cardLast4: "4242",
    date: new Date("2024-02-25"),
    instructorName: "Michael Chen",
    lessonDate: new Date("2024-02-28"),
    transactionId: "txn_1122334455",
    receiptUrl: "/receipts/pay_003.pdf",
  },
  {
    id: "pay_004",
    bookingId: "booking4",
    amount: 58.0,
    status: "pending",
    method: "Credit Card",
    cardLast4: "4242",
    date: new Date("2024-02-26"),
    instructorName: "Emma Wilson",
    lessonDate: new Date("2024-03-05"),
    transactionId: "txn_5566778899",
    receiptUrl: null,
  },
  {
    id: "pay_005",
    bookingId: "booking5",
    amount: 75.0,
    status: "failed",
    method: "Credit Card",
    cardLast4: "4242",
    date: new Date("2024-02-20"),
    instructorName: "David Brown",
    lessonDate: new Date("2024-02-23"),
    transactionId: "txn_9988776655",
    receiptUrl: null,
  },
]

const mockPaymentMethods = [
  {
    id: "pm_001",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "pm_002",
    type: "paypal",
    email: "user@example.com",
    isDefault: false,
  },
]

export default function PaymentsPage() {
  const { user, logout } = useAuth()
  const [payments, setPayments] = useState(mockPayments)
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const { toast } = useToast()

  const filteredPayments = payments
    .filter((payment) => {
      const matchesSearch =
        payment.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || payment.status === statusFilter

      let matchesDate = true
      if (dateFilter !== "all") {
        const now = new Date()
        const paymentDate = new Date(payment.date)

        switch (dateFilter) {
          case "week":
            matchesDate = now.getTime() - paymentDate.getTime() <= 7 * 24 * 60 * 60 * 1000
            break
          case "month":
            matchesDate = now.getTime() - paymentDate.getTime() <= 30 * 24 * 60 * 60 * 1000
            break
          case "year":
            matchesDate = now.getTime() - paymentDate.getTime() <= 365 * 24 * 60 * 60 * 1000
            break
        }
      }

      return matchesSearch && matchesStatus && matchesDate
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalSpent = payments.filter((p) => p.status === "completed").reduce((sum, payment) => sum + payment.amount, 0)

  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((sum, payment) => sum + payment.amount, 0)

  const handleRetryPayment = (paymentId: string) => {
    setPayments(payments.map((payment) => (payment.id === paymentId ? { ...payment, status: "pending" } : payment)))
    toast({
      title: "Payment retry initiated",
      description: "We're processing your payment again.",
    })
  }

  const handleDownloadReceipt = (receiptUrl: string) => {
    // In a real app, this would download the actual receipt
    toast({
      title: "Receipt downloaded",
      description: "Your receipt has been downloaded.",
    })
  }

  const handleSetDefaultPayment = (methodId: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      })),
    )
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been changed.",
    })
  }

  const handleRemovePaymentMethod = (methodId: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== methodId))
    toast({
      title: "Payment method removed",
      description: "The payment method has been removed from your account.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case "refunded":
        return <Badge className="bg-blue-100 text-blue-800">Refunded</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentMethodIcon = (type: string, brand?: string) => {
    if (type === "card") {
      return <CreditCard className="h-5 w-5" />
    }
    return <DollarSign className="h-5 w-5" />
  }

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
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/profile">My Profile</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/bookings">My Bookings</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/reviews">My Reviews</Link>
                    </Button>
                    <Button variant="default" className="w-full justify-start">
                      Payment History
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-6">Payment History</h1>

              {/* Payment Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{formatCurrency(totalSpent)}</div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">{formatCurrency(pendingAmount)}</div>
                      <p className="text-sm text-muted-foreground">Pending Payments</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {payments.filter((p) => p.status === "completed").length}
                      </div>
                      <p className="text-sm text-muted-foreground">Successful Payments</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="history" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="history">Payment History</TabsTrigger>
                  <TabsTrigger value="methods">Payment Methods</TabsTrigger>
                </TabsList>

                <TabsContent value="history">
                  {/* Filters */}
                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search by instructor or transaction ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-full md:w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                          <SelectTrigger className="w-full md:w-[180px]">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by date" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="week">Last Week</SelectItem>
                            <SelectItem value="month">Last Month</SelectItem>
                            <SelectItem value="year">Last Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payments List */}
                  <div className="space-y-4">
                    {filteredPayments.length === 0 ? (
                      <Card>
                        <CardContent className="text-center py-12">
                          <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No payments found</h3>
                          <p className="text-muted-foreground mb-4">No payments match your current filters.</p>
                          <Button
                            onClick={() => {
                              setSearchQuery("")
                              setStatusFilter("all")
                              setDateFilter("all")
                            }}
                          >
                            Clear Filters
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredPayments.map((payment) => (
                        <Card key={payment.id}>
                          <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center">
                                    {getPaymentMethodIcon(payment.method.toLowerCase())}
                                    <span className="ml-2 font-medium">{formatCurrency(payment.amount)}</span>
                                  </div>
                                  {getStatusBadge(payment.status)}
                                </div>

                                <div className="text-sm text-muted-foreground">
                                  <span className="font-medium">Instructor:</span> {payment.instructorName}
                                </div>

                                <div className="text-sm text-muted-foreground">
                                  <span className="font-medium">Lesson Date:</span> {formatDate(payment.lessonDate)}
                                </div>

                                <div className="text-sm text-muted-foreground">
                                  <span className="font-medium">Payment Date:</span> {formatDate(payment.date)}
                                </div>

                                <div className="text-sm text-muted-foreground">
                                  <span className="font-medium">Method:</span> {payment.method}
                                  {payment.cardLast4 && ` ending in ${payment.cardLast4}`}
                                </div>

                                <div className="text-sm text-muted-foreground">
                                  <span className="font-medium">Transaction ID:</span> {payment.transactionId}
                                </div>
                              </div>

                              <div className="flex flex-col gap-2">
                                {payment.status === "completed" && payment.receiptUrl && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDownloadReceipt(payment.receiptUrl!)}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Receipt
                                  </Button>
                                )}

                                {payment.status === "failed" && (
                                  <Button size="sm" onClick={() => handleRetryPayment(payment.id)}>
                                    Retry Payment
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="methods">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Manage your saved payment methods</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              {getPaymentMethodIcon(method.type, method.brand)}
                              <div>
                                {method.type === "card" ? (
                                  <>
                                    <p className="font-medium">
                                      {method.brand?.toUpperCase()} ending in {method.last4}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Expires {method.expiryMonth}/{method.expiryYear}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="font-medium">PayPal</p>
                                    <p className="text-sm text-muted-foreground">{method.email}</p>
                                  </>
                                )}
                                {method.isDefault && (
                                  <Badge variant="secondary" className="mt-1">
                                    Default
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {!method.isDefault && (
                                <Button size="sm" variant="outline" onClick={() => handleSetDefaultPayment(method.id)}>
                                  Set Default
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemovePaymentMethod(method.id)}
                                disabled={method.isDefault}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}

                        <Button className="w-full bg-transparent" variant="outline">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Add New Payment Method
                        </Button>
                      </div>
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
