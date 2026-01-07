<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\RemarkService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RemarkController extends Controller
{
    protected $remarkService;

    public function __construct(RemarkService $remarkService)
    {
        $this->remarkService = $remarkService;
    }

    /**
     * Get remarks for a learner.
     */
    public function index(Request $request, $studentId)
    {
        // Optional term filtering
        $termId = $request->query('term_id');
        
        $remarks = $this->remarkService->getStudentRemarks($studentId, $termId);

        return response()->json($remarks);
    }

    /**
     * Create a new remark.
     */
    public function store(Request $request, $studentId)
    {
        $validated = $request->validate([
            'term_id' => 'required|exists:terms,id',
            'type' => 'required|in:formative,profile,report',
            'remark_text' => 'required|string',
            'title' => 'nullable|string',
        ]);

        try {
            // Append studentId to data
            $validated['student_id'] = $studentId;

            $remark = $this->remarkService->createRemark(Auth::user(), $validated);

            return response()->json(['message' => 'Remark created successfully', 'data' => $remark], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }
}
