# School Operating System - Implemented Features List

**Status**: Active Development
**Modules Count**: 9 Core Modules

---

## 1. Authentication & Security
*   **Role-Based Access Control (RBAC)**: Secure permission system supporting 15 distinct roles (Super Admin, Teacher, Parent, Student, etc.).
*   **Secure Login**: Token-based authentication (Sanctum) with session handling and heartbeat monitoring.
*   **Force Logout**: Automatic session termination upon token expiration or backend revocation.
*   **Password Recovery**: "Forgot Password" flow with email reset links.
*   **Audit Logging**: Backend tracks critical actions for security audits.

## 2. Student Management
*   **Digital Student Profiles**: Comprehensive record keeping (Bio-data, Photo, Academic History).
*   **Admissions Workflow**: 
    -   Registration form with validation.
    -   Automatic Admission Number generation.
    -   Guardian linking during intake.
*   **Guardian Management**:
    -   Support for multiple guardians per student.
    -   "Primary" guardian designation for main contact.
    -   Relationship tracking (Father, Mother, Sponsor).
*   **Class/Stream Assignment**: Dynamic allocation of students to classes.

## 3. Academic Module
*   **Curriculum Support**: Configurable for CBC (Competency Based Curriculum) or 8-4-4 systems.
*   **Class Management**:
    -   Creation of Classes and Streams (e.g., Form 1 East).
    -   Assignment of Class Teachers.
*   **Subject Management**: Definition of subjects taught per class.
*   **Examination Management**:
    -   Creation of Exam Sessions (Term 1, Opener, Mid-Term, End-Term).
    -   Spreadsheet-like **Marks Entry** interface for teachers.
*   **Report Cards**: Automated generation of student performance reports (PDF Download).

## 4. Staff & HR Management
*   **User Directory**: Centralized list of all system users.
*   **Role Management**:
    -   Granular permission editing (ICT Admin).
    -   Dynamic assignment of roles to users.
*   **Teacher Workload**:
    -   "My Class" dashboard for Class Teachers.
    -   Subject allocation.

## 5. Finance & Billing
*   **Fee Structure**: Definition of payable items per term/class.
*   **Invoicing**: Automated generation of student invoices.
*   **Payment Recording**:
    -   Manual entry of payments (Cash, Bank, Mobile Money).
    -   Receipt generation.
*   **Balances**: Real-time calculation of outstanding fees.
*   **Parent View**: Parents can view their own child's fee statement.

## 6. Attendance Tracking
*   **Daily Registry**: Digital register for class teachers.
*   **Status Tracking**: Present, Absent, Late.
*   **History**: Calendar view of attendance trends.

## 7. Communication Module
*   **Announcements**: School-wide digital notice board.
*   **Messaging**:
    -   Direct teacher-to-parent messaging.
    -   Notification center for alerts.

## 8. Discipline Management
*   **Incident Logging**: Recording of behavioral issues (Minor/Major).
*   **Categorization**: Pre-defined incident types for consistent tracking.
*   **Teacher Access**: Restricted view for teachers (can only see self-reported incidents).

## 9. Insights & Analytics
*   **Administrator Dashboard**: High-level stats (Total Students, Staff, Revenue).
*   **Guardian Stats**: Overview of portal activation and engagement.
*   **Academic Trends**: Visualization of school performance over time.

---

*Note: This list reflects features currently visible in the codebase and verified as active.*
