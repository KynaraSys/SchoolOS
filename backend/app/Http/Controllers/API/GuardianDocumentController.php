<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Guardian;
use App\Models\GuardianDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GuardianDocumentController extends Controller
{
    public function index(Guardian $guardian)
    {
        return response()->json($guardian->documents()->with('uploader')->latest()->get());
    }

    public function store(Request $request, Guardian $guardian)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240', // 10MB
        ]);

        $file = $request->file('file');
        $path = $file->store('guardian_documents', 'public');

        $document = $guardian->documents()->create([
            'title' => $request->title,
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize() / 1024, // KB
            'uploaded_by' => auth()->id(),
        ]);

        return response()->json($document->load('uploader'), 201);
    }

    public function destroy(Guardian $guardian, GuardianDocument $document)
    {
        if ($document->guardian_id !== $guardian->id) {
            abort(403);
        }

        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return response()->json(['message' => 'Document deleted']);
    }
}
