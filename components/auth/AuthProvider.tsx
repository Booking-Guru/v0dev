"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "student" | "instructor" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      // Verify token with backend
      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        } else {
          localStorage.removeItem("auth_token")
        }
      } else {
        localStorage.removeItem("auth_token")
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      localStorage.removeItem("auth_token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("Login response:", data)

      if (response.ok && data.success) {
        setUser(data.user)
        localStorage.setItem("auth_token", data.token)

        // Redirect based on user role
        switch (data.user.role) {
          case "admin":
            router.push("/admin")
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

        return { success: true }
      } else {
        console.error("Login failed:", data.error)
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_token")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
