# School Operating System - User Operations Manual

**Version:** 1.0  
**Date:** 2025-12-28  
**Scope:** Comprehensive guide for all system roles.

---

## Table of Contents

1.  **Getting Started**
    *   1.1 System Requirements
    *   1.2 Logging In
    *   1.3 Password Recovery
2.  **Dashboard Overview**
    *   2.1 Navigation Sidebar
    *   2.2 Top Header & Search
    *   2.3 User Profile & Logout
3.  **Administrator Operations**
    *   3.1 Student Management
        *   3.1.1 Adding a New Student
        *   3.1.2 Editing Student Details
        *   3.1.3 Deleting a Student
        *   3.1.4 Linking Guardians
    *   3.2 Class Management
        *   3.2.1 Creating a New Class
        *   3.2.2 Assigning Class Teachers
    *   3.3 Staff Management
        *   3.3.1 Registering New Staff
        *   3.3.2 Managing Roles & Permissions
    *   3.4 Finance Management
        *   3.4.1 Recording Fee Payments
        *   3.4.2 Generating Fee Structures
4.  **Teacher Operations**
    *   4.1 Class Management
        *   4.1.1 Viewing My Class
        *   4.1.2 Marking Attendance
    *   4.2 Academic Management
        *   4.2.1 Entering Exam Marks
        *   4.2.2 Generating Report Cards
    *   4.3 Discipline
        *   4.3.1 Recording an Incident
5.  **Parent/Guardian Operations**
    *   5.1 Monitoring Child Progress
    *   5.2 Financials
6.  **Troubleshooting & Support**

---

## 1. Getting Started

### 1.1 System Requirements
To access the School Operating System (School OS), ensure you have:
*   A modern web browser (Google Chrome, Microsoft Edge, Firefox, or Safari).
*   A stable internet connection.
*   **Recommendation:** For data entry tasks (Admins/Teachers), use a desktop or laptop computer. Parents may comfortably use mobile devices.

### 1.2 Logging In
**Who:** All Users

1.  Navigate to the system URL provided by your administrator.
2.  You will see the **Sign In** screen featuring the school logo.
3.  **Email Address Field**: Click on the input box labeled "Email Address" and type your registered school email (e.g., `principal@yourschool.ac.ke`).
4.  **Password Field**: Click on the input box labeled "Password" and type your secure password.
    *   *Note*: Passwords are case-sensitive.
5.  **Sign In Button**: Click the blue **"Sign In"** button.
    *   *Action*: The system verifies your credentials.
    *   *Success*: You are redirected to the **Dashboard**.
    *   *Failure*: A red alert "Invalid email or password" will appear. Double-check your credentials.

### 1.3 Password Recovery
**Who:** All Users

1.  On the Login screen, locate the link: **"Forgot your password?"** just below the password field.
2.  Click the link.
3.  Enter your email address in the provided field.
4.  Click **"Send Reset Link"**.
5.  Check your email inbox for a secure link to create a new password.

---

## 2. Dashboard Overview

### 2.1 Navigation Sidebar
Located on the left side of the screen (on Desktop) or accessed via the Menu icon (on Mobile).

*   **Expand/Collapse**: Click the **Chevron Down** icon next to menu items like "Academic" to reveal sub-menus ("Overview", "Exams", "Results").
*   **Active Tab**: The page you are currently viewing is highlighted in a lighter shade with accent text.

### 2.2 Top Header & Search
*   **Search Bar**: Located in the center-top.
    *   *Action*: Click inside "Search students, staff, reports...".
    *   *Input*: Type a name (e.g., "John Doe").
    *   *Result*: A dropdown list of matching results appears instantly. Click a result to jump to that record.
*   **Notifications**: Click the **Bell Icon** on the top right.
    *   A dropdown list shows recent alerts (e.g., "Fee Default Risk", "Term Reports Ready").
    *   Click a notification to view details.

### 2.3 User Profile & Logout
Located at the top-right corner.
1.  Click your **Avatar/Name**.
2.  A dropdown menu appears.
3.  **My Account**: Click "Profile" to view your own details.
4.  **Log Out**: Click "Log out" to securely end your session. **Always do this on shared computers.**

---

