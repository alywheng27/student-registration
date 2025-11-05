"use client"

import { ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DocumentUpload } from "@/components/student/document-upload"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth"

export default function DocumentsPage() {
	const { user, userRole, logout } = useAuth()
	const router = useRouter()

	const handleLogout = async () => {
		const result = await logout()
		if (result.success) {
			router.push("/")
		}
	}

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
						<h1 className="text-xl font-bold">Document Upload</h1>
					</div>
					<div className="flex items-center space-x-4">
						<span className="text-sm text-muted-foreground">
							{user?.email} ({userRole})
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
									<DialogDescription>
										Are you sure you want to log out? You will need to sign in
										again to access your account.
									</DialogDescription>
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
				<DocumentUpload />
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
