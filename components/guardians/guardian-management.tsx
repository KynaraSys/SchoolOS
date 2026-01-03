"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Trash2, Star, Phone, Mail, MessageSquareText, MessageCircle, Globe, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import api from "@/lib/api" // Assuming default axios instance
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface Guardian {
    id: number
    first_name: string
    last_name: string
    phone_number: string
    email: string
    pivot?: {
        is_primary: boolean
        receives_sms: boolean
        receives_email: boolean
        receives_whatsapp: boolean
        receives_portal: boolean
        receives_calls: boolean
    }
}

interface GuardianManagementProps {
    studentId: string
}

export function GuardianManagement({ studentId }: GuardianManagementProps) {
    const [guardians, setGuardians] = useState<Guardian[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { toast } = useToast()

    // Add/Search State
    const [searchPhone, setSearchPhone] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [foundGuardian, setFoundGuardian] = useState<Guardian | null>(null)
    const [showNewForm, setShowNewForm] = useState(false)

    // New Guardian Form State
    const [newGuardian, setNewGuardian] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        relationship_type: "Guardian",
    })

    // Link preferences
    const [linkPrefs, setLinkPrefs] = useState({
        is_primary: false,
        receives_sms: true,
        receives_email: false,
    })

    const fetchGuardians = async (silent = false) => {
        try {
            if (!silent) setLoading(true)
            // We need an endpoint to get guardians FOR A STUDENT.
            // The student Show API might return them, or we use a specific endpoint.
            // Assuming GET /students/:id includes guardians or we filter.
            // Let's assume the student profile API returns 'guardians'.
            // If not, we might need to modify StudentController show method to include 'guardians'.
            // OR we can list guardians and filter by student_id pivot? No that's inefficient.
            // Let's try fetching the student again explicitly requesting guardians if the main profile didn't have them.
            // Ideally StudentController@show should have `->load('guardians')`.
            const response = await api.get(`/students/${studentId}`)
            if (response.data.guardians) {
                setGuardians(response.data.guardians)
            } else if (response.data.student?.guardians) { // Nested structure sometimes
                setGuardians(response.data.student.guardians)
            }
        } catch (error) {
            console.error("Failed to fetch guardians", error)
        } finally {
            if (!silent) setLoading(false)
        }
    }

    useEffect(() => {
        fetchGuardians()
    }, [studentId])

    const handleSearch = async () => {
        if (!searchPhone) return
        setIsSearching(true)
        setFoundGuardian(null)
        setShowNewForm(false)
        try {
            const response = await api.post('/guardians/search-phone', { phone: searchPhone })
            setFoundGuardian(response.data)
            // Pre-fill phone if we need to create new
            setNewGuardian(prev => ({ ...prev, phone_number: response.data.phone_number || searchPhone }))
        } catch (error: any) {
            if (error.response?.status === 404) {
                setShowNewForm(true)
                setNewGuardian(prev => ({ ...prev, phone_number: searchPhone }))
                toast({
                    title: "Guardian not found",
                    description: "No existing guardian found. Please enter details to create new.",
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Search failed",
                    description: "Could not search for guardian.",
                })
            }
        } finally {
            setIsSearching(false)
        }
    }

    const handleLink = async () => {
        if (!foundGuardian) return
        try {
            await api.post('/guardians/link', {
                guardian_id: foundGuardian.id,
                student_id: studentId,
                ...linkPrefs
            })
            toast({ title: "Success", description: "Guardian linked successfully." })
            setIsDialogOpen(false)
            fetchGuardians()
            resetForm()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Link failed",
                description: error.response?.data?.message || "Could not link guardian.",
            })
        }
    }

    const handleCreateAndLink = async () => {
        try {
            // 1. Create Guardian
            const createResponse = await api.post('/guardians', newGuardian)
            const createdGuardian = createResponse.data

            // 2. Link
            await api.post('/guardians/link', {
                guardian_id: createdGuardian.id,
                student_id: studentId,
                ...linkPrefs
            })

            toast({ title: "Success", description: "Guardian created and linked successfully." })
            setIsDialogOpen(false)
            fetchGuardians()
            resetForm()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Operation failed",
                description: error.response?.data?.message || "Could not create/link guardian.",
            })
        }
    }

    const handleUnlink = async (guardianId: number) => {
        if (!confirm("Are you sure you want to remove this guardian?")) return;
        try {
            await api.post('/guardians/unlink', {
                guardian_id: guardianId,
                student_id: studentId
            })
            toast({ title: "Unlinked", description: "Guardian removed." })
            fetchGuardians()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Unlink failed",
                description: error.response?.data?.message || "Could not unlink.",
            })
        }
    }

    const handleSetPrimary = async (guardianId: number, currentStatus: boolean) => {
        try {
            await api.put(`/guardians/${guardianId}/students/${studentId}`, {
                is_primary: !currentStatus
            })
            toast({ title: "Updated", description: !currentStatus ? "Guardian set as primary." : "Primary status removed." })
            fetchGuardians(true)
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Update failed",
                description: error.response?.data?.message || "Could not update.",
            })
        }
    }

    const handleToggleCommunication = async (guardianId: number, type: string, currentValue: boolean) => {
        const readableType: Record<string, string> = {
            receives_sms: "SMS",
            receives_email: "Email",
            receives_whatsapp: "WhatsApp",
            receives_calls: "Phone Calls",
            receives_portal: "Portal Access"
        };
        const label = readableType[type] || "Communication";
        const newStatus = !currentValue;

        try {
            await api.put(`/guardians/${guardianId}/students/${studentId}`, {
                [type]: newStatus
            })
            // Optimistic update could happen here, but simplest is to fetch
            fetchGuardians(true)
            toast({
                title: newStatus ? "Enabled" : "Disabled",
                description: `${label} has been ${newStatus ? 'enabled' : 'disabled'} for this guardian.`
            })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Update failed",
                description: error.response?.data?.message || "Could not update.",
            })
        }
    }

    const resetForm = () => {
        setSearchPhone("")
        setFoundGuardian(null)
        setShowNewForm(false)
        setNewGuardian({ first_name: "", last_name: "", phone_number: "", email: "", relationship_type: "Guardian" })
        setLinkPrefs({ is_primary: false, receives_sms: true, receives_email: false })
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle>Parents & Guardians</CardTitle>
                    <CardDescription>Manage guardian contacts and communication preferences.</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" onClick={resetForm}><Plus className="h-4 w-4 mr-2" /> Add Guardian</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Guardian</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Step 1: Search */}
                            <div className="flex gap-2 items-end">
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="07XX..."
                                        value={searchPhone}
                                        onChange={(e) => setSearchPhone(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                                <Button onClick={handleSearch} disabled={isSearching || !searchPhone}>
                                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                </Button>
                            </div>

                            {/* Step 2: Found Existing */}
                            {foundGuardian && (
                                <div className="bg-muted p-4 rounded-md space-y-2">
                                    <p className="font-semibold text-sm">Found: {foundGuardian.first_name} {foundGuardian.last_name}</p>
                                    <p className="text-xs text-muted-foreground">{foundGuardian.email}</p>
                                    <div className="space-y-2 pt-2">
                                        <Label className="text-xs">Preferences</Label>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="sms" checked={linkPrefs.receives_sms} onCheckedChange={(c) => setLinkPrefs(p => ({ ...p, receives_sms: c }))} />
                                            <Label htmlFor="sms">Receive SMS</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="primary" checked={linkPrefs.is_primary} onCheckedChange={(c) => setLinkPrefs(p => ({ ...p, is_primary: c }))} />
                                            <Label htmlFor="primary">Primary Guardian</Label>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-2" onClick={handleLink}>Link this Guardian</Button>
                                </div>
                            )}

                            {/* Step 3: Create New */}
                            {showNewForm && (
                                <div className="space-y-3 border-t pt-2">
                                    <p className="text-sm font-medium text-blue-600">Creating New Guardian</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input placeholder="First Name" value={newGuardian.first_name} onChange={(e) => setNewGuardian({ ...newGuardian, first_name: e.target.value })} />
                                        <Input placeholder="Last Name" value={newGuardian.last_name} onChange={(e) => setNewGuardian({ ...newGuardian, last_name: e.target.value })} />
                                    </div>
                                    <Input placeholder="Relationship (Father, Mother...)" value={newGuardian.relationship_type} onChange={(e) => setNewGuardian({ ...newGuardian, relationship_type: e.target.value })} />
                                    <Input placeholder="Email (Optional)" value={newGuardian.email} onChange={(e) => setNewGuardian({ ...newGuardian, email: e.target.value })} />

                                    <div className="space-y-2 pt-2">
                                        <Label className="text-xs">Preferences</Label>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="new-sms" checked={linkPrefs.receives_sms} onCheckedChange={(c) => setLinkPrefs(p => ({ ...p, receives_sms: c }))} />
                                            <Label htmlFor="new-sms">Receive SMS</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="new-primary" checked={linkPrefs.is_primary} onCheckedChange={(c) => setLinkPrefs(p => ({ ...p, is_primary: c }))} />
                                            <Label htmlFor="new-primary">Primary Guardian</Label>
                                        </div>
                                    </div>

                                    <Button className="w-full" onClick={handleCreateAndLink}>Create & Link</Button>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : guardians.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground text-sm">No guardians linked yet.</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Communication</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {guardians.map((g) => (
                                <TableRow key={g.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{g.first_name} {g.last_name}</span>
                                            {g.pivot?.is_primary && <Badge variant="secondary" className="w-fit text-[10px] mt-1">Primary</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {g.phone_number}</span>
                                            {g.email && <span className="flex items-center gap-1 text-muted-foreground"><Mail className="h-3 w-3" /> {g.email}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className={`h-8 w-8 hover:bg-transparent ${g.pivot?.receives_sms ? 'text-green-600' : 'text-muted-foreground opacity-50'}`}
                                                            onClick={() => handleToggleCommunication(g.id, 'receives_sms', g.pivot?.receives_sms || false)}
                                                        >
                                                            <MessageSquareText className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>SMS {g.pivot?.receives_sms ? 'Enabled' : 'Disabled'}</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className={`h-8 w-8 hover:bg-transparent ${g.pivot?.receives_email ? 'text-green-600' : 'text-muted-foreground opacity-50'}`}
                                                            onClick={() => handleToggleCommunication(g.id, 'receives_email', g.pivot?.receives_email || false)}
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Email {g.pivot?.receives_email ? 'Enabled' : 'Disabled'}</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className={`h-8 w-8 hover:bg-transparent ${g.pivot?.receives_whatsapp ? 'text-green-600' : 'text-muted-foreground opacity-50'}`}
                                                            onClick={() => handleToggleCommunication(g.id, 'receives_whatsapp', g.pivot?.receives_whatsapp || false)}
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>WhatsApp {g.pivot?.receives_whatsapp ? 'Enabled' : 'Disabled'}</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className={`h-8 w-8 hover:bg-transparent ${g.pivot?.receives_calls ? 'text-green-600' : 'text-muted-foreground opacity-50'}`}
                                                            onClick={() => handleToggleCommunication(g.id, 'receives_calls', g.pivot?.receives_calls || false)}
                                                        >
                                                            <PhoneCall className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Calls {g.pivot?.receives_calls ? 'Enabled' : 'Disabled'}</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className={`h-8 w-8 hover:bg-transparent ${g.pivot?.receives_portal ? 'text-green-600' : 'text-muted-foreground opacity-50'}`}
                                                            onClick={() => handleToggleCommunication(g.id, 'receives_portal', g.pivot?.receives_portal || false)}
                                                        >
                                                            <Globe className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Portal Access {g.pivot?.receives_portal ? 'Enabled' : 'Disabled'}</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableCell>
                                    <TableCell>Active</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleSetPrimary(g.id, g.pivot?.is_primary || false)}
                                                            className={g.pivot?.is_primary ? "hover:bg-yellow-50" : ""}
                                                        >
                                                            <Star
                                                                className={`h-4 w-4 transition-colors ${g.pivot?.is_primary
                                                                    ? "text-yellow-500 fill-yellow-500"
                                                                    : "text-muted-foreground hover:text-yellow-500 fill-none hover:fill-yellow-500"
                                                                    }`}
                                                            />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{g.pivot?.is_primary ? "Click to Remove Primary Status" : "Set as Primary Guardian"}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleUnlink(g.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
