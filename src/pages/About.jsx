import { Link } from "react-router";

export default function About() {
  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">About Us</h1>

        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          Welcome to our platform. We are dedicated to providing high-quality
          educational resources that help students achieve their academic and
          career goals.
        </p>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="mt-3 text-gray-600">
            Our mission is to make learning simple, engaging, and accessible for
            everyone through well-structured courses and expert guidance.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold">Why Choose Us?</h2>
          <ul className="mt-4 list-disc pl-6 text-gray-600 space-y-2">
            <li>Experienced instructors</li>
            <li>Industry-relevant curriculum</li>
            <li>Interactive learning experience</li>
            <li>Affordable and accessible education</li>
          </ul>
        </div>
      </div>
    </div>
  );
}