import { DatabaseService } from "@/lib/mongodb"
import type { Booking } from "@/lib/models/Booking"
import { ObjectId } from "mongodb"

export class BookingService {
  private static readonly COLLECTION = "bookings"

  // Create new booking
  static async createBooking(bookingData: Omit<Booking, "_id" | "createdAt" | "updatedAt">) {
    try {
      // Check instructor availability
      const conflictCheck = await this.checkInstructorAvailability(
        bookingData.instructorId,
        bookingData.date,
        bookingData.startTime,
        bookingData.duration,
      )

      if (!conflictCheck.available) {
        return { success: false, error: "Time slot not available" }
      }

      // Create booking with default status
      const newBooking = {
        ...bookingData,
        status: "pending" as const,
        payment: {
          ...bookingData.payment,
          status: "pending" as const,
        },
      }

      const result = await DatabaseService.create(this.COLLECTION, newBooking)

      if (result.success) {
        // Get the created booking with populated data
        const booking = await this.getBookingById(result.insertedId.toString())
        return booking
      }

      return result
    } catch (error) {
      console.error("Error creating booking:", error)
      return { success: false, error: "Failed to create booking" }
    }
  }

  // Check instructor availability
  static async checkInstructorAvailability(instructorId: string, date: Date, startTime: string, duration: number) {
    try {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      // Check for conflicting bookings
      const conflictingBookings = await DatabaseService.findMany(this.COLLECTION, {
        instructorId,
        date: { $gte: startDate, $lte: endDate },
        status: { $in: ["pending", "confirmed"] },
      })

      if (!conflictingBookings.success) {
        return { available: false, error: "Failed to check availability" }
      }

      // Check for time conflicts
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const startTimeMinutes = startHour * 60 + startMinute
      const endTimeMinutes = startTimeMinutes + duration * 60

      for (const booking of conflictingBookings.data) {
        const [bookingStartHour, bookingStartMinute] = booking.startTime.split(":").map(Number)
        const bookingStartMinutes = bookingStartHour * 60 + bookingStartMinute
        const bookingEndMinutes = bookingStartMinutes + booking.duration * 60

        // Check for overlap
        if (startTimeMinutes < bookingEndMinutes && endTimeMinutes > bookingStartMinutes) {
          return { available: false, error: "Time slot conflicts with existing booking" }
        }
      }

      return { available: true }
    } catch (error) {
      console.error("Error checking availability:", error)
      return { available: false, error: "Failed to check availability" }
    }
  }

  // Get booking by ID with populated data
  static async getBookingById(bookingId: string) {
    try {
      const collection = await DatabaseService.getCollection(this.COLLECTION)
      const { ObjectId } = await import("mongodb")

      const booking = await collection
        .aggregate([
          { $match: { _id: new ObjectId(bookingId) } },
          {
            $lookup: {
              from: "users",
              localField: "studentId",
              foreignField: "_id",
              as: "student",
              pipeline: [{ $project: { password: 0 } }],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "instructorId",
              foreignField: "_id",
              as: "instructor",
              pipeline: [{ $project: { password: 0 } }],
            },
          },
          { $unwind: "$student" },
          { $unwind: "$instructor" },
        ])
        .toArray()

      if (booking.length === 0) {
        return { success: false, error: "Booking not found" }
      }

      return { success: true, data: booking[0] }
    } catch (error) {
      console.error("Error getting booking:", error)
      return { success: false, error: "Failed to get booking" }
    }
  }

  // Get bookings with filters and pagination
  static async getBookings(
    filters: {
      studentId?: string
      instructorId?: string
      status?: string
      dateFrom?: Date
      dateTo?: Date
      limit?: number
      page?: number
    } = {},
  ) {
    try {
      const { studentId, instructorId, status, dateFrom, dateTo, limit = 10, page = 1 } = filters

      // Build query
      const query: any = {}

      if (studentId) query.studentId = new ObjectId(studentId)
      if (instructorId) query.instructorId = new ObjectId(instructorId)
      if (status) query.status = status

      if (dateFrom || dateTo) {
        query.date = {}
        if (dateFrom) query.date.$gte = dateFrom
        if (dateTo) query.date.$lte = dateTo
      }

      const collection = await DatabaseService.getCollection(this.COLLECTION)

      // Get total count
      const totalCount = await collection.countDocuments(query)

      // Get bookings with populated data
      const bookings = await collection
        .aggregate([
          { $match: query },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "users",
              localField: "studentId",
              foreignField: "_id",
              as: "student",
              pipeline: [{ $project: { firstName: 1, lastName: 1, email: 1, phone: 1 } }],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "instructorId",
              foreignField: "_id",
              as: "instructor",
              pipeline: [{ $project: { firstName: 1, lastName: 1, email: 1, phone: 1, hourlyRate: 1 } }],
            },
          },
          { $unwind: "$student" },
          { $unwind: "$instructor" },
        ])
        .toArray()

      return {
        success: true,
        data: bookings,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
      }
    } catch (error) {
      console.error("Error getting bookings:", error)
      return { success: false, error: "Failed to get bookings" }
    }
  }

  // Update booking status
  static async updateBookingStatus(bookingId: string, status: string, notes?: string) {
    try {
      const updateData: any = { status }

      if (notes) {
        updateData["notes.adminNotes"] = notes
      }

      if (status === "completed") {
        updateData.completedAt = new Date()
      }

      const result = await DatabaseService.updateById(this.COLLECTION, bookingId, updateData)
      return result
    } catch (error) {
      console.error("Error updating booking status:", error)
      return { success: false, error: "Failed to update booking status" }
    }
  }

  // Update payment status
  static async updatePaymentStatus(bookingId: string, paymentStatus: string, transactionId?: string) {
    try {
      const updateData: any = {
        "payment.status": paymentStatus,
      }

      if (transactionId) {
        updateData["payment.transactionId"] = transactionId
      }

      if (paymentStatus === "completed") {
        updateData["payment.paidAt"] = new Date()
      }

      const result = await DatabaseService.updateById(this.COLLECTION, bookingId, updateData)
      return result
    } catch (error) {
      console.error("Error updating payment status:", error)
      return { success: false, error: "Failed to update payment status" }
    }
  }

  // Get booking statistics
  static async getBookingStats(filters: { instructorId?: string; dateFrom?: Date; dateTo?: Date } = {}) {
    try {
      const { instructorId, dateFrom, dateTo } = filters

      const matchQuery: any = {}
      if (instructorId) matchQuery.instructorId = new ObjectId(instructorId)
      if (dateFrom || dateTo) {
        matchQuery.date = {}
        if (dateFrom) matchQuery.date.$gte = dateFrom
        if (dateTo) matchQuery.date.$lte = dateTo
      }

      const collection = await DatabaseService.getCollection(this.COLLECTION)

      const stats = await collection
        .aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: null,
              totalBookings: { $sum: 1 },
              totalRevenue: { $sum: "$price.total" },
              completedBookings: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
              },
              pendingBookings: {
                $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
              },
              confirmedBookings: {
                $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
              },
              cancelledBookings: {
                $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
              },
            },
          },
        ])
        .toArray()

      return {
        success: true,
        data: stats[0] || {
          totalBookings: 0,
          totalRevenue: 0,
          completedBookings: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          cancelledBookings: 0,
        },
      }
    } catch (error) {
      console.error("Error getting booking stats:", error)
      return { success: false, error: "Failed to get booking statistics" }
    }
  }
}
