import type { UserRole } from "@/lib/types/roles"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  GraduationCap,
  DollarSign,
  Calendar,
  MessageSquare,
  Settings,
  Building2,
  TrendingUp,
  Workflow,
  UserCog,
  Briefcase,
  BarChart3,
  ShieldAlert,
  Clock,
  BookOpen,
  Baby,
  FileBarChart,
  type LucideIcon,
} from "lucide-react"

export interface NavigationItem {
  name: string
  icon: LucideIcon
  href: string
  roles: UserRole[]
  requires?: {
    classTeacher?: boolean
  }
  children?: NavigationItem[]
}

export const navigationItems: NavigationItem[] = [

  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    roles: ["admin", "owner", "principal", "academic_director", "bursar", "teacher", "parent", "student", "ict_admin"],
  },
  {
    name: "My Subjects",
    icon: Users,
    href: "/classes",
    roles: ["teacher"],
  },
  {
    name: "My Class",
    icon: Building2,
    href: "/teacher/my-class",
    roles: ["teacher"],
    requires: { classTeacher: true },
  },
  {
    name: "Students",
    icon: Users,
    href: "/students",
    roles: ["admin", "owner", "principal", "academic_director", "bursar", "ict_admin"],
    children: [
      {
        name: "New Admission",
        icon: UserPlus,
        href: "/admissions/new",
        roles: ["admin", "owner", "principal", "academic_director", "ict_admin"],
      },
    ]
  },
  {
    name: "Parents/Guardians",
    icon: Baby, // Using Baby to represent child/parent relationship
    href: "/guardians",
    roles: ["admin", "owner", "principal", "academic_director", "ict_admin"],
  },
  {
    name: "My Children",
    icon: Baby,
    href: "/my-children",
    roles: ["parent"],
  },
  {
    name: "Assignments",
    icon: BookOpen,
    href: "/assignments",
    roles: ["teacher", "student"],
  },
  {
    name: "Attendance",
    icon: Calendar,
    href: "/attendance",
    roles: ["admin", "owner", "principal", "academic_director", "teacher", "ict_admin", "parent"],
  },
  {
    name: "Lesson Plans",
    icon: Workflow,
    href: "/planning",
    roles: ["teacher", "academic_director"],
  },
  {
    name: "Materials",
    icon: Briefcase, // Using Briefcase as a placeholder for Materials/Resources if Library isn't available
    href: "/materials",
    roles: ["teacher", "student"],
  },
  {
    name: "Timetable",
    icon: Clock,
    href: "/timetable",
    roles: ["teacher", "student"],
  },
  {
    name: "Academic",
    icon: GraduationCap,
    href: "/academic",
    roles: ["admin", "owner", "principal", "academic_director", "ict_admin", "parent", "teacher"],
  },
  {
    name: "CBC Assessments",
    icon: FileBarChart,
    href: "/teacher/assessments",
    roles: ["teacher"],
  },
  {
    name: "Discipline",
    icon: ShieldAlert,
    href: "/discipline",
    roles: ["admin", "owner", "principal", "academic_director", "ict_admin", "teacher"],

  },
  {
    name: "Finance",
    icon: DollarSign,
    href: "/finance",
    roles: ["admin", "owner", "principal", "bursar", "ict_admin", "parent"],
  },
  {
    name: "Workflows",
    icon: Workflow,
    href: "/workflows",
    roles: ["admin", "owner", "principal", "academic_director", "bursar", "ict_admin"],
  },
  {
    name: "Communication",
    icon: MessageSquare,
    href: "/communication",
    roles: ["admin", "owner", "principal", "academic_director", "bursar", "teacher", "ict_admin", "parent"],
  },
  {
    name: "Staff & HR",
    icon: UserCog,
    href: "/staff",
    roles: ["admin", "owner", "principal", "ict_admin"],
    children: [
      {
        name: "Onboard Staff",
        icon: UserPlus,
        href: "/admin/staff/create",
        roles: ["admin", "owner", "principal", "ict_admin"],
      },
      {
        name: "Staff Directory",
        icon: Users,
        href: "/staff/directory",
        roles: ["admin", "owner", "principal", "ict_admin"],
      },
      {
        name: "Payroll",
        icon: DollarSign,
        href: "/staff/payroll",
        roles: ["admin", "owner", "principal", "bursar", "ict_admin"],
      },
      {
        name: "Leave Requests",
        icon: Calendar,
        href: "/staff/leave",
        roles: ["admin", "owner", "principal", "ict_admin"],
      },
      {
        name: "Appraisals",
        icon: BarChart3,
        href: "/staff/appraisals",
        roles: ["admin", "owner", "principal", "ict_admin"],
      },
      {
        name: "Workload",
        icon: Clock,
        href: "/staff/workload",
        roles: ["admin", "owner", "principal", "academic_director", "ict_admin"],
      },
      {
        name: "Recruitment",
        icon: Briefcase,
        href: "/staff/recruitment",
        roles: ["admin", "owner", "principal", "ict_admin"],
      },
    ],
  },
  {
    name: "Operations",
    icon: Briefcase,
    href: "/operations",
    roles: ["admin", "owner", "principal", "ict_admin"],
  },
  {
    name: "AI Insights",
    icon: TrendingUp,
    href: "/insights",
    roles: ["admin", "owner", "principal", "academic_director", "bursar", "ict_admin"],
  },
  {
    name: "Transport",
    icon: Briefcase, // Replacing with generic icon until customized
    href: "/transport",
    roles: ["parent"],
  },

]

export const secondaryNavigationItems: NavigationItem[] = [
  {
    name: "Reports",
    icon: BarChart3,
    href: "/reports",
    roles: ["admin", "owner", "principal", "academic_director", "bursar", "ict_admin"],
  },
  {
    name: "School Settings",
    icon: Building2,
    href: "/settings/school",
    roles: ["admin", "owner", "principal", "ict_admin"],
  },
  {
    name: "System Settings",
    icon: Settings,
    href: "/settings/system",
    roles: ["admin", "owner", "ict_admin"],
  },
  {
    name: "Data Governance",
    icon: ShieldAlert,
    href: "/settings/data-governance/retention",
    roles: ["admin", "principal", "ict_admin"],
  },
]

export function getNavigation(user: { role: UserRole; isClassTeacher?: boolean }) {
  const filterItems = (items: NavigationItem[]) => {
    return items.filter((item) => {
      // 1. Check Roles
      if (!item.roles.includes(user.role)) {
        return false
      }

      // 2. Check Responsibilities
      if (item.requires) {
        if (item.requires.classTeacher && !user.isClassTeacher) {
          return false
        }
      }

      return true
    })
  }

  return {
    primary: filterItems(navigationItems),
    secondary: filterItems(secondaryNavigationItems),
  }
}
