"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, Loader2, User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { User } from "@/lib/types/roles"
import { Label } from "@/components/ui/label"
import { getUsers } from "@/lib/api-users"

interface TeacherAssignmentModalProps {
    isOpen: boolean
    onClose: () => void
    onAssign: (teacherId: string, academicYear: string) => Promise<void>
    academicYear: string
    classId: string
}

export function TeacherAssignmentModal({ isOpen, onClose, onAssign, academicYear, classId }: TeacherAssignmentModalProps) {
    const [teachers, setTeachers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null)
    const [isAssigning, setIsAssigning] = useState(false)

    // Fetch teachers from API
    useEffect(() => {
        if (isOpen) {
            const fetchTeachers = async () => {
                setIsLoading(true)
                try {
                    // Fetch all staff first, then filter client-side to be safe
                    const data = await getUsers(1, true, { type: 'staff' })

                    const staffList = Array.isArray(data) ? data : (data.data || [])
                    // Filter for role 'Teacher' AND not already assigned as primary for this year
                    const teacherList = staffList.filter((user: any) =>
                        user.roles.some((r: any) => r.name === 'Teacher' || r.name === 'teacher') &&
                        !user.classTeacherAssignments?.some((a: any) => a.is_primary && String(a.academic_year) === String(academicYear))
                    )

                    setTeachers(teacherList)
                } catch (error) {
                    console.error("Failed to fetch teachers", error)
                } finally {
                    setIsLoading(false)
                }
            }
            fetchTeachers()
        }
    }, [isOpen])

    // WAIT: I need to import getUsers first. Retrying with multi_replace including import.

    const handleAssign = async () => {
        if (!selectedTeacherId) return

        setIsAssigning(true)
        try {
            await onAssign(selectedTeacherId, academicYear)
            onClose()
        } catch (error) {
            console.error("Assignment failed", error)
        } finally {
            setIsAssigning(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Assign Class Teacher</DialogTitle>
                    <DialogDescription>
                        Select a teacher to assign for the academic year <strong>{academicYear}</strong>.
                        This will replace the existing primary class teacher if one exists.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Select Teacher</Label>
                        <div className="border rounded-md">
                            <Command>
                                <CommandInput placeholder="Search teachers..." />
                                <CommandList>
                                    {isLoading ? (
                                        <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading teachers...
                                        </div>
                                    ) : (
                                        <>
                                            <CommandEmpty>No teachers found.</CommandEmpty>
                                            <CommandGroup>
                                                {teachers.map((teacher) => (
                                                    <CommandItem
                                                        key={teacher.id}
                                                        value={teacher.name} // Search by name
                                                        onSelect={() => setSelectedTeacherId(teacher.id)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedTeacherId === teacher.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{teacher.name}</span>
                                                            <span className="text-xs text-muted-foreground">{teacher.email}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </>
                                    )}
                                </CommandList>
                            </Command>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                        <strong>Warning:</strong> Changing a class teacher affects analytics, communication, and responsibility for this class.
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isAssigning}>
                        Cancel
                    </Button>
                    <Button onClick={handleAssign} disabled={!selectedTeacherId || isAssigning}>
                        {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Assign Teacher
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
