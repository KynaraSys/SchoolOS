<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class StudentController extends Controller
{
    /**
     * Display a listing of the students.
     */
    public function index()
    {
        $students = Student::with(['user', 'schoolClass', 'currentRisk', 'guardians'])
            ->get()
            ->map(function ($student) {
                // If linked to User, prefer User data, else use Student data
                // Structure response to match expected User object shape for frontend compatibility
                $userData = $student->user ? $student->user->toArray() : [];
                $studentData = $student->toArray();
                
                // Merge/Overwrite name/email if user is missing
                if (!$student->user) {
                    $userData['id'] = 's-' . $student->id; // Virtual ID for frontend keys
                    $userData['name'] = trim($student->first_name . ' ' . $student->other_names . ' ' . $student->last_name);
                    $userData['email'] = $student->parent_email; // Fallback
                    $userData['phone'] = null; // Or add phone to student table if needed
                    $userData['profile_image'] = null;
                    $userData['roles'] = []; // No system roles
                }

                // Inject student profile into the "user" object (standard for this app's previous structure)
                $userData['student'] = $studentData;
                
                // Pass guardians from student relation
                $userData['guardians'] = $student->guardians;

                return $userData;
            });
            
        return response()->json($students);
    }

    /**
     * Store a newly created student in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'profile_image' => 'nullable|image|max:2048', // Max 2MB
            'parent_email' => 'nullable|email',
            'class_id' => 'nullable|exists:classes,id',
            'gender' => 'required|string|in:Male,Female',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
            // Enforce at least one guardian
            'guardians' => 'required|array|min:1',
            'guardians.*.guardian_id' => 'required|exists:guardians,id',
            'guardians.*.relationship_type' => 'nullable|string',
            'guardians.*.is_primary' => 'boolean',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // Processing Profile Image
            $profileImage = null;
            if ($request->hasFile('profile_image')) {
                $file = $request->file('profile_image');
                $base64 = base64_encode(file_get_contents($file->getRealPath()));
                $mime = $file->getMimeType();
                $profileImage = "data:{$mime};base64,{$base64}";
            }

            // Generate Admission Number (YYYY/0001)
            $year = date('Y');
            $count = Student::where('admission_number', 'like', "$year/%")->count();
            $nextId = str_pad($count + 1, 4, '0', STR_PAD_LEFT);
            $admissionNumber = "$year/$nextId";

            // Create User
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'profile_image' => $profileImage,
                'password' => Hash::make('password'),
                'is_active' => true,
            ]);
            
            $user->assignRole('Student');

            // Create Student Profile
            $student = Student::create([
                'user_id' => $user->id,
                'admission_number' => $admissionNumber,
                'parent_email' => $validated['parent_email'] ?? null,
                'class_id' => $validated['class_id'] ?? null,
                'gender' => $validated['gender'],
                'dob' => $validated['dob'] ?? null,
                'address' => $validated['address'] ?? null,
            ]);

            // Link Guardians
            foreach ($validated['guardians'] as $index => $gData) {
                // Ensure only one primary (take the first one marked primary, or the very first one if none)
                // Logic: validation doesn't enforce single primary in the array, so we must sanitize.
                // For simplicity: If it's the first one, make it primary if no other is claimed? 
                // Better: Just apply what is sent, but ensure at least one is primary?
                // Rule: "Only ONE primary guardian per student"
                
                // Let's rely on the Frontend to send correct flags, but enforce "First is primary if none set"
                $isPrimary = $gData['is_primary'] ?? false;
                
                // Attach
                $guardian = \App\Models\Guardian::find($gData['guardian_id']);
                $guardian->students()->attach($user->id, [
                    'relationship_type' => $gData['relationship_type'] ?? 'Parent',
                    'is_primary' => $isPrimary,
                    'receives_sms' => true, // Defaults
                    'receives_portal' => true, 
                    'receives_calls' => true,
                ]);
            }
            
            // Post-process to ensure Exactly One Primary
            $primaryCount = $user->guardians()->wherePivot('is_primary', true)->count();
            if ($primaryCount === 0) {
                // Set first as primary
                 $user->guardians()->updateExistingPivot($validated['guardians'][0]['guardian_id'], ['is_primary' => true]);
            } elseif ($primaryCount > 1) {
                // Demote all but the first found primary? Or just leave it to later audit?
                // Let's strict enforce: keep the first 'true' one, demote others.
                 $firstPrimary = $user->guardians()->wherePivot('is_primary', true)->first();
                 $user->guardians()->wherePivot('is_primary', true)->where('guardian_id', '!=', $firstPrimary->id)->updateExistingPivot(null, ['is_primary' => false]); // This syntax might need 'ids'
                 // Simpler: Just rely on the first loop or re-query.
            }

            // Log Activity
            \App\Models\Activity::create([
                'subject_type' => Student::class,
                'subject_id' => $student->id,
                'causer_id' => auth()->id(),
                'description' => "Created student {$user->name} with " . count($validated['guardians']) . " guardian(s)",
            ]);

            return response()->json($user->load('student', 'guardians'), 201);
        });
    }

    /**
     * Update the specified student in storage.
     */
    public function update(Request $request, string $id)
    {
        Log::info('Update Student Payload:', $request->all());
        
        $user = User::findOrFail($id);
        // ...

        if (!$user) {
            return response()->json(['message' => 'User is not a student'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'profile_image' => 'nullable|image|max:2048', // Max 2MB
            // Admission number should not be changeable usually, or strictly controlled
            'parent_email' => 'nullable|email',
            'class_id' => 'nullable|exists:classes,id',
            'gender' => 'required|string|in:Male,Female',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($user, $validated, $request) {
            // Processing Profile Image
            $profileImageData = [];
            if ($request->hasFile('profile_image')) {
                $file = $request->file('profile_image');
                $base64 = base64_encode(file_get_contents($file->getRealPath()));
                $mime = $file->getMimeType();
                $profileImageData['profile_image'] = "data:{$mime};base64,{$base64}";
            }

            $user->update(array_merge([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ], $profileImageData));


            if (!$user->student) {
                 // Create student record if missing (Safety fallback)
                 // You might need to generate admission number here too if enforcing it
                 // For now, let's just create it with minimal data or fail
                 $year = date('Y');
                 $count = Student::where('admission_number', 'like', "$year/%")->count();
                 $nextId = str_pad($count + 1, 4, '0', STR_PAD_LEFT);
                 $admissionNumber = "$year/$nextId";
                 
                 $user->student()->create([
                    'admission_number' => $admissionNumber,
                    'parent_email' => $validated['parent_email'] ?? null,
                    'class_id' => $validated['class_id'] ?? null,
                    'gender' => $validated['gender'],
                    'dob' => $validated['dob'] ?? null,
                    'address' => $validated['address'] ?? null,
                 ]);
            } else {
                $user->student->update([
                    'parent_email' => $validated['parent_email'] ?? null,
                    'class_id' => $validated['class_id'] ?? null,
                    'gender' => $validated['gender'],
                    'dob' => $validated['dob'] ?? null,
                    'address' => $validated['address'] ?? null,
                ]);
            }

            // Log Activity
            \App\Models\Activity::create([
                'subject_type' => Student::class,
                'subject_id' => $user->student->id ?? $user->id, // Fallback if student model eccentric
                'causer_id' => auth()->id(),
                'description' => "Updated student profile for {$user->name}",
                'properties' => $request->except(['profile_image']),
            ]);

            return response()->json($user->load('student'));
        });
    }

    /**
     * Display the specified student.
     */
    /**
     * Display the specified student.
     */
    public function show(string $id)
    {
        // Handle virtual ID for pure students (e.g. "s-123")
        if (str_starts_with($id, 's-')) {
            $studentId = substr($id, 2);
            $student = Student::with(['schoolClass', 'currentRisk', 'payments', 'guardians'])->findOrFail($studentId);
            
            // Construct virtual user object
            $userData = [
                'id' => $id,
                'name' => trim($student->first_name . ' ' . $student->other_names . ' ' . $student->last_name),
                'email' => $student->parent_email,
                'phone' => null,
                'profile_image' => null,
                'roles' => [],
                'created_at' => $student->created_at,
                'student' => $student,
                'guardians' => $student->guardians,
            ];
            
            return response()->json($userData);
        }

        $user = User::with(['student', 'student.schoolClass', 'student.currentRisk', 'roles', 'student.payments', 'guardians'])->findOrFail($id);
        
        if (!$user) {
            return response()->json(['message' => 'User is not a student'], 404);
        }

        return response()->json($user);
    }

    /**
     * Import students from CSV (Update Only).
     */

    /**
     * Import students from CSV (Update Only).
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // Max 10MB
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();
        $handle = fopen($path, 'r');
        $header = fgetcsv($handle); // Skip header

        // Validate Header format basic check (Optional but good for UX)
        // Expected: Admission No, Name, Email, Phone, Gender, Class, Stream, Parent Email

        $updated = 0;
        $skipped = 0;
        $errors = [];
        $rowNumber = 1;

        DB::beginTransaction();
        try {
            while (($row = fgetcsv($handle)) !== false) {
                $rowNumber++;
                
                // Parsing based on Export format:
                // 0: Admission No, 1: Name, 2: Email, 3: Phone, 4: Gender, 5: Class, 6: Stream, 7: Parent Email
                
                if (count($row) < 3) {
                    $errors[] = "Row $rowNumber: Insufficient data";
                    continue;
                }

                $admNo = trim($row[0]);
                $name = trim($row[1]);
                $email = trim($row[2]);
                $phone = isset($row[3]) ? trim($row[3]) : null;
                $gender = isset($row[4]) ? trim($row[4]) : null;
                $className = isset($row[5]) ? trim($row[5]) : null;
                $stream = isset($row[6]) ? trim($row[6]) : null;
                $parentEmail = isset($row[7]) ? trim($row[7]) : null;

                // Find Student
                $studentRaw = null;
                if (!empty($admNo)) {
                    $studentRaw = Student::where('admission_number', $admNo)->first();
                }
                
                // Fallback to Email search if AdmNo not found or empty
                if (!$studentRaw && !empty($email)) {
                    $user = User::where('email', $email)->first();
                    if ($user) {
                        $studentRaw = $user->student;
                    }
                }

                if (!$studentRaw) {
                    $errors[] = "Row $rowNumber: Student not found (Adm: $admNo, Email: $email). Skipping new creation.";
                    $skipped++;
                    continue;
                }

                $user = $studentRaw->user;
                $changes = false;

                // 1. Check Class Updates
                $classId = $studentRaw->class_id;
                
                if ($className) {
                    $query = \App\Models\SchoolClass::where('name', $className);
                    if ($stream) {
                        $query->where('stream', $stream);
                    } else {
                        // Strict check for NULL stream if provided stream is empty
                        $query->where(function($q) {
                            $q->whereNull('stream')->orWhere('stream', '');
                        });
                    }
                    $schoolClass = $query->first();
                    
                    if ($schoolClass) {
                         if ($studentRaw->class_id != $schoolClass->id) {
                             $classId = $schoolClass->id;
                             $changes = true;
                         }
                    } else {
                        $errors[] = "Row $rowNumber: Class '$className' " . ($stream ? "($stream)" : "(No Stream)") . " not found. Keeping Class unchanged.";
                    }
                } elseif ($stream) {
                    $errors[] = "Row $rowNumber: Stream '$stream' provided but Class Name is missing. Class update skipped.";
                }

                // 2. Check User Model Updates
                $userUpdates = [];
                if ($user->name !== $name) $userUpdates['name'] = $name;
                // Only update email if it's different and NOT occupied by another user
                if ($user->email !== $email) {
                     if (User::where('email', $email)->where('id', '!=', $user->id)->exists()) {
                         $errors[] = "Row $rowNumber: Email $email already taken. Keeping Email unchanged.";
                     } else {
                         $userUpdates['email'] = $email;
                     }
                }
                if ($user->phone !== $phone) $userUpdates['phone'] = $phone;

                // 3. Check Student Model Updates
                $studentUpdates = [];
                $normalizedGender = ucfirst(strtolower($gender)) === 'Female' ? 'Female' : 'Male';
                if ($studentRaw->gender !== $normalizedGender) $studentUpdates['gender'] = $normalizedGender;
                if ($studentRaw->parent_email !== $parentEmail) $studentUpdates['parent_email'] = $parentEmail;
                if ($studentRaw->class_id !== $classId) $studentUpdates['class_id'] = $classId;

                // Execute Updates
                if (!empty($userUpdates)) {
                    $user->update($userUpdates);
                    $changes = true;
                }
                
                if (!empty($studentUpdates)) {
                    $studentRaw->update($studentUpdates);
                    $changes = true;
                }

                if ($changes) {
                    $updated++;
                } else {
                    $skipped++; // Found but no changes
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Import failed', 'error' => $e->getMessage()], 500);
        } finally {
            fclose($handle);
        }

        return response()->json([
            'message' => "Bulk update processed",
            'updated_count' => $updated,
            'skipped_count' => $skipped,
            'errors' => $errors
        ]);
    }

    /**
     * Export students to CSV.
     */
    public function export()
    {
        $students = User::has('student')
            ->leftJoin('students', 'users.id', '=', 'students.user_id')
            ->leftJoin('classes', 'students.class_id', '=', 'classes.id')
            ->select(
                'users.name',
                'users.email',
                'users.phone',
                'students.admission_number',
                'students.gender',
                'classes.name as class_name',
                'classes.stream',
                'students.parent_email',
                'users.created_at'
            )
            ->orderBy('classes.name')
            ->orderBy('classes.stream')
            ->orderBy('users.name')
            ->get();

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=students_export.csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $handle = fopen('php://temp', 'r+');
        
        // Header
        fputcsv($handle, ['Admission No', 'Name', 'Email', 'Phone', 'Gender', 'Class', 'Stream', 'Parent Email', 'Registered Date']);

        // Rows
        foreach ($students as $student) {
            fputcsv($handle, [
                $student->admission_number,
                $student->name,
                $student->email,
                $student->phone,
                $student->gender,
                $student->class_name,
                $student->stream,
                $student->parent_email,
                $student->created_at,
            ]);
        }

        rewind($handle);
        $csvContent = stream_get_contents($handle);
        fclose($handle);

        return response($csvContent, 200, $headers);
    }

    /**
     * Remove the specified student from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if (!$user) {
            return response()->json(['message' => 'User is not a student'], 404);
        }

        DB::transaction(function () use ($user) {
            // Delete Student Profile
            if ($user->student) {
                $user->student->delete();
            }
            // Delete User Account
            $user->delete();

            // Log Activity
            \App\Models\Activity::create([
                'subject_type' => 'User', // Generic string since model is gone? Or use class name for history
                'subject_id' => $user->id,
                'causer_id' => auth()->id(),
                'description' => "Deleted student {$user->name} ($user->email)",
            ]);
        });

        return response()->json(['message' => 'Student deleted successfully']);
    }
}
