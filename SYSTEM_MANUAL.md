# School Operating System - Comprehensive System Guide

## 1. System Overview & Technology Stack

### 1.1 Architecture
The School Operating System (School OS) is a modern, web-based education management platform built on a decoupled architecture:
-   **Frontend**: A Single Page Application (SPA) built with **Next.js 16** (React 19), serving as the user interface.
-   **Backend**: A RESTful API built with **Laravel 12**, handling business logic, database interactions, and authentication.
-   **Communication**: The frontend communicates with the backend via secure API endpoints using **Axios**.

### 1.2 Technology Stack

#### Frontend (Client-Side)
-   **Framework**: [Next.js 16](https://nextjs.org/) (React 19) - Provides server-side rendering capability and routing.
-   **Language**: TypeScript - Ensures type safety and code reliability.
-   **Styling**: 
    -   **Tailwind CSS v4**: Utility-first CSS framework for rapid UI development.
    -   **Radix UI**: Headless UI primitives for accessible components (Dialogs, Dropdowns, Toggles).
    -   **Lucide React**: Modern, consistent icon set.
    -   **Geist Font**: Premium typography.
-   **State Management & Data Fetching**:
    -   **React Context**: Used for global Authentication state (`AuthProvider`).
    -   **Axios**: HTTP client for API requests with interceptors for token handling.
-   **Form Handling**: `react-hook-form` with `zod` for schema validation.
-   **Utilities**: `date-fns` (dates), `clsx`/`tailwind-merge` (class management).

#### Backend (Server-Side)
-   **Framework**: [Laravel 12](https://laravel.com/) - Robust PHP framework.
-   **Language**: PHP 8.2+.
-   **Database**: SQLite (Configurable to MySQL/PostgreSQL) - Stores all application data.
-   **Authentication**: **Laravel Sanctum** - Provides a lightweight authentication system for SPAs (Token-based).
-   **Authorization**: **Spatie Laravel Permission** - Implements Role-Based Access Control (RBAC).

---

## 2. Roles and Permissions
The system enforces strict access control through a hierarchical role system.

### 2.1 Defined Roles
1.  **Owner**: Complete control over the system and school configuration.
2.  **Super Admin**: System-wide access, including technical settings and role management.
3.  **Admin**: High-level school administration (Admissions, Finance, Academic oversight).
4.  **ICT Admin**: Technical role for managing users, roles, and system logs.
5.  **Principal**: Executive view of the school (Reports, Grades, Staff).
6.  **Academic Director**: Manages curriculum, classes, subjects, and exams.
7.  **Teacher**: Class management, grading, attendance, and student discipline.
8.  **Bursar (Accountant)**: Financial management, fee collection, and payment tracking.
9.  **Operations Manager**: Logistics and non-academic operations.
10. **Discipline Master**: Manages student conduct, incidents, and disciplinary actions.
11. **Matron**: Boarding and welfare management.
12. **Admissions Officer**: Manages student intake and guardian details.
13. **Auditor**: Read-only access to financial and compliance records.
14. **Parent**: View-only access to their child's academic and financial records.
15. **Student**: View-only access to their own grades and timetable.

### 2.2 Methodology: RBAC Implementation
-   **Backend**: Permissions are assigned to roles via database seeders (`RolesAndPermissionsSeeder.php`). Middleware checks these permissions before processing requests.
-   **Frontend**: The `AuthProvider` fetches the user's role upon login. Components check `hasRole([...])` to conditionally render elements. Unauthorized API calls return `403 Forbidden`, which is caught globally to notify the user.

---

## 3. General Usage & Methodologies

### 3.1 Login & Authentication
**Methodology**: Token-Based Authentication.
1.  **Process**: User enters credentials at `/auth/login`.
2.  **Action**: The form submits to the backend. On success, a secure API token is returned.
3.  **Storage**: The token is stored in `localStorage` for persistence.
4.  **Session Helper**: A "heartbeat" runs every 60 seconds to verify the session is still active on the server. If the token expires or is revoked, the system forces a logout.

### 3.2 User Interface (The Dashboard)
The system uses a "Dashboard Shell" layout:
-   **Sidebar**: Collapsible navigation menu on the left.
-   **Header**: Contains global search, notifications, and user profile menu.
-   **Content Area**: The main workspace for the active module.

---

## 4. Step-by-Step Menu Guide

### 4.1 Overview (Dashboard)
**Access**: Super Admin, Admin, Teacher, Accountant, Parent.
-   **Purpose**: A landing page showing high-level metrics relevant to the user's role.
-   **Features**:
    -   **Stats Cards**: Quick summary (e.g., Total Students, Attendance %, Pending Fees).
    -   **Recent Activity**: Log of recent actions or alerts.

### 4.2 Students
**Access**: Admin, Teacher, Accountant.
-   **Purpose**: Central database of all students.
-   **Features**:
    -   **List View**: Searchable table of students with filters.
    -   **Profile view**: Detailed view of a single student (Personal details, Academic history, Guardians).
    -   **Actions**: Edit details, Delete student (Admin only).

### 4.3 Parents/Guardians
**Access**: Super Admin, Admin, Teacher, Admissions Officer.
-   **Purpose**: Manage parent contact information and link them to students.
-   **Features**:
    -   **Guardian Directory**: List of all registered guardians.
    -   **Linking**: Associate a guardian with one or multiple students.
    -   **Access Control**: Toggle a guardian's portal access on/off.

### 4.4 Academic
**Access**: Admin, Teacher.
**Sub-Menus**:
-   **Overview**: Academic performance summary.
-   **Exams**: Schedule and manage examination sessions.
-   **Results**: Entry and publishing of student grades.
**Methodology**:
-   Teachers enter grades for their specific subjects/classes.
-   The system calculates averages and rankings automatically.
-   Report cards are generated from this data.

### 4.5 Finance
**Access**: Admin, Accountant, Parent.
-   **Purpose**: Fee management and payment tracking.
-   **Features**:
    -   **Fee Structure**: Define fees for different classes/terms.
    -   **Payments**: Record incoming payments against a student's account.
    -   **Balances**: View outstanding balances (Parents see only their own child's balance).

### 4.6 Attendance
**Access**: Admin, Teacher, Parent.
-   **Purpose**: Track daily student presence.
-   **Features**:
    -   **Mark Register**: Teachers mark Present/Absent/Late for their class.
    -   **History**: View attendance trends over time.

### 4.7 Communication
**Access**: Admin, Teacher, Parent.
-   **Purpose**: Messaging system.
-   **Features**:
    -   **Announcements**: School-wide blasts.
    -   **Direct Messages**: Teacher-Parent messaging (audit-logged).

### 4.8 Insights
**Access**: Admin.
-   **Purpose**: Deep analytics.
-   **Features**: Trends in performance, enrollment, and finance over years.

### 4.9 Settings (Secondary Navigation)
**Access**: Admin / Super Admin (Restricted).
-   **School Settings**: General configuration (Name, Logo, Address).
-   **System Settings**:
    -   **User Management**: create/edit system users (Staff).
    -   **Roles**: View permissions (ICT Admin typically manages this).
    -   **Audit Logs**: View security logs of who did what.

---

## 5. Methodologies in Key Features

### User Management & RBAC
-   **Methodology**: The `roles` and `permissions` tables in the database drive access.
-   **Frontend**: The sidebar dynamically filters items. Example: `filterNav` function in `DashboardShell` checks `item.roles`. If the user lacks the role, the menu item provides no DOM element—it is completely hidden.

### Data Security
-   **Frontend**: Routes are protected. If a user navigates to `/system` but isn't an Admin, the API will reject the data fetch, and the UI will likely redirect or show an error.
-   **Backend**: API Routes are wrapped in middleware (e.g., `can:view_users`). This ensures that even if you curl the API directly, you cannot access data without the correct token and permissions.

### Performance
-   **Code Splitting**: Next.js automatically splits code per page, ensuring fast initial loads.
-   **Optimistic UI**: Simple state updates (like toggles) may reflect immediately while the background API request processes, providing a snappy feel.

---

## 6. Post-Admission Student Data Edit Policy
**Governing Principle**: Once a learner is admitted, their academic identity must remain stable. Personal, contact, and support contexts may evolve, but core identifiers are locked.

### 6.1 Editable vs Restricted Data

#### 1. Fully Editable (Ongoing Changes)
*Contextual details that naturally evolve.*
-   **Guardians**: Phone, Email, Occupation, Relationship.
-   **Support**: SEN status, Medical notes, Dietary requirements.
-   **Placement**: Class, Stream, Clubs.
> *Note*: Changes to Support settings are logged.

#### 2. Conditionally Editable (Controlled)
*Corrections only. Requires Admin role + Mandatory Reason.*
-   **Identity**: Full Name (Spelling fix only), Gender, DOB.
-   **Metadata**: Admission Date, Previous School.
> *Audit*: Every change must have a logged reason.

#### 3. Locked / Immutable
*Never editable after admission.*
-   **Identifiers**: Admission Number, Student System UUID.
-   **Academic**: First Enrollment Cohort, Curriculum Framework (CBC).
-   **History**: Submitted Assessment Records, Issued Report Cards.

### 6.2 Role-Based Editing Rights
| Data Type | Teacher | Admin | Note |
| :--- | :---: | :---: | :--- |
| **Guardian Contact** | ❌ | ✅ | Teachers view only (Privacy) |
| **SEN / Medical** | 👁️ (View/Flag) | ✅ | Critical for student welfare |
| **Class Placement** | ❌ | ✅ | Termly admin task |
| **Identity (Name/DOB)** | ❌ | ✅ | Corrections only, with reason |
| **Assessments** | ✅ (Add/Edit Drafts) | ❌ (No History Rewrite) | Historical grades are locked |
| **Admission No** | ❌ | ❌ | Permanent Identifier |

