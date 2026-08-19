import { describe, expect, it } from "vitest";
import {
  generateOutputs,
  sampleEntry,
  type TeacherEntry,
} from "./darsflow";

const entry = (changes: Partial<TeacherEntry> = {}): TeacherEntry => ({
  ...sampleEntry,
  ...changes,
});

describe("deterministic DarsFlow output generation", () => {
  it("generates all three outputs for a complete attended lesson", () => {
    const result = generateOutputs(entry());
    expect(result.parentUpdate).toContain("Qaida page 18, lines 3–5");
    expect(result.teacherHandover).toContain("Next lesson:");
    expect(result.managementSummary).toContain("Teacher review required: Yes");
  });

  it("omits blank optional fields", () => {
    const result = generateOutputs(
      entry({ needsPractice: "  ", homework: "", additionalNote: "" }),
    );
    expect(result.parentUpdate).not.toContain("practise");
    expect(result.parentUpdate).not.toContain("For revision:");
    expect(result.teacherHandover).not.toContain("Internal note:");
  });

  it("never exposes the additional teacher note to the parent", () => {
    const result = generateOutputs(entry());
    expect(result.parentUpdate).not.toContain(sampleEntry.additionalNote);
  });

  it("includes the additional teacher note in both internal outputs", () => {
    const result = generateOutputs(entry());
    expect(result.teacherHandover).toContain(sampleEntry.additionalNote);
    expect(result.managementSummary).toContain(sampleEntry.additionalNote);
  });

  it("does not invent progress for an absent student", () => {
    const result = generateOutputs(
      entry({
        attendance: "Absent",
        learningTrack: "",
        lessonReference: "",
        whatWentWell: "",
        nextLesson: "",
        engagement: "",
      }),
    );
    expect(result.parentUpdate).toContain("was absent");
    expect(result.parentUpdate).not.toContain("worked on");
    expect(result.teacherHandover).toContain("Lesson progress: Not recorded");
  });

  it("does not invent progress for an excused student", () => {
    const result = generateOutputs(
      entry({
        attendance: "Excused",
        learningTrack: "",
        lessonReference: "",
        whatWentWell: "",
        nextLesson: "",
        engagement: "",
      }),
    );
    expect(result.parentUpdate).toContain("had an excused absence");
    expect(result.managementSummary).toContain(
      "Progress summary: No lesson progress recorded",
    );
  });

  it("creates flags only from explicit current-session conditions", () => {
    const result = generateOutputs(
      entry({ attendance: "Late", engagement: "Frequently distracted" }),
    );
    expect(result.managementFlags).toEqual([
      "Student late",
      "Student frequently distracted",
      "Practice need recorded",
      "Next-lesson action recorded",
    ]);
  });

  it("uses the student first name naturally", () => {
    expect(generateOutputs(entry()).parentUpdate).toContain("Maryam worked on");
  });

  it("uses the required parent opening and review ending", () => {
    const output = generateOutputs(entry()).parentUpdate;
    expect(output.startsWith("Assalamu Alaikum")).toBe(true);
    expect(output.endsWith("Draft — please review before sending.")).toBe(true);
  });

  it("generates the approved sample's essential content", () => {
    const result = generateOutputs(sampleEntry);
    expect(result.parentUpdate).toContain("Distinguishing ث and ذ");
    expect(result.teacherHandover).toContain("Br. Yusuf");
    expect(result.managementSummary).toContain("18 August 2026");
    expect(result.managementSummary).toContain("Amanah Learning Academy");
  });
});
