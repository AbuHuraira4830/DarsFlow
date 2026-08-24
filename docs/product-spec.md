# DarsFlow Validation Prototype Specification

> Phase status: The validation prototype described below is complete and preserved as the public, fictional, no-storage demonstration. The approved Phase 2 scope is the multi-tenant academy SaaS MVP defined in Section 23.

## 1. Document Status

- Product: DarsFlow
- Stage: Validation prototype
- Initial market: Small online Quran, Arabic and Islamic studies academies
- Intended academy size: Approximately 20–200 active students
- Data policy: Fictional demonstration data only
- Status: Approved specification for the first interactive prototype

## 2. Product Purpose

DarsFlow helps an academy turn one short teacher observation into three useful records:

1. A polished parent update
2. A private handover note for the next teacher
3. A structured management summary

The prototype must demonstrate this transformation clearly without requiring authentication, a database, an AI API, WhatsApp integration or real student information.

## 3. Problem

Small academies frequently manage lessons through Zoom, WhatsApp and spreadsheets.

After each lesson, teachers may need to:

- tell parents what was covered
- explain what the student did well
- identify what requires practice
- assign revision or homework
- tell the next teacher where to continue
- give management visibility into attendance and progress

When these updates are written manually, reporting becomes inconsistent, repetitive and easy to postpone. Information can also be lost when different teachers teach the same student.

## 4. Initial Customer and Users

### Buyer

The initial buyer is an academy owner or administrator responsible for teaching quality, parent communication and student retention.

### Primary User

The primary user is a teacher entering an update immediately after a lesson.

### Information Recipient

The parent receives a reviewed, friendly progress update.

### Internal Recipient

The next teacher receives a concise handover note.

### Management Recipient

Academy management receives a structured summary for oversight.

The parent does not log into the validation prototype.

## 5. Prototype Objective

The prototype should allow a potential academy owner to understand the product’s central value within two minutes.

A user must be able to:

1. Select a fictional teacher.
2. Select a fictional student.
3. Record structured class information.
4. Generate all three draft outputs.
5. Review the outputs.
6. Copy an individual output.
7. Reset the prototype and try another example.

The transformation should feel immediate and credible.

## 6. Prototype Boundaries

The prototype is not a production school-management system.

It must not include:

- authentication
- user registration
- a parent portal
- a database
- cloud persistence
- real student data
- payment collection
- subscriptions
- class scheduling
- teacher payroll
- video classes
- automatic WhatsApp sending
- WhatsApp Business API integration
- an AI SDK
- an external AI API
- automatic Tajweed assessment
- audio analysis
- safeguarding decisions
- disciplinary decisions
- performance predictions
- invented student information

The generated outputs must be deterministic drafts based only on information entered or selected by the user.

## 7. Fictional Academy Data

Use the fictional academy name:

Amanah Learning Academy

Use these fictional teachers:

- Sr. Amina — Quran and Tajweed
- Br. Yusuf — Qaida and Quran Reading
- Sr. Mariam — Arabic
- Br. Hamza — Islamic Studies

Use these fictional students:

- Ahmed R. — Quran Reading
- Maryam K. — Qaida
- Zayd H. — Hifz
- Safiyyah N. — Arabic
- Ibrahim A. — Islamic Studies

All names must be visibly identified as fictional demonstration data.

## 8. Teacher Entry Form

### 8.1 Teacher

Required select field populated from the fictional teachers.

### 8.2 Student

Required select field populated from the fictional students.

### 8.3 Lesson Date

Required date field.

It must not depend on server-generated locale formatting. The selected value should be displayed consistently.

### 8.4 Attendance

Required selection:

- Attended
- Late
- Absent
- Excused

If attendance is Absent or Excused, lesson-progress fields should not be required.

### 8.5 Learning Track

Required selection when the student attended:

- Qaida
- Quran Reading
- Hifz
- Tajweed
- Arabic
- Islamic Studies

### 8.6 Lesson Reference

Required when the student attended.

Examples:

- Qaida page 18, lines 3–5
- Surah Al-Baqarah, ayat 21–25
- Juz 30, Surah An-Naba, ayat 1–10
- Arabic Book 1, Unit 3, page 27
- Seerah: The First Revelation

Maximum length: 160 characters.

### 8.7 What Went Well

Required when the student attended.

The teacher records one or more specific strengths or achievements from the lesson.

Maximum length: 400 characters.

### 8.8 Needs Practice

Optional.

The teacher records a specific skill, mistake or topic requiring further work.

Maximum length: 400 characters.

