import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-[#F2F7FD]">
      {/* Header */}
      <div className="bg-[#0A1642] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#C7D2E8] hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold">About Junior Physics Olympiad</h1>

          <p className="mt-4 max-w-3xl text-[#C7D2E8] leading-relaxed">
            Inspiring Young Minds to Explore the World of Physics.
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">

          <div className="bg-white rounded-2xl border border-[#D8E6FA] shadow-sm p-8">

            <h2 className="text-2xl font-semibold text-[#122250] mb-6">
              What is the Junior Physics Olympiad?
            </h2>

            <p className="text-[#41537A] leading-8 mb-6">
              The Junior Physics Olympiad (JPO) is a prestigious national-level
              examination designed to identify, encourage, and nurture young
              physics enthusiasts from across India. The Olympiad provides
              students with an opportunity to strengthen their conceptual
              understanding, logical reasoning, scientific thinking, and
              problem-solving abilities.
            </p>

            <p className="text-[#41537A] leading-8 mb-6">
              Unlike conventional examinations that focus mainly on memorization,
              JPO encourages students to think critically, apply scientific
              concepts, and develop analytical skills. It creates an exciting
              platform where students can challenge themselves beyond the regular
              school curriculum.
            </p>

            <h2 className="text-2xl font-semibold text-[#122250] mt-10 mb-5">
              Our Vision
            </h2>

            <p className="text-[#41537A] leading-8 mb-6">
              To cultivate curiosity, innovation, and scientific excellence among
              school students while inspiring the next generation of scientists,
              researchers, and engineers.
            </p>

            <h2 className="text-2xl font-semibold text-[#122250] mt-10 mb-5">
              Our Mission
            </h2>

            <ul className="list-disc pl-6 space-y-3 text-[#41537A] leading-7">
              <li>Promote conceptual understanding of Physics.</li>
              <li>Develop logical and analytical thinking.</li>
              <li>Encourage scientific curiosity among students.</li>
              <li>Provide a fair and competitive national platform.</li>
              <li>Recognize and reward talented young minds.</li>
            </ul>

            <div className="mt-12 p-6 rounded-xl bg-[#EDF4FC] border border-[#D8E6FA]">
              <h3 className="text-xl font-semibold text-[#122250] mb-3">
                Why Participate?
              </h3>

              <p className="text-[#41537A] leading-8">
                Participation in JPO helps students improve conceptual clarity,
                confidence, and problem-solving abilities while preparing them
                for future competitive examinations and scientific pursuits.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}