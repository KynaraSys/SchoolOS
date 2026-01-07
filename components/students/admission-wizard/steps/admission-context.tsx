"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function AdmissionContextStep() {
    const { control } = useFormContext();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="entryLevel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Entry Grade Level <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="glass-input">
                                        <SelectValue placeholder="Select Level" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="PP1">Pre-Primary 1 (PP1)</SelectItem>
                                    <SelectItem value="PP2">Pre-Primary 2 (PP2)</SelectItem>
                                    <SelectItem value="Grade 1">Grade 1</SelectItem>
                                    <SelectItem value="Grade 2">Grade 2</SelectItem>
                                    <SelectItem value="Grade 3">Grade 3</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="admissionDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Admission Date <span className="text-red-500">*</span></FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal glass-input",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("2000-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={control}
                name="previousSchool"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Previous School (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Little Stars Academy" {...field} className="glass-input" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="p-4 bg-orange-50/50 rounded-lg border border-orange-100 text-sm text-orange-800">
                <p><strong>Note:</strong> Students are not placed into streams at this stage. Stream allocation happens after the admission creates the learner profile.</p>
            </div>
        </div>
    );
}
