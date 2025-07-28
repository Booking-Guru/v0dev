import { type NextRequest, NextResponse } from "next/server"
import { BookingService } from "@/lib/services/bookingService"
import { UserService } from "@/lib/services/userService"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      studentId: searchParams.get("studentId") || undefined,
      instructorId: searchParams.get("instructorId") || undefined,
      status: searchParams.get("status") || undefined,
      dateFrom: searchParams.get("dateFrom") ? new Date(searchParams.get("dateFrom")!) : undefined,
      dateTo: searchParams.get("dateTo") ? new Date(searchParams.get("dateTo")!) : undefined,
      limit: Number.parseInt(searchParams.get("limit") || "10"),
      page: Number.parseInt(searchParams.get("page") || "1"),
    }

    const result = await BookingService.getBookings(filters)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      bookings: result.data,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()

    // Validate required fields
    const requiredFields = [
      "studentId",
      "instructorId",
      "lessonType",
      "date",
      "startTime",
      "duration",
      "pickupLocation",
      "price",
    ]

    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Validate date is not in the past
    const bookingDate = new Date(bookingData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (bookingDate < today) {
      return NextResponse.json({ error: "Cannot book lessons in the past" }, { status: 400 })
    }

    // Verify instructor exists
    const instructor = await UserService.getUserById(bookingData.instructorId)
    if (!instructor.success || instructor.data.role !== "instructor") {
      return NextResponse.json({ error: "Invalid instructor" }, { status: 400 })
    }

    // Create booking
    const result = await BookingService.createBooking(bookingData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking: result.data,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
