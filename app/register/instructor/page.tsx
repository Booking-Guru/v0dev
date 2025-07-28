"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FormInput, FormTextarea, FormSelect } from "@/components/ui/form-field"
import { useForm } from "@/hooks/useForm"
import { validators, errorMessages, handleApiResponse } from "@/lib/utils"
import { Car, Eye, EyeOff, Loader2 } from "lucide-react"
import { SelectItem } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface InstructorFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  licenseNumber: string
  adiBadgeNumber: string
  experience: string
  hourlyRate: string
  city: string
  areas: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  transmission: string
  specialties: string[]
  bio: string
  agreeToTerms: boolean
}

const australianCities = [
  "Sydney",
  "Melbourne",
  "Brisbane",
  "Perth",
  "Adelaide",
  "Gold Coast",
  "Newcastle",
  "Canberra",
  "Sunshine Coast",
  "Wollongong",
  "Hobart",
  "Geelong",
  "Townsville",
  "Cairns",
  "Darwin",
  "Toowoomba",
]

const specialtyOptions = [
  "Manual",
  "Automatic",
  "Intensive Courses",
  "Pass Plus",
  "Nervous Drivers",
  "Female Instructor",
  "Refresher Lessons",
  "Test Preparation",
  "Motorway Lessons",
]

export default function InstructorRegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const { values, errors, isSubmitting, submitError, setValue, handleSubmit, setSubmitError } =
    useForm<InstructorFormData>({
      initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        licenseNumber: "",
        adiBadgeNumber: "",
        experience: "",
        hourlyRate: "",
        city: "",
        areas: "",
        vehicleMake: "",
        vehicleModel: "",
        vehicleYear: "",
        transmission: "",
        specialties: [],
        bio: "",
        agreeToTerms: false,
      },
      validationRules: {
        firstName: { required: true, validator: validators.required, message: errorMessages.required },
        lastName: { required: true, validator: validators.required, message: errorMessages.required },
        email: { required: true, validator: validators.email, message: errorMessages.email },
        phone: { required: true, validator: validators.phone, message: errorMessages.phone },
        password: { required: true, validator: validators.password, message: errorMessages.password },
        confirmPassword: {
          required: true,
          validator: (value: string) => value === values.password,
          message: errorMessages.passwordMatch,
        },
        licenseNumber: { required: true, validator: validators.required, message: "License number is required" },
        adiBadgeNumber: { required: true, validator: validators.required, message: "ADI badge number is required" },
        experience: {
          required: true,
          validator: (value: string) => Number.parseInt(value) >= 1 && Number.parseInt(value) <= 50,
          message: "Experience must be between 1-50 years",
        },
        hourlyRate: {
          required: true,
          validator: (value: string) => validators.hourlyRate(Number.parseFloat(value)),
          message: errorMessages.hourlyRate,
        },
        city: { required: true, validator: validators.required, message: "City is required" },
        areas: { required: true, validator: validators.required, message: "Service areas are required" },
        vehicleMake: { required: true, validator: validators.required, message: "Vehicle make is required" },
        vehicleModel: { required: true, validator: validators.required, message: "Vehicle model is required" },
        vehicleYear: {
          required: true,
          validator: (value: string) =>
            Number.parseInt(value) >= 2010 && Number.parseInt(value) <= new Date().getFullYear(),
          message: "Vehicle year must be 2010 or newer",
        },
        transmission: { required: true, validator: validators.required, message: "Transmission type is required" },
        agreeToTerms: {
          required: true,
          validator: (value: boolean) => value === true,
          message: "You must agree to the terms and conditions",
        },
      },
      onSubmit: async (formData) => {
        try {
          const instructorData = {
            ...formData,
            role: "instructor",
            experience: Number.parseInt(formData.experience),
            hourlyRate: Number.parseFloat(formData.hourlyRate),
            location: {
              city: formData.city,
              areas: formData.areas.split(",").map((area) => area.trim()),
              coordinates: { lat: -33.8688, lng: 151.2093 }, // Default Sydney coordinates
            },
            vehicle: {
              make: formData.vehicleMake,
              model: formData.vehicleModel,
              year: Number.parseInt(formData.vehicleYear),
              transmission: formData.transmission,
              dualControls: true,
            },
            specialties: values.specialties,
            documents: {
              drivingLicense: "",
              adiBadge: "",
              insurance: "",
              dbs: "",
            },
          }

          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(instructorData),
          })

          const data = await handleApiResponse(response)

          toast({
            title: "Registration successful!",
            description: "Your instructor application has been submitted for review.",
          })

          router.push("/login?registered=instructor")
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : "Registration failed")
        }
      },
    })

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    const currentSpecialties = values.specialties || []
    if (checked) {
      setValue("specialties", [...currentSpecialties, specialty])
    } else {
      setValue(
        "specialties",
        currentSpecialties.filter((s) => s !== specialty),
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">DriveLearn</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Become a Driving Instructor</CardTitle>
            <CardDescription>Join our platform and start teaching students to drive</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
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

                <div className="grid grid-cols-2 gap-4 mt-4">
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
                    placeholder="+61 4XX XXX XXX"
                    value={values.phone}
                    onChange={(e) => setValue("phone", e.target.value)}
                    error={errors.phone}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
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
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="License Number"
                    placeholder="ABC123456"
                    value={values.licenseNumber}
                    onChange={(e) => setValue("licenseNumber", e.target.value)}
                    error={errors.licenseNumber}
                    required
                    disabled={isSubmitting}
                  />
                  <FormInput
                    label="ADI Badge Number"
                    placeholder="12345"
                    value={values.adiBadgeNumber}
                    onChange={(e) => setValue("adiBadgeNumber", e.target.value)}
                    error={errors.adiBadgeNumber}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormInput
                    label="Years of Experience"
                    type="number"
                    placeholder="5"
                    value={values.experience}
                    onChange={(e) => setValue("experience", e.target.value)}
                    error={errors.experience}
                    required
                    disabled={isSubmitting}
                  />
                  <FormInput
                    label="Hourly Rate (AUD)"
                    type="number"
                    placeholder="45"
                    value={values.hourlyRate}
                    onChange={(e) => setValue("hourlyRate", e.target.value)}
                    error={errors.hourlyRate}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Location & Service Areas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormSelect
                    label="Primary City"
                    placeholder="Select your city"
                    value={values.city}
                    onValueChange={(value) => setValue("city", value)}
                    error={errors.city}
                    required
                  >
                    {australianCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </FormSelect>
                  <FormInput
                    label="Service Areas"
                    placeholder="CBD, North Shore, Eastern Suburbs"
                    value={values.areas}
                    onChange={(e) => setValue("areas", e.target.value)}
                    error={errors.areas}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormInput
                    label="Make"
                    placeholder="Toyota"
                    value={values.vehicleMake}
                    onChange={(e) => setValue("vehicleMake", e.target.value)}
                    error={errors.vehicleMake}
                    required
                    disabled={isSubmitting}
                  />
                  <FormInput
                    label="Model"
                    placeholder="Corolla"
                    value={values.vehicleModel}
                    onChange={(e) => setValue("vehicleModel", e.target.value)}
                    error={errors.vehicleModel}
                    required
                    disabled={isSubmitting}
                  />
                  <FormInput
                    label="Year"
                    type="number"
                    placeholder="2020"
                    value={values.vehicleYear}
                    onChange={(e) => setValue("vehicleYear", e.target.value)}
                    error={errors.vehicleYear}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mt-4">
                  <FormSelect
                    label="Transmission"
                    placeholder="Select transmission type"
                    value={values.transmission}
                    onValueChange={(value) => setValue("transmission", value)}
                    error={errors.transmission}
                    required
                  >
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                  </FormSelect>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Specialties</h3>
                <div className="grid grid-cols-3 gap-4">
                  {specialtyOptions.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialty}
                        checked={values.specialties?.includes(specialty) || false}
                        onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                        disabled={isSubmitting}
                      />
                      <label htmlFor={specialty} className="text-sm">
                        {specialty}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <FormTextarea
                label="Bio (Optional)"
                placeholder="Tell students about your teaching style and experience..."
                value={values.bio}
                onChange={(e) => setValue("bio", e.target.value)}
                disabled={isSubmitting}
              />

              {/* Terms Agreement */}
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
                    Submitting Application...
                  </>
                ) : (
                  "Submit Application"
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
