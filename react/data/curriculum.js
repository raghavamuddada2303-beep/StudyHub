/**
 * Builds the curriculum from react/data/json/<dept>/semester-<n>.json.
 * Content lives only in those JSON files (see DATA_COMPLETION_REPORT.md for what is verified).
 * Nothing is invented here: resources with a missing URL become null and show "Not available yet".
 */
const files = import.meta.glob("./json/*/semester-*.json", { eager: true });

const curriculum = {};
export const meta = {};

for (const [path, mod] of Object.entries(files)) {
  const doc = mod.default ?? mod;
  const { department: d, semester: s } = doc;
  (meta[d] ??= {})[s] = { status: doc.status, note: doc.note, scheme: doc.scheme, sourceIds: doc.source_ids };
  if (!doc.subjects?.length) continue;
  (curriculum[d] ??= {})[s] = doc.subjects.map((sub) => ({
    id: sub.id, name: sub.name, code: sub.code,
    units: sub.units.map((u) => ({
      number: u.number, title: u.title ?? undefined, syllabus: u.syllabus ?? null,
      notes: typeof u.notes === "string" ? u.notes : (u.notes?.url ?? null), notesMatch: typeof u.notes === "string" ? "exact_match" : u.notes?.match,
      youtube: typeof u.youtube === "string" ? u.youtube : (u.youtube?.url ?? null), youtubeMatch: typeof u.youtube === "string" ? "exact_match" : u.youtube?.match,
    })),
  }));
}

export default curriculum;
