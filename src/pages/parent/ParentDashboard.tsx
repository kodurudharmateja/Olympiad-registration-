import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import {
  BookOpen,
  Users,
  Receipt,
  ArrowRight,
  GraduationCap,
  IndianRupee,
  Plus,
} from "lucide-react";

export default function ParentDashboard() {
  const { data: students } = trpc.student.listByParent.useQuery();
  const { data: payments } = trpc.payment.listByParent.useQuery();
  const { data: exams } = trpc.exam.list.useQuery({ isLive: true });

  const totalChildren = students?.length ?? 0;
  const totalPayments = payments?.length ?? 0;
  const totalSpent = payments
    ?.filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">Parent Dashboard</h2>
        <p className="text-sm text-[#6B6560]">Manage your children's Olympiad registrations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#E8E4E0] bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2D2D2D]">{totalChildren}</p>
                <p className="text-xs text-[#6B6560]">Children</p>
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Browse Exams", desc: "Register for live Olympiad exams", icon: <BookOpen className="w-5 h-5" />, path: "/parent/exams", color: "bg-green-50 text-green-600" },
          { title: "My Children", desc: "Manage your children's profiles", icon: <Users className="w-5 h-5" />, path: "/parent/students", color: "bg-blue-50 text-blue-600" },
          { title: "Payments", desc: "View receipts and payment history", icon: <Receipt className="w-5 h-5" />, path: "/parent/payments", color: "bg-amber-50 text-amber-600" },
        ].map((link) => (
          <Link key={link.path} to={link.path}>
            <Card className="border-[#E8E4E0] bg-white hover:border-[#C4BFB6] transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.color}`}>{link.icon}</div>
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

      <Card className="border-[#E8E4E0] bg-white">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#2D2D2D]">My Children</h3>
            <Link to="/parent/students" className="text-xs text-[#8B8680] hover:text-[#2D2D2D]">View all</Link>
          </div>
          {students && students.length > 0 ? (
            <div className="space-y-2">
              {students.map((student) => (
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
            <div className="text-center py-6">
              <p className="text-sm text-[#9B9590] mb-3">No children added yet</p>
              <Link to="/parent/students">
                <span className="inline-flex items-center gap-1 text-xs text-[#8B8680] hover:text-[#2D2D2D]">
                  <Plus className="w-3 h-3" /> Add your first child
                </span>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
