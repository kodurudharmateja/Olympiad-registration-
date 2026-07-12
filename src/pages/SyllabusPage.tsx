import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import SyllabusList from "@/components/SyllabusList";

export default function SyllabusPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="h-16 bg-white border-b border-[#E8E4E0] flex items-center px-4 lg:px-8">
        <div className="flex items-center gap-3 max-w-4xl mx-auto w-full">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#6B6560] hover:text-[#2D2D2D]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-2">Exam Syllabus</h1>
        <p className="text-sm text-[#6B6560] mb-8">
          Full syllabus details for all Junior Physics Olympiad exams.
        </p>
        <div className="bg-white border border-[#E8E4E0] rounded-xl p-6">
          <SyllabusList />
        </div>
      </div>
    </div>
  );
}