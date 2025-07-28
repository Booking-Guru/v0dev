import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Form validation utilities
export const validators = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  phone: (phone: string) => {
    const phoneRegex = /^(\+44|0)[0-9]{10}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  },

  password: (password: string) => {
    return password.length >= 6
  },

  required: (value: string) => {
    return value.trim().length > 0
  },

  postcode: (postcode: string) => {
    const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i
    return postcodeRegex.test(postcode.trim())
  },

  hourlyRate: (rate: number) => {
    return rate >= 20 && rate <= 100
  },
}

// Form error messages
export const errorMessages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  phone: "Please enter a valid UK phone number",
  password: "Password must be at least 6 characters long",
  postcode: "Please enter a valid UK postcode",
  hourlyRate: "Hourly rate must be between £20 and £100",
  passwordMatch: "Passwords do not match",
  dateInPast: "Date cannot be in the past",
  timeSlotTaken: "This time slot is not available",
}

// API response handler
export const handleApiResponse = async (response: Response) => {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong")
  }

  return data
}

// Format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount)
}

// Format date
export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}
