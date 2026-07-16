import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import {
  BookOpen,
  Users,
  Upload,
  Receipt,
  ArrowRight,
  GraduationCap,
  IndianRupee,
} from "lucide-react";

export default function SchoolDashboard() {
  const { data: students } = trpc.student.listBySchool.useQuery();
  const { data: payments } = trpc.payment.listBySchool.useQuery();
  const { data: exams } = trpc.exam.list.useQuery({ isLive: true });

  const totalStudents = students?.length ?? 0;
  const totalPayments = payments?.length ?? 0;
  const totalSpent = payments
    ?.filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0) ?? 0;

  const quickLinks = [
    {
      title: "Browse Exams",
      desc: `${exams?.length ?? 0} live exams available`,
      icon: <BookOpen className="w-5 h-5" />,
      path: "/school/exams",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "My Students",
      desc: `${totalStudents} students registered`,
      icon: <Users className="w-5 h-5" />,
      path: "/school/students",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Bulk Upload",
      desc: "Upload students via CSV",
      icon: <Upload className="w-5 h-5" />,
      path: "/school/upload",
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Payments",
      desc: `${totalPayments} transactions`,
      icon: <Receipt className="w-5 h-5" />,
      path: "/school/payments",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">School Dashboard</h2>
        <p className="text-sm text-[#6B6560]">Manage your Olympiad registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#E8E4E0] bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2D2D2D]">{totalStudents}</p>
                <p className="text-xs text-[#6B6560]">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E8E4E0] bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2D2D2D]">{exams?.length ?? 0}</p>
                <p className="text-xs text-[#6B6560]">Live Exams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E8E4E0] bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2D2D2D]">{totalPayments}</p>
                <p className="text-xs text-[#6B6560]">Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E8E4E0] bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2D2D2D]">Rs. {totalSpent.toFixed(0)}</p>
                <p className="text-xs text-[#6B6560]">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.path} to={link.path}>
            <Card className="border-[#E8E4E0] bg-white hover:border-[#C4BFB6] transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.color}`}>
                      {link.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#2D2D2D]">{link.title}</h3>
                      <p className="text-xs text-[#6B6560]">{link.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#9B9590]" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Students */}
      <Card className="border-[#E8E4E0] bg-white">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#2D2D2D]">Recent Students</h3>
            <Link to="/school/students" className="text-xs text-[#8B8680] hover:text-[#2D2D2D]">View all</Link>
          </div>
          {students && students.length > 0 ? (
            <div className="space-y-2">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between py-2 border-b border-[#F0EDE8] last:border-0">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#8B8680]" />
                    <span className="text-sm text-[#2D2D2D]">{student.name}</span>
                    <span className="text-xs text-[#9B9590]">Class {student.className}</span>
                  </div>
                  <span className="text-xs text-[#6B6560] capitalize">{student.gender}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#9B9590] text-center py-4">No students added yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}