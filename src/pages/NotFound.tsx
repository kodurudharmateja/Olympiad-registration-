import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#2D2D2D] mb-2">404</h1>
        <p className="text-lg text-[#6B6560] mb-2">Page not found</p>
        <p className="text-sm text-[#9B9590] mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" className="border-[#D9D4CC] text-[#6B6560]" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Link to="/">
            <Button className="bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
