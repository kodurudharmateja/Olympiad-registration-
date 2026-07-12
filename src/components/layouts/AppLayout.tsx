import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  School,
  Users,
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  GraduationCap,
  Upload,
  Receipt,
  UserCircle,
  BarChart3,
  Award,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const adminNav: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Schools", path: "/admin/schools", icon: <School className="w-4 h-4" /> },
  { label: "Parents", path: "/admin/parents", icon: <UserCircle className="w-4 h-4" /> },
  { label: "Students", path: "/admin/students", icon: <Users className="w-4 h-4" /> },
  { label: "Exams", path: "/admin/exams", icon: <BookOpen className="w-4 h-4" /> },
  { label: "Syllabus", path: "/admin/syllabus", icon: <FileText className="w-4 h-4" /> }, 
  { label: "Payments", path: "/admin/payments", icon: <CreditCard className="w-4 h-4" /> },
  { label: "Reports", path: "/admin/reports", icon: <BarChart3 className="w-4 h-4" /> },
];

const schoolNav: NavItem[] = [
  { label: "Dashboard", path: "/school/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Exams", path: "/school/exams", icon: <BookOpen className="w-4 h-4" /> },
  { label: "Students", path: "/school/students", icon: <Users className="w-4 h-4" /> },
  { label: "Bulk Upload", path: "/school/upload", icon: <Upload className="w-4 h-4" /> },
  { label: "Payments", path: "/school/payments", icon: <Receipt className="w-4 h-4" /> },
  { label: "Profile", path: "/school/profile", icon: <Settings className="w-4 h-4" /> },
];

const parentNav: NavItem[] = [
  { label: "Dashboard", path: "/parent/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Exams", path: "/parent/exams", icon: <BookOpen className="w-4 h-4" /> },
  { label: "My Children", path: "/parent/students", icon: <Users className="w-4 h-4" /> },
  { label: "Payments", path: "/parent/payments", icon: <Receipt className="w-4 h-4" /> },
  { label: "Profile", path: "/parent/profile", icon: <Settings className="w-4 h-4" /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, role, logout, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B8680]" />
      </div>
    );
  }

  if (!user || !role) {
    navigate("/");
    return null;
  }

  const navItems = role === "ADMIN" ? adminNav : role === "SCHOOL" ? schoolNav : parentNav;
  const portalTitle = role === "ADMIN" ? "Admin Portal" : role === "SCHOOL" ? "School Portal" : "Parent Portal";

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E8E4E0] transform transition-transform duration-200 ease-in-out lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center px-6 border-b border-[#E8E4E0]">
          <img src="/logo.png" alt="Junior Physics Olympiad" className="w-6 h-6 mr-3 object-contain" />
          <div>
            <h1 className="text-sm font-semibold text-[#2D2D2D]">Junior Physics Olympiad</h1>
            <p className="text-xs text-[#9B9590]">{portalTitle}</p>
          </div>
          <button
            className="ml-auto lg:hidden text-[#8B8680]"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#F0EDE8] text-[#2D2D2D] font-medium"
                    : "text-[#6B6560] hover:bg-[#F7F5F2] hover:text-[#2D2D2D]"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-[#E8E4E0]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#E8E4E0] flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-[#8B8680]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#2D2D2D] truncate">{user.name}</p>
              <p className="text-xs text-[#9B9590] capitalize">{role.toLowerCase()}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[#6B6560] border-[#D9D4CC] hover:bg-[#F0EDE8]"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#E8E4E0] flex items-center px-4 lg:px-8">
          <button
            className="lg:hidden mr-4 text-[#8B8680]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#A69F97]" />
            <span className="text-sm text-[#6B6560] hidden sm:inline">Olympiad 2026</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
