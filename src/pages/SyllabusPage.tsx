import { Link } from "react-router";
import { ArrowLeft, Download } from "lucide-react";

const classSyllabi = [
  { label: "Class 6", file: "/syllabus/class-6.pdf" },
  { label: "Class 7", file: "/syllabus/class-7.pdf" },
  { label: "Class 8", file: "/syllabus/class-8.pdf" },
  { label: "Class 9", file: "/syllabus/class-9.pdf" },
  { label: "Class 10", file: "/syllabus/class-10.pdf" },
];

const samplePapers = [
  { label: "Class 6", file: "/pyq/Class 6 Sample Paper.pdf" },
  { label: "Class 7", file: "/pyq/Class 7 Sample Paper.pdf" },
  { label: "Class 8", file: "/pyq/Class 8 Sample Paper.pdf" },
  { label: "Class 9", file: "/pyq/Class 9 Sample Paper.pdf" },
  { label: "Class 10", file: "/pyq/Class 10 Sample Paper.pdf" },
];

const questionPaperPattern = [
  { label: "Question Paper Pattern", file: "/pyq/question-paper-pattern.pdf" },
];

function PdfCardGrid({ items }: { items: { label: string; file: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.file}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-[#FAFAF8] border border-[#E8E4E0] hover:border-[#C4BFB6] transition-colors text-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#2D2D2D] flex items-center justify-center">
            <Download className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#2D2D2D]">
            {item.label}
          </span>
          <span className="text-xs text-[#8B8680]">View PDF</span>
        </a>
      ))}
    </div>
  );
}

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

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 space-y-12">
        {/* Syllabus */}
        <section>
          <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-2">Exam Syllabus</h1>
          <p className="text-sm text-[#6B6560] mb-8">
            Full syllabus details for all Junior Physics Olympiad exams.
          </p>
          <div className="bg-white border border-[#E8E4E0] rounded-xl p-6">
            <PdfCardGrid items={classSyllabi} />
          </div>
        </section>

        {/* Sample Papers */}
        <section>
          <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-2">Sample Papers</h2>
          <p className="text-sm text-[#6B6560] mb-8">
            Practice with sample papers for classes 6, 7, 8, 9 and 10.
          </p>
          <div className="bg-white border border-[#E8E4E0] rounded-xl p-6">
            <PdfCardGrid items={samplePapers} />
          </div>
        </section>

        {/* Question Paper Pattern */}
        <section>
          <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-2">Question Paper Pattern</h2>
          <p className="text-sm text-[#6B6560] mb-8">
            Understand the exam format and question distribution.
          </p>
          <div className="bg-white border border-[#E8E4E0] rounded-xl p-6">
            <PdfCardGrid items={questionPaperPattern} />
          </div>
        </section>
      </div>
    </div>
  );
}