"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput, FormSelect } from "@/components/ui/form-field"
import { useForm } from "@/hooks/useForm"
import { validators, errorMessages, handleApiResponse, formatCurrency, formatDate } from "@/lib/utils"
import { Car, CreditCard, Shield, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { SelectItem } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

interface PaymentFormData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  billingAddress: string
  city: string
  postcode: string
  country: string
}

interface Booking {
  id: string
  date: Date
  startTime: string
  duration: number
  instructor: {
    firstName: string
    lastName: string
  }
  student: {
    firstName: string
    lastName: string
  }
  price: {
    lessonCost: number
    bookingFee: number
    total: number
  }
  location: string
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const { values, errors, isSubmitting, submitError, setValue, handleSubmit, setSubmitError } =
    useForm<PaymentFormData>({
      initialValues: {
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
        billingAddress: "",
        city: "",
        postcode: "",
        country: "Australia",
      },
      validationRules: {
        cardNumber: {
          required: true,
          validator: (value: string) => /^\d{16}$/.test(value.replace(/\s/g, "")),
          message: "Please enter a valid 16-digit card number",
        },
        expiryDate: {
          required: true,
          validator: (value: string) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value),
          message: "Please enter a valid expiry date (MM/YY)",
        },
        cvv: {
          required: true,
          validator: (value: string) => /^\d{3,4}$/.test(value),
          message: "Please enter a valid CVV",
        },
        cardholderName: {
          required: true,
          validator: validators.required,
          message: errorMessages.required,
        },
        billingAddress: {
          required: true,
          validator: validators.required,
          message: errorMessages.required,
        },
        city: {
          required: true,
          validator: validators.required,
          message: errorMessages.required,
        },
        postcode: {
          required: true,
          validator: validators.required,
          message: errorMessages.required,
        },
        country: {
          required: true,
          validator: validators.required,
          message: errorMessages.required,
        },
      },
      onSubmit: async (formData) => {
        try {
          // In a real app, this would process payment with Stripe/PayPal
          await new Promise((resolve) => setTimeout(resolve, 2000))

          const response = await fetch("/api/bookings/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookingId: params.id,
              paymentDetails: formData,
            }),
          })

          await handleApiResponse(response)

          setPaymentComplete(true)

          toast({
            title: "Payment successful!",
            description: "Your driving lesson has been booked successfully.",
          })

          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : "Payment failed")
        }
      },
    })

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/bookings/${params.id}`)

        if (!response.ok) {
          throw new Error("Booking not found")
        }

        const data = await response.json()
        setBooking(data.booking)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load booking details",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [params.id, router, toast])

  if (paymentComplete) {
    return (
      <ProtectedRoute requiredRole="student">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-6">
                Your driving lesson has been booked successfully. You'll receive a confirmation email shortly.
              </p>
              <Button asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  if (loading || !booking) {
    return (
      <ProtectedRoute requiredRole="student">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    )
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
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
              <p className="text-muted-foreground">Secure payment to confirm your driving lesson booking</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Details
                    </CardTitle>
                    <CardDescription>Enter your payment information to complete the booking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <FormInput
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        value={values.cardNumber}
                        onChange={(e) => {
                          // Format card number with spaces
                          const formatted = e.target.value
                            .replace(/\s/g, "")
                            .replace(/(.{4})/g, "$1 ")
                            .trim()
                          setValue("cardNumber", formatted)
                        }}
                        error={errors.cardNumber}
                        required
                        disabled={isSubmitting}
                        maxLength={19}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormInput
                          label="Expiry Date"
                          placeholder="MM/YY"
                          value={values.expiryDate}
                          onChange={(e) => {
                            // Format expiry date
                            let value = e.target.value.replace(/\D/g, "")
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + "/" + value.substring(2, 4)
                            }
                            setValue("expiryDate", value)
                          }}
                          error={errors.expiryDate}
                          required
                          disabled={isSubmitting}
                          maxLength={5}
                        />
                        <FormInput
                          label="CVV"
                          placeholder="123"
                          value={values.cvv}
                          onChange={(e) => setValue("cvv", e.target.value.replace(/\D/g, ""))}
                          error={errors.cvv}
                          required
                          disabled={isSubmitting}
                          maxLength={4}
                        />
                      </div>

                      <FormInput
                        label="Cardholder Name"
                        placeholder="John Doe"
                        value={values.cardholderName}
                        onChange={(e) => setValue("cardholderName", e.target.value)}
                        error={errors.cardholderName}
                        required
                        disabled={isSubmitting}
                      />

                      <FormInput
                        label="Billing Address"
                        placeholder="123 Main Street"
                        value={values.billingAddress}
                        onChange={(e) => setValue("billingAddress", e.target.value)}
                        error={errors.billingAddress}
                        required
                        disabled={isSubmitting}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormInput
                          label="City"
                          placeholder="Sydney"
                          value={values.city}
                          onChange={(e) => setValue("city", e.target.value)}
                          error={errors.city}
                          required
                          disabled={isSubmitting}
                        />
                        <FormInput
                          label="Postcode"
                          placeholder="2000"
                          value={values.postcode}
                          onChange={(e) => setValue("postcode", e.target.value)}
                          error={errors.postcode}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <FormSelect
                        label="Country"
                        value={values.country}
                        onValueChange={(value) => setValue("country", value)}
                        error={errors.country}
                        required
                      >
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="New Zealand">New Zealand</SelectItem>
                      </FormSelect>

                      {submitError && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                          {submitError}
                        </div>
                      )}

                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-4 w-4" />
                            Pay {formatCurrency(booking.price.total)}
                          </>
                        )}
                      </Button>

                      <div className="text-xs text-center text-muted-foreground">
                        <Shield className="h-3 w-3 inline mr-1" />
                        Your payment information is secure and encrypted
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Summary */}
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Lesson Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span>{formatDate(new Date(booking.date))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span>{booking.startTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>
                            {booking.duration} hour{booking.duration !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span>{booking.location}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Instructor</h3>
                      <p className="text-sm">
                        {booking.instructor.firstName} {booking.instructor.lastName}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Payment Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Lesson Cost:</span>
                          <span>{formatCurrency(booking.price.lessonCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Booking Fee:</span>
                          <span>{formatCurrency(booking.price.bookingFee)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-base border-t pt-2">
                          <span>Total:</span>
                          <span>{formatCurrency(booking.price.total)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <p className="text-xs text-blue-800">
                        <strong>Cancellation Policy:</strong> You can cancel or reschedule up to 24 hours before your
                        lesson without any penalty.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
