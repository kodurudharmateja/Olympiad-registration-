import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  ArrowRight,
  // Award,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "About", to: "/about" },
    { label: "Syllabus", to: "/syllabus" },
    { label: "Achievements", to: "/achievements" },
    { label: "Brochure", to: "/brochure.pdf", newTab: true },
  ];

  return (
    <div className="min-h-screen bg-[#F2F7FD]">
      {/* Header + Hero wrapped together so the background image spans both */}
      <div
        className="relative bg-cover bg-center"
        style={{ backgroundImage: "url('/landingpagebg.jpeg')" }}
      >
        {/* Overlay for text legibility over the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1642]/85 via-[#0D1F5C]/80 to-[#0A1642]/90" />

        {/* Header */}
        <header className="h-16 flex items-center px-4 lg:px-8 relative z-50">
          <div className="flex items-center gap-3 max-w-7xl mx-auto w-full">
            <img src="/logo.png" alt="Junior Physics Olympiad" className="w-7 h-7 object-contain" />
            <h1 className="text-lg font-semibold text-white">Junior Physics Olympiad</h1>
            <div className="flex-1" />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                key={link.label}
                to={link.to}
                {...(link.newTab
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-sm text-[#C7D2E8] hover:text-white transition-colors">
                {link.label}
              </Link>
              ))}
              <Link to="/register-now">
                <Button
                  size="sm"
                  className="bg-[#D4A843] hover:bg-[#C4982F] text-[#1A1000] font-medium"
                >
                  Register Now
                </Button>
              </Link>
              <Link
                to="/admin/login"
                className="text-sm text-[#C7D2E8] hover:text-white transition-colors"
              >
                Admin
              </Link>
            </nav>

            {/* Mobile hamburger - right side */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -mr-2 text-white"
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
                  <Link
                    key={link.label}
                    to={link.to}
                    {...(link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base text-[#2D2D2D] font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/register-now" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#D4A843] hover:bg-[#C4982F] text-[#1A1000] font-medium mt-2">
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
        <section className="py-16 lg:py-24 px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <img
              src="/logo.png"
              alt="Junior Physics Olympiad"
              className="w-28 h-28 lg:w-36 lg:h-36 object-contain mx-auto mb-6"
            />
            {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0EDE8] text-[#6B6560] text-xs font-medium mb-6">
              <Award className="w-3.5 h-3.5" />
              Olympiad Registration 2026 Now Open
            </div> */}
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Junior Physics Olympiad
              <br />
              <span className="text-[#9DC3E6]">Registration Portal</span>
            </h2>
            <p className="text-[#C7D2E8] text-base lg:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Inspiring Young Minds to Explore the World of Physics.
            </p>

            <div className="flex justify-center">
              <Link to="/register-now">
                <Button
                  size="lg"
                  className="bg-[#D4A843] hover:bg-[#C4982F] text-[#1A1000] font-semibold px-10 h-12"
                >
                  Register Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Who Inspired Us */}
      <section className="py-16 px-4 border-t border-[#D8E6FA] bg-[#EDF4FC]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-[#122250] text-center mb-12">
            Who Inspired Us
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src="/WalterLewin.jpg" // TODO: confirm actual image path/filename
                alt="Prof. Walter Lewin"
                className="w-40 h-40 lg:w-56 lg:h-56 rounded-2xl object-cover border border-[#C9DDF5] bg-white"
              />
            </div>

            {/* Info */}
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-semibold text-[#122250] mb-1">
                Prof. Walter Lewin
              </h3>
              <p className="text-sm text-[#5B79A8] mb-4">Astrophysicist</p>
              <p className="text-sm text-[#41537A] leading-relaxed max-w-xl">
                Walter Hendrik Gustav Lewin (born January 29, 1936) is a Dutch
                astrophysicist and retired professor of physics at the
                Massachusetts Institute of Technology. Lewin earned his doctorate
                in nuclear physics in 1965 at the Delft University of Technology
                and was a member of MIT's physics faculty for 43 years beginning
                in 1966 until his retirement in 2009. Lewin's contributions in
                astrophysics include the first discovery of a rotating neutron
                star through all-sky balloon surveys and research in X-ray
                detection in investigations through satellites and observatories.
                Lewin has received awards for teaching and is known for his
                lectures on physics and their publication online via YouTube,
                MIT Open Course Ware and edX.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Founder / Person Section */}
      <section className="py-16 px-4 bg-[#DCE9FA] border-y border-[#C9DDF5]">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          {/* Image */}
          <div className="flex-shrink-0">
            <img
              src="/HarishChandraVerma.png" // TODO: replace with actual image path
              alt="Name of the person"
              className="w-40 h-40 lg:w-56 lg:h-56 rounded-2xl object-cover border border-[#C9DDF5] bg-white"
            />
          </div>

          {/* Info */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-semibold text-[#122250] mb-1">
              {/* TODO: Name */}
              Prof. Harish Chandra Verma
            </h3>
            <p className="text-sm text-[#5B79A8] mb-4">
              {/* TODO: Designation */}
              Authors of Physics
            </p>
            <p className="text-sm text-[#41537A] leading-relaxed max-w-xl">Prof. Harish Chandra Verma is one of the most distinguished authors of Physics in India. Often referred to as an 'idol' and the pedagogical 'Guru' for all JEE aspirants, he has written several influential books on Physics and is best known for his two-volume book Concepts of Physics. The book is considered as the Bible of Physics, a prerequisite for students preparing for IIT JEE or other engineering entrance examinations. Currently, he serves as a Professor in the Department of Physics at IIT Kanpur. Besides being a prominent author and researcher, he is an active socialist who has co-founded many social initiatives like Shikhsa Sopan, which literally means "a ladder to education" for the growth and upliftment of underprivileged kids in and around IIT campus
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="about" className="py-16 px-4 bg-[#EDF4FC] border-y border-[#D8E6FA] scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-semibold text-[#122250] text-center mb-12">
            Exam Syllabus
          </h3>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Syllabus card */}
            <Link
              to="/syllabus"
              className="flex-1 p-6 rounded-xl bg-white border border-[#C9DDF5] hover:border-[#7FA8DE] transition-colors"
            >
              <h4 className="text-sm font-semibold text-[#122250] mb-2">Syllabus</h4>
              <p className="text-xs text-[#41537A] leading-relaxed">
                  Review the complete syllabus with chapter-wise topics designed to build
                  strong conceptual understanding and problem-solving skills.
                  Get a detailed overview of every subject area covered in the Junior Physics Olympiad exams, 
                  ensuring students are well-prepared for each level of the competition.
                  View the full exam-wise syllabus for all Junior Physics Olympiad exams.
              </p>
              <span className="inline-block mt-3 text-sm font-medium text-[#2E5AA8]">
                View full syllabus →
              </span>
            </Link>

            {/* About card */}
            <Link
              to="/about"
              className="flex-1 p-6 rounded-xl bg-white border border-[#C9DDF5] hover:border-[#7FA8DE] transition-colors"
            >
              <h4 className="text-sm font-semibold text-[#122250] mb-4">About</h4>
              <p className="text-xs text-[#41537A] leading-relaxed">
                prestigious national-level examination designed to identify, encourage,
                and nurture young physics enthusiasts from across India. JPO provides students
                with an opportunity to strengthen their conceptual understanding, logical
                reasoning, scientific thinking, and problem-solving abilities.
              </p>
              
              <span className="inline-block mt-3 text-sm font-medium text-[#2E5AA8]">
                View About →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-[#F2F7FD]">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl font-semibold text-[#122250] text-center mb-12">
            How It Works
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "How It Works",
                desc: "Learn the complete registration process step by step.",
                to: "/HowItWorks",
              },
              {
                step: "02",
                title: "Why-Participate",
                desc: "Discover why students should take part in the Olympiad.",
                to: "/WhyParticipate",
              },
              {
                step: "03",
                title: "Register",
                desc: "Start registering your school and students online.",
                to: "/RegisterInfo",
              },
              {
                step: "04",
                title: "Contact Us",
                desc: "Need assistance? Reach out to the JPO support team.",
                to: "/ContactUs",
              },
            ].map((item) => (
              <Link
                key={item.step}
                to={item.to}
                className="group rounded-xl p-4 transition-all duration-300 hover:bg-white hover:shadow-lg"
              >
                <div className="w-14 h-14 rounded-full bg-[#0A1642] text-white flex items-center justify-center text-sm font-bold mx-auto mb-4 transition-all duration-300 group-hover:bg-[#D4A843] group-hover:text-[#1A1000] group-hover:scale-110">
                  {item.step}
                </div>

                <h4 className="text-sm font-semibold text-[#122250] mb-2 text-center group-hover:text-[#0A1642] transition-colors">
                  {item.title}
                </h4>

                <p className="text-xs text-[#41537A] text-center leading-relaxed">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section id="achievements" className="py-16 px-4 bg-[#DCE9FA] scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <img
            src="/fot.jpeg"
            alt="Awards & Recognition - Gold, Silver, and Bronze medals; A small test today, a big achievement tomorrow"
            className="w-full h-auto rounded-2xl shadow-sm"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#1B2C5C] bg-[#0A1642]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#9DC3E6]" />
            <span className="text-sm text-[#C7D2E8]">Junior Physics Olympiad 2026</span>
          </div>
          <p className="text-xs text-[#7A8FC0]">
            National Olympiad Examination Committee. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}