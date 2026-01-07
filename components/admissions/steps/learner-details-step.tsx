"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AdmissionData } from "../admission-wizard";
import { useState } from "react";

interface StepProps {
    data: AdmissionData["student"];
    onUpdate: (data: Partial<AdmissionData["student"]>) => void;
    onNext: () => void;
}

export function LearnerDetailsStep({ data, onUpdate, onNext }: StepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!data.first_name) newErrors.first_name = "First name is required";
        if (!data.last_name) newErrors.last_name = "Last name is required";
        if (!data.dob) newErrors.dob = "Date of birth is required";
        if (!data.entry_level) newErrors.entry_level = "Entry level is required";
        if (!data.gender) newErrors.gender = "Gender is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext();
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Learner Identity</h2>
                <p className="text-muted-foreground text-sm">
                    Basic details of the child. Ensure names match the birth certificate.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="first_name"
                        value={data.first_name}
                        onChange={(e) => onUpdate({ first_name: e.target.value })}
                        placeholder="e.g. John"
                        className={errors.first_name ? "border-red-500 bg-red-50/10" : ""}
                    />
                    {errors.first_name && <p className="text-xs text-red-500">{errors.first_name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name / Surname <span className="text-red-500">*</span></Label>
                    <Input
                        id="last_name"
                        value={data.last_name}
                        onChange={(e) => onUpdate({ last_name: e.target.value })}
                        placeholder="e.g. Doe"
                        className={errors.last_name ? "border-red-500 bg-red-50/10" : ""}
                    />
                    {errors.last_name && <p className="text-xs text-red-500">{errors.last_name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="other_names">Other Names</Label>
                    <Input
                        id="other_names"
                        value={data.other_names}
                        onChange={(e) => onUpdate({ other_names: e.target.value })}
                        placeholder="Middle names"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth <span className="text-red-500">*</span></Label>
                    <Input
                        id="dob"
                        type="date"
                        value={data.dob}
                        onChange={(e) => onUpdate({ dob: e.target.value })}
                        className={errors.dob ? "border-red-500 bg-red-50/10" : ""}
                    />
                    {errors.dob && <p className="text-xs text-red-500">{errors.dob}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
                    <Select value={data.gender} onValueChange={(val) => onUpdate({ gender: val })}>
                        <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="entry_level">Entry Level <span className="text-red-500">*</span></Label>
                    <Select value={data.entry_level} onValueChange={(val) => onUpdate({ entry_level: val })}>
                        <SelectTrigger className={errors.entry_level ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Play Group">Play Group (PG)</SelectItem>
                            <SelectItem value="PP1">Pre-Primary 1 (PP1)</SelectItem>
                            <SelectItem value="PP2">Pre-Primary 2 (PP2)</SelectItem>
                            <SelectItem value="Grade 1">Grade 1</SelectItem>
                            <SelectItem value="Grade 2">Grade 2</SelectItem>
                            <SelectItem value="Grade 3">Grade 3</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.entry_level && <p className="text-xs text-red-500">{errors.entry_level}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="birth_cert">Birth Certificate Number (Recommended)</Label>
                    <Input
                        id="birth_cert"
                        value={data.birth_certificate_number}
                        onChange={(e) => onUpdate({ birth_certificate_number: e.target.value })}
                        placeholder="e.g. 12345678"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleNext}>Next Step</Button>
            </div>
        </div>
    );
}
