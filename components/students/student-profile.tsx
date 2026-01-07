import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { getLearnerProfile, updateLearnerProfile, LearnerProfile } from "@/lib/api-learner-profile"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CalendarDays, Phone, Mail, MapPin, User, Loader2, BookOpen, GraduationCap, Heart, Star, FileText, ShieldCheck, TrendingUp } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RemarksTab } from "@/components/remarks/student-remarks-tab"
import { GuardianCard } from "@/components/students/student-guardian-card"
import { RetentionTab } from "@/components/students/student-retention-tab"

export default function StudentProfile({ studentId }: { studentId: string }) {
    const { hasRole } = useAuth()
    const isTeacher = hasRole("teacher")
    const [profile, setProfile] = useState<LearnerProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Edit state
    // Edit state (Core Details only)
    const [editForm, setEditForm] = useState({
        special_needs: '',
        upi: '',
        enrollment_status: ''
    })

    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Sanitize ID in case of legacy URL patterns (e.g. s-123)
                const cleanId = studentId.replace(/^s-/, '')
                const data = await getLearnerProfile(cleanId)
                setProfile(data)
                // Initialize form with existing data
                setEditForm({
                    special_needs: data.student.special_needs || '',
                    upi: data.student.upi || '',
                    enrollment_status: data.student.enrollment_status || 'active'
                })
            } catch (error) {
                console.error("Failed to fetch learner profile", error)
                toast.error("Failed to load profile data")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [studentId])

    const handleSaveCoreDetails = async () => {
        setIsSaving(true)
        try {
            const cleanId = studentId.replace(/^s-/, '')
            await updateLearnerProfile(cleanId, editForm)
            toast.success("Profile updated successfully")
            // refresh data
            const data = await getLearnerProfile(cleanId)
            setProfile(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to save profile")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (!profile) {
        return <div className="text-center p-8">Learner not found</div>
    }

    const { student } = profile

    return (
        <div className="space-y-6">
            {/* Header / BIO Card */}
            <Card className="overflow-hidden bg-gradient-to-br from-card to-muted/20 border-primary/10">
                <div className="px-6 py-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                            <AvatarImage src={student.profile_image || "/placeholder-student.svg"} className="object-cover" />
                            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
                                <Badge variant={
                                    student.retention_status === 'anonymized' ? 'outline' :
                                        student.retention_status === 'archived' ? 'secondary' :
                                            student.enrollment_status === 'active' ? 'default' : 'secondary'
                                } className="uppercase text-xs"
                                >
                                    {student.retention_status === 'anonymized' ? 'Anonymized' :
                                        student.retention_status === 'archived' ? 'Archived' :
                                            student.enrollment_status || 'Active'}
                                </Badge>
                                {student.upi && <Badge variant="outline" className="font-mono">UPI: {student.upi}</Badge>}
                                {student.learning_pathway && (
                                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 border-indigo-200">
                                        {student.learning_pathway}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                                <div className="flex items-center gap-1.5">
                                    <User className="h-4 w-4" />
                                    <span>{student.admission_number}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <BookOpen className="h-4 w-4" />
                                    <span>
                                        {student.school_class
                                            ? `${student.school_class.name} ${student.school_class.stream || ''}`
                                            : 'No Class Assigned'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>{student.dob || 'DOB Not set'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <User className="h-4 w-4" />
                                    <span>{student.gender}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[140px]">
                            {!isTeacher && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full" disabled={student.retention_status === 'archived' || student.retention_status === 'anonymized'}>
                                            Edit Details
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Update Core Details</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label>Unique Personal Identifier (UPI)</Label>
                                                <Input
                                                    value={editForm.upi}
                                                    onChange={(e) => setEditForm({ ...editForm, upi: e.target.value })}
                                                    placeholder="Enter NEMIS UPI"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Special Needs / Medical Conditions</Label>
                                                <Textarea
                                                    value={editForm.special_needs}
                                                    onChange={(e) => setEditForm({ ...editForm, special_needs: e.target.value })}
                                                    placeholder="Describe any special needs or conditions..."
                                                />
                                            </div>
                                            <Button onClick={handleSaveCoreDetails} disabled={isSaving}>
                                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                                Save Changes
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                            <Button variant="outline" className="w-full" onClick={() => router.push(`/communication?recipientId=${student.user_id || ''}`)}>
                                Message Parent
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-background border p-1 h-auto flex-wrap justify-start">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="competency">Competency Progress</TabsTrigger>
                    <TabsTrigger value="evidence">Evidence Portfolio</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance & Engagement</TabsTrigger>
                    <TabsTrigger value="contact">Family & Contact</TabsTrigger>
                    <TabsTrigger value="official-remarks">Remarks & Feedback</TabsTrigger>

                    <TabsTrigger value="discipline">Discipline</TabsTrigger>
                    {!isTeacher && <TabsTrigger value="retention">Data Retention</TabsTrigger>}
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-500">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-amber-500" />
                                    Strengths & Abilities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {profile.cbe_profile?.strengths || 'No strengths recorded yet.'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-rose-500" />
                                    Talents & Interests
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {profile.cbe_profile?.talents_interests || 'No talents recorded yet.'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Areas for Support</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {profile.cbe_profile?.areas_for_support || 'No support areas recorded.'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Social & Emotional Development</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {profile.cbe_profile?.social_emotional_notes || 'No notes available.'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CBC Assessment Snapshot */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg text-blue-900">Latest Assessment Status</CardTitle>
                                <CardDescription>Current performance indication based on recent observations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-blue-100">
                                        ME
                                    </div>
                                    <div className="space-y-1">
                                        <div className="font-semibold text-blue-900">Meeting Expectations</div>
                                        <div className="text-sm text-blue-700">Student is consistently demonstrating the required competencies for this level.</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center justify-center h-full py-2">
                                    <div className="text-green-600 flex items-center gap-1 font-bold">
                                        <TrendingUp className="h-5 w-5" />
                                        <span>Improving</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground mt-1">vs Last Term</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {!isTeacher && student.special_needs && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h3 className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Special Needs / Medical Information
                            </h3>
                            <p className="text-amber-700">{student.special_needs}</p>
                        </div>
                    )}
                </TabsContent>

                {/* COMPETENCY PROGRESS TAB */}
                <TabsContent value="competency" className="space-y-6 animate-in fade-in-50 duration-500">
                    <Card>
                        <CardHeader>
                            <CardTitle>Competency Mastery Overview</CardTitle>
                            <CardDescription>Progress across core competencies</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3 mb-8">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                                    <div className="text-3xl font-bold text-green-600">{profile.competency_progress.mastered_count}</div>
                                    <div className="text-sm text-green-800 font-medium">Mastering</div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                                    <div className="text-3xl font-bold text-blue-600">{profile.competency_progress.in_progress_count}</div>
                                    <div className="text-sm text-blue-800 font-medium">Developing</div>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-center">
                                    <div className="text-3xl font-bold text-orange-600">{profile.competency_progress.emerging_count}</div>
                                    <div className="text-sm text-orange-800 font-medium">Emerging</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {profile.competency_progress.breakdown.map((item: any, idx: number) => (
                                    <div key={idx} className="flex flex-col p-4 border rounded-lg hover:bg-muted/30 transition-colors bg-card">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-base">{item.area}</span>
                                            <Badge variant={item.level === 'Mastering' || item.level === 'Meeting' ? 'default' : item.level === 'Developing' ? 'secondary' : 'outline'}>
                                                {item.level}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                            {item.remarks || "No remarks recorded."}
                                        </p>
                                        {item.evidence_count > 0 && (
                                            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded w-fit">
                                                <FileText className="h-3 w-3" />
                                                {item.evidence_count} Evidence Items
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* EVIDENCE PORTFOLIO TAB */}
                <TabsContent value="evidence" className="animate-in fade-in-50 duration-500">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {profile.evidence_portfolio.length > 0 ? (
                            profile.evidence_portfolio.map((item: any) => (
                                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-video bg-muted relative">
                                        {/* Placeholder for image/media */}
                                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                        <Badge className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 backdrop-blur-md border-none text-white">
                                            {item.type}
                                        </Badge>
                                    </div>
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-base truncate">{item.title}</CardTitle>
                                        <CardDescription>{new Date(item.date).toLocaleDateString()}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {item.competencies.map((c: string, i: number) => (
                                                <span key={i} className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground border">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                <p>No evidenced items uploaded yet.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* ATTENDANCE TAB */}
                <TabsContent value="attendance" className="animate-in fade-in-50 duration-500">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Attendance Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center p-6">
                                    <div className="text-center">
                                        <div className="text-5xl font-bold text-primary mb-2">{profile.attendance_summary.present}%</div>
                                        <p className="text-muted-foreground">Present Rate</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="p-3 bg-destructive/10 rounded-lg text-center">
                                        <div className="font-bold text-destructive">{profile.attendance_summary.absent}</div>
                                        <div className="text-xs text-muted-foreground">Days Absent</div>
                                    </div>
                                    <div className="p-3 bg-orange-100 rounded-lg text-center">
                                        <div className="font-bold text-orange-700">{profile.attendance_summary.late}</div>
                                        <div className="text-xs text-muted-foreground font-medium text-orange-800/70">Days Late</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Add engagement charts here later */}
                    </div>
                </TabsContent>

                {/* FAMILY & CONTACT TAB */}
                <TabsContent value="contact" className="animate-in fade-in-50 duration-500">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {student.guardians && student.guardians.length > 0 ? (
                            student.guardians.map((guardian: any) => (
                                <GuardianCard key={guardian.id} guardian={guardian} studentId={studentId} />
                            ))
                        ) : (
                            <div className="col-span-full">
                                <Card>
                                    <CardContent className="py-8 text-center text-muted-foreground">
                                        <p>No guardian information linked to this learner.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        <Card className="bg-muted/30 border-dashed col-span-full md:col-span-1">
                            <CardContent className="flex flex-col items-center justify-center py-8 h-full">
                                <ShieldCheck className="h-8 w-8 text-muted-foreground/50 mb-2" />
                                <p className="text-sm font-medium text-muted-foreground">Strict Privacy Controls Active</p>
                                <p className="text-xs text-muted-foreground/70 text-center mt-1">
                                    Contact details are restricted based on your role.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* OFFICIAL REMARKS TAB (NEW SYSTEM) */}
                <TabsContent value="official-remarks" className="animate-in fade-in-50 duration-500">
                    <RemarksTab studentId={studentId.replace(/^s-/, '')} />
                </TabsContent>



                {/* DISCIPLINE TAB */}
                <TabsContent value="discipline" className="animate-in fade-in-50 duration-500">
                    <Card>
                        <CardHeader>
                            <CardTitle>Disciplinary Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-4">{profile.discipline_summary.total_incidents} <span className="text-base font-normal text-muted-foreground">Total Incidents</span></div>
                            <div className="space-y-4">
                                {profile.discipline_summary.recent_incidents.map((inc: any) => (
                                    <div key={inc.id} className="p-3 border rounded-lg bg-muted/20">
                                        <div className="font-semibold">{inc.title}</div>
                                        <p className="text-sm text-muted-foreground">{inc.description}</p>
                                        <div className="text-xs mt-2 text-muted-foreground">{new Date(inc.occurred_at).toLocaleDateString()} • {inc.severity}</div>
                                    </div>
                                ))}
                                {profile.discipline_summary.recent_incidents.length === 0 && (
                                    <p className="text-muted-foreground">No disciplinary incidents recorded.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* DATA RETENTION TAB */}
                {!isTeacher && (
                    <TabsContent value="retention" className="animate-in fade-in-50 duration-500">
                        <RetentionTab
                            studentId={studentId.replace(/^s-/, '')}
                            retentionStatus={student.retention_status || (student.enrollment_status === 'active' ? 'active' : 'archived')}
                            archivedAt={student.archived_at}
                            anonymizedAt={student.anonymized_at}
                            onUpdate={() => {
                                // Re-fetch profile data
                                const cleanId = studentId.replace(/^s-/, '')
                                getLearnerProfile(cleanId).then(data => setProfile(data))
                            }}
                        />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
