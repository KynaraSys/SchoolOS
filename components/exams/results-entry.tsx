"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Save, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { getStudents } from "@/lib/api-users"
import { assessmentApi } from "@/lib/api-assessment"

// const students = [...] // Removed mock data

export default function ResultsEntry({ examId }: { examId: string }) {
    const router = useRouter()
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [marksData, setMarksData] = useState<Record<string, { score: string, remarks: string }>>({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch students for Form 3A (mocked class ID or param)
                // ideally passed via props or context
                const data = await getStudents({ class_id: 1 });
                // Filter if API doesn't filter, but we updated API to filter.
                // Assuming data is array
                setStudents(Array.isArray(data) ? data : (data as any).data || []);
                setLoading(false)
            } catch (error) {
                console.error("Failed to fetch students", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const calculateIndicator = (val: string) => {
        const score = parseFloat(val)
        if (isNaN(score)) return null
        if (score >= 90) return { label: 'EE1', color: 'bg-green-700' }
        if (score >= 75) return { label: 'EE2', color: 'bg-green-600' }
        if (score >= 58) return { label: 'ME1', color: 'bg-blue-600' }
        if (score >= 41) return { label: 'ME2', color: 'bg-blue-500' }
        if (score >= 31) return { label: 'AE1', color: 'bg-amber-500' }
        if (score >= 21) return { label: 'AE2', color: 'bg-amber-600' }
        if (score >= 11) return { label: 'BE1', color: 'bg-red-500' }
        return { label: 'BE2', color: 'bg-red-600' }
    }

    const handleMarkChange = (id: string, field: 'score' | 'remarks', value: string) => {
        setMarksData(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const promises = Object.entries(marksData).map(([studentId, data]) => {
                const score = parseFloat(data.score)
                if (isNaN(score)) return Promise.resolve()

                return assessmentApi.storeAssessment({
                    student_id: parseInt(studentId),
                    subject_id: 1, // Default Math
                    assessment_type: 'hybrid',
                    tool_type: 'written_test',
                    raw_score: score,
                    teacher_remarks: data.remarks,
                    assessed_at: new Date().toISOString()
                })
            })

            await Promise.all(promises)
            alert("Assessments saved successfully!")
            router.back()
        } catch (error) {
            console.error(error)
            alert("Failed to save assessments")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div>Loading students...</div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Assessment Entry: Mathematics</h1>
                        <p className="text-muted-foreground">Form 3A • Term 3</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Assessments'}
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ADM No</TableHead>
                                <TableHead className="w-[300px]">Student Name</TableHead>
                                <TableHead className="w-[150px]">Score (Hybrid)</TableHead>
                                <TableHead>CBE Indicator</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => {
                                const data = marksData[student.id] || { score: '', remarks: '' }
                                const indicator = calculateIndicator(data.score)

                                return (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-mono">{student.admission_number}</TableCell>
                                        <TableCell className="font-medium">{student.first_name} {student.last_name}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={data.score}
                                                onChange={(e) => handleMarkChange(student.id, 'score', e.target.value)}
                                                className="w-20"
                                                min={0}
                                                max={100}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {indicator ? (
                                                <span className={`px-2 py-1 rounded text-white text-xs font-bold ${indicator.color}`}>
                                                    {indicator.label}
                                                </span>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={data.remarks}
                                                onChange={(e) => handleMarkChange(student.id, 'remarks', e.target.value)}
                                                className="h-8 w-full min-w-[200px]"
                                                placeholder="Teacher's remarks..."
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
