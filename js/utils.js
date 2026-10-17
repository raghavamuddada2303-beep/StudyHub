// Vanilla JS helpers (framework-free), imported by the React app.
export const debounce = (fn, ms = 250) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};
export const isHttpUrl = (v) => {
  try { return ["http:", "https:"].includes(new URL(v).protocol); } catch { return false; }
};
export const norm = (s) => String(s ?? "").toLowerCase().trim();
