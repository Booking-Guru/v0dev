// Node.js script to seed the database with Australian instructor data
const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://adminUser:Topsearch1234567890@cluster0.k2kdnez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const australianInstructors = [
  // Sydney Instructors
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@drivelearn.com.au",
    phone: "+61 412 345 678",
    city: "Sydney",
    areas: ["CBD", "North Shore", "Eastern Suburbs"],
    coordinates: { lat: -33.8688, lng: 151.2093 },
    hourlyRate: 65,
    specialties: ["Manual", "Automatic", "Intensive Courses"],
    experience: 8,
    rating: 4.9,
    totalReviews: 127,
  },
  {
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@drivelearn.com.au",
    phone: "+61 423 456 789",
    city: "Sydney",
    areas: ["Western Sydney", "Parramatta", "Blacktown"],
    coordinates: { lat: -33.815, lng: 150.975 },
    hourlyRate: 60,
    specialties: ["Manual", "Nervous Drivers", "Test Preparation"],
    experience: 12,
    rating: 4.8,
    totalReviews: 89,
  },
  {
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma.wilson@drivelearn.com.au",
    phone: "+61 434 567 890",
    city: "Sydney",
    areas: ["Inner West", "Canterbury", "Bankstown"],
    coordinates: { lat: -33.9173, lng: 151.1313 },
    hourlyRate: 58,
    specialties: ["Automatic", "Female Instructor", "Refresher Lessons"],
    experience: 6,
    rating: 4.9,
    totalReviews: 156,
  },
  {
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@drivelearn.com.au",
    phone: "+61 445 678 901",
    city: "Sydney",
    areas: ["Southern Sydney", "Sutherland", "Cronulla"],
    coordinates: { lat: -34.0285, lng: 151.1292 },
    hourlyRate: 62,
    specialties: ["Manual", "Motorway Lessons", "Pass Plus"],
    experience: 15,
    rating: 4.7,
    totalReviews: 203,
  },

  // Melbourne Instructors
  {
    firstName: "Jessica",
    lastName: "Taylor",
    email: "jessica.taylor@drivelearn.com.au",
    phone: "+61 456 789 012",
    city: "Melbourne",
    areas: ["CBD", "South Yarra", "Toorak"],
    coordinates: { lat: -37.8136, lng: 144.9631 },
    hourlyRate: 68,
    specialties: ["Automatic", "Intensive Courses", "Female Instructor"],
    experience: 10,
    rating: 4.8,
    totalReviews: 142,
  },
  {
    firstName: "James",
    lastName: "Anderson",
    email: "james.anderson@drivelearn.com.au",
    phone: "+61 467 890 123",
    city: "Melbourne",
    areas: ["Northern Suburbs", "Preston", "Reservoir"],
    coordinates: { lat: -37.7359, lng: 145.0053 },
    hourlyRate: 55,
    specialties: ["Manual", "Test Preparation", "Nervous Drivers"],
    experience: 7,
    rating: 4.6,
    totalReviews: 98,
  },
  {
    firstName: "Sophie",
    lastName: "Martinez",
    email: "sophie.martinez@drivelearn.com.au",
    phone: "+61 478 901 234",
    city: "Melbourne",
    areas: ["Eastern Suburbs", "Box Hill", "Doncaster"],
    coordinates: { lat: -37.8197, lng: 145.1231 },
    hourlyRate: 63,
    specialties: ["Automatic", "Refresher Lessons", "Senior Drivers"],
    experience: 9,
    rating: 4.9,
    totalReviews: 178,
  },

  // Brisbane Instructors
  {
    firstName: "Ryan",
    lastName: "O'Connor",
    email: "ryan.oconnor@drivelearn.com.au",
    phone: "+61 489 012 345",
    city: "Brisbane",
    areas: ["CBD", "South Bank", "West End"],
    coordinates: { lat: -27.4698, lng: 153.0251 },
    hourlyRate: 58,
    specialties: ["Manual", "Automatic", "Intensive Courses"],
    experience: 11,
    rating: 4.7,
    totalReviews: 134,
  },
  {
    firstName: "Chloe",
    lastName: "Thompson",
    email: "chloe.thompson@drivelearn.com.au",
    phone: "+61 490 123 456",
    city: "Brisbane",
    areas: ["North Brisbane", "Chermside", "Aspley"],
    coordinates: { lat: -27.3818, lng: 153.035 },
    hourlyRate: 55,
    specialties: ["Automatic", "Female Instructor", "Nervous Drivers"],
    experience: 5,
    rating: 4.8,
    totalReviews: 87,
  },

  // Perth Instructors
  {
    firstName: "Luke",
    lastName: "Davis",
    email: "luke.davis@drivelearn.com.au",
    phone: "+61 401 234 567",
    city: "Perth",
    areas: ["CBD", "Northbridge", "Subiaco"],
    coordinates: { lat: -31.9505, lng: 115.8605 },
    hourlyRate: 60,
    specialties: ["Manual", "Test Preparation", "Motorway Lessons"],
    experience: 13,
    rating: 4.6,
    totalReviews: 156,
  },
  {
    firstName: "Olivia",
    lastName: "White",
    email: "olivia.white@drivelearn.com.au",
    phone: "+61 412 345 678",
    city: "Perth",
    areas: ["Northern Suburbs", "Joondalup", "Wanneroo"],
    coordinates: { lat: -31.7448, lng: 115.7661 },
    hourlyRate: 57,
    specialties: ["Automatic", "Female Instructor", "Refresher Lessons"],
    experience: 8,
    rating: 4.9,
    totalReviews: 123,
  },

  // Adelaide Instructors
  {
    firstName: "Nathan",
    lastName: "Lee",
    email: "nathan.lee@drivelearn.com.au",
    phone: "+61 423 456 789",
    city: "Adelaide",
    areas: ["CBD", "North Adelaide", "Prospect"],
    coordinates: { lat: -34.9285, lng: 138.6007 },
    hourlyRate: 52,
    specialties: ["Manual", "Automatic", "Pass Plus"],
    experience: 9,
    rating: 4.7,
    totalReviews: 112,
  },
  {
    firstName: "Grace",
    lastName: "Kim",
    email: "grace.kim@drivelearn.com.au",
    phone: "+61 434 567 890",
    city: "Adelaide",
    areas: ["Eastern Suburbs", "Burnside", "Unley"],
    coordinates: { lat: -34.9434, lng: 138.6651 },
    hourlyRate: 55,
    specialties: ["Automatic", "Female Instructor", "Intensive Courses"],
    experience: 6,
    rating: 4.8,
    totalReviews: 94,
  },

  // Gold Coast Instructors
  {
    firstName: "Jake",
    lastName: "Roberts",
    email: "jake.roberts@drivelearn.com.au",
    phone: "+61 445 678 901",
    city: "Gold Coast",
    areas: ["Surfers Paradise", "Broadbeach", "Main Beach"],
    coordinates: { lat: -28.0167, lng: 153.4 },
    hourlyRate: 58,
    specialties: ["Manual", "Test Preparation", "Nervous Drivers"],
    experience: 7,
    rating: 4.6,
    totalReviews: 78,
  },
  {
    firstName: "Mia",
    lastName: "Garcia",
    email: "mia.garcia@drivelearn.com.au",
    phone: "+61 456 789 012",
    city: "Gold Coast",
    areas: ["Southport", "Labrador", "Biggera Waters"],
    coordinates: { lat: -27.9667, lng: 153.4 },
    hourlyRate: 56,
    specialties: ["Automatic", "Female Instructor", "Refresher Lessons"],
    experience: 4,
    rating: 4.9,
    totalReviews: 65,
  },

  // Newcastle Instructors
  {
    firstName: "Connor",
    lastName: "Murphy",
    email: "connor.murphy@drivelearn.com.au",
    phone: "+61 467 890 123",
    city: "Newcastle",
    areas: ["CBD", "The Hill", "Cooks Hill"],
    coordinates: { lat: -32.9283, lng: 151.7817 },
    hourlyRate: 54,
    specialties: ["Manual", "Automatic", "Motorway Lessons"],
    experience: 10,
    rating: 4.7,
    totalReviews: 89,
  },

  // Canberra Instructors
  {
    firstName: "Zoe",
    lastName: "Clark",
    email: "zoe.clark@drivelearn.com.au",
    phone: "+61 478 901 234",
    city: "Canberra",
    areas: ["Civic", "Braddon", "Turner"],
    coordinates: { lat: -35.2809, lng: 149.13 },
    hourlyRate: 59,
    specialties: ["Automatic", "Female Instructor", "Test Preparation"],
    experience: 8,
    rating: 4.8,
    totalReviews: 102,
  },

  // Sunshine Coast Instructors
  {
    firstName: "Ethan",
    lastName: "Walker",
    email: "ethan.walker@drivelearn.com.au",
    phone: "+61 489 012 345",
    city: "Sunshine Coast",
    areas: ["Maroochydore", "Mooloolaba", "Caloundra"],
    coordinates: { lat: -26.65, lng: 153.0667 },
    hourlyRate: 56,
    specialties: ["Manual", "Intensive Courses", "Pass Plus"],
    experience: 6,
    rating: 4.6,
    totalReviews: 73,
  },

  // Wollongong Instructors
  {
    firstName: "Isabella",
    lastName: "Hall",
    email: "isabella.hall@drivelearn.com.au",
    phone: "+61 490 123 456",
    city: "Wollongong",
    areas: ["CBD", "North Wollongong", "Fairy Meadow"],
    coordinates: { lat: -34.4278, lng: 150.8931 },
    hourlyRate: 53,
    specialties: ["Automatic", "Female Instructor", "Nervous Drivers"],
    experience: 5,
    rating: 4.9,
    totalReviews: 67,
  },

  // Hobart Instructors
  {
    firstName: "Mason",
    lastName: "Young",
    email: "mason.young@drivelearn.com.au",
    phone: "+61 401 234 567",
    city: "Hobart",
    areas: ["CBD", "Battery Point", "Sandy Bay"],
    coordinates: { lat: -42.8821, lng: 147.3272 },
    hourlyRate: 51,
    specialties: ["Manual", "Test Preparation", "Refresher Lessons"],
    experience: 12,
    rating: 4.7,
    totalReviews: 95,
  },

  // Geelong Instructors
  {
    firstName: "Ava",
    lastName: "King",
    email: "ava.king@drivelearn.com.au",
    phone: "+61 412 345 678",
    city: "Geelong",
    areas: ["CBD", "East Geelong", "Newtown"],
    coordinates: { lat: -38.1499, lng: 144.3617 },
    hourlyRate: 54,
    specialties: ["Automatic", "Female Instructor", "Intensive Courses"],
    experience: 7,
    rating: 4.8,
    totalReviews: 81,
  },

  // Townsville Instructors
  {
    firstName: "Noah",
    lastName: "Wright",
    email: "noah.wright@drivelearn.com.au",
    phone: "+61 423 456 789",
    city: "Townsville",
    areas: ["CBD", "South Townsville", "Hyde Park"],
    coordinates: { lat: -19.259, lng: 146.8169 },
    hourlyRate: 52,
    specialties: ["Manual", "Automatic", "Pass Plus"],
    experience: 9,
    rating: 4.6,
    totalReviews: 74,
  },

  // Cairns Instructors
  {
    firstName: "Lily",
    lastName: "Green",
    email: "lily.green@drivelearn.com.au",
    phone: "+61 434 567 890",
    city: "Cairns",
    areas: ["CBD", "Edge Hill", "Whitfield"],
    coordinates: { lat: -16.9186, lng: 145.7781 },
    hourlyRate: 53,
    specialties: ["Automatic", "Female Instructor", "Nervous Drivers"],
    experience: 4,
    rating: 4.9,
    totalReviews: 58,
  },

  // Darwin Instructors
  {
    firstName: "William",
    lastName: "Adams",
    email: "william.adams@drivelearn.com.au",
    phone: "+61 445 678 901",
    city: "Darwin",
    areas: ["CBD", "The Gardens", "Parap"],
    coordinates: { lat: -12.4634, lng: 130.8456 },
    hourlyRate: 55,
    specialties: ["Manual", "Test Preparation", "Motorway Lessons"],
    experience: 11,
    rating: 4.7,
    totalReviews: 86,
  },

  // Toowoomba Instructors
  {
    firstName: "Charlotte",
    lastName: "Baker",
    email: "charlotte.baker@drivelearn.com.au",
    phone: "+61 456 789 012",
    city: "Toowoomba",
    areas: ["CBD", "East Toowoomba", "Newtown"],
    coordinates: { lat: -27.5598, lng: 151.9507 },
    hourlyRate: 50,
    specialties: ["Automatic", "Female Instructor", "Refresher Lessons"],
    experience: 6,
    rating: 4.8,
    totalReviews: 72,
  },
]

