export const ACADEMY_NAME = "Amanah Learning Academy";

export const teachers = [
  { id: "amina", name: "Sr. Amina", subject: "Quran and Tajweed" },
  { id: "yusuf", name: "Br. Yusuf", subject: "Qaida and Quran Reading" },
  { id: "mariam", name: "Sr. Mariam", subject: "Arabic" },
  { id: "hamza", name: "Br. Hamza", subject: "Islamic Studies" },
] as const;

export const students = [
  { id: "ahmed", name: "Ahmed R.", track: "Quran Reading" },
  { id: "maryam", name: "Maryam K.", track: "Qaida" },
  { id: "zayd", name: "Zayd H.", track: "Hifz" },
  { id: "safiyyah", name: "Safiyyah N.", track: "Arabic" },
  { id: "ibrahim", name: "Ibrahim A.", track: "Islamic Studies" },
] as const;

export const attendanceOptions = [
  "Attended",
  "Late",
  "Absent",
  "Excused",
] as const;

export const learningTracks = [
  "Qaida",
  "Quran Reading",
  "Hifz",
  "Tajweed",
  "Arabic",
  "Islamic Studies",
] as const;

export const engagementOptions = [
  "Excellent",
  "Good",
  "Needed encouragement",
  "Frequently distracted",
] as const;

export type Attendance = (typeof attendanceOptions)[number];
export type LearningTrack = (typeof learningTracks)[number];
export type Engagement = (typeof engagementOptions)[number];

export interface TeacherEntry {
  teacherId: string;
  studentId: string;
  lessonDate: string;
  attendance: Attendance | "";
  learningTrack: LearningTrack | "";
  lessonReference: string;
  whatWentWell: string;
  needsPractice: string;
  homework: string;
  nextLesson: string;
  engagement: Engagement | "";
  additionalNote: string;
}

export type FormField = keyof TeacherEntry;
export type ValidationErrors = Partial<Record<FormField, string>>;

export interface GeneratedOutputs {
  parentUpdate: string;
  teacherHandover: string;
  managementSummary: string;
  managementFlags: string[];
}

export const emptyEntry: TeacherEntry = {
  teacherId: "",
  studentId: "",
  lessonDate: "",
  attendance: "",
  learningTrack: "",
  lessonReference: "",
  whatWentWell: "",
  needsPractice: "",
  homework: "",
  nextLesson: "",
  engagement: "",
  additionalNote: "",
};

export const sampleEntry: TeacherEntry = {
  teacherId: "yusuf",
  studentId: "maryam",
  lessonDate: "2026-08-18",
  attendance: "Attended",
  learningTrack: "Qaida",
  lessonReference: "Qaida page 18, lines 3–5",
  whatWentWell:
    "Recognised most letters confidently and repeated the lines carefully.",
  needsPractice: "Distinguishing ث and ذ without prompting.",
  homework: "Revise page 18, lines 3–5 twice before the next lesson.",
  nextLesson: "Review ث and ذ, then continue from page 18, line 6.",
  engagement: "Good",
  additionalNote:
    "Responded well when the letters were demonstrated slowly.",
};

export const fieldLimits = {
  lessonReference: 160,
  whatWentWell: 400,
  needsPractice: 400,
  homework: 300,
  nextLesson: 300,
  additionalNote: 400,
} as const;

export function hasLessonProgress(attendance: TeacherEntry["attendance"]): boolean {
  return attendance === "Attended" || attendance === "Late";
}

export function validateEntry(entry: TeacherEntry): ValidationErrors {
  const errors: ValidationErrors = {};
  const required = (field: FormField, message: string) => {
    if (String(entry[field]).trim() === "") errors[field] = message;
  };

  required("teacherId", "Choose a fictional teacher.");
  required("studentId", "Choose a fictional student.");
  required("lessonDate", "Choose the lesson date.");
  required("attendance", "Choose the attendance status.");

  if (hasLessonProgress(entry.attendance)) {
    required("learningTrack", "Choose the learning track.");
    required("lessonReference", "Enter what the student covered in this lesson.");
    required("whatWentWell", "Enter what went well in this lesson.");
    required("nextLesson", "Enter where the next teacher should continue.");
    required("engagement", "Choose the student’s engagement for this lesson.");
  }

  for (const [field, limit] of Object.entries(fieldLimits) as [
    keyof typeof fieldLimits,
    number,
  ][]) {
    if (entry[field].length > limit) {
      errors[field] = `Keep this response to ${limit} characters or fewer.`;
    }
  }

  return errors;
}

export function formatLessonDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[Number(match[2]) - 1];
  return month ? `${Number(match[3])} ${month} ${match[1]}` : value;
}

function clean(value: string): string {
  return value.trim();
}

function firstName(fullName: string): string {
  return fullName.split(/\s+/)[0] ?? fullName;
}

function findTeacher(id: string) {
  const teacher = teachers.find((item) => item.id === id);
  if (!teacher) throw new Error("A valid fictional teacher is required.");
  return teacher;
}

