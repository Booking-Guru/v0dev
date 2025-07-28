"use client"

import type React from "react"
import { useAuth } from "./AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "student" | "instructor" | "admin"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to appropriate login page based on required role
        if (requiredRole === "admin") {
          router.push("/admin/login")
        } else if (requiredRole === "instructor") {
          router.push("/login")
        } else {
          router.push("/login")
        }
        return
      }

      if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        switch (user.role) {
          case "admin":
            router.push("/admin/dashboard")
            break
          case "instructor":
            router.push("/instructor/dashboard")
            break
          case "student":
            router.push("/dashboard")
            break
          default:
            router.push("/")
        }
        return
      }
    }
  }, [user, loading, requiredRole, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
