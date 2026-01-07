"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StaffFormData } from "../onboarding-wizard";

interface StepProps {
    data: StaffFormData;
    update: (data: Partial<StaffFormData>) => void;
}

export function IdentityStep({ data, update }: StepProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label>First Name <span className="text-red-500">*</span></Label>
                <Input
                    value={data.first_name}
                    onChange={(e) => update({ first_name: e.target.value })}
                    placeholder="e.g. John"
                />
            </div>

            <div className="space-y-2">
                <Label>Last Name <span className="text-red-500">*</span></Label>
                <Input
                    value={data.last_name}
                    onChange={(e) => update({ last_name: e.target.value })}
                    placeholder="e.g. Doe"
                />
            </div>

            <div className="space-y-2">
                <Label>Staff Number <span className="text-red-500">*</span></Label>
                <Input
                    value={data.staff_number}
                    onChange={(e) => update({ staff_number: e.target.value })}
                    placeholder="e.g. STF-2024-001"
                />
            </div>

            <div className="space-y-2">
                <Label>National ID Number <span className="text-red-500">*</span></Label>
                <Input
                    value={data.national_id_number}
                    onChange={(e) => update({ national_id_number: e.target.value })}
                    placeholder="ID or Passport Number"
                />
            </div>

            <div className="space-y-2">
                <Label>Employment Type <span className="text-red-500">*</span></Label>
                <Select value={data.employment_type} onValueChange={(val) => update({ employment_type: val })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Intern">Intern</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Start Date <span className="text-red-500">*</span></Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !data.start_date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {data.start_date ? format(data.start_date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={data.start_date}
                            onSelect={(date) => update({ start_date: date })}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Optional Fields Container */}
            <div className="col-span-1 md:col-span-2 border-t pt-4 mt-2">
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Professional Details (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Qualification</Label>
                        <Input
                            value={data.qualification}
                            onChange={(e) => update({ qualification: e.target.value })}
                            placeholder="e.g. B.Ed Science"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>TSC Number</Label>
                        <Input
                            value={data.tsc_number}
                            onChange={(e) => update({ tsc_number: e.target.value })}
                            placeholder="If applicable"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
