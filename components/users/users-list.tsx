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
import { Plus, Search, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getUsers, updateUser } from "@/lib/api-users"
import { User } from "@/lib/types/user"
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
} from "@/components/ui/dropdown-menu"

export default function UsersList() {
    const { user } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers()
                // Assuming paginator structure
                setUsers(data.data)
            } catch (error) {
                console.error("Failed to fetch users", error)
                toast({
                    title: "Error",
                    description: "Failed to load users.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (user) {
            fetchUsers()
        }
    }, [user])

    const handleToggleStatus = async (user: User) => {
        try {
            await updateUser(user.id, { is_active: !user.is_active })
            toast({
                title: "Success",
                description: `User ${user.is_active ? 'deactivated' : 'activated'} successfully.`,
            })
            // Update local state
            setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u))
        } catch (error) {
            console.error("Failed to update status", error)
            toast({
                title: "Error",
                description: "Failed to update user status.",
                variant: "destructive",
            })
        }
    }

    // Client-side filtering for now
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    if (isLoading) {
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-bold">All Users</CardTitle>
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Link href="/users/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.roles?.map(role => (
                                                <Badge key={role.id} variant="secondary" className="mr-1">
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={user.is_active
                                                    ? "text-green-600 border-green-200 bg-green-50"
                                                    : "text-red-600 border-red-200 bg-red-50"
                                                }
                                            >
                                                {user.is_active ? "Active" : "Inactive"}
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
                                                    <Link href={`/users/${user.id}`}>
                                                        <DropdownMenuItem>
                                                            Edit details
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    {user.roles?.some(r => r.name === 'Teacher') && (
                                                        <Link href={`/users/${user.id}?tab=classes`}>
                                                            <DropdownMenuItem>
                                                                Assign Class
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className={user.is_active ? "text-red-600" : "text-green-600"}
                                                        onClick={() => handleToggleStatus(user)}
                                                    >
                                                        {user.is_active ? "Deactivate User" : "Activate User"}
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
