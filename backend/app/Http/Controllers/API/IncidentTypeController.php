<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\IncidentType;

class IncidentTypeController extends Controller
{
    public function index()
    {
        return response()->json(IncidentType::where('active', true)->get());
    }

    public function indexAll()
    {
        return response()->json(IncidentType::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'severity' => 'required|in:low,medium,high,critical',
            'points' => 'integer|min:0',
            'description' => 'nullable|string',
            'active' => 'boolean'
        ]);

        $type = IncidentType::create($validated);
        return response()->json($type, 201);
    }

    public function show(IncidentType $incidentType)
    {
        return response()->json($incidentType);
    }

    public function update(Request $request, IncidentType $incidentType)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'severity' => 'in:low,medium,high,critical',
            'points' => 'integer|min:0',
            'description' => 'nullable|string',
            'active' => 'boolean'
        ]);

        $incidentType->update($validated);
        return response()->json($incidentType);
    }

    public function destroy(IncidentType $incidentType)
    {
        $incidentType->delete();
        return response()->json(null, 204);
    }
}
