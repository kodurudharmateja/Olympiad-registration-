import { UserPlus, LayoutDashboard, ClipboardList, Wallet, Download, Award } from "lucide-react";
import { Link } from "react-router";


const steps = [
  {
    icon: UserPlus,
    title: "School Registration",
    description: "Register your school on the JPO portal with the required details.",
  },
  {
    icon: LayoutDashboard,
    title: "Login to Dashboard",
    description: "Login using your School ID and password.",
  },
  {
    icon: ClipboardList,
    title: "Register Students",
    description: "Add student details and submit registration.",
  },
  {
    icon: Wallet,
    title: "Make Payment",
    description: "Make online payment for registered students.",
  },
  {
    icon: Download,
    title: "Download Admit Card",
    description: "Download admit cards before the exam.",
  },
  {
    icon: Award,
    title: "View Results",
    description: "Check results and download certificates.",
  },
];

export default function HowItWorksPage() {
  return (
    <section className="bg-white py-16 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-sm text-[#1E3A8A] hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-center text-2xl md:text-3xl font-bold text-[#1E3A8A] tracking-wide mt-6">
          HOW IT WORKS
        </h1>
        <div className="mx-auto mt-2 mb-12 h-1 w-16 rounded-full bg-[#F5A623]" />

        <ol className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8EEFC]">
                    <Icon className="h-6 w-6 text-[#1E3A8A]" strokeWidth={1.75} />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1E3A8A] text-[11px] font-semibold text-white">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#1E3A8A]">{step.title}</h2>
                  <p className="mt-0.5 text-sm text-gray-600">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 text-center">
          <Link
            to="/RegisterInfo"
            className="inline-flex items-center gap-2 rounded-md bg-[#1E3A8A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#16296b]"
          >
            Start Registration
          </Link>
        </div>
      </div>
    </section>
  );
}