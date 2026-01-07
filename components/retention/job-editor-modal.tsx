"use client"

import React, { useState } from "react"
import { ShieldAlert, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RulesBuilder, Rule } from "./rules-builder"

export function JobEditorModal() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [target, setTarget] = useState("")
    const [action, setAction] = useState("")
    const [isDryRun, setIsDryRun] = useState(true)
    const [rules, setRules] = useState<Rule[]>([])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    Create Cleanup Job
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] glass-card border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Create Retention Policy</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Define a new automated cleanup job. All jobs start in Dry Run mode by default.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Job Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Archive Graduated Students 2023"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3 bg-white/5 border-white/10"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="target">Data Target</Label>
                            <Select value={target} onValueChange={setTarget}>
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Select Data Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Students">Students</SelectItem>
                                    <SelectItem value="Guardians">Guardians</SelectItem>
                                    <SelectItem value="System Logs">System Logs</SelectItem>
                                    <SelectItem value="Financial Records">Financial Records</SelectItem>
                                    <SelectItem value="Assessment Media">Assessment Media</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="action">Action</Label>
                            <Select value={action} onValueChange={setAction}>
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Select Action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Archive">Archive (Move to Cold Storage)</SelectItem>
                                    <SelectItem value="Anonymize">Anonymize (PII Removal)</SelectItem>
                                    <SelectItem value="Delete" className="text-red-400">Delete Permanently</SelectItem>
                                </SelectContent>
                            </Select>
                            {action === "Delete" && (
                                <p className="text-[10px] text-red-400 flex items-center gap-1">
                                    <Info className="w-3 h-3" />
                                    Requires exact confirmation phrase to enable.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-white/10 my-2 pt-4">
                        <RulesBuilder value={rules} onChange={setRules} target={target} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="schedule">Schedule (Cron)</Label>
                        <div className="flex gap-2">
                            <Select defaultValue="monthly">
                                <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
                                    <SelectValue placeholder="Preset" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="0 0 1 * *"
                                className="flex-1 bg-white/5 border-white/10 font-mono text-sm"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-white/10 p-4 bg-white/5 mt-2">
                        <div className="space-y-0.5">
                            <Label className="text-base">Dry Run Mode</Label>
                            <div className="text-xs text-muted-foreground">
                                Simulate actions without modifying data.
                            </div>
                        </div>
                        <Switch
                            checked={isDryRun}
                            onCheckedChange={setIsDryRun}
                            aria-readonly
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => setOpen(false)}
                    >
                        Create Job
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