async function seedAustralianInstructors() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("drivelearn")

    // Clear existing instructors (optional)
    await db.collection("users").deleteMany({ role: "instructor" })
    console.log("Cleared existing instructors")

    // Create instructor documents
    const instructorDocs = []

    for (const instructor of australianInstructors) {
      const instructorDoc = {
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        email: instructor.email,
        password: await bcrypt.hash("password123", 12),
        phone: instructor.phone,
        role: "instructor",
        licenseNumber: `LIC${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        adiBadgeNumber: `ADI${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        experience: instructor.experience,
        specialties: instructor.specialties,
        hourlyRate: instructor.hourlyRate,
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
          city: instructor.city,
          areas: instructor.areas,
          coordinates: instructor.coordinates,
        },
        vehicle: {
          make: ["Toyota", "Honda", "Mazda", "Holden", "Ford"][Math.floor(Math.random() * 5)],
          model: ["Corolla", "Civic", "Mazda3", "Cruze", "Focus"][Math.floor(Math.random() * 5)],
          year: 2018 + Math.floor(Math.random() * 6),
          transmission: instructor.specialties.includes("Manual") ? "manual" : "automatic",
          dualControls: true,
        },
        rating: instructor.rating,
        totalReviews: instructor.totalReviews,
        isVerified: true,
        isActive: true,
        documents: {
          drivingLicense: "",
          adiBadge: "",
          insurance: "",
          dbs: "",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      instructorDocs.push(instructorDoc)
    }

    // Insert all instructors
    const result = await db.collection("users").insertMany(instructorDocs)
    console.log(`Inserted ${result.insertedCount} Australian instructors`)

    // Create some sample students for Australian cities
    const students = [
      {
        firstName: "Alex",
        lastName: "Smith",
        email: "alex.smith@example.com.au",
        password: await bcrypt.hash("password123", 12),
        phone: "+61 412 111 222",
        role: "student",
        address: {
          street: "123 George Street",
          city: "Sydney",
          postcode: "2000",
          country: "Australia",
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
        firstName: "Samantha",
        lastName: "Jones",
        email: "samantha.jones@example.com.au",
        password: await bcrypt.hash("password123", 12),
        phone: "+61 423 333 444",
        role: "student",
        address: {
          street: "456 Collins Street",
          city: "Melbourne",
          postcode: "3000",
          country: "Australia",
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

    await db.collection("users").insertMany(students)
    console.log(`Inserted ${students.length} sample students`)

    console.log("Australian instructor seeding completed successfully!")
    console.log("\nSample login credentials:")
    console.log("Admin: admin@drivelearn.com / admin123")
    console.log("Instructor: sarah.johnson@drivelearn.com.au / password123")
    console.log("Student: alex.smith@example.com.au / password123")
  } catch (error) {
    console.error("Error seeding Australian instructors:", error)
  } finally {
    await client.close()
  }
}

// Run the seed function
seedAustralianInstructors()
