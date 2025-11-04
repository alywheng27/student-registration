"use client"

import { format } from "date-fns"
import {
	Award,
	Calendar,
	CheckCircle,
	Church,
	Clock,
	FileText,
	Flag,
	Heart,
	Home,
	MapPin,
	Phone,
	Play,
	User,
	XCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
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
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth"
import {
	getAddress,
	getApplication,
	getDocuments,
	getProfile,
} from "@/lib/student_info"
import {
	createApplicationWorkflow,
	getOverallStatus,
	getWorkflowProgress,
	updateWorkflowStep,
} from "@/lib/workflow"

export function WorkflowManager({ applicationId }) {
	const { user, updateApplication } = useAuth()
	const [workflow, setWorkflow] = useState({})
	const [selectedStep, setSelectedStep] = useState(null)
	const [actionNotes, setActionNotes] = useState("")
	const [showActionDialog, setShowActionDialog] = useState(false)
	const [pendingAction, setPendingAction] = useState(null)
	const [profile, setProfile] = useState({})
	const [address, setAddress] = useState({})
	const [documents, setDocuments] = useState({})
	const [application, setApplication] = useState({})
	const [progress, setProgress] = useState()
	const [overallStatus, setOverallStatus] = useState()

	useEffect(() => {
		const fetchData = async () => {
			// Fetch profile and application data
			const profileResult = await getProfile(applicationId)
			setProfile(profileResult)

			const addressResult = await getAddress(applicationId)
			setAddress(addressResult)

			const documentResult = await getDocuments(applicationId)
			setDocuments(documentResult)

			const applicationResult = await getApplication(applicationId)
			setApplication(applicationResult)

			// Create and set workflow
			const workflowResult = await createApplicationWorkflow(applicationId)
			setWorkflow(workflowResult)

			// Fetch overall status and progress (depend on workflowResult)
			const overallStatusResult = await getOverallStatus(workflowResult)
			setOverallStatus(overallStatusResult)

			const progressResult = await getWorkflowProgress(workflowResult)
			setProgress(progressResult)
		}

		fetchData()
	}, [applicationId])

	const documentMap = [
		{
			id: "birth-certificate",
			name: "Birth Certificate",
			link: documents.birth_certificate,
			created_at: documents.created_at,
			description: "Verify the student's birth certificate",
			required: true,
		},
		{
			id: "good-moral",
			name: "Good Moral",
			link: documents.good_moral,
			created_at: documents.created_at,
			description: "Verify the student's good moral certificate",
			required: true,
		},
		{
			id: "grade-card",
			name: "Grade Card",
			link: documents.grade_card,
			created_at: documents.created_at,
			description: "Verify the student's grade card",
			required: true,
		},
	]

	const handleStepAction = (step, action) => {
		setSelectedStep(step)
		setPendingAction(action)
		setShowActionDialog(true)
	}

	const confirmStepAction = async () => {
		if (!selectedStep || !pendingAction || !user) return

		const newStatus = pendingAction === "approve" ? "completed" : "rejected"
		const updatedWorkflow = updateWorkflowStep(
			workflow,
			selectedStep.id,
			newStatus,
			user.id,
			actionNotes,
		)

		setWorkflow(updatedWorkflow)
		setShowActionDialog(false)
		setSelectedStep(null)
		setPendingAction(null)
		setActionNotes("")

		const status =
			newStatus === "rejected" ? 4 : selectedStep.id === "final-review" ? 3 : 2

		const statusName =
			status === 2 ? "in-progress" : status === 3 ? "approved" : "rejected"
		setOverallStatus(statusName)

		const progressResult = await getWorkflowProgress(updatedWorkflow)
		setProgress(progressResult)

		// In real app, this would update the database
		try {
			const result = await updateApplication({
				id: applicationId,
				status_id: status,
				step_id: updatedWorkflow.currentStep + 1,
				last_updated: updatedWorkflow.updatedAt,
				reviewed_by: user.id,
				note: updatedWorkflow.notes,
			})

			if (result.success) {
				toast.success(result.message || "Status updated successfully")
			} else {
				toast.error(result.error || "Updating status failed")
			}
		} catch (err) {
			toast.error(err.message || "Updating status failed")
		}
	}

	const startStep = async (step) => {
		if (!user) return

		const updatedWorkflow = updateWorkflowStep(
			workflow,
			step.id,
			"in-progress",
			user.id,
		)

		setWorkflow(updatedWorkflow)
	}

	const getStepIcon = (step) => {
		switch (step.status) {
			case "completed":
				return <CheckCircle className="h-5 w-5 text-green-500" />
			case "rejected":
				return <XCircle className="h-5 w-5 text-red-500" />
			case "in-progress":
				return <Play className="h-5 w-5 text-blue-500" />
			default:
				return <Clock className="h-5 w-5 text-gray-400" />
		}
	}

	const getStepBadge = (step) => {
		switch (step.status) {
			case "completed":
				return <Badge className="bg-green-500">Completed</Badge>
			case "rejected":
				return <Badge variant="destructive">Rejected</Badge>
			case "in-progress":
				return <Badge className="bg-blue-500">In Progress</Badge>
			default:
				return <Badge variant="secondary">Pending</Badge>
		}
	}

	const getStepSpecificIcon = (stepId) => {
		switch (stepId) {
			case "document-verification":
				return <FileText className="h-4 w-4" />
			case "eligibility-check":
				return <User className="h-4 w-4" />
			case "final-review":
				return <Award className="h-4 w-4" />
			default:
				return <Clock className="h-4 w-4" />
		}
	}

	// const getDocumentStatusBadge = (status) => {
	// 	switch (status) {
	// 		case "approved":
	// 			return (
	// 				<Badge variant="outline" className="text-green-600 border-green-600">
	// 					<CheckCircle className="h-3 w-3 mr-1" />
	// 					Approved
	// 				</Badge>
	// 			)
	// 		case "rejected":
	// 			return (
	// 				<Badge variant="outline" className="text-red-600 border-red-600">
	// 					<XCircle className="h-3 w-3 mr-1" />
	// 					Rejected
	// 				</Badge>
	// 			)
	// 		default:
	// 			return (
	// 				<Badge
	// 					variant="outline"
	// 					className="text-yellow-600 border-yellow-600"
	// 				>
	// 					<Clock className="h-3 w-3 mr-1" />
	// 					Pending Review
	// 				</Badge>
	// 			)
	// 	}
	// }

	return (
		<div className="space-y-6">
			{/* Workflow Header */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
								<Image
									src={profile?.photo_url || "/placeholder.svg"} // Replace with actual profile image URL
									alt="Profile Avatar"
									className="h-full w-full object-cover"
									width={200}
									height={200}
								/>
							</div>
							<div>
								<CardTitle className="text-xl">
									Application Review Workflow
								</CardTitle>
								<CardDescription>
									Student: {profile?.first_name} {profile?.surname} |
									Application ID: {applicationId}
								</CardDescription>
							</div>
						</div>
						{overallStatus && (
							<Badge
								className={
									overallStatus === "approved"
										? "bg-green-500"
										: overallStatus === "rejected"
											? "bg-red-500"
											: overallStatus === "in-progress"
												? "bg-blue-500"
												: "bg-gray-500"
								}
							>
								{overallStatus?.charAt(0).toUpperCase() +
									overallStatus?.slice(1)}
							</Badge>
						)}
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Overall Progress</span>
							<span className="text-sm text-muted-foreground">
								{Math.round(progress)}% Complete
							</span>
						</div>
						<Progress value={progress} className="w-full" />
						<p className="text-sm text-muted-foreground">
							Last updated: {application.last_updated}
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Workflow Steps */}
			<div className="space-y-4">
				{workflow?.steps?.map((step, index) => (
					<Card
						key={step.id}
						className={`${step.status === "in-progress" ? "ring-2 ring-blue-500" : ""}`}
					>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									{getStepIcon(step)}
									<div className="flex items-center space-x-2">
										{getStepSpecificIcon(step.id)}
										<div>
											<CardTitle className="text-lg">{step.name}</CardTitle>
											<CardDescription>{step.description}</CardDescription>
										</div>
									</div>
								</div>
								{getStepBadge(step)}
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{step.status === "in-progress" && (
									<div className="space-y-4 border-t pt-4">
										<h4 className="font-semibold text-sm flex items-center gap-2">
											<FileText className="h-4 w-4" />
											Review Information
										</h4>

										{/* Student Information */}
										{step?.id === "eligibility-check" && (
											<Card className="bg-muted/50">
												<CardHeader className="pb-3">
													<CardTitle className="text-sm flex items-center gap-2">
														<User className="h-4 w-4" />
														Student Information
													</CardTitle>
												</CardHeader>
												<CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
													<div>
														<span className="text-muted-foreground">Name</span>
														<p className="font-medium">
															{profile?.first_name}{" "}
															{profile?.middle_name?.charAt(0)}.{" "}
															{profile?.surname}
														</p>
													</div>
													<div>
														<span className="text-muted-foreground flex items-center gap-1">
															<Phone className="h-3 w-3" />
															Phone
														</span>
														<p className="font-medium">{profile?.phone}</p>
													</div>
													<div>
														<span className="text-muted-foreground flex items-center gap-1">
															<Calendar className="h-3 w-3" />
															Date of Birth
														</span>
														<p className="font-medium">
															{profile?.date_of_birth}
														</p>
													</div>
													<div>
														<span className="text-muted-foreground flex items-center gap-1">
															<MapPin className="h-3 w-3" />
															Address
														</span>
														<p className="font-medium">
															{address?.barangay}, {address?.municipality},{" "}
															{address?.province}
														</p>
													</div>
													<div>
														<span className="text-muted-foreground flex items-center gap-1">
															<Church className="h-3 w-3" />
															Religion
														</span>
														<p className="font-medium">{profile?.religion}</p>
													</div>
													<div>
														<span className="text-muted-foreground flex items-center gap-1">
															<Flag className="h-3 w-3" />
															Citizenship
														</span>
														<p className="font-medium">
															{profile?.citizenship}
														</p>
													</div>
													<div>
														<span className="text-muted-foreground flex items-center gap-1">
															<Home className="h-3 w-3" />
															Place of Birth
														</span>
														<p className="font-medium">
															{profile?.place_of_birth}
														</p>
													</div>
													<div>
														<span className="text-muted-foreground flex items-center gap-1">
															<User className="h-3 w-3" />
															Sex
														</span>
														<p className="font-medium">{profile?.Sex?.sex}</p>
													</div>
													<div>
														<span className="text-muted-foreground flex items-center gap-1">
															<Heart className="h-3 w-3" />
															Civil Status
														</span>
														<p className="font-medium">
															{profile?.Civil_Status?.civil_status}
														</p>
													</div>
												</CardContent>
											</Card>
										)}

										{/* Documents Section */}
										{step?.id === "document-verification" && (
											<Card className="bg-muted/50">
												<CardHeader className="pb-3">
													<CardTitle className="text-sm flex items-center gap-2">
														<FileText className="h-4 w-4" />
														Submitted Documents
													</CardTitle>
												</CardHeader>
												<CardContent className="space-y-2">
													{documentMap.map((doc) => (
														<div
															key={doc.id}
															className="flex items-center justify-between p-3 bg-background rounded-lg"
														>
															<div className="flex items-center gap-3">
																<FileText className="h-4 w-4 text-muted-foreground" />
																<div>
																	<p className="font-medium text-sm">
																		{doc.name}
																	</p>
																	<p className="text-xs text-muted-foreground">
																		Uploaded:{" "}
																		{format(
																			new Date(doc.created_at),
																			"MM/dd/yyyy",
																		)}
																	</p>
																</div>
															</div>
															<div className="flex items-center gap-2">
																{/* {getDocumentStatusBadge(doc.status)} */}
																<Link href={doc.link} target="_blank">
																	<Button size="sm" variant="outline">
																		View
																	</Button>
																</Link>
															</div>
														</div>
													))}
												</CardContent>
											</Card>
										)}

										{/* Application Details */}
										{step?.id === "eligibility-check" && (
											<Card className="bg-muted/50">
												<CardHeader className="pb-3">
													<CardTitle className="text-sm flex items-center gap-2">
														<Award className="h-4 w-4" />
														Application Details
													</CardTitle>
												</CardHeader>
												<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
													<div>
														<span className="text-muted-foreground">
															Submitted Date
														</span>
														<p className="font-medium">
															{format(
																new Date(profile?.created_at),
																"MM/dd/yyyy",
															)}
														</p>
													</div>
												</CardContent>
											</Card>
										)}
									</div>
								)}

								{step.completedAt && (
									<div className="text-sm text-muted-foreground">
										<p>Completed: {step.completedAt.toLocaleString()}</p>
										{step.completedBy && <p>By: Admin User</p>}
									</div>
								)}

								{step.notes && (
									<Alert>
										<AlertDescription>
											<strong>Notes:</strong> {step.notes}
										</AlertDescription>
									</Alert>
								)}

								{step.status === "pending" && index <= workflow.currentStep && (
									<div className="flex space-x-2">
										<Button size="sm" onClick={() => startStep(step)}>
											<Play className="h-4 w-4 mr-1" />
											Start Review
										</Button>
									</div>
								)}

								{step.status === "in-progress" && (
									<div className="flex space-x-2">
										<Button
											size="sm"
											className="bg-green-600 hover:bg-green-700"
											onClick={() => handleStepAction(step, "approve")}
										>
											<CheckCircle className="h-4 w-4 mr-1" />
											Approve Step
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() => handleStepAction(step, "reject")}
										>
											<XCircle className="h-4 w-4 mr-1" />
											Reject Step
										</Button>
									</div>
								)}

								{step.status === "rejected" && (
									<Alert variant="destructive">
										<XCircle className="h-4 w-4" />
										<AlertDescription>
											This step was rejected. The application cannot proceed
											until this is resolved.
										</AlertDescription>
									</Alert>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Action Confirmation Dialog */}
			<Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{pendingAction === "approve" ? "Approve" : "Reject"} Step:{" "}
							{selectedStep?.name}
						</DialogTitle>
						<DialogDescription>
							{pendingAction === "approve"
								? "This will mark the step as completed and move to the next step."
								: "This will reject the step and prevent the application from proceeding."}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							{pendingAction === "reject" && (
								<>
									<span className="text-sm font-medium mb-2 block">
										Notes{" "}
										{pendingAction === "reject" ? "(Required)" : "(Optional)"}
									</span>

									<Textarea
										placeholder={
											pendingAction === "approve"
												? "Add any notes about this approval..."
												: "Please explain why this step is being rejected..."
										}
										value={actionNotes}
										onChange={(e) => setActionNotes(e.target.value)}
										rows={3}
									/>
								</>
							)}
						</div>
						<div className="flex justify-end space-x-2">
							<Button
								variant="outline"
								onClick={() => setShowActionDialog(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={confirmStepAction}
								disabled={pendingAction === "reject" && !actionNotes.trim()}
								className={
									pendingAction === "approve"
										? "bg-green-600 hover:bg-green-700"
										: ""
								}
								variant={pendingAction === "reject" ? "destructive" : "default"}
							>
								Confirm {pendingAction === "approve" ? "Approval" : "Rejection"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
