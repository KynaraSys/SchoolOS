"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Folder, FileText, Download, MoreVertical, Upload, Search, File, Film } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export default function MaterialsList() {
    const folders = [
        { id: "1", name: "Mathematics - Form 3", items: 4 },
        { id: "2", name: "Mathematics - Form 2", items: 8 },
        { id: "3", name: "Past Papers 2023", items: 12 },
    ]

    const files = [
        { id: "1", name: "Algebra_Revision_Notes.pdf", type: "pdf", size: "2.4 MB", date: "Dec 18, 2024" },
        { id: "2", name: "Geometric_Construction_Guide.docx", type: "doc", size: "1.1 MB", date: "Dec 15, 2024" },
        { id: "3", name: "Lesson_12_Video.mp4", type: "video", size: "45 MB", date: "Dec 10, 2024" },
    ]

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="h-8 w-8 text-red-500" />
            case 'doc': return <FileText className="h-8 w-8 text-blue-500" />
            case 'video': return <Film className="h-8 w-8 text-purple-500" />
            default: return <File className="h-8 w-8 text-gray-500" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold">Learning Materials</h1>
                    <p className="text-muted-foreground mt-1">Manage and share course resources</p>
                </div>
                <div className="flex gap-2">
                    <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </div>

            {/* Search and Breadcrumbs (Simplified) */}
            <div className="flex items-center gap-4">
                <Input placeholder="Search files..." className="max-w-sm" />
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                {/* Folders Section */}
                {folders.map(folder => (
                    <Card key={folder.id} className="hover:bg-accent/50 cursor-pointer transition-colors">
                        <CardContent className="p-4 flex items-center gap-4">
                            <Folder className="h-10 w-10 text-yellow-500 fill-yellow-500/20" />
                            <div>
                                <p className="font-medium truncate">{folder.name}</p>
                                <p className="text-xs text-muted-foreground">{folder.items} items</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <h2 className="text-lg font-semibold mt-6">Recent Files</h2>
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        {files.map(file => (
                            <div key={file.id} className="flex items-center justify-between p-4 hover:bg-accent/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    {getFileIcon(file.type)}
                                    <div>
                                        <p className="font-medium">{file.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{file.size}</span>
                                            <span>•</span>
                                            <span>{file.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>Rename</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
