"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"

export default function CreateAssignmentForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setLoading(false)
        if (onSuccess) {
            onSuccess()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g. Quadratic Equations Practice" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select required>
                        <SelectTrigger id="class">
                            <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="form-3a">Form 3A - Mathematics</SelectItem>
                            <SelectItem value="form-2b">Form 2B - Mathematics</SelectItem>
                            <SelectItem value="form-4a">Form 4A - Mathematics</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select required defaultValue="homework">
                        <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="homework">Homework</SelectItem>
                            <SelectItem value="project">Project</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <div className="relative">
                    <Input type="date" id="deadline" required />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Instructions</Label>
                <Textarea
                    id="description"
                    placeholder="Detailed instructions for the students..."
                    className="min-h-[120px]"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-accent/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to upload files</p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, JPG up to 10MB</p>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onSuccess?.()}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Assignment"}
                </Button>
            </div>
        </form>
    )
}
