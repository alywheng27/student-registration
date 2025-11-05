"use client"

import { format } from "date-fns"
import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	Clock,
	Download,
	Edit,
	Eye,
	FileCheck,
	FileText,
	Filter,
	GitBranch,
	Mail,
	MapPin,
	Phone,
	Search,
	Shield,
	Trash2,
	UserPlus,
	Users,
	XCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useId, useState } from "react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import {
	getAddressWithoutId,
	getAdminWithoutId,
	getApplicationWithoutId,
	getDocumentsWithoutId,
	getEmergencyContactWithoutId,
	getParentsWithoutId,
	getProfileWithoutId,
	getSchoolAttendedWithoutId,
	getUserWithoutId,
} from "@/lib/student_info"

export function AdminDashboard() {
	const { user, addAdmin, updateAdmin, deleteAdmin } = useAuth()
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")

	const [selectedApplication, setSelectedApplication] = useState(null)
	const [modalType, setModalType] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const [adminModalType, setAdminModalType] = useState(null)
	const [selectedAdmin, setSelectedAdmin] = useState(null)
	const [adminFormData, setAdminFormData] = useState({
		uid: "",
		first_name: "",
		middle_name: "",
		surname: "",
		extension_name: "",
		email: "",
		password: "",
		confirm_password: "",
	})
	// const [adminUsers, setAdminUsers] = useState(mockAdminUsers)
	const [formErrors, setFormErrors] = useState(null)
	const [profiles, setProfiles] = useState([])
	const [addresses, setAddresses] = useState([])
	const [schoolAttended, setSchoolAttended] = useState([])
	const [emergencyContacts, setEmergencyContacts] = useState([])
	const [parents, setParents] = useState([])
	const [applications, setApplications] = useState([])
	const [documents, setDocuments] = useState([])
	const [users, setUsers] = useState([])
	const [admins, setAdmins] = useState([])
	const [profileApplication, setProfileApplication] = useState([])
	const [adminApplication, setAdminApplication] = useState([])

	const adminFirstNameId = useId()
	const adminMiddleNameId = useId()
	const adminSurnameId = useId()
	const adminExtensionNameId = useId()
	const adminEmailId = useId()
	const adminPasswordId = useId()
	const adminConfirmPasswordId = useId()

	const updateAdminFirstNameId = useId()
	const updateAdminMiddleNameId = useId()
	const updateAdminSurnameId = useId()
	const updateAdminExtensionNameId = useId()
	const updateAdminEmailId = useId()
	const updateAdminPasswordId = useId()
	const updateAdminConfirmPasswordId = useId()

	const DOCUMENT_COUNT = 3

	const profileData = useCallback(async () => {
		const data = await getProfileWithoutId()
		setProfiles(data)
	}, [])

	const addressData = useCallback(async () => {
		const data = await getAddressWithoutId()
		setAddresses(data)
	}, [])

	const schoolAttendedData = useCallback(async () => {
		const data = await getSchoolAttendedWithoutId()
		setSchoolAttended(data)
	}, [])

	const parentsData = useCallback(async () => {
		const data = await getParentsWithoutId()
		setParents(data)
	}, [])

	const emergencyContactData = useCallback(async () => {
		const data = await getEmergencyContactWithoutId()
		setEmergencyContacts(data)
	}, [])

	const applicationData = useCallback(async () => {
		const data = await getApplicationWithoutId()
		setApplications(data)
	}, [])

	const documentData = useCallback(async () => {
		const data = await getDocumentsWithoutId()
		setDocuments(data)
	}, [])

	const userData = useCallback(async () => {
		const data = await getUserWithoutId()
		setUsers(data)
	}, [])

	const adminData = useCallback(async () => {
		const data = await getAdminWithoutId()
		setAdmins(data)
	}, [])

	useEffect(() => {
		profileData()
		addressData()
		schoolAttendedData()
		parentsData()
		emergencyContactData()
		applicationData()
		documentData()
		userData()
		adminData()
	}, [
		profileData,
		addressData,
		schoolAttendedData,
		parentsData,
		emergencyContactData,
		applicationData,
		documentData,
		userData,
		adminData,
	])

	const profileApplicationData = useCallback(() => {
		if (profiles.length > 0 && applications.length > 0) {
			const combinedData = profiles.map((p) => {
				const sch = schoolAttended?.find((s) => s.uid === p.uid)
				const apr = parents?.find((pe) => pe.uid === p.uid)
				const eme = emergencyContacts?.find((e) => e.uid === p.uid)
				const usr = users?.users?.find((u) => u.id === p.uid)
				const doc = documents?.find((d) => d.uid === p.uid)
				const add = addresses?.find((a) => a.uid === p.uid)
				const app = applications?.find((a) => a.uid === p.uid)
				return {
					...p,
					email: usr ? usr.email : "N/A",
					applicationStatus: app ? app.Status.status : "N/A",
					currentStep: app ? app.Steps.step : "N/A",
					barangay: add ? add.barangay : "N/A",
					municipality: add ? add.municipality : "N/A",
					province: add ? add.province : "N/A",
					...sch,
					...apr,
					emergency_name: eme ? eme.name : "N/A",
					emergency_relationship: eme ? eme.relationship : "N/A",
					emergency_address: eme ? eme.home_address : "N/A",
					emergency_phone: eme ? eme.phone : "N/A",
					progress:
						app.Status.status === "Approved"
							? Math.round((3 / DOCUMENT_COUNT) * 100)
							: app.Steps.step === "Final Review"
								? Math.round((2 / DOCUMENT_COUNT) * 100)
								: app.Steps.step === "Eligibility Check"
									? Math.round((1 / DOCUMENT_COUNT) * 100)
									: Math.round((0 / DOCUMENT_COUNT) * 100),
					documents: [
						{
							type: doc?.birth_certificate ? "Birth Certificate" : "",
							name: doc?.birth_certificate,
							status: doc?.birth_certificate_status,
							created_at: doc?.created_at,
						},
						{
							type: doc?.good_moral ? "Good Moral" : "",
							name: doc?.good_moral,
							status: doc?.good_moral_status,
							created_at: doc?.created_at,
						},
						{
							type: doc?.grade_card ? "Grade Card" : "",
							name: doc?.grade_card,
							status: doc?.grade_card_status,
							created_at: doc?.created_at,
						},
					],
					missingDocuments: [
						{
							type: doc?.birth_certificate ? "" : "Birth Certificate",
							name: doc?.birth_certificate,
							status: doc?.birth_certificate_status,
							created_at: doc?.created_at,
						},
						{
							type: doc?.good_moral ? "" : "Good Moral",
							name: doc?.good_moral,
							status: doc?.good_moral_status,
							created_at: doc?.created_at,
						},
						{
							type: doc?.grade_card ? "" : "Grade Card",
							name: doc?.grade_card,
							status: doc?.grade_card_status,
							created_at: doc?.created_at,
						},
					],
				}
			})
			setProfileApplication(combinedData)
		}
	}, [
		profiles,
		applications,
		documents,
		users,
		addresses,
		emergencyContacts,
		parents,
		schoolAttended,
	])

	const adminApplicationData = useCallback(() => {
		if (admins.length > 0) {
			const combineData = admins.map((a) => {
				const usr = users?.users?.find((u) => u.id === a.uid)
				return {
					...a,
					email: usr ? usr.email : "N/A",
				}
			})
			setAdminApplication(combineData)
		}
	}, [admins, users])

	useEffect(() => {
		profileApplicationData()
	}, [profileApplicationData])

	useEffect(() => {
		adminApplicationData()
	}, [adminApplicationData])

	// Calculate statistics
	const stats = {
		totalApplications: profiles.length,
		pendingReview: applications?.filter(
			(app) => app.Status.status === "Pending",
		).length,
		inProgressReview: applications?.filter(
			(app) => app.Status.status === "In Progress",
		).length,
		approvedReview: applications?.filter(
			(app) => app.Status.status === "Approved",
		).length,
		rejectedReview: applications?.filter(
			(app) => app.Status.status === "Rejected",
		).length,
		incompleteReview: applications?.filter(
			(app) => app.Status.status === "Incomplete",
		).length,
	}

	// Filter applications
	let filteredApplications = []
	filteredApplications = profileApplication.filter((app) => {
		const matchesSearch =
			app.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			app.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			app.studentId?.toLowerCase().includes(searchTerm.toLowerCase())

		const matchesStatus =
			statusFilter === "all" || app.applicationStatus === statusFilter

		return matchesSearch && matchesStatus
	})

	const getStatusBadge = (status) => {
		switch (status) {
			case "Approved":
				return <Badge className="bg-green-500">Approved</Badge>
			case "Rejected":
				return <Badge variant="destructive">Rejected</Badge>
			case "Incomplete":
				return <Badge className="bg-yellow-500">Incomplete</Badge>
			case "In Progress":
				return <Badge className="bg-blue-500">In Progress</Badge>
			default:
				return <Badge className="bg-gray-500">Pending</Badge>
		}
	}

	const exportData = () => {
		// Mock export functionality
		const csvContent = [
			[
				"Student ID",
				"First Name",
				"Surname",
				"Email",
				"Phone",
				"Religion",
				"Citizenship",
				"Place of Birth",
				"Sex",
				"Civil Status",
				"Region",
				"Barangay",
				"Municipality",
				"Province",
				"Elementary School",
				"Elementary School Address",
				"Elementary Year Graduated",
				"Junior High School",
				"Junior High School Address",
				"Junior High Year Graduated",
				"Senior High School",
				"Senior High School Address",
				"Senior High Year Graduated",
				"Father Name",
				"Father Occupation",
				"Father Educational Attainment",
				"Mother Name",
				"Mother Occupation",
				"Mother Educational Attainment",
				"Monthly Income",
				"Emergency Name",
				"Emergency Relationship",
				"Emergency Address",
				"Emergency Phone",
				"Status",
				"Step",
				"Submitted Date",
				"Documents",
				"Missing Documents",
			],
			...filteredApplications.map((app) => [
				app.uid,
				app.first_name,
				app.surname,
				app.email,
				app.phone,
				app.religion,
				app.citizenship,
				app.place_of_birth,
				app.Sex.sex,
				app.Civil_Status.civil_status,
				app.Regions.region,
				app.barangay,
				app.municipality,
				app.province,
				app.elementary,
				app.elementary_address,
				app.elementary_year_graduated,
				app.junior_high,
				app.junior_high_address,
				app.junior_high_year_graduated,
				app.senior_high,
				app.senior_high_address,
				app.senior_high_year_graduated,
				app.father_name,
				app.father_occupation,
				app.father_educational_attainment,
				app.mother_name,
				app.mother_occupation,
				app.mother_educational_attainment,
				app.monthly_income,
				app.emergency_name,
				app.emergency_relationship,
				app.emergency_address,
				app.emergency_phone,
				app.applicationStatus,
				app.currentStep,
				app.created_at,
				app.documents
					.map((doc) => {
						if (doc.type !== "") {
							return doc.type
						} else {
							return null
						}
					})
					.filter(Boolean) // Filter out null and empty strings
					.join("; "),
				app.missingDocuments
					.map((doc) => {
						if (doc.type !== "") {
							return doc.type
						} else {
							return null
						}
					})
					.filter(Boolean) // Filter out null and empty strings
					.join("; "),
			]),
		]
			.map((row) => row.join("|"))
			.join("\n")

		const finalCsvContent = `SEP=|\n${csvContent}`
		const blob = new Blob([finalCsvContent], {
			type: "text/csv;charset=utf-8,",
		})
		const url = window.URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = "student_applications.csv"
		a.click()
		window.URL.revokeObjectURL(url)
	}

	// Added modal handler functions
	const openModal = (application, type) => {
		setSelectedApplication(application)
		setModalType(type)
	}

	const closeModal = () => {
		setSelectedApplication(null)
		setModalType(null)
		setIsLoading(false)
	}

	const getStatusIcon = (status) => {
		switch (status) {
			case "Approved":
				return <CheckCircle className="h-5 w-5 text-green-500" />
			case "Rejected":
				return <XCircle className="h-5 w-5 text-red-500" />
			case "Incomplete":
				return <AlertTriangle className="h-5 w-5 text-yellow-500" />
			case "In Progress":
				return <GitBranch className="h-5 w-5 text-blue-500" />
			default:
				return <Clock className="h-5 w-5 text-gray-500" />
		}
	}

	// const getDocumentStatusBadge = (status) => {
	// 	switch (status) {
	// 		case 3:
	// 			return <Badge className="bg-green-500">Approved</Badge>
	// 		case 4:
	// 			return <Badge variant="destructive">Rejected</Badge>
	// 		case 1:
	// 			return <Badge variant="secondary">Pending</Badge>
	// 		case 2:
	// 			return <Badge className="bg-blue-500">In Progress</Badge>
	// 		default:
	// 			return <Badge className="bg-yellow-500">Incomplete</Badge>
	// 	}
	// }

	const openAdminModal = (type, adminUser) => {
		setAdminModalType(type)
		setSelectedAdmin(adminUser || null)
		setFormErrors({})

		if (type === "add") {
			setAdminFormData({
				uid: "",
				first_name: "",
				middle_name: "",
				surname: "",
				extension_name: "",
				email: "",
				password: "",
				confirm_password: "",
			})
		} else if (type === "edit" && adminUser) {
			setAdminFormData({
				uid: adminUser.uid || "",
				first_name: adminUser.first_name || "",
				middle_name: adminUser.middle_name || "",
				surname: adminUser.surname || "",
				extension_name: adminUser.extension_name || "",
				email: adminUser.email || "",
				password: "",
				confirm_password: "",
			})
		}
	}

	const closeAdminModal = () => {
		setAdminModalType(null)
		setSelectedAdmin(null)
		setAdminFormData({
			uid: "",
			first_name: "",
			middle_name: "",
			surname: "",
			extension_name: "",
			email: "",
			password: "",
			confirm_password: "",
		})
		setFormErrors({})
		setIsLoading(false)
	}

	const validateAdminForm = (adminModalType) => {
		const errors = {}

		if (!adminFormData.first_name.trim()) {
			errors.first_name = "First name is required"
		}
		if (!adminFormData.surname.trim()) {
			errors.surname = "Surname is required"
		}

		if (!adminFormData.email.trim()) {
			errors.email = "Email is required"
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminFormData.email)) {
			errors.email = "Please enter a valid email address"
		}

		if (adminModalType !== "edit") {
			if (!adminFormData.password.trim()) {
				errors.password = "Password is required"
			} else if (adminFormData.password.length < 6) {
				errors.password = "Password must be at least 6 characters long"
			}

			if (!adminFormData.confirm_password.trim()) {
				errors.confirm_password = "Confirm password is required"
			} else if (adminFormData.password !== adminFormData.confirm_password) {
				errors.confirm_password = "Passwords do not match"
			}
		}

		setFormErrors(errors)
		return Object.keys(errors).length === 0
	}

	const handleAdminAction = async () => {
		if (!adminModalType) return

		if (adminModalType === "delete") {
			setIsLoading(true)
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 1000))

			try {
				const result = await deleteAdmin(selectedAdmin.uid)

				if (result.success) {
					toast.success(result.message || "Admin deleted successfully")
				} else {
					toast.error(result.error || "deleting admin failed")
				}
			} catch (err) {
				toast.error(err.message || "deleting admin failed")
			}

			closeAdminModal()
			return
		}

		if (!validateAdminForm(adminModalType)) return

		setIsLoading(true)
		// Mock API call
		await new Promise((resolve) => setTimeout(resolve, 1500))

		if (adminModalType === "add") {
			try {
				const result = await addAdmin({ ...adminFormData })

				if (result.success) {
					toast.success(result.message || "Admin added successfully")
				} else {
					toast.error(result.error || "Adding admin failed")
				}
			} catch (err) {
				toast.error(err.message || "Adding admin failed")
			}
		} else if (adminModalType === "edit") {
			try {
				const result = await updateAdmin({ ...adminFormData })

				if (result.success) {
					toast.success(result.message || "Admin updated successfully")
				} else {
					toast.error(result.error || "Updating admin failed")
				}
			} catch (err) {
				toast.error(err.message || "Updating admin failed")
			}
		}

		adminData()
		closeAdminModal()
	}

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div className="flex items-center justify-between px-4 py-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Admin Dashboard
					</h1>
					<p className="text-muted-foreground">Welcome back, {user?.email}</p>
				</div>
				<div className="flex items-center gap-3">
					<Button onClick={exportData} className="flex items-center gap-2">
						<Download className="h-4 w-4" />
						Export Data
					</Button>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<Card>
					<CardContent className="flex items-center space-x-4 p-6">
						<div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
							<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
						<div>
							<h3 className="text-2xl font-bold">{stats.totalApplications}</h3>
							<p className="text-sm text-muted-foreground">
								Total Applications
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center space-x-4 p-6">
						<div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
							<Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
						</div>
						<div>
							<h3 className="text-2xl font-bold">{stats.pendingReview}</h3>
							<p className="text-sm text-muted-foreground">Pending</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center space-x-4 p-6">
						<div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
							<FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<h3 className="text-2xl font-bold">{stats.inProgressReview}</h3>
							<p className="text-sm text-muted-foreground">In Progress</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<Card>
					<CardContent className="flex items-center space-x-4 p-6">
						<div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
							<FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<h3 className="text-2xl font-bold">{stats.approvedReview}</h3>
							<p className="text-sm text-muted-foreground">Approved</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center space-x-4 p-6">
						<div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
							<UserPlus className="h-6 w-6 text-red-600 dark:text-red-400" />
						</div>
						<div>
							<h3 className="text-2xl font-bold">{stats.rejectedReview}</h3>
							<p className="text-sm text-muted-foreground">Rejected</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center space-x-4 p-6">
						<div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
							<Filter className="h-6 w-6 text-orange-600 dark:text-orange-400" />
						</div>
						<div>
							<h3 className="text-2xl font-bold">{stats.incompleteReview}</h3>
							<p className="text-sm text-muted-foreground">Incomplete</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content Tabs */}
			<Tabs defaultValue="applications" className="space-y-4">
				<TabsList>
					<TabsTrigger value="applications">Applications</TabsTrigger>
					<TabsTrigger value="users">User Management</TabsTrigger>
					{/* <TabsTrigger value="reports">Reports</TabsTrigger> */}
				</TabsList>

				<TabsContent value="applications" className="space-y-4">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Application Management</CardTitle>
									<CardDescription>
										Review and manage student applications
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col sm:flex-row gap-4 mb-6">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search by name, email, or student ID..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
								<Select onValueChange={setStatusFilter} value={statusFilter}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Filter by Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="Pending">Pending</SelectItem>
										<SelectItem value="In Progress">In Progress</SelectItem>
										<SelectItem value="Approved">Approved</SelectItem>
										<SelectItem value="Rejected">Rejected</SelectItem>
										<SelectItem value="Incomplete">Incomplete</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-4">
								{filteredApplications?.map((application) => (
									<div key={application.id} className="border rounded-lg p-4">
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center gap-3">
												<div>
													{getStatusIcon(application.applicationStatus)}
												</div>
												{/* Profile Image */}
												<div className=" h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
													<Image
														src={application.photo_url} // Replace with actual profile image URL
														alt="Profile Avatar"
														className="h-full w-full object-cover"
														width={200}
														height={200}
													/>
												</div>
												<div>
													<h4 className="font-semibold text-lg">
														{application.first_name} {application.surname}
													</h4>
													<p className="text-sm text-muted-foreground">
														{application.email}
													</p>
													<p className="text-xs text-muted-foreground">
														{application.phone}
													</p>
												</div>
											</div>
											<div className="text-right">
												{getStatusBadge(application.applicationStatus)}
												<p className="text-xs text-muted-foreground mt-1">
													Submitted:{" "}
													{format(new Date(application.created_at), "PPP")}
												</p>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
											<div>
												<h5 className="text-sm font-medium text-green-600 mb-1">
													Uploaded Documents:
												</h5>
												<ul className="text-sm text-muted-foreground">
													{application.documents.map((doc) => {
														if (doc?.type !== "") {
															return <li key={doc?.type}>• {doc?.type}</li>
														} else {
															return null
														}
													})}
													<li>--- Nothing follows --- </li>
												</ul>
											</div>
											{application.missingDocuments.length > 0 && (
												<div>
													<h5 className="text-sm font-medium text-red-600 mb-1">
														Missing Documents:
													</h5>
													<ul className="text-sm text-muted-foreground">
														{application.missingDocuments.map((doc) => {
															if (doc?.type !== "") {
																return <li key={doc?.type}>• {doc?.type}</li>
															} else {
																return null
															}
														})}
														<li>--- Nothing follows --- </li>
													</ul>
												</div>
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
											<div>
												<h5 className="text-sm font-medium mb-1">
													Current Step:
												</h5>
												<p className="text-sm text-muted-foreground">
													{application.currentStep}
												</p>
											</div>
											<div>
												<h5 className="text-sm font-medium mb-1">Progress:</h5>
												<div className="flex items-center space-x-2">
													<div className="flex-1 bg-gray-200 rounded-full h-2">
														<div
															className="bg-purple-600 h-2 rounded-full"
															style={{ width: `${application.progress}%` }}
														></div>
													</div>
													<span className="text-sm text-muted-foreground">
														{application.progress}%
													</span>
												</div>
											</div>
										</div>

										<div className="flex gap-2 mt-5">
											<Button
												size="sm"
												variant="outline"
												onClick={() => openModal(application, "view")}
											>
												<Eye className="h-4 w-4 mr-1" />
												View Details
											</Button>
											<Link href={`/admin/workflow/${application.uid}`}>
												<Button
													size="sm"
													className="bg-purple-600 hover:bg-purple-700"
												>
													<GitBranch className="h-4 w-4 mr-1" />
													Manage Workflow
												</Button>
											</Link>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="users" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>User Management</CardTitle>
							<CardDescription>
								Manage admin accounts and permissions
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold">
									Admin Users ({adminApplication.length})
								</h3>
								<Button onClick={() => openAdminModal("add")}>
									<UserPlus className="h-4 w-4 mr-2" />
									Add Admin
								</Button>
							</div>

							<div className="space-y-3">
								{adminApplication.map((adminUser) => (
									<div
										key={adminUser.id}
										className="flex items-center justify-between p-4 border rounded-lg"
									>
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<Shield className="h-5 w-5 text-blue-500" />
												<div>
													<h4 className="font-medium">
														{adminUser.first_name} {adminUser.surname}
													</h4>
													<p className="text-sm text-muted-foreground">
														{adminUser.email}
													</p>
													<p className="text-xs text-muted-foreground">
														Created:{" "}
														{format(new Date(adminUser.created_at), "PPP")}
													</p>
												</div>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => openAdminModal("edit", adminUser)}
											>
												<Edit className="h-4 w-4 mr-1" />
												Edit
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() => openAdminModal("delete", adminUser)}
												className="text-red-600 hover:text-red-700 hover:bg-red-50"
											>
												<Trash2 className="h-4 w-4 mr-1" />
												Delete
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Added modal dialogs for different actions */}
			<Dialog open={modalType !== null} onOpenChange={closeModal}>
				<DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
					{modalType === "view" && selectedApplication && (
						<>
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2">
									{getStatusIcon(selectedApplication.applicationStatus)}
									Application Details - {selectedApplication.first_name}{" "}
									{selectedApplication.surname}
								</DialogTitle>
								<DialogDescription>
									Complete overview of student application and documents
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">
												Student Information
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-3">
											<div className="flex items-center gap-2">
												<Users className="h-4 w-4 text-muted-foreground" />
												<span className="font-medium">
													{selectedApplication.first_name}{" "}
													{selectedApplication.surname}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Mail className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">
													{selectedApplication.email}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Phone className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">
													{selectedApplication.phone}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<MapPin className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">
													{selectedApplication.barangay} {", "}
													{selectedApplication.municipality} {", "}
													{selectedApplication.province}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">
													Submitted:{" "}
													{format(
														new Date(selectedApplication.created_at),
														"PPP",
													)}
												</span>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle className="text-lg">Student Photo</CardTitle>
										</CardHeader>
										<CardContent className="space-y-3">
											<div className="w-[60%] mx-auto rounded-full bg-muted flex items-center justify-center overflow-hidden">
												<Image
													src={selectedApplication.photo_url} // Replace with actual profile image URL
													alt="Profile Avatar"
													className="h-full w-full object-cover"
													width={200}
													height={200}
												/>
											</div>
										</CardContent>
									</Card>
								</div>

								<Card>
									<CardHeader>
										<CardTitle className="text-lg">
											Application Status
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												Current Status:
											</span>
											{getStatusBadge(selectedApplication.applicationStatus)}
										</div>
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												Uploaded Documents:
											</span>
											<span className="text-sm">
												{
													selectedApplication?.documents?.filter(
														(d) => d !== "",
													)?.length
												}{" "}
												uploaded
											</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												Missing Documents:
											</span>
											<span className="text-sm">
												{
													selectedApplication?.missingDocuments?.filter(
														(d) => d === "",
													)?.length
												}{" "}
												missing
											</span>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Document Review</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{selectedApplication.documents.map((doc) => {
												if (doc.type !== "") {
													return (
														<div
															key={doc.type}
															className="flex items-center justify-between p-3 border rounded-lg"
														>
															<div className="flex items-center gap-3">
																<FileText className="h-5 w-5 text-muted-foreground" />
																<div>
																	<h4 className="font-medium">{doc.type}</h4>
																	<p className="text-sm text-muted-foreground">
																		Uploaded:{" "}
																		{format(new Date(doc.created_at), "PPP")}
																	</p>
																</div>
															</div>
															<div className="flex items-center gap-2">
																{/* {getDocumentStatusBadge(doc.status)} */}
																<Link href={doc.name} target="_blank">
																	<Button size="sm" variant="outline">
																		<Eye className="h-4 w-4 mr-1" />
																		View
																	</Button>
																</Link>
															</div>
														</div>
													)
												} else {
													return null
												}
											})}

											{selectedApplication?.missingDocuments?.map((doc) => {
												if (doc.type !== "") {
													return (
														<Alert key={doc.type}>
															<AlertTriangle className="h-4 w-4" />
															<AlertDescription>
																<span>
																	<strong>Missing Document:</strong> {doc.type}
																</span>
															</AlertDescription>
														</Alert>
													)
												} else {
													return null
												}
											})}
										</div>
									</CardContent>
								</Card>
							</div>

							<div className="flex justify-end">
								<Button onClick={closeModal}>Close</Button>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>

			<Dialog open={adminModalType !== null} onOpenChange={closeAdminModal}>
				<DialogContent className="max-w-2xl">
					{adminModalType === "add" && (
						<>
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2">
									<UserPlus className="h-5 w-5 text-blue-500" />
									Add New Admin
								</DialogTitle>
								<DialogDescription>
									Create a new admin account with specific permissions and
									access levels.
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor={adminFirstNameId} className="mb-3">
											First Name *
										</Label>
										<Input
											id={adminFirstNameId}
											placeholder="Enter admin's first name"
											value={adminFormData.first_name}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													first_name: e.target.value,
												}))
											}
											className={formErrors.first_name ? "border-red-300" : ""}
										/>
										{formErrors.first_name && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.first_name}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor={adminMiddleNameId} className="mb-3">
											Middle Name
										</Label>
										<Input
											id={adminMiddleNameId}
											placeholder="Enter admin's middle name"
											value={adminFormData.middle_name}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													middle_name: e.target.value,
												}))
											}
											className={formErrors.middle_name ? "border-red-300" : ""}
										/>
										{formErrors.middle_name && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.middle_name}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor={adminSurnameId} className="mb-3">
											Surname *
										</Label>
										<Input
											id={adminSurnameId}
											placeholder="Enter admin's surname"
											value={adminFormData.surname}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													surname: e.target.value,
												}))
											}
											className={formErrors.surname ? "border-red-300" : ""}
										/>
										{formErrors.surname && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.surname}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor={adminExtensionNameId} className="mb-3">
											Extension Name
										</Label>
										<Input
											id={adminExtensionNameId}
											placeholder="Enter admin's extension name"
											value={adminFormData.extension_name}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													extension_name: e.target.value,
												}))
											}
											className={
												formErrors.extension_name ? "border-red-300" : ""
											}
										/>
										{formErrors.extension_name && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.extension_name}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor={adminEmailId} className="mb-3">
											Email Address *
										</Label>
										<Input
											id={adminEmailId}
											type="email"
											placeholder="admin@university.edu"
											value={adminFormData.email}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													email: e.target.value,
												}))
											}
											className={formErrors.email ? "border-red-300" : ""}
										/>
										{formErrors.email && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.email}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor={adminPasswordId} className="mb-3">
											Password *
										</Label>
										<Input
											id={adminPasswordId}
											type="password"
											placeholder="Enter password"
											value={adminFormData.password}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													password: e.target.value,
												}))
											}
											className={formErrors.password ? "border-red-300" : ""}
										/>
										{formErrors.password && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.password}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor={adminConfirmPasswordId} className="mb-3">
											Confirm Password *
										</Label>
										<Input
											id={adminConfirmPasswordId}
											type="password"
											placeholder="Confirm password"
											value={adminFormData.confirm_password}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													confirm_password: e.target.value,
												}))
											}
											className={
												formErrors.confirm_password ? "border-red-300" : ""
											}
										/>
										{formErrors.confirm_password && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.confirm_password}
											</p>
										)}
									</div>
								</div>
							</div>

							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={closeAdminModal}
									disabled={isLoading}
								>
									Cancel
								</Button>
								<Button
									onClick={handleAdminAction}
									disabled={isLoading}
									className="bg-blue-600 hover:bg-blue-700"
								>
									{isLoading ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Creating...
										</>
									) : (
										<>
											<UserPlus className="h-4 w-4 mr-2" />
											Create Admin
										</>
									)}
								</Button>
							</div>
						</>
					)}

					{adminModalType === "edit" && selectedAdmin && (
						<>
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2">
									<Edit className="h-5 w-5 text-blue-500" />
									Edit Admin - {selectedAdmin.first_name}{" "}
									{selectedAdmin.surname}
								</DialogTitle>
								<DialogDescription>
									Update admin account information and permissions.
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor={updateAdminFirstNameId}>First Name *</Label>
										<Input
											id={updateAdminFirstNameId}
											placeholder="Enter admin's first name"
											value={adminFormData.first_name}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													first_name: e.target.value,
												}))
											}
											className={formErrors.first_name ? "border-red-300" : ""}
										/>
										{formErrors.first_name && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.first_name}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor={updateAdminMiddleNameId}>Middle Name</Label>
										<Input
											id={updateAdminMiddleNameId}
											placeholder="Enter admin's middle name"
											value={adminFormData.middle_name}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													middle_name: e.target.value,
												}))
											}
											className={formErrors.middle_name ? "border-red-300" : ""}
										/>
										{formErrors.middle_name && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.middle_name}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor={updateAdminSurnameId}>Surname *</Label>
										<Input
											id={updateAdminSurnameId}
											placeholder="Enter admin's surname"
											value={adminFormData.surname}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													surname: e.target.value,
												}))
											}
											className={formErrors.surname ? "border-red-300" : ""}
										/>
										{formErrors.surname && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.surname}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor={updateAdminExtensionNameId}>
											Extension Name
										</Label>
										<Input
											id={updateAdminExtensionNameId}
											placeholder="Enter admin's extension name"
											value={adminFormData.extension_name}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													extension_name: e.target.value,
												}))
											}
											className={
												formErrors.extension_name ? "border-red-300" : ""
											}
										/>
										{formErrors.extension_name && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.extension_name}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor={updateAdminEmailId}>Email Address *</Label>
										<Input
											id={updateAdminEmailId}
											type="email"
											placeholder="admin@university.edu"
											value={adminFormData.email}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													email: e.target.value,
												}))
											}
											className={formErrors.email ? "border-red-300" : ""}
										/>
										{formErrors.email && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.email}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor={updateAdminPasswordId} className="mb-3">
											Password *
										</Label>
										<Input
											id={updateAdminPasswordId}
											type="password"
											placeholder="Enter password"
											value={adminFormData.password}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													password: e.target.value,
												}))
											}
											className={formErrors.password ? "border-red-300" : ""}
										/>
										{formErrors.password && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.password}
											</p>
										)}
									</div>

									<div>
										<Label
											htmlFor={updateAdminConfirmPasswordId}
											className="mb-3"
										>
											Confirm Password *
										</Label>
										<Input
											id={updateAdminConfirmPasswordId}
											type="password"
											placeholder="Confirm password"
											value={adminFormData.confirm_password}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													confirm_password: e.target.value,
												}))
											}
											className={
												formErrors.confirm_password ? "border-red-300" : ""
											}
										/>
										{formErrors.confirm_password && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.confirm_password}
											</p>
										)}
									</div>
								</div>
							</div>

							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={closeAdminModal}
									disabled={isLoading}
								>
									Cancel
								</Button>
								<Button
									onClick={handleAdminAction}
									disabled={isLoading}
									className="bg-blue-600 hover:bg-blue-700"
								>
									{isLoading ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Updating...
										</>
									) : (
										<>
											<CheckCircle className="h-4 w-4 mr-2" />
											Update Admin
										</>
									)}
								</Button>
							</div>
						</>
					)}

					{adminModalType === "delete" && selectedAdmin && (
						<>
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2">
									<Trash2 className="h-5 w-5 text-red-500" />
									Delete Admin Account
								</DialogTitle>
								<DialogDescription>
									This action cannot be undone. The admin will lose access to
									the system immediately.
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-4">
								<Alert>
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription>
										<strong>Warning:</strong> You are about to permanently
										delete this admin account. This action cannot be reversed.
									</AlertDescription>
								</Alert>

								<Card>
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<Shield className="h-8 w-8 text-red-500" />
											<div>
												<h4 className="font-semibold">
													{selectedAdmin.first_name} {selectedAdmin.surname}
												</h4>
												<p className="text-sm text-muted-foreground">
													{selectedAdmin.email}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
									<h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
										What happens when you delete this admin:
									</h4>
									<ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
										<li>• Immediate loss of system access</li>
										<li>• Account cannot be recovered</li>
										<li>• Any ongoing work may be affected</li>
									</ul>
								</div>
							</div>

							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={closeAdminModal}
									disabled={isLoading}
								>
									Cancel
								</Button>
								<Button
									onClick={handleAdminAction}
									disabled={isLoading}
									className="bg-red-600 hover:bg-red-700"
								>
									{isLoading ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Deleting...
										</>
									) : (
										<>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete Admin
										</>
									)}
								</Button>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
