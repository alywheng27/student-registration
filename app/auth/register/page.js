import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-5 mt-5">
			<div className="w-full max-w-4xl">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Join Our University
					</h1>
					<p className="text-muted-foreground mb-4">
						Start your academic journey with us
					</p>
					<Link href="/">
						<Button variant="outline" size="sm">
							Already have an account? Sign In
						</Button>
					</Link>
				</div>
				<RegisterForm />
			</div>
		</div>
	);
}
