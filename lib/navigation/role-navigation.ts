import type { UserRole } from "@/lib/types/roles"
import {
  LayoutDashboard,
  Users,
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
    roles: ["super_admin", "owner", "principal", "academic_director", "bursar", "teacher", "parent", "student", "ict_admin"],
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
    roles: ["super_admin", "owner", "principal", "academic_director", "bursar", "ict_admin"],
  },
  {
    name: "Parents/Guardians",
    icon: Baby, // Using Baby to represent child/parent relationship
    href: "/guardians",
    roles: ["super_admin", "owner", "principal", "academic_director", "ict_admin", "teacher"],
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
    roles: ["super_admin", "owner", "principal", "academic_director", "teacher", "ict_admin", "parent"],
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
    roles: ["super_admin", "owner", "principal", "academic_director", "ict_admin", "parent", "teacher"],
    children: [
      {
        name: "Classes & Streams",
        icon: Building2,
        href: "/classes",
        roles: ["super_admin", "owner", "principal", "academic_director", "ict_admin", "teacher"],
      },
      {
        name: "Subjects",
        icon: BookOpen,
        href: "/subjects",
        roles: ["super_admin", "owner", "principal", "academic_director", "ict_admin", "teacher"],
      },
      {
        name: "Exams",
        icon: FileBarChart, // Changed to distinct icon if available or generic
        href: "/exams",
        roles: ["super_admin", "owner", "principal", "academic_director", "ict_admin", "parent", "teacher"],
      },
      {
        name: "Results",
        icon: BarChart3,
        href: "/exams",
        roles: ["super_admin", "owner", "principal", "academic_director", "ict_admin", "parent", "teacher"],
      }
    ]
  },
  {
    name: "Discipline",
    icon: ShieldAlert,
    href: "/discipline",
    roles: ["super_admin", "owner", "principal", "academic_director", "ict_admin", "teacher"],

  },
  {
    name: "Finance",
    icon: DollarSign,
    href: "/finance",
    roles: ["super_admin", "owner", "principal", "bursar", "ict_admin", "parent"],
  },
  {
    name: "Workflows",
    icon: Workflow,
    href: "/workflows",
    roles: ["super_admin", "owner", "principal", "academic_director", "bursar", "ict_admin"],
  },
  {
    name: "Communication",
    icon: MessageSquare,
    href: "/communication",
    roles: ["super_admin", "owner", "principal", "academic_director", "bursar", "teacher", "ict_admin", "parent"],
  },
  {
    name: "Staff & HR",
    icon: UserCog,
    href: "/staff",
    roles: ["super_admin", "owner", "principal", "ict_admin"],
  },
  {
    name: "Operations",
    icon: Briefcase,
    href: "/operations",
    roles: ["super_admin", "owner", "principal", "ict_admin"],
  },
  {
    name: "AI Insights",
    icon: TrendingUp,
    href: "/insights",
    roles: ["super_admin", "owner", "principal", "academic_director", "bursar", "ict_admin"],
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
    roles: ["super_admin", "owner", "principal", "academic_director", "bursar", "ict_admin"],
  },
  {
    name: "School Settings",
    icon: Building2,
    href: "/settings/school",
    roles: ["super_admin", "owner", "principal", "ict_admin"],
  },
  {
    name: "System Settings",
    icon: Settings,
    href: "/settings/system",
    roles: ["super_admin", "owner", "ict_admin"],
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
