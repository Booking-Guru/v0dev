export interface User {
  _id?: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: "student" | "instructor" | "admin"
  address?: {
    street: string
    city: string
    postcode: string
    country: string
  }
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface Student extends User {
  role: "student"
  licenseNumber?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  medicalConditions?: string[]
  preferences?: {
    instructorGender?: "male" | "female" | "no-preference"
    carType?: "manual" | "automatic" | "both"
    lessonDuration?: number
  }
}

export interface Instructor extends User {
  role: "instructor"
  licenseNumber: string
  adiBadgeNumber: string
  experience: number
  specialties: string[]
  hourlyRate: number
  availability: {
    [key: string]: string[] // day: available time slots
  }
  location: {
    city: string
    areas: string[]
    coordinates?: {
      lat: number
      lng: number
    }
  }
  vehicle: {
    make: string
    model: string
    year: number
    transmission: "manual" | "automatic"
    dualControls: boolean
  }
  rating: number
  totalReviews: number
  isVerified: boolean
  documents: {
    drivingLicense: string
    adiBadge: string
    insurance: string
    dbs: string
  }
}
