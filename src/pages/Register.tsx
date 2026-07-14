import { Link } from "react-router";
import { UserPlus, ClipboardList, Wallet } from "lucide-react";

export default function RegisterPage() {
  return (
    <section className="bg-white py-16 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-sm text-[#1E3A8A] hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-center text-2xl md:text-3xl font-bold text-[#1E3A8A] tracking-wide mt-6">
          REGISTER FOR JPO
        </h1>
        <div className="mx-auto mt-2 mb-10 h-1 w-16 rounded-full bg-[#F5A623]" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 px-4 py-5 text-center shadow-sm">
            <UserPlus className="h-7 w-7 text-[#1E3A8A]" strokeWidth={1.5} />
            <p className="text-sm font-medium text-gray-700">School / Parent Signup</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 px-4 py-5 text-center shadow-sm">
            <ClipboardList className="h-7 w-7 text-[#1E3A8A]" strokeWidth={1.5} />
            <p className="text-sm font-medium text-gray-700">Add Student Details</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 px-4 py-5 text-center shadow-sm">
            <Wallet className="h-7 w-7 text-[#1E3A8A]" strokeWidth={1.5} />
            <p className="text-sm font-medium text-gray-700">Secure Payment</p>
          </div>
        </div>

        {/*
          TODO: Wire this up to your actual registration form / API.
          This is a placeholder shell so the route + page exist and
          match the site's blue theme.
        */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              placeholder="Enter school name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              placeholder="Enter mobile number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              placeholder="Enter email address"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#1E3A8A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#16296b]"
          >
            Continue Registration
          </button>
        </form>
      </div>
    </section>
  );
}