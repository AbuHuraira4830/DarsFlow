import { eq } from "drizzle-orm";
import { closeDatabase, db } from "../src/server/db";
import { academies, academySubscriptions, classes, guardians, platformSettings, studentGuardians, students, subscriptionPlans } from "../src/server/schema";

async function main() {
const now = new Date().toISOString();
const trialEnd = new Date(Date.now() + 14 * 86400000).toISOString();

const existing = await db.select().from(academies).where(eq(academies.id, "academy_demo")).then((rows) => rows[0]);
if (!existing) {
  await db.insert(subscriptionPlans).values([
    { id: "plan_trial", name: "Trial", activeStudentLimit: 20, activeTeacherLimit: 5, priceMinor: null, currency: null, active: true, createdAt: now, updatedAt: now },
    { id: "plan_starter", name: "Starter", activeStudentLimit: 50, activeTeacherLimit: 10, priceMinor: null, currency: null, active: true, createdAt: now, updatedAt: now },
    { id: "plan_growth", name: "Growth", activeStudentLimit: 200, activeTeacherLimit: 30, priceMinor: null, currency: null, active: true, createdAt: now, updatedAt: now },
    { id: "plan_custom", name: "Custom", activeStudentLimit: 1000, activeTeacherLimit: 200, priceMinor: null, currency: null, active: true, createdAt: now, updatedAt: now },
  ]);
  await db.insert(academies).values({ id: "academy_demo", name: "Amanah Learning Academy", slug: "amanah-demo", timezone: "Asia/Karachi", tracks: ["Qaida", "Quran Reading", "Hifz", "Tajweed", "Arabic", "Islamic Studies"], supportPhone: null, status: "trial", onboardingComplete: true, createdAt: now, updatedAt: now });
  await db.insert(academySubscriptions).values({ id: "subscription_demo", academyId: "academy_demo", planId: "plan_trial", status: "trial", trialStartsAt: now, trialEndsAt: trialEnd, periodStartsAt: now, periodEndsAt: trialEnd, createdAt: now, updatedAt: now });
  await db.insert(students).values([
    { id: "student_maryam", academyId: "academy_demo", displayName: "Maryam K.", learningTrack: "Qaida", currentLevel: "Qaida page 18", internalNotes: "Fictional demonstration record.", createdAt: now, updatedAt: now },
    { id: "student_ahmed", academyId: "academy_demo", displayName: "Ahmed R.", learningTrack: "Quran Reading", currentLevel: "Juz 30", internalNotes: "Fictional demonstration record.", createdAt: now, updatedAt: now },
  ]);
  await db.insert(guardians).values({ id: "guardian_demo", academyId: "academy_demo", name: "Fictional Guardian", relationship: "Parent", whatsapp: null, email: "guardian@example.test", preferredChannel: "email", createdAt: now, updatedAt: now });
  await db.insert(studentGuardians).values([{ studentId: "student_maryam", guardianId: "guardian_demo", receiveUpdates: true }, { studentId: "student_ahmed", guardianId: "guardian_demo", receiveUpdates: true }]);
  await db.insert(classes).values({ id: "class_qaida", academyId: "academy_demo", name: "Qaida Foundations", learningTrack: "Qaida", format: "small_group", meetingDays: ["Monday", "Wednesday"], meetingTime: "17:00", createdAt: now, updatedAt: now });
  await db.insert(platformSettings).values({ id: "default", paymentInstructions: null, updatedBy: null, createdAt: now, updatedAt: now });
  console.log("Fictional development seed created. No login account was seeded.");
} else {
  console.log("Development seed already present; no changes made.");
}
}

main().catch((error) => { console.error(error instanceof Error ? error.message : "Seed failed."); process.exitCode = 1; }).finally(closeDatabase);
