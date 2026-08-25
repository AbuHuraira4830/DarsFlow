import { closeDatabase, db } from "../src/server/db";
import { platformSettings, subscriptionPlans } from "../src/server/schema";

async function main() {
  if (!process.env.DATABASE_URL?.startsWith("postgres")) throw new Error("Production bootstrap requires a PostgreSQL DATABASE_URL.");
  const stamp = new Date().toISOString();
  const plans = [
    { id: "plan_trial", name: "Trial", activeStudentLimit: 20, activeTeacherLimit: 5, trialDays: 14, graceDays: 7 },
    { id: "plan_starter", name: "Starter", activeStudentLimit: 50, activeTeacherLimit: 10, trialDays: 14, graceDays: 7 },
    { id: "plan_growth", name: "Growth", activeStudentLimit: 200, activeTeacherLimit: 30, trialDays: 14, graceDays: 7 },
    { id: "plan_custom", name: "Custom", activeStudentLimit: 1000, activeTeacherLimit: 200, trialDays: 14, graceDays: 7 },
  ];
  for (const plan of plans) await db.insert(subscriptionPlans).values({ ...plan, active: true, priceMinor: null, currency: null, createdAt: stamp, updatedAt: stamp }).onConflictDoUpdate({ target: subscriptionPlans.name, set: { activeStudentLimit: plan.activeStudentLimit, activeTeacherLimit: plan.activeTeacherLimit, trialDays: plan.trialDays, graceDays: plan.graceDays, active: true, updatedAt: stamp } });
  await db.insert(platformSettings).values({ id: "default", paymentInstructions: null, updatedBy: null, createdAt: stamp, updatedAt: stamp }).onConflictDoNothing();
  console.log("Production plan definitions and platform settings are ready. No academy or user data was created.");
}

main().catch((error) => { console.error(error instanceof Error ? error.message : "Production bootstrap failed."); process.exitCode = 1; }).finally(closeDatabase);
