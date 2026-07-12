import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/layouts/AppLayout";

// ─── Landing ───
import LandingPage from "./pages/LandingPage";
import SyllabusPage from "./pages/SyllabusPage";

// ─── Admin ───
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSchools from "./pages/admin/AdminSchools";
import AdminParents from "./pages/admin/AdminParents";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminExams from "./pages/admin/AdminExams";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminReports from "./pages/admin/AdminReports";
import AdminSyllabus from "./pages/admin/AdminSyllabus";

// ─── School ───
import SchoolLogin from "./pages/school/SchoolLogin";
import SchoolRegister from "./pages/school/SchoolRegister";
import SchoolDashboard from "./pages/school/SchoolDashboard";
import SchoolExams from "./pages/school/SchoolExams";
import SchoolStudents from "./pages/school/SchoolStudents";
import SchoolUpload from "./pages/school/SchoolUpload";
import SchoolPayments from "./pages/school/SchoolPayments";
import SchoolProfile from "./pages/school/SchoolProfile";

// ─── Parent ───
import ParentLogin from "./pages/parent/ParentLogin";
import ParentRegister from "./pages/parent/ParentRegister";
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentExams from "./pages/parent/ParentExams";
import ParentStudents from "./pages/parent/ParentStudents";
import ParentPayments from "./pages/parent/ParentPayments";
import ParentProfile from "./pages/parent/ParentProfile";

import NotFound from "./pages/NotFound";

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B8680]" />
      </div>
    );
  }

  if (!user || role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/syllabus" element={<SyllabusPage />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/schools" element={<ProtectedRoute allowedRole="ADMIN"><AdminSchools /></ProtectedRoute>} />
      <Route path="/admin/parents" element={<ProtectedRoute allowedRole="ADMIN"><AdminParents /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute allowedRole="ADMIN"><AdminStudents /></ProtectedRoute>} />
      <Route path="/admin/exams" element={<ProtectedRoute allowedRole="ADMIN"><AdminExams /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute allowedRole="ADMIN"><AdminPayments /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRole="ADMIN"><AdminReports /></ProtectedRoute>} />
      <Route path="/admin/syllabus" element={<ProtectedRoute allowedRole="ADMIN"><AdminSyllabus /></ProtectedRoute>} />

      {/* School routes */}
      <Route path="/school/login" element={<SchoolLogin />} />
      <Route path="/school/register" element={<SchoolRegister />} />
      <Route path="/school/dashboard" element={<ProtectedRoute allowedRole="SCHOOL"><SchoolDashboard /></ProtectedRoute>} />
      <Route path="/school/exams" element={<ProtectedRoute allowedRole="SCHOOL"><SchoolExams /></ProtectedRoute>} />
      <Route path="/school/students" element={<ProtectedRoute allowedRole="SCHOOL"><SchoolStudents /></ProtectedRoute>} />
      <Route path="/school/upload" element={<ProtectedRoute allowedRole="SCHOOL"><SchoolUpload /></ProtectedRoute>} />
      <Route path="/school/payments" element={<ProtectedRoute allowedRole="SCHOOL"><SchoolPayments /></ProtectedRoute>} />
      <Route path="/school/profile" element={<ProtectedRoute allowedRole="SCHOOL"><SchoolProfile /></ProtectedRoute>} />

      {/* Parent routes */}
      <Route path="/parent/login" element={<ParentLogin />} />
      <Route path="/parent/register" element={<ParentRegister />} />
      <Route path="/parent/dashboard" element={<ProtectedRoute allowedRole="PARENT"><ParentDashboard /></ProtectedRoute>} />
      <Route path="/parent/exams" element={<ProtectedRoute allowedRole="PARENT"><ParentExams /></ProtectedRoute>} />
      <Route path="/parent/students" element={<ProtectedRoute allowedRole="PARENT"><ParentStudents /></ProtectedRoute>} />
      <Route path="/parent/payments" element={<ProtectedRoute allowedRole="PARENT"><ParentPayments /></ProtectedRoute>} />
      <Route path="/parent/profile" element={<ProtectedRoute allowedRole="PARENT"><ParentProfile /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
