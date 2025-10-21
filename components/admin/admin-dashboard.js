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
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
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
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth"
import {
	getAddressWithoutId,
	getApplicationWithoutId,
	getDocumentsWithoutId,
	getProfileWithoutId,
	getUserWithoutId,
} from "@/lib/student_info"

const mockApplications = [
	{
		id: "1",
		studentName: "John Doe",
		email: "john@example.com",
		phone: "+1 (555) 123-4567",
		address: "123 Main St, Springfield, IL 62701",
		studentId: "STU001",
		status: "pending",
		submittedAt: "2024-01-15",
		documents: ["ID Document", "Transcript"],
		missingDocuments: ["Birth Certificate"],
		detailedDocuments: [
			{
				name: "Government ID",
				type: "id",
				status: "pending",
				uploadedAt: "2024-01-15",
			},
			{
				name: "Academic Transcript",
				type: "transcript",
				status: "pending",
				uploadedAt: "2024-01-15",
			},
		],
	},
	{
		id: "2",
		studentName: "Jane Smith",
		email: "jane@example.com",
		phone: "+1 (555) 234-5678",
		address: "456 Oak Ave, Springfield, IL 62702",
		studentId: "STU002",
		status: "incomplete",
		submittedAt: "2024-01-14",
		documents: ["ID Document"],
		missingDocuments: ["Transcript", "Birth Certificate"],
		detailedDocuments: [
			{
				name: "Government ID",
				type: "id",
				status: "approved",
				uploadedAt: "2024-01-14",
			},
		],
	},
	{
		id: "3",
		studentName: "Mike Johnson",
		email: "mike@example.com",
		phone: "+1 (555) 345-6789",
		address: "789 Pine St, Springfield, IL 62703",
		studentId: "STU003",
		status: "approved",
		submittedAt: "2024-01-13",
		documents: ["ID Document", "Transcript", "Birth Certificate"],
		missingDocuments: [],
		detailedDocuments: [
			{
				name: "Government ID",
				type: "id",
				status: "approved",
				uploadedAt: "2024-01-13",
			},
			{
				name: "Academic Transcript",
				type: "transcript",
				status: "approved",
				uploadedAt: "2024-01-13",
			},
			{
				name: "Birth Certificate",
				type: "birth_certificate",
				status: "approved",
				uploadedAt: "2024-01-13",
			},
		],
	},
	{
		id: "4",
		studentName: "Sarah Wilson",
		email: "sarah@example.com",
		phone: "+1 (555) 456-7890",
		address: "321 Elm St, Springfield, IL 62704",
		studentId: "STU004",
		status: "rejected",
		submittedAt: "2024-01-12",
		documents: ["ID Document", "Transcript"],
		missingDocuments: [],
		detailedDocuments: [
			{
				name: "Government ID",
				type: "id",
				status: "rejected",
				uploadedAt: "2024-01-12",
			},
			{
				name: "Academic Transcript",
				type: "transcript",
				status: "rejected",
				uploadedAt: "2024-01-12",
			},
		],
	},
]

const mockAdminUsers = [
	{
		id: "admin1",
		name: "Admin User",
		email: "admin@university.edu",
		role: "admin",
		permissions: [
			"manage_applications",
			"manage_users",
			"view_reports",
			"export_data",
		],
		createdAt: new Date("2024-01-01"),
	},
	{
		id: "admin2",
		name: "John Smith",
		email: "john.smith@university.edu",
		role: "admin",
		permissions: ["manage_applications", "view_reports"],
		createdAt: new Date("2024-01-15"),
	},
	{
		id: "admin3",
		name: "Sarah Johnson",
		email: "sarah.johnson@university.edu",
		role: "admin",
		permissions: ["manage_applications", "manage_users"],
		createdAt: new Date("2024-02-01"),
	},
]

const availablePermissions = [
	{
		id: "manage_applications",
		label: "Manage Applications",
		description: "Review and process student applications",
	},
	{
		id: "manage_users",
		label: "Manage Users",
		description: "Add, edit, and remove admin users",
	},
	{
		id: "view_reports",
		label: "View Reports",
		description: "Access analytics and generate reports",
	},
	{
		id: "export_data",
		label: "Export Data",
		description: "Export application and user data",
	},
	{
		id: "system_settings",
		label: "System Settings",
		description: "Configure system-wide settings",
	},
]

