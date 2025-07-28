"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Car,
  User,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  Phone,
  Calendar,
  Settings,
  Camera,
  Save,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/components/auth/AuthProvider"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "+61 412 111 222",
    dateOfBirth: "1995-06-15",
    address: {
      street: "123 George Street",
      city: "Sydney",
      state: "NSW",
      postcode: "2000",
      country: "Australia",
    },
    emergencyContact: {
      name: "Jane Smith",
      phone: "+61 423 333 444",
      relationship: "Sister",
    },
    preferences: {
      instructorGender: "no-preference",
      carType: "manual",
      lessonDuration: "1",
      pickupLocation: "home",
      notifications: {
        email: true,
        sms: true,
        reminders: true,
        promotions: false,
      },
    },
    learnerPermit: {
      number: "L123456789",
      expiryDate: "2025-06-15",
      state: "NSW",
    },
  })

  const { toast } = useToast()

  const handleSave = async (section: string) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: `Your ${section} information has been saved successfully.`,
      })
      setLoading(false)
    }, 1000)
  }

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker
    toast({
      title: "Avatar upload",
      description: "Avatar upload functionality would be implemented here.",
    })
  }

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
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} />
                        <AvatarFallback>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                        onClick={handleAvatarChange}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <CardTitle>
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                      <Badge variant="secondary" className="mt-1">
                        Student
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="default" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/bookings">
                        <Calendar className="mr-2 h-4 w-4" />
                        My Bookings
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/reviews">
                        <Calendar className="mr-2 h-4 w-4" />
                        My Reviews
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/dashboard/payments">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payment History
                      </Link>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Profile Settings</h1>
                <Button onClick={() => handleSave("profile")} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save All Changes
                    </>
                  )}
                </Button>
              </div>

              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* Personal Information */}
                <TabsContent value="personal">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <User className="mr-2 h-5 w-5" />
                          Personal Information
                        </CardTitle>
                        <CardDescription>Update your personal details and contact information</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profile.firstName}
                              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profile.lastName}
                              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={profile.email} disabled />
                            <p className="text-xs text-muted-foreground">
                              Contact support to change your email address
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={profile.phone}
                              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={profile.dateOfBirth}
                            onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                          />
                        </div>

                        <Button onClick={() => handleSave("personal")}>Save Personal Information</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <MapPin className="mr-2 h-5 w-5" />
                          Address
                        </CardTitle>
                        <CardDescription>Your home address for pickup and billing</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            value={profile.address.street}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                address: { ...profile.address, street: e.target.value },
                              })
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={profile.address.city}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  address: { ...profile.address, city: e.target.value },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Select
                              value={profile.address.state}
                              onValueChange={(value) =>
                                setProfile({
                                  ...profile,
                                  address: { ...profile.address, state: value },
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NSW">NSW</SelectItem>
                                <SelectItem value="VIC">VIC</SelectItem>
                                <SelectItem value="QLD">QLD</SelectItem>
                                <SelectItem value="WA">WA</SelectItem>
                                <SelectItem value="SA">SA</SelectItem>
                                <SelectItem value="TAS">TAS</SelectItem>
                                <SelectItem value="ACT">ACT</SelectItem>
                                <SelectItem value="NT">NT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postcode">Postcode</Label>
                            <Input
                              id="postcode"
                              value={profile.address.postcode}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  address: { ...profile.address, postcode: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>

                        <Button onClick={() => handleSave("address")}>Save Address</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Phone className="mr-2 h-5 w-5" />
                          Emergency Contact
                        </CardTitle>
                        <CardDescription>Someone we can contact in case of emergency</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="emergencyName">Name</Label>
                            <Input
                              id="emergencyName"
                              value={profile.emergencyContact.name}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  emergencyContact: { ...profile.emergencyContact, name: e.target.value },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergencyPhone">Phone</Label>
                            <Input
                              id="emergencyPhone"
                              value={profile.emergencyContact.phone}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  emergencyContact: { ...profile.emergencyContact, phone: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="relationship">Relationship</Label>
                          <Input
                            id="relationship"
                            value={profile.emergencyContact.relationship}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                emergencyContact: { ...profile.emergencyContact, relationship: e.target.value },
                              })
                            }
                          />
                        </div>

                        <Button onClick={() => handleSave("emergency")}>Save Emergency Contact</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Learner's Permit</CardTitle>
                        <CardDescription>Your learner's permit information</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="permitNumber">Permit Number</Label>
                            <Input
                              id="permitNumber"
                              value={profile.learnerPermit.number}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  learnerPermit: { ...profile.learnerPermit, number: e.target.value },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="permitExpiry">Expiry Date</Label>
                            <Input
                              id="permitExpiry"
                              type="date"
                              value={profile.learnerPermit.expiryDate}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  learnerPermit: { ...profile.learnerPermit, expiryDate: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>

                        <Button onClick={() => handleSave("permit")}>Save Permit Information</Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Preferences */}
                <TabsContent value="preferences">
                  <Card>
                    <CardHeader>
                      <CardTitle>Lesson Preferences</CardTitle>
                      <CardDescription>Set your preferences for driving lessons</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Instructor Gender Preference</Label>
                        <Select
                          value={profile.preferences.instructorGender}
                          onValueChange={(value) =>
                            setProfile({
                              ...profile,
                              preferences: { ...profile.preferences, instructorGender: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-preference">No Preference</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Car Type Preference</Label>
                        <Select
                          value={profile.preferences.carType}
                          onValueChange={(value) =>
                            setProfile({
                              ...profile,
                              preferences: { ...profile.preferences, carType: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="automatic">Automatic</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Default Lesson Duration</Label>
                        <Select
                          value={profile.preferences.lessonDuration}
                          onValueChange={(value) =>
                            setProfile({
                              ...profile,
                              preferences: { ...profile.preferences, lessonDuration: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Hour</SelectItem>
                            <SelectItem value="1.5">1.5 Hours</SelectItem>
                            <SelectItem value="2">2 Hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Preferred Pickup Location</Label>
                        <Select
                          value={profile.preferences.pickupLocation}
                          onValueChange={(value) =>
                            setProfile({
                              ...profile,
                              preferences: { ...profile.preferences, pickupLocation: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home">Home Address</SelectItem>
                            <SelectItem value="work">Work Address</SelectItem>
                            <SelectItem value="custom">Custom Location</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={() => handleSave("preferences")}>Save Preferences</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bell className="mr-2 h-5 w-5" />
                        Notification Settings
                      </CardTitle>
                      <CardDescription>Choose how you want to receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={profile.preferences.notifications.email}
                          onCheckedChange={(checked) =>
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                notifications: { ...profile.preferences.notifications, email: checked },
                              },
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          checked={profile.preferences.notifications.sms}
                          onCheckedChange={(checked) =>
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                notifications: { ...profile.preferences.notifications, sms: checked },
                              },
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Lesson Reminders</Label>
                          <p className="text-sm text-muted-foreground">Get reminded about upcoming lessons</p>
                        </div>
                        <Switch
                          checked={profile.preferences.notifications.reminders}
                          onCheckedChange={(checked) =>
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                notifications: { ...profile.preferences.notifications, reminders: checked },
                              },
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Promotional Emails</Label>
                          <p className="text-sm text-muted-foreground">Receive offers and promotions</p>
                        </div>
                        <Switch
                          checked={profile.preferences.notifications.promotions}
                          onCheckedChange={(checked) =>
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                notifications: { ...profile.preferences.notifications, promotions: checked },
                              },
                            })
                          }
                        />
                      </div>

                      <Button onClick={() => handleSave("notifications")}>Save Notification Settings</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security */}
                <TabsContent value="security">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Shield className="mr-2 h-5 w-5" />
                          Password & Security
                        </CardTitle>
                        <CardDescription>Manage your account security settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input id="currentPassword" type="password" placeholder="Enter current password" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" placeholder="Enter new password" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                        </div>

                        <Button onClick={() => handleSave("password")}>Change Password</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Account Actions</CardTitle>
                        <CardDescription>Manage your account</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Download Your Data</h4>
                            <p className="text-sm text-muted-foreground">Download a copy of all your account data</p>
                          </div>
                          <Button variant="outline">Download</Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                          <div>
                            <h4 className="font-medium text-red-600">Delete Account</h4>
                            <p className="text-sm text-muted-foreground">
                              Permanently delete your account and all data
                            </p>
                          </div>
                          <Button variant="destructive">Delete Account</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
