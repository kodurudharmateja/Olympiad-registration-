import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, IndianRupee, CheckCircle, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SchoolPayments() {
  const { data: payments } = trpc.payment.listBySchool.useQuery();

  const handleDownloadReceipt = (_paymentId: number) => {
    // Phase 2: Generate PDF receipt
    alert("PDF receipt download - Phase 2 feature");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">Payments</h2>
        <p className="text-sm text-[#6B6560]">Your payment history and receipts</p>
      </div>

      <Card className="border-[#E8E4E0] bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E4E0]">
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Receipt #</th>
                  <th className="text-right py-3 px-4 text-[#6B6560] font-medium">Amount</th>
                  <th className="text-center py-3 px-4 text-[#6B6560] font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Date</th>
                  <th className="text-right py-3 px-4 text-[#6B6560] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((payment) => (
                  <tr key={payment.id} className="border-b border-[#F0EDE8] hover:bg-[#FAFAF8]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Receipt className="w-3 h-3 text-[#8B8680]" />
                        <span className="text-[#2D2D2D] text-xs">{payment.receiptNumber || "-"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-[#2D2D2D]">
                      <span className="flex items-center justify-end gap-1">
                        <IndianRupee className="w-3 h-3" />
                        {parseFloat(payment.amount.toString()).toFixed(2)}
                      </span>
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
                        <span className="text-red-500 text-xs">Failed</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#6B6560] text-xs">
                      {new Date(payment.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {payment.status === "PAID" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-[#D9D4CC] hover:bg-[#F0EDE8]"
                          onClick={() => handleDownloadReceipt(payment.id)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Receipt
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {(!payments || payments.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#9B9590]">
                      No payments yet
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