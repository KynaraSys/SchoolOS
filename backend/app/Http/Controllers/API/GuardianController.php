<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Guardian;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Illuminate\Validation\Rule;
use App\Services\PasswordService;

class GuardianController extends Controller
{
    public function __construct()
    {
        // Policy authorization is handled in methods or via middleware in routes
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Guardian::class);

        $query = Guardian::with('students'); // Eager load students

        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Filter by student name
        if ($request->filled('student_name')) {
            $query->whereHas('students', function ($q) use ($request) {
                $studentName = str_replace(' ', '', $request->student_name);
                $q->where(function($sq) use ($studentName) {
                    $sq->whereRaw("REPLACE(first_name, ' ', '') ILIKE ?", ["%{$studentName}%"])
                       ->orWhereRaw("REPLACE(last_name, ' ', '') ILIKE ?", ["%{$studentName}%"])
                       ->orWhereRaw("REPLACE(other_names, ' ', '') ILIKE ?", ["%{$studentName}%"]);
                });
            });
        }

        // Filter by class
        if ($request->filled('class')) {
            $query->whereHas('students', function ($q) use ($request) {
                // $q is User query. User hasOne Student. Student belongsTo SchoolClass.
                    $sq->whereHas('schoolClass', function ($cq) use ($request) {
                         $cq->where('name', 'ilike', "%{$request->class}%");
                    });
            });
        }
        
        // Filter by relationship type
        if ($request->filled('relationship_type')) {
            $query->where('relationship_type', $request->relationship_type);
        }

        // Filter by communication preference
        if ($request->filled('communication_preference')) {
            $pref = $request->communication_preference; // 'sms' or 'email'
            $query->whereHas('students', function ($q) use ($pref) {
                if ($pref === 'sms') {
                    $q->where('guardian_student.receives_sms', true);
                } elseif ($pref === 'email') {
                    $q->where('guardian_student.receives_email', true);
                }
            });
        }

        $guardians = $query->latest()->paginate(15);

