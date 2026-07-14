import { Link } from "react-router";
import { Mail, Phone } from "lucide-react";

export default function ContactUsPage() {
  return (
    <section className="bg-[#F7F9FC] py-16 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-left">
          <Link to="/" className="text-sm text-[#1E3A8A] hover:underline">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A8A] tracking-wide mt-6">
          CONTACT US
        </h1>
        <div className="mx-auto mt-2 mb-10 h-1 w-16 rounded-full bg-[#F5A623]" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="mailto:info@jpo.org.in"
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm transition hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EEFC]">
              <Mail className="h-5 w-5 text-[#1E3A8A]" />
            </span>
            <span className="text-sm font-medium text-gray-700">info@jpo.org.in</span>
          </a>

          <a
            href="tel:+918978685507"
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm transition hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EEFC]">
              <Phone className="h-5 w-5 text-[#1E3A8A]" />
            </span>
            <span className="text-sm font-medium text-gray-700">+91 89786 85507</span>
          </a>
        </div>
      </div>
    </section>
  );
}