## 3. Administrator Operations

### 3.1 Student Management
**path:** `Dashboard > Students`

#### 3.1.1 Adding a New Student
1.  Click the **"Students"** item in the sidebar.
2.  On the Students list page, locate the **"Add Student"** button in the top-right corner.
3.  Click it to open the **Student Registration Form**.
4.  **Student Details Section**:
    *   **Image**: Click the camera icon placeholder to upload a photo (Max 2MB).
    *   **First Name**: Enter the student's first name (Required).
    *   **Middle Name**: Enter middle name (Optional).
    *   **Surname**: Enter surname (Required).
    *   **Gender**: Click the "Select Gender" dropdown and choose "Male" or "Female".
    *   **Date of Birth**: Click the calendar icon to select the date.
    *   **Class**: Click "Select Class" dropdown (e.g., "Form 1 East").
    *   **Student Email**: Enter a unique email for the student login (e.g., `jane@school.com`).
5.  **Guardians Section** (Crucial Step):
    *   *Note*: At least one guardian is required.
    *   **Select Guardian**: Use the Guardian Selector search bar to find an existing parent.
    *   **If New Parent**: You may need to create the parent first in the Guardians menu (see section 3.1.4).
    *   **Primary Guardian**: Ensure at least one linked guardian has the "Primary" badge. Click "Make Primary" if needed.
6.  **Submit**: Click the **"Create Student"** button at the bottom right.
    *   *Validation*: If any required field is missing, the form will shake and outline the missing field in red.

#### 3.1.2 Editing Student Details
1.  In the Student List, locate the student row.
2.  Click on the student's **Name** to view their profile.
3.  Click the **"Edit Profile"** button (Pencil icon) on the profile card.
4.  Update the necessary fields in the modal.
5.  Click **"Update Student"**.

#### 3.1.3 Deleting a Student
**Warning**: This action is irreversible.
1.  Navigate to the Student Profile.
2.  Locate the **"Delete Student"** button (Red Trash Icon).
3.  Click it. A confirmation dialog appears: "Are you absolutely sure?".
4.  Click **"Continue"** to confirm deletion.

#### 3.1.4 Linking Guardians
1.  Navigate to `Dashboard > Guardians`.
2.  Click **"Add Guardian"** to register a new parent.
    *   **Fields**: First Name, Last Name, Phone (Required - 10 digits), Relation (Father/Mother/Guardian).
3.  Once created, go back to the **Student Profile**.
4.  In the "Guardians" tab, click **"Link Guardian"**.
5.  Search for the parent by name or phone number.
6.  Click **"Link"**.

---

### 3.2 Class Management
**path:** `Dashboard > Academic > Classes`

#### 3.2.1 Creating a New Class
1.  Navigate to `Academic > Classes`.
2.  Click **"Add Class"**.
3.  **Form**:
    *   **Name**: E.g., "Form 1".
    *   **Stream**: E.g., "East" (Optional).
    *   **Level**: Select the academic level (e.g., Secondary).
    *   **Capacity**: Enter max students (e.g., 40).
4.  Click **"Create Class"**.

#### 3.2.2 Assigning Class Teachers
1.  In the Class List, click on a Class Card (e.g., "Form 1 East").
2.  Look for the **"Class Teacher"** section.
3.  Click **"Assign Teacher"**.
4.  Select a staff member from the dropdown list.
5.  Click **"Save Assignment"**.
    *   *Result*: This teacher will now see this class in their "My Class" dashboard.

---

### 3.3 Staff Management
**path:** `Dashboard > Settings > Users`

#### 3.3.1 Registering New Staff
1.  Go to `System Settings`.
2.  Select the **"User Management"** tab.
3.  Click **"Add User"**.
4.  **Fields**:
    *   **Full Name**: Enter name.
    *   **Email**: Enter work email.
    *   **Role**: Select from dropdown (e.g., "Teacher", "Bursar").
    *   **Password**: Set an initial temporary password.
5.  Click **"Create User"**.

#### 3.3.2 Managing Roles & Permissions
**Access**: ICT Admin Only.
1.  Go to `System Settings > Roles`.
2.  Click on a Role (e.g., "Teacher").
3.  **Permissions Matrix**: You will see a list of checkboxes (e.g., `view_grades`, `edit_grades`).
4.  **Modify**: Check or uncheck boxes to grant/revoke specific abilities.
5.  Click **"Save Changes"**.

