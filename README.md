# StudyHub: NIT Raipur exam-prep resources

Responsive React site: **Department → Semester (1–8) → Subject → Units**.
Each expandable unit shows exactly three sections (Syllabus, Notes, YouTube), side-by-side on desktop (≥900px) and stacked on mobile. No backend or database.

## Setup
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in /dist (static hosting)
npm run preview
```
Requires Node 18+.

## Folder structure
```
studyhub/
├── html/index.html            # HTML entry (Vite root)
├── css/styles.css             # all styling
├── js/utils.js                # vanilla JS helpers (debounce, URL check)
├── react/                     # main application
│   ├── main.jsx, App.jsx      # entry + hash-based routing/views
│   ├── components/            # Header, DepartmentGrid, SemesterPicker, SubjectList,
│   │                          # SubjectDetail, UnitAccordion, ResourceSection, SearchResults, States
│   ├── hooks/                 # useRoute, useCurriculum (async load -> loading state)
│   └── data/
│       ├── departments.js     # 9 departments, semesters 1-8
│       └── curriculum.js      # <- ALL subjects/units/resources go here
├── vite.config.js, package.json
```

## Data
All content is in `react/data/json/<dept>/semester-<n>.json` (72 files) with sources in `react/data/json/sources.json`.
**Read `DATA_COMPLETION_REPORT.md` first.** It lists, for all 72 department-semesters, what is verified and what is not. At the time of writing, only IT Semesters 3-4 (legacy 2010 scheme) contain subjects, and no notes/YouTube links have been researched.

Regenerate JSON and the report with `python3 scripts/build_data.py` (transcriptions live in `scripts/transcriptions/`).
Unit resource shape: `{ "url": "https://..." | null, "match": "exact_match" | "partial_match" | "unavailable", "researched": true | false }`.

## Features
Global search (departments, subjects, units, syllabus topics), responsive hamburger nav, loading/empty/error states, keyboard-accessible accordions, visible focus, high-contrast colors, Atkinson Hyperlegible font (system fallback offline).

## Notes
Routes use `#/dept/sem/subject`, so any static host works without server config.
