# Smart Student Management System

A full-stack student management portal built with React (Vite) + Tailwind CSS on the frontend and Firebase (Auth, Firestore, Storage) on the backend, following the accompanying Developer Handbook.

## Features
- Email/password authentication with role-based access control (Admin / Teacher / Student)
- Role-aware dashboard with live stats
- Student directory (CRUD)
- Daily attendance tracker with automatic percentage calculation (late = half presence)
- Assignment portal with PDF upload (5MB limit, PDF-only) to Firebase Storage
- Gradebook with automatic letter-grade calculation (A/B/C/D/F)
- Protected routes that redirect unauthenticated or unauthorized users

## 1. Install dependencies

```bash
npm install
```

## 2. Set up Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project.
2. Enable **Authentication → Email/Password**.
3. Create a **Firestore Database** (start in test mode for development).
4. Enable **Storage** (start in test mode for development).
5. Register a Web App under Project Settings and copy the config values.
6. Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> Environment variables **must** start with `VITE_` or Vite will not expose them to the client.

## 3. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:5173`, click **Register**, and create your first account (choose the `admin` role to unlock every module).

## 4. Firestore security rules (recommended before going live)

The console's "test mode" rules allow anyone to read/write for 30 days — replace them before deployment, e.g.:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /{collection}/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'teacher'];
    }
  }
}
```

## 5. Build & deploy

```bash
npm run build
```

**Firebase Hosting**
```bash
firebase login
firebase init hosting   # public directory: dist, single-page app: yes
firebase deploy --only hosting
```

**Vercel**
Push to GitHub, import the repo at vercel.com, set the framework preset to Vite, and paste the `VITE_FIREBASE_...` variables into the project's Environment Variables settings.

## Project structure

```
src/
├── components/   # Sidebar, Navbar, StatCard, EmptyState
├── context/      # AuthContext (session + role state)
├── firebase/     # Firebase SDK initialization
├── layouts/      # DashboardLayout, AuthLayout
├── pages/        # Login, Register, Dashboard, Students, Attendance, Assignments, Marks
├── routes/       # ProtectedRoute (RBAC gatekeeper)
├── services/     # firestoreService, storageService
└── utils/        # gradeCalculator, dateFormatter
```

## Notes on data model

| Collection    | Key fields |
|---------------|------------|
| `users`       | email, role (`admin`\|`teacher`\|`student`), fullName, createdAt |
| `students`    | fullName, rollNumber, department, createdAt |
| `attendance`  | studentId, date (`YYYY-MM-DD`), status (`present`\|`absent`\|`late`) |
| `assignments` | title, description, dueDate, fileUrl, createdBy |
| `marks`       | studentId, subject, term, score, grade |
=======
# Smart-Student-management-system
>>>>>>> 3ea61ef087affa04b94a4f1f71084866267c4bfe
