"use client"

import { useRouter } from "next/navigation"
import { useId, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"

export function LoginForm() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const { login } = useAuth()
	const router = useRouter()

	const emailId = useId()
	const passwordId = useId()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		const result = await login(email, password)

		if (result.success) {
			router.push("/dashboard")
		} else {
			setError(result.error || "Login failed")
		}

		setLoading(false)
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl font-bold">Sign In</CardTitle>
				<CardDescription>
					Enter your credentials to access your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor={emailId}>Email</Label>
						<Input
							id={emailId}
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor={passwordId}>Password</Label>
						<Input
							id={passwordId}
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							required
						/>
					</div>

					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Signing in..." : "Sign In"}
					</Button>
				</form>

				<div className="mt-4 text-center text-sm text-muted-foreground">
					<p>Demo credentials:</p>
					<p>Admin: admin@university.edu / password</p>
					<p>Student: student@example.com / password</p>
				</div>
			</CardContent>
		</Card>
	)
}
