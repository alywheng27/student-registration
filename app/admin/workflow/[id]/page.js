"use client"

import { ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { WorkflowManager } from "@/components/admin/workflow-manager"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export default function WorkflowPage() {
	const { user, userRole, logout } = useAuth()
	const params = useParams()
	const applicationId = params.id

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-card">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Link href="/dashboard">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="h-4 w-4 mr-2" />
								{/* Back to Dashboard */}
							</Button>
						</Link>
						<h1 className="text-xl font-bold">Review Workflow</h1>
					</div>
					<div className="flex items-center space-x-4">
						<span className="text-sm text-muted-foreground">
							{user?.email} ({userRole})
						</span>
						<Button variant="outline" size="sm" onClick={logout}>
							<LogOut className="h-4 w-4 mr-2" />
							Logout
						</Button>
					</div>
				</div>
			</header>

			<main className="container mx-auto sm:px-4 lg:px-[10%] py-8">
				<WorkflowManager applicationId={applicationId} />
			</main>

			<footer className="border-t bg-card mt-8">
				<div className="container mx-auto px-4 py-4 text-center text-muted-foreground">
					© {new Date().getFullYear()} Student Registration System. All rights
					reserved.
				</div>
			</footer>
		</div>
	)
}
