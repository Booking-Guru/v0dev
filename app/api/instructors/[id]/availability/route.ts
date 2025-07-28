import { type NextRequest, NextResponse } from "next/server"
import { BookingService } from "@/lib/services/bookingService"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    if (!dateParam) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    const date = new Date(dateParam)
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
    }

    // Check if date is in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) {
      return NextResponse.json({ error: "Cannot check availability for past dates" }, { status: 400 })
    }

    // Get all time slots for the day
    const allTimeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

    // Get existing bookings for this instructor on this date
    const bookingsResult = await BookingService.getBookings({
      instructorId: params.id,
      dateFrom: date,
      dateTo: date,
      limit: 50,
    })

    if (!bookingsResult.success) {
      return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
    }

    // Filter out booked time slots
    const bookedSlots = bookingsResult.data
      .filter((booking) => ["pending", "confirmed"].includes(booking.status))
      .map((booking) => booking.startTime)

    const availableSlots = allTimeSlots.filter((slot) => !bookedSlots.includes(slot))

    return NextResponse.json({
      date: date.toISOString(),
      availableSlots,
      bookedSlots,
    })
  } catch (error) {
    console.error("Error checking availability:", error)
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
  }
}
