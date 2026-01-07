"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Loader2, AlertTriangle, CheckCircle, Search } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { getAllIncidentTypesAdmin, createIncidentType, updateIncidentType, deleteIncidentType, IncidentType } from "@/lib/api-discipline"
import { useAuth } from "@/components/auth/auth-provider" // Import useAuth

export default function IncidentPoliciesClientPage() {
    const { user } = useAuth() // Get user for AppShell
    const [policies, setPolicies] = useState<IncidentType[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPolicy, setEditingPolicy] = useState<IncidentType | null>(null)
    const [saving, setSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState<Partial<IncidentType>>({
        name: "",
        description: "",
        severity: "low",
        points: 1,
        active: true,
    })

    const fetchPolicies = async () => {
        setLoading(true)
        try {
            const data = await getAllIncidentTypesAdmin()
            setPolicies(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load policies")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPolicies()
    }, [])

    const handleCreate = () => {
        setEditingPolicy(null)
        setFormData({
            name: "",
            description: "",
            severity: "low",
            points: 1,
            active: true,
        })
        setIsModalOpen(true)
    }

    const handleEdit = (policy: IncidentType) => {
        setEditingPolicy(policy)
        setFormData({
            name: policy.name,
            description: policy.description || "",
            severity: policy.severity,
            points: policy.points,
            active: policy.active,
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this policy?")) return;

        try {
            await deleteIncidentType(id)
            toast.success("Policy deleted")
            fetchPolicies()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete policy")
        }
    }

    const handleSubmit = async () => {
        if (!formData.name) return toast.error("Name is required")

        setSaving(true)
        try {
            if (editingPolicy) {
                await updateIncidentType(editingPolicy.id, formData)
                toast.success("Policy updated")
            } else {
                await createIncidentType(formData)
                toast.success("Policy created")
            }
            setIsModalOpen(false)
            fetchPolicies()
        } catch (error) {
            console.error(error)
            toast.error("Failed to save policy")
        } finally {
            setSaving(false)
        }
    }

    const filteredPolicies = policies.filter(p =>
        p.name.toLowerCase().replace(/\s+/g, "").includes(searchQuery.toLowerCase().replace(/\s+/g, "")) ||
        (p.description && p.description.toLowerCase().replace(/\s+/g, "").includes(searchQuery.toLowerCase().replace(/\s+/g, "")))
    )

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'low': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Low</Badge>
            case 'medium': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>
            case 'high': return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">High</Badge>
            case 'critical': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Critical</Badge>
            default: return <Badge variant="secondary">{severity}</Badge>
        }
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Incident Policies</h1>
                    <p className="text-muted-foreground">Manage incident types, severity levels, and automated points.</p>
                </div>
                <Button onClick={handleCreate}><Plus className="mr-2 h-4 w-4" /> New Policy</Button>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search policies..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : filteredPolicies.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No policies found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPolicies.map((policy) => (
                                <TableRow key={policy.id}>
                                    <TableCell>
                                        <div className="font-medium">{policy.name}</div>
                                        {policy.description && <div className="text-xs text-muted-foreground">{policy.description}</div>}
                                    </TableCell>
                                    <TableCell>{getSeverityBadge(policy.severity)}</TableCell>
                                    <TableCell>{policy.points}</TableCell>
                                    <TableCell>
                                        <Badge variant={policy.active ? "default" : "secondary"}>
                                            {policy.active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(policy)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(policy.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingPolicy ? "Edit Policy" : "Create New Policy"}</DialogTitle>
                        <DialogDescription>Define the details for this incident type.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Policy Name</Label>
                            <Input
                                placeholder="e.g. Late Arrival"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Description of the incident..."
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Default Severity</Label>
                                <Select
                                    value={formData.severity}
                                    onValueChange={(val: any) => setFormData({ ...formData, severity: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Demerit Points</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.points}
                                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                id="active"
                                checked={formData.active}
                                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                            />
                            <Label htmlFor="active">Active Status</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Policy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
