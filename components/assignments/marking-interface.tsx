"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Clock, Save, Download, FileText, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock marking data
const initialSubmissions = [
    { id: "1", name: "Alice Kamau", adm: "16701", status: "submitted", submittedAt: "Dec 19, 4:30 PM", file: "algebra_hw.pdf", marks: "", feedback: "" },
    { id: "2", name: "Brian Ochieng", adm: "16702", status: "submitted", submittedAt: "Dec 20, 8:15 AM", file: "maths_brian.jpg", marks: "", feedback: "" },
    { id: "3", name: "Cynthia Wanjiku", adm: "16703", status: "submitted", submittedAt: "Dec 19, 5:00 PM", file: "cynthia_w.pdf", marks: "", feedback: "" },
    { id: "4", name: "David Kimani", adm: "16704", status: "pending", submittedAt: "-", file: null, marks: "", feedback: "" },
    { id: "5", name: "Esther Nyambura", adm: "16705", status: "late", submittedAt: "Dec 21, 9:00 AM", file: "esther_late.pdf", marks: "", feedback: "" },
]

export default function MarkingInterface({ assignmentId }: { assignmentId: string }) {
    const router = useRouter()
    const [submissions, setSubmissions] = useState(initialSubmissions)

    const [feedbackOpen, setFeedbackOpen] = useState(false)
    const [currentStudentId, setCurrentStudentId] = useState<string | null>(null)
    const [tempFeedback, setTempFeedback] = useState("")

    const updateMarks = (id: string, marks: string) => {
        setSubmissions(submissions.map(s => s.id === id ? { ...s, marks } : s))
    }

    const handleFeedbackClick = (studentId: string, currentFeedback: string) => {
        setCurrentStudentId(studentId)
        setTempFeedback(currentFeedback)
        setFeedbackOpen(true)
    }

    const saveFeedback = () => {
        if (currentStudentId) {
            setSubmissions(submissions.map(s => s.id === currentStudentId ? { ...s, feedback: tempFeedback } : s))
            setFeedbackOpen(false)
        }
    }

    const handleSave = () => {
        // Simulate save
        alert("Marks and feedback saved successfully!")
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent" onClick={() => router.back()}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back
                        </Button>
                    </div>
                    <h1 className="text-2xl font-bold">Marking: Algebraic Expressions Worksheet</h1>
                    <p className="text-muted-foreground">Form 3A • Mathematics • Due Dec 20, 2024</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                {/* Stats */}
                <Card className="md:col-span-4 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">0/5</div>
                        <p className="text-xs text-muted-foreground">Graded</p>
                        <div className="h-2 w-full bg-secondary mt-3 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-0"></div>
                        </div>
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Submitted</span>
                                <span className="font-semibold">4</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Pending</span>
                                <span>1</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Marking Table */}
                <Card className="md:col-span-4 lg:col-span-3">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Submission</TableHead>
                                    <TableHead className="w-[100px]">Marks / 30</TableHead>
                                    <TableHead>Feedback</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map((sub) => (
                                    <TableRow key={sub.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{sub.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{sub.name}</p>
                                                    <p className="text-xs text-muted-foreground">{sub.adm}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={sub.status === 'submitted' ? 'secondary' : sub.status === 'pending' ? 'outline' : 'destructive'}>
                                                {sub.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {sub.file ? (
                                                <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700">
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                className="h-8"
                                                type="number"
                                                max={30}
                                                value={sub.marks}
                                                onChange={(e) => updateMarks(sub.id, e.target.value)}
                                                disabled={!sub.file}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant={sub.feedback ? "secondary" : "ghost"}
                                                size="sm"
                                                disabled={!sub.file}
                                                onClick={() => handleFeedbackClick(sub.id, sub.feedback)}
                                                className={sub.feedback ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
                                            >
                                                {sub.feedback ? "Edit Feedback" : "Add Feedback"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Student Feedback</DialogTitle>
                        <DialogDescription>
                            Provide detailed comments for {submissions.find(s => s.id === currentStudentId)?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Comments</Label>
                            <Textarea
                                placeholder="Enter feedback here..."
                                className="min-h-[150px]"
                                value={tempFeedback}
                                onChange={(e) => setTempFeedback(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFeedbackOpen(false)}>Cancel</Button>
                        <Button onClick={saveFeedback}>Save Feedback</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
