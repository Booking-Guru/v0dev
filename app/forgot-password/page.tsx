"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSent(true)
        toast({
          title: "Reset email sent",
          description: "Check your email for password reset instructions.",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send reset email",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900">
            <Car className="h-8 w-8 text-gray-900" />
            <span>BookingGuru</span>
          </Link>
        </div>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <CardTitle className="text-2xl text-gray-900">Reset Password</CardTitle>
            </div>
            <CardDescription className="text-gray-600">
              {sent
                ? "We've sent you a password reset link"
                : "Enter your email address and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">Check your email</p>
                  <p className="text-sm text-gray-600">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                </div>
                <div className="space-y-2">
                  <Button asChild className="w-full bg-gray-900 hover:bg-gray-800">
                    <Link href="/login">Back to Login</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSent(false)
                      setEmail("")
                    }}
                    className="w-full"
                  >
                    Try different email
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900 font-medium">
                    Email address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium h-11"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <div className="text-center">
                  <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm">
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
