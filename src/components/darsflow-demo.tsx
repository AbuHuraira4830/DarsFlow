"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { DarsFlowLogo } from "@/components/darsflow-logo";
import { ProductDatePicker, ProductSelect, type ProductOption } from "@/components/form-controls";
import {
  ACADEMY_NAME,
  attendanceOptions,
  emptyEntry,
  engagementOptions,
  fieldLimits,
  generateOutputs,
  hasLessonProgress,
  learningTracks,
  sampleEntry,
  students,
  teachers,
  validateEntry,
  type FormField,
  type GeneratedOutputs,
  type TeacherEntry,
  type ValidationErrors,
} from "@/lib/darsflow";

const fieldOrder: FormField[] = [
  "teacherId", "studentId", "lessonDate", "attendance", "learningTrack",
  "lessonReference", "whatWentWell", "needsPractice", "homework",
  "nextLesson", "engagement", "additionalNote",
];

const inputClass =
  "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-[0.9375rem] text-slate-950 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 aria-invalid:border-rose-600 aria-invalid:bg-rose-50/40 aria-invalid:ring-rose-600/10";
const labelClass = "block text-[0.8125rem] font-bold text-slate-700";
const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,118,110,0.2)] transition hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-[0_10px_25px_rgba(15,118,110,0.25)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal-600 active:translate-y-0 active:bg-teal-900";
const secondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-teal-600 hover:text-teal-800 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal-600";

type CopyState = Record<"parentUpdate" | "teacherHandover" | "managementSummary", string>;
const emptyCopyState: CopyState = { parentUpdate: "", teacherHandover: "", managementSummary: "" };

export function DarsFlowDemo() {
  const [entry, setEntry] = useState<TeacherEntry>(emptyEntry);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [outputs, setOutputs] = useState<GeneratedOutputs | null>(null);
  const [copyState, setCopyState] = useState<CopyState>(emptyCopyState);
  const [announcement, setAnnouncement] = useState("");
  const [activeOutput, setActiveOutput] = useState<keyof CopyState>("parentUpdate");
  const outputRef = useRef<HTMLElement>(null);

  const progressApplies = hasLessonProgress(entry.attendance);
  const hasEnteredInformation = Object.values(entry).some((value) => String(value).trim() !== "");

  const focusField = (field: FormField) => document.getElementById(field)?.focus();
  const moveToDemo = (focus: FormField = "teacherId") => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => focusField(focus), 350);
  };

  const clearDrafts = (message = "") => {
    setOutputs(null);
    setCopyState(emptyCopyState);
    setAnnouncement(message);
  };

  const updateField = (field: FormField, value: string) => {
    setEntry((current) => ({ ...current, [field]: value }) as TeacherEntry);
    setErrors((current) => ({ ...current, [field]: undefined }));
    clearDrafts(outputs ? "Drafts cleared because the lesson information changed." : "");
  };

  const updateEntry = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(event.target.name as FormField, event.target.value);
  };

  const handleAttendance = (value: string) => {
    const attendance = value as TeacherEntry["attendance"];
    const attended = hasLessonProgress(attendance);
    setEntry((current) => ({
      ...current,
      attendance,
      ...(attended ? {} : {
        learningTrack: "", lessonReference: "", whatWentWell: "", needsPractice: "",
        homework: "", nextLesson: "", engagement: "",
      }),
    }));
    setErrors({});
    clearDrafts(attended
      ? "Lesson progress fields are available."
      : "Progress fields were cleared and are not required for this attendance status.");
  };

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateEntry(entry);
    setErrors(nextErrors);
    setCopyState(emptyCopyState);
    const firstInvalid = fieldOrder.find((field) => nextErrors[field]);

    if (firstInvalid) {
      setOutputs(null);
      const count = Object.keys(nextErrors).length;
      setAnnouncement(`Drafts not generated. Correct ${count} form ${count === 1 ? "error" : "errors"}.`);
      requestAnimationFrame(() => focusField(firstInvalid));
      return;
    }

    setOutputs(generateOutputs(entry));
    setActiveOutput("parentUpdate");
    setAnnouncement("Three drafts generated. Review each before use.");
    requestAnimationFrame(() => outputRef.current?.focus());
  };

  const handleLoadSample = (scroll = false) => {
    setEntry(sampleEntry);
    setErrors({});
    clearDrafts("Approved fictional sample loaded. Drafts have not been generated.");
    if (scroll) moveToDemo("lessonReference");
    else requestAnimationFrame(() => focusField("lessonReference"));
  };

  const handleReset = () => {
    if (hasEnteredInformation && !window.confirm("Clear the form and all generated drafts?")) return;
    setEntry(emptyEntry);
    setErrors({});
    clearDrafts("Demo reset. No information has been saved.");
    requestAnimationFrame(() => focusField("teacherId"));
  };

  const handleCopy = async (key: keyof CopyState, label: string) => {
    if (!outputs) return;
    try {
      await navigator.clipboard.writeText(outputs[key]);
      setCopyState((current) => ({ ...current, [key]: `${label} copied.` }));
    } catch {
      setCopyState((current) => ({
        ...current,
        [key]: `Could not copy ${label.toLowerCase()}. Select the text and copy it manually.`,
      }));
    }
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f7faf9] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <a href="#top" className="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-teal-600">
            <DarsFlowLogo />
          </a>
          <button type="button" onClick={() => moveToDemo()} className={`${primaryButton} min-h-9 px-3.5 py-2 text-xs sm:min-h-10 sm:px-4 sm:text-sm`}>
            Try the demo <ArrowIcon />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="relative isolate overflow-hidden border-b border-slate-200 bg-[#f9fbfa]">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(20,184,166,0.13),transparent_30%),radial-gradient(circle_at_10%_95%,rgba(214,169,54,0.09),transparent_22%)]" />
          <div className="mx-auto grid w-full max-w-[1440px] items-center gap-9 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1.02fr_0.98fr] lg:px-12 lg:py-14">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-teal-800 shadow-sm">
                <span className="size-1.5 rounded-full bg-teal-500" /> Interactive validation prototype
              </span>
              <h1 className="mt-5 max-w-3xl text-[2.55rem] font-semibold leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-[3.4rem] lg:text-[3.75rem]">
                Finish every class with the right update ready.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Turn a teacher’s lesson observation into a parent update, next-teacher handover and management summary—ready to review in one calm workspace.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => handleLoadSample(true)} className={primaryButton}>
                  Try the approved example <ArrowIcon />
                </button>
                <button type="button" onClick={() => moveToDemo()} className={secondaryButton}>
                  Open blank workspace
                </button>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                <ShieldIcon /> Fictional data only · nothing is saved or sent
              </p>
            </div>
            <FlowVisual />
          </div>
        </section>

        <section aria-label="Prototype assurances" className="border-b border-slate-200 bg-white">
          <p className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-3 text-xs font-semibold text-slate-500 sm:px-8 lg:px-12">
            <span>No data saved</span><span aria-hidden="true" className="text-teal-300">•</span><span>Human review required</span><span aria-hidden="true" className="text-teal-300">•</span><span>Fictional demonstration records</span>
          </p>
        </section>

        <section id="demo" aria-labelledby="demo-title" className="scroll-mt-20 py-10 sm:py-14 lg:py-16">
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="text-sm font-bold text-teal-700">Live product workspace</p>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[0.6875rem] font-bold text-amber-900">Fictional demo academy</span>
                </div>
                <h2 id="demo-title" className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">Prepare the lesson record</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Workspace: <strong className="text-slate-800">{ACADEMY_NAME}</strong>. No entry is stored or transmitted.</p>
              </div>
              <button type="button" onClick={() => handleLoadSample()} className={secondaryButton}>
                <SparkIcon /> Load approved sample
              </button>
            </div>

            <div className="grid items-start overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.09)] lg:grid-cols-[minmax(0,0.92fr)_minmax(400px,1.08fr)]">
              <EntryForm
                entry={entry}
                errors={errors}
                progressApplies={progressApplies}
                onChange={updateEntry}
                onFieldChange={updateField}
                onAttendance={handleAttendance}
                onSubmit={handleGenerate}
                onReset={handleReset}
              />
              <OutputWorkspace
                outputs={outputs}
                copyState={copyState}
                outputRef={outputRef}
                onCopy={handleCopy}
                activeOutput={activeOutput}
                onOutputChange={setActiveOutput}
              />
            </div>
          </div>
        </section>

        <section id="workflow" className="scroll-mt-20 border-y border-teal-100 bg-[#edf7f4] py-8 text-slate-900">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
            <div><p className="text-sm font-bold text-teal-700">A lighter reporting rhythm</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Capture once. Prepare clearly. Review always.</h2></div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">The teacher’s observation stays at the centre, while each draft is shaped for the person who needs it.</p>
          </div>
        </section>
      </main>

      <footer id="privacy" className="scroll-mt-20 border-t border-teal-100 bg-[#f8f5ec] text-slate-600">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-12">
          <div>
            <DarsFlowLogo />
            <p className="mt-4 max-w-2xl text-sm leading-6">A validation prototype for clearer academy communication. All names are fictional, nothing is saved or sent, and every draft requires human review.</p>
          </div>
          <p className="rounded-full border border-teal-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm">No AI · No database · No external sending</p>
        </div>
      </footer>
      <p className="sr-only" aria-live="assertive" aria-atomic="true">{announcement}</p>
    </div>
  );
}

