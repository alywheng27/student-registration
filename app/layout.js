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
				<Toaster
					position="bottom-right"
					toastOptions={{
						unstyled: true,
						classNames: {
							toast:
								"flex align-items-center border rounded-lg space-x-3 px-5 py-3 text-sm",
							error: "border-red-500 text-red-700 bg-red-100",
							success: "border-green-500 text-green-700 bg-green-100",
							info: "border-blue-500 text-blue-700 bg-blue-100",
						},
					}}
				/>
				<Analytics />
			</body>
		</html>
	)
}
