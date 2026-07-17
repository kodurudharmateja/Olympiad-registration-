import { Link } from "react-router";
import { ArrowLeft, Download, BookOpen, ClipboardList, FileText } from "lucide-react";

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

// A friendly rotation of blues (plus a gold pop) so the cards don't feel flat/uniform
const cardAccents = ["#0A1642", "#1E3A8A", "#2E5AA8", "#3B6FC4", "#D4A843"];

function PdfCardGrid({ items }: { items: { label: string; file: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item, i) => {
        const accent = cardAccents[i % cardAccents.length];
        const isGold = accent === "#D4A843";
        return (
          <a
            key={item.label}
            href={item.file}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white border-2 border-[#DCE9FA] hover:border-[#7FA8DE] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-center"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              style={{ backgroundColor: accent }}
            >
              <Download className={`w-5 h-5 ${isGold ? "text-[#1A1000]" : "text-white"}`} />
            </div>
            <span className="text-sm font-bold text-[#122250]">
              {item.label}
            </span>
            <span className="text-xs font-medium text-[#2E5AA8] px-3 py-1 rounded-full bg-[#EDF4FC] group-hover:bg-[#D4A843] group-hover:text-[#1A1000] transition-colors">
              View PDF
            </span>
          </a>
        );
      })}
    </div>
  );
}

export default function SyllabusPage() {
  return (
    <div className="min-h-screen bg-[#F2F7FD]">
      {/* Header */}
      <header className="h-16 bg-[#0A1642] flex items-center px-4 lg:px-8">
        <div className="flex items-center gap-3 max-w-4xl mx-auto w-full">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#C7D2E8] hover:text-[#D4A843] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero strip */}
      <div className="bg-[#0A1642] pb-14 pt-2 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4A843] mb-4 rotate-3">
            <BookOpen className="w-8 h-8 text-[#1A1000]" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
            Exam Syllabus & Practice
          </h1>
          <p className="text-[#C7D2E8] text-sm lg:text-base max-w-xl mx-auto">
            Everything you need to get ready for the Junior Physics Olympiad —
            syllabus, sample papers, and the exam pattern, all in one place.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 -mt-10 pb-16 space-y-10">
        {/* Syllabus */}
        <section className="bg-white border border-[#DCE9FA] rounded-3xl p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#EDF4FC] flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-[#0A1642]" />
            </div>
            <h2 className="text-xl font-bold text-[#122250]">Class-wise Syllabus</h2>
          </div>
          <p className="text-sm text-[#5B79A8] mb-6 ml-[52px]">
            Full syllabus details for all Junior Physics Olympiad exams.
          </p>
          <PdfCardGrid items={classSyllabi} />
        </section>

        {/* Sample Papers */}
        <section className="bg-white border border-[#DCE9FA] rounded-3xl p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#EDF4FC] flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-[#0A1642]" />
            </div>
            <h2 className="text-xl font-bold text-[#122250]">Sample Papers</h2>
          </div>
          <p className="text-sm text-[#5B79A8] mb-6 ml-[52px]">
            Practice with sample papers for classes 6, 7, 8, 9 and 10.
          </p>
          <PdfCardGrid items={samplePapers} />
        </section>

        {/* Question Paper Pattern */}
        <section className="bg-white border border-[#DCE9FA] rounded-3xl p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#EDF4FC] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#0A1642]" />
            </div>
            <h2 className="text-xl font-bold text-[#122250]">Question Paper Pattern</h2>
          </div>
          <p className="text-sm text-[#5B79A8] mb-6 ml-[52px]">
            Understand the exam format and question distribution.
          </p>
          <PdfCardGrid items={questionPaperPattern} />
        </section>
      </div>
    </div>
  );
}