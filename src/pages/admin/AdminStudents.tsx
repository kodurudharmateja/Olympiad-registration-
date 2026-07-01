import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, GraduationCap, UserCircle, School } from "lucide-react";

export default function AdminStudents() {
  const [search, setSearch] = useState("");
  const [className, setClassName] = useState("");

  const { data: students } = trpc.student.list.useQuery(
    search || className ? { search: search || undefined, className: className || undefined } : undefined
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">Students</h2>
        <p className="text-sm text-[#6B6560]">Full student database</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9590]" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-[#D9D4CC] bg-white"
          />
        </div>
        <Select value={className} onValueChange={setClassName}>
          <SelectTrigger className="w-40 border-[#D9D4CC] bg-white">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Classes</SelectItem>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((c) => (
              <SelectItem key={c} value={c}>Class {c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-[#E8E4E0] bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E4E0]">
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Name</th>
                  <th className="text-center py-3 px-4 text-[#6B6560] font-medium">Class</th>
                  <th className="text-center py-3 px-4 text-[#6B6560] font-medium">Gender</th>
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">School/Parent</th>
                  <th className="text-center py-3 px-4 text-[#6B6560] font-medium">Roll No</th>
                </tr>
              </thead>
              <tbody>
                {students?.map((student) => (
                  <tr key={student.id} className="border-b border-[#F0EDE8] hover:bg-[#FAFAF8]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#8B8680]" />
                        <span className="text-[#2D2D2D]">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-[#6B6560]">
                      {student.className} {student.section && `- ${student.section}`}
                    </td>
                    <td className="py-3 px-4 text-center text-[#6B6560] capitalize">
                      {student.gender}
                    </td>
                    <td className="py-3 px-4">
                      {student.schoolId ? (
                        <span className="text-xs text-[#6B6560] flex items-center gap-1">
                          <School className="w-3 h-3" /> School ID: {student.schoolId}
                        </span>
                      ) : student.parentId ? (
                        <span className="text-xs text-[#6B6560] flex items-center gap-1">
                          <UserCircle className="w-3 h-3" /> Parent ID: {student.parentId}
                        </span>
                      ) : (
                        <span className="text-xs text-[#9B9590]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-[#6B6560]">
                      {student.rollNumber || "-"}
                    </td>
                  </tr>
                ))}
                {(!students || students.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#9B9590]">
                      No students found
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
