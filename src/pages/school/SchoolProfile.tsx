import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, MapPin, Phone, Mail, User } from "lucide-react";

export default function SchoolProfile() {
  const { data: school, isLoading } = trpc.school.profile.useQuery();

  if (isLoading || !school) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B8680]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">School Profile</h2>
        <p className="text-sm text-[#6B6560]">Your institution details</p>
      </div>

      <div className="grid gap-4">
        <Card className="border-[#E8E4E0] bg-white">
          <CardHeader>
            <CardTitle className="text-base text-[#2D2D2D] flex items-center gap-2">
              <School className="w-4 h-4 text-[#8B8680]" />
              Institution Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#9B9590] mb-1">School Name</p>
                <p className="text-sm text-[#2D2D2D] font-medium">{school.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#9B9590] mb-1">Status</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${school.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                  {school.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E8E4E0] bg-white">
          <CardHeader>
            <CardTitle className="text-base text-[#2D2D2D] flex items-center gap-2">
              <User className="w-4 h-4 text-[#8B8680]" />
              Contact Persons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#9B9590] mb-1">Principal</p>
                <p className="text-sm text-[#2D2D2D]">{school.principalName}</p>
              </div>
              <div>
                <p className="text-xs text-[#9B9590] mb-1">Contact Person</p>
                <p className="text-sm text-[#2D2D2D]">{school.contactPerson}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1 text-[#6B6560]">
                <Phone className="w-3 h-3" /> {school.mobile}
              </span>
              {school.email && (
                <span className="flex items-center gap-1 text-[#6B6560]">
                  <Mail className="w-3 h-3" /> {school.email}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E8E4E0] bg-white">
          <CardHeader>
            <CardTitle className="text-base text-[#2D2D2D] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8B8680]" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-[#6B6560]">
              <p>{school.address}</p>
              <p>{school.city}, {school.district}</p>
              <p>{school.state} - {school.pinCode}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}