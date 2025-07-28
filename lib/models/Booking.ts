export interface Booking {
  _id?: string
  studentId: string
  instructorId: string
  lessonType: "standard" | "intensive" | "refresher" | "test-prep"
  date: Date
  startTime: string
  duration: number // in hours
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show"
  pickupLocation: {
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  dropoffLocation?: {
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  specialRequests?: string
  price: {
    lessonCost: number
    bookingFee: number
    total: number
  }
  payment: {
    status: "pending" | "completed" | "failed" | "refunded"
    method: "card" | "paypal" | "bank-transfer"
    transactionId?: string
    paidAt?: Date
  }
  notes?: {
    instructorNotes?: string
    studentNotes?: string
    adminNotes?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  _id?: string
  bookingId: string
  studentId: string
  instructorId: string
  rating: number // 1-5
  comment: string
  isVerified: boolean
  createdAt: Date
}
