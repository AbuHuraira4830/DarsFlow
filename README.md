# DarsFlow

DarsFlow is an interactive validation prototype for small Quran, Arabic and Islamic studies academies. It turns one structured teacher observation into three deterministic drafts: a parent update, a private teacher handover, and a management summary.

The prototype includes conditional attendance handling, an approved fictional sample, form validation, copy controls, and reset behaviour. Every output remains a draft for human review.

## Technology

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Aria Components
- ESLint
- Vitest

## Prerequisite

Node.js 20.9 or newer.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Current exclusions

- No real student data
- No AI integration
- No database
- No authentication
- No WhatsApp integration
- No persistence or external sending

All academy, teacher, and student names displayed by the prototype are fictional demonstration data.
