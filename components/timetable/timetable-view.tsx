"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Download, Printer, ChevronLeft, ChevronRight } from "lucide-react"

export default function TimetableView() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const times = ["8:00 AM", "9:00 AM", "10:00 AM", "10:30 AM", "11:30 AM", "12:30 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

    // Mock Schedule Data
    const schedule = [
        { day: "Monday", time: "8:00 AM", subject: "Math", class: "Form 3A", room: "204", color: "bg-blue-100 border-blue-200 text-blue-700" },
        { day: "Monday", time: "11:30 AM", subject: "Math", class: "Form 4A", room: "204", color: "bg-blue-100 border-blue-200 text-blue-700" },
        { day: "Monday", time: "2:00 PM", subject: "Math", class: "Form 2B", room: "204", color: "bg-blue-100 border-blue-200 text-blue-700" },

        { day: "Tuesday", time: "9:00 AM", subject: "Math", class: "Form 2B", room: "204", color: "bg-blue-100 border-blue-200 text-blue-700" },
        { day: "Tuesday", time: "11:30 AM", subject: "Math", class: "Form 3A", room: "204", color: "bg-blue-100 border-blue-200 text-blue-700" },

        { day: "Wednesday", time: "8:00 AM", subject: "Math", class: "Form 4A", room: "204", color: "bg-blue-100 border-blue-200 text-blue-700" },
        { day: "Wednesday", time: "10:30 AM", subject: "Math", class: "Form 2B", room: "204", color: "bg-blue-100 border-blue-200 text-blue-700" },
        { day: "Wednesday", time: "2:00 PM", subject: "Club", class: "Math Club", room: "Hall", color: "bg-purple-100 border-purple-200 text-purple-700" },

        { day: "Thursday", time: "8:00 AM", subject: "Math", class: "Form 3A", room: "204", color: "bg-blue-100 border-blue-200 text-blue-700" },
        { day: "Thursday", time: "10:30 AM", subject: "Math", class: "Form 2B", room: "204", color: "bg-blue-100 border-blue-200 text-blue-700" },
        { day: "Thursday", time: "2:00 PM", subject: "Math", class: "Form 4A", room: "204", color: "bg-blue-100 border-blue-200 text-blue-700" },

        { day: "Friday", time: "9:00 AM", subject: "Math", class: "Form 4A", room: "204", color: "bg-blue-100 border-blue-200 text-blue-700" },
        { day: "Friday", time: "11:30 AM", subject: "Math", class: "Form 3A", room: "204", color: "bg-blue-100 border-blue-200 text-blue-700" },
        { day: "Friday", time: "2:00 PM", subject: "Staff", class: "Meeting", room: "Staff Room", color: "bg-yellow-100 border-yellow-200 text-yellow-700" },
    ]

    const getLesson = (day: string, time: string) => {
        return schedule.find(s => s.day === day && s.time === time)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold">My Timetable</h1>
                    <p className="text-muted-foreground mt-1">Weekly schedule • Term 3, 2024</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between pb-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold">Dec 16 - Dec 20, 2024</span>
                        <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <Badge variant="outline">Week 9</Badge>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Header Row */}
                        <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr] border-b bg-muted/10">
                            <div className="p-4 border-r font-medium text-sm text-muted-foreground text-center">Time</div>
                            {days.map(day => (
                                <div key={day} className="p-4 border-r font-semibold text-center last:border-r-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Time Rows */}
                        {times.map((time, index) => (
                            <div key={time} className={`grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr] border-b last:border-b-0 ${time === '10:00 AM' || time === '12:30 PM' ? 'bg-muted/5' : ''}`}>
                                <div className="p-4 border-r text-sm text-muted-foreground text-center flex items-center justify-center">
                                    {time}
                                </div>
                                {
                                    time === '10:00 AM' ? (
                                        <div className="col-span-5 p-4 flex items-center justify-center text-muted-foreground font-medium bg-muted/5 text-sm uppercase tracking-widest">
                                            Break
                                        </div>
                                    ) : time === '12:30 PM' ? (
                                        <div className="col-span-5 p-4 flex items-center justify-center text-muted-foreground font-medium bg-muted/5 text-sm uppercase tracking-widest">
                                            Lunch Break
                                        </div>
                                    ) : (
                                        days.map(day => {
                                            const lesson = getLesson(day, time)
                                            return (
                                                <div key={`${day}-${time}`} className="p-2 border-r last:border-r-0 min-h-[100px]">
                                                    {lesson ? (
                                                        <div className={`h-full rounded-md p-3 border ${lesson.color} flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer`}>
                                                            <div className="font-semibold text-sm">{lesson.subject}</div>
                                                            <div className="text-xs">
                                                                <div className="font-medium mb-1">{lesson.class}</div>
                                                                <div className="opacity-80 flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" /> {lesson.room}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )
                                        })
                                    )
                                }
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
