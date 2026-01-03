import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getStudentProfile, deleteStudent } from "@/lib/api-users"
import { getIncidents, updateIncident, Incident } from "@/lib/api-discipline"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CalendarDays, GraduationCap, FileWarning, Phone, Mail, MapPin, Receipt, Loader2, DollarSign, User, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { StudentForm } from "@/components/students/student-form"
import { GuardianManagement } from "@/components/guardians/guardian-management"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReportIssueModal } from "@/components/discipline/report-issue-modal"

export default function StudentProfile({ studentId }: { studentId: string }) {
    const [student, setStudent] = useState<any>(null)
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)


    const router = useRouter()

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const data = await getStudentProfile(studentId)
                setStudent(data)

                if (data.student?.id) {
                    const incidentsData = await getIncidents(data.student.id)
                    setIncidents(incidentsData)
                }
            } catch (error) {
                console.error("Failed to fetch student data", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchStudent()
    }, [studentId])

    const fetchStudentIncidents = async () => {
        if (student?.student?.id) {
            try {
                const incidentsData = await getIncidents(student.student.id)
                setIncidents(incidentsData)
            } catch (error) {
                console.error("Failed to fetch incidents", error)
            }
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteStudent(studentId)
            router.push('/students')
        } catch (error) {
            console.error("Failed to delete student", error)
            alert("Failed to delete student")
            setIsDeleting(false)
        }
    }



    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (!student) {
        return <div className="text-center p-8">Student not found</div>
    }

    // Calculate Fees from Real Data
    const feeTotal = 45000; // Fixed term fee for demo
    const payments = student.student?.payments || [];
    const feePaid = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
    const feeBalance = feeTotal - feePaid;
    const feeStatus = feeBalance <= 0 ? 'Cleared' : feeBalance < 10000 ? 'Partial' : 'Pending';

    return (
        <div className="space-y-6">
            <ReportIssueModal
                open={isReportModalOpen}
                onOpenChange={setIsReportModalOpen}
                onSuccess={fetchStudentIncidents}
                preselectedStudent={{
                    id: student.student?.id,
                    name: student.name,
                    admission_number: student.student?.admission_number || 'N/A'
                }}
            />
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Student Record?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete <strong>{student.name}</strong> and remove all associated data including academic records and fee history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Profile Header */}
            <Card className="overflow-hidden">
                <div className="px-6 py-6">
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={student.profile_image || "/placeholder-student.jpg"} className="object-cover" />
                                <AvatarFallback className="text-xl">{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="mb-1">
                                <h1 className="text-xl font-bold">{student.name}</h1>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>ADM: {student.student?.admission_number || 'N/A'}</span>
                                    <span>•</span>
                                    <span>
                                        {student.student?.school_class
                                            ? `${student.student.school_class.name} ${student.student.school_class.stream || ''}`
                                            : 'Class Not Assigned'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
                            <Button variant="outline" size="sm">Message Parent</Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="bg-amber-500 hover:bg-amber-600 text-white border-amber-600 hover:shadow-[0_0_15px_rgba(245,158,11,0.6)] transition-all duration-300"
                                    >
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Edit Student Profile</DialogTitle>
                                    </DialogHeader>
                                    <StudentForm
                                        studentId={studentId}
                                        initialData={student}
                                        onSuccess={() => {
                                            // Ideally we should refetch here, but for now a reload works or we pass a refetch callback
                                            window.location.reload()
                                        }}
                                    />
                                </DialogContent>
                            </Dialog>

                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowDeleteDialog(true)}
                                className="gap-2"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm min-w-0">
                            <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">DOB: {student.student?.dob || 'Not set'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm min-w-0">
                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{student.phone || 'No Phone'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm min-w-0">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm min-w-0">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{student.student?.address || 'No Address'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm min-w-0">
                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">Parent: {student.student?.parent_email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm min-w-0">
                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">Gender: {student.student?.gender || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Details Tabs */}
            <Tabs defaultValue="fees" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="fees">Fees & Payments</TabsTrigger>
                    <TabsTrigger value="guardians">Parents & Guardians</TabsTrigger>
                    <TabsTrigger value="academic">Academic Performance</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance History</TabsTrigger>
                    <TabsTrigger value="discipline">Discipline</TabsTrigger>
                </TabsList>

                <TabsContent value="fees">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Fee Balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${feeBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    KES {feeBalance.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">Due Date: 30 Dec 2024</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">KES {feePaid.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    {payments.length > 0 ? `Last payment: ${payments[payments.length - 1].payment_date}` : 'No payments yet'}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">KES {feeTotal.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">Term 3 2024</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Fee Structure & History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="py-2">Description</th>
                                        <th className="py-2">Date</th>
                                        <th className="py-2">Amount (KES)</th>
                                        <th className="py-2">Method</th>
                                        <th className="py-2">Ref</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b bg-muted/20">
                                        <td className="py-3 font-medium">Tuition Fees - Term 3</td>
                                        <td>01 Sep 2024</td>
                                        <td>30,000</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                                    <tr className="border-b bg-muted/20">
                                        <td className="py-3 font-medium">Lunch Program</td>
                                        <td>01 Sep 2024</td>
                                        <td>15,000</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                                    {payments.map((payment: any) => (
                                        <tr key={payment.id} className="border-b hover:bg-muted/50">
                                            <td className="py-3">
                                                <div className="flex flex-col">
                                                    <span>Payment - {payment.type}</span>
                                                    <span className="text-xs text-muted-foreground">{payment.description}</span>
                                                </div>
                                            </td>
                                            <td>{payment.payment_date}</td>
                                            <td className="text-green-600 font-medium">-{Number(payment.amount).toLocaleString()}</td>
                                            <td><Badge variant="outline">{payment.method}</Badge></td>
                                            <td className="font-mono text-xs">{payment.transaction_reference || '-'}</td>
                                        </tr>
                                    ))}
                                    {payments.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-4 text-center text-muted-foreground">No payments recorded</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="academic">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subject Performance (Mock)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Performance data integration pending...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="attendance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Risk Assessment</CardTitle>
                            <CardDescription>AI-Powered Early Warning System</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {student.student?.current_risk ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Current Risk Score</p>
                                            <div className="flex items-baseline gap-2">
                                                <h2 className="text-3xl font-bold">{student.student.current_risk.risk_score}</h2>
                                                <span className="text-muted-foreground">/ 100</span>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={student.student.current_risk.risk_level === 'high' ? 'destructive' : 'outline'}
                                            className={`px-4 py-1 text-lg ${student.student.current_risk.risk_level === 'medium' ? 'bg-yellow-500 text-white border-none' : ''} ${student.student.current_risk.risk_level === 'low' ? 'bg-green-500 text-white border-none' : ''}`}
                                        >
                                            {student.student.current_risk.risk_level.toUpperCase()} RISK
                                        </Badge>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">Contributing Factors</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                {Object.entries(student.student.current_risk.primary_factors || {}).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between text-sm">
                                                        <span className="capitalize text-muted-foreground">{key.replace(/_/g, ' ')}</span>
                                                        <span className="font-medium">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">Trend Analysis</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Analysis based on last evaluation at {new Date(student.student.current_risk.last_evaluated_at).toLocaleDateString()}
                                                </p>
                                                {/* Placeholder for chart */}
                                                <div className="h-24 bg-muted/20 rounded flex items-center justify-center text-xs text-muted-foreground">
                                                    Trend Visualization
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No risk assessment available for this term.</p>
                                    <p className="text-xs mt-2">Run 'php artisan attendance:calculate-risk' to generate.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="discipline">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Disciplinary Record</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                                    onClick={() => setIsReportModalOpen(true)}
                                >
                                    <FileWarning className="h-3.5 w-3.5 mr-2" />
                                    Log Incident
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {incidents.length > 0 ? (
                                <div className="space-y-4">
                                    {incidents.map((incident) => (
                                        <div key={incident.id} className="border p-4 rounded-lg">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                                                <div>
                                                    <h4 className="font-semibold text-lg">{incident.title}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        <CalendarDays className="h-3.5 w-3.5" />
                                                        <span>{new Date(incident.occurred_at).toLocaleDateString()}</span>
                                                        <span className="text-xs border px-1.5 rounded bg-muted/50 uppercase">{incident.severity}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 w-full md:w-auto">
                                                    <Badge variant={
                                                        incident.status === 'resolved' ? 'default' :
                                                            incident.status === 'dismissed' ? 'secondary' :
                                                                incident.status === 'escalated' ? 'destructive' : 'outline'
                                                    } className="capitalize">
                                                        {incident.status}
                                                    </Badge>

                                                    {/* Review button removed as requested */}
                                                </div>
                                            </div>

                                            <div className="bg-muted/10 p-3 rounded-md mb-2">
                                                <p className="text-sm">{incident.description}</p>

                                                {incident.action_taken && (
                                                    <div className="mb-2 text-sm">
                                                        <span className="font-medium text-muted-foreground">Action Taken: </span>
                                                        <span>{incident.action_taken}</span>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
                                                    <span>Reporter: {incident.reporter?.name || 'System / Unknown'}</span>
                                                    <span>Recorded: {new Date(incident.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    <FileWarning className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                    <p>No active disciplinary records found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="guardians">
                    <GuardianManagement studentId={studentId} />
                </TabsContent>
            </Tabs >
        </div >
    )
}
