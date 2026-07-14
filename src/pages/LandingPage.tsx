import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  School,
  Users,
  ArrowRight,
  Award,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "About", to: "#about" },
    { label: "Syllabus", to: "/syllabus" },
    { label: "Achievements", to: "/achievements" },
    { label: "Brochure", to: "/brochure.pdf", newTab: true },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#E8E4E0] flex items-center px-4 lg:px-8 relative z-50">
        <div className="flex items-center gap-3 max-w-7xl mx-auto w-full">
          <img src="/logo.png" alt="Junior Physics Olympiad" className="w-7 h-7 object-contain" />
          <h1 className="text-lg font-semibold text-[#2D2D2D]">Junior Physics Olympiad</h1>
          <div className="flex-1" />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                {...(link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-sm text-[#6B6560] hover:text-[#2D2D2D] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link to="/school/login">
              <Button
                size="sm"
                className="bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white"
              >
                Register Now
              </Button>
            </Link>
            <Link
              to="/admin/login"
              className="text-sm text-[#6B6560] hover:text-[#2D2D2D] transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile hamburger - right side */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -mr-2 text-[#2D2D2D]"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer - slides in from the right */}
          <div className="absolute top-0 right-0 h-full w-72 bg-white shadow-xl flex flex-col px-6 py-5">
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-semibold text-[#2D2D2D]">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 text-[#2D2D2D]"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.to}
                  {...(link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-[#2D2D2D] font-medium"
                >
                  {link.label}
                </a>
              ))}
              <Link to="/school/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white mt-2">
                  Register Now
                </Button>
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base text-[#6B6560] mt-2"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="py-16 lg:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0EDE8] text-[#6B6560] text-xs font-medium mb-6">
            <Award className="w-3.5 h-3.5" />
            Olympiad Registration 2026 Now Open
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#2D2D2D] mb-4 tracking-tight">
            Junior Physics Olympiad
            <br />
            <span className="text-[#8B8680]">Registration Portal</span>
          </h2>
          <p className="text-[#6B6560] text-base lg:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Inspiring Young Minds to Explore the World of Physics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/school/login">
              <Button
                size="lg"
                className="bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white px-8 h-12"
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
                className="border-[#C4BFB6] text-[#2D2D2D] hover:bg-[#F0EDE8] px-8 h-12"
              >
                <Users className="w-4 h-4 mr-2" />
                Student login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="about" className="py-16 px-4 bg-white border-y border-[#E8E4E0] scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-semibold text-[#2D2D2D] text-center mb-12">
            Exam Syllabus
          </h3>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Syllabus card */}
            <Link
              to="/syllabus"
              className="flex-1 p-6 rounded-xl bg-[#FAFAF8] border border-[#E8E4E0] hover:border-[#C4BFB6] transition-colors"
            >
              <h4 className="text-sm font-semibold text-[#2D2D2D] mb-2">Syllabus</h4>
              <p className="text-xs text-[#6B6560] leading-relaxed">
                View the full exam-wise syllabus for all Junior Physics Olympiad exams.
              </p>
              <span className="inline-block mt-3 text-xs font-medium text-[#8B8680]">
                View full syllabus →
              </span>
            </Link>

            {/* About card */}
            <div className="flex-1 p-6 rounded-xl bg-[#FAFAF8] border border-[#E8E4E0]">
              <h4 className="text-sm font-semibold text-[#2D2D2D] mb-4">About</h4>
              <p className="text-xs text-[#6B6560] leading-relaxed">
                prestigious national-level examination designed to identify, encourage,
                and nurture young physics enthusiasts from across India. JPO provides students
                with an opportunity to strengthen their conceptual understanding, logical
                reasoning, scientific thinking, and problem-solving abilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl font-semibold text-[#2D2D2D] text-center mb-12">
            How It Works
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Register Account", desc: "School or Parent signup with mobile verification" },
              { step: "02", title: "Select Exam", desc: "Browse live olympiad exams and check eligibility" },
              { step: "03", title: "Add Students", desc: "Bulk CSV upload or individual student entry" },
              { step: "04", title: "Pay & Confirm", desc: "Secure Razorpay payment with instant receipt" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#2D2D2D] text-white flex items-center justify-center text-sm font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h4 className="text-sm font-semibold text-[#2D2D2D] mb-2">{s.title}</h4>
                <p className="text-xs text-[#6B6560]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#E8E4E0] bg-white">
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