        return response()->json($guardians);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Guardian::class);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number' => 'required|string|unique:guardians,phone_number',
            'email' => 'nullable|email|max:255',
            'national_id' => 'nullable|string|max:20',
            'relationship_type' => 'required|string',
            'address' => 'nullable|string',
            'occupation' => 'nullable|string',
            'receives_sms' => 'boolean',
            'receives_email' => 'boolean',
            'receives_whatsapp' => 'boolean',
            'receives_portal' => 'boolean',
            'receives_calls' => 'boolean',
        ]);

        // Normalize phone number to 254 format if needed
        $validated['phone_number'] = $this->normalizePhoneNumber($validated['phone_number']);
        
        // Re-check uniqueness after normalization (optional, but good practice)
        if (Guardian::where('phone_number', $validated['phone_number'])->exists()) {
             return response()->json(['message' => 'The phone number has already been taken (normalized).', 'errors' => ['phone_number' => ['The phone number has already been taken.']]], 422);
        }

        $guardian = Guardian::create($validated);

        return response()->json($guardian, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Guardian $guardian)
    {
        $this->authorize('view', $guardian);
        
        $user = auth()->user();

        // 1. Identify Role Context
        $isAdmin = $user->hasRole(['Admin', 'Super Admin', 'ICT Admin', 'Principal', 'Deputy Principal', 'Bursar', 'Admissions Officer']);
        $isClassTeacher = $user->hasRole('Teacher') && $user->isClassTeacher(); // Validated in Policy that they are linked to class
        $isTeacher = $user->hasRole('Teacher');

        // 2. Load Relations (Always load students for context, but filter deep data if needed)
        $guardian->load(['students.schoolClass']);

        // 3. Filter Data for Teachers
        if (!$isAdmin) {
            // Remove Administrative/Sensitive Fields
            $guardian->makeHidden(['national_id', 'address', 'occupation', 'financial_summary', 'documents', 'notes', 'created_at', 'updated_at', 'email']);
            
            // Handle Phone Number
            if ($isClassTeacher) {
                // Check if actually class teacher for one of the kids (Policy checked this, but double check for masking context if multiple kids)
                // For Class Teacher: Mask Phone Number (showing last 3 digits or similar is common, but request said 'optionally masked' -> Let's key on 'Masked')
                // "Phone number (optionally masked)" -> Safety first: Mask it.
                if ($guardian->phone_number) {
                     $guardian->phone_number = '******' . substr($guardian->phone_number, -4);
                }
            } else {
                // Subject Teacher: NO Contact Info
                $guardian->makeHidden(['phone_number', 'phone']);
            }

            // Financials: STRICTLY FORBIDDEN
            // Do not calculate or attach financial summary

            // Audit Log for Direct API Access by Teacher
            if ($isTeacher) { // Log only for teachers as admin access is high volume/trusted or logged elsewhere if needed
                 \App\Models\Activity::create([
                    'subject_type' => Guardian::class,
                    'subject_id' => $guardian->id,
                    'causer_id' => $user->id,
                    'description' => 'Direct guardian view via API',
                    'properties' => ['role' => $user->getRoleNames()]
                ]);
            }
            
            return response()->json($guardian);
        }

        // --- ADMIN ONLY SECTION ---

        $guardian->load(['students.payments', 'user', 'documents', 'notes']);

        // Calculate Financial Summary
        $totalBalance = 0;
        $cleared = 0;
        $uncleared = 0;
        $lastPayment = null;

        foreach ($guardian->students as $student) {
            if ($student) {
                // Mock Fee Structure: Standard Term Fee = 50,000
                $standardFee = 50000; 
                $paid = $student->payments->sum('amount');
                $balance = $standardFee - $paid;

                $totalBalance += $balance;
                if ($balance <= 0) {
                    $cleared++;
                } else {
                    $uncleared++;
                }

                $studentLastPayment = $student->payments->max('payment_date');
                if ($studentLastPayment && (!$lastPayment || $studentLastPayment > $lastPayment)) {
                    $lastPayment = $studentLastPayment;
                }
                
                // Inject balance into student object for frontend use if needed efficiently
                $student->calculated_balance = $balance;
            }
        }

        // Determine Current Term
        $currentTerm = \App\Models\Term::where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();
        
        if (!$currentTerm) {
            $currentTerm = \App\Models\Term::latest('start_date')->first();
        }

        $termName = $currentTerm ? "{$currentTerm->name} {$currentTerm->academic_year}" : "Current Term";

        $guardian->financial_summary = [
            'total_balance' => $totalBalance,
            'cleared_students' => $cleared,
            'uncleared_students' => $uncleared,
            'last_payment_date' => $lastPayment,
            'current_term_name' => $termName,
            // 'last_payment_amount' => ... (complex if multiple)
        ];

        return response()->json($guardian);
    }

    public function getPayments(Guardian $guardian)
    {
        $this->authorize('view', $guardian);
        
        $guardian->load(['students.payments']);

        $payments = collect();

        foreach ($guardian->students as $student) {
            if ($student && $student->payments) {
                foreach ($student->payments as $payment) {
                    $payments->push([
                        'id' => $payment->id,
                        'date' => $payment->payment_date,
                        'amount' => $payment->amount,
                        'method' => $payment->payment_method ?? 'N/A',
                        'reference' => $payment->reference_number ?? 'N/A',
                        'student_name' => $student->user->name ?? 'Unknown Student',
                        'student_admission_number' => $student->admission_number,
                    ]);
                }
            }
        }

        $sortedPayments = $payments->sortByDesc('date')->values();

        return response()->json([
            'data' => $sortedPayments
        ]);
    }

    public function getCommunicationHistory(Request $request, Guardian $guardian)
    {
        $this->authorize('view', $guardian);

        $query = \App\Models\CommunicationLog::where('guardian_id', $guardian->id)
            ->with('student.user');

        // Filter by Student
        if ($request->filled('student_id') && $request->student_id !== 'all') {
            $query->where('student_id', $request->student_id);
        }

        // Filter by Type
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Filter by Date Range
        if ($request->filled('date_from')) {
            $query->whereDate('sent_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('sent_at', '<=', $request->date_to);
        }

        $logs = $query->latest('sent_at')->get();

        // Calculate Stats (Global for this guardian)
        $statsQuery = \App\Models\CommunicationLog::where('guardian_id', $guardian->id);
        
        $stats = [
            'total' => (clone $statsQuery)->count(),
            'sms_count' => (clone $statsQuery)->where('type', 'sms')->count(),
            'email_count' => (clone $statsQuery)->where('type', 'email')->count(),
            'last_contact' => (clone $statsQuery)->latest('sent_at')->value('sent_at'),
        ];

        return response()->json([
            'data' => $logs,
            'stats' => $stats
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Guardian $guardian)
    {
        $this->authorize('update', $guardian);

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone_number' => ['sometimes', 'string', Rule::unique('guardians')->ignore($guardian->id)],
            'email' => 'nullable|email|max:255',
            'national_id' => 'nullable|string|max:20',
            'relationship_type' => 'sometimes|string',
            'address' => 'nullable|string',
            'occupation' => 'nullable|string',
            'is_active' => 'boolean',
            'receives_sms' => 'boolean',
            'receives_email' => 'boolean',
            'receives_whatsapp' => 'boolean',
            'receives_portal' => 'boolean',
            'receives_calls' => 'boolean',
        ]);

        if (isset($validated['phone_number'])) {
            $validated['phone_number'] = $this->normalizePhoneNumber($validated['phone_number']);
             // Re-check uniqueness ignore current
             if (Guardian::where('phone_number', $validated['phone_number'])->where('id', '!=', $guardian->id)->exists()) {
                 return response()->json(['message' => 'The phone number has already been taken.', 'errors' => ['phone_number' => ['The phone number has already been taken.']]], 422);
             }
        }

        $guardian->update($validated);

        // Logging Activity
        $changes = $guardian->getChanges();
        if (!empty($changes)) {
            \App\Models\Activity::create([
                'subject_type' => \App\Models\Guardian::class,
                'subject_id' => $guardian->id,
                'causer_id' => auth()->id(),
                'description' => 'Updated profile details',
                'properties' => $changes, // Log what changed
            ]);
        }
        
        return response()->json($guardian);
    }

    /**
     * Search guardians by phone number (for checking existence before creation).
     */
    public function searchByPhone(Request $request)
    {
        $this->authorize('viewAny', Guardian::class);
        
        $request->validate(['phone' => 'required|string']);
        
        $phone = $this->normalizePhoneNumber($request->phone);
        
        $guardian = Guardian::where('phone_number', $phone)->first();
        
        if (!$guardian) {
            return response()->json(['message' => 'Guardian not found'], 404);
        }
        
        return response()->json(['guardian' => $guardian]);
    }

    /**
     * Search guardians by national ID number (for admission linking).
     */
    public function searchById(Request $request)
    {
        $this->authorize('viewAny', Guardian::class);
        
        $request->validate(['national_id' => 'required|string']);
        
        $nationalId = trim($request->national_id);
        
        $guardian = Guardian::where('national_id', $nationalId)->first();
        
        if (!$guardian) {
            return response()->json(['message' => 'Guardian not found'], 404);
        }
        
        return response()->json(['guardian' => $guardian]);
    }

    public function createPortalAccount(Guardian $guardian)
    {
        $this->authorize('update', $guardian); // Or create user permission

        if ($guardian->user_id) {
            return response()->json(['message' => 'Portal account already exists.'], 400);
        }

        // Create User
        $passwordAttributes = PasswordService::generateInitialPasswordAttributes(); // Get hash/force_change
        
        $user = \App\Models\User::create([
            'name' => $guardian->first_name . ' ' . $guardian->last_name,
            'email' => $guardian->email ?? strtolower($guardian->first_name . '.' . $guardian->last_name . $guardian->id . '@parent.portal'),
            'password' => $passwordAttributes['password'], 
            'force_password_change' => $passwordAttributes['force_password_change'],
            'phone' => $guardian->phone_number,
            'is_active' => true,
        ]);

        $user->assignRole('Parent'); // Ensure Role exists or handled

        $guardian->user_id = $user->id;
        $guardian->save();

        // Send Notification
        $user->notify(new \App\Notifications\TemporaryPasswordNotification($passwordAttributes['plain_password']));

        return response()->json(['message' => 'Portal account created successfully. Credentials sent via email/SMS.', 'user' => $user]);
    }

    public function resetAccess(Guardian $guardian)
    {
        $this->authorize('update', $guardian);

        if (!$guardian->user_id) {
            return response()->json(['message' => 'No associated portal account.'], 404);
        }

        $user = $guardian->user;
        PasswordService::setTemporaryPassword($user); // Handles hashing, force change, and notification

        $user->failed_login_attempts = 0;
        $user->locked_until = null;
        $user->save();

        return response()->json(['message' => 'Access reset successfully. Temporary password sent via notification.']);
    }

    public function toggleAccess(Guardian $guardian)
    {
        $this->authorize('update', $guardian);

        if (!$guardian->user_id) {
            return response()->json(['message' => 'No associated portal account.'], 404);
        }

        $user = $guardian->user;
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'message' => $user->is_active ? 'Account enabled.' : 'Account disabled.',
            'is_active' => $user->is_active
        ]);
    }

    public function stats()
    {
        $this->authorize('viewAny', Guardian::class);

        return response()->json([
            'total' => Guardian::count(),
            'active' => Guardian::where('is_active', true)->count(),
            'new_this_month' => Guardian::where('created_at', '>=', now()->subDays(30))->count(),
            'logged_in_recently' => Guardian::whereHas('user', function ($q) {
                $q->where('last_login_at', '>=', now()->subDays(7));
            })->count(),
        ]);
    }

    private function normalizePhoneNumber($phone)
    {
        // Remove any non-digit characters except +
        $phone = preg_replace('/[^0-9+]/', '', $phone);

        // Check patterns
        if (preg_match('/^(?:254|\+254|0)([17]\d{8})$/', $phone, $matches)) {
            return '254' . $matches[1];
        }

        return $phone; // Return original if no match (validation will catch invalid format if strict regex specific elsewhere, relying on basic string for now)
    }

    public function sendMessage(Request $request, Guardian $guardian)
    {
        $this->authorize('update', $guardian);

        $validated = $request->validate([
            'type' => 'required|in:sms,email,whatsapp',
            'message' => 'required|string',
            'student_id' => 'nullable|exists:users,id', // Optional: link to specific student context
            'subject' => 'nullable|string|max:255', // For emails
        ]);

        // In a real app, dispatch Job to send SMS/Email here using $guardian->phone/email
        // e.g. SmsService::send($guardian->phone_number, $validated['message']);

        $log = \App\Models\CommunicationLog::create([
            'guardian_id' => $guardian->id,
            'student_id' => $validated['student_id'] ?? null,
            'type' => $validated['type'],
            'direction' => 'outbound',
            'subject' => $validated['subject'] ?? ($validated['type'] === 'sms' ? 'SMS Notification' : 'Message'),
            'content' => $validated['message'],
            'status' => 'sent', // Assume success for now
            'sent_at' => now(),
            'user_id' => auth()->id(),
        ]);

        return response()->json(['message' => 'Message sent successfully', 'log' => $log]);
    }

    /**
    * Remove the specified guardian from storage.
    */
    public function destroy(Guardian $guardian)
    {
        $this->authorize('delete', $guardian);

        // Check if guardian has linked students
        if ($guardian->students()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete guardian because they are linked to students. Please deactivate instead.',
                'error_code' => 'GUARDIAN_LINKED_TO_STUDENTS'
            ], 422);
        }

        $guardian->delete();

        // Log Activity
        Activity::create([
            'subject_type' => 'Guardian',
            'subject_id' => $guardian->id, // ID might be kept in log even if deleted
            'causer_id' => auth()->id(),
            'description' => "Deleted guardian {$guardian->first_name} {$guardian->last_name}",
        ]);

        return response()->json(['message' => 'Guardian deleted successfully']);
    }
}
