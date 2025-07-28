-- MongoDB doesn't use SQL, but here's the equivalent collection structure
-- This is for reference only - MongoDB collections are created automatically

-- Collections to create:
-- 1. users (for students, instructors, and admins)
-- 2. bookings (for lesson bookings)
-- 3. reviews (for instructor reviews)
-- 4. payments (for payment records)

-- Sample data structure for users collection:
/*
{
  "_id": ObjectId,
  "email": "user@example.com",
  "password": "hashed_password",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+44 7123 456789",
  "role": "student|instructor|admin",
  "address": {
    "street": "123 Main St",
    "city": "Manchester",
    "postcode": "M1 1AA",
    "country": "UK"
  },
  "createdAt": ISODate,
  "updatedAt": ISODate,
  "isActive": true,
  
  // Additional fields for instructors:
  "licenseNumber": "ABC123456",
  "adiBadgeNumber": "12345",
  "experience": 8,
  "specialties": ["Manual", "Automatic"],
  "hourlyRate": 35,
  "availability": {
    "monday": ["09:00", "10:00", "11:00"],
    "tuesday": ["09:00", "10:00", "11:00"]
  },
  "location": {
    "city": "Manchester",
    "areas": ["City Centre", "Didsbury"],
    "coordinates": { "lat": 53.4808, "lng": -2.2426 }
  },
  "vehicle": {
    "make": "Ford",
    "model": "Focus",
    "year": 2020,
    "transmission": "manual",
    "dualControls": true
  },
  "rating": 4.9,
  "totalReviews": 127,
  "isVerified": true
}
*/

-- Sample data structure for bookings collection:
/*
{
  "_id": ObjectId,
  "studentId": ObjectId,
  "instructorId": ObjectId,
  "lessonType": "standard",
  "date": ISODate,
  "startTime": "10:00",
  "duration": 1.5,
  "status": "confirmed",
  "pickupLocation": {
    "address": "123 Student Street, Manchester",
    "coordinates": { "lat": 53.4808, "lng": -2.2426 }
  },
  "price": {
    "lessonCost": 52.50,
    "bookingFee": 2.00,
    "total": 54.50
  },
  "payment": {
    "status": "completed",
    "method": "card",
    "transactionId": "txn_123456",
    "paidAt": ISODate
  },
  "createdAt": ISODate,
  "updatedAt": ISODate
}
*/
