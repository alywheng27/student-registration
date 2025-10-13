"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth"
import { toast, Toaster } from "sonner"
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, Save, Lock, Eye, EyeOff, Camera, Upload, LogOut } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { getProfile, getAddress, getSchoolAttended, getParents, getEmergencyContact, getDocuments } from "@/lib/student_info"

export default function ProfilePage() {
  const { user, userRole, updateUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profile, setProfile] = useState()
  const [address, setAddress] = useState()
  const [schoolAttended, setSchoolAttended] = useState()
  const [parents, setParents] = useState()
  const [emergencyContact, setEmergencyContact] = useState()
  const [documents, setDocuments] = useState()
  const [formData, setFormData] = useState({
    // Basic
    first_name: "",
    middle_name: "",
    surname: "",
    extension_name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    place_of_birth: "",
    religion: "",
    citizenship: "",
    sex: "",
    civil_status: "",
    region: "",
    barangay: "",
    municipality: "",
    province: "",
    // Schools
    elementary_school: "",
    elementary_school_address: "",
    elementary_year_graduated: "",
    junior_high_school: "",
    junior_high_school_address: "",
    junior_high_year_graduated: "",
    senior_high_school: "",
    senior_high_school_address: "",
    senior_high_year_graduated: "",
    // Parents / Emergency
    father_name: "",
    father_occupation: "",
    father_education: "",
    mother_name: "",
    mother_occupation: "",
    mother_education: "",
    monthly_income: "",
    emergency_name: "",
    emergency_relationship: "",
    emergency_address: "",
    emergency_phone: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const profileData = async () => {
    const data = await getProfile(user.id)
    setProfile(data)
  }

  const addressData = async () => {
    const data = await getAddress(user.id)
    setAddress(data)
  }

  const schoolAttendedData = async () => {
    const data = await getSchoolAttended(user.id)
    setSchoolAttended(data)
  }

  const parentsData = async () => {
    const data = await getParents(user.id)
    setParents(data)
  }

  const emergencyContactData = async () => {
    const data = await getEmergencyContact(user.id)
    setEmergencyContact(data)
  }

  const documentData = async () => {
    const data = await getDocuments(user.id)
    setDocuments(data)
  }

  useEffect(() => {
    if (!user || !user.id) return; // Wait until user and user.id are available

    profileData()
    addressData()
    schoolAttendedData()
    parentsData()
    emergencyContactData()
    documentData()
  }, [user])

  useEffect(() => {
    if (!profile || !address) return
    
    setFormData((prev) => ({
      ...prev,
      first_name: profile?.first_name || "",
      middle_name: profile?.middle_name || "",
      surname: profile?.surname || "",
      extension_name: profile?.extension_name || "",
      email: user?.email || profile?.email || "",
      phone: profile?.phone || "",
      dateOfBirth: profile?.date_of_birth || "",
      place_of_birth: profile?.place_of_birth || "",
      religion: profile?.religion || "",
      citizenship: profile?.citizenship || "",
      sex: profile?.Sex?.id || "",
      civil_status: profile?.Civil_Status?.id || "",
      region: profile?.Regions?.id || "",
      barangay: address?.barangay || "",
      municipality: address?.municipality || "",
      province: address?.province || "",
      elementary_school: schoolAttended?.elementary || "",
      elementary_school_address: schoolAttended?.elementary_address || "",
      elementary_year_graduated: schoolAttended?.elementary_year_graduated || "",
      junior_high_school: schoolAttended?.junior_high || "",
      junior_high_school_address: schoolAttended?.junior_high_address || "",
      junior_high_year_graduated: schoolAttended?.junior_high_year_graduated || "",
      senior_high_school: schoolAttended?.senior_high || "",
      senior_high_school_address: schoolAttended?.senior_high_address || "",
      senior_high_year_graduated: schoolAttended?.senior_high_year_graduated || "",
      father_name: parents?.father_name || "",
      father_occupation: parents?.father_occupation || "",
      father_education: parents?.father_educational_attainment || "",
      mother_name: parents?.mother_name || "",
      mother_occupation: parents?.mother_occupation || "",
      mother_education: parents?.mother_educational_attainment || "",
      monthly_income: parents?.monthly_income || "",
      emergency_name: emergencyContact?.name || "",
      emergency_relationship: emergencyContact?.relationship || "",
      emergency_address: emergencyContact?.home_address || "",
      emergency_phone: emergencyContact?.phone || "",
    }))
    setProfilePhoto(profile?.photo_url || null)
    setPhotoPreview(profile?.photo_url || null)
  }, [profile, address, schoolAttended, parents, emergencyContact]);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast("Please select an image file (JPG, PNG, GIF, etc.)", { type: "error" })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast("Please select an image smaller than 5MB", { type: "error" })
        return
      }

      setPhotoFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await updateUser({
        ...formData,
        photoFile: photoFile || '',
      })

      if (result.success) {
        toast.success("Your profile has been successfully updated.")
        setPhotoFile(null)
      } else {
        toast(result.error || "Failed to update profile. Please try again.", { type: "error" })
      }
    } catch (error) {
      toast("An unexpected error occurred. Please try again.", { type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordLoading(true)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast("New password and confirmation do not match.", { type: "error" })
      setPasswordLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast("Password must be at least 6 characters long.", { type: "error" })
      setPasswordLoading(false)
      return
    }

    try {
      const result = await updatePassword(passwordData.currentPassword, passwordData.newPassword)

      if (result.success) {
        toast("Your password has been successfully changed.", { type: "success" })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast(result.error || "Failed to update password. Please try again.", { type: "error" })
      }
    } catch (error) {
      toast("An unexpected error occurred. Please try again.", { type: "error" })
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex space-x-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Student Registration System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user && user.email} ({userRole})
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Logout</DialogTitle>
                  <DialogDescription>Are you sure you want to log out? You will need to sign in again to access your account.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleLogout}>Logout</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      <main className="container mx-auto sm:px-4 lg:px-[10%] py-8">
        <div className="container mx-auto space-y-6">
          <Toaster
            position="bottom-right"
            toastOptions={{
              unstyled: true,
              classNames: {
                toast: "flex align-items-center border rounded-lg space-x-3 px-5 py-3 text-sm",
                error: "border-red-500 text-red-700 bg-red-50",
                success: "border-green-500 text-green-700",
                info: "border-blue-500 text-blue-700 bg-blue-50",
              },
            }}      
          />
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Update Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and account settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>Update your personal details and contact information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <Label>Profile Photo</Label>
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {photoPreview ? (
                                <img
                                  src={photoPreview || "/placeholder.svg"}
                                  alt="Profile preview"
                                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center border-2 border-border">
                                  <Camera className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="photo-upload" className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                                  <Upload className="h-4 w-4" />
                                  Choose Photo
                                </div>
                              </Label>
                              <Input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                              />
                              <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 5MB.</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                              id="first_name"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleInputChange}
                              placeholder="Enter your First Name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="middle_name">Middle Name</Label>
                            <Input
                              id="middle_name"
                              name="middle_name"
                              value={formData.middle_name}
                              onChange={handleInputChange}
                              placeholder="Enter your Middle Name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="surname">Surname</Label>
                            <Input
                              id="surname"
                              name="surname"
                              value={formData.surname}
                              onChange={handleInputChange}
                              placeholder="Enter your Surname"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="extension_name">Extension Name</Label>
                            <Input
                              id="extension_name"
                              name="extension_name"
                              value={formData.extension_name}
                              onChange={handleInputChange}
                              placeholder="Enter your Extension Name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter your phone number"
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="place_of_birth">Place of Birth</Label>
                            <Input
                              id="place_of_birth"
                              name="place_of_birth"
                              value={formData.place_of_birth}
                              onChange={handleInputChange}
                              placeholder="Enter place of birth"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="religion">Religion</Label>
                            <Input
                              id="religion"
                              name="religion"
                              value={formData.religion}
                              onChange={handleInputChange}
                              placeholder="Enter your religion"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="citizenship">Citizenship</Label>
                            <Input
                              id="citizenship"
                              name="citizenship"
                              value={formData.citizenship}
                              onChange={handleInputChange}
                              placeholder="Enter your citizenship"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sex">Sex</Label>
                            <Select
                              value={formData.sex}
                              onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}
                              name="sex"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select sex" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Male</SelectItem>
                                <SelectItem value="2">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="civil_status">Civil Status *</Label>
                            <Select
                              value={formData.civil_status}
                              onValueChange={(value) => setFormData((prev) => ({ ...prev, civil_status: value }))}
                              name="civil_status"
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select civil status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Single</SelectItem>
                                <SelectItem value="2">Married</SelectItem>
                                <SelectItem value="3">Widowed</SelectItem>
                                <SelectItem value="4">Divorced</SelectItem>
                                <SelectItem value="5">Separated</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <hr />

                        {/* Address breakdown */}
                        <div className="mt-6">
                          <div className="mb-2 text-lg font-semibold text-primary">Address Details</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                            <div className="space-y-2">
                              <Label htmlFor="barangay">Barangay</Label>
                              <Input id="barangay" name="barangay" value={formData.barangay} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="municipality">Municipality</Label>
                              <Input id="municipality" name="municipality" value={formData.municipality} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="province">Province</Label>
                              <Input id="province" name="province" value={formData.province} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="region">Region</Label>
                              <Select
                                value={formData.region}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
                                name="region"
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">National Capital Region (NCR)</SelectItem>
                                  <SelectItem value="2">Cordillera Administrative Region (CAR)</SelectItem>
                                  <SelectItem value="3">Ilocos Region (Region I)</SelectItem>
                                  <SelectItem value="4">Cagayan Valley (Region II)</SelectItem>
                                  <SelectItem value="5">Central Luzon (Region III)</SelectItem>
                                  <SelectItem value="6">CALABARZON (Region IV-A)</SelectItem>
                                  <SelectItem value="7">MIMAROPA Region (Region IV-B)</SelectItem>
                                  <SelectItem value="8">Bicol Region (Region V)</SelectItem>
                                  <SelectItem value="9">Western Visayas (Region VI)</SelectItem>
                                  <SelectItem value="10">Central Visayas (Region VII)</SelectItem>
                                  <SelectItem value="11">Eastern Visayas (Region VIII)</SelectItem>
                                  <SelectItem value="12">Zamboanga Peninsula (Region IX)</SelectItem>
                                  <SelectItem value="13">Northern Mindanao (Region X)</SelectItem>
                                  <SelectItem value="14">Davao Region (Region XI)</SelectItem>
                                  <SelectItem value="15">SOCCSKSARGEN (Region XII)</SelectItem>
                                  <SelectItem value="16">Caraga (Region XIII)</SelectItem>
                                  <SelectItem value="17">Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <hr />

                        {/* Schools Attended */}
                        <div className="mt-6">
                          <div className="mb-2 text-lg font-semibold text-primary">School Attended</div>
                          <div className="mb-4 mt-5">
                            <div className="mb-3 font-medium">Elementary School</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="elementary_school">School Name</Label>
                                <Input id="elementary_school" name="elementary_school" value={formData.elementary_school} onChange={handleInputChange} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="elementary_school_address">School Address</Label>
                                <Input id="elementary_school_address" name="elementary_school_address" value={formData.elementary_school_address} onChange={handleInputChange} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="elementary_year_graduated">Year Graduated</Label>
                                <Input id="elementary_year_graduated" name="elementary_year_graduated" value={formData.elementary_year_graduated} onChange={handleInputChange} type="number" min="1900" max="2099" />
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="mb-3 font-medium">Junior High School</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="junior_high_school">School Name</Label>
                                <Input id="junior_high_school" name="junior_high_school" value={formData.junior_high_school} onChange={handleInputChange} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="junior_high_school_address">School Address</Label>
                                <Input id="junior_high_school_address" name="junior_high_school_address" value={formData.junior_high_school_address} onChange={handleInputChange} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="junior_high_year_graduated">Year Graduated</Label>
                                <Input id="junior_high_year_graduated" name="junior_high_year_graduated" value={formData.junior_high_year_graduated} onChange={handleInputChange} type="number" min="1900" max="2099" />
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="mb-3 font-medium">Senior High School</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                              <div className="space-y-2">
                                <Label htmlFor="senior_high_school">School Name</Label>
                                <Input id="senior_high_school" name="senior_high_school" value={formData.senior_high_school} onChange={handleInputChange} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="senior_high_school_address">School Address</Label>
                                <Input id="senior_high_school_address" name="senior_high_school_address" value={formData.senior_high_school_address} onChange={handleInputChange} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="senior_high_year_graduated">Year Graduated</Label>
                                <Input id="senior_high_year_graduated" name="senior_high_year_graduated" value={formData.senior_high_year_graduated} onChange={handleInputChange} type="number" min="1900" max="2099" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr />

                        {/* Parents and Emergency */}
                        <div className="mt-6">
                          <div className="mb-2 text-lg font-semibold text-primary">Parents</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                            <div className="space-y-2">
                              <Label htmlFor="father_name">Father&apos;s Name</Label>
                              <Input id="father_name" name="father_name" value={formData.father_name} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="father_occupation">Father&apos;s Occupation</Label>
                              <Input id="father_occupation" name="father_occupation" value={formData.father_occupation} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="father_education">Father&apos;s Educational Attainment</Label>
                              <Input id="father_education" name="father_education" value={formData.father_education} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mother_name">Mother&apos;s Name</Label>
                              <Input id="mother_name" name="mother_name" value={formData.mother_name} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mother_occupation">Mother&apos;s Occupation</Label>
                              <Input id="mother_occupation" name="mother_occupation" value={formData.mother_occupation} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mother_education">Mother&apos;s Educational Attainment</Label>
                              <Input id="mother_education" name="mother_education" value={formData.mother_education} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2 md:col-span-3">
                              <Label htmlFor="monthly_income">Monthly Income</Label>
                              <Input id="monthly_income" name="monthly_income" value={formData.monthly_income} onChange={handleInputChange} />
                            </div>
                          </div>
                        </div>
                        <hr />

                        <div className="mt-6">
                          <div className="mb-2 text-lg font-semibold text-primary">Emergency Contact</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            <div className="space-y-2">
                              <Label htmlFor="emergency_name">Name</Label>
                              <Input id="emergency_name" name="emergency_name" value={formData.emergency_name} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="emergency_relationship">Relationship</Label>
                              <Input id="emergency_relationship" name="emergency_relationship" value={formData.emergency_relationship} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="emergency_address">Home Address</Label>
                              <Input id="emergency_address" name="emergency_address" value={formData.emergency_address} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="emergency_phone">Phone</Label>
                              <Input id="emergency_phone" name="emergency_phone" value={formData.emergency_phone} onChange={handleInputChange} />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Update Profile
                              </>
                            )}
                          </Button>
                          <Link href="/dashboard">
                            <Button type="button" variant="outline">
                              Cancel
                            </Button>
                          </Link>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  {/* <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Security Settings
                      </CardTitle>
                      <CardDescription>Update your password and security preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              placeholder="Enter your current password"
                              className="pl-10 pr-10"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              placeholder="Enter your new password"
                              className="pl-10 pr-10"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              placeholder="Confirm your new password"
                              className="pl-10 pr-10"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Button type="submit" disabled={passwordLoading} className="flex-1">
                            {passwordLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Update Password
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })}
                          >
                            Clear
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card> */}
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              {/* <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                  <CardDescription>Your current profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      {student.profilePhoto ? (
                        <img
                          src={student.profilePhoto || "/placeholder.svg"}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Student ID: {student.studentId}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{student.email}</span>
                    </div>
                    {student.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{student.phone}</span>
                      </div>
                    )}
                    {student.dateOfBirth && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{student.dateOfBirth.toLocaleDateString()}</span>
                      </div>
                    )}
                    {student.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-wrap">{student.address}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card> */}

              {/* <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Application Status</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        student.applicationStatus === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : student.applicationStatus === "rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            : student.applicationStatus === "incomplete"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      }`}
                    >
                      {student.applicationStatus.charAt(0).toUpperCase() + student.applicationStatus.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Documents Uploaded</span>
                    <span className="text-sm font-medium">{student.documents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Member Since</span>
                    <span className="text-sm">{student.createdAt.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
