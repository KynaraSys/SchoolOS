"use client"

import React, { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export interface Rule {
    id: string
    field: string
    operator: string
    value: string
}

interface RulesBuilderProps {
    value: Rule[]
    onChange: (rules: Rule[]) => void
    target?: string
}

export function RulesBuilder({ value, onChange, target }: RulesBuilderProps) {
    const addRule = () => {
        const newRule: Rule = {
            id: Math.random().toString(36).substr(2, 9),
            field: "",
            operator: "=",
            value: ""
        }
        onChange([...value, newRule])
    }

    const removeRule = (id: string) => {
        onChange(value.filter(r => r.id !== id))
    }

    const updateRule = (id: string, updates: Partial<Rule>) => {
        onChange(value.map(r => r.id === id ? { ...r, ...updates } : r))
    }

    const getFieldsForTarget = (target?: string) => {
        switch (target) {
            case "Students":
                return [
                    { label: "Archived Date", value: "archived_at" },
                    { label: "Graduation Year", value: "graduation_year" },
                    { label: "Status", value: "status" }
                ]
            case "Guardians":
                return [
                    { label: "Last Active", value: "last_login_at" },
                    { label: "Has Active Students", value: "has_active_students" }
                ]
            case "System Logs":
                return [
                    { label: "Log Date", value: "created_at" },
                    { label: "Level", value: "level" }
                ]
            default:
                return [
                    { label: "Created Date", value: "created_at" }
                ]
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-muted-foreground">Eligibility Criteria</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRule}
                    className="h-8 gap-2 text-xs"
                >
                    <Plus className="w-3 h-3" />
                    Add Rule
                </Button>
            </div>

            <div className="space-y-3">
                {value.length === 0 && (
                    <div className="text-sm text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed text-center">
                        No rules defined. All records of this type will be affected.
                    </div>
                )}

                {value.map((rule) => (
                    <div key={rule.id} className="flex gap-2 items-center bg-muted/10 p-2 rounded-lg border border-white/5">
                        <Select
                            value={rule.field}
                            onValueChange={(v) => updateRule(rule.id, { field: v })}
                        >
                            <SelectTrigger className="w-[180px] h-9 bg-background/50">
                                <SelectValue placeholder="Select Field" />
                            </SelectTrigger>
                            <SelectContent>
                                {getFieldsForTarget(target).map(f => (
                                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={rule.operator}
                            onValueChange={(v) => updateRule(rule.id, { operator: v })}
                        >
                            <SelectTrigger className="w-[130px] h-9 bg-background/50">
                                <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="=">Equals</SelectItem>
                                <SelectItem value="!=">Not Equals</SelectItem>
                                <SelectItem value=">">Greater Than</SelectItem>
                                <SelectItem value="<">Less Than</SelectItem>
                                <SelectItem value=">=">Greater/Equal</SelectItem>
                                <SelectItem value="<=">Less/Equal</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            value={rule.value}
                            onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                            placeholder="Value"
                            className="flex-1 h-9 bg-background/50"
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-red-400"
                            onClick={() => removeRule(rule.id)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
