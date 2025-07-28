import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/userService"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Instructor ID is required" }, { status: 400 })
    }

    const result = await UserService.getUserById(params.id)

    if (!result.success || !result.data) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    const instructor = result.data

    // Verify this is actually an instructor
    if (instructor.role !== "instructor") {
      return NextResponse.json({ error: "User is not an instructor" }, { status: 404 })
    }

    // Don't return inactive or unverified instructors to public
    if (!instructor.isActive) {
      return NextResponse.json({ error: "Instructor not available" }, { status: 404 })
    }

    return NextResponse.json({ instructor })
  } catch (error) {
    console.error("Error fetching instructor:", error)
    return NextResponse.json({ error: "Failed to fetch instructor" }, { status: 500 })
  }
}
