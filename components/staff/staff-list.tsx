"use client"

import { useAuth } from "@/components/auth/auth-provider"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MoreHorizontal, Filter } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getUsers, updateUser } from "@/lib/api-users"
import { User, Role } from "@/lib/types/user"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function StaffList() {
    const { user } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")

    // TODO: move to a shared constant or fetch from API
    const staffRoles = ['Teacher', 'Principal', 'Bursar', 'Secretary', 'ICT Admin', 'Admin']

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const filters: any = { type: 'staff' }
            if (roleFilter !== 'all') {
                filters.role = roleFilter
            }
            if (search) {
                filters.search = search
            }

            // We use 'all=true' to get all for client side simplicity for now, 
            // or we could implement server side pagination properly. 
            // the API supports search/filter, so let's try to use that.
            // But api-users.ts mapping for getUsers puts search/role in filters.

            const data = await getUsers(1, true, filters)
            // If all=true, returns array. If not, paginator.
            // API implementation:
            // if (all) return $query->get();
            setUsers(Array.isArray(data) ? data : data.data)
        } catch (error) {
            console.error("Failed to fetch staff", error)
            toast({
                title: "Error",
                description: "Failed to load staff directory.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (user) fetchUsers()
        }, 500)
        return () => clearTimeout(timer)
    }, [user, search, roleFilter])


    const handleToggleStatus = async (targetUser: User) => {
        try {
            await updateUser(targetUser.id, { is_active: !targetUser.is_active })
            toast({
                title: "Success",
                description: `Staff ${targetUser.is_active ? 'deactivated' : 'activated'} successfully.`,
            })
            // Update local state
            setUsers(users.map(u => u.id === targetUser.id ? { ...u, is_active: !u.is_active } : u))
        } catch (error) {
            console.error("Failed to update status", error)
            toast({
                title: "Error",
                description: "Failed to update staff status.",
                variant: "destructive",
            })
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
    }

    if (isLoading && users.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="border rounded-md">
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 pb-4">
                <CardTitle className="text-xl font-bold">Staff Directory</CardTitle>
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search staff..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full md:w-auto gap-2">
                                <Filter className="h-4 w-4" />
                                {roleFilter === 'all' ? 'All Roles' : roleFilter}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={roleFilter} onValueChange={setRoleFilter}>
                                <DropdownMenuRadioItem value="all">All Roles</DropdownMenuRadioItem>
                                {staffRoles.map(role => (
                                    <DropdownMenuRadioItem key={role} value={role}>{role}</DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Avatar</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No staff members found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((staff) => (
                                    <TableRow key={staff.id}>
                                        <TableCell>
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={`/api/placeholder/32/32`} alt={staff.name} />
                                                <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div>{staff.name}</div>
                                            <div className="text-xs text-muted-foreground">{staff.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            {staff.roles?.map(role => (
                                                <Badge key={role.id} variant="secondary" className="mr-1">
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{staff.phone || '-'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={staff.is_active
                                                    ? "text-green-600 border-green-200 bg-green-50"
                                                    : "text-red-600 border-red-200 bg-red-50"
                                                }
                                            >
                                                {staff.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <Link href={`/staff/${staff.id}`}>
                                                        <DropdownMenuItem>
                                                            View Profile
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    {staff.roles?.some(r => r.name === 'Teacher') && (
                                                        <Link href={`/staff/${staff.id}?tab=classes`}>
                                                            <DropdownMenuItem>
                                                                Assign Class
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className={staff.is_active ? "text-red-600" : "text-green-600"}
                                                        onClick={() => handleToggleStatus(staff)}
                                                    >
                                                        {staff.is_active ? "Deactivate" : "Activate"}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