### 8.9 Homework or Revision

Optional.

The teacher records a clear practice activity for before the next lesson.

Maximum length: 300 characters.

### 8.10 Next-Lesson Starting Point

Required when the student attended.

This tells the next teacher exactly where or how to continue.

Maximum length: 300 characters.

### 8.11 Engagement

Required when the student attended:

- Excellent
- Good
- Needed encouragement
- Frequently distracted

This is an observation for the current lesson only, not a permanent judgement about the student.

### 8.12 Additional Teacher Note

Optional internal note.

This note may appear in the teacher handover and management summary but must never appear automatically in the parent update.

Maximum length: 400 characters.

## 9. Form Validation

Validation must:

- identify required fields clearly
- show errors beside the relevant fields
- preserve valid entered information when validation fails
- move keyboard focus to the first invalid field after submission
- prevent generation until required information is valid
- enforce maximum lengths
- show remaining or used character counts for longer text fields
- avoid errors based only on whitespace
- treat blank optional fields as absent information

Validation messages must use plain language.

Example:

“Enter what the student covered in this lesson.”

## 10. Generated Parent Update

The parent update is a draft requiring teacher review.

It should:

- begin with “Assalamu Alaikum”
- use the fictional student’s first name
- state what was covered
- acknowledge what went well
- mention practice needs constructively when provided
- include homework or revision when provided
- use warm, concise and respectful language
- avoid technical management language
- avoid the private additional teacher note
- avoid inventing facts
- omit empty optional sections
- end with a reminder that the message should be reviewed before sending

Example structure:

> Assalamu Alaikum. Ahmed worked on Qaida page 18, lines 3–5 today. MashaAllah, he recognised most letters confidently and remained engaged throughout the lesson. He needs some additional practice distinguishing ث and ذ. Please revise lines 3–5 before the next class.
>
> Draft — please review before sending.

For an absent student, the parent draft should state the attendance status without fabricating lesson progress.

## 11. Generated Teacher Handover

The handover is private and operational.

It should include:

- student
- teacher
- lesson date
- attendance
- learning track
- completed lesson reference
- demonstrated strength
- practice requirement
- assigned homework or revision
- next-lesson starting point
- engagement
- additional internal note when provided

The tone should be concise and factual.

It must not include motivational filler or information that the teacher did not enter.

## 12. Generated Management Summary

The management summary should provide a structured snapshot containing:

- academy
- student
- teacher
- lesson date
- attendance status
- learning track
- lesson reference
- progress summary
- engagement
- revision assigned
- next action
- whether teacher review is still required

The validation prototype must not claim to identify long-term patterns because it has no database or historical records.

Management alerts in the first prototype are limited to explicit current-session conditions:

- student absent
- student late
- engagement needed encouragement
- student frequently distracted
- practice need was recorded
- next-lesson action was recorded

These are visible flags, not automated educational decisions.

## 13. Output Review

After generation, display three separate output panels:

1. Parent Update
2. Teacher Handover
3. Management Summary

Each panel must:

- have a clear heading
- state its intended recipient
- indicate that it is a draft
- contain a Copy button
- provide visible copy-success feedback
- remain readable on a mobile screen
- not send information anywhere

The parent update should be the first and most visually prominent panel.

## 14. Reset Behaviour

A Reset Demo control should:

- clear all entered information
- clear all generated outputs
- clear validation errors
- return focus to the first form control
- restore the initial fictional-data state

Resetting must require confirmation if the form contains user-entered information.

## 15. Sample Demonstration

Provide one “Load Sample” action using:

- Teacher: Br. Yusuf
- Student: Maryam K.
- Lesson date: 2026-08-18
- Attendance: Attended
- Learning track: Qaida
- Lesson reference: Qaida page 18, lines 3–5
- What went well: Recognised most letters confidently and repeated the lines carefully.
- Needs practice: Distinguishing ث and ذ without prompting.
- Homework or revision: Revise page 18, lines 3–5 twice before the next lesson.
- Next-lesson starting point: Review ث and ذ, then continue from page 18, line 6.
- Engagement: Good
- Additional teacher note: Responded well when the letters were demonstrated slowly.

The sample must generate complete but concise versions of all three outputs.

## 16. Interface Structure

The first interactive prototype should contain:

1. Compact DarsFlow header
2. Prototype and fictional-data notice
3. Short explanation of the three-output workflow
4. Teacher entry form
5. Load Sample control
6. Generate Drafts control
7. Reset Demo control
8. Three generated-output panels
9. Privacy and teacher-review reminder

