import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Phone, Mail } from "lucide-react";

export default function AdminParents() {
  const { data: parents } = trpc.parent.list.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">Parents</h2>
        <p className="text-sm text-[#6B6560]">Individual parent registrants</p>
      </div>

      <Card className="border-[#E8E4E0] bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E4E0]">
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Contact</th>
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Registered On</th>
                </tr>
              </thead>
              <tbody>
                {parents?.map((parent) => (
                  <tr key={parent.id} className="border-b border-[#F0EDE8] hover:bg-[#FAFAF8]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <UserCircle className="w-4 h-4 text-[#8B8680]" />
                        <span className="text-[#2D2D2D]">{parent.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <p className="text-xs text-[#6B6560] flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {parent.mobile}
                        </p>
                        {parent.email && (
                          <p className="text-xs text-[#6B6560] flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {parent.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#6B6560]">
                      {new Date(parent.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
                {(!parents || parents.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-[#9B9590]">
                      No parents registered yet
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
