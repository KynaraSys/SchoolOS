import { z } from "zod";

export const learnerDetailsSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    otherNames: z.string().optional(),
    dob: z.date({ required_error: "Date of Birth is required" }),
    gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
    birthCertificateNumber: z.string().optional(),
    profileImage: z.string().optional(), // Base64 or URL
});

export const guardianSchema = z.object({
    guardianId: z.string().optional(), // If selecting existing
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    phone: z.string().min(10, "Phone number is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    relationship: z.string().min(2, "Relationship is required"),
    isPrimary: z.boolean().default(true),
    isNew: z.boolean().default(false), // Logic flag
});

export const admissionContextSchema = z.object({
    entryLevel: z.enum(["PP1", "PP2", "Grade 1", "Grade 2", "Grade 3"], { required_error: "Entry Level is required" }),
    admissionDate: z.date({ required_error: "Admission Date is required" }),
    previousSchool: z.string().optional(),
});

export const senSchema = z.object({
    hasSpecialNeeds: z.boolean().default(false),
    pathway: z.enum(["age_based", "stage_based"]).default("age_based"),
    medicalConditions: z.string().optional(),
    accommodationNotes: z.string().optional(),
});

// Composite Schema for final submission
export const admissionSchema = z.object({
    ...learnerDetailsSchema.shape,
    guardians: z.array(guardianSchema).min(1, "At least one guardian is required"),
    ...admissionContextSchema.shape,
    ...senSchema.shape,
});

export type LearnerDetailsValues = z.infer<typeof learnerDetailsSchema>;
export type GuardianValues = z.infer<typeof guardianSchema>;
export type AdmissionContextValues = z.infer<typeof admissionContextSchema>;
export type SenValues = z.infer<typeof senSchema>;
export type AdmissionValues = z.infer<typeof admissionSchema>;
