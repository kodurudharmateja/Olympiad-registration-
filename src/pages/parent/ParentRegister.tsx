import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Eye, EyeOff } from "lucide-react";

export default function ParentRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", mobile: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const registerMutation = trpc.parent.register.useMutation({
    onSuccess: () => navigate("/parent/login"),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    const { confirmPassword, ...data } = form;
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#6B6560] hover:text-[#2D2D2D] mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <img src="/logo.png" alt="Junior Physics Olympiad" className="w-8 h-8 mx-auto mb-2 object-contain" />
          <h1 className="text-xl font-semibold text-[#2D2D2D]">Parent Registration</h1>
          <p className="text-sm text-[#6B6560]">Create an account to register your child</p>
        </div>

        <Card className="border-[#E8E4E0] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-[#2D2D2D] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8B8680]" />
              Your Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#2D2D2D]">Full Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="border-[#D9D4CC]" placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#2D2D2D]">Mobile Number *</Label>
                <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required className="border-[#D9D4CC]" placeholder="10-digit mobile number" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#2D2D2D]">Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border-[#D9D4CC]" placeholder="Optional" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Password *</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="border-[#D9D4CC] pr-10" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9590]" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Confirm *</Label>
                  <Input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required className="border-[#D9D4CC]" />
                </div>
              </div>
              {error && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-600">{error}</div>}
              <Button type="submit" className="w-full bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white h-10" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            <div className="mt-4 pt-4 border-t border-[#E8E4E0] text-center">
              <p className="text-xs text-[#9B9590]">Already have an account? <Link to="/parent/login" className="text-[#8B8680] hover:text-[#2D2D2D] font-medium">Sign in</Link></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
