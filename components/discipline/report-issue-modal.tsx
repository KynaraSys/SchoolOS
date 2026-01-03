"use client"
// Force rebuild

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import api from "@/lib/api"
import { getIncidentTypes, createIncident, IncidentType } from "@/lib/api-discipline"
import { toast } from "sonner"

interface ReportIssueModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
    preselectedStudent?: {
        id: number
        name: string
        admission_number?: string
    }
}

interface Student {
    id: number | string
    name: string
    student?: {
        id: number
        admission_number: string
        class_id: number
    }
}

export function ReportIssueModal({ open, onOpenChange, onSuccess, preselectedStudent }: ReportIssueModalProps) {
    const [students, setStudents] = useState<Student[]>([])
    const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([])
    const [loadingStudents, setLoadingStudents] = useState(false)

    // Form State
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(preselectedStudent?.id || null)
    const [studentSearchOpen, setStudentSearchOpen] = useState(false)

    const [formData, setFormData] = useState({
        incident_type_id: undefined as number | undefined,
        title: "",
        description: "",
        severity: "",
        status: "pending",
        action_taken: "",
        occurred_at: new Date(),
    })

    const [submitting, setSubmitting] = useState(false)

    // Fetch students and incident types
    useEffect(() => {
        if (open) {
            // Fetch Incident Types
            getIncidentTypes().then(setIncidentTypes).catch(console.error)

            if (preselectedStudent) {
                setSelectedStudentId(preselectedStudent.id)
            } else if (students.length === 0) {
                setLoadingStudents(true)
                api.get('/students')
                    .then(res => {
                        setStudents(res.data)
                    })
                    .catch(err => {
                        console.error("Failed to fetch students", err)
                        toast.error("Failed to load students list")
                    })
                    .finally(() => setLoadingStudents(false))
            }
        }
    }, [open, students.length, preselectedStudent])

    const handleTypeChange = (typeId: string) => {
        const type = incidentTypes.find(t => t.id === parseInt(typeId))
        if (type) {
            setFormData(prev => ({
                ...prev,
                incident_type_id: type.id,
                title: type.name, // Auto-fill title
                severity: type.severity, // Auto-fill severity
                description: prev.description || type.description || "" // Auto-fill description if empty
            }))
        }
    }

    const handleSubmit = async () => {
        if (!selectedStudentId) {
            toast.error("Please select a student")
            return
        }
        if (!formData.title) {
            toast.error("Please enter a title")
            return
        }
        if (!formData.severity) {
            toast.error("Please select severity")
            return
        }

        setSubmitting(true)

        try {
            await createIncident({
                ...formData,
                student_id: selectedStudentId,
                occurred_at: format(formData.occurred_at, "yyyy-MM-dd HH:mm:ss"),
            })

            toast.success("Incident reported successfully")
            onSuccess()
            onOpenChange(false)

            // Reset form
            setFormData({
                incident_type_id: undefined,
                title: "",
                description: "",
                severity: "",
                status: "pending",
                action_taken: "",
                occurred_at: new Date(),
            })
            if (!preselectedStudent) {
                setSelectedStudentId(null)
            }
        } catch (error) {
            console.error("Failed to report incident", error)
            toast.error("Failed to report incident")
        } finally {
            setSubmitting(false)
        }
    }

    const selectedStudent = preselectedStudent
        ? { name: preselectedStudent.name, student: { admission_number: preselectedStudent.admission_number } }
        : students.find(s => s.student?.id === selectedStudentId)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Report Disciplinary Issue</DialogTitle>
                    <DialogDescription>
                        Record a new disciplinary incident. This will be logged in the student's permanent record.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">

                    {/* Student Selector */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="student" className="text-right">
                            Student <span className="text-destructive">*</span>
                        </Label>
                        <div className="col-span-3">
                            {preselectedStudent ? (
                                <Input value={preselectedStudent.name} disabled readOnly />
                            ) : (
                                <Popover open={studentSearchOpen} onOpenChange={setStudentSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={studentSearchOpen}
                                            className="w-full justify-between"
                                        >
                                            {selectedStudentId
                                                ? selectedStudent?.name || "Student Selected"
                                                : "Select student..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search student by name..." />
                                            <CommandEmpty>No student found.</CommandEmpty>
                                            <CommandGroup className="max-h-[300px] overflow-y-auto">
                                                {students.map((student) => (
                                                    <CommandItem
                                                        key={student.id.toString()}
                                                        value={student.name}
                                                        onSelect={() => {
                                                            if (student.student?.id) {
                                                                setSelectedStudentId(student.student.id)
                                                            } else {
                                                                toast.error("This user is not linked to a student profile")
                                                            }
                                                            setStudentSearchOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedStudentId === student.student?.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span>{student.name}</span>
                                                            <span className="text-xs text-muted-foreground">{student.student?.admission_number}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    </div>

                    {/* Incident Type */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Incident Type
                        </Label>
                        <Select
                            value={formData.incident_type_id?.toString()}
                            onValueChange={handleTypeChange}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select incident type (Optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {incidentTypes.map(type => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                        {type.name} ({type.points} pts)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Title */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Issue Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. Fighting in class"
                            className="col-span-3"
                        />
                    </div>

                    {/* Date Picker */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Date & Time</Label>
                        <div className="col-span-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.occurred_at && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.occurred_at ? format(formData.occurred_at, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.occurred_at}
                                        onSelect={(date) => date && setFormData(prev => ({ ...prev, occurred_at: date }))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Severity & Status */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="severity" className="text-right">
                            Severity <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={formData.severity}
                            onValueChange={(val) => setFormData(prev => ({ ...prev, severity: val }))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low (Minor infraction)</SelectItem>
                                <SelectItem value="medium">Medium (Requires intervention)</SelectItem>
                                <SelectItem value="high">High (Serious offense)</SelectItem>
                                <SelectItem value="critical">Critical (Immediate suspension/expulsion risk)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending Review</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="escalated">Escalated</SelectItem>
                                <SelectItem value="dismissed">Dismissed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right pt-2">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Detailed description of what happened..."
                            className="col-span-3"
                            rows={4}
                        />
                    </div>

                    {/* Action Taken */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="action" className="text-right pt-2">
                            Action Taken
                        </Label>
                        <Textarea
                            id="action"
                            value={formData.action_taken}
                            onChange={(e) => setFormData(prev => ({ ...prev, action_taken: e.target.value }))}
                            placeholder="Any immediate action taken (e.g. warning given, sent to principal)..."
                            className="col-span-3"
                            rows={2}
                        />
                    </div>

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
