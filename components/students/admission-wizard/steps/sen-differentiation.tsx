"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function SenStep() {
    const { control, watch } = useFormContext();
    const hasSpecialNeeds = watch("hasSpecialNeeds");

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium text-gray-900">Differentiation & Support</h3>
                <p className="text-sm text-muted-foreground">Identify any additional support requirements to assist the learner's competency development.</p>
            </div>

            <Card className="border-none bg-gray-50/50">
                <CardContent className="p-6">
                    <FormField
                        control={control}
                        name="hasSpecialNeeds"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-white">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Special Needs / SEN Support?</FormLabel>
                                    <FormDescription>
                                        Does the learner require assistive devices, differentiated instruction, or specialized assessment modes?
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {hasSpecialNeeds && (
                        <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2">
                            <FormField
                                control={control}
                                name="pathway"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Recommended Pathway</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="age_based" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Age-Based (Regular Curriculum)
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="stage_based" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Stage-Based (Foundation/Intermediate Level for Special Needs)
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="medicalConditions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Medical Considerations (Non-Diagnostic)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g. Allergic to peanuts, Asthma needs inhaler nearby..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Information to help teachers ensure learner safety.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="accommodationNotes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Accommodation Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g. Requires large print materials, seating near front..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Practical adjustments for classroom environment.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
