import { getDb } from "../api/queries/connection";
import * as schema from "./schema";
import { hashSync } from "bcrypt-ts";

async function seed() {
  const db = getDb();

  // ─── Admin Account ───
  await db.insert(schema.admins).values({
    email: "admin@olympiad.portal",
    passwordHash: hashSync("admin123", 10),
    name: "Administrator",
  });
  console.log("✅ Admin seeded");

  // ─── Exams ───
  const now = new Date();
  const future1 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const future2 = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);
  const future3 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const deadline1 = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000);
  const deadline2 = new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000);
  const deadline3 = new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000);

  await db.insert(schema.exams).values([
    {
      name: "National Mathematics Olympiad 2026",
      examDate: future1,
      feePerStudent: "150.00",
      registrationDeadline: deadline1,
      center: "Delhi Public School, RK Puram, New Delhi",
      eligibility: "BOTH",
      isLive: true,
    },
    {
      name: "National Science Olympiad 2026",
      examDate: future2,
      feePerStudent: "200.00",
      registrationDeadline: deadline2,
      center: "Modern School, Barakhamba Road, New Delhi",
      eligibility: "BOTH",
      isLive: true,
    },
    {
      name: "International English Olympiad 2026",
      examDate: future3,
      feePerStudent: "175.00",
      registrationDeadline: deadline3,
      center: "Springdales School, Pusa Road, New Delhi",
      eligibility: "BOTH",
      isLive: true,
    },
    {
      name: "Computer Science Olympiad 2026",
      examDate: future2,
      feePerStudent: "250.00",
      registrationDeadline: deadline2,
      center: "The Mother's International School, Sri Aurobindo Marg, New Delhi",
      eligibility: "SCHOOL_ONLY",
      isLive: true,
    },
  ]);
  console.log("✅ Exams seeded");

  // ─── Schools ───
  await db.insert(schema.schools).values([
    {
      name: "Delhi Public School",
      principalName: "Dr. Ramesh Sharma",
      contactPerson: "Mr. Anil Kumar",
      mobile: "9876543210",
      email: "dps@school.edu",
      address: "Sector 12, RK Puram",
      city: "New Delhi",
      district: "South West Delhi",
      state: "Delhi",
      pinCode: "110022",
      isActive: true,
      passwordHash: hashSync("school123", 10),
    },
    {
      name: "St. Xavier's School",
      principalName: "Fr. Joseph Mathew",
      contactPerson: "Ms. Priya Singh",
      mobile: "9876543211",
      email: "stxaviers@school.edu",
      address: "4, Raj Niwas Marg",
      city: "New Delhi",
      district: "Central Delhi",
      state: "Delhi",
      pinCode: "110054",
      isActive: true,
      passwordHash: hashSync("school123", 10),
    },
    {
      name: "Modern School",
      principalName: "Mrs. Sunita Gupta",
      contactPerson: "Mr. Vikram Rao",
      mobile: "9876543212",
      email: "modern@school.edu",
      address: "Barakhamba Road",
      city: "New Delhi",
      district: "New Delhi",
      state: "Delhi",
      pinCode: "110001",
      isActive: true,
      passwordHash: hashSync("school123", 10),
    },
  ]);
  console.log("✅ Schools seeded");

  // ─── Parents ───
  await db.insert(schema.parents).values([
    {
      name: "Rajesh Kumar",
      mobile: "9812345678",
      email: "rajesh@email.com",
      passwordHash: hashSync("parent123", 10),
    },
    {
      name: "Sunita Devi",
      mobile: "9812345679",
      email: "sunita@email.com",
      passwordHash: hashSync("parent123", 10),
    },
    {
      name: "Mohammed Ali",
      mobile: "9812345680",
      email: "ali@email.com",
      passwordHash: hashSync("parent123", 10),
    },
  ]);
  console.log("✅ Parents seeded");

  // ─── Students ───
  await db.insert(schema.students).values([
    {
      name: "Aarav Sharma",
      className: "8",
      section: "A",
      rollNumber: "DPS/8A/001",
      gender: "Male",
      mobile: "9876543210",
      parentName: "Rajesh Sharma",
      schoolId: 1,
    },
    {
      name: "Priya Patel",
      className: "9",
      section: "B",
      rollNumber: "DPS/9B/015",
      gender: "Female",
      mobile: "9876543210",
      parentName: "Mukesh Patel",
      schoolId: 1,
    },
    {
      name: "Rohan Gupta",
      className: "7",
      section: "C",
      rollNumber: "STX/7C/008",
      gender: "Male",
      mobile: "9876543211",
      parentName: "Sunil Gupta",
      schoolId: 2,
    },
    {
      name: "Ananya Reddy",
      className: "10",
      section: "A",
      gender: "Female",
      mobile: "9812345678",
      parentName: "Rajesh Kumar",
      parentId: 1,
    },
    {
      name: "Vikram Singh",
      className: "6",
      section: "B",
      gender: "Male",
      mobile: "9812345679",
      parentName: "Sunita Devi",
      parentId: 2,
    },
  ]);
  console.log("✅ Students seeded");

  console.log("\n🎉 Seed complete!");
  console.log("\nLogin credentials:");
  console.log("  Admin: admin123admin@olympiad.portal / ");
  console.log("  School 1: 9876543210 / school123");
  console.log("  School 2: 9876543211 / school123");
  console.log("  School 3: 9876543212 / school123");
  console.log("  Parent 1: 9812345678 / parent123");
  console.log("  Parent 2: 9812345679 / parent123");
  console.log("  Parent 3: 9812345680 / parent123");
}

seed().catch(console.error);
