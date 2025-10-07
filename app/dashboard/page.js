"use client"

import { useAuth } from "@/lib/auth"
import { StudentDashboard } from "@/components/student/student-dashboard"
// import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function DashboardPage() {
  const { user, userRole, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Student Registration System</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user && user.email} ({userRole})
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-[10%] py-8">
        {/* {user.role === "student" ? <StudentDashboard /> : <AdminDashboard />} */}
        <StudentDashboard />
      </main>
    </div>
  )
}
