import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  XCircle,
  Receipt,
} from "lucide-react";

export default function AdminPayments() {
  const [status, setStatus] = useState("");
  const [payerType, setPayerType] = useState("");

  const { data: payments } = trpc.payment.list.useQuery(
    status || payerType ? { status: status || undefined, payerType: payerType || undefined } : undefined
  );

  const { data: countData } = trpc.payment.count.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">Payments</h2>
        <p className="text-sm text-[#6B6560]">
          Total Revenue: <span className="font-semibold">Rs. {countData ? parseFloat(countData.totalRevenue).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40 border-[#D9D4CC] bg-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="CREATED">Created</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={payerType} onValueChange={setPayerType}>
          <SelectTrigger className="w-40 border-[#D9D4CC] bg-white">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="SCHOOL">School</SelectItem>
            <SelectItem value="PARENT">Parent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-[#E8E4E0] bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E4E0]">
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Receipt #</th>
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Payer</th>
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Type</th>
                  <th className="text-right py-3 px-4 text-[#6B6560] font-medium">Amount</th>
                  <th className="text-center py-3 px-4 text-[#6B6560] font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((payment) => (
                  <tr key={payment.id} className="border-b border-[#F0EDE8] hover:bg-[#FAFAF8]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Receipt className="w-3 h-3 text-[#8B8680]" />
                        <span className="text-[#2D2D2D] text-xs">
                          {payment.receiptNumber || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#2D2D2D]">
                      {payment.payerType === "SCHOOL" ? (payment as Record<string, unknown>).schoolName as string || "N/A" : (payment as Record<string, unknown>).parentName as string || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        payment.payerType === "SCHOOL"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-purple-50 text-purple-600"
                      }`}>
                        {payment.payerType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-[#2D2D2D]">
                      Rs. {parseFloat(payment.amount.toString()).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {payment.status === "PAID" ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="w-3 h-3" /> Paid
                        </span>
                      ) : payment.status === "CREATED" ? (
                        <span className="inline-flex items-center gap-1 text-yellow-600 text-xs">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500 text-xs">
                          <XCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#6B6560] text-xs">
                      {new Date(payment.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
                {(!payments || payments.length === 0) && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#9B9590]">
                      No payments found
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