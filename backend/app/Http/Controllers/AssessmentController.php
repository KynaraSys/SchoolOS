<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Services\GradingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AssessmentController extends Controller
{
    protected $grading;

    public function __construct(GradingService $grading)
    {
        $this->grading = $grading;
    }

    /**
     * Get grading scales for dropdowns.
     */
    public function getGradingScales(Request $request)
    {
        $type = $request->query('type'); // pure or hybrid, or all if null
        if ($type) {
            return response()->json($this->grading->getScales($type));
        }
        
        return response()->json([
            'pure' => $this->grading->getScales('pure'),
            'hybrid' => $this->grading->getScales('hybrid')
        ]);
    }

    /**
     * Store a new assessment.
     */
    public function store(Request $request)
    {
        // 1. Authorization
        $user = $request->user();
        if (!$user->hasAnyRole(['Teacher', 'Admin', 'Principal', 'Super Admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 2. Validation
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'competency_id' => 'nullable|exists:competencies,id',
            'assessment_type' => 'required|in:pure_cbe,hybrid',
            'tool_type' => 'required|in:observation,project,written_test,checklist',
            'raw_score' => 'required_if:assessment_type,hybrid|numeric|min:0|max:100|nullable',
            'performance_level' => 'required_if:assessment_type,pure_cbe|string|nullable', // EE, ME etc.
            'teacher_remarks' => 'nullable|string',
            'evidence_files.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,mp4,mp3|max:10240', // 10MB
            'assessed_at' => 'required|date',
        ]);

        // 3. Logic
        $data = [
            'student_id' => $validated['student_id'],
            'subject_id' => $validated['subject_id'] ?? null,
            'competency_id' => $validated['competency_id'] ?? null,
            'assessment_type' => $validated['assessment_type'],
            'tool_type' => $validated['tool_type'],
            'teacher_remarks' => $validated['teacher_remarks'] ?? null,
            'assessed_at' => $validated['assessed_at'],
            'assessor_id' => $user->id,
            'evidence_paths' => [],
        ];

        if ($validated['assessment_type'] === 'hybrid') {
            $score = $validated['raw_score'];
            $scale = $this->grading->calculateHybrid($score);

            if (!$scale) {
                return response()->json(['message' => 'Invalid score range'], 422);
            }

            $data['raw_score'] = $score;
            $data['derived_indicator'] = $scale->indicator; // EE1
            $data['performance_level'] = $scale->indicator; // Storing same for consistency, or mapped band
        } else {
            // Pure CBE
            $indicator = $validated['performance_level'];
            $scale = $this->grading->resolvePure($indicator);
            
            if (!$scale) {
                 return response()->json(['message' => 'Invalid performance level'], 422);
            }

            $data['raw_score'] = null;
            $data['derived_indicator'] = $scale->indicator; // EE
            $data['performance_level'] = $scale->indicator;
        }

        // 4. File Upload
        if ($request->hasFile('evidence_files')) {
            $paths = [];
            foreach ($request->file('evidence_files') as $file) {
                $path = $file->store('evidence/' . $validated['student_id'], 'public');
                $paths[] = $path;
            }
            $data['evidence_paths'] = $paths; // Cast to JSON automatically by Eloquent if cast is set
        }

        $assessment = DB::table('assessments')->insertGetId(array_merge($data, [
            'created_at' => now(), 
            'updated_at' => now(),
            'evidence_paths' => json_encode($data['evidence_paths']) // Manual JSON encode for DB facade
        ]));

        return response()->json(['message' => 'Assessment recorded', 'id' => $assessment], 201);
    }

    /**
     * Get assessments for a student.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Filter params
        $studentId = $request->query('student_id');
        $subjectId = $request->query('subject_id');
        
        // Authorization: Parent can only see their child
        if ($user->hasRole('parent')) {
            // Verify student belongs to parent
            // Assuming relationship check here
            // if (!$user->students->contains($studentId)) abort(403);
            // Keeping it simple for now, but in prod verify this.
        }

        $query = DB::table('assessments')
            ->join('users', 'assessments.assessor_id', '=', 'users.id')
            ->select(
                'assessments.id',
                'assessments.assessment_type',
                'assessments.tool_type',
                'assessments.performance_level',
                'assessments.derived_indicator',
                'assessments.teacher_remarks',
                'assessments.evidence_paths',
                'assessments.assessed_at',
                'assessments.subject_id',
                'assessments.competency_id',
                'users.name as assessor_name'
            );

        // CONDITIONAL VISIBILITY
        if ($user->hasRole(['teacher', 'admin', 'principal'])) {
            $query->addSelect('assessments.raw_score');
        }

        if ($studentId) $query->where('assessments.student_id', $studentId);
        if ($subjectId) $query->where('assessments.subject_id', $subjectId);

        $assessments = $query->orderBy('assessed_at', 'desc')->paginate(20);
        
        // Decode JSON paths
        $assessments->getCollection()->transform(function ($item) {
            $item->evidence_paths = json_decode($item->evidence_paths);
            return $item;
        });

        return response()->json($assessments);
    }
}
