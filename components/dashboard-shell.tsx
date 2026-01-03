"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
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
  Bell,
  Search,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  Baby,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import Link from "next/link"

// Extended nav item with roles
const navigation = [
  { name: "Overview", icon: LayoutDashboard, href: "/", active: true, roles: ['Super Admin', 'Admin', 'Teacher', 'Accountant', 'Parent'] },
  { name: "Students", icon: Users, href: "/students", active: false, roles: ['Admin', 'Teacher', 'Accountant'] },
  { name: "Parents/Guardians", icon: Baby, href: "/guardians", active: false, roles: ['Super Admin', 'Admin', 'Teacher', 'Admissions Officer'] },
  {
    name: "Academic",
    icon: GraduationCap,
    href: "/academic",
    active: false,
    roles: ['Admin', 'Teacher'],
    children: [
      { name: "Overview", href: "/academic", roles: ['Admin', 'Teacher'] },
      { name: "Exams", href: "/exams", roles: ['Admin', 'Teacher'] },
      { name: "Results", href: "/exams", roles: ['Admin', 'Teacher'] },
    ]
  },
  { name: "Finance", icon: DollarSign, href: "/finance", active: false, roles: ['Admin', 'Accountant', 'Parent'] },
  { name: "Attendance", icon: Calendar, href: "/attendance", active: false, roles: ['Admin', 'Teacher', 'Parent'] },
  { name: "Communication", icon: MessageSquare, href: "/communication", active: false, roles: ['Admin', 'Teacher', 'Parent'] },
  { name: "Insights", icon: TrendingUp, href: "/insights", active: false, roles: ['Admin'] },
]

const secondaryNavigation = [
  { name: "School Settings", icon: Building2, href: "/settings", roles: ['Admin'] },
  { name: "System Settings", icon: Settings, href: "/system", roles: ['Admin'] },
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Academic'])
  const { user, logout, hasRole } = useAuth()
  const pathname = usePathname()

  // Filter navigation helpers
  const filterNav = (items: any[]) => items.filter(item => {
    if (!item.roles) return true; // No roles defined = public/all
    return hasRole(item.roles);
  });

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const isRouteActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  const mainNav = filterNav(navigation);
  const settingsNav = filterNav(secondaryNavigation);

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'; // Fallback to 'U' if no name

  const roleName = user?.roles?.[0] || 'User';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">School OS</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {mainNav.map((item) => {
                const isActive = item.href ? isRouteActive(item.href) : false
                const isExpanded = expandedMenus.includes(item.name)
                const hasChildren = item.children && item.children.length > 0

                return (
                  <div key={item.name} className="space-y-1">
                    {hasChildren ? (
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`
                          flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium
                          transition-colors
                          ${isActive || isExpanded
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "" : "-rotate-90"}`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                          transition-colors
                          ${isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          }
                        `}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    )}

                    {/* Submenu */}
                    {hasChildren && isExpanded && (
                      <div className="ml-4 space-y-1 border-l py-1 pl-2">
                        {item.children.map((child: any) => {
                          const isChildActive = isRouteActive(child.href)
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={`
                                flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                                transition-colors
                                ${isChildActive
                                  ? "bg-sidebar-accent/50 text-sidebar-accent-foreground"
                                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                }
                              `}
                            >
                              {child.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="pt-6">
              {settingsNav.length > 0 && (
                <>
                  <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                    Administration
                  </div>
                  <div className="space-y-1">
                    {settingsNav.map((item) => {
                      const isActive = isRouteActive(item.href)
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`
                            flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                            ${isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            }
                          `}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* User profile */}
          <div className="border-t border-sidebar-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-sidebar-accent">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-sidebar-foreground">{user?.full_name || 'Guest'}</p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">{roleName}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search students, staff, reports..." className="pl-10 bg-background" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-2 p-2">
                  <div className="flex gap-2 rounded-lg p-2 hover:bg-accent">
                    <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Fee Default Risk</p>
                      <p className="text-xs text-muted-foreground">15 students at high risk this term</p>
                    </div>
                  </div>
                  <div className="flex gap-2 rounded-lg p-2 hover:bg-accent">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Term Reports Ready</p>
                      <p className="text-xs text-muted-foreground">Form 1-4 reports generated successfully</p>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
