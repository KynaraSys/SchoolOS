<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Guardian;
use App\Models\GuardianNote;
use Illuminate\Http\Request;

class GuardianNoteController extends Controller
{
    public function index(Guardian $guardian)
    {
        // $this->authorize('view', $guardian); // Or viewNotes permission

        $notes = $guardian->notes()->with('user')->latest()->get();

        return response()->json($notes);
    }

    public function store(Request $request, Guardian $guardian)
    {
        // $this->authorize('update', $guardian); // Or addNote permission

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $note = $guardian->notes()->create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
        ]);

        return response()->json($note->load('user'), 201);
    }
}
