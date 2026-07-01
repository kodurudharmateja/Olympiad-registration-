import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Calendar,
  MapPin,
  IndianRupee,
  Users,
  CheckCircle,
} from "lucide-react";

export default function SchoolExams() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
    const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [, setSelectedExam] = useState<number | null>(null);
  const { data: exams } = trpc.exam.list.useQuery({ isLive: true });
  const { data: students } = trpc.student.listBySchool.useQuery();
  const { data: existingRegistrations } = trpc.registration.listBySchool.useQuery();

  const createOrderMutation = trpc.payment.createOrder.useMutation({
    onSuccess: () => {
      setPaymentSuccess(true);
      utils.registration.listBySchool.invalidate();
      utils.payment.listBySchool.invalidate();
      utils.student.listBySchool.invalidate();
      setSelectedExam(null);
    },
  });


  const handlePay = (examId: number) => {
    if (!students || students.length === 0 || !user) return;
    createOrderMutation.mutate({
      examId,
      payerType: "SCHOOL",
      studentIds: students.map((s) => s.id),
      schoolId: user.id,
    });
  };


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">Available Exams</h2>
        <p className="text-sm text-[#6B6560]">Select an exam to register your students</p>
      </div>

      {paymentSuccess && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Registration successful! Check your payments page for the receipt.
        </div>
      )}

      <div className="grid gap-4">
        {exams?.map((exam) => {
          const fee = parseFloat(exam.feePerStudent.toString());
          const studentCount = students?.length ?? 0;
          const totalFee = fee * studentCount;
          const isRegistered = existingRegistrations?.some((r) => r.examId === exam.id);

          return (
            <Card key={exam.id} className="border-[#E8E4E0] bg-white">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-[#8B8680]" />
                      <h3 className="text-sm font-semibold text-[#2D2D2D]">{exam.name}</h3>
                      {isRegistered && (
                        <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-xs">
                          Registered
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-[#6B6560]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(exam.examDate).toLocaleDateString("en-IN")}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exam.center || "TBA"}
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        {fee.toFixed(2)} per student
                      </span>
                      <span className="capitalize">{exam.eligibility.toLowerCase().replace("_", " ")}</span>
                    </div>
                    {studentCount > 0 && (
                      <div className="mt-2 text-xs text-[#8B8680]">
                        <Users className="w-3 h-3 inline mr-1" />
                        {studentCount} students x Rs. {fee.toFixed(2)} ={" "}
                        <span className="font-semibold text-[#2D2D2D]">Rs. {totalFee.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!isRegistered ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white"
                            disabled={studentCount === 0}
                          >
                            <IndianRupee className="w-4 h-4 mr-1" />
                            Pay Rs. {totalFee.toFixed(2)}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-[#E8E4E0]">
                          <DialogHeader>
                            <DialogTitle className="text-[#2D2D2D]">Confirm Payment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-[#FAFAF8] rounded-lg p-4 space-y-2">
                              <p className="text-sm text-[#2D2D2D] font-medium">{exam.name}</p>
                              <p className="text-xs text-[#6B6560]">
                                {studentCount} students x Rs. {fee.toFixed(2)} ={" "}
                                <span className="font-bold text-[#2D2D2D]">Rs. {totalFee.toFixed(2)}</span>
                              </p>
                              <p className="text-xs text-[#9B9590]">
                                Deadline: {new Date(exam.registrationDeadline).toLocaleDateString("en-IN")}
                              </p>
                            </div>
                            <Button
                              className="w-full bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white"
                              onClick={() => handlePay(exam.id)}
                              disabled={createOrderMutation.isPending}
                            >
                              {createOrderMutation.isPending ? "Processing..." : `Pay Rs. ${totalFee.toFixed(2)}`}
                            </Button>
                            <p className="text-xs text-[#9B9590] text-center">
                              (Simulated payment - no real transaction)
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button variant="outline" className="border-green-200 text-green-600" disabled>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Paid
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {(!exams || exams.length === 0) && (
          <Card className="border-[#E8E4E0] bg-white">
            <CardContent className="py-8 text-center text-[#9B9590]">No live exams available</CardContent>
          </Card>
        )}
      </div>

      {(!students || students.length === 0) && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm text-amber-800 font-medium">No students added yet</p>
              <p className="text-xs text-amber-600">
                <a href="/school/upload" className="underline">Upload students</a> or{" "}
                <a href="/school/students" className="underline">add them manually</a> before registering for exams.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
