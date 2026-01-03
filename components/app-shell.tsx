"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { getNavigation } from "@/lib/navigation/role-navigation"
import type { User } from "@/lib/types/roles"
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
import { GraduationCap, Bell, Search, ChevronDown, Menu, X, AlertTriangle, CheckCircle2, MessageSquare, Mail, Home as HomeIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface AppShellProps {
  children: React.ReactNode
  user?: User
  breadcrumbs?: { label: string; href?: string }[]
}

const notifications = [
  {
    title: "Fee Default Risk",
    message: "15 students at high risk this term",
    icon: AlertTriangle,
    iconColor: "text-warning",
    roles: ["owner", "principal", "bursar", "ict_admin"],
  },
  {
    title: "Term Reports Ready",
    message: "All reports generated successfully",
    icon: CheckCircle2,
    iconColor: "text-success",
    roles: ["owner", "principal", "academic_director", "bursar", "teacher", "ict_admin"],
  },
]

import { getUnreadCount } from "@/lib/api-communication"

export default function AppShell({ children, user, breadcrumbs }: AppShellProps) {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [unreadMessages, setUnreadMessages] = useState(0) // State for unread count

  const navigation = getNavigation({
    role: user?.role || "student",
    isClassTeacher: user?.isClassTeacher
  })

  // Poll for unread messages
  const lastUnreadCount = React.useRef(-1) // Track last count to detect increases. Start -1 to skip initial sound.

  React.useEffect(() => {
    if (!user) return
    const fetchUnread = async () => {
      try {
        const count = await getUnreadCount()

        // Play sound if count increased
        if (lastUnreadCount.current !== -1 && count > lastUnreadCount.current) {
          const audio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3')
          audio.play().catch(e => console.error("Audio play failed", e))
        }

        lastUnreadCount.current = count
        setUnreadMessages(count)
      } catch (e) {
        console.error("Failed to fetch unread count", e)
      }
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [user])

  const handleLogout = async () => {
    await logout()
    // router.push/refresh is handled in AuthProvider.logout usually, but safe to keep duplicates or let provider handle it.
    // AuthProvider.logout does router.push('/auth/login').
  }



  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      owner: "School Owner",
      principal: "Principal",
      academic_director: "Academic Director",
      bursar: "Bursar",
      teacher: "Teacher",
      parent: "Parent",
      student: "Student",
      ict_admin: "ICT Administrator",
    }
    return labels[role] || role
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Floating Glass */}
      <aside
        className={`
        fixed inset-y-4 left-4 z-50 w-64
        transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:ml-4 lg:mb-4 flex flex-col border-0
      `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center p-6 border-b border-white/10">
            <div className="relative h-11 w-full">
              <Image
                src="/school-os-logo-final-v2.png"
                alt="School OS by Kynara Systems"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navigation.primary.map((item) => (
                <SidebarItem key={item.name} item={item} pathname={pathname} />
              ))}
            </div>

            {navigation.secondary.length > 0 && (
              <div className="pt-6">
                <div className="mb-4 px-4 text-xs font-bold uppercase text-white/50">
                  Administration
                </div>
                <div className="space-y-1">
                  {navigation.secondary.map((item) => (
                    <SidebarItem key={item.name} item={item} pathname={pathname} />
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Floating Header */}
        <header className="absolute top-4 left-0 right-4 lg:left-0 z-40 mx-4 lg:mx-0 px-4 h-20 flex items-center justify-between transition-all duration-200 bg-[#0B1437]/50 backdrop-blur-xl rounded-2xl">
          {/* Breadcrumbs / Title Placeholder */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="hidden md:block">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs ? (
                    <>
                      {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1
                        return (
                          <React.Fragment key={index}>
                            {index > 0 && <BreadcrumbSeparator className="text-white/50" />}
                            <BreadcrumbItem>
                              {isLast || !item.href ? (
                                <BreadcrumbPage className="text-white font-bold capitalize">
                                  {item.label}
                                </BreadcrumbPage>
                              ) : (
                                <BreadcrumbLink href={item.href} className="text-white/50 hover:text-white capitalize transition-colors">
                                  {item.label}
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                          </React.Fragment>
                        )
                      })}
                    </>
                  ) : (
                    <>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="text-white/50 hover:text-white transition-colors">
                          <HomeIcon className="h-4 w-4" />
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {pathname.split('/').filter(Boolean).map((segment, index, array) => {
                        const href = `/${array.slice(0, index + 1).join('/')}`
                        const isLast = index === array.length - 1

                        if (segment === 'dashboard') return null

                        return (
                          <React.Fragment key={href}>
                            <BreadcrumbSeparator className="text-white/50" />
                            <BreadcrumbItem>
                              {isLast ? (
                                <BreadcrumbPage className="text-white font-bold capitalize">
                                  {segment.replace(/-/g, ' ')}
                                </BreadcrumbPage>
                              ) : (
                                <BreadcrumbLink href={href} className="text-white/50 hover:text-white capitalize transition-colors">
                                  {segment.replace(/-/g, ' ')}
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                          </React.Fragment>
                        )
                      })}
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
              {pathname === '/dashboard' && !breadcrumbs && (
                <p className="font-bold text-white text-sm mt-1">Dashboard</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/50 group-focus-within:text-white/80 transition-colors" />
              </div>
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 bg-transparent border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:ring-0 rounded-xl w-40 focus:w-64 transition-all duration-300"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Messages */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                    <MessageSquare className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                {/* Keeping existing mock content but styling it if needed, omitted for brevity as existing structure works but needs glass classes */}
                <DropdownMenuContent align="end" className="w-80 glass-card border-white/10 text-white">
                  <DropdownMenuLabel>Messages</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <div className="p-4 flex flex-col gap-4">
                    {unreadMessages > 0 ? (
                      <p className="text-sm">You have <span className="font-bold text-primary">{unreadMessages}</span> unread message{unreadMessages !== 1 && 's'}.</p>
                    ) : (
                      <p className="text-center text-sm text-white/50">No new messages</p>
                    )}
                    <Link href="/communication" className="w-full" onClick={() => setUnreadMessages(0)}>
                      <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                        Open Chat
                      </Button>
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                    <Bell className="h-5 w-5" />

                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 glass-card border-white/10 text-white">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile - Moved to Header */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold leading-none">{user?.full_name || "User"}</p>
                    </div>
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/20 text-white text-xs">
                        {getInitials(user?.full_name || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card border-white/10 text-white">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.full_name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{getRoleLabel(user?.role || "")}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="focus:bg-white/10 focus:text-white">Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-white/10 focus:text-white">Switch School</DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:bg-red-500/10 focus:text-red-400">Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content - Adjusted padding for floating elements */}
        <main className="flex-1 overflow-y-auto pt-28 px-4 pb-4 lg:px-6 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarItem({ item, pathname }: { item: any; pathname: string }) {
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
  const hasChildren = item.children && item.children.length > 0
  const [isExpanded, setIsExpanded] = useState(isActive)

  React.useEffect(() => {
    if (isActive && hasChildren) {
      setIsExpanded(true)
    }
  }, [pathname, isActive, hasChildren])

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`
          flex items-center justify-between gap-3 rounded-xl pr-2 text-sm font-medium
          transition-all duration-200
          ${isActive
            ? "bg-primary text-white shadow-md shadow-primary/30"
            : "text-muted-foreground hover:bg-white/10 hover:text-white"
          }
        `}
      >
        <Link href={item.href} className="flex-1 flex items-center gap-3 px-4 py-3">
          <div className={`p-1.5 rounded-lg ${isActive ? "bg-white/20" : "bg-primary/10 text-primary"}`}>
            <item.icon className="h-4 w-4" />
          </div>
          {item.name}
        </Link>
        {hasChildren && (
          <button onClick={toggleExpand} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "" : "-rotate-90"}`} />
          </button>
        )}
      </div>

      {/* Submenu */}
      {hasChildren && isExpanded && (
        <div className="ml-4 pl-4 border-l border-white/10 space-y-1">
          {item.children?.map((child: any) => {
            const isChildActive = pathname === child.href || pathname.startsWith(`${child.href}/`)
            return (
              <Link
                key={child.name}
                href={child.href}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                  transition-all duration-200
                  ${isChildActive
                    ? "text-white bg-white/10"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <div className={`p-1 rounded-md ${isChildActive ? "bg-white/20" : "bg-primary/10 text-primary"}`}>
                  <child.icon className="h-3 w-3" />
                </div>
                {child.name}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
