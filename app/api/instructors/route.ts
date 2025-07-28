import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/userService"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      city: searchParams.get("city") || undefined,
      sortBy: searchParams.get("sortBy") || "rating",
      limit: Number.parseInt(searchParams.get("limit") || "10"),
      page: Number.parseInt(searchParams.get("page") || "1"),
      specialties:
        searchParams
          .get("specialties")
          ?.split(",")
          .filter((s) => s !== "all") || undefined,
      minRating:
        searchParams.get("minRating") && searchParams.get("minRating") !== "any"
          ? Number.parseFloat(searchParams.get("minRating")!)
          : undefined,
      maxRate:
        searchParams.get("maxRate") && searchParams.get("maxRate") !== "any"
          ? Number.parseFloat(searchParams.get("maxRate")!)
          : undefined,
    }

    console.log("Fetching instructors with filters:", filters)

    const result = await UserService.getInstructors(filters)

    if (!result.success) {
      console.error("Failed to get instructors:", result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      instructors: result.data,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error("Error fetching instructors:", error)
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const instructorData = await request.json()

    // Validate instructor-specific fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "phone",
      "licenseNumber",
      "adiBadgeNumber",
      "experience",
      "hourlyRate",
      "location",
      "vehicle",
      "specialties",
    ]

    for (const field of requiredFields) {
      if (!instructorData[field]) {
        return NextResponse.json({ error: `${field} is required for instructors` }, { status: 400 })
      }
    }

    // Set role to instructor
    instructorData.role = "instructor"
    instructorData.rating = 0
    instructorData.totalReviews = 0
    instructorData.isVerified = false

    const result = await UserService.createUser(instructorData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: "Instructor registered successfully",
        instructor: result.user,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating instructor:", error)
    return NextResponse.json({ error: "Failed to create instructor" }, { status: 500 })
  }
}
