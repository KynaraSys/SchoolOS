"use client"
import type { User } from "@/lib/types/roles"
import PrincipalDashboard from "./dashboards/principal-dashboard"
import BursarDashboard from "./dashboards/bursar-dashboard"
import TeacherDashboard from "./dashboards/teacher-dashboard"
import ParentDashboard from "./dashboards/parent-dashboard"
import StudentDashboard from "./dashboards/student-dashboard"
import OwnerDashboard from "./dashboards/owner-dashboard"
import SuperAdminDashboard from "./dashboards/super-admin-dashboard"
import IctAdminDashboard from "./dashboards/ict-admin-dashboard"
import AcademicDirectorDashboard from "./dashboards/academic-director-dashboard"

export default function OverviewDashboard({ user }: { user?: User }) {
  // If no user is provided, don't render anything (prevents 401s on logout)
  if (!user) {
    return null
  }

  // Route to role-specific dashboard
  switch (user.role) {
    case "owner":
      return <OwnerDashboard user={user} />
    case "admin":
      return <SuperAdminDashboard user={user} />
    case "academic_director":
      return <AcademicDirectorDashboard user={user} />
    case "principal":
      return <PrincipalDashboard user={user} />
    case "bursar":
      return <BursarDashboard />
    case "teacher":
      return <TeacherDashboard user={user} />
    case "parent":
      return <ParentDashboard user={user} />
    case "student":
      return <StudentDashboard />
    case "ict_admin":
      return <IctAdminDashboard user={user} />
    default:
      return <TeacherDashboard user={user} />
  }

  // Import statements for role-specific dashboards
  // Function logic to route based on user role
}
