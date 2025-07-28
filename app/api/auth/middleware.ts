import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    role: string
  }
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      // Get token from cookie or Authorization header
      const token = req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")

      if (!token) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as any

      // Add user info to request
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      }

      return handler(authenticatedReq)
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  }
}

export function requireRole(roles: string[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }
      return handler(req)
    })
  }
}
