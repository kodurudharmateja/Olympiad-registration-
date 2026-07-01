import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, School, Eye, EyeOff } from "lucide-react";

export default function SchoolLogin() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.school.login.useMutation({
    onSuccess: () => navigate("/school/dashboard"),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!mobile || !password) {
      setError("Please fill in all fields");
      return;
    }
    loginMutation.mutate({ mobile, password });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#6B6560] hover:text-[#2D2D2D] mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="w-8 h-8 text-[#8B8680]" />
          </div>
          <h1 className="text-xl font-semibold text-[#2D2D2D]">School Portal</h1>
          <p className="text-sm text-[#6B6560] mt-1">Sign in to manage your students</p>
        </div>

        <Card className="border-[#E8E4E0] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-[#2D2D2D] flex items-center gap-2">
              <School className="w-4 h-4 text-[#8B8680]" />
              School Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-[#2D2D2D]">Mobile Number</Label>
                <Input
                  id="mobile"
                  placeholder="Enter registered mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="border-[#D9D4CC] bg-[#FAFAF8] focus:border-[#8B8680]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#2D2D2D]">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-[#D9D4CC] bg-[#FAFAF8] focus:border-[#8B8680] pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9590]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-600">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white h-10" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-4 pt-4 border-t border-[#E8E4E0] text-center">
              <p className="text-xs text-[#9B9590]">
                Don't have an account?{" "}
                <Link to="/school/register" className="text-[#8B8680] hover:text-[#2D2D2D] font-medium">
                  Register your school
                </Link>
              </p>
              <p className="text-xs text-[#9B9590] mt-2">
                Demo: 9876543210 / school123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
