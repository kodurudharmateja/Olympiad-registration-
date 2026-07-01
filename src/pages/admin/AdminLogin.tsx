import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      navigate("/admin/dashboard");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    loginMutation.mutate({ email, password });
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
          <h1 className="text-xl font-semibold text-[#2D2D2D]">Admin Portal</h1>
          <p className="text-sm text-[#6B6560] mt-1">Sign in to manage the Olympiad portal</p>
        </div>

        <Card className="border-[#E8E4E0] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-[#2D2D2D]">Administrator Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#2D2D2D]">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@olympiad.portal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#D9D4CC] bg-[#FAFAF8] focus:border-[#8B8680]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#2D2D2D]">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

              <Button
                type="submit"
                className="w-full bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white h-10"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-[#E8E4E0]">
              <p className="text-xs text-[#9B9590] text-center">
                Default: admin@olympiad.portal / admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
