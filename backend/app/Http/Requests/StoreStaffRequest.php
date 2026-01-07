<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStaffRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Auth handled by middleware/gates
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Identity
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'national_id_number' => 'required|string|max:20', // Add unique check if desired, but encrypted fields are tricky
            'staff_number' => 'required|string|unique:staff,staff_number',
            'employment_type' => 'required|string|in:Permanent,Contract,Part-time,Intern',
            
            // Dates
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            
            // Professional
            'qualification' => 'nullable|string|max:255',
            'tsc_number' => 'nullable|string|max:50',
            'specialization' => 'nullable|string|max:255',

            // System Access
            'phone' => 'required|string|max:15|unique:users,phone',
            'email' => 'nullable|email|unique:users,email',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,name',
            'is_active' => 'boolean',
        ];
    }
}
