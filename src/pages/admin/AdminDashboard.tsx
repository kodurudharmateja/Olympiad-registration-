import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  School,
  Users,
  UserCircle,
  BookOpen,
  CreditCard,
  Receipt,
  TrendingUp,
  CheckCircle,
  IndianRupee,
  BarChart3,
} from "lucide-react";

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-[#E8E4E0] bg-white">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-[#6B6560] mb-1">{title}</p>
            <p className="text-2xl font-bold text-[#2D2D2D]">{value}</p>
            {subtitle && <p className="text-xs text-[#9B9590] mt-1">{subtitle}</p>}
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#F0EDE8] flex items-center justify-center text-[#8B8680]">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = trpc.admin.dashboard.useQuery();
  const { data: examBreakdown } = trpc.admin.examBreakdown.useQuery();

  if (isLoading || !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B8680]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">Dashboard Overview</h2>
        <p className="text-sm text-[#6B6560]">Real-time statistics for Olympiad 2026</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Schools"
          value={dashboard.schools}
          subtitle="Registered institutions"
          icon={<School className="w-4 h-4" />}
        />
        <StatCard
          title="Total Parents"
          value={dashboard.parents}
          subtitle="Individual registrants"
          icon={<UserCircle className="w-4 h-4" />}
        />
        <StatCard
          title="Total Students"
          value={dashboard.students}
          subtitle="Enrolled candidates"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          title="Live Exams"
          value={dashboard.liveExams}
          subtitle={`of ${dashboard.exams} total exams`}
          icon={<BookOpen className="w-4 h-4" />}
        />
      </div>

      {/* Revenue & Registrations */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`Rs. ${parseFloat(dashboard.totalRevenue).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          subtitle="From successful payments"
          icon={<IndianRupee className="w-4 h-4" />}
        />
        <StatCard
          title="Registrations"
          value={dashboard.registrations}
          subtitle={`${dashboard.paidRegistrations} paid, ${dashboard.pendingRegistrations} pending`}
          icon={<Receipt className="w-4 h-4" />}
        />
        <StatCard
          title="Payments"
          value={dashboard.payments}
          subtitle="Total transactions"
          icon={<CreditCard className="w-4 h-4" />}
        />
        <StatCard
          title="Success Rate"
          value={
            dashboard.registrations > 0
              ? `${Math.round((dashboard.paidRegistrations / dashboard.registrations) * 100)}%`
              : "0%"
          }
          subtitle="Paid registrations"
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* Exam Breakdown */}
      <Card className="border-[#E8E4E0] bg-white">
        <CardHeader>
          <CardTitle className="text-base text-[#2D2D2D] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#8B8680]" />
            Exam-wise Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E4E0]">
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Exam Name</th>
                  <th className="text-center py-3 px-4 text-[#6B6560] font-medium">Date</th>
                  <th className="text-center py-3 px-4 text-[#6B6560] font-medium">Registrations</th>
                  <th className="text-center py-3 px-4 text-[#6B6560] font-medium">Paid</th>
                  <th className="text-right py-3 px-4 text-[#6B6560] font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {examBreakdown?.map((exam) => (
                  <tr key={exam.examId} className="border-b border-[#F0EDE8] hover:bg-[#FAFAF8]">
                    <td className="py-3 px-4 text-[#2D2D2D]">{exam.examName}</td>
                    <td className="py-3 px-4 text-center text-[#6B6560]">
                      {new Date(exam.examDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-center text-[#2D2D2D]">{exam.totalRegistrations}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        {exam.paidRegistrations}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-[#2D2D2D] font-medium">
                      Rs. {parseFloat(exam.revenue).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                {(!examBreakdown || examBreakdown.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#9B9590]">
                      No exams found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}