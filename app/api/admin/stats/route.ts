import { type NextRequest, NextResponse } from "next/server"
import { BookingService } from "@/lib/services/bookingService"
import { DatabaseService } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const dateFrom = searchParams.get("dateFrom") ? new Date(searchParams.get("dateFrom")!) : undefined
    const dateTo = searchParams.get("dateTo") ? new Date(searchParams.get("dateTo")!) : undefined

    // Get booking statistics
    const bookingStats = await BookingService.getBookingStats({ dateFrom, dateTo })

    // Get user counts
    const studentCount = await DatabaseService.count("users", { role: "student", isActive: true })
    const instructorCount = await DatabaseService.count("users", { role: "instructor", isActive: true })
    const verifiedInstructorCount = await DatabaseService.count("users", {
      role: "instructor",
      isActive: true,
      isVerified: true,
    })

    // Calculate growth (mock data for now - you can implement actual growth calculation)
    const monthlyGrowth = 12.5

    const stats = {
      totalBookings: bookingStats.success ? bookingStats.data.totalBookings : 0,
      totalRevenue: bookingStats.success ? bookingStats.data.totalRevenue : 0,
      totalStudents: studentCount.success ? studentCount.count : 0,
      totalInstructors: instructorCount.success ? instructorCount.count : 0,
      verifiedInstructors: verifiedInstructorCount.success ? verifiedInstructorCount.count : 0,
      completedBookings: bookingStats.success ? bookingStats.data.completedBookings : 0,
      pendingBookings: bookingStats.success ? bookingStats.data.pendingBookings : 0,
      confirmedBookings: bookingStats.success ? bookingStats.data.confirmedBookings : 0,
      cancelledBookings: bookingStats.success ? bookingStats.data.cancelledBookings : 0,
      monthlyGrowth,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
