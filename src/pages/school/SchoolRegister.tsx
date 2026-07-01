import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, School, Eye, EyeOff } from "lucide-react";

export default function SchoolRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    principalName: "",
    contactPerson: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const registerMutation = trpc.school.register.useMutation({
    onSuccess: () => {
      navigate("/school/login");
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const { confirmPassword, ...data } = form;
    registerMutation.mutate(data);
  };

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#6B6560] hover:text-[#2D2D2D] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="w-8 h-8 text-[#8B8680]" />
          </div>
          <h1 className="text-xl font-semibold text-[#2D2D2D]">Register Your School</h1>
          <p className="text-sm text-[#6B6560]">Create a school account for bulk registration</p>
        </div>

        <Card className="border-[#E8E4E0] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-[#2D2D2D] flex items-center gap-2">
              <School className="w-4 h-4 text-[#8B8680]" />
              School Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#2D2D2D]">School Name *</Label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} required className="border-[#D9D4CC]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Principal Name *</Label>
                  <Input value={form.principalName} onChange={(e) => update("principalName", e.target.value)} required className="border-[#D9D4CC]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Contact Person *</Label>
                  <Input value={form.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} required className="border-[#D9D4CC]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Mobile *</Label>
                  <Input value={form.mobile} onChange={(e) => update("mobile", e.target.value)} required className="border-[#D9D4CC]" placeholder="10-digit mobile" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="border-[#D9D4CC]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#2D2D2D]">Address *</Label>
                <Input value={form.address} onChange={(e) => update("address", e.target.value)} required className="border-[#D9D4CC]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">City *</Label>
                  <Input value={form.city} onChange={(e) => update("city", e.target.value)} required className="border-[#D9D4CC]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">District *</Label>
                  <Input value={form.district} onChange={(e) => update("district", e.target.value)} required className="border-[#D9D4CC]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">State *</Label>
                  <Input value={form.state} onChange={(e) => update("state", e.target.value)} required className="border-[#D9D4CC]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">PIN Code *</Label>
                  <Input value={form.pinCode} onChange={(e) => update("pinCode", e.target.value)} required className="border-[#D9D4CC]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Password *</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} required className="border-[#D9D4CC] pr-10" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9590]" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Confirm Password *</Label>
                  <Input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required className="border-[#D9D4CC]" />
                </div>
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-600">{error}</div>
              )}
              <Button type="submit" className="w-full bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white h-10" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Registering..." : "Register School"}
              </Button>
            </form>
            <div className="mt-4 pt-4 border-t border-[#E8E4E0] text-center">
              <p className="text-xs text-[#9B9590]">
                Already registered?{" "}
                <Link to="/school/login" className="text-[#8B8680] hover:text-[#2D2D2D] font-medium">Sign in</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
