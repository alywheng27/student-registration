"use client"

import { useAuth } from "@/lib/auth"
import { StudentDashboard } from "@/components/student/student-dashboard"
// import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, userRole, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Student Registration System</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user && user.email} ({userRole})
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
                  <DialogDescription>Are you sure you want to log out? You will need to sign in again to access your account.</DialogDescription>
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
        {/* {user.role === "student" ? <StudentDashboard /> : <AdminDashboard />} */}
        <StudentDashboard />
      </main>
    </div>
  )
}
