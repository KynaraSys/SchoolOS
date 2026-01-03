<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\AttendanceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public Routes
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth & Profile
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'profile']);

    // User Management - Accessible by Admin, Super Admin, ICT Admin
    Route::group(['middleware' => ['role:Admin|Super Admin|ICT Admin']], function () {
        Route::apiResource('users', \App\Http\Controllers\API\UserController::class);
        Route::post('/users/{user}/assign-class', [\App\Http\Controllers\API\UserController::class, 'assignClassTeacher']);
    });

    // Role & Permission Management - Accessible ONLY by Super Admin and ICT Admin
    Route::group(['middleware' => ['role:Super Admin|ICT Admin']], function () {
        Route::get('/permissions', [RoleController::class, 'permissions']);
        Route::apiResource('roles', RoleController::class);
    });

    // Example Protected Route for Teachers
    Route::get('/teacher/grades', function () {
        return response()->json(['message' => 'Teacher access granted']);
    })->middleware('role:Teacher');

    // Example Protected Route by Permission
    Route::get('/finance/reports', function () {
        return response()->json(['message' => 'Finance report access granted']);
    })->middleware('permission:access_finance');

    // Grades Resource (Policy Protected)
    Route::apiResource('grades', \App\Http\Controllers\API\GradeController::class);

    // Academic Structure (Policy Protected)
    Route::apiResource('classes', \App\Http\Controllers\API\SchoolClassController::class);
    Route::apiResource('subjects', \App\Http\Controllers\API\SubjectController::class);
    Route::apiResource('terms', \App\Http\Controllers\API\TermController::class);
    Route::post('/students/import', [\App\Http\Controllers\API\StudentController::class, 'import']);
    Route::get('/students/export', [\App\Http\Controllers\API\StudentController::class, 'export']);
    Route::apiResource('students', \App\Http\Controllers\API\StudentController::class);

    // Teacher "My Class" Module Routes
    Route::group(['prefix' => 'teacher/my-class', 'middleware' => 'role:Teacher'], function () {
        Route::get('/', [\App\Http\Controllers\TeacherMyClassController::class, 'index']);
        // Add more sub-routes here later (students, analytics, etc)
    });

    // Guardian Management
    Route::get('/guardians/stats', [\App\Http\Controllers\API\GuardianController::class, 'stats']);
    Route::post('/guardians/search-phone', [\App\Http\Controllers\API\GuardianController::class, 'searchByPhone']);
    Route::post('/guardians/{guardian}/message', [\App\Http\Controllers\API\GuardianController::class, 'sendMessage']);
    Route::get('/guardians/{guardian}/payments', [\App\Http\Controllers\API\GuardianController::class, 'getPayments']);
    Route::get('/guardians/{guardian}/communication', [\App\Http\Controllers\API\GuardianController::class, 'getCommunicationHistory']);
    Route::get('/guardians/{guardian}/notes', [\App\Http\Controllers\API\GuardianNoteController::class, 'index']);
    Route::post('/guardians/{guardian}/notes', [\App\Http\Controllers\API\GuardianNoteController::class, 'store']);
    Route::get('/guardians/{guardian}/documents', [\App\Http\Controllers\API\GuardianDocumentController::class, 'index']);
    Route::post('/guardians/{guardian}/documents', [\App\Http\Controllers\API\GuardianDocumentController::class, 'store']);
    Route::delete('/guardians/{guardian}/documents/{document}', [\App\Http\Controllers\API\GuardianDocumentController::class, 'destroy']);
    Route::get('/guardians/{guardian}/activities', [\App\Http\Controllers\API\ActivityController::class, 'guardianActivities']);
    
    // Access & Security
    Route::post('/guardians/{guardian}/portal-account', [\App\Http\Controllers\API\GuardianController::class, 'createPortalAccount']);
    Route::post('/guardians/{guardian}/reset-access', [\App\Http\Controllers\API\GuardianController::class, 'resetAccess']);
    Route::post('/guardians/{guardian}/toggle-access', [\App\Http\Controllers\API\GuardianController::class, 'toggleAccess']);

    Route::apiResource('guardians', \App\Http\Controllers\API\GuardianController::class);
    
    // Guardian-Student Linkage
    Route::post('/guardians/link', [\App\Http\Controllers\API\GuardianStudentController::class, 'store']); // Link
    Route::post('/guardians/unlink', [\App\Http\Controllers\API\GuardianStudentController::class, 'destroy']); // Unlink
    Route::put('/guardians/{guardian}/students/{student}', [\App\Http\Controllers\API\GuardianStudentController::class, 'update']); // Update pivot

    // Dashboard
    Route::get('/dashboard/principal', [\App\Http\Controllers\API\DashboardController::class, 'principalStats']);

    // Attendance
    Route::get('/attendance/overview', [AttendanceController::class, 'overview']);
    Route::get('/attendance/class/{classId}', [AttendanceController::class, 'showClass']);
    Route::post('/attendance', [AttendanceController::class, 'store']);

    // Discipline
    Route::get('/incidents/assignees', [\App\Http\Controllers\IncidentController::class, 'getAssignees']);
    Route::get('/incident-types/all', [\App\Http\Controllers\API\IncidentTypeController::class, 'indexAll']);
    Route::apiResource('incident-types', \App\Http\Controllers\API\IncidentTypeController::class);
    Route::apiResource('incidents', \App\Http\Controllers\IncidentController::class);

    // Messages
    Route::get('/messages/conversations', [\App\Http\Controllers\API\MessageController::class, 'index']);
    Route::get('/messages/users', [\App\Http\Controllers\API\MessageController::class, 'searchUsers']);
    Route::get('/messages/unread-count', [\App\Http\Controllers\API\MessageController::class, 'unreadCount']);
    Route::post('/messages/{id}/read', [\App\Http\Controllers\API\MessageController::class, 'markRead']);
    Route::get('/messages/{id}', [\App\Http\Controllers\API\MessageController::class, 'show']);
    Route::post('/messages', [\App\Http\Controllers\API\MessageController::class, 'store']);
});
