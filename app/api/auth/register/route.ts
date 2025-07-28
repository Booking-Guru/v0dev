import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/userService"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "password", "phone", "role"]
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (userData.password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Validate role
    const validRoles = ["student", "instructor", "admin"]
    if (!validRoles.includes(userData.role)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 })
    }

    // Additional validation for instructors
    if (userData.role === "instructor") {
      const instructorFields = [
        "licenseNumber",
        "adiBadgeNumber",
        "experience",
        "hourlyRate",
        "location",
        "vehicle",
        "specialties",
      ]
      for (const field of instructorFields) {
        if (!userData[field]) {
          return NextResponse.json({ error: `${field} is required for instructors` }, { status: 400 })
        }
      }

      // Validate hourly rate
      if (userData.hourlyRate < 20 || userData.hourlyRate > 100) {
        return NextResponse.json({ error: "Hourly rate must be between $20 and $100" }, { status: 400 })
      }
    }

    // Set default values based on role
    if (userData.role === "instructor") {
      userData.rating = 0
      userData.totalReviews = 0
      userData.isVerified = false
      userData.availability = {
        monday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        thursday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        friday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        saturday: ["09:00", "10:00", "11:00"],
        sunday: [],
      }
    }

    // Create user
    const result = await UserService.createUser(userData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: result.user,
        token: result.token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
