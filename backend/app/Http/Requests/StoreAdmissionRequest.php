<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Middleware will handle permission check
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Student Identity
            'student.first_name' => 'required|string|max:255',
            'student.last_name' => 'required|string|max:255',
            'student.other_names' => 'nullable|string|max:255',
            'student.dob' => 'required|date|before:today',
            'student.gender' => 'nullable|string|in:Male,Female,Other',
            'student.birth_certificate_number' => 'nullable|string|max:50',
            'student.entry_level' => 'required|string', // e.g., PP1, Grade 1
            'student.admission_date' => 'required|date',
            
            // Admission Context
            'student.previous_school' => 'nullable|string|max:255',
            'student.special_needs' => 'boolean',
            'student.medical_notes' => 'nullable|string',
            'student.accommodation_notes' => 'nullable|string',
            'student.pathway' => 'nullable|string', // Age-Based vs Stage-Based

            // Guardians (Array of links or new)
            'guardians' => 'required|array|min:1',
            'guardians.*.guardian_id' => 'nullable|exists:guardians,id',
            // If guardian_id is present, we don't strictly need names/phone, but if it's missing (new), we do.
            'guardians.*.first_name' => 'required_without:guardians.*.guardian_id|string|max:255',
            'guardians.*.last_name' => 'required_without:guardians.*.guardian_id|string|max:255',
            'guardians.*.phone_number' => 'nullable|string|max:20', 
            'guardians.*.national_id' => 'nullable|string|max:20',
            'guardians.*.email' => 'nullable|email|max:255',
            'guardians.*.relationship' => 'required|string|max:50',
        ];
    }
}
