"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthProvider"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"student" | "instructor">("student")
  const [studentData, setStudentData] = useState({ email: "", password: "" })
  const [instructorData, setInstructorData] = useState({ email: "", password: "" })
  const [showStudentPassword, setShowStudentPassword] = useState(false)
  const [showInstructorPassword, setShowInstructorPassword] = useState(false)
  const [studentLoading, setStudentLoading] = useState(false)
  const [instructorLoading, setInstructorLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStudentLoading(true)
    setError("")

    const result = await login(studentData.email, studentData.password)
    if (!result.success) {
      setError(result.error || "Login failed")
    }
    setStudentLoading(false)
  }

  const handleInstructorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInstructorLoading(true)
    setError("")

    const result = await login(instructorData.email, instructorData.password)
    if (!result.success) {
      setError(result.error || "Login failed")
    }
    setInstructorLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Car className="h-8 w-8 text-gray-900" />
            <span className="text-2xl font-bold text-gray-900">BookingGuru</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("student")}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-l-lg border ${
              activeTab === "student"
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-100 text-gray-300 border-gray-300"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveTab("instructor")}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-r-lg border-l-0 border ${
              activeTab === "instructor"
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-100 text-gray-300 border-gray-300"
            }`}
          >
            Instructor
          </button>
        </div>

        {/* Login Forms */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-8">
            {activeTab === "student" ? (
              <div>
                <h2 className="text-2xl text-center font-bold text-gray-900 mb-2">Student Login</h2>
                <p className="text-gray-600 text-center text-sm mb-6">Sign in to book driving lessons and manage your account</p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="student-email" className="block text-sm font-medium text-gray-900 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="Enter your email"
                      value={studentData.email}
                      onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="student-password" className="block text-sm font-medium text-gray-900 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        type={showStudentPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={studentData.password}
                        onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                        required
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStudentPassword(!showStudentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showStudentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={studentLoading}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
                  >
                    {studentLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/forgot-password" className="text-gray-600 hover:text-gray-900 text-sm">
                    Forgot your password?
                  </Link>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-gray-600 text-sm">Don't have an account? </span>
                  <Link href="/register" className="text-gray-900 hover:underline text-sm font-medium">
                    Sign up
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Instructor Login</h2>
                <p className="text-gray-600 text-center text-sm mb-6">Sign in to manage your lessons and student bookings</p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleInstructorSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="instructor-email" className="block text-sm font-medium text-gray-900 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="instructor-email"
                      type="email"
                      placeholder="Enter your email"
                      value={instructorData.email}
                      onChange={(e) => setInstructorData({ ...instructorData, email: e.target.value })}
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="instructor-password" className="block text-sm font-medium text-gray-900 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="instructor-password"
                        type={showInstructorPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={instructorData.password}
                        onChange={(e) => setInstructorData({ ...instructorData, password: e.target.value })}
                        required
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowInstructorPassword(!showInstructorPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showInstructorPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={instructorLoading}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
                  >
                    {instructorLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/forgot-password" className="text-gray-600 hover:text-gray-900 text-sm">
                    Forgot your password?
                  </Link>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-gray-600 text-sm">Don't have an account? </span>
                  <Link href="/register/instructor" className="text-gray-900 hover:underline text-sm font-medium">
                    Sign up
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Links */}
        <div className="mt-8 text-center space-y-2">
          <div>
            <Link href="/admin/login" className="text-gray-600 hover:text-gray-900 text-sm">
              Admin Login
            </Link>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Want to become an instructor? </span>
            <Link href="/register/instructor" className="text-gray-900 hover:underline text-sm font-medium">
              Apply here
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        {/* <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Demo Credentials:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div>
              <strong>Admin:</strong> admin@drivelearn.com / admin123
            </div>
            <div>
              <strong>Instructor:</strong> sarah.johnson@drivelearn.com.au / password123
            </div>
            <div>
              <strong>Student:</strong> alex.smith@example.com.au / password123
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
