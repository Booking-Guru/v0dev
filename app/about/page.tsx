import { Button } from "@/components/ui/button"
import { Car, Award, Users, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">DriveLearn</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/instructors" className="text-muted-foreground hover:text-foreground">
              Find Instructors
            </Link>
            <Link href="/about" className="text-foreground font-medium">
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
            About <span className="text-primary">DriveLearn</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connecting students with qualified driving instructors since 2020. Our mission is to make learning to drive
            accessible, affordable, and stress-free.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg mb-4">
                DriveLearn was founded in 2020 with a simple mission: to transform the way people learn to drive. We
                noticed that finding the right driving instructor was often a frustrating and time-consuming process.
              </p>
              <p className="text-lg mb-4">
                Our platform connects students with qualified, experienced instructors in their local area, making it
                easy to book lessons, track progress, and ultimately become confident, safe drivers.
              </p>
              <p className="text-lg">
                Today, DriveLearn operates across Australia, helping thousands of students get behind the wheel with
                instructors who match their learning style and needs.
              </p>
            </div>
            <div className="relative h-80 md:h-96">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="DriveLearn Story"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Safety First</h3>
              <p className="text-muted-foreground">
                We prioritize safety in everything we do. All our instructors are fully qualified, background-checked,
                and committed to teaching safe driving practices.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Education</h3>
              <p className="text-muted-foreground">
                We believe in providing high-quality driving education that goes beyond just passing a test. Our
                instructors focus on creating confident, skilled drivers for life.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
              <p className="text-muted-foreground">
                We're committed to making driving lessons accessible to everyone, with instructors who can accommodate
                different learning styles, needs, and backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                name: "Michael Chen",
                role: "Founder & CEO",
                image: "michael-chen",
              },
              {
                name: "Sarah Johnson",
                role: "Head of Instructor Relations",
                image: "sarah-johnson",
              },
              {
                name: "David Brown",
                role: "Chief Technology Officer",
                image: "david-brown",
              },
              {
                name: "Emma Wilson",
                role: "Customer Success Manager",
                image: "emma-wilson",
              },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <Image
                    src={`/placeholder.svg?height=200&width=200&query=professional headshot ${member.image}`}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-lg">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg">Qualified Instructors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-lg">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-lg">Pass Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose DriveLearn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Verified Instructors</h3>
                <p className="text-muted-foreground">
                  All instructors on our platform are fully qualified, experienced, and background-checked for your
                  peace of mind.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                <p className="text-muted-foreground">
                  Our simple online booking system makes it easy to schedule lessons at times that work for you.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-muted-foreground">
                  No hidden fees or surprises. See exactly what you're paying for before you book.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Keep track of your learning journey with detailed feedback and progress reports after each lesson.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Driving Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have successfully learned to drive with DriveLearn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/instructors">Find an Instructor</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">DriveLearn</span>
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
            <p>&copy; 2024 DriveLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
