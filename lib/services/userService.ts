import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { User } from "@/lib/models/User"
import { getCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export class UserService {
  private static readonly COLLECTION = "users"
  private static readonly JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production"

  // Create new user (registration)
  static async createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">) {
    try {
      // Check if user already exists
      const collection = await getCollection(this.COLLECTION)
      const existingUser = await collection.findOne({ email: userData.email.toLowerCase().trim() })

      if (existingUser) {
        return { success: false, error: "User already exists with this email" }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      // Create user with timestamps
      const newUser = {
        ...userData,
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await collection.insertOne(newUser)

      if (result.insertedId) {
        // Generate JWT token
        const token = jwt.sign(
          { userId: result.insertedId.toString(), email: userData.email, role: userData.role },
          this.JWT_SECRET,
          { expiresIn: "7d" },
        )

        return {
          success: true,
          user: {
            id: result.insertedId.toString(),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
          },
          token,
        }
      }

      return { success: false, error: "Failed to create user" }
    } catch (error) {
      console.error("Error creating user:", error)
      return { success: false, error: "Failed to create user" }
    }
  }

  // User login with enhanced error handling
  static async loginUser(email: string, password: string) {
    try {
      console.log("Login attempt for email:", email)

      const collection = await getCollection(this.COLLECTION)
      const user = await collection.findOne({
        email: email.toLowerCase().trim(),
        isActive: true,
      })

      console.log("User found:", user ? "Yes" : "No")
      if (user) {
        console.log("User role:", user.role)
        console.log("User name:", user.firstName, user.lastName)
      }

      if (!user) {
        return { success: false, error: "Invalid email or password" }
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      console.log("Password valid:", isPasswordValid)

      if (!isPasswordValid) {
        return { success: false, error: "Invalid email or password" }
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id.toString(), email: user.email, role: user.role }, this.JWT_SECRET, {
        expiresIn: "7d",
      })

      // Update last login
      await collection.updateOne({ _id: user._id }, { $set: { lastLogin: new Date(), updatedAt: new Date() } })

      return {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      }
    } catch (error) {
      console.error("Error logging in user:", error)
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  // Get user by ID with proper ObjectId handling
  static async getUserById(userId: string) {
    try {
      if (!ObjectId.isValid(userId)) {
        return { success: false, error: "Invalid user ID" }
      }

      const collection = await getCollection(this.COLLECTION)
      const user = await collection.findOne(
        { _id: new ObjectId(userId), isActive: true },
        { projection: { password: 0 } },
      )

      if (!user) {
        return { success: false, error: "User not found" }
      }

      return { success: true, data: user }
    } catch (error) {
      console.error("Error getting user:", error)
      return { success: false, error: "Failed to get user" }
    }
  }

  // Get user by email with optimized query
  static async getUserByEmail(email: string) {
    try {
      const collection = await getCollection(this.COLLECTION)
      const user = await collection.findOne(
        { email: email.toLowerCase().trim(), isActive: true },
        { projection: { password: 0 } },
      )

      if (!user) {
        return { success: false, error: "User not found" }
      }

      return { success: true, data: user }
    } catch (error) {
      console.error("Error getting user by email:", error)
      return { success: false, error: "Failed to get user" }
    }
  }

  // Get all instructors with enhanced filtering and pagination
  static async getInstructors(
    filters: {
      city?: string
      sortBy?: string
      limit?: number
      page?: number
      specialties?: string[]
      minRating?: number
      maxRate?: number
      isActive?: boolean
    } = {},
  ) {
    try {
      const {
        city,
        sortBy = "rating",
        limit = 10,
        page = 1,
        specialties,
        minRating,
        maxRate,
        isActive = true,
      } = filters

      console.log("UserService.getInstructors called with filters:", filters)

      // Build query with proper indexing considerations
      const query: any = { role: "instructor", isActive }

      if (city) {
        query["location.city"] = { $regex: new RegExp(city, "i") }
      }

      if (specialties && specialties.length > 0) {
        query.specialties = { $in: specialties }
      }

      if (minRating !== undefined) {
        query.rating = { ...query.rating, $gte: minRating }
      }

      if (maxRate !== undefined) {
        query.hourlyRate = { ...query.hourlyRate, $lte: maxRate }
      }

      console.log("Database query:", query)

      // Build sort with proper indexing
      let sort: any = {}
      switch (sortBy) {
        case "rating":
          sort = { rating: -1, totalReviews: -1 }
          break
        case "price-low":
          sort = { hourlyRate: 1, rating: -1 }
          break
        case "price-high":
          sort = { hourlyRate: -1, rating: -1 }
          break
        case "reviews":
          sort = { totalReviews: -1, rating: -1 }
          break
        case "experience":
          sort = { experience: -1, rating: -1 }
          break
        case "newest":
          sort = { createdAt: -1 }
          break
        default:
          sort = { rating: -1, totalReviews: -1 }
      }

      const collection = await getCollection(this.COLLECTION)

      // Get total count for pagination
      const totalCount = await collection.countDocuments(query)
      console.log("Total instructors found:", totalCount)

      // Get instructors with pagination and proper projection
      const instructors = await collection
        .find(query, {
          projection: {
            password: 0,
            resetToken: 0,
            resetTokenExpiry: 0,
          },
        })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray()

      console.log("Instructors retrieved:", instructors.length)

      return {
        success: true,
        data: instructors,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        },
      }
    } catch (error) {
      console.error("Error getting instructors:", error)
      return { success: false, error: "Failed to get instructors" }
    }
  }

  // Update user profile with validation
  static async updateUser(userId: string, updateData: Partial<User>) {
    try {
      if (!ObjectId.isValid(userId)) {
        return { success: false, error: "Invalid user ID" }
      }

      // Remove sensitive fields that shouldn't be updated directly
      const { password, _id, createdAt, ...safeUpdateData } = updateData as any

      // Add updated timestamp
      const dataToUpdate = {
        ...safeUpdateData,
        updatedAt: new Date(),
      }

      const collection = await getCollection(this.COLLECTION)
      const result = await collection.updateOne({ _id: new ObjectId(userId), isActive: true }, { $set: dataToUpdate })

      if (result.matchedCount === 0) {
        return { success: false, error: "User not found" }
      }

      return { success: true, modifiedCount: result.modifiedCount }
    } catch (error) {
      console.error("Error updating user:", error)
      return { success: false, error: "Failed to update user" }
    }
  }

  // Verify JWT token
  static async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET)
      return { success: true, data: decoded }
    } catch (error) {
      console.error("Token verification error:", error)
      return { success: false, error: "Invalid or expired token" }
    }
  }

  // Update instructor availability with validation
  static async updateInstructorAvailability(instructorId: string, availability: any) {
    try {
      if (!ObjectId.isValid(instructorId)) {
        return { success: false, error: "Invalid instructor ID" }
      }

      const collection = await getCollection(this.COLLECTION)
      const result = await collection.updateOne(
        { _id: new ObjectId(instructorId), role: "instructor", isActive: true },
        {
          $set: {
            availability,
            updatedAt: new Date(),
          },
        },
      )

      if (result.matchedCount === 0) {
        return { success: false, error: "Instructor not found" }
      }

      return { success: true, modifiedCount: result.modifiedCount }
    } catch (error) {
      console.error("Error updating instructor availability:", error)
      return { success: false, error: "Failed to update availability" }
    }
  }

  // Save password reset token with expiry
  static async savePasswordResetToken(userId: string, token: string, expiry: Date) {
    try {
      if (!ObjectId.isValid(userId)) {
        return { success: false, error: "Invalid user ID" }
      }

      const collection = await getCollection(this.COLLECTION)
      const result = await collection.updateOne(
        { _id: new ObjectId(userId), isActive: true },
        {
          $set: {
            resetToken: token,
            resetTokenExpiry: expiry,
            updatedAt: new Date(),
          },
        },
      )

      if (result.matchedCount === 0) {
        return { success: false, error: "User not found" }
      }

      return { success: true }
    } catch (error) {
      console.error("Error saving reset token:", error)
      return { success: false, error: "Failed to save reset token" }
    }
  }

  // Reset password with token validation
  static async resetPasswordWithToken(token: string, newPassword: string) {
    try {
      const collection = await getCollection(this.COLLECTION)

      // Find user with valid reset token
      const user = await collection.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
        isActive: true,
      })

      if (!user) {
        return { success: false, error: "Invalid or expired reset token" }
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12)

      // Update password and clear reset token
      const result = await collection.updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedPassword,
            updatedAt: new Date(),
          },
          $unset: {
            resetToken: "",
            resetTokenExpiry: "",
          },
        },
      )

      return { success: true, modifiedCount: result.modifiedCount }
    } catch (error) {
      console.error("Error resetting password:", error)
      return { success: false, error: "Failed to reset password" }
    }
  }

  // Soft delete user (set isActive to false)
  static async deleteUser(userId: string) {
    try {
      if (!ObjectId.isValid(userId)) {
        return { success: false, error: "Invalid user ID" }
      }

      const collection = await getCollection(this.COLLECTION)
      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            isActive: false,
            updatedAt: new Date(),
          },
        },
      )

      if (result.matchedCount === 0) {
        return { success: false, error: "User not found" }
      }

      return { success: true, modifiedCount: result.modifiedCount }
    } catch (error) {
      console.error("Error deleting user:", error)
      return { success: false, error: "Failed to delete user" }
    }
  }

  // Get user statistics (for admin dashboard)
  static async getUserStats() {
    try {
      const collection = await getCollection(this.COLLECTION)

      const stats = await collection
        .aggregate([
          {
            $match: { isActive: true },
          },
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 },
              avgRating: { $avg: "$rating" },
            },
          },
        ])
        .toArray()

      const totalUsers = await collection.countDocuments({ isActive: true })
      const newUsersThisMonth = await collection.countDocuments({
        isActive: true,
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      })

      return {
        success: true,
        data: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
          byRole: stats,
        },
      }
    } catch (error) {
      console.error("Error getting user stats:", error)
      return { success: false, error: "Failed to get user statistics" }
    }
  }
}
