"use client"

import { FileText, Upload, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth"
import { getApplication, getDocuments, getProfile } from "@/lib/student_info"

export function StudentDashboard() {
	const [profile, setProfile] = useState()
	const [application, setApplication] = useState()
	const [documents, setDocuments] = useState()
	const { user } = useAuth()

	const profileData = async () => {
		const data = await getProfile(user.id)
		setProfile(data)
	}

	const applicationData = async () => {
		const data = await getApplication(user.id)
		setApplication(data)
	}

	const documentData = async () => {
		const data = await getDocuments(user.id)
		setDocuments(data)
	}

	useEffect(() => {
		if (!user || !user.id) return // Wait until user and user.id are available

		profileData()
		applicationData()
		documentData()

		console.log("work")
	}, [user])

	const statusColorMap = useMemo(
		() => ({
			Pending: "bg-gray-300",
			"In Progress": "bg-blue-500 text-white",
			Approved: "bg-green-500 text-white",
			Rejected: "bg-red-500 text-white",
			default: "bg-yellow-500",
		}),
		[],
	)

	const getStatusColor = (status) => {
		return statusColorMap[status] ?? statusColorMap.default
	}

	const stepColorMap = useMemo(
		() => ({
			"Document Verification": "bg-blue-500 text-white",
			"Eligibility Check": "bg-yellow-500",
			default: "bg-green-500 text-white",
		}),
		[],
	)

	const getStepColor = (step) => {
		return stepColorMap[step] ?? stepColorMap.default
	}

	const requiredDocuments = ["Birth Certificate", "Good Moral", "Grade Card"]
	const uploadedDocuments = []
	const missingDocuments = []

	if (documents) {
		documents.birth_certificate !== null
			? uploadedDocuments.push("Birth Certificate")
			: missingDocuments.push("Birth Certificate")
		documents.good_moral !== null
			? uploadedDocuments.push("Good Moral")
			: missingDocuments.push("Good Moral")
		documents.grade_card !== null
			? uploadedDocuments.push("Grade Card")
			: missingDocuments.push("Grade Card")
	}

	const requiredSteps = 3
	let steps = 0

	if (application) {
		steps =
			application.Steps.step === "Document Verification"
				? 1
				: application.Steps.step === "Eligibility Check"
					? 2
					: 3
	}

	const completionPercentage = (steps / requiredSteps) * 100

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Welcome, {profile?.first_name} {profile?.surname}
					</h1>
					<p className="text-muted-foreground">Email: {user?.email}</p>
				</div>
				<Badge className={getStatusColor(application?.Status?.status)}>
					{application?.Status?.status}
				</Badge>
			</div>

			{/* Application Status Card */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Application Status
							</CardTitle>
							<CardDescription>
								Track your application progress and requirements
							</CardDescription>
						</div>
						<Badge className={getStepColor(application?.Steps?.step)}>
							{application?.Steps?.step}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Application Progress</span>
						<span className="text-sm text-muted-foreground">
							{Math.round(completionPercentage)}% Complete
						</span>
					</div>
					<Progress value={completionPercentage} className="w-full" />

					{application &&
						application.Status.status === "Incomplete" &&
						completionPercentage !== 100 && (
							<div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
								<h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
									Missing Documents
								</h4>
								<ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
									{missingDocuments.map((doc) => (
										<li key={doc}>• {doc}</li>
									))}
								</ul>
							</div>
						)}
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Link href="/student/document">
					<Card className="cursor-pointer hover:shadow-md transition-shadow">
						<CardContent className="flex items-center space-x-4 p-6">
							<div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
								<Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<h3 className="font-medium">Upload Documents</h3>
								<p className="text-sm text-muted-foreground">
									Add required files
								</p>
							</div>
						</CardContent>
					</Card>
				</Link>

				<Link href="/student/profile">
					<Card className="cursor-pointer hover:shadow-md transition-shadow">
						<CardContent className="flex items-center space-x-4 p-6">
							<div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
								<User className="h-6 w-6 text-green-600 dark:text-green-400" />
							</div>
							<div>
								<h3 className="font-medium">Update Profile</h3>
								<p className="text-sm text-muted-foreground">
									Edit personal info
								</p>
							</div>
						</CardContent>
					</Card>
				</Link>
			</div>

			{/* Document Requirements */}
			<Card>
				<CardHeader>
					<CardTitle>Required Documents</CardTitle>
					<CardDescription>
						Please upload all required documents to complete your application
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{requiredDocuments.map((doc) => {
							const isUploaded = uploadedDocuments.find((uDoc) => doc === uDoc)
							return (
								<div
									key={doc}
									className="flex items-center justify-between p-3 border rounded-lg"
								>
									<div className="flex items-center space-x-3">
										<div
											className={`w-2 h-2 rounded-full ${isUploaded ? "bg-green-500" : "bg-gray-300"}`}
										/>
										<span className="font-medium">{doc}</span>
									</div>
									<Badge variant={isUploaded ? "default" : "secondary"}>
										{isUploaded ? "Uploaded" : "Required"}
									</Badge>
								</div>
							)
						})}
					</div>
					<Link href="/student/document">
						<Button className="w-full mt-4 flex items-center gap-2" size="lg">
							<Upload className="h-4 w-4" />
							Upload Documents
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	)
}
