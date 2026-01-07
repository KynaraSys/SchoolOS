"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Assuming shadcn calendar
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function LearnerDetailsStep() {
    const { control } = useFormContext();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. John" {...field} className="glass-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Kamau" {...field} className="glass-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={control}
                name="otherNames"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Other Names (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Middle name" {...field} className="glass-input" />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">Appears entirely on official reports.</p>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth <span className="text-red-500">*</span></FormLabel>
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
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="glass-input">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={control}
                name="birthCertificateNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Birth Certificate Number (Recommended)</FormLabel>
                        <FormControl>
                            <Input placeholder="Entry No. or Serial No." {...field} className="glass-input" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 text-sm text-blue-700">
                <p className="flex items-center gap-2">
                    <span className="font-semibold">Note:</span>
                    For Early Years (PP1-PP2), precise DoB is critical for developmental grouping.
                </p>
            </div>
        </div>
    );
}
