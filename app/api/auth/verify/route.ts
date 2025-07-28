import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/userService"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, error: "No token provided" }, { status: 401 })
    }

    // Verify token
    const tokenResult = await UserService.verifyToken(token)
    if (!tokenResult.success) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const decoded = tokenResult.data as any

    // Get user details
    const userResult = await UserService.getUserById(decoded.userId)
    if (!userResult.success) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userResult.data._id.toString(),
        email: userResult.data.email,
        firstName: userResult.data.firstName,
        lastName: userResult.data.lastName,
        role: userResult.data.role,
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ success: false, error: "Token verification failed" }, { status: 500 })
  }
}
