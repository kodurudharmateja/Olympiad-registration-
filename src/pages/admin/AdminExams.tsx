import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, Calendar, MapPin, IndianRupee, Pencil, Trash2 } from "lucide-react";

export default function AdminExams() {
  const utils = trpc.useUtils();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const { data: exams } = trpc.exam.list.useQuery();

  const [formData, setFormData] = useState({
    name: "",
    examDate: "",
    feePerStudent: "",
    registrationDeadline: "",
    center: "",
    eligibility: "BOTH" as "SCHOOL_ONLY" | "PARENT_ONLY" | "BOTH",
    isLive: true,
  });

  const createMutation = trpc.exam.create.useMutation({
    onSuccess: () => {
      utils.exam.list.invalidate();
      utils.admin.dashboard.invalidate();
      setIsCreateOpen(false);
      resetForm();
    },
  });

  const updateMutation = trpc.exam.update.useMutation({
    onSuccess: () => {
      utils.exam.list.invalidate();
      setEditId(null);
      resetForm();
    },
  });

  const deleteMutation = trpc.exam.delete.useMutation({
    onSuccess: () => {
      utils.exam.list.invalidate();
    },
  });

  function resetForm() {
    setFormData({
      name: "",
      examDate: "",
      feePerStudent: "",
      registrationDeadline: "",
      center: "",
      eligibility: "BOTH",
      isLive: true,
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateMutation.mutate({ id: editId, ...formData, feePerStudent: parseFloat(formData.feePerStudent) });
    } else {
      createMutation.mutate({ ...formData, feePerStudent: parseFloat(formData.feePerStudent) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#2D2D2D]">Exams</h2>
          <p className="text-sm text-[#6B6560]">Manage Olympiad exams</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white">
              <Plus className="w-4 h-4 mr-1" />
              Create Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-[#E8E4E0]">
            <DialogHeader>
              <DialogTitle className="text-[#2D2D2D]">Create New Exam</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#2D2D2D]">Exam Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. National Mathematics Olympiad 2026"
                  className="border-[#D9D4CC]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Exam Date</Label>
                  <Input
                    type="datetime-local"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    className="border-[#D9D4CC]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Registration Deadline</Label>
                  <Input
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className="border-[#D9D4CC]"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Fee per Student (Rs.)</Label>
                  <Input
                    type="number"
                    value={formData.feePerStudent}
                    onChange={(e) => setFormData({ ...formData, feePerStudent: e.target.value })}
                    placeholder="150.00"
                    className="border-[#D9D4CC]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Eligibility</Label>
                  <Select
                    value={formData.eligibility}
                    onValueChange={(v: "SCHOOL_ONLY" | "PARENT_ONLY" | "BOTH") =>
                      setFormData({ ...formData, eligibility: v })
                    }
                  >
                    <SelectTrigger className="border-[#D9D4CC]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BOTH">Both</SelectItem>
                      <SelectItem value="SCHOOL_ONLY">School Only</SelectItem>
                      <SelectItem value="PARENT_ONLY">Parent Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#2D2D2D]">Exam Center</Label>
                <Input
                  value={formData.center}
                  onChange={(e) => setFormData({ ...formData, center: e.target.value })}
                  placeholder="e.g. Delhi Public School, RK Puram"
                  className="border-[#D9D4CC]"
                />
              </div>
              <Button type="submit" className="w-full bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Exam"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {exams?.map((exam) => (
          <Card key={exam.id} className="border-[#E8E4E0] bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-[#8B8680]" />
                    <h3 className="text-sm font-semibold text-[#2D2D2D]">{exam.name}</h3>
                    {exam.isLive ? (
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-xs">Live</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">Inactive</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#6B6560]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(exam.examDate).toLocaleDateString("en-IN")}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {parseFloat(exam.feePerStudent.toString()).toFixed(2)} / student
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exam.center || "TBA"}
                    </span>
                    <span className="capitalize">{exam.eligibility.toLowerCase().replace("_", " ")}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#D9D4CC] hover:bg-[#F0EDE8]"
                    onClick={() => {
                      setEditId(exam.id);
                      setFormData({
                        name: exam.name,
                        examDate: new Date(exam.examDate).toISOString().slice(0, 16),
                        feePerStudent: exam.feePerStudent.toString(),
                        registrationDeadline: new Date(exam.registrationDeadline).toISOString().slice(0, 16),
                        center: exam.center ?? "",
                        eligibility: exam.eligibility,
                        isLive: exam.isLive,
                      });
                      setIsCreateOpen(true);
                    }}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => {
                      if (confirm("Delete this exam?")) deleteMutation.mutate({ id: exam.id });
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!exams || exams.length === 0) && (
          <Card className="border-[#E8E4E0] bg-white">
            <CardContent className="py-8 text-center text-[#9B9590]">No exams created yet</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
