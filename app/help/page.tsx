"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Search,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  CreditCard,
  Users,
  User,
  Calendar,
  Star,
  Shield,
  HelpCircle,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const faqData = [
  {
    category: "Booking",
    icon: Calendar,
    questions: [
      {
        question: "How do I book a driving lesson?",
        answer:
          "You can book a lesson by browsing our instructors, selecting your preferred instructor, choosing an available time slot, and completing the booking process. You'll receive a confirmation email once your booking is confirmed.",
      },
      {
        question: "Can I cancel or reschedule my lesson?",
        answer:
          "Yes, you can cancel or reschedule your lesson up to 24 hours before the scheduled time without any penalty. For cancellations within 24 hours, a cancellation fee may apply.",
      },
      {
        question: "How far in advance can I book a lesson?",
        answer:
          "You can book lessons up to 4 weeks in advance. We recommend booking early to secure your preferred time slots, especially during peak hours.",
      },
      {
        question: "What happens if my instructor cancels?",
        answer:
          "If your instructor needs to cancel, we'll notify you immediately and help you reschedule with the same instructor or find an alternative instructor at no extra cost.",
      },
    ],
  },
  {
    category: "Payment",
    icon: CreditCard,
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and PayPal. Payment is processed securely through our encrypted payment system.",
      },
      {
        question: "When am I charged for my lesson?",
        answer:
          "Payment is processed when you book your lesson. For recurring bookings, you'll be charged 24 hours before each lesson.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Refunds are available for cancellations made more than 24 hours in advance. Refunds are processed within 3-5 business days to your original payment method.",
      },
      {
        question: "Do you offer package deals?",
        answer:
          "Yes, many of our instructors offer package deals for multiple lessons. You can see available packages on each instructor's profile page.",
      },
    ],
  },
  {
    category: "Instructors",
    icon: Users,
    questions: [
      {
        question: "How are instructors verified?",
        answer:
          "All our instructors are fully licensed, insured, and undergo background checks. They must provide valid driving instructor credentials and maintain high safety standards.",
      },
      {
        question: "Can I choose my instructor?",
        answer:
          "You can browse instructor profiles, read reviews, and choose the instructor that best fits your needs and preferences.",
      },
      {
        question: "What if I don't get along with my instructor?",
        answer:
          "If you're not satisfied with your instructor, you can easily switch to another instructor. We want to ensure you have the best learning experience possible.",
      },
      {
        question: "Do instructors provide cars?",
        answer:
          "Yes, all our instructors provide fully insured, dual-control vehicles for your lessons. The cars are regularly maintained and meet all safety requirements.",
      },
    ],
  },
  {
    category: "Account",
    icon: User,
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "Click 'Sign Up' on our homepage, choose whether you're a student or instructor, fill in your details, and verify your email address. It only takes a few minutes!",
      },
      {
        question: "I forgot my password. What should I do?",
        answer:
          "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password.",
      },
      {
        question: "How do I update my profile information?",
        answer:
          "Log into your account and go to 'My Profile' where you can update your personal information, preferences, and contact details.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "You can delete your account by going to Account Settings and selecting 'Delete Account'. Please note that this action cannot be undone.",
      },
    ],
  },
]

const guides = [
  {
    title: "Getting Started as a Student",
    description: "Complete guide to booking your first driving lesson",
    steps: [
      "Create your student account",
      "Complete your profile with preferences",
      "Browse and select an instructor",
      "Choose your lesson time and location",
      "Complete payment and confirmation",
    ],
    icon: User,
  },
  {
    title: "Becoming an Instructor",
    description: "How to join BookingGuru as a driving instructor",
    steps: [
      "Apply with your credentials",
      "Complete verification process",
      "Set up your profile and rates",
      "Define your availability",
      "Start receiving bookings",
    ],
    icon: Users,
  },
  {
    title: "Managing Your Bookings",
    description: "How to view, modify, and track your lessons",
    steps: [
      "Access your dashboard",
      "View upcoming and past lessons",
      "Reschedule or cancel if needed",
      "Leave reviews after lessons",
      "Track your progress",
    ],
    icon: Calendar,
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    })

    setContactForm({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  return (
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
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to common questions or get in touch with our support team
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="faq" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Quick answers to questions you may have</p>
            </div>

            {searchQuery && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  {filteredFAQ.reduce((total, category) => total + category.questions.length, 0)} results for "
                  {searchQuery}"
                </p>
              </div>
            )}

            <div className="grid gap-6">
              {(searchQuery ? filteredFAQ : faqData).map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <category.icon className="h-5 w-5 text-primary" />
                      {category.category}
                      <Badge variant="secondary">{category.questions.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, index) => (
                        <AccordionItem key={index} value={`${category.category}-${index}`}>
                          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>

            {searchQuery && filteredFAQ.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">Try different keywords or contact our support team</p>
                <Button onClick={() => setSearchQuery("")}>Clear search</Button>
              </div>
            )}
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
              <p className="text-muted-foreground">Can't find what you're looking for? We're here to help!</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Methods */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Contact Methods</h3>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Phone Support</h4>
                        <p className="text-muted-foreground text-sm mb-2">Speak directly with our support team</p>
                        <p className="font-medium">1800 BOOKING (1800 266 546)</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Mon-Fri 8AM-8PM, Sat-Sun 9AM-5PM
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Email Support</h4>
                        <p className="text-muted-foreground text-sm mb-2">Send us a detailed message</p>
                        <p className="font-medium">support@bookingguru.com</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Response within 24 hours
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Live Chat</h4>
                        <p className="text-muted-foreground text-sm mb-2">Get instant help from our team</p>
                        <Button size="sm" className="mt-2">
                          Start Chat
                        </Button>
                        <div className="flex items-center text-sm text-muted-foreground mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          Available 9AM-6PM weekdays
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Step-by-Step Guides</h2>
              <p className="text-muted-foreground">Detailed instructions to help you get the most out of BookingGuru</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {guides.map((guide, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <guide.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {guide.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </div>
                          <p className="text-sm text-muted-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      <ChevronRight className="h-4 w-4 ml-auto" />
                      View Full Guide
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Resources */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6">Additional Resources</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Safety Guidelines
                    </CardTitle>
                    <CardDescription>Important safety information for students and instructors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" asChild>
                      <Link href="/safety">Read Safety Guidelines</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Community Guidelines
                    </CardTitle>
                    <CardDescription>How to maintain a respectful and professional environment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" asChild>
                      <Link href="/community">View Guidelines</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
