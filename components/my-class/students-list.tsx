"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, AlertTriangle, TrendingUp, TrendingDown, MoreHorizontal, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

import { ReportIssueDialog } from "./report-issue-dialog"

export default function StudentsList() {
    const [searchTerm, setSearchTerm] = useState("")
    const [riskFilter, setRiskFilter] = useState("all")
    const [selectedStudentForReport, setSelectedStudentForReport] = useState<{ name: string, id: string } | null>(null)

    // Mock Data
    const students = [
        { id: "STU001", name: "David Kimani", adm: "1402", risk: "High", attendance: 78, mean: "C-", forecast: "D+", trend: "down" },
        { id: "STU002", name: "Sarah Omondi", adm: "1405", risk: "Medium", attendance: 92, mean: "B", forecast: "B+", trend: "up" },
        { id: "STU003", name: "James Mwangi", adm: "1410", risk: "Medium", attendance: 85, mean: "C", forecast: "C", trend: "stable" },
        { id: "STU004", name: "Esther Nyambura", adm: "1350", risk: "Low", attendance: 98, mean: "A-", forecast: "A", trend: "up" },
        { id: "STU005", name: "Brian Ochieng", adm: "1422", risk: "High", attendance: 81, mean: "D+", forecast: "D", trend: "down" },
        { id: "STU006", name: "Alice Wanjiku", adm: "1399", risk: "Low", attendance: 96, mean: "B+", forecast: "B+", trend: "stable" },
    ]

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.adm.includes(searchTerm)
        const matchesRisk = riskFilter === "all" || student.risk.toLowerCase() === riskFilter.toLowerCase()
        return matchesSearch && matchesRisk
    })

    return (
        <div className="space-y-6">
            <ReportIssueDialog
                open={!!selectedStudentForReport}
                onOpenChange={(open) => !open && setSelectedStudentForReport(null)}
                studentName={selectedStudentForReport?.name || ""}
                studentId={selectedStudentForReport?.id || ""}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manage Students</h1>
                    <p className="text-muted-foreground">Form 4 Mars • {students.length} Students</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        Export List
                    </Button>
                    <Button>
                        Add Student
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>Class List</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or adm..."
                                    className="pl-8 w-[250px]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={riskFilter} onValueChange={setRiskFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <SelectValue placeholder="All Risks" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Risks</SelectItem>
                                    <SelectItem value="high">High Risk</SelectItem>
                                    <SelectItem value="medium">Medium Risk</SelectItem>
                                    <SelectItem value="low">Low Risk</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Adm No</TableHead>
                                <TableHead>Risk Profile</TableHead>
                                <TableHead>Attendance</TableHead>
                                <TableHead>Performance</TableHead>
                                <TableHead>Forecast</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                                                <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{student.name}</div>
                                                <div className="text-xs text-muted-foreground">Form 4 Mars</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono">{student.adm}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`
                            ${student.risk === 'High' ? 'border-destructive text-destructive bg-destructive/10' : ''}
                            ${student.risk === 'Medium' ? 'border-orange-500 text-orange-500 bg-orange-500/10' : ''}
                            ${student.risk === 'Low' ? 'border-green-500 text-green-500 bg-green-500/10' : ''}
                        `}
                                        >
                                            {student.risk} Risk
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold ${student.attendance < 85 ? 'text-destructive' : 'text-green-600'}`}>
                                                {student.attendance}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold">{student.mean}</span>
                                            <span className="text-xs text-muted-foreground">Mean Grade</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">{student.forecast}</span>
                                            {student.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                                            {student.trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive" />}
                                            {student.trend === 'stable' && <span className="text-xs text-muted-foreground">-</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/students/${student.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" /> View Profile
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onSelect={() => setSelectedStudentForReport({ name: student.name, id: student.id })}>
                                                    <AlertTriangle className="mr-2 h-4 w-4" /> Report Issue
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Contact Parent
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
