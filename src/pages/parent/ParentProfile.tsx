import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Phone, Mail, Calendar } from "lucide-react";

export default function ParentProfile() {
  const { data: parent, isLoading } = trpc.parent.profile.useQuery();

  if (isLoading || !parent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B8680]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">My Profile</h2>
        <p className="text-sm text-[#6B6560]">Your account details</p>
      </div>

      <Card className="border-[#E8E4E0] bg-white">
        <CardHeader>
          <CardTitle className="text-base text-[#2D2D2D] flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-[#8B8680]" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#9B9590] mb-1">Full Name</p>
              <p className="text-sm text-[#2D2D2D] font-medium">{parent.name}</p>
            </div>
            <div>
              <p className="text-xs text-[#9B9590] mb-1">Mobile Number</p>
              <p className="text-sm text-[#2D2D2D] flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#8B8680]" /> {parent.mobile}
              </p>
            </div>
          </div>
          {parent.email && (
            <div>
              <p className="text-xs text-[#9B9590] mb-1">Email</p>
              <p className="text-sm text-[#2D2D2D] flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#8B8680]" /> {parent.email}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-[#9B9590] mb-1">Member Since</p>
            <p className="text-sm text-[#6B6560] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#8B8680]" />
              {new Date(parent.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
