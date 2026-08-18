# DarsFlow Repository Instructions

## Product

DarsFlow helps small Quran, Arabic, Islamic studies, and tutoring academies turn short teacher observations into parent updates, teacher handovers, structured progress records, and management alerts.

The initial product is a validation prototype. Use fictional academy and student data only.

## Current Scope

The validation prototype should demonstrate:

- teacher selection
- fictional student selection
- structured text-based class observation
- lesson coverage
- strengths
- improvement areas
- homework or revision
- parent-update output
- next-teacher handover output
- management-summary output

Do not implement the following unless a later task explicitly requests them:

- WhatsApp Business API integration
- automatic WhatsApp sending
- real student data
- payment processing
- class scheduling
- video classes
- parent accounts
- native mobile applications
- automatic Tajweed assessment
- full school-management functionality

## Planned Stack

The planned direction is:

- Next.js
- TypeScript
- Tailwind CSS
- Supabase for future authentication and PostgreSQL storage
- Vercel for deployment

Do not assume or invent package versions. Inspect the repository and verify official package information before adding dependencies.

## Working Rules

- Inspect relevant files before editing them.
- Keep every task within its stated scope.
- Do not modify unrelated files.
- Preserve existing user changes.
- Work in small, independently verifiable changes.
- Do not add placeholders, TODO stubs, pseudocode, or fake integrations.
- Do not present simulated behaviour as a working external integration.
- Ask when missing information would materially change the implementation.
- Do not commit, push, publish, deploy, or open a pull request unless explicitly instructed.
- Explain every new production dependency before adding it.
- Update README and `.env.example` whenever setup or configuration changes.
- Never store secrets, API keys, credentials, or real children’s personal data in the repository.

## Architecture

- Keep business logic separate from UI components, route handlers, AI providers, and persistence code.
- Use strict TypeScript.
- Do not allow untyped values across module boundaries.
- Validate all external input.
- Handle errors explicitly.
- Do not silently catch errors.
- Keep AI-provider code behind a replaceable service interface.
- Generated communication must remain a draft that a teacher reviews before sending.
- AI output must be grounded only in teacher-provided information.
- Do not invent student achievements, weaknesses, homework, attendance, or lesson details.

## Privacy and Safety

- Use fictional students during development and demonstrations.
- Use initials or fictional first names in sample data.
- Do not add unnecessary sensitive student fields.
- Treat lesson notes and progress records as private data.
- Require teacher review before any generated text is treated as final.
- Do not make autonomous educational, disciplinary, or safeguarding decisions.

## Interface Standards

- Build mobile-first because teachers may enter updates immediately after class.
- Keep the teacher-input workflow quick and uncomplicated.
- Use accessible labels, keyboard navigation, visible focus states, and sufficient colour contrast.
- Avoid generic AI imagery, excessive gradients, decorative dashboards, and unnecessary animation.
- Prefer a calm, trustworthy, professional educational design.
- Do not expose technical AI terminology to ordinary users unless necessary.

## Quality

- Add tests for core business logic and every bug fix.
- Run relevant linting, type checking, tests, and production builds before declaring a task complete.
- Review the final diff for accidental changes.
- Report which files changed and which verification commands ran.
- If a verification step cannot run, explain the exact reason.

## Git

- Use one branch per feature or coherent change.
- Use short branch names such as `feature/teacher-entry` or `fix/report-formatting`.
- Use imperative commit messages.
- Keep the repository working after every completed task.
- Never rewrite or discard unrelated history or user changes.

## Definition of Done

A task is complete only when:

- the requested behaviour exists
- scope restrictions were respected
- relevant tests were added or updated
- required checks pass
- documentation reflects setup changes
- the diff contains no unrelated modifications
- no secrets or real student information were introduced