Do not create a dashboard, sidebar, pricing page, login page or multi-page application.

## 17. Responsive Behaviour

### Mobile

- Single-column layout
- Form controls use the available width
- Buttons remain easy to tap
- Output panels stack vertically
- No horizontal scrolling

### Desktop

- Form may use a restrained two-column arrangement for short fields
- Long text fields span the available form width
- Output panels may use multiple columns when space permits
- Reading order must remain logical

## 18. Accessibility

The prototype must:

- use semantic HTML
- associate every label with its form control
- support keyboard-only operation
- provide visible focus indicators
- use sufficient colour contrast
- not use colour as the only indicator
- announce validation and copy-success messages appropriately
- respect reduced-motion preferences
- avoid unnecessary animation
- maintain a logical heading hierarchy

## 19. Privacy and Trust

The interface must visibly state:

- All displayed names are fictional.
- No data is saved in this prototype.
- Nothing is sent to parents or teachers.
- Every generated output requires human review.

Do not describe the prototype as secure, compliant or encrypted without an implemented and verified basis.

## 20. Prototype Success Criteria

The prototype succeeds when a potential academy owner can:

- understand the problem being solved without explanation
- load the sample
- generate the three outputs
- see the difference between parent, teacher and management communication
- complete a manual example in approximately one minute
- copy each draft
- reset the experience
- understand that the outputs are drafts
- understand that the data is fictional and not saved

## 21. Implementation Acceptance Criteria

A future implementation task will be complete only when:

- the form implements every required field and rule in this specification
- attendance conditions work correctly
- the sample data loads correctly
- deterministic output generation uses only entered information
- optional empty sections are omitted
- the private teacher note never appears in the parent update
- all three outputs are generated
- copy controls work
- reset confirmation works
- keyboard operation works
- mobile layout works without horizontal overflow
- linting passes
- type checking passes
- automated tests cover the output-generation rules
- a production build passes
- no prohibited integration or real student data is introduced

## 22. Future Possibilities Not Approved for This Prototype

Possible later features include:

- teacher accounts
- academy administration
- student histories
- multilingual output
- AI-assisted drafting
- voice-note transcription
- WhatsApp Business integration
- parent delivery history
- recurring progress flags
- monthly reports
- branded PDF exports
- database storage
- billing

Their inclusion requires evidence from customer validation and separate approval.

## 23. Phase 2 — Multi-tenant Academy SaaS MVP

### 23.1 Product boundary

Phase 2 adds authenticated, persistent academy workspaces while preserving the original public demo. An academy is the tenant and paying customer. Academy-owned teachers, students, guardians, classes, lessons, drafts, shares, subscriptions, payments and audit events must carry an academy boundary enforced on the server.

Supported roles are platform administrator, academy owner, academy manager and teacher. One user may hold memberships in multiple academies. Parents and guardians initially receive reviewed updates through external compose/share actions and do not require accounts.

### 23.2 Academy lifecycle

Owners register with email and password, create an academy, choose timezone and teaching tracks, and begin a configurable trial. Owners and managers manage teachers, expiring invitations, students, guardians, one-to-one classes and small groups. Teachers are limited to assigned classes and students.

The local development database contains fictional demonstration seed records only. No predictable account password is seeded.

### 23.3 Lesson and communication lifecycle

Each student in a group class receives an individual attendance and progress record. Saved lesson facts generate distinct parent, teacher and management drafts. Private teacher notes never enter parent drafts. Drafts retain source-version awareness and must be reviewed before sharing.

WhatsApp, native share and email actions open an external compose surface. They do not prove delivery. Honest states are Draft, Reviewed, Share opened and Manually marked sent.

### 23.4 Subscription and platform operations

Plans and currency are configurable rather than hardcoded commercial decisions. Academy subscriptions track trial dates, status and student/teacher capacity. Manual payment references can be submitted for platform-admin review; no payment is charged automatically and no payment account details are invented.

Platform administration is restricted to explicitly configured administrator email addresses. No default administrator password may exist.

### 23.5 Technical and security requirements

The MVP uses maintained email/password authentication, securely hashed credentials, protected database-backed sessions, role checks, validated input, expiring single-use invitations, tenant-scoped queries, safe migrations and audit events. Local SQLite development requires no external account; production should migrate to managed PostgreSQL and durable storage before serving customer data.

This MVP does not claim regulatory certification, automatic WhatsApp/email delivery, payment-gateway processing, native mobile applications, video classes, calendar integration, automatic Tajweed assessment or autonomous educational decisions.
