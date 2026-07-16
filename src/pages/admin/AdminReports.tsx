import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  Users,
  IndianRupee,
  CheckCircle,
  Clock,
  School,
  UserCircle,
} from "lucide-react";

export default function AdminReports() {
  const [selectedExam, setSelectedExam] = useState("");
  const { data: exams } = trpc.exam.list.useQuery();
  const { data: dashboard } = trpc.report.dashboard.useQuery();

  const { data: examReport } = trpc.report.registrationsByExam.useQuery(
    { examId: parseInt(selectedExam) },
    { enabled: !!selectedExam }
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">Reports</h2>
        <p className="text-sm text-[#6B6560]">Comprehensive analytics and reports</p>
      </div>

      {/* Summary Cards */}
      {dashboard && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-[#E8E4E0] bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <School className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2D2D2D]">{dashboard.schools}</p>
                  <p className="text-xs text-[#6B6560]">Schools</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#E8E4E0] bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2D2D2D]">{dashboard.parents}</p>
                  <p className="text-xs text-[#6B6560]">Parents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#E8E4E0] bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2D2D2D]">{dashboard.students}</p>
                  <p className="text-xs text-[#6B6560]">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#E8E4E0] bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2D2D2D]">
                    {parseFloat(dashboard.totalRevenue).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-[#6B6560]">Revenue (Rs.)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Exam Report Selector */}
      <Card className="border-[#E8E4E0] bg-white">
        <CardHeader>
          <CardTitle className="text-base text-[#2D2D2D] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#8B8680]" />
            Exam-wise Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-full sm:w-80 border-[#D9D4CC]">
              <SelectValue placeholder="Select an exam to view report" />
            </SelectTrigger>
            <SelectContent>
              {exams?.map((exam) => (
                <SelectItem key={exam.id} value={exam.id.toString()}>
                  {exam.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {examReport && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#FAFAF8] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#2D2D2D]">{examReport.totalRegistrations}</p>
                  <p className="text-xs text-[#6B6560]">Total Registrations</p>
                </div>
                <div className="bg-[#FAFAF8] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{examReport.paidRegistrations}</p>
                  <p className="text-xs text-[#6B6560]">Paid</p>
                </div>
                <div className="bg-[#FAFAF8] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#2D2D2D]">{examReport.schoolCount}</p>
                  <p className="text-xs text-[#6B6560]">Schools</p>
                </div>
                <div className="bg-[#FAFAF8] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#2D2D2D]">
                    Rs. {parseFloat(examReport.revenue).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-[#6B6560]">Revenue</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E8E4E0]">
                      <th className="text-left py-2 px-3 text-[#6B6560] font-medium">Student</th>
                      <th className="text-left py-2 px-3 text-[#6B6560] font-medium">Class</th>
                      <th className="text-left py-2 px-3 text-[#6B6560] font-medium">Payer</th>
                      <th className="text-center py-2 px-3 text-[#6B6560] font-medium">Status</th>
                      <th className="text-right py-2 px-3 text-[#6B6560] font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examReport.details.map((detail, i) => (
                      <tr key={i} className="border-b border-[#F0EDE8] hover:bg-[#FAFAF8]">
                        <td className="py-2 px-3 text-[#2D2D2D]">{detail.studentName}</td>
                        <td className="py-2 px-3 text-[#6B6560]">{detail.studentClass}</td>
                        <td className="py-2 px-3 text-[#6B6560] text-xs">
                          {detail.schoolName || detail.parentName || "N/A"}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {detail.status === "PAID" ? (
                            <CheckCircle className="w-3 h-3 text-green-600 inline" />
                          ) : (
                            <Clock className="w-3 h-3 text-yellow-600 inline" />
                          )}
                        </td>
                        <td className="py-2 px-3 text-right text-[#2D2D2D]">
                          {detail.amount ? `Rs. ${parseFloat(detail.amount.toString()).toFixed(2)}` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}