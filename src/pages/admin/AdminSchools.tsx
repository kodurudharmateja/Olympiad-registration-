import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, School, MapPin, Phone, Mail, CheckCircle, XCircle } from "lucide-react";

export default function AdminSchools() {
  const [search, setSearch] = useState("");
  const utils = trpc.useUtils();
  const navigate = useNavigate();

  const { data: schools } = trpc.school.list.useQuery(
    search ? { search } : undefined
  );

  const toggleMutation = trpc.school.toggleActive.useMutation({
    onSuccess: () => {
      utils.school.list.invalidate();
      utils.admin.dashboard.invalidate();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#2D2D2D]">Schools</h2>
          <p className="text-sm text-[#6B6560]">Manage registered schools</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9590]" />
          <Input
            placeholder="Search schools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-[#D9D4CC] bg-white"
          />
        </div>
      </div>

      <Card className="border-[#E8E4E0] bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E4E0]">
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">School</th>
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Contact</th>
                  <th className="text-left py-3 px-4 text-[#6B6560] font-medium">Location</th>
                  <th className="text-center py-3 px-4 text-[#6B6560] font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-[#6B6560] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schools?.map((school) => (
                  <tr key={school.id} className="border-b border-[#F0EDE8] hover:bg-[#FAFAF8]">
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/students?schoolId=${school.id}`)}
                        className="flex items-center gap-2 text-left group"
                        title="View students from this school"
                      >
                        <School className="w-4 h-4 text-[#8B8680]" />
                        <div>
                          <p className="text-[#2D2D2D] font-medium group-hover:underline group-hover:text-[#2D2D2D]/80">
                            {school.name}
                          </p>
                          <p className="text-xs text-[#9B9590]">Principal: {school.principalName}</p>
                        </div>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <p className="text-xs text-[#6B6560] flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {school.mobile}
                        </p>
                        {school.email && (
                          <p className="text-xs text-[#6B6560] flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {school.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-[#6B6560] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {school.city}, {school.district}
                      </p>
                      <p className="text-xs text-[#9B9590]">{school.state} - {school.pinCode}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {school.isActive ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500 text-xs">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-[#D9D4CC] hover:bg-[#F0EDE8]"
                        onClick={() => toggleMutation.mutate({ id: school.id })}
                        disabled={toggleMutation.isPending}
                      >
                        {school.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!schools || schools.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#9B9590]">
                      {search ? "No schools match your search" : "No schools registered yet"}
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