---

## 4. Teacher Operations

### 4.1 Class Management
**path:** `Dashboard > My Class` (Visible only if you are a designated Class Teacher)

#### 4.1.1 Viewing My Class
1.  Click **"My Class"** in the sidebar.
2.  You will see a roster of all students in your assigned form stream.
3.  **Quick Actions**: From here, you can jump to any student's full profile.

#### 4.1.2 Marking Attendance
1.  Navigate to `Attendance`.
2.  Select **"Mark Register"**.
3.  Choose your **Class** and the **Date** (defaults to today).
4.  **List**: You will see a list of students with "Present", "Absent", "Late" radio buttons.
5.  **Action**: Click the appropriate status for each student.
    *   *Tip*: Use "Mark All Present" button to speed up the process, then manually change the absentees.
6.  Click **"Submit Register"**.

---

### 4.2 Academic Management

#### 4.2.1 Entering Exam Marks
1.  Navigate to `Academic > Exams`.
2.  Select the active **Exam Session** (e.g., "Term 1 2024 End Exam").
3.  Click **"Enter Marks"**.
4.  Select your **Subject** (e.g., Mathematics) and **Class**.
5.  **Data Grid**: A spreadsheet-like view appears.
6.  **Entry**: Click in the "Score" cell next to a student's name. Type the mark (0-100).
    *   *Auto-Save*: The system auto-saves as you click away, but look for the "Saved" indicator.
7.  **Review**: Ensure no typos (e.g., entering 105 instead of 15). The system will flag invalid numbers.

#### 4.2.2 Generating Report Cards
**Note**: Usually done by the Academic Director or Class Teacher after all marks are in.
1.  Navigate to `Academic > Results`.
2.  Select the **Class**.
3.  Click **"Generate Reports"**.
4.  Click **"Download All"** (PDF) to get a printable batch of report cards.

### 4.3 Discipline
**path:** `Dashboard > Students > [Student Profile] > Discipline`

#### 4.3.1 Recording an Incident
1.  Go to the Student's Profile.
2.  Click the **"Discipline"** tab (Shield Icon).
3.  Click **"Log Incident"**.
4.  **Form**:
    *   **Title**: Short summary (e.g., "Late Arrival").
    *   **Category**: Select (Minor/Major/Critical).
    *   **Description**: Detailed account of what happened.
    *   **Action Taken**: (Optional) e.g., "Verbal Warning".
5.  Click **"Submit Incident"**.
    *   *Notification*: The Discipline Master and Parent (if configured) will be notified.

---

## 5. Parent/Guardian Operations

### 5.1 Monitoring Child Progress
1.  Log in using the email provided to the school administration.
2.  **Dashboard**: You immediately see your child's (or children's) summary cards.
3.  **Reports**: Click **"Academic"** sidebar item.
    *   **Action**: Click "Download Report" on the latest Term entry to view the PDF report card.
4.  **Attendance**: Click **"Attendance"** to view a calendar. Red dots indicate absence.

### 5.2 Financials
1.  Click **"Finance"** in the sidebar.
2.  **Overview card**: Shows "Total Invoiced", "Paid", and "Balance Due".
3.  **Statement**: Scroll down to see a ledger of invoices and receipts.
4.  **Pay Fees**: (If enabled) Click the **"Pay Now"** button.
    *   Follow the prompts to pay via Mobile Money or Card.
    *   *Alternative*: View bank details provided on this page for manual transfer.

---

## 6. Troubleshooting & Support

*   **"Access Denied" Error**:
    *   You are trying to access a page your role is not authorized for. Contact ICT Admin if you believe this is a mistake.
*   **"Account Locked"**:
    *   Too many failed login attempts. Wait 15 minutes or ask Admin to unlock.
*   **Search not finding a student**:
    *   Ensure spelling is correct. Try searching by Admission Number instead of name.
*   **System Slow**:
    *   Check your internet connection. Refresh the page (F5 or Ctrl+R).

---

*End of User Operations Manual*
