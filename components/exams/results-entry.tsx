"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Save, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const students = [
    { id: "1", name: "Alice Kamau", adm: "16701", marks: "78", grade: "A-" },
    { id: "2", name: "Brian Ochieng", adm: "16702", marks: "65", grade: "B" },
    { id: "3", name: "Cynthia Wanjiku", adm: "16703", marks: "82", grade: "A" },
    { id: "4", name: "David Kimani", adm: "16704", marks: "", grade: "-" },
    { id: "5", name: "Esther Nyambura", adm: "16705", marks: "55", grade: "C+" },
]

export default function ResultsEntry({ examId }: { examId: string }) {
    const router = useRouter()
    const [marksData, setMarksData] = useState(students)

    const handleMarkChange = (id: string, marks: string) => {
        // Simple mock grading logic
        let grade = "-"
        const score = parseInt(marks)
        if (!isNaN(score)) {
            if (score >= 80) grade = "A"
            else if (score >= 75) grade = "A-"
            else if (score >= 70) grade = "B+"
            else if (score >= 65) grade = "B"
            else if (score >= 60) grade = "B-"
            else if (score >= 55) grade = "C+"
            else if (score >= 50) grade = "C"
            else if (score >= 45) grade = "C-"
            else if (score >= 40) grade = "D+"
            else grade = "D" // simplified
        }

        setMarksData(marksData.map(s => s.id === id ? { ...s, marks, grade } : s))
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Enter Marks: End of Term 3 Exams</h1>
                        <p className="text-muted-foreground">Mathematics • Form 3A</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Select defaultValue="form-3a">
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="form-3a">Form 3A</SelectItem>
                            <SelectItem value="form-2b">Form 2B</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Marks
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
                                <TableHead className="w-[150px]">Score (%)</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Pos</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {marksData.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-mono">{student.adm}</TableCell>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={student.marks}
                                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                            className="w-20"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <span className={`font-bold ${student.grade.startsWith('A') ? 'text-green-600' : ''}`}>
                                            {student.grade}
                                        </span>
                                    </TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>
                                        <Input className="h-8 w-full min-w-[200px]" placeholder="Teacher's remarks..." />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
