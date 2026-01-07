"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, UserPlus } from "lucide-react";

export function GuardianLinkingStep() {
    const { control, watch } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "guardians",
    });

    // Ensure at least one guardian form is shown if empty
    if (fields.length === 0) {
        append({
            firstName: "",
            lastName: "",
            phone: "",
            relationship: "Parent",
            isPrimary: true,
            isNew: true
        });
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-blue-50/50 p-4 rounded-lg text-sm text-blue-700 mb-4 border border-blue-100">
                <p>Every learner <strong>must</strong> be linked to at least one guardian. This person will receive legal and academic communications.</p>
            </div>

            {fields.map((field, index) => (
                <Card key={field.id} className="relative overflow-hidden border-dashed border-2 hover:border-solid transition-all">
                    <CardHeader className="pb-2 bg-gray-50/50">
                        <CardTitle className="text-sm font-medium flex justify-between items-center">
                            <span>Guardian #{index + 1} {index === 0 && "(Primary Contact)"}</span>
                            {index > 0 && (
                                <Button variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name={`guardians.${index}.firstName`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jane" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`guardians.${index}.lastName`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`guardians.${index}.phone`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="07XX XXX XXX" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`guardians.${index}.relationship`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Relationship</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Father">Father</SelectItem>
                                            <SelectItem value="Mother">Mother</SelectItem>
                                            <SelectItem value="Guardian">Guardian</SelectItem>
                                            <SelectItem value="Grandparent">Grandparent</SelectItem>
                                            <SelectItem value="Sibling">Sibling</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`guardians.${index}.email`}
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Email (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="jane@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            ))}

            <Button
                type="button"
                variant="outline"
                onClick={() => append({ firstName: "", lastName: "", phone: "", relationship: "Parent", isPrimary: false, isNew: true })}
                className="w-full border-dashed"
            >
                <Plus className="w-4 h-4 mr-2" /> Add Another Guardian
            </Button>
        </div>
    );
}