interface EntryFormProps {
  entry: TeacherEntry;
  errors: ValidationErrors;
  progressApplies: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFieldChange: (field: FormField, value: string) => void;
  onAttendance: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

function EntryForm({ entry, errors, progressApplies, onChange, onFieldChange, onAttendance, onSubmit, onReset }: EntryFormProps) {
  return (
    <div className="min-w-0 border-b border-slate-200 lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Teacher entry</p>
          <h3 className="mt-1 text-lg font-bold text-slate-950">Current lesson</h3>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><span className="size-2 rounded-full bg-amber-400" /> Unsaved</span>
      </div>
      <form onSubmit={onSubmit} noValidate className="p-5 sm:p-7">
        {Object.keys(errors).length > 0 && (
          <div role="alert" className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            <p className="font-bold">A few details need attention.</p>
            <p className="mt-0.5 text-xs">Your other entries are still here.</p>
          </div>
        )}

        <FormSection number="1" title="People and attendance" description="Choose the lesson participants and session status.">
          <div className="grid gap-5 sm:grid-cols-2">
            <ProductSelect id="teacherId" label="Teacher" placeholder="Choose teacher" value={entry.teacherId} error={errors.teacherId} onChange={(value) => onFieldChange("teacherId", value)} required options={teachers.map((teacher) => ({ value: teacher.id, label: `${teacher.name} — ${teacher.subject}` }))} />
            <ProductSelect id="studentId" label="Student" placeholder="Choose student" value={entry.studentId} error={errors.studentId} onChange={(value) => onFieldChange("studentId", value)} required options={students.map((student) => ({ value: student.id, label: `${student.name} — ${student.track}` }))} />
            <ProductDatePicker id="lessonDate" label="Lesson date" value={entry.lessonDate} error={errors.lessonDate} onChange={(value) => onFieldChange("lessonDate", value)} required />
            <ProductSelect id="attendance" label="Attendance" placeholder="Choose attendance" value={entry.attendance} error={errors.attendance} onChange={onAttendance} required help="Absent and Excused need no progress details." options={attendanceOptions.map(toOption)} />
          </div>
        </FormSection>

        {!progressApplies && entry.attendance && (
          <div className="my-6 flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-950">
            <InfoIcon />
            <p><strong>Attendance-only record.</strong> Progress fields are hidden because no lesson work should be inferred for this session.</p>
          </div>
        )}

        {progressApplies && (
          <>
          <FormSection number="2" title="Lesson covered" description="Record the track and exact learning point.">
            <div className="grid gap-5 sm:grid-cols-2">
              <ProductSelect id="learningTrack" label="Learning track" placeholder="Choose track" value={entry.learningTrack} error={errors.learningTrack} onChange={(value) => onFieldChange("learningTrack", value)} required options={learningTracks.map(toOption)} />
              <TextAreaField field="lessonReference" label="Lesson reference" required value={entry.lessonReference} limit={fieldLimits.lessonReference} rows={2} error={errors.lessonReference} onChange={onChange} placeholder="Qaida page 18, lines 3–5" fullWidth />
            </div>
          </FormSection>
          <FormSection number="3" title="Progress and practice" description="Describe this session without making a permanent judgement.">
            <div className="grid gap-5 sm:grid-cols-2">
              <ProductSelect id="engagement" label="Engagement" placeholder="Choose engagement" value={entry.engagement} error={errors.engagement} onChange={(value) => onFieldChange("engagement", value)} required help="This lesson only—not a permanent judgement." options={engagementOptions.map(toOption)} />
              <TextAreaField field="whatWentWell" label="What went well" required value={entry.whatWentWell} limit={fieldLimits.whatWentWell} rows={3} error={errors.whatWentWell} onChange={onChange} fullWidth />
              <TextAreaField field="needsPractice" label="Needs practice" value={entry.needsPractice} limit={fieldLimits.needsPractice} rows={3} error={errors.needsPractice} onChange={onChange} />
              <TextAreaField field="homework" label="Homework or revision" value={entry.homework} limit={fieldLimits.homework} rows={3} error={errors.homework} onChange={onChange} />
            </div>
          </FormSection>
          </>
        )}

        <FormSection number={progressApplies ? "4" : "2"} title="Next lesson and internal note" description="Set the handover point; private context never enters the parent update.">
          <div className="grid gap-5 sm:grid-cols-2">
            {progressApplies && <TextAreaField field="nextLesson" label="Next-lesson starting point" required value={entry.nextLesson} limit={fieldLimits.nextLesson} rows={3} error={errors.nextLesson} onChange={onChange} />}
            <TextAreaField field="additionalNote" label="Additional teacher note" value={entry.additionalNote} limit={fieldLimits.additionalNote} rows={3} error={errors.additionalNote} onChange={onChange} />
          </div>
        </FormSection>

        <div className="sticky bottom-0 -mx-5 -mb-5 mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:-mx-7 sm:-mb-7 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <button type="button" onClick={onReset} className="min-h-11 rounded-xl px-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-rose-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-600">Reset demo</button>
          <button type="submit" className={`${primaryButton} sm:min-w-44`}>Generate drafts <ArrowIcon /></button>
        </div>
      </form>
    </div>
  );
}

interface OutputWorkspaceProps {
  outputs: GeneratedOutputs | null;
  copyState: CopyState;
  outputRef: React.RefObject<HTMLElement | null>;
  onCopy: (key: keyof CopyState, label: string) => Promise<void>;
  activeOutput: keyof CopyState;
  onOutputChange: (key: keyof CopyState) => void;
}

const outputDetails: Record<keyof CopyState, { title: string; recipient: string; kind: "parent" | "teacher" | "management" }> = {
  parentUpdate: { title: "Parent update", recipient: "Warm and family-facing", kind: "parent" },
  teacherHandover: { title: "Teacher handover", recipient: "Private and operational", kind: "teacher" },
  managementSummary: { title: "Management summary", recipient: "Structured for oversight", kind: "management" },
};

function OutputWorkspace({ outputs, copyState, outputRef, onCopy, activeOutput, onOutputChange }: OutputWorkspaceProps) {
  const current = outputDetails[activeOutput];
  return (
    <section ref={outputRef} tabIndex={-1} aria-labelledby="drafts-title" className="min-w-0 bg-[#f4f8f7] outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-teal-600/20 lg:sticky lg:top-16">
      <div className="flex items-center justify-between border-b border-slate-200 bg-[#edf4f2] px-5 py-4 sm:px-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Review workspace</p>
          <h3 id="drafts-title" className="mt-1 text-lg font-bold text-slate-950">Prepared drafts</h3>
        </div>
        <span className={`text-xs font-bold ${outputs ? "text-teal-800" : "text-slate-500"}`}>{outputs ? "Draft · review required" : "Waiting for lesson details"}</span>
      </div>
      <div className="p-4 sm:p-6">
        <div role="tablist" aria-label="Draft audience" className="grid grid-cols-3 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {(Object.keys(outputDetails) as (keyof CopyState)[]).map((key) => (
            <button key={key} type="button" role="tab" aria-selected={activeOutput === key} aria-controls="active-draft" onClick={() => onOutputChange(key)} className={`min-h-10 rounded-lg px-2 text-xs font-bold outline-none transition sm:text-sm ${activeOutput === key ? "bg-teal-700 text-white shadow-sm" : "text-slate-600 hover:bg-teal-50 hover:text-teal-800"} focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2`}>
              {outputDetails[key].title.replace(" update", "").replace(" handover", "").replace(" summary", "")}
            </button>
          ))}
        </div>
        <OutputPanel
          kind={current.kind}
          title={current.title}
          recipient={current.recipient}
          output={outputs?.[activeOutput] as string | undefined}
          feedback={copyState[activeOutput]}
          onCopy={() => onCopy(activeOutput, current.title)}
          flags={activeOutput === "managementSummary" ? outputs?.managementFlags : undefined}
        />
        <p className="flex items-start gap-2 px-1 text-xs leading-5 text-slate-500"><ShieldIcon /> Drafts stay in this session and are never sent automatically.</p>
      </div>
    </section>
  );
}

