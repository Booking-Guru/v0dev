"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Star, Clock, Car, Filter, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { handleApiResponse, validators } from "@/lib/utils"

interface Instructor {
  _id: string
  firstName: string
  lastName: string
  rating: number
  totalReviews: number
  experience: number
  location: {
    city: string
    areas: string[]
  }
  hourlyRate: number
  specialties: string[]
  isVerified: boolean
}

interface SearchFilters {
  city: string
  sortBy: string
  specialties: string
  minRating: string
  maxRate: string
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    city: "",
    sortBy: "rating",
    specialties: "",
    minRating: "",
    maxRate: "",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [loadingMore, setLoadingMore] = useState(false)
  const { toast } = useToast()

  const fetchInstructors = async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true)
      else setLoadingMore(true)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sortBy: searchFilters.sortBy,
      })

      if (searchFilters.city.trim()) {
        if (!validators.required(searchFilters.city)) {
          throw new Error("Please enter a valid city name")
        }
        params.append("city", searchFilters.city.trim())
      }

      if (searchFilters.specialties) {
        params.append("specialties", searchFilters.specialties)
      }

      if (searchFilters.minRating) {
        const rating = Number.parseFloat(searchFilters.minRating)
        if (rating < 1 || rating > 5) {
          throw new Error("Rating must be between 1 and 5")
        }
        params.append("minRating", searchFilters.minRating)
      }

      if (searchFilters.maxRate) {
        const rate = Number.parseFloat(searchFilters.maxRate)
        if (rate < 20 || rate > 100) {
          throw new Error("Hourly rate must be between £20 and £100")
        }
        params.append("maxRate", searchFilters.maxRate)
      }

      const response = await fetch(`/api/instructors?${params}`)
      const data = await handleApiResponse(response)

      if (append) {
        setInstructors((prev) => [...prev, ...data.instructors])
      } else {
        setInstructors(data.instructors)
      }

      setPagination(data.pagination)
      setError("")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch instructors"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchInstructors()
  }, [searchFilters.sortBy])

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchInstructors(1, false)
  }

  const handleLoadMore = () => {
    const nextPage = pagination.page + 1
    fetchInstructors(nextPage, true)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setSearchFilters((prev) => ({ ...prev, [key]: value }))
  }

  const InstructorSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">DriveLearn</span>
          </Link>
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

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Find Driving Instructors</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter your location (e.g., Manchester, London)"
                className="pl-10"
                value={searchFilters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <Select value={searchFilters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchFilters.specialties}
              onValueChange={(value) => handleFilterChange("specialties", value)}
            >
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Intensive Courses">Intensive Courses</SelectItem>
                <SelectItem value="Pass Plus">Pass Plus</SelectItem>
                <SelectItem value="Nervous Drivers">Nervous Drivers</SelectItem>
                <SelectItem value="Female Instructor">Female Instructor</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Min Rating:</label>
              <Select value={searchFilters.minRating} onValueChange={(value) => handleFilterChange("minRating", value)}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.8">4.8+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Max Rate:</label>
              <Select value={searchFilters.maxRate} onValueChange={(value) => handleFilterChange("maxRate", value)}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="30">£30</SelectItem>
                  <SelectItem value="35">£35</SelectItem>
                  <SelectItem value="40">£40</SelectItem>
                  <SelectItem value="45">£45</SelectItem>
                  <SelectItem value="50">£50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!loading && instructors.length > 0 && (
            <div className="text-muted-foreground mt-4">
              Found {pagination.total} instructor{pagination.total !== 1 ? "s" : ""}
              {searchFilters.city && ` in ${searchFilters.city}`}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => fetchInstructors()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <InstructorSkeleton key={index} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && instructors.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No instructors found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or location</p>
            <Button
              onClick={() => {
                setSearchFilters({
                  city: "",
                  sortBy: "rating",
                  specialties: "",
                  minRating: "",
                  maxRate: "",
                })
                fetchInstructors()
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Instructors Grid */}
        {!loading && !error && instructors.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {instructors.map((instructor) => (
                <Card key={instructor._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt={`${instructor.firstName} ${instructor.lastName}`}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-xl">
                            {instructor.firstName} {instructor.lastName}
                            {instructor.isVerified && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Verified
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">£{instructor.hourlyRate}</div>
                            <div className="text-sm text-muted-foreground">per hour</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 font-medium">{instructor.rating}</span>
                          </div>
                          <span className="text-muted-foreground">({instructor.totalReviews} reviews)</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {instructor.location.city}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {instructor.experience} years
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {instructor.specialties.slice(0, 3).map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {instructor.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{instructor.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/instructors/${instructor._id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          View Profile
                        </Button>
                      </Link>
                      <Link href={`/booking/${instructor._id}`} className="flex-1">
                        <Button className="w-full">Book Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {pagination.page < pagination.pages && (
              <div className="text-center mt-12">
                <Button onClick={handleLoadMore} variant="outline" size="lg" disabled={loadingMore}>
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading More...
                    </>
                  ) : (
                    `Load More Instructors (${pagination.total - instructors.length} remaining)`
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
