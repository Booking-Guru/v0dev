import nodemailer from "nodemailer"

export class EmailService {
  private static transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  static async sendPasswordResetEmail(email: string, firstName: string, resetUrl: string) {
    try {
      // In development, just log the email
      if (process.env.NODE_ENV === "development") {
        console.log("=== PASSWORD RESET EMAIL ===")
        console.log(`To: ${email}`)
        console.log(`Name: ${firstName}`)
        console.log(`Reset URL: ${resetUrl}`)
        console.log("============================")
        return { success: true }
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || "noreply@bookingguru.com",
        to: email,
        subject: "Reset Your BookingGuru Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Reset Your Password</h2>
            <p>Hi ${firstName},</p>
            <p>You requested to reset your password for your BookingGuru account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              The BookingGuru Team
            </p>
          </div>
        `,
      }

      await this.transporter.sendMail(mailOptions)
      return { success: true }
    } catch (error) {
      console.error("Error sending password reset email:", error)
      return { success: false, error: "Failed to send email" }
    }
  }

  static async sendWelcomeEmail(email: string, firstName: string, role: string) {
    try {
      // In development, just log the email
      if (process.env.NODE_ENV === "development") {
        console.log("=== WELCOME EMAIL ===")
        console.log(`To: ${email}`)
        console.log(`Name: ${firstName}`)
        console.log(`Role: ${role}`)
        console.log("=====================")
        return { success: true }
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || "noreply@bookingguru.com",
        to: email,
        subject: `Welcome to BookingGuru, ${firstName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Welcome to BookingGuru!</h2>
            <p>Hi ${firstName},</p>
            <p>Welcome to BookingGuru! Your ${role} account has been successfully created.</p>
            ${
              role === "student"
                ? `<p>You can now browse and book driving lessons with our qualified instructors.</p>`
                : `<p>You can now manage your availability and start accepting bookings from students.</p>`
            }
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login" 
                 style="background-color: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Get Started
              </a>
            </div>
            <p>If you have any questions, feel free to contact our support team.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              The BookingGuru Team
            </p>
          </div>
        `,
      }

      await this.transporter.sendMail(mailOptions)
      return { success: true }
    } catch (error) {
      console.error("Error sending welcome email:", error)
      return { success: false, error: "Failed to send email" }
    }
  }
}
