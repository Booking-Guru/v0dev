"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FormInput } from "@/components/ui/form-field"
import { useForm } from "@/hooks/useForm"
import { validators, errorMessages, handleApiResponse } from "@/lib/utils"
import { Car, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const { values, errors, isSubmitting, submitError, setValue, handleSubmit, setSubmitError } =
    useForm<RegisterFormData>({
      initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
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
        password: {
          required: true,
          validator: validators.password,
          message: errorMessages.password,
        },
        confirmPassword: {
          required: true,
          validator: (value: string) => value === values.password,
          message: errorMessages.passwordMatch,
        },
        agreeToTerms: {
          required: true,
          validator: (value: boolean) => value === true,
          message: "You must agree to the terms and conditions",
        },
      },
      onSubmit: async (formData) => {
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              role: "student",
            }),
          })

          const data = await handleApiResponse(response)

          toast({
            title: "Registration successful!",
            description: "Welcome to DriveLearn. You can now start booking lessons.",
          })

          router.push("/login?registered=true")
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : "Registration failed")
        }
      },
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">DriveLearn</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>Sign up to start booking driving lessons with qualified instructors</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                placeholder="+44 7123 456789"
                value={values.phone}
                onChange={(e) => setValue("phone", e.target.value)}
                error={errors.phone}
                required
                disabled={isSubmitting}
              />

              <div className="relative">
                <FormInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={values.password}
                  onChange={(e) => setValue("password", e.target.value)}
                  error={errors.password}
                  required
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-8 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              <div className="relative">
                <FormInput
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={values.confirmPassword}
                  onChange={(e) => setValue("confirmPassword", e.target.value)}
                  error={errors.confirmPassword}
                  required
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-8 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={values.agreeToTerms}
                  onCheckedChange={(checked) => setValue("agreeToTerms", checked as boolean)}
                  disabled={isSubmitting}
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}

              {submitError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{submitError}</div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </span>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-semibold text-blue-800 mb-2">Want to become an instructor?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Join our platform and start teaching students to drive. Earn money on your own schedule.
              </p>
              <Link href="/register/instructor">
                <Button
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
                >
                  Apply as Instructor
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
