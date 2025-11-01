import { getApplication } from "@/lib/student_info"

export const createApplicationWorkflow = async (applicationId) => {
	const application = await getApplication(applicationId)

	const step =
		application.Steps.step === "Document Verification"
			? 0
			: application.Steps.step === "Eligibility Check"
				? 1
				: 2

	return {
		applicationId,
		currentStep: step,
		currentStatus: application.Status.status,
		createdAt: application.submitted_date,
		updatedAt: application.last_updated,
		steps: [
			{
				id: "document-verification",
				name: "Document Verification",
				description: "Verify all required documents are uploaded and valid",
				status: step === 0 && application.Status.status === "Rejected" ? "rejected" : step === 0 ? "pending" : "completed",
				notes: step === 0 && application.Status.status === "Rejected" ? application.note : "",
			},
			{
				id: "eligibility-check",
				name: "Eligibility Check",
				description: "Check if student meets admission requirements",
				status: step === 1 && application.Status.status === "Rejected" ? "rejected" : step === 0 || step === 1 ? "pending" : "completed",
				notes: step === 1 && application.Status.status === "Rejected" ? application.note : "",
			},
			{
				id: "final-review",
				name: "Final Review",
				description: "Final approval or rejection decision",
				status: step === 2 && application.Status.status === "Rejected" ? "rejected" : application.Status.status === "Approved" ? "completed" : "pending",
				notes: step === 2 && application.Status.status === "Rejected" ? application.note : "",
			},
		],
	}
}

export const updateWorkflowStep = (
	workflow,
	stepId,
	status,
	adminId,
	notes,
) => {
	const stepIndex = workflow.steps.findIndex((step) => step.id === stepId)
	if (stepIndex === -1) return workflow

	const updatedSteps = [...workflow.steps]
	updatedSteps[stepIndex] = {
		...updatedSteps[stepIndex],
		status,
		completedAt: status === "completed" ? new Date() : undefined,
		completedBy: status === "completed" ? adminId : undefined,
		notes,
	}

	// Update current step if this step is completed
	let currentStep = workflow.currentStep
	if (status === "completed" && stepIndex === currentStep) {
		currentStep = Math.min(currentStep + 1, workflow.steps.length - 1)
	}

	return {
		...workflow,
		steps: updatedSteps,
		currentStep,
		updatedAt: new Date().toISOString().split("T")[0],
		notes,
	}
}

export const getWorkflowProgress = async (workflow) => {
	const completedSteps = workflow?.steps?.filter(
		(step) => step.status === "completed",
	)?.length

	return (completedSteps / workflow?.steps?.length) * 100
}

export const getOverallStatus = async (workflow) => {
	const hasRejected = workflow?.currentStatus === "Rejected"
	if (hasRejected) return "rejected"

	const allCompleted = workflow?.currentStatus === "Approved"
	if (allCompleted) return "approved"

	const hasInProgress = workflow?.currentStatus === "In Progress"
	if (hasInProgress) return "in-progress"

	return "pending"

	// const hasRejected = workflow?.steps?.some(
	// 	(step) => step?.status === "rejected",
	// )
	// if (hasRejected) return "rejected"

	// const allCompleted = workflow?.steps?.every(
	// 	(step) => step?.status === "completed",
	// )
	// if (allCompleted) return "approved"

	// const hasInProgress = workflow?.steps?.some(
	// 	(step) => step.status === "in-progress",
	// )
	// if (hasInProgress) return "in-progress"

	// return "pending"
}
