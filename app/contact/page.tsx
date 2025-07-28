"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput, FormTextarea, FormSelect } from "@/components/ui/form-field"
import { useForm } from "@/hooks/useForm"
import { validators, errorMessages } from "@/lib/utils"
import { Car, MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { SelectItem } from "@/components/ui/select"

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
  inquiryType: string
}

export default function ContactPage() {
  const { toast } = useToast()

  const { values, errors, isSubmitting, submitError, setValue, handleSubmit, setSubmitError } =
    useForm<ContactFormData>({
      initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "",
      },
      validationRules: {
        firstName: {
          required: true,
          validator: validators.required,
          message: errorMessages.required,
        },
        lastName: {
          required: true,
          validator: validators.required,
          message: errorMessages.required,
        },
        email: {
          required: true,
          validator: validators.email,
          message: errorMessages.email,
        },
        phone: {
          required: true,
          validator: validators.phone,
          message: errorMessages.phone,
        },
        subject: {
          required: true,
          validator: validators.required,
          message: errorMessages.required,
        },
        message: {
          required: true,
          validator: validators.required,
          message: errorMessages.required,
        },
        inquiryType: {
          required: true,
          validator: validators.required,
          message: errorMessages.required,
        },
      },
      onSubmit: async (formData) => {
        try {
          // In a real app, this would send to an API endpoint
          await new Promise((resolve) => setTimeout(resolve, 1000))

          toast({
            title: "Message sent successfully!",
            description: "We'll get back to you within 24 hours.",
          })

          // Reset form
          Object.keys(values).forEach((key) => {
            setValue(key as keyof ContactFormData, "")
          })
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : "Failed to send message")
        }
      },
    })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">BookingGuru</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/instructors" className="text-muted-foreground hover:text-foreground">
              Find Instructors
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="text-foreground font-medium">
              Contact
            </Link>
            <Link href="/help" className="text-muted-foreground hover:text-foreground">
              Help
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

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our driving lessons or need help with your booking? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-primary" />
                    Phone Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold mb-2">1800 BOOKING</p>
                  <p className="text-lg font-semibold mb-2">(1800 266 546)</p>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 8:00 AM - 8:00 PM
                    <br />
                    Saturday: 9:00 AM - 5:00 PM
                    <br />
                    Sunday: 10:00 AM - 4:00 PM
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold mb-2">support@bookingguru.com.au</p>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 2-4 hours during business hours
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Office Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mb-2">BookingGuru Australia</p>
                  <p className="text-sm text-muted-foreground">
                    Level 15, 123 Collins Street
                    <br />
                    Melbourne VIC 3000
                    <br />
                    Australia
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Emergency Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">For urgent issues during lessons or emergencies:</p>
                  <p className="text-lg font-semibold text-red-600">1800 URGENT</p>
                  <p className="text-lg font-semibold text-red-600">(1800 874 368)</p>
                  <p className="text-xs text-muted-foreground mt-2">Available 24/7</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="First Name"
                      placeholder="John"
                      value={values.firstName}
                      onChange={(e) => setValue("firstName", e.target.value)}
                      error={errors.firstName}
                      required
                      disabled={isSubmitting}
                    />
                    <FormInput
                      label="Last Name"
                      placeholder="Doe"
                      value={values.lastName}
                      onChange={(e) => setValue("lastName", e.target.value)}
                      error={errors.lastName}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Email"
                      type="email"
                      placeholder="john@example.com"
                      value={values.email}
                      onChange={(e) => setValue("email", e.target.value)}
                      error={errors.email}
                      required
                      disabled={isSubmitting}
                    />
                    <FormInput
                      label="Phone Number"
                      type="tel"
                      placeholder="+61 412 345 678"
                      value={values.phone}
                      onChange={(e) => setValue("phone", e.target.value)}
                      error={errors.phone}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <FormSelect
                    label="Inquiry Type"
                    placeholder="Select inquiry type"
                    value={values.inquiryType}
                    onValueChange={(value) => setValue("inquiryType", value)}
                    error={errors.inquiryType}
                    required
                  >
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="booking">Booking Support</SelectItem>
                    <SelectItem value="instructor">Become an Instructor</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                  </FormSelect>

                  <FormInput
                    label="Subject"
                    placeholder="Brief description of your inquiry"
                    value={values.subject}
                    onChange={(e) => setValue("subject", e.target.value)}
                    error={errors.subject}
                    required
                    disabled={isSubmitting}
                  />

                  <FormTextarea
                    label="Message"
                    placeholder="Please provide details about your inquiry..."
                    value={values.message}
                    onChange={(e) => setValue("message", e.target.value)}
                    error={errors.message}
                    required
                    disabled={isSubmitting}
                    rows={6}
                  />

                  {submitError && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {submitError}
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">How do I book a driving lesson?</h3>
                    <p className="text-sm text-muted-foreground">
                      You can book a lesson by browsing our instructors, selecting your preferred instructor, choosing a
                      date and time, and completing the booking process online.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Can I cancel or reschedule my lesson?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can cancel or reschedule your lesson up to 24 hours before the scheduled time without any
                      penalty. Cancellations within 24 hours may incur a fee.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                    <p className="text-sm text-muted-foreground">
                      We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers.
                      Payment is required at the time of booking.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">How do I become an instructor?</h3>
                    <p className="text-sm text-muted-foreground">
                      To become an instructor, you need to have a valid driving instructor license and meet our
                      requirements. You can apply through our instructor registration page, and we'll review your
                      application.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">What if I have an issue during my lesson?</h3>
                    <p className="text-sm text-muted-foreground">
                      If you have any issues during your lesson, you can contact our emergency support line at 1800
                      URGENT (1800 874 368), which is available 24/7.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Still have questions?</strong> Check out our comprehensive{" "}
                    <Link href="/help" className="text-blue-600 hover:underline">
                      Help Center
                    </Link>{" "}
                    for more detailed information and guides.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">BookingGuru</span>
              </div>
              <p className="text-muted-foreground">
                The best platform to find qualified driving instructors and book lessons online across Australia.
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
                  <Link href="/register/instructor">Join as Instructor</Link>
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
