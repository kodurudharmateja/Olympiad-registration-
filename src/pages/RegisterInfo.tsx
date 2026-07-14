import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  School,
  Users,
  ArrowRight,
  ArrowLeft,
  IndianRupee,
} from "lucide-react";

export default function RegisterInfo() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#E8E4E0] flex items-center px-4 lg:px-8">
        <div className="flex items-center gap-3 max-w-5xl mx-auto w-full">
          <img src="/logo.png" alt="Junior Physics Olympiad" className="w-7 h-7 object-contain" />
          <h1 className="text-lg font-semibold text-[#2D2D2D]">Junior Physics Olympiad</h1>
          <div className="flex-1" />
          <Link
            to="/"
            className="text-sm text-[#6B6560] hover:text-[#2D2D2D] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 lg:py-16">
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-4xl font-bold text-[#2D2D2D] mb-4 tracking-tight">
            Register for the Junior Physics Olympiad
          </h2>
          <p className="text-[#6B6560] text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            JPO is a prestigious national-level examination designed to identify, encourage,
            and nurture young physics enthusiasts from across India. It gives students the
            opportunity to strengthen their conceptual understanding, logical reasoning,
            scientific thinking, and problem-solving abilities.
          </p>
        </div>

        {/* Exam structure table */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-[#2D2D2D] mb-4 text-center">
            Exam Structure
          </h3>
          <div className="overflow-x-auto rounded-xl border border-[#C4954A]">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1E3A6E] text-white">
                  <th className="px-4 py-3 text-left font-semibold border-r border-[#C4954A]/40">
                    Exam Level
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border-r border-[#C4954A]/40">
                    Mode
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border-r border-[#C4954A]/40">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Tentative Schedule
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-t border-[#E8E4E0]">
                  <td className="px-4 py-4 border-r border-[#E8E4E0] align-top">
                    <span className="font-semibold text-[#1E3A6E]">Level 1:</span>{" "}
                    <span className="text-[#2D2D2D]">School Level Exam</span>
                  </td>
                  <td className="px-4 py-4 border-r border-[#E8E4E0] align-top text-[#2D2D2D]">
                    Offline <span className="font-semibold">(At School)</span>
                  </td>
                  <td className="px-4 py-4 border-r border-[#E8E4E0] align-top text-[#2D2D2D]">
                    60 Min
                  </td>
                  <td className="px-4 py-4 align-top text-[#2D2D2D]">November</td>
                </tr>
                <tr className="border-t border-[#E8E4E0]">
                  <td className="px-4 py-4 border-r border-[#E8E4E0] align-top">
                    <span className="font-semibold text-[#1E3A6E]">Level 2:</span>{" "}
                    <span className="text-[#2D2D2D]">National Level Exam</span>
                    <div className="text-xs text-[#6B6560]">(For Qualifiers)</div>
                  </td>
                  <td className="px-4 py-4 border-r border-[#E8E4E0] align-top text-[#2D2D2D]">
                    Offline <span className="font-semibold">(At Designated Centres)</span>
                  </td>
                  <td className="px-4 py-4 border-r border-[#E8E4E0] align-top text-[#2D2D2D]">
                    90 Min
                  </td>
                  <td className="px-4 py-4 align-top text-[#2D2D2D]">December</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fee */}
        <div className="mb-12 rounded-xl bg-white border border-[#E8E4E0] p-6 flex items-center gap-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#F0EDE8] flex items-center justify-center flex-shrink-0">
            <IndianRupee className="w-6 h-6 text-[#2D2D2D]" />
          </div>
          <div>
            <p className="text-xs text-[#6B6560] mb-1">Registration Fee</p>
            <p className="text-xl font-bold text-[#2D2D2D]">₹250 per student</p>
          </div>
        </div>

        {/* Login options */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#2D2D2D] mb-6">
            Continue to Register
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/school/login">
              <Button
                size="lg"
                className="bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white px-8 h-12 w-full sm:w-auto"
              >
                <School className="w-4 h-4 mr-2" />
                School Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/parent/login">
              <Button
                size="lg"
                variant="outline"
                className="border-[#C4BFB6] text-[#2D2D2D] hover:bg-[#F0EDE8] px-8 h-12 w-full sm:w-auto"
              >
                <Users className="w-4 h-4 mr-2" />
                Student login
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#E8E4E0] bg-white mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#8B8680]" />
            <span className="text-sm text-[#6B6560]">Junior Physics Olympiad 2026</span>
          </div>
          <p className="text-xs text-[#9B9590]">
            National Olympiad Examination Committee. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}