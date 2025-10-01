import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Student Registration System
          </h1>
          <p className="text-muted-foreground mb-4">
            University Application Management Portal
          </p>
          <Link href="/auth/register">
            <Button variant="outline" size="sm">
              New Student? Register Here
            </Button>
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
