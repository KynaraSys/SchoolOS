"use client"

import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs"
import { MessageSquare, Layout, Clock, FileText, BarChart, Plus, Paperclip, MoreHorizontal, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function TaskBoard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Project Tasks</h1>
                <p className="text-muted-foreground">Manage ongoing tasks, track progress, and collaborate with the team.</p>
            </div>

            <ModernTabs defaultValue="board">
                <ModernTabsList>
                    <ModernTabsTrigger value="chat" icon={MessageSquare}>Chat</ModernTabsTrigger>
                    <ModernTabsTrigger value="board" icon={Layout}>Task Board</ModernTabsTrigger>
                    <ModernTabsTrigger value="timeline" icon={Clock}>Timeline</ModernTabsTrigger>
                    <ModernTabsTrigger value="calendar" icon={Clock}>Calendar</ModernTabsTrigger>
                    <ModernTabsTrigger value="reports" icon={BarChart}>Reports</ModernTabsTrigger>
                </ModernTabsList>

                <ModernTabsContent value="board" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content - Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-none shadow-sm bg-background">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-semibold">Task Board View</h2>
                                            <Badge variant="destructive" className="font-semibold">URGENT</Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Due: Oct 24, 2024
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Owners:</div>
                                        <div className="flex -space-x-2">
                                            <Avatar className="w-8 h-8 border-2 border-background">
                                                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <Avatar className="w-8 h-8 border-2 border-background">
                                                <AvatarImage src="/avatars/02.png" alt="@shadcn" />
                                                <AvatarFallback>JD</AvatarFallback>
                                            </Avatar>
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                                                +3
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Description</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            We need to finalize the user interface for the new dashboard module.
                                            This involves reviewing the wireframes, conducting a quick usability test with the internal team,
                                            and exporting the assets for the development team. Ensure all accessibility guidelines are met.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {["Wireframing", "View Explorations", "Report", "Sketching", "Finalizing"].map((tag, i) => (
                                            <Badge key={i} variant="secondary" className="px-3 py-1 font-normal text-muted-foreground bg-gray-100 hover:bg-gray-200">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Chat Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Comments</h3>

                                        <div className="space-y-4">
                                            {/* Message 1 */}
                                            <div className="flex gap-3">
                                                <Avatar className="w-8 h-8 mt-1">
                                                    <AvatarFallback>JD</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-sm">John Doe</span>
                                                        <span className="text-xs text-muted-foreground">Today at 10:30 AM</span>
                                                    </div>
                                                    <div className="bg-muted/50 p-3 rounded-lg rounded-tl-none">
                                                        <p className="text-sm">I've uploaded the latest sketches. implementing the new tabs.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Message 2 */}
                                            <div className="flex gap-3">
                                                <Avatar className="w-8 h-8 mt-1">
                                                    <AvatarFallback>SM</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-sm">Sarah Miller</span>
                                                        <span className="text-xs text-muted-foreground">Today at 10:45 AM</span>
                                                    </div>
                                                    <div className="bg-muted/50 p-3 rounded-lg rounded-tl-none">
                                                        <p className="text-sm">Great! I'll review them shortly. Don't forget the dark mode variants.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Input */}
                                        <div className="flex gap-2 mt-4 pt-4">
                                            <Button variant="ghost" size="icon" className="shrink-0">
                                                <Paperclip className="h-5 w-5 text-muted-foreground" />
                                            </Button>
                                            <Input placeholder="Write a comment..." className="flex-1" />
                                            <Button size="icon" className="shrink-0">
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - Right Column */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Add</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <Button variant="outline" className="justify-start gap-2 h-10 w-full">
                                        <Plus className="h-4 w-4" /> Members
                                    </Button>
                                    <Button variant="outline" className="justify-start gap-2 h-10 w-full">
                                        <Plus className="h-4 w-4" /> Tags
                                    </Button>
                                    <Button variant="outline" className="justify-start gap-2 h-10 w-full">
                                        <Plus className="h-4 w-4" /> Checklist
                                    </Button>
                                    <Button variant="outline" className="justify-start gap-2 h-10 w-full">
                                        <Clock className="h-4 w-4" /> Deadline
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Shared Files</CardTitle>
                                    <CardDescription>4 files • 12 MB</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { name: "Project_Specs.pdf", size: "2.4 MB", type: "pdf" },
                                        { name: "Wireframes_v2.fig", size: "8.1 MB", type: "fig" },
                                        { name: "Assets.zip", size: "1.2 MB", type: "zip" },
                                        { name: "Notes.txt", size: "4 KB", type: "txt" },
                                    ].map((file, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                                <FileText className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{file.name}</p>
                                                <p className="text-xs text-muted-foreground">{file.size}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full mt-2">View All</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </ModernTabsContent>
                {/* Placeholders for other tabs */}
                <ModernTabsContent value="chat">
                    <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-lg border-dashed">
                        Chat Interface Placeholder
                    </div>
                </ModernTabsContent>
                <ModernTabsContent value="timeline">
                    <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-lg border-dashed">
                        Timeline Interface Placeholder
                    </div>
                </ModernTabsContent>
            </ModernTabs>
        </div>
    )
}