function OutputPanel({ kind, title, recipient, output, feedback, onCopy, flags }: {
  kind: "parent" | "teacher" | "management";
  title: string;
  recipient: string;
  output?: string;
  feedback: string;
  onCopy: () => void;
  flags?: string[];
}) {
  const styles = {
    parent: "border-emerald-200 border-t-4 border-t-emerald-500",
    teacher: "border-sky-200 border-t-4 border-t-sky-400",
    management: "border-amber-200 border-t-4 border-t-amber-400",
  }[kind];

  return (
    <article id="active-draft" role="tabpanel" className={`my-4 min-h-80 overflow-hidden rounded-2xl border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] ${styles}`}>
      <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
        <div className="min-w-0">
          <div>
            <div className="flex flex-wrap items-center gap-2"><h4 className="font-bold text-slate-950">{title}</h4></div>
            <p className="mt-0.5 text-xs text-slate-500">{recipient}</p>
          </div>
        </div>
        {output && <button type="button" onClick={onCopy} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:border-teal-600 hover:text-teal-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-600"><CopyIcon /> Copy</button>}
      </div>
      {output ? (
        <div className="border-t border-slate-200/70 px-4 py-4 sm:px-5">
          {flags && flags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5" aria-label="Current-session flags">
              {flags.map((flag) => <span key={flag} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[0.6875rem] font-bold text-amber-900">{flag}</span>)}
            </div>
          )}
          <pre className="whitespace-pre-wrap break-words font-sans text-[0.8125rem] leading-6 text-slate-700">{output}</pre>
          <p className={`mt-3 min-h-5 text-xs font-bold ${feedback.startsWith("Could not") ? "text-rose-700" : "text-teal-700"}`} aria-live="polite">{feedback}</p>
        </div>
      ) : (
        <div className="border-t border-slate-100 px-4 py-10 text-center sm:px-8">
          <p className="font-semibold text-slate-700">Your {title.toLowerCase()} will appear here.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Choose the lesson details, record what happened, then generate and review the draft.</p>
        </div>
      )}
    </article>
  );
}

function FormSection({ number, title, description, children }: { number: string; title: string; description: string; children: ReactNode }) {
  return (
    <fieldset className="mt-7 first:mt-0">
      <legend className="w-full">
        <span className="flex items-center gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-teal-700 text-xs font-bold text-white shadow-sm">{number}</span>
          <span>
            <span className="block text-sm font-bold text-slate-950">{title}</span>
            <span className="mt-0.5 block text-xs font-normal text-slate-500">{description}</span>
          </span>
        </span>
      </legend>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

const toOption = (label: string): ProductOption => ({ value: label, label });

function FieldLabel({ htmlFor, label, required = false }: { htmlFor: string; label: string; required?: boolean }) {
  return <label htmlFor={htmlFor} className={labelClass}>{label} <span className={required ? "text-rose-700" : "font-medium text-slate-400"}>{required ? "*" : "Optional"}</span></label>;
}

function TextAreaField({ field, label, required = false, value, limit, rows, error, onChange, placeholder, fullWidth = false }: {
  field: keyof typeof fieldLimits;
  label: string;
  required?: boolean;
  value: string;
  limit: number;
  rows: number;
  error?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  fullWidth?: boolean;
}) {
  const errorId = `${field}-error`;
  const countId = `${field}-count`;
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <div className="flex items-end justify-between gap-3">
        <FieldLabel htmlFor={field} label={label} required={required} />
        <span className={`text-[0.6875rem] font-medium ${value.length > limit * 0.9 ? "text-amber-700" : "text-slate-400"}`} aria-live="polite">{value.length}/{limit}</span>
      </div>
      <textarea id={field} name={field} value={value} maxLength={limit} rows={rows} placeholder={placeholder} onChange={onChange} aria-invalid={Boolean(error)} aria-describedby={`${countId}${error ? ` ${errorId}` : ""}`} className={`${inputClass} resize-y`} />
      <span id={countId} className="sr-only">Maximum {limit} characters.</span>
      <ErrorMessage id={errorId} message={error} />
    </div>
  );
}

function ErrorMessage({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="mt-1.5 text-xs font-bold text-rose-700">{message}</p> : null;
}

function FlowVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:mr-0" aria-label="Preview of the DarsFlow lesson workspace">
      <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.13)]">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-xs font-bold text-slate-700">Current lesson · Maryam</span>
          <span className="text-[0.6875rem] font-semibold text-teal-700">Unsaved</span>
        </div>
        <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-slate-200 p-4 sm:border-r sm:border-b-0">
            <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-teal-700">Teacher observation</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">Recognised most letters confidently and repeated the lines carefully.</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[0.6875rem]"><span className="rounded-lg bg-teal-50 p-2 text-teal-900">Qaida · page 18</span><span className="rounded-lg bg-slate-50 p-2 text-slate-600">Engaged</span></div>
          </div>
          <div className="bg-[#f4f8f7] p-4">
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 text-[0.625rem] font-bold"><span className="flex-1 rounded-md bg-teal-700 px-2 py-1.5 text-center text-white">Parent</span><span className="flex-1 px-2 py-1.5 text-center text-slate-500">Teacher</span><span className="flex-1 px-2 py-1.5 text-center text-slate-500">Management</span></div>
            <div className="mt-3 rounded-xl border border-emerald-200 border-t-4 border-t-emerald-500 bg-white p-3 text-xs leading-5 text-slate-600">Assalamu alaikum. Maryam worked carefully through today’s Qaida lesson…</div>
            <p className="mt-3 flex items-center gap-1.5 text-[0.6875rem] font-semibold text-slate-500"><ReviewIcon /> Draft · review before use</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const BaseIcon = ({ children }: { children: ReactNode }) => <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4">{children}</svg>;
const ArrowIcon = () => <BaseIcon><path d="M5 12h14M14 7l5 5-5 5" /></BaseIcon>;
const ShieldIcon = () => <BaseIcon><path d="M12 3 5 6v5c0 4.7 2.8 8.1 7 10 4.2-1.9 7-5.3 7-10V6z" /><path d="m9 12 2 2 4-4" /></BaseIcon>;
const ReviewIcon = () => <BaseIcon><path d="M4 4h16v16H4z" /><path d="m8 12 2.5 2.5L16 9" /></BaseIcon>;
const CopyIcon = () => <BaseIcon><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></BaseIcon>;
const SparkIcon = () => <BaseIcon><path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3zM18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z" /></BaseIcon>;
const InfoIcon = () => <BaseIcon><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></BaseIcon>;
