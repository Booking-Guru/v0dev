// Node.js script to seed the database with sample data
const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://adminUser:Topsearch1234567890@cluster0.k2kdnez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("drivelearn")

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("bookings").deleteMany({})
    console.log("Cleared existing data")

    // Create sample instructors
    const instructors = [
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@example.com",
        password: await bcrypt.hash("password123", 12),
        phone: "+44 7123 456789",
        role: "instructor",
        licenseNumber: "ABC123456",
        adiBadgeNumber: "12345",
        experience: 8,
        specialties: ["Manual", "Automatic", "Intensive Courses"],
        hourlyRate: 35,
        availability: {
          monday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
          tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
          wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
          thursday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
          friday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
          saturday: ["09:00", "10:00", "11:00"],
          sunday: [],
        },
        location: {
          city: "Manchester",
          areas: ["City Centre", "Didsbury", "Chorlton"],
          coordinates: { lat: 53.4808, lng: -2.2426 },
        },
        vehicle: {
          make: "Ford",
          model: "Focus",
          year: 2020,
          transmission: "manual",
          dualControls: true,
        },
        rating: 4.9,
        totalReviews: 127,
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Mike",
        lastName: "Thompson",
        email: "mike.thompson@example.com",
        password: await bcrypt.hash("password123", 12),
        phone: "+44 7987 654321",
        role: "instructor",
        licenseNumber: "DEF789012",
        adiBadgeNumber: "67890",
        experience: 12,
        specialties: ["Manual", "Pass Plus", "Nervous Drivers"],
        hourlyRate: 40,
        availability: {
          monday: ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
          tuesday: ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
          wednesday: ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
          thursday: ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
          friday: ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
          saturday: ["10:00", "11:00", "12:00"],
          sunday: [],
        },
        location: {
          city: "Manchester",
          areas: ["Salford", "Trafford", "Old Trafford"],
          coordinates: { lat: 53.4668, lng: -2.2743 },
        },
        vehicle: {
          make: "Vauxhall",
          model: "Corsa",
          year: 2019,
          transmission: "manual",
          dualControls: true,
        },
        rating: 4.8,
        totalReviews: 89,
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Emma",
        lastName: "Wilson",
        email: "emma.wilson@example.com",
        password: await bcrypt.hash("password123", 12),
        phone: "+44 7456 123789",
        role: "instructor",
        licenseNumber: "GHI345678",
        adiBadgeNumber: "13579",
        experience: 6,
        specialties: ["Automatic", "Female Instructor", "Refresher Lessons"],
        hourlyRate: 38,
        availability: {
          monday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
          tuesday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
          wednesday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
          thursday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
          friday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
          saturday: ["09:00", "10:00", "11:00"],
          sunday: [],
        },
        location: {
          city: "Manchester",
          areas: ["Stockport", "Heaton Moor", "Bramhall"],
          coordinates: { lat: 53.4106, lng: -2.1575 },
        },
        vehicle: {
          make: "Nissan",
          model: "Micra",
          year: 2021,
          transmission: "automatic",
          dualControls: true,
        },
        rating: 4.9,
        totalReviews: 156,
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Insert instructors
    const instructorResult = await db.collection("users").insertMany(instructors)
    console.log(`Inserted ${instructorResult.insertedCount} instructors`)

    // Create sample students
    const students = [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        password: await bcrypt.hash("password123", 12),
        phone: "+44 7111 222333",
        role: "student",
        address: {
          street: "123 Main Street",
          city: "Manchester",
          postcode: "M1 1AA",
          country: "UK",
        },
        preferences: {
          instructorGender: "no-preference",
          carType: "manual",
          lessonDuration: 1,
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        password: await bcrypt.hash("password123", 12),
        phone: "+44 7222 333444",
        role: "student",
        address: {
          street: "456 Oak Avenue",
          city: "Manchester",
          postcode: "M2 2BB",
          country: "UK",
        },
        preferences: {
          instructorGender: "female",
          carType: "automatic",
          lessonDuration: 1.5,
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Insert students
    const studentResult = await db.collection("users").insertMany(students)
    console.log(`Inserted ${studentResult.insertedCount} students`)

    // Create admin user
    const admin = {
      firstName: "Admin",
      lastName: "User",
      email: "admin@drivelearn.com",
      password: await bcrypt.hash("admin123", 12),
      phone: "+44 7000 000000",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("users").insertOne(admin)
    console.log("Inserted admin user")

    // Create sample bookings
    const instructorIds = Object.values(instructorResult.insertedIds)
    const studentIds = Object.values(studentResult.insertedIds)

    const bookings = [
      {
        studentId: studentIds[0],
        instructorId: instructorIds[0],
        lessonType: "standard",
        date: new Date("2024-01-20"),
        startTime: "10:00",
        duration: 1,
        status: "confirmed",
        pickupLocation: {
          address: "123 Main Street, Manchester M1 1AA",
          coordinates: { lat: 53.4808, lng: -2.2426 },
        },
        price: {
          lessonCost: 35,
          bookingFee: 2,
          total: 37,
        },
        payment: {
          status: "completed",
          method: "card",
          transactionId: "txn_123456",
          paidAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: studentIds[1],
        instructorId: instructorIds[1],
        lessonType: "intensive",
        date: new Date("2024-01-22"),
        startTime: "14:00",
        duration: 2,
        status: "pending",
        pickupLocation: {
          address: "456 Oak Avenue, Manchester M2 2BB",
          coordinates: { lat: 53.4668, lng: -2.2743 },
        },
        price: {
          lessonCost: 80,
          bookingFee: 2,
          total: 82,
        },
        payment: {
          status: "pending",
          method: "card",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const bookingResult = await db.collection("bookings").insertMany(bookings)
    console.log(`Inserted ${bookingResult.insertedCount} bookings`)

    console.log("Database seeded successfully!")
    console.log("\nSample login credentials:")
    console.log("Admin: admin@drivelearn.com / admin123")
    console.log("Instructor: sarah.johnson@example.com / password123")
    console.log("Student: john.smith@example.com / password123")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

// Run the seed function
seedDatabase()
