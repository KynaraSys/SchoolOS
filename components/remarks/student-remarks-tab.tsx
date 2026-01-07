"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Remark, getLearnerRemarks, createLearnerRemark } from "@/lib/api-remarks"
import { getLearnerProfile, updateLearnerProfile } from "@/lib/api-learner-profile"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, Lock, UserCheck, School } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Mock Term ID for now - in production this comes from context
const CURRENT_TERM_ID = 1

interface RemarksTabProps {
    studentId: string
}

export function RemarksTab({ studentId }: RemarksTabProps) {
    const { user } = useAuth()
    const [remarks, setRemarks] = useState<Record<string, Remark[]>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newRemarkType, setNewRemarkType] = useState<Remark['type']>('formative')

    // Form State
    const [title, setTitle] = useState("")
    const [remarkText, setRemarkText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Profile Edit State
    const [profileForm, setProfileForm] = useState({
        strengths: '',
        areas_for_support: '',
        social_emotional_notes: '',
        talents_interests: '',
        teacher_general_remarks: ''
    })

    const fetchRemarks = async () => {
        try {
            const data = await getLearnerRemarks(studentId, CURRENT_TERM_ID)
            setRemarks(data)
        } catch (error) {
            console.error("Failed to fetch remarks", error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchProfileData = async () => {
        try {
            const data = await getLearnerProfile(studentId)
            setProfileForm({
                strengths: data.cbe_profile?.strengths || '',
                areas_for_support: data.cbe_profile?.areas_for_support || '',
                social_emotional_notes: data.cbe_profile?.social_emotional_notes || '',
                talents_interests: data.cbe_profile?.talents_interests || '',
                teacher_general_remarks: data.cbe_profile?.teacher_general_remarks || '',
            })
            // Also suggest the existing general remarks as the remark text if empty
            if (!remarkText && data.cbe_profile?.teacher_general_remarks) {
                setRemarkText(data.cbe_profile.teacher_general_remarks)
            }
        } catch (error) {
            console.error("Failed to fetch profile for editing", error)
        }
    }

    useEffect(() => {
        fetchRemarks()
    }, [studentId])

    useEffect(() => {
        if (isDialogOpen && newRemarkType === 'profile') {
            fetchProfileData()
        }
    }, [isDialogOpen, newRemarkType])

    const handleCreateRemark = async () => {
        if (newRemarkType !== 'profile' && !remarkText) return
        if (newRemarkType === 'profile' && !profileForm.teacher_general_remarks) {
            toast.error("General remark is required")
            return
        }

        setIsSubmitting(true)
        try {
            // If it's a profile remark, we first update the holistic learner profile
            if (newRemarkType === 'profile') {
                await updateLearnerProfile(studentId, profileForm)
            }

            // Then create the term remark entry
            // For profile type, the remark_text is the teacher_general_remarks
            const finalRemarkText = newRemarkType === 'profile' ? profileForm.teacher_general_remarks : remarkText

            await createLearnerRemark(studentId, {
                term_id: CURRENT_TERM_ID,
                type: newRemarkType,
                remark_text: finalRemarkText,
                title: title || undefined
            })

            toast.success("Remark added and profile updated successfully")
            setIsDialogOpen(false)

            // Reset form
            setRemarkText("")
            setTitle("")
            // We don't necessarily reset profileForm as it reflects the student's state

            fetchRemarks()
        } catch (error: any) {
            // Show specific error from backend (e.g. frequency limit)
            const msg = error.response?.data?.message || "Failed to add remark"
            toast.error(msg)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Permission Checks (Frontend mostly for UI hidding, backend enforces security)
    const canAddFormative = user?.roles?.includes("Teacher") || user?.roles?.includes("Admin")
    // For profile/report, we rely on backend validtion response if user tries, 
    // but ideally we check if they are THE class teacher. 
    // Simplified for UI:
    const canAddProfile = user?.roles?.includes("Teacher") || user?.roles?.includes("Admin")
    const canAddReport = user?.roles?.includes("Principal") || user?.roles?.includes("Head Teacher") || user?.roles?.includes("Admin")

    const formativeRemarks = remarks['formative'] || []
    const profileRemark = remarks['profile']?.[0]
    const reportRemark = remarks['report']?.[0]

    if (isLoading) return <div>Loading remarks...</div>

    return (
        <div className="space-y-6">

            {/* 1. Official Remarks Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Class Teacher Profile Remark */}
                <Card className="h-full">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <UserCheck className="h-5 w-5 text-primary" />
                                    Class Teacher's Remark
                                </CardTitle>
                                <CardDescription>Term Summary & Holistic Growth</CardDescription>
                            </div>
                            {/* Allow editing/updating even if one exists? Requirement implies 'Edit Profile' flow. 
                                Usually term remarks are one-off, but since this is merging 'Edit Profile', 
                                we might want to allow updating the 'Current Profile' even if a remark exists.
                                However, the 'Remark' itself is a history log. 
                                For now, we keep the 'Add' button if no remark exists OR allow adding a new version if allowed by backend policies.
                                User request was about 'Edit Profile' content being in 'Add Remark' modal. 
                            */}
                            {canAddProfile && (
                                <Button variant={profileRemark ? "outline" : "default"} size="sm" onClick={() => {
                                    setNewRemarkType('profile')
                                    setIsDialogOpen(true)
                                }}>
                                    {profileRemark ? "Update Profile / Add Remark" : "Add Remark"}
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {profileRemark ? (
                            <div className="space-y-4">
                                <p className="text-sm leading-relaxed">{profileRemark.remark_text}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                                    <span>By {profileRemark.author?.name}</span>
                                    <span>•</span>
                                    <span>{new Date(profileRemark.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                                <p>No profile remark for this term yet.</p>
                                <p className="text-xs mt-1">Class teacher needs to submit this before report generation.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Head Teacher Report Remark */}
                <Card className="h-full">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <School className="h-5 w-5 text-destructive" />
                                    Head Teacher's Remark
                                </CardTitle>
                                <CardDescription>Official Endorsement</CardDescription>
                            </div>
                            {!reportRemark && canAddReport && (
                                <Button variant="outline" size="sm" onClick={() => {
                                    setNewRemarkType('report')
                                    setIsDialogOpen(true)
                                }}>
                                    Add Remark
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {reportRemark ? (
                            <div className="space-y-4">
                                <p className="text-sm leading-relaxed italic">"{reportRemark.remark_text}"</p>
                                <div className="flex items-center justify-between text-xs pt-2 border-t">
                                    <span className="text-muted-foreground">By {reportRemark.author?.name}</span>
                                    <Badge variant={reportRemark.status === 'published' || reportRemark.status === 'approved' ? 'default' : 'secondary'}>
                                        {reportRemark.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                                <Lock className="h-8 w-8 mb-2 opacity-20" />
                                <p>Pending Head Teacher's Review</p>
                                <p className="text-xs mt-1">Requires Class Teacher's remark first.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* 2. Formative Feedback Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        Formative Assessment Feedback
                        <Badge variant="secondary">{formativeRemarks.length}</Badge>
                    </h3>
                    {canAddFormative && (
                        <Button size="sm" onClick={() => {
                            setNewRemarkType('formative')
                            setIsDialogOpen(true)
                        }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Feedback
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                        {formativeRemarks.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No formative feedback recorded for this term.
                            </div>
                        ) : (
                            formativeRemarks.map((remark) => (
                                <Card key={remark.id}>
                                    <CardHeader className="py-3 bg-muted/40">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-sm">{remark.title || "General Observation"}</h4>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(remark.created_at).toLocaleDateString()} by {remark.author?.name}
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">Subject Teacher</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="py-4 text-sm">
                                        {remark.remark_text}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Create Remark Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className={newRemarkType === 'profile' ? "max-w-2xl" : "max-w-md"}>
                    <DialogHeader>
                        <DialogTitle>
                            {newRemarkType === 'formative' && "Add Formative Feedback"}
                            {newRemarkType === 'profile' && "Update Profile & Add Remark"}
                            {newRemarkType === 'report' && "Add Official Report Remark"}
                        </DialogTitle>
                        <DialogDescription>
                            {newRemarkType === 'formative' && "Record ongoing observations and assessment feedback."}
                            {newRemarkType === 'profile' && "Update the learner's holistic profile. This will also save a new term remark."}
                            {newRemarkType === 'report' && "Final endorsement for the report card."}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[70vh]">
                        <div className="space-y-4 py-4 px-1">
                            {newRemarkType === 'formative' && (
                                <div className="space-y-2">
                                    <Label>Context / Title</Label>
                                    <Input
                                        placeholder="e.g. Mathematics Week 4, Science Project"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                            )}

                            {newRemarkType === 'profile' ? (
                                <>
                                    <div className="space-y-2">
                                        <Label>General Remarks (Term Summary)</Label>
                                        <Textarea
                                            placeholder="Overall comments on the learner's progress..."
                                            className="min-h-[100px]"
                                            value={profileForm.teacher_general_remarks}
                                            onChange={(e) => setProfileForm({ ...profileForm, teacher_general_remarks: e.target.value })}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            This text will be saved as the official Class Teacher's Remark for this term.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Strengths</Label>
                                            <Textarea
                                                placeholder="Key strengths..."
                                                value={profileForm.strengths}
                                                onChange={(e) => setProfileForm({ ...profileForm, strengths: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Areas for Support</Label>
                                            <Textarea
                                                placeholder="Areas needing improvement..."
                                                value={profileForm.areas_for_support}
                                                onChange={(e) => setProfileForm({ ...profileForm, areas_for_support: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Social & Emotional</Label>
                                            <Textarea
                                                placeholder="Social behavior notes..."
                                                value={profileForm.social_emotional_notes}
                                                onChange={(e) => setProfileForm({ ...profileForm, social_emotional_notes: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Talents & Interests</Label>
                                            <Textarea
                                                placeholder="Hobbies, clubs, talents..."
                                                value={profileForm.talents_interests}
                                                onChange={(e) => setProfileForm({ ...profileForm, talents_interests: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <Label>Remark Content</Label>
                                    <Textarea
                                        placeholder="Enter detailed feedback here..."
                                        className="h-32"
                                        value={remarkText}
                                        onChange={(e) => setRemarkText(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Please use competency-based language. Avoid grades or rankings.
                                    </p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateRemark} disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Remark"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
