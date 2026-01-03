"use client"

import { Input } from "@/components/ui/input"
import { Settings, Users, Shield, Database, Bell, Save, Loader2, Search, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModernTabs, ModernTabsContent, ModernTabsList, ModernTabsTrigger } from "@/components/ui/modern-tabs"
import { Switch } from "@/components/ui/switch"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { useEffect, useState } from "react"
import { Role, getRoles } from "@/lib/api-roles"
import { getUsers } from "@/lib/api-users"
import { User } from "@/lib/types/user"
import { RoleConfigModal } from "../roles/role-config-modal"
import { UserConfigModal } from "../users/user-config-modal"
import { useToast } from "@/components/ui/use-toast"

export default function SystemSettings() {
  const { toast } = useToast()

  // Roles state
  const [roles, setRoles] = useState<Role[]>([])
  // ... existing state ...
  const [search, setSearch] = useState("")
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined)

  // Users state
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)

  const fetchRoles = async () => {
    setLoadingRoles(true)
    try {
      const data = await getRoles()
      setRoles(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching roles",
        description: "Could not load roles."
      })
    } finally {
      setLoadingRoles(false)
    }
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const data = await getUsers(1, true)
      // Handle both paginator structure and direct array
      if (Array.isArray(data)) {
        setUsers(data)
      } else {
        setUsers(data.data || [])
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching users",
        description: "Could not load users."
      })
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    fetchRoles()
    fetchUsers()
  }, [])

  const handleConfigureRole = (role: Role) => {
    setSelectedRole(role)
    setIsRoleModalOpen(true)
  }

  const handleRoleSuccess = () => {
    fetchRoles()
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const handleAddUser = () => {
    setSelectedUser(undefined)
    setIsUserModalOpen(true)
  }

  const handleUserSuccess = () => {
    fetchUsers()
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Tabs */}
      <ModernTabs defaultValue="users">

        <ModernTabsList>
          <ModernTabsTrigger value="users" icon={Users}>Users & Roles</ModernTabsTrigger>
          <ModernTabsTrigger value="security" icon={Shield}>Security</ModernTabsTrigger>
          <ModernTabsTrigger value="notifications" icon={Bell}>Notifications</ModernTabsTrigger>
          <ModernTabsTrigger value="integrations" icon={Settings}>Integrations</ModernTabsTrigger>
          <ModernTabsTrigger value="backup" icon={Database}>Data & Backup</ModernTabsTrigger>
        </ModernTabsList>

        <ModernTabsContent value="users" className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>User Management</CardTitle>
              </div>
              <CardDescription>Manage system users and their access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8 h-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button size="sm" onClick={handleAddUser}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
              <div className="space-y-2">
                {loadingUsers ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  users.filter(u =>
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase())
                  ).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{user.roles && user.roles.length > 0 ? user.roles[0].name : "User"}</Badge>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Configure what each role can access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loadingRoles ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  roles.map((role) => (
                    <div key={role.id} className="p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{role.name}</p>
                        <Button size="sm" variant="outline" onClick={() => handleConfigureRole(role)}>
                          Configure
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 5).map((perm) => (
                          <Badge key={perm.id} variant="secondary" className="text-xs">
                            {perm.name}
                          </Badge>
                        ))}
                        {role.permissions.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </ModernTabsContent>

        <ModernTabsContent value="security" className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>Configure authentication and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <FieldLabel>Two-Factor Authentication</FieldLabel>
                    <FieldDescription>Require 2FA for all admin users</FieldDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <FieldLabel>Password Expiry</FieldLabel>
                    <FieldDescription>Force password reset every 90 days</FieldDescription>
                  </div>
                  <Switch />
                </div>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <FieldLabel>Session Timeout</FieldLabel>
                    <FieldDescription>Auto logout after 30 minutes of inactivity</FieldDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <FieldLabel>IP Whitelisting</FieldLabel>
                    <FieldDescription>Restrict access to specific IP addresses</FieldDescription>
                  </div>
                  <Switch />
                </div>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <FieldLabel>Audit Logging</FieldLabel>
                    <FieldDescription>Track all system changes and user actions</FieldDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Login attempts and security alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { event: "Successful login", user: "john@nea.ac.ke", time: "2 hours ago", type: "success" },
                  { event: "Password changed", user: "mary@nea.ac.ke", time: "5 hours ago", type: "info" },
                  { event: "Failed login attempt", user: "unknown@email.com", time: "Yesterday", type: "warning" },
                ].map((event, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.event}</p>
                      <p className="text-xs text-muted-foreground">{event.user}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          event.type === "success" ? "default" : event.type === "warning" ? "destructive" : "secondary"
                        }
                      >
                        {event.type}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ModernTabsContent>

        <ModernTabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <FieldLabel>Email Notifications</FieldLabel>
                    <FieldDescription>Send email alerts for critical events</FieldDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <FieldLabel>SMS Notifications</FieldLabel>
                    <FieldDescription>Send SMS for urgent alerts</FieldDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <FieldLabel>Daily Summary Reports</FieldLabel>
                    <FieldDescription>Receive daily email with key metrics</FieldDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <FieldLabel>Workflow Notifications</FieldLabel>
                    <FieldDescription>Alert when workflow actions are triggered</FieldDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <FieldLabel>Payment Alerts</FieldLabel>
                    <FieldDescription>Notify when fees are paid</FieldDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Field>
            </CardContent>
          </Card>
        </ModernTabsContent>

        <ModernTabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <CardTitle>External Integrations</CardTitle>
              </div>
              <CardDescription>Connect to third-party services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "M-Pesa Daraja API",
                    description: "Process payments via M-Pesa",
                    status: "Connected",
                    enabled: true,
                  },
                  {
                    name: "SMS Gateway",
                    description: "Send SMS to parents and students",
                    status: "Connected",
                    enabled: true,
                  },
                  {
                    name: "Email Service",
                    description: "Send email notifications",
                    status: "Connected",
                    enabled: true,
                  },
                  {
                    name: "Kenya Education Cloud",
                    description: "Sync data with government systems",
                    status: "Not Connected",
                    enabled: false,
                  },
                ].map((integration, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">{integration.name}</p>
                        <Badge variant={integration.enabled ? "default" : "secondary"}>{integration.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      {integration.enabled ? "Configure" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ModernTabsContent>

        <ModernTabsContent value="backup" className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <CardTitle>Data Backup & Export</CardTitle>
              </div>
              <CardDescription>Manage backups and data exports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <FieldLabel>Automatic Daily Backups</FieldLabel>
                    <FieldDescription>Backup all data at 2 AM daily</FieldDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Field>

              <div className="pt-4">
                <p className="text-sm font-medium mb-3">Recent Backups</p>
                <div className="space-y-2">
                  {[
                    { date: "Dec 19, 2024 02:00 AM", size: "234 MB", status: "Success" },
                    { date: "Dec 18, 2024 02:00 AM", size: "232 MB", status: "Success" },
                    { date: "Dec 17, 2024 02:00 AM", size: "230 MB", status: "Success" },
                  ].map((backup, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{backup.date}</p>
                        <p className="text-xs text-muted-foreground">{backup.size}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{backup.status}</Badge>
                        <Button size="sm" variant="outline">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full">Create Backup Now</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Export school data for reporting or migration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <Button variant="outline" className="justify-start bg-transparent">
                  Export Student Data
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  Export Financial Data
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  Export Academic Records
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  Export All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </ModernTabsContent>
        {/* End Tabs */}
      </ModernTabs>

      <RoleConfigModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        role={selectedRole}
        onSuccess={handleRoleSuccess}
      />
      <UserConfigModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={selectedUser}
        onSuccess={handleUserSuccess}
      />
    </div>
  )
}
