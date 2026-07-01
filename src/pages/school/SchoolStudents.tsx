import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Plus, Search } from "lucide-react";

export default function SchoolStudents() {
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    className: "",
    section: "",
    rollNumber: "",
    gender: "Male",
    mobile: "",
    parentName: "",
  });

  const { data: students } = trpc.student.listBySchool.useQuery();

  const createMutation = trpc.student.createBySchool.useMutation({
    onSuccess: () => {
      utils.student.listBySchool.invalidate();
      setIsAddOpen(false);
      setNewStudent({ name: "", className: "", section: "", rollNumber: "", gender: "Male", mobile: "", parentName: "" });
    },
  });

  const filteredStudents = students?.filter((s) =>
    search ? s.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#2D2D2D]">My Students</h2>
          <p className="text-sm text-[#6B6560]">Manage students registered under your school</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white">
              <Plus className="w-4 h-4 mr-1" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-[#E8E4E0]">
            <DialogHeader>
              <DialogTitle className="text-[#2D2D2D]">Add New Student</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(newStudent);
              }}
              className="space-y-3"
            >
              <div className="space-y-2">
                <Label className="text-[#2D2D2D]">Full Name *</Label>
                <Input value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} required className="border-[#D9D4CC]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Class *</Label>
                  <Input value={newStudent.className} onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })} required className="border-[#D9D4CC]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Section</Label>
                  <Input value={newStudent.section} onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })} className="border-[#D9D4CC]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Roll Number</Label>
                  <Input value={newStudent.rollNumber} onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })} className="border-[#D9D4CC]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Gender *</Label>
                  <Select value={newStudent.gender} onValueChange={(v) => setNewStudent({ ...newStudent, gender: v })}>
                    <SelectTrigger className="border-[#D9D4CC]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#2D2D2D]">Parent Name</Label>
                <Input value={newStudent.parentName} onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })} className="border-[#D9D4CC]" />
              </div>
              <Button type="submit" className="w-full bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Adding..." : "Add Student"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9590]" />
        <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-[#D9D4CC] bg-white" />
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
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Roll No</th>
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Parent</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents?.map((student) => (
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
                    <td className="py-3 px-4 text-center text-[#6B6560] capitalize">{student.gender}</td>
                    <td className="py-3 px-4 text-[#6B6560]">{student.rollNumber || "-"}</td>
                    <td className="py-3 px-4 text-[#6B6560] text-xs">{student.parentName || "-"}</td>
                  </tr>
                ))}
                {(!filteredStudents || filteredStudents.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#9B9590]">
                      {search ? "No students match your search" : "No students added yet"}
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
