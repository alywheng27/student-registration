"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff, Upload, User, CircleCheck, CircleAlert } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    surname: "",
    extension_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
    password: "",
    confirmPassword: "",
    profilePhoto: "",
    place_of_birth: "",
    religion: "",
    citizenship: "",
    sex: "",
    civil_status: "",
    region: "",
    barangay: "",
    municipality: "",
    province: "",
    elementary_school: "",
    elementary_school_address: "",
    elementary_year_graduated: "",
    junior_high_school: "",
    junior_high_school_address: "",
    junior_high_year_graduated: "",
    senior_high_school: "",
    senior_high_school_address: "",
    senior_high_year_graduated: "",
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
    birth_certificate: null,
    good_moral: null,
    grade_card: null,
  });
  const [error, setError] = useState("");
  const [profilePhotoError, setProfilePhotoError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");

  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Profile photo must be less than 5MB");
        return;
      }

      setProfilePhotoFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setProfilePhotoPreview(result);
        setFormData((prev) => ({ ...prev, profilePhoto: file }));
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleAutoFill = () => {
    setFormData({
      first_name: "John",
      middle_name: "A.",
      surname: "Doe",
      extension_name: "Jr.",
      email: "john.doe@example.com",
      phone: "09171234567",
      date_of_birth: "2000-01-01",
      address: "123 Main St, City, Country",
      password: "DemoPass123!",
      confirmPassword: "DemoPass123!",
      profilePhoto: "", // Leave empty for demo
      place_of_birth: "City Hospital, City, Country",
      religion: "None",
      citizenship: "Filipino",
      sex: "Male",
      civil_status: "Single",
      region: "NCR",
      barangay: "Barangay 1",
      municipality: "Quezon City",
      province: "Metro Manila",
      elementary_school: "Sample Elementary School",
      elementary_school_address: "Elementary St, City",
      elementary_year_graduated: "2012",
      junior_high_school: "Sample Junior High",
      junior_high_school_address: "JHS St, City",
      junior_high_year_graduated: "2016",
      senior_high_school: "Sample Senior High",
      senior_high_school_address: "SHS St, City",
      senior_high_year_graduated: "2018",
      father_name: "Juan Doe",
      father_occupation: "Engineer",
      father_education: "College Graduate",
      mother_name: "Jane Doe",
      mother_occupation: "Teacher",
      mother_education: "College Graduate",
      monthly_income: "50000",
      emergency_name: "Jake Doe",
      emergency_relationship: "Brother",
      emergency_address: "123 Main St, City, Country",
      emergency_phone: "09179876543",
      birth_certificate: null,
      good_moral: null,
      grade_card: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProfilePhotoError("");
    setLoading(true);

    if (profilePhotoFile === null) {
      setProfilePhotoError("Profile photo is required");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Require: min 8 chars, at least 1 lowercase, 1 uppercase, 1 number, and 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
      setLoading(false);
      return;
    }

    const result = await register({
      ...formData,
      // Keep date_of_birth as string (YYYY-MM-DD format) - will be converted to ISO timestamp in API
      date_of_birth: formData.date_of_birth || '',
    });

    if (result.success) {
      // router.push("/");
      setSuccess(result.message || "Registration successful");
      setFormData({
        first_name: "",
        middle_name: "",
        surname: "",
        extension_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        address: "",
        password: "",
        confirmPassword: "",
        profilePhoto: "",
        place_of_birth: "",
        religion: "",
        citizenship: "",
        sex: "",
        civil_status: "",
        region: "",
        barangay: "",
        municipality: "",
        province: "",
        elementary_school: "",
        elementary_school_address: "",
        elementary_year_graduated: "",
        junior_high_school: "",
        junior_high_school_address: "",
        junior_high_year_graduated: "",
        senior_high_school: "",
        senior_high_school_address: "",
        senior_high_year_graduated: "",
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
        birth_certificate: null,
        good_moral: null,
        grade_card: null,
      });
      setProfilePhotoFile(null);
      setProfilePhotoPreview("");
      setProfilePhotoError("");
      setError("");
    } else {
      setError(result.error || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-2 border-primary/20">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-end mb-2">
          <Button type="button" variant="secondary" size="sm" onClick={handleAutoFill}>
            Auto-Fill Demo Data
          </Button>
        </div>
        <CardTitle className="text-3xl font-bold mb-1">
          Student Registration
        </CardTitle>
        <CardDescription>
          Create your account to apply for university admission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Photo Section */}
          <div>
            <Label className="mb-2 block font-semibold text-base">
              Profile Photo
            </Label>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary flex items-center justify-center overflow-hidden bg-muted shadow-md">
                  {profilePhotoPreview ? (
                    <Image
                      src={profilePhotoPreview || "/placeholder.svg"}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      width={300}
                      height={300}
                    />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-[180px]">
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    className="hidden"
                    id="profilePhoto"
                  />
                  <Label htmlFor="profilePhoto" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </span>
                    </Button>
                  </Label>
                  <span className="text-xs text-muted-foreground ml-2">
                    Accepted: JPG, PNG, GIF. Max size: 5MB
                  </span>
                </div>
                {profilePhotoError && (
                  <span className="text-xs text-red-500 ml-1">{profilePhotoError}</span>
                )}
                <div className="mt-2 text-xs text-muted-foreground">
                  {profilePhotoFile && (
                    <span>Selected: {profilePhotoFile.name}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
                autoComplete="first_name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                placeholder="Enter your middle name"
                autoComplete="middle_name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">Surname *</Label>
              <Input
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                placeholder="Enter your surname"
                required
                autoComplete="surname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extension_name">Extension Name</Label>
              <Input
                id="extension_name"
                name="extension_name"
                value={formData.extension_name}
                onChange={handleChange}
                placeholder="Enter your extension name"
                autoComplete="extension_name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                autoComplete="bday"
                required
              />
            </div>
            {/* New fields start here */}
            <div className="space-y-2">
              <Label htmlFor="place_of_birth">Place of Birth *</Label>
              <Input
                id="place_of_birth"
                name="place_of_birth"
                value={formData.place_of_birth || ""}
                onChange={handleChange}
                placeholder="Enter your place of birth"
                autoComplete="off"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="religion">Religion *</Label>
              <Input
                id="religion"
                name="religion"
                value={formData.religion || ""}
                onChange={handleChange}
                placeholder="Enter your religion"
                autoComplete="off"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="citizenship">Citizenship *</Label>
              <Input
                id="citizenship"
                name="citizenship"
                value={formData.citizenship || ""}
                onChange={handleChange}
                placeholder="Enter your citizenship"
                autoComplete="off"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex">Sex *</Label>
              <Select
                value={formData.sex}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}
                name="sex"
                required
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

          {/* Address Details Section */}
          <div className="mt-6">
            <div className="mb-2 text-lg font-semibold text-primary">Address Details</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
              <div className="space-y-2">
                <Label htmlFor="barangay">Barangay *</Label>
                <Input
                  id="barangay"
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleChange}
                  placeholder="Enter barangay"
                  autoComplete="address-level4"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipality">Municipality *</Label>
                <Input
                  id="municipality"
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleChange}
                  placeholder="Enter municipality"
                  autoComplete="address-level3"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <Input
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  placeholder="Enter province"
                  autoComplete="address-level2"
                  required
                />
              </div>
              <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
                name="region"
                required
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
                  {/* <SelectItem value="NIR">Negros Island Region (NIR)</SelectItem> */}
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

          {/* School Attended Section */}
          <div className="mt-8">
            <div className="mb-2 text-lg font-semibold text-primary">School Attended</div>
            {/* Elementary School */}
            <div className="mb-4 mt-5">
              <div className="mb-1 font-medium">Elementary School</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
                <div className="space-y-2">
                  <Label htmlFor="elementary_school">School Name</Label>
                  <Input
                    id="elementary_school"
                    name="elementary_school"
                    value={formData.elementary_school}
                    onChange={handleChange}
                    placeholder="Enter elementary school name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="elementary_school_address">School Address</Label>
                  <Input
                    id="elementary_school_address"
                    name="elementary_school_address"
                    value={formData.elementary_school_address}
                    onChange={handleChange}
                    placeholder="Enter elementary school address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="elementary_year_graduated">Year Graduated</Label>
                  <Input
                    id="elementary_year_graduated"
                    name="elementary_year_graduated"
                    value={formData.elementary_year_graduated}
                    onChange={handleChange}
                    placeholder="Year graduated"
                    type="number"
                    min="1900"
                    max="2099"
                  />
                </div>
              </div>
            </div>
            {/* Junior High School */}
            <div className="mb-4">
              <div className="mb-1 font-medium">Junior High School</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
                <div className="space-y-2">
                  <Label htmlFor="junior_high_school">School Name</Label>
                  <Input
                    id="junior_high_school"
                    name="junior_high_school"
                    value={formData.junior_high_school}
                    onChange={handleChange}
                    placeholder="Enter junior high school name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="junior_high_school_address">School Address</Label>
                  <Input
                    id="junior_high_school_address"
                    name="junior_high_school_address"
                    value={formData.junior_high_school_address}
                    onChange={handleChange}
                    placeholder="Enter junior high school address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="junior_high_year_graduated">Year Graduated</Label>
                  <Input
                    id="junior_high_year_graduated"
                    name="junior_high_year_graduated"
                    value={formData.junior_high_year_graduated}
                    onChange={handleChange}
                    placeholder="Year graduated"
                    type="number"
                    min="1900"
                    max="2099"
                  />
                </div>
              </div>
            </div>
            {/* Senior High School */}
            <div>
              <div className="mb-1 font-medium">Senior High School</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
                <div className="space-y-2">
                  <Label htmlFor="senior_high_school">School Name</Label>
                  <Input
                    id="senior_high_school"
                    name="senior_high_school"
                    value={formData.senior_high_school}
                    onChange={handleChange}
                    placeholder="Enter senior high school name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senior_high_school_address">School Address</Label>
                  <Input
                    id="senior_high_school_address"
                    name="senior_high_school_address"
                    value={formData.senior_high_school_address}
                    onChange={handleChange}
                    placeholder="Enter senior high school address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senior_high_year_graduated">Year Graduated</Label>
                  <Input
                    id="senior_high_year_graduated"
                    name="senior_high_year_graduated"
                    value={formData.senior_high_year_graduated}
                    onChange={handleChange}
                    placeholder="Year graduated"
                    type="number"
                    min="1900"
                    max="2099"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />

          {/* Parents Section */}
          <div className="mt-8">
            <div className="mb-2 text-lg font-semibold text-primary">Parents</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
              <div className="space-y-2">
                <Label htmlFor="father_name">Father&apos;s Name *</Label>
                <Input
                  id="father_name"
                  name="father_name"
                  value={formData.father_name || ""}
                  onChange={handleChange}
                  placeholder="Enter father's name"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father_occupation">Father&apos;s Occupation *</Label>
                <Input
                  id="father_occupation"
                  name="father_occupation"
                  value={formData.father_occupation || ""}
                  onChange={handleChange}
                  placeholder="Enter father's occupation"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father_education">Father&apos;s Educational Attainment *</Label>
                <Input
                  id="father_education"
                  name="father_education"
                  value={formData.father_education || ""}
                  onChange={handleChange}
                  placeholder="Enter father's educational attainment"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_name">Mother&apos;s Name *</Label>
                <Input
                  id="mother_name"
                  name="mother_name"
                  value={formData.mother_name || ""}
                  onChange={handleChange}
                  placeholder="Enter mother's name"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_occupation">Mother&apos;s Occupation *</Label>
                <Input
                  id="mother_occupation"
                  name="mother_occupation"
                  value={formData.mother_occupation || ""}
                  onChange={handleChange}
                  placeholder="Enter mother's occupation"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_education">Mother&apos;s Educational Attainment *</Label>
                <Input
                  id="mother_education"
                  name="mother_education"
                  value={formData.mother_education || ""}
                  onChange={handleChange}
                  placeholder="Enter mother's educational attainment"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="monthly_income">Monthly Income *</Label>
                <Input
                  id="monthly_income"
                  name="monthly_income"
                  value={formData.monthly_income || ""}
                  onChange={handleChange}
                  placeholder="Enter monthly income"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          </div>
          <hr />

          {/* Emergency Contact Section */}
          <div className="mt-8">
            <div className="mb-2 text-lg font-semibold text-primary">Emergency Contact</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
              <div className="space-y-2">
                <Label htmlFor="emergency_name">Name *</Label>
                <Input
                  id="emergency_name"
                  name="emergency_name"
                  value={formData.emergency_name || ""}
                  onChange={handleChange}
                  placeholder="Enter emergency contact name"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_relationship">Relationship *</Label>
                <Input
                  id="emergency_relationship"
                  name="emergency_relationship"
                  value={formData.emergency_relationship || ""}
                  onChange={handleChange}
                  placeholder="Enter relationship"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="emergency_address">Home Address *</Label>
                <Input
                  id="emergency_address"
                  name="emergency_address"
                  value={formData.emergency_address || ""}
                  onChange={handleChange}
                  placeholder="Enter home address"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_phone">Phone *</Label>
                <Input
                  id="emergency_phone"
                  name="emergency_phone"
                  value={formData.emergency_phone || ""}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          </div>
          <hr />

          {/* Requirements Section */}
          <div className="mt-8">
            <div className="mb-2 text-lg font-semibold text-primary">Requirements</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
              {/* Birth Certificate */}
              <div className="space-y-2">
                <Label htmlFor="birth_certificate">Birth Certificate *</Label>
                <Input
                  id="birth_certificate"
                  name="birth_certificate"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={e => setFormData(prev => ({ ...prev, birth_certificate: e.target.files?.[0] }))}
                  className=""
                  required
                />
                {formData.birth_certificate && (
                  <span className="text-xs text-muted-foreground">Selected: {formData.birth_certificate.name}</span>
                )}
              </div>
              {/* Good Moral */}
              <div className="space-y-2">
                <Label htmlFor="good_moral">Good Moral *</Label>
                <Input
                  id="good_moral"
                  name="good_moral"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={e => setFormData(prev => ({ ...prev, good_moral: e.target.files?.[0] }))}
                  className=""
                  required
                />
                {formData.good_moral && (
                  <span className="text-xs text-muted-foreground">Selected: {formData.good_moral.name}</span>
                )}
              </div>
              {/* Grade Card */}
              <div className="space-y-2">
                <Label htmlFor="grade_card">Grade Card *</Label>
                <Input
                  id="grade_card"
                  name="grade_card"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={e => setFormData(prev => ({ ...prev, grade_card: e.target.files?.[0] }))}
                  className=""
                  required
                />
                {formData.grade_card && (
                  <span className="text-xs text-muted-foreground">Selected: {formData.grade_card.name}</span>
                )}
              </div>
            </div>
          </div>
          <hr />

          {/* Password Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 6 characters long
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="text-green-500">
              <CircleCheck />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full text-base font-semibold py-3 mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