function findStudent(id: string) {
  const student = students.find((item) => item.id === id);
  if (!student) throw new Error("A valid fictional student is required.");
  return student;
}

function generateFlags(entry: TeacherEntry): string[] {
  const flags: string[] = [];
  if (entry.attendance === "Absent") flags.push("Student absent");
  if (entry.attendance === "Late") flags.push("Student late");
  if (entry.engagement === "Needed encouragement") {
    flags.push("Engagement needed encouragement");
  }
  if (entry.engagement === "Frequently distracted") {
    flags.push("Student frequently distracted");
  }
  if (clean(entry.needsPractice)) flags.push("Practice need recorded");
  if (clean(entry.nextLesson)) flags.push("Next-lesson action recorded");
  return flags;
}

export function generateOutputs(entry: TeacherEntry): GeneratedOutputs {
  const errors = validateEntry(entry);
  if (Object.keys(errors).length > 0) {
    throw new Error("Cannot generate drafts from invalid lesson information.");
  }

  const teacher = findTeacher(entry.teacherId);
  const student = findStudent(entry.studentId);
  const studentFirstName = firstName(student.name);
  const date = formatLessonDate(entry.lessonDate);
  const progressApplies = hasLessonProgress(entry.attendance);
  const attendance = entry.attendance as Attendance;

  let parentBody: string;
  if (!progressApplies) {
    const attendanceText =
      attendance === "Excused" ? "had an excused absence" : "was absent";
    parentBody = `${studentFirstName} ${attendanceText} on ${date}. No lesson progress has been recorded for this session.`;
  } else {
    const parts = [
      attendance === "Late" ? `${studentFirstName} arrived late.` : "",
      `${studentFirstName} worked on ${clean(entry.lessonReference)} on ${date}.`,
      `MashaAllah, ${clean(entry.whatWentWell)}`,
      clean(entry.needsPractice)
        ? `A helpful area to practise is ${clean(entry.needsPractice)}`
        : "",
      clean(entry.homework) ? `For revision: ${clean(entry.homework)}` : "",
    ];
    parentBody = parts.filter(Boolean).join(" ");
  }

  const parentUpdate = `Assalamu Alaikum. ${parentBody}\n\nDraft — please review before sending.`;

  const handoverLines = [
    `Student: ${student.name}`,
    `Teacher: ${teacher.name} — ${teacher.subject}`,
    `Lesson date: ${date}`,
    `Attendance: ${attendance}`,
  ];
  if (progressApplies) {
    handoverLines.push(
      `Learning track: ${entry.learningTrack}`,
      `Completed: ${clean(entry.lessonReference)}`,
      `Strength: ${clean(entry.whatWentWell)}`,
    );
    if (clean(entry.needsPractice)) {
      handoverLines.push(`Needs practice: ${clean(entry.needsPractice)}`);
    }
    if (clean(entry.homework)) {
      handoverLines.push(`Homework or revision: ${clean(entry.homework)}`);
    }
    handoverLines.push(
      `Next lesson: ${clean(entry.nextLesson)}`,
      `Engagement: ${entry.engagement}`,
    );
  } else {
    handoverLines.push("Lesson progress: Not recorded for this attendance status");
  }
  if (clean(entry.additionalNote)) {
    handoverLines.push(`Internal note: ${clean(entry.additionalNote)}`);
  }

  const managementFlags = generateFlags({
    ...entry,
    needsPractice: progressApplies ? entry.needsPractice : "",
    nextLesson: progressApplies ? entry.nextLesson : "",
    engagement: progressApplies ? entry.engagement : "",
  });
  const managementLines = [
    `Academy: ${ACADEMY_NAME}`,
    `Student: ${student.name}`,
    `Teacher: ${teacher.name}`,
    `Lesson date: ${date}`,
    `Attendance: ${attendance}`,
  ];
  if (progressApplies) {
    managementLines.push(
      `Learning track: ${entry.learningTrack}`,
      `Lesson reference: ${clean(entry.lessonReference)}`,
      `Progress: ${clean(entry.whatWentWell)}`,
      `Engagement: ${entry.engagement}`,
    );
    if (clean(entry.needsPractice)) {
      managementLines.push(`Practice need: ${clean(entry.needsPractice)}`);
    }
    if (clean(entry.homework)) {
      managementLines.push(`Revision assigned: ${clean(entry.homework)}`);
    }
    managementLines.push(`Next action: ${clean(entry.nextLesson)}`);
  } else {
    managementLines.push("Progress summary: No lesson progress recorded");
  }
  if (clean(entry.additionalNote)) {
    managementLines.push(`Internal note: ${clean(entry.additionalNote)}`);
  }
  managementLines.push(
    `Current-session flags: ${managementFlags.length ? managementFlags.join("; ") : "None"}`,
    "Teacher review required: Yes",
  );

  return {
    parentUpdate,
    teacherHandover: handoverLines.join("\n"),
    managementSummary: managementLines.join("\n"),
    managementFlags,
  };
}
