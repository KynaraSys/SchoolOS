<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStaffRequest;
use App\Models\Staff;
use App\Services\StaffService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StaffController extends Controller
{
    protected StaffService $staffService;

    public function __construct(StaffService $staffService)
    {
        $this->staffService = $staffService;
        // Middleware handled in routes or here (e.g., permission:manage_staff)
    }

    /**
     * Display a listing of the staff.
     */
    public function index(Request $request): JsonResponse
    {
        // Simple pagination with search
        $query = Staff::with('user.roles');

        if ($request->has('search')) {
            $search = str_replace(' ', '', $request->get('search'));
            $query->where(function($q) use ($search) {
                  $q->whereRaw("REPLACE(staff_number, ' ', '') LIKE ?", ["%{$search}%"])
                  ->orWhereRaw("REPLACE(national_id_number, ' ', '') LIKE ?", ["%{$search}%"])
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->whereRaw("REPLACE(name, ' ', '') LIKE ?", ["%{$search}%"])
                        ->orWhereRaw("REPLACE(email, ' ', '') LIKE ?", ["%{$search}%"])
                        ->orWhereRaw("REPLACE(phone, ' ', '') LIKE ?", ["%{$search}%"]);
                  });
            });
        }

        $staff = $query->latest()->paginate(15);

        return response()->json($staff);
    }

    /**
     * Store a newly created staff member in storage.
     */
    public function store(StoreStaffRequest $request): JsonResponse
    {
        try {
            $staff = $this->staffService->createStaff($request->validated());
            
            // Reload to include user relations
            $staff->load('user.roles');

            return response()->json([
                'message' => 'Staff member onboarded successfully.',
                'data' => $staff
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create staff member.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Staff $staff): JsonResponse
    {
        $staff->load('user.roles');
        return response()->json($staff);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Staff $staff): JsonResponse
    {
        // Validation should ideally be in UpdateStaffRequest
        // For now using inline or reusing StoreStaffRequest rules with modifications
        
        try {
             $data = $request->all(); // Or validate
             $updatedStaff = $this->staffService->updateStaff($staff, $data);
             
             return response()->json([
                'message' => 'Staff updated successfully.',
                'data' => $updatedStaff
            ]);

        } catch (\Exception $e) {
             return response()->json([
                'message' => 'Failed to update staff.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Staff $staff): JsonResponse
    {
        // Add archiving logic here if checking archives
        $staff->delete();
        if ($staff->user) {
            $staff->user->delete(); // Soft delete user too? Policy decision.
        }

        return response()->json(['message' => 'Staff member archived.']);
    }
}
