import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as schema from "./schema";

const client = new PGlite();
const database = drizzle(client, { schema });
const stamp = "2026-01-01T00:00:00.000Z";

beforeAll(async () => { await migrate(database, { migrationsFolder: "./drizzle" }); });
afterAll(async () => { await client.close(); });

describe("PostgreSQL persistence", () => {
  it("migrates and persists a tenant-scoped teaching workflow", async () => {
    await database.transaction(async (tx) => {
      await tx.insert(schema.user).values({ id:"u1", name:"Fictional Owner", email:"owner@example.test", emailVerified:true, createdAt:new Date(stamp), updatedAt:new Date(stamp) });
      await tx.insert(schema.academies).values({ id:"a1", name:"Amanah Test", slug:"amanah-test", timezone:"UTC", tracks:["Qaida"], status:"trial", onboardingComplete:true, createdAt:stamp, updatedAt:stamp });
      await tx.insert(schema.memberships).values({ id:"m1", academyId:"a1", userId:"u1", role:"owner", active:true, createdAt:stamp, updatedAt:stamp });
      await tx.insert(schema.students).values({ id:"s1", academyId:"a1", displayName:"Maryam T.", learningTrack:"Qaida", createdAt:stamp, updatedAt:stamp });
      await tx.insert(schema.teacherStudents).values({ membershipId:"m1", studentId:"s1" });
      await tx.insert(schema.lessons).values({ id:"l1", academyId:"a1", teacherMembershipId:"m1", lessonDate:"2026-01-01", learningTrack:"Qaida", sourceVersion:1, status:"complete", idempotencyKey:"test-lesson", enteredLate:false, createdAt:stamp, updatedAt:stamp });
      await tx.insert(schema.generatedDrafts).values({ id:"d1", academyId:"a1", lessonId:"l1", studentId:"s1", kind:"parent", content:"Good progress.", generatedContent:"Good progress.", sourceVersion:1, status:"ready_for_review", createdAt:stamp, updatedAt:stamp });
      await tx.insert(schema.paymentRequests).values({ id:"p1", academyId:"a1", reference:"TEST-001", amountMinor:1000, currency:"PKR", paidAt:"2026-01-01", status:"pending", createdAt:stamp, updatedAt:stamp });
    });
    expect(await database.select().from(schema.lessons).where(eq(schema.lessons.academyId,"a1"))).toHaveLength(1);
    expect(await database.select().from(schema.teacherStudents).where(eq(schema.teacherStudents.membershipId,"m1"))).toHaveLength(1);
    expect(await database.select().from(schema.generatedDrafts)).toHaveLength(1);
  });

  it("rolls back every statement when a transaction fails", async () => {
    await expect(database.transaction(async (tx) => {
      await tx.insert(schema.academies).values({ id:"rollback", name:"Rollback", slug:"rollback", timezone:"UTC", tracks:[], status:"trial", onboardingComplete:false, createdAt:stamp, updatedAt:stamp });
      throw new Error("rollback requested");
    })).rejects.toThrow("rollback requested");
    expect(await database.select().from(schema.academies).where(eq(schema.academies.id,"rollback"))).toHaveLength(0);
  });
});
