"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { FormInput, FormTextarea, FormSelect } from "@/components/ui/form-field"
import { useForm } from "@/hooks/useForm"
import { validators, errorMessages, handleApiResponse, formatCurrency, formatDate } from "@/lib/utils"
import { CalendarDays, Clock, Star, Car, CreditCard, Loader2, AlertCircle } from "lucide-react"
import { SelectItem } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Instructor {
  _id: string
  firstName: string
  lastName: string
  rating: number
  totalReviews: number
  hourlyRate: number
  specialties: string[]
  location: {
    city: string
  }
}

interface BookingFormData {
  lessonType: string
  duration: string
  selectedDate: Date | undefined
  selectedTime: string
  pickupLocation: string
  specialRequests: string
}

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

export default function BookingPage({ params }: { params: { id: string } }) {
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const { values, errors, isSubmitting, submitError, setValue, handleSubmit, setSubmitError } =
    useForm<BookingFormData>({
      initialValues: {
        lessonType: "",
        duration: "",
        selectedDate: undefined,
        selectedTime: "",
        pickupLocation: "",
        specialRequests: "",
      },
      validationRules: {
        lessonType: {
          required: true,
          validator: validators.required,
          message: errorMessages.required,
        },
        duration: {
          required: true,
          validator: validators.required,
          message: errorMessages.required,
        },
        selectedDate: {
          required: true,
          validator: (date: Date) => date && date >= new Date(),
          message: "Please select a valid future date",
        },
        selectedTime: {
          required: true,
          validator: validators.required,
          message: "Please select a time slot",
        },
        pickupLocation: {
          required: true,
          validator: validators.required,
          message: "Pickup location is required",
        },
      },
      onSubmit: async (formData) => {
        if (!instructor) return

        try {
          const bookingData = {
            studentId: "temp-student-id", // This should come from auth context
            instructorId: instructor._id,
            lessonType: formData.lessonType,
            date: formData.selectedDate,
            startTime: formData.selectedTime,
            duration: Number.parseFloat(formData.duration),
            pickupLocation: {
              address: formData.pickupLocation,
            },
            specialRequests: formData.specialRequests,
            price: {
              lessonCost: calculateLessonCost(),
              bookingFee: 2,
              total: calculateTotal(),
            },
            payment: {
              method: "card",
            },
          }

          const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingData),
          })

          const data = await handleApiResponse(response)

          toast({
            title: "Booking created successfully!",
            description: "Redirecting to payment...",
          })

          // Redirect to payment page
          router.push(`/payment/${data.booking._id}`)
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : "Failed to create booking")
        }
      },
    })

  // Fetch instructor data
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/instructors/${params.id}`)

        if (!response.ok) {
          throw new Error("Instructor not found")
        }

        const data = await response.json()
        setInstructor(data.instructor)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load instructor")
      } finally {
        setLoading(false)
      }
    }

    fetchInstructor()
  }, [params.id])

  // Check availability when date changes
  useEffect(() => {
    if (values.selectedDate && instructor) {
      checkAvailability()
    }
  }, [values.selectedDate, instructor])

  const checkAvailability = async () => {
    if (!values.selectedDate || !instructor) return

    try {
      setCheckingAvailability(true)
      const response = await fetch(
        `/api/instructors/${instructor._id}/availability?date=${values.selectedDate.toISOString()}`,
      )

      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data.availableSlots || timeSlots)
      } else {
        setAvailableSlots(timeSlots) // Fallback to all slots
      }
    } catch (error) {
      console.error("Error checking availability:", error)
      setAvailableSlots(timeSlots) // Fallback to all slots
    } finally {
      setCheckingAvailability(false)
    }
  }

  const calculateLessonCost = () => {
    if (!instructor || !values.duration) return 0
    return instructor.hourlyRate * Number.parseFloat(values.duration)
  }

  const calculateTotal = () => {
    return calculateLessonCost() + 2 // £2 booking fee
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today || date.getDay() === 0 // Disable past dates and Sundays
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">DriveLearn</span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-96" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
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

  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">DriveLearn</span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Instructor not found</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Link href="/instructors">
                <Button variant="outline">Back to Instructors</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/instructors" className="text-primary hover:underline">
            ← Back to Instructors
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Book Your Driving Lesson</CardTitle>
                <CardDescription>
                  Fill in the details below to book your lesson with {instructor.firstName} {instructor.lastName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Lesson Type */}
                  <FormSelect
                    label="Lesson Type"
                    placeholder="Select lesson type"
                    value={values.lessonType}
                    onValueChange={(value) => setValue("lessonType", value)}
                    error={errors.lessonType}
                    required
                  >
                    <SelectItem value="standard">Standard Lesson</SelectItem>
                    <SelectItem value="intensive">Intensive Course</SelectItem>
                    <SelectItem value="refresher">Refresher Lesson</SelectItem>
                    <SelectItem value="test-prep">Test Preparation</SelectItem>
                  </FormSelect>

                  {/* Duration */}
                  <FormSelect
                    label="Lesson Duration"
                    placeholder="Select duration"
                    value={values.duration}
                    onValueChange={(value) => setValue("duration", value)}
                    error={errors.duration}
                    required
                  >
                    <SelectItem value="1">1 Hour - {formatCurrency(instructor.hourlyRate)}</SelectItem>
                    <SelectItem value="1.5">1.5 Hours - {formatCurrency(instructor.hourlyRate * 1.5)}</SelectItem>
                    <SelectItem value="2">2 Hours - {formatCurrency(instructor.hourlyRate * 2)}</SelectItem>
                  </FormSelect>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">
                      Select Date
                    </label>
                    <Calendar
                      mode="single"
                      selected={values.selectedDate}
                      onSelect={(date) => setValue("selectedDate", date)}
                      disabled={isDateDisabled}
                      className="rounded-md border"
                    />
                    {errors.selectedDate && <p className="text-sm text-red-500">{errors.selectedDate}</p>}
                  </div>

                  {/* Time Selection */}
                  {values.selectedDate && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">
                        Select Time
                      </label>
                      {checkingAvailability ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Checking availability...
                        </div>
                      ) : (
                        <div className="grid grid-cols-5 gap-2">
                          {timeSlots.map((time) => {
                            const isAvailable = availableSlots.includes(time)
                            return (
                              <Button
                                key={time}
                                type="button"
                                variant={values.selectedTime === time ? "default" : "outline"}
                                size="sm"
                                onClick={() => setValue("selectedTime", time)}
                                disabled={!isAvailable}
                                className={!isAvailable ? "opacity-50 cursor-not-allowed" : ""}
                              >
                                {time}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                      {errors.selectedTime && <p className="text-sm text-red-500">{errors.selectedTime}</p>}
                    </div>
                  )}

                  {/* Pickup Location */}
                  <FormInput
                    label="Pickup Location"
                    placeholder="Enter your pickup address"
                    value={values.pickupLocation}
                    onChange={(e) => setValue("pickupLocation", e.target.value)}
                    error={errors.pickupLocation}
                    required
                    disabled={isSubmitting}
                  />

                  {/* Special Requests */}
                  <FormTextarea
                    label="Special Requests (Optional)"
                    placeholder="Any special requirements or notes for your instructor"
                    value={values.specialRequests}
                    onChange={(e) => setValue("specialRequests", e.target.value)}
                    disabled={isSubmitting}
                  />

                  {submitError && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {submitError}
                    </div>
                  )}
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
                {/* Instructor Info */}
                <div className="flex items-center gap-3">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt={`${instructor.firstName} ${instructor.lastName}`}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">
                      {instructor.firstName} {instructor.lastName}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      {instructor.rating} ({instructor.totalReviews} reviews)
                    </div>
                    <div className="text-sm text-muted-foreground">{instructor.location.city}</div>
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div className="space-y-3">
                  {values.selectedDate && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        Date
                      </div>
                      <div className="text-sm font-medium">{formatDate(values.selectedDate)}</div>
                    </div>
                  )}

                  {values.selectedTime && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2" />
                        Time
                      </div>
                      <div className="text-sm font-medium">{values.selectedTime}</div>
                    </div>
                  )}

                  {values.duration && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Duration</div>
                      <div className="text-sm font-medium">
                        {values.duration} hour{values.duration !== "1" ? "s" : ""}
                      </div>
                    </div>
                  )}

                  {values.lessonType && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Lesson Type</div>
                      <div className="text-sm font-medium capitalize">{values.lessonType.replace("-", " ")}</div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Lesson Cost</div>
                    <div className="text-sm">{formatCurrency(calculateLessonCost())}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Booking Fee</div>
                    <div className="text-sm">{formatCurrency(2)}</div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-semibold">
                    <div>Total</div>
                    <div>{formatCurrency(calculateTotal())}</div>
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  size="lg"
                  disabled={
                    isSubmitting ||
                    !values.selectedDate ||
                    !values.selectedTime ||
                    !values.duration ||
                    !values.lessonType ||
                    !values.pickupLocation
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  You can cancel or reschedule up to 24 hours before your lesson
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
