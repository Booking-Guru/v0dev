"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Star, Users, Car, Shield, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const australianCities = [
  { name: "Sydney", state: "NSW", postcode: "2000" },
  { name: "Melbourne", state: "VIC", postcode: "3000" },
  { name: "Brisbane", state: "QLD", postcode: "4000" },
  { name: "Perth", state: "WA", postcode: "6000" },
  { name: "Adelaide", state: "SA", postcode: "5000" },
  { name: "Gold Coast", state: "QLD", postcode: "4217" },
  { name: "Newcastle", state: "NSW", postcode: "2300" },
  { name: "Canberra", state: "ACT", postcode: "2600" },
  { name: "Sunshine Coast", state: "QLD", postcode: "4558" },
  { name: "Wollongong", state: "NSW", postcode: "2500" },
  { name: "Hobart", state: "TAS", postcode: "7000" },
  { name: "Geelong", state: "VIC", postcode: "3220" },
  { name: "Townsville", state: "QLD", postcode: "4810" },
  { name: "Cairns", state: "QLD", postcode: "4870" },
  { name: "Darwin", state: "NT", postcode: "0800" },
  { name: "Toowoomba", state: "QLD", postcode: "4350" },
  { name: "Ballarat", state: "VIC", postcode: "3350" },
  { name: "Bendigo", state: "VIC", postcode: "3550" },
  { name: "Albury", state: "NSW", postcode: "2640" },
  { name: "Launceston", state: "TAS", postcode: "7250" },
]

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredCities = australianCities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.postcode.includes(searchQuery) ||
      city.state.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSearch = () => {
    if (selectedCity) {
      const city = australianCities.find((c) => `${c.name}, ${c.state}` === selectedCity)
      if (city) {
        router.push(`/instructors?city=${encodeURIComponent(city.name)}`)
      }
    } else if (searchQuery) {
      router.push(`/instructors?search=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push("/instructors")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">BookingGuru</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/instructors" className="text-muted-foreground hover:text-foreground">
              Find Instructors
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Learn to Drive with
            <span className="text-primary"> Expert Instructors</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find qualified driving instructors in your area, book lessons online, and start your journey to becoming a
            confident driver with BookingGuru.
          </p>

          {/* Enhanced Search Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-lg">
              {/* City Dropdown */}
              <div className="flex-1">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Select your city" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search cities or postcodes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    {filteredCities.map((city) => (
                      <SelectItem key={`${city.name}-${city.state}`} value={`${city.name}, ${city.state}`}>
                        <div className="flex justify-between items-center w-full">
                          <span>
                            {city.name}, {city.state}
                          </span>
                          <span className="text-sm text-muted-foreground ml-2">{city.postcode}</span>
                        </div>
                      </SelectItem>
                    ))}
                    {filteredCities.length === 0 && searchQuery && (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No cities found matching "{searchQuery}"
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button onClick={handleSearch} size="lg" className="md:w-auto w-full">
                Find Instructors
              </Button>
            </div>

            {/* Quick City Links */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(`${city}, ${australianCities.find((c) => c.name === city)?.state}`)
                    const cityData = australianCities.find((c) => c.name === city)
                    if (cityData) {
                      router.push(`/instructors?city=${encodeURIComponent(city)}`)
                    }
                  }}
                  className="px-3 py-1 text-sm bg-white/80 hover:bg-white rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Qualified Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-muted-foreground">Happy Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-muted-foreground">Pass Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose BookingGuru?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make learning to drive simple, convenient, and effective with our comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MapPin className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Find Local Instructors</CardTitle>
                <CardDescription>
                  Search and find qualified driving instructors in your area with detailed profiles and reviews.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Flexible Scheduling</CardTitle>
                <CardDescription>
                  Book lessons at times that work for you with our easy-to-use online booking system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  Safe and secure online payments with multiple payment options and instant confirmation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Verified Reviews</CardTitle>
                <CardDescription>
                  Read genuine reviews from other students to help you choose the right instructor.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Expert Instructors</CardTitle>
                <CardDescription>
                  All our instructors are fully qualified, experienced, and background-checked professionals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Car className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Modern Vehicles</CardTitle>
                <CardDescription>
                  Learn in well-maintained, modern vehicles equipped with dual controls for your safety.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started with your driving lessons is simple and straightforward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Choose</h3>
              <p className="text-muted-foreground">
                Browse instructors in your area, read reviews, and choose the one that fits your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Book & Pay</h3>
              <p className="text-muted-foreground">
                Select your preferred time slots, make secure online payment, and confirm your booking.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn & Drive</h3>
              <p className="text-muted-foreground">
                Attend your lessons, learn from expert instructors, and become a confident driver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have successfully learned to drive with BookingGuru.
          </p>
          <Button onClick={handleSearch} size="lg" className="text-lg px-8 py-3">
            Find Your Instructor Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">BookingGuru</span>
              </div>
              <p className="text-muted-foreground">
                The best platform to find qualified driving instructors and book lessons online.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/instructors">Find Instructors</Link>
                </li>
                <li>
                  <Link href="/how-it-works">How It Works</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Instructors</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/instructor-signup">Join as Instructor</Link>
                </li>
                <li>
                  <Link href="/instructor-benefits">Benefits</Link>
                </li>
                <li>
                  <Link href="/instructor-resources">Resources</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 BookingGuru. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
