<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GradeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->can('viewAny', Grade::class)) {
            return response()->json(Grade::with('student')->get());
        }

        // Return only own grades for students
        return response()->json(Grade::where('user_id', $user->id)->get());
    }

    /**
     * Display the specified resource.
     */
    public function show(Grade $grade)
    {
        $this->authorize('view', $grade); // Checks GradePolicy::view

        return response()->json($grade);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Grade::class);

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'subject' => 'required|string',
            'score' => 'required|integer|min:0|max:100',
        ]);

        $grade = Grade::create($request->all());

        return response()->json($grade, 201);
    }
}
