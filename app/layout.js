import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth"
import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
	title: "Student Registration System",
	description:
		"University student registration and application management system",
	generator: "v0.app",
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			{/* <body className="dark"> */}
			<body className="dark">
				<Suspense fallback={<div>Loading...</div>}>
					<AuthProvider>{children}</AuthProvider>
				</Suspense>
				<Toaster />
				<Analytics />
			</body>
		</html>
	)
}
