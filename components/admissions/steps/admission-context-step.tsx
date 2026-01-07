"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AdmissionData } from "../admission-wizard";

interface StepProps {
    data: AdmissionData["context"];
    onUpdate: (data: Partial<AdmissionData["context"]>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function AdmissionContextStep({ data, onUpdate, onNext, onBack }: StepProps) {

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Admission Context</h2>
                <p className="text-muted-foreground text-sm">
                    Set up the learner's initial trajectory and support needs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="entry_year">Entry Year</Label>
                    <Input
                        id="entry_year"
                        type="number"
                        value={data.entry_year}
                        onChange={(e) => onUpdate({ entry_year: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="admission_date">Admission Date</Label>
                    <Input
                        id="admission_date"
                        type="date"
                        value={data.admission_date}
                        onChange={(e) => onUpdate({ admission_date: e.target.value })}
                    />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="prev_school">Previous School (Optional)</Label>
                    <Input
                        id="prev_school"
                        placeholder="Name of previous institution (if any)"
                        value={data.previous_school}
                        onChange={(e) => onUpdate({ previous_school: e.target.value })}
                    />
                </div>
            </div>

            <div className="border-t pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Special Educational Needs (SEN)</Label>
                        <p className="text-sm text-muted-foreground">Does this learner require specific differentiation or support?</p>
                    </div>
                    <Switch
                        checked={data.special_needs}
                        onCheckedChange={(checked) => onUpdate({ special_needs: checked })}
                    />
                </div>

                {data.special_needs && (
                    <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-lg space-y-6 animate-in slide-in-from-top-2">
                        <div className="space-y-3">
                            <Label>Pathway Selection</Label>
                            <RadioGroup
                                value={data.pathway}
                                onValueChange={(val) => onUpdate({ pathway: val })}
                                className="flex flex-col space-y-2"
                            >
                                <div className="flex items-center space-x-3 space-y-0">
                                    <RadioGroupItem value="Age-Based" id="p_age" />
                                    <Label htmlFor="p_age" className="font-normal">
                                        <strong>Age-Based Pathway</strong> (Default) - Learner follows curriculum with accommodations.
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-3 space-y-0">
                                    <RadioGroupItem value="Stage-Based" id="p_stage" />
                                    <Label htmlFor="p_stage" className="font-normal">
                                        <strong>Stage-Based Pathway</strong> - Learner follows foundation/intermediate level curriculum.
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label>Accommodation Notes</Label>
                            <Textarea
                                placeholder="Describe required accommodations (e.g. large print, extra time, ramps)..."
                                value={data.accommodation_notes}
                                onChange={(e) => onUpdate({ accommodation_notes: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Medical / Dietary Notes</Label>
                            <Textarea
                                placeholder="Allergies, chronic conditions..."
                                value={data.medical_notes}
                                onChange={(e) => onUpdate({ medical_notes: e.target.value })}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={onNext}>Review & Confirm</Button>
            </div>
        </div>
    );
}
