<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Term;
use Illuminate\Http\Request;

class TermController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        $this->authorizeResource(Term::class, 'term');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Term::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'academic_year' => 'required|string|max:20', // e.g. 2024-2025
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        return Term::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Term $term)
    {
        return $term;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Term $term)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'academic_year' => 'sometimes|required|string|max:20',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after:start_date',
        ]);

        $term->update($validated);

        return $term;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Term $term)
    {
        $term->delete();

        return response()->noContent();
    }
}
