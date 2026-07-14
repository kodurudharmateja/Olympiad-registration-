import {
  Trophy,
  GraduationCap,
  BadgeCheck,
  Medal,
  Lightbulb,
  BookOpen,
  ClipboardList,
  Award,
} from "lucide-react";
import { Link } from "react-router";

const reasons = [
  { icon: Trophy, label: "National Level\nRecognition" },
  { icon: GraduationCap, label: "Conducted by\nIIT Alumni" },
  { icon: BadgeCheck, label: "Certificates for\nAll Participants" },
  { icon: Medal, label: "Medals &\nMerit Awards" },
  { icon: Lightbulb, label: "Encourages\nScientific Thinking" },
  { icon: BookOpen, label: "Strong Foundation for\nJEE, NEET & Olympiads" },
];

const highlights = [
  { icon: Trophy, label: "Classes\n6 to 10" },
  { icon: ClipboardList, label: "Offline\nExamination" },
  { icon: BadgeCheck, label: "OMR Based\nTest" },
  { icon: Award, label: "Merit\nCertificates" },
  { icon: Medal, label: "State & National\nRank" },
  { icon: GraduationCap, label: "School Excellence\nAwards" },
];

const awards = [
  { color: "#D4AF37", label: "Gold Medal", sub: "Top Rankers" },
  { color: "#A8A8A8", label: "Silver Medal", sub: "Zonal Top Rankers" },
  { color: "#B08D57", label: "Bronze Medal", sub: "Merit Students" },
];

export default function WhyParticipatePage() {
  return (
    <section className="bg-white py-16 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-sm text-[#1E3A8A] hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-center text-xl md:text-2xl font-bold text-[#1E3A8A] tracking-wide mt-6">
          WHY PARTICIPATE IN JPO?
        </h1>
        <div className="mx-auto mt-2 mb-10 h-1 w-16 rounded-full bg-[#F5A623]" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {reasons.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.label}
                className="flex flex-col items-center gap-3 rounded-lg border border-gray-100 px-4 py-6 text-center shadow-sm"
              >
                <Icon className="h-8 w-8 text-[#1E3A8A]" strokeWidth={1.5} />
                <p className="text-sm font-medium text-gray-700 whitespace-pre-line">{r.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-xl bg-[#0F2557] px-6 py-8">
          <h2 className="text-center text-lg font-bold tracking-wide text-[#F5A623]">
            EXAM HIGHLIGHTS
          </h2>
          <div className="mx-auto mt-2 mb-6 h-px w-24 bg-[#F5A623]/50" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.label} className="flex flex-col items-center gap-2 text-center">
                  <Icon className="h-7 w-7 text-[#F5A623]" strokeWidth={1.5} />
                  <p className="text-xs font-medium text-white whitespace-pre-line">{h.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-center text-xl font-bold text-[#1E3A8A]">AWARDS & RECOGNITION</h2>
          <div className="mt-4 mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
            {awards.map((a) => (
              <div key={a.label} className="flex flex-col items-center text-center gap-2">
                <Medal className="h-10 w-10" style={{ color: a.color }} strokeWidth={1.5} />
                <p className="text-sm font-semibold text-gray-800">{a.label}</p>
                <p className="text-xs text-gray-500">{a.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-md bg-[#F5A623] px-6 py-3 text-sm font-semibold text-[#0F2557] transition hover:bg-[#e0951a]"
          >
            Register Now
          </Link>
        </div>
      </div>
    </section>
  );
}