import { type NextRequest, NextResponse } from "next/server"
import { BookingService } from "@/lib/services/bookingService"

export async function POST(request: NextRequest) {
  try {
    const { bookingId, paymentDetails } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
    }

    // In a real app, process payment here
    // For now, we'll just mark the booking as confirmed
    const result = await BookingService.updateBookingStatus(bookingId, "confirmed", "Payment completed successfully")

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Send confirmation emails to student and instructor
    // In a real app, you would integrate with an email service

    return NextResponse.json({
      message: "Booking completed successfully",
      bookingId,
    })
  } catch (error) {
    console.error("Error completing booking:", error)
    return NextResponse.json({ error: "Failed to complete booking" }, { status: 500 })
  }
}
