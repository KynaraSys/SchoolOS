<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Login User and create Token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            \Illuminate\Support\Facades\Log::info("Login Failed: User not found for {$request->email}");
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        \Illuminate\Support\Facades\Log::info("Login Attempt for {$user->email}. Active: {$user->is_active}, Locked: {$user->locked_until}");

        if ($user->locked_until && now()->lessThan($user->locked_until)) {
            $seconds = now()->diffInSeconds($user->locked_until);
            return response()->json(['message' => 'Account locked. Try again in ' . $seconds . ' seconds.'], 423);
        }

        if (!$user->is_active) {
            \Illuminate\Support\Facades\Log::info("Login Blocked: User inactive");
            return response()->json(['message' => 'Your account has been deactivated. Please contact support.'], 403);
        }

        if ($user->hasRole('Student')) {
            \Illuminate\Support\Facades\Log::info("Login Blocked: Student access attempt for {$user->email}");
            return response()->json(['message' => 'Students are not allowed to access the system.'], 403);
        }

        if (!Hash::check($request->password, $user->password)) {
            \Illuminate\Support\Facades\Log::info("Login Failed: Password mismatch for {$user->email}");
            // Increment Failed Attempts
            $user->increment('failed_login_attempts');
            
            if ($user->failed_login_attempts >= 5) {
                $user->update(['locked_until' => now()->addMinutes(15)]);
                return response()->json(['message' => 'Account locked due to too many failed attempts.'], 423);
            }

            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Reset failures on success
        $user->update([
            'failed_login_attempts' => 0,
            'locked_until' => null
        ]);

        // Create Token
        $token = $user->createToken('auth_token')->plainTextToken;


        $user->load('roles'); // Load roles
        
        // Manually set permissions to include all (role-based + direct) for the frontend
        $allPermissions = $user->getAllPermissions()->map(function($p) {
            return ['name' => $p->name];
        });
        $user->setRelation('permissions', $allPermissions);

        $user->is_class_teacher = $user->isClassTeacher(); // Append Responsibility Flag

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user, 
        ]);
    }

    /**
     * Logout User (Revoke Token)
     */
    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get Authenticated User Profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'user' => $user,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }
}