export function AdminDashboard() {
	const { user, userRole } = useAuth()
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")

	const [selectedApplication, setSelectedApplication] = useState(null)
	const [modalType, setModalType] = useState(null)
	const [reviewNotes, setReviewNotes] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const [adminModalType, setAdminModalType] = useState(null)
	const [selectedAdmin, setSelectedAdmin] = useState(null)
	const [adminFormData, setAdminFormData] = useState({
		name: "",
		email: "",
		permissions: [],
	})
	const [adminUsers, setAdminUsers] = useState(mockAdminUsers)
	const [formErrors, setFormErrors] = useState(null)
	const [profiles, setProfiles] = useState([])
	const [addresses, setAddresses] = useState([])
	const [applications, setApplications] = useState([])
	const [documents, setDocuments] = useState([])
	const [users, setUsers] = useState([])
	const [profileApplication, setProfileApplication] = useState([])

	const DOCUMENT_COUNT = 3

	const profileData = useCallback(async () => {
		const data = await getProfileWithoutId()
		setProfiles(data)
	}, [])

	const addressData = useCallback(async () => {
		const data = await getAddressWithoutId()
		setAddresses(data)
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
		console.log(data)
		setUsers(data)
	}, [])

	useEffect(() => {
		profileData()
		addressData()
		applicationData()
		documentData()
		userData()
	}, [profileData, addressData, applicationData, documentData, userData])

	const profileApplicationData = useCallback(() => {
		if (profiles.length > 0 && applications.length > 0) {
			const combinedData = profiles.map((p) => {
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
					progress:
						app.Steps.step === "Document Verification"
							? Math.round((1 / DOCUMENT_COUNT) * 100)
							: app.Steps.step === "Eligibility Check"
								? Math.round((2 / DOCUMENT_COUNT) * 100)
								: Math.round((3 / DOCUMENT_COUNT) * 100),
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
	}, [profiles, applications, documents, users])

	useEffect(() => {
		profileApplicationData()
	}, [profileApplicationData])

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
			case "approved":
				return <Badge className="bg-green-500">Approved</Badge>
			case "rejected":
				return <Badge variant="destructive">Rejected</Badge>
			case "incomplete":
				return <Badge className="bg-yellow-500">Incomplete</Badge>
			default:
				return <Badge className="bg-blue-500">Pending</Badge>
		}
	}

	const exportData = () => {
		// Mock export functionality
		const csvContent = [
			[
				"Name",
				"Email",
				"Student ID",
				"Status",
				"Submitted Date",
				"Documents",
				"Missing Documents",
			],
			...filteredApplications.map((app) => [
				app.studentName,
				app.email,
				app.studentId,
				app.status,
				app.submittedAt,
				app.documents.join("; "),
				app.missingDocuments.join("; "),
			]),
		]
			.map((row) => row.join(","))
			.join("\n")

		const blob = new Blob([csvContent], { type: "text/csv" })
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
		setReviewNotes("")
	}

	const closeModal = () => {
		setSelectedApplication(null)
		setModalType(null)
		setReviewNotes("")
		setIsLoading(false)
	}

	const handleAction = async () => {
		if (!selectedApplication || !modalType) return

		setIsLoading(true)

		// Mock API call - simulate processing time
		await new Promise((resolve) => setTimeout(resolve, 1500))

		console.log("[v0] Processing action:", {
			applicationId: selectedApplication.id,
			action: modalType,
			notes: reviewNotes,
		})

		// Mock success feedback
		alert(
			`Application ${modalType === "approve" ? "approved" : modalType === "reject" ? "rejected" : modalType === "incomplete" ? "marked as incomplete" : "processed"} successfully!`,
		)

		closeModal()
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

	const getDocumentStatusBadge = (status) => {
		switch (status) {
			case 3:
				return <Badge className="bg-green-500">Approved</Badge>
			case 4:
				return <Badge variant="destructive">Rejected</Badge>
			case 1:
				return <Badge variant="secondary">Pending</Badge>
			case 2:
				return <Badge className="bg-blue-500">In Progress</Badge>
			default:
				return <Badge className="bg-yellow-500">Incomplete</Badge>
		}
	}

	const openAdminModal = (type, adminUser) => {
		setAdminModalType(type)
		setSelectedAdmin(adminUser || null)
		setFormErrors({})

		if (type === "add") {
			setAdminFormData({ name: "", email: "", permissions: [] })
		} else if (type === "edit" && adminUser) {
			setAdminFormData({
				name: adminUser.name,
				email: adminUser.email,
				permissions: [...adminUser.permissions],
			})
		}
	}

	const closeAdminModal = () => {
		setAdminModalType(null)
		setSelectedAdmin(null)
		setAdminFormData({ name: "", email: "", permissions: [] })
		setFormErrors({})
		setIsLoading(false)
	}

	const validateAdminForm = () => {
		const errors = {}

		if (!adminFormData.name.trim()) {
			errors.name = "Name is required"
		}

		if (!adminFormData.email.trim()) {
			errors.email = "Email is required"
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminFormData.email)) {
			errors.email = "Please enter a valid email address"
		}

		if (adminFormData.permissions.length === 0) {
			errors.permissions = "At least one permission must be selected"
		}

		// Check for duplicate email (except when editing the same user)
		const existingAdmin = adminUsers.find(
			(admin) =>
				admin.email === adminFormData.email && admin.id !== selectedAdmin?.id,
		)
		if (existingAdmin) {
			errors.email = "An admin with this email already exists"
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

			setAdminUsers((prev) =>
				prev.filter((admin) => admin.id !== selectedAdmin.id),
			)
			alert(`Admin "${selectedAdmin.name}" has been deleted successfully!`)
			closeAdminModal()
			return
		}

		if (!validateAdminForm()) return

		setIsLoading(true)
		// Mock API call
		await new Promise((resolve) => setTimeout(resolve, 1500))

		if (adminModalType === "add") {
			const newAdmin = {
				id: `admin${Date.now()}`,
				...adminFormData,
				role: "admin",
				createdAt: new Date(),
			}
			setAdminUsers((prev) => [...prev, newAdmin])
			alert(`Admin "${adminFormData.name}" has been added successfully!`)
		} else if (adminModalType === "edit") {
			setAdminUsers((prev) =>
				prev.map((admin) =>
					admin.id === selectedAdmin.id
						? { ...admin, ...adminFormData }
						: admin,
				),
			)
			alert(`Admin "${adminFormData.name}" has been updated successfully!`)
		}

		closeAdminModal()
	}

	const handlePermissionChange = (permissionId, checked) => {
		setAdminFormData((prev) => ({
			...prev,
			permissions: checked
				? [...prev.permissions, permissionId]
				: prev.permissions.filter((p) => p !== permissionId),
		}))
	}

	const getPermissionBadge = (permission) => {
		const permissionConfig = availablePermissions.find(
			(p) => p.id === permission,
		)
		return permissionConfig ? permissionConfig.label : permission
	}

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div className="flex items-center justify-between">
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
					<TabsTrigger value="reports">Reports</TabsTrigger>
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
												{getStatusBadge(application.status)}
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
											<Link href={`/admin/workflow/${application.id}`}>
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

				{/* <TabsContent value="users" className="space-y-4">
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
									Admin Users ({adminUsers.length})
								</h3>
								<Button onClick={() => openAdminModal("add")}>
									<UserPlus className="h-4 w-4 mr-2" />
									Add Admin
								</Button>
							</div>

							<div className="space-y-3">
								{adminUsers.map((adminUser) => (
									<div
										key={adminUser.id}
										className="flex items-center justify-between p-4 border rounded-lg"
									>
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<Shield className="h-5 w-5 text-blue-500" />
												<div>
													<h4 className="font-medium">{adminUser.name}</h4>
													<p className="text-sm text-muted-foreground">
														{adminUser.email}
													</p>
													<p className="text-xs text-muted-foreground">
														Created: {adminUser.createdAt.toLocaleDateString()}
													</p>
												</div>
											</div>
											<div className="flex flex-wrap gap-1 mt-2">
												{adminUser.permissions.map((permission) => (
													<Badge
														key={permission}
														variant="secondary"
														className="text-xs"
													>
														{getPermissionBadge(permission)}
													</Badge>
												))}
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
				</TabsContent> */}

				{/* <TabsContent value="reports" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Reports & Analytics</CardTitle>
							<CardDescription>
								Generate and export application reports
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Card>
									<CardContent className="p-4">
										<h4 className="font-semibold mb-2">
											Application Status Report
										</h4>
										<p className="text-sm text-muted-foreground mb-4">
											Export detailed report of all applications by status
										</p>
										<Button onClick={exportData} className="w-full">
											<Download className="h-4 w-4 mr-2" />
											Export CSV
										</Button>
									</CardContent>
								</Card>

								<Card>
									<CardContent className="p-4">
										<h4 className="font-semibold mb-2">Monthly Summary</h4>
										<p className="text-sm text-muted-foreground mb-4">
											Generate monthly application statistics and trends
										</p>
										<Button className="w-full bg-transparent" variant="outline">
											<Download className="h-4 w-4 mr-2" />
											Generate Report
										</Button>
									</CardContent>
								</Card>
							</div>
						</CardContent>
					</Card>
				</TabsContent> */}
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
															(d) => d !== "",
														)?.length
													}{" "}
													missing
												</span>
											</div>
										</CardContent>
									</Card>
								</div>

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
																{getDocumentStatusBadge(doc.status)}
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

					{/* {(modalType === "approve" ||
						modalType === "reject" ||
						modalType === "incomplete") &&
						selectedApplication && (
							<>
								<DialogHeader>
									<DialogTitle className="flex items-center gap-2">
										{modalType === "approve" && (
											<CheckCircle className="h-5 w-5 text-green-500" />
										)}
										{modalType === "reject" && (
											<XCircle className="h-5 w-5 text-red-500" />
										)}
										{modalType === "incomplete" && (
											<AlertTriangle className="h-5 w-5 text-yellow-500" />
										)}
										{modalType === "approve" && "Approve Application"}
										{modalType === "reject" && "Reject Application"}
										{modalType === "incomplete" && "Mark as Incomplete"}
									</DialogTitle>
									<DialogDescription>
										{modalType === "approve" &&
											"Confirm approval of this student application. The student will be notified via email."}
										{modalType === "reject" &&
											"Confirm rejection of this student application. Please provide a reason for the student."}
										{modalType === "incomplete" &&
											"Mark this application as incomplete. The student will be notified of missing requirements."}
									</DialogDescription>
								</DialogHeader>

								<div className="space-y-4">
									<Card>
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div>
													<h4 className="font-semibold">
														{selectedApplication.studentName}
													</h4>
													<p className="text-sm text-muted-foreground">
														{selectedApplication.email}
													</p>
													<p className="text-xs text-muted-foreground">
														ID: {selectedApplication.studentId}
													</p>
												</div>
												{getStatusBadge(selectedApplication.status)}
											</div>
										</CardContent>
									</Card>

									<div>
										<label className="text-sm font-medium mb-2 block">
											{modalType === "approve" && "Approval Notes (Optional)"}
											{modalType === "reject" &&
												"Reason for Rejection (Required)"}
											{modalType === "incomplete" &&
												"Missing Requirements (Required)"}
										</label>
										<Textarea
											placeholder={
												modalType === "approve"
													? "Add any congratulatory message or next steps..."
													: modalType === "reject"
														? "Please explain why this application is being rejected..."
														: "Specify what documents or information are missing..."
											}
											value={reviewNotes}
											onChange={(e) => setReviewNotes(e.target.value)}
											rows={4}
											className={
												modalType !== "approve" && !reviewNotes
													? "border-red-300"
													: ""
											}
										/>
										{modalType !== "approve" && !reviewNotes && (
											<p className="text-sm text-red-500 mt-1">
												This field is required
											</p>
										)}
									</div>

									{modalType === "incomplete" &&
										selectedApplication.missingDocuments.length > 0 && (
											<Alert>
												<AlertTriangle className="h-4 w-4" />
												<AlertDescription>
													<strong>Currently Missing:</strong>{" "}
													{selectedApplication.missingDocuments.join(", ")}
												</AlertDescription>
											</Alert>
										)}
								</div>

								<div className="flex justify-end gap-2">
									<Button
										variant="outline"
										onClick={closeModal}
										disabled={isLoading}
									>
										Cancel
									</Button>
									<Button
										onClick={handleAction}
										disabled={
											isLoading || (modalType !== "approve" && !reviewNotes)
										}
										className={
											modalType === "approve"
												? "bg-green-600 hover:bg-green-700"
												: modalType === "reject"
													? "bg-red-600 hover:bg-red-700"
													: "bg-yellow-600 hover:bg-yellow-700"
										}
									>
										{isLoading ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
												Processing...
											</>
										) : (
											<>
												{modalType === "approve" && (
													<CheckCircle className="h-4 w-4 mr-2" />
												)}
												{modalType === "reject" && (
													<XCircle className="h-4 w-4 mr-2" />
												)}
												{modalType === "incomplete" && (
													<AlertTriangle className="h-4 w-4 mr-2" />
												)}
												Confirm{" "}
												{modalType === "approve"
													? "Approval"
													: modalType === "reject"
														? "Rejection"
														: "Incomplete"}
											</>
										)}
									</Button>
								</div>
							</>
						)} */}
				</DialogContent>
			</Dialog>

			{/* <Dialog open={adminModalType !== null} onOpenChange={closeAdminModal}>
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
										<Label htmlFor="admin-name">Full Name *</Label>
										<Input
											id="admin-name"
											placeholder="Enter admin's full name"
											value={adminFormData.name}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													name: e.target.value,
												}))
											}
											className={formErrors.name ? "border-red-300" : ""}
										/>
										{formErrors.name && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.name}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor="admin-email">Email Address *</Label>
										<Input
											id="admin-email"
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
								</div>

								<div>
									<Label className="text-base font-medium">Permissions *</Label>
									<p className="text-sm text-muted-foreground mb-3">
										Select the permissions this admin should have access to.
									</p>
									<div className="space-y-3">
										{availablePermissions.map((permission) => (
											<div
												key={permission.id}
												className="flex items-start space-x-3 p-3 border rounded-lg"
											>
												<Checkbox
													id={permission.id}
													checked={adminFormData.permissions.includes(
														permission.id,
													)}
													onCheckedChange={(checked) =>
														handlePermissionChange(permission.id, checked)
													}
												/>
												<div className="flex-1">
													<Label
														htmlFor={permission.id}
														className="font-medium cursor-pointer"
													>
														{permission.label}
													</Label>
													<p className="text-sm text-muted-foreground">
														{permission.description}
													</p>
												</div>
											</div>
										))}
									</div>
									{formErrors.permissions && (
										<p className="text-sm text-red-500 mt-1">
											{formErrors.permissions}
										</p>
									)}
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
									Edit Admin - {selectedAdmin.name}
								</DialogTitle>
								<DialogDescription>
									Update admin account information and permissions.
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="edit-admin-name">Full Name *</Label>
										<Input
											id="edit-admin-name"
											placeholder="Enter admin's full name"
											value={adminFormData.name}
											onChange={(e) =>
												setAdminFormData((prev) => ({
													...prev,
													name: e.target.value,
												}))
											}
											className={formErrors.name ? "border-red-300" : ""}
										/>
										{formErrors.name && (
											<p className="text-sm text-red-500 mt-1">
												{formErrors.name}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor="edit-admin-email">Email Address *</Label>
										<Input
											id="edit-admin-email"
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
								</div>

								<div>
									<Label className="text-base font-medium">Permissions *</Label>
									<p className="text-sm text-muted-foreground mb-3">
										Update the permissions for this admin account.
									</p>
									<div className="space-y-3">
										{availablePermissions.map((permission) => (
											<div
												key={permission.id}
												className="flex items-start space-x-3 p-3 border rounded-lg"
											>
												<Checkbox
													id={`edit-${permission.id}`}
													checked={adminFormData.permissions.includes(
														permission.id,
													)}
													onCheckedChange={(checked) =>
														handlePermissionChange(permission.id, checked)
													}
												/>
												<div className="flex-1">
													<Label
														htmlFor={`edit-${permission.id}`}
														className="font-medium cursor-pointer"
													>
														{permission.label}
													</Label>
													<p className="text-sm text-muted-foreground">
														{permission.description}
													</p>
												</div>
											</div>
										))}
									</div>
									{formErrors.permissions && (
										<p className="text-sm text-red-500 mt-1">
											{formErrors.permissions}
										</p>
									)}
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
												<h4 className="font-semibold">{selectedAdmin.name}</h4>
												<p className="text-sm text-muted-foreground">
													{selectedAdmin.email}
												</p>
												<div className="flex flex-wrap gap-1 mt-2">
													{selectedAdmin.permissions.map((permission) => (
														<Badge
															key={permission}
															variant="secondary"
															className="text-xs"
														>
															{getPermissionBadge(permission)}
														</Badge>
													))}
												</div>
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
										<li>• All permissions will be revoked</li>
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
			</Dialog> */}
		</div>
	)
}
