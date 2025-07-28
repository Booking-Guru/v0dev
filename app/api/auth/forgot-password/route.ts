import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/userService"
import { EmailService } from "@/lib/services/emailService"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const userResult = await UserService.getUserByEmail(email)

    if (!userResult.success) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, we've sent a password reset link.",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token
    const saveTokenResult = await UserService.savePasswordResetToken(
      userResult.data._id.toString(),
      resetToken,
      resetTokenExpiry,
    )

    if (!saveTokenResult.success) {
      return NextResponse.json({ success: false, error: "Failed to generate reset token" }, { status: 500 })
    }

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`

    const emailResult = await EmailService.sendPasswordResetEmail(email, userResult.data.firstName, resetUrl)

    if (!emailResult.success) {
      console.error("Failed to send reset email:", emailResult.error)
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent a password reset link.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
