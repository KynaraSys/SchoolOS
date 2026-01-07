"use client"

import React, { useState } from "react"
import { AlertTriangle, Check, X, ShieldAlert, BadgeInfo } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RecordPreview {
    id: string
    name: string
    status: string
    lastActive: string
    action: string
}

const MOCK_PREVIEW_DATA: RecordPreview[] = [
    { id: "STU-001", name: "John Doe", status: "Graduated", lastActive: "2023-11-20", action: "Archive" },
    { id: "STU-045", name: "Jane Smith", status: "Graduated", lastActive: "2023-11-20", action: "Archive" },
    { id: "STU-089", name: "Mike Johnson", status: "Transferred", lastActive: "2023-09-15", action: "Archive" },
]

interface DryRunPanelProps {
    open: boolean
    onClose: () => void
    jobName: string
    actionType: string // "Archive" | "Anonymize" | "Delete"
}

export function DryRunPanel({ open, onClose, jobName, actionType }: DryRunPanelProps) {
    const [confirmed, setConfirmed] = useState(false)
    const [confirmPhrase, setConfirmPhrase] = useState("")

    const isDestructive = actionType === "Delete"
    const expectedPhrase = "CONFIRM DATA RETENTION"

    const canExecute = isDestructive ? confirmPhrase === expectedPhrase : true

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] glass-card border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BadgeInfo className="w-5 h-5 text-blue-400" />
                        Dry Run Preview
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Reviewing impact for job: <span className="text-white font-medium">{jobName}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Impact Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-sm text-muted-foreground">Total Records Found</p>
                            <p className="text-2xl font-mono font-bold">145</p>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-sm text-muted-foreground">Action Type</p>
                            <div className="flex items-center gap-2">
                                <Badge variant={isDestructive ? "destructive" : "secondary"} className="mt-1">
                                    {actionType}
                                </Badge>
                                {isDestructive && (
                                    <span className="text-xs text-red-400 flex items-center gap-1 mt-1">
                                        <AlertTriangle className="w-3 h-3" /> Irreversible
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preview Table */}
                    <div className="max-h-[300px] overflow-auto rounded-md border border-white/10">
                        <Table>
                            <TableHeader className="bg-muted/50 sticky top-0">
                                <TableRow className="border-white/10">
                                    <TableHead className="text-xs uppercase">Record ID</TableHead>
                                    <TableHead className="text-xs uppercase">Entity Name</TableHead>
                                    <TableHead className="text-xs uppercase">Status</TableHead>
                                    <TableHead className="text-xs uppercase">Proposed Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_PREVIEW_DATA.map((record) => (
                                    <TableRow key={record.id} className="border-white/10 hover:bg-muted/5">
                                        <TableCell className="font-mono text-xs">{record.id}</TableCell>
                                        <TableCell>{record.name}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{record.status}</TableCell>
                                        <TableCell>
                                            <span className={isDestructive ? "text-red-400" : "text-blue-400"}>
                                                {record.action}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="border-white/10">
                                    <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-4">
                                        ... and 142 more records
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Safety Confirmation */}
                    {isDestructive && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-semibold text-red-400">Confirmation Required</p>
                                    <p className="text-sm text-red-300/80">
                                        This action will permanently delete 145 records. This cannot be undone.
                                        Please type <strong>{expectedPhrase}</strong> to proceed.
                                    </p>
                                </div>
                            </div>
                            <Input
                                value={confirmPhrase}
                                onChange={(e) => setConfirmPhrase(e.target.value)}
                                placeholder={expectedPhrase}
                                className="bg-black/20 border-red-500/30 text-red-100 placeholder:text-red-500/30"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button
                        variant={isDestructive ? "destructive" : "default"}
                        disabled={!canExecute}
                        className="gap-2"
                    >
                        {isDestructive ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        Confirm & Execute
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
