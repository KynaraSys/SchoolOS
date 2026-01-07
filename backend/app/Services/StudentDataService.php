<?php

namespace App\Services;

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\Activitylog\Facades\LogBatch;
use Spatie\Activitylog\Models\Activity;

class StudentDataService
{
    /**
     * Update Student Identity (Restricted: Admin Only).
     * 
     * @param Student $student
     * @param array $data Fields: first_name, last_name, other_names, dob, gender
     * @param string $reason Mandatory reason for the change
     * @return Student
     */
    public function updateIdentity(Student $student, array $data, string $reason): Student
    {
        $this->ensureAdmin();
        $this->ensureReason($reason);

        // Validation against Immutable fields is handled by exclusion or explicit check
        // Ideally, we only allow specific fields here
        $allowed = ['first_name', 'last_name', 'other_names', 'dob', 'gender', 'birth_certificate_number'];
        $changes = array_intersect_key($data, array_flip($allowed));

        if (empty($changes)) {
            return $student;
        }

        return DB::transaction(function () use ($student, $changes, $reason) {
            activity()->withoutLogs(function () use ($student, $changes) {
                 // We manually log to ensure reason is attached to the BATCH or specific log
                 $student->fill($changes);
            });

            if ($student->isDirty()) {
                $student->save();
                
                activity()
                    ->performedOn($student)
                    ->withProperties(['reason' => $reason, 'changes' => $changes])
                    ->event('updated')
                    ->log('Updated student identity');
            }

            return $student;
        });
    }

    /**
     * Update Student Placement (Restricted: Admin Only).
     * 
     * @param Student $student
     * @param array $data Fields: class_id, stream, house (if applicable)
     * @param string $reason
     * @return Student
     */
    public function updatePlacement(Student $student, array $data, string $reason): Student
    {
        $this->ensureAdmin();
        
        $allowed = ['class_id', 'phase_id', 'stream', 'house']; // Adjust based on actual columns
        $changes = array_intersect_key($data, array_flip($allowed));

        if (empty($changes)) {
            return $student;
        }

        return DB::transaction(function () use ($student, $changes, $reason) {
             // Similar pattern: manual logging with reason
             $student->update($changes);

             activity()
                ->performedOn($student)
                ->withProperties(['reason' => $reason, 'attributes' => $changes])
                ->log('Updated student placement');

             return $student;
        });
    }

    /**
     * Update Student Guardians (Restricted: Admin Only).
     */
    public function updateGuardians(Student $student, array $guardianIds, string $reason): Student
    {
        $this->ensureAdmin();
        $this->ensureReason($reason);

        DB::transaction(function () use ($student, $guardianIds, $reason) {
            $student->guardians()->sync($guardianIds);

            activity()
                ->performedOn($student)
                ->withProperties(['reason' => $reason, 'guardian_ids' => $guardianIds])
                ->log('Updated student guardians');
        });

        return $student->load('guardians');
    }

    /**
     * Update Student Support (Teachers/Admin safe).
     * 
     * @param Student $student
     * @param array $data Fields: special_needs, medical_notes, dietary_requirements
     */
    public function updateSupport(Student $student, array $data): Student
    {
        // Teachers can do this, so no strict admin check, but we do log it.
        $allowed = ['special_needs', 'medical_notes', 'accommodation_notes', 'allergies', 'dietary_requirements'];
        $changes = array_intersect_key($data, array_flip($allowed));

        if (!empty($changes)) {
            $student->update($changes);
        }

        return $student;
    }

    protected function ensureAdmin()
    {
        if (!auth()->user() || !auth()->user()->hasRole(['Admin', 'Super Admin', 'Principal'])) { // Adjust roles as needed
            abort(403, 'Only Administrators can perform this action.');
        }
    }

    protected function ensureReason(?string $reason)
    {
        if (empty($reason) || strlen(trim($reason)) < 5) {
            throw ValidationException::withMessages(['reason' => 'A valid reason is required for this critical update.']);
        }
    }
}
