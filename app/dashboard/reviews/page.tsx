"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Car, Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/components/auth/AuthProvider"

// Mock data
const mockReviews = [
  {
    id: "review1",
    bookingId: "booking1",
    instructorId: "instructor1",
    instructorName: "Sarah Johnson",
    rating: 5,
    comment:
      "Sarah was an excellent instructor. Very patient and explained everything clearly. I felt confident after each lesson and she helped me pass my test on the first try!",
    date: new Date("2024-02-16"),
    canEdit: true,
  },
  {
    id: "review2",
    bookingId: "booking2",
    instructorId: "instructor2",
    instructorName: "Michael Chen",
    rating: 4,
    comment: "Good instructor, helped me improve my city driving skills. Would recommend for highway driving practice.",
    date: new Date("2024-02-10"),
    canEdit: true,
  },
  {
    id: "review3",
    bookingId: "booking3",
    instructorId: "instructor1",
    instructorName: "Sarah Johnson",
    rating: 5,
    comment: "Second time booking with Sarah. Consistent quality teaching and very professional.",
    date: new Date("2024-01-20"),
    canEdit: false,
  },
]

const mockPendingReviews = [
  {
    bookingId: "booking4",
    instructorId: "instructor3",
    instructorName: "Emma Wilson",
    lessonDate: new Date("2024-02-05"),
    location: "Inner West",
  },
]

export default function ReviewsPage() {
  const { user, logout } = useAuth()
  const [reviews, setReviews] = useState(mockReviews)
  const [pendingReviews, setPendingReviews] = useState(mockPendingReviews)
  const [editingReview, setEditingReview] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" })
  const { toast } = useToast()

  const handleEditReview = (reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId)
    if (review) {
      setEditingReview(reviewId)
      setEditForm({ rating: review.rating, comment: review.comment })
    }
  }

  const handleSaveEdit = () => {
    setReviews(
      reviews.map((review) =>
        review.id === editingReview ? { ...review, rating: editForm.rating, comment: editForm.comment } : review,
      ),
    )
    setEditingReview(null)
    toast({
      title: "Review updated",
      description: "Your review has been updated successfully.",
    })
  }

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter((review) => review.id !== reviewId))
    toast({
      title: "Review deleted",
      description: "Your review has been deleted.",
    })
  }

  const handleQuickReview = (bookingId: string, rating: number) => {
    const newReview = {
      id: `review-${Date.now()}`,
      bookingId,
      instructorId: pendingReviews.find((p) => p.bookingId === bookingId)?.instructorId || "",
      instructorName: pendingReviews.find((p) => p.bookingId === bookingId)?.instructorName || "",
      rating,
      comment: "",
      date: new Date(),
      canEdit: true,
    }

    setReviews([newReview, ...reviews])
    setPendingReviews(pendingReviews.filter((p) => p.bookingId !== bookingId))

    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    })
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    )
  }

  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : "0.0"

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">BookingGuru</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} />
                      <AvatarFallback>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/profile">My Profile</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/bookings">My Bookings</Link>
                    </Button>
                    <Button variant="default" className="w-full justify-start">
                      My Reviews
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/payments">Payment History</Link>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">My Reviews</h1>
                <Button asChild>
                  <Link href="/dashboard/reviews/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Write Review
                  </Link>
                </Button>
              </div>

              {/* Review Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{reviews.length}</div>
                      <p className="text-sm text-muted-foreground">Total Reviews</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{averageRating}</div>
                      <div className="flex justify-center mb-2">{renderStars(Number.parseFloat(averageRating))}</div>
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">{pendingReviews.length}</div>
                      <p className="text-sm text-muted-foreground">Pending Reviews</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Reviews */}
              {pendingReviews.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Pending Reviews</CardTitle>
                    <CardDescription>Leave reviews for your recent lessons</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingReviews.map((pending) => (
                        <div key={pending.bookingId} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{pending.instructorName}</h4>
                              <p className="text-sm text-muted-foreground">
                                Lesson on {formatDate(pending.lessonDate)} at {pending.location}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Quick rate:</span>
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <Star
                                  key={rating}
                                  className="h-5 w-5 cursor-pointer hover:text-yellow-400 text-gray-300"
                                  onClick={() => handleQuickReview(pending.bookingId, rating)}
                                />
                              ))}
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/dashboard/reviews/new?booking=${pending.bookingId}`}>Write Review</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't left any reviews for your instructors yet.
                      </p>
                      <Button asChild>
                        <Link href="/dashboard/bookings">View Your Bookings</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        {editingReview === review.id ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  <Link
                                    href={`/instructors/${review.instructorId}`}
                                    className="text-primary hover:underline"
                                  >
                                    {review.instructorName}
                                  </Link>
                                </h3>
                                <p className="text-sm text-muted-foreground">{formatDate(review.date)}</p>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">Rating</label>
                              {renderStars(editForm.rating, true, (rating) => setEditForm({ ...editForm, rating }))}
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">Review</label>
                              <Textarea
                                value={editForm.comment}
                                onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                placeholder="Share your experience with this instructor..."
                                rows={4}
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button onClick={handleSaveEdit}>Save Changes</Button>
                              <Button variant="outline" onClick={() => setEditingReview(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  <Link
                                    href={`/instructors/${review.instructorId}`}
                                    className="text-primary hover:underline"
                                  >
                                    {review.instructorName}
                                  </Link>
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  {renderStars(review.rating)}
                                  <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
                                </div>
                              </div>

                              {review.canEdit && (
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditReview(review.id)}>
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleDeleteReview(review.id)}>
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              )}
                            </div>

                            {review.comment && <p className="text-muted-foreground">{review.comment}</p>}

                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Verified Purchase</Badge>
                              {review.canEdit && <Badge variant="secondary">Can Edit</Badge>}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
