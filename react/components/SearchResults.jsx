import { DEPARTMENTS } from "../data/departments.js";
import { href } from "../hooks/useRoute.js";
import { norm } from "../../js/utils.js";
import { Empty } from "./States.jsx";

export default function SearchResults({ query, data }) {
  const q = norm(query);
  const depts = DEPARTMENTS.filter((d) => norm(d.name).includes(q));
  const subjects = [];
  for (const [dId, sems] of Object.entries(data))
    for (const [sem, list] of Object.entries(sems))
      for (const s of list) {
        const hit = [s.name, s.code, ...(s.units ?? []).flatMap((u) => [u.title, ...(u.syllabus ?? [])])]
          .some((t) => norm(t).includes(q));
        if (hit) subjects.push({ dId, sem, s });
      }
  if (!depts.length && !subjects.length)
    return <Empty title={`No results for “${query}”`}>Try a shorter word, or browse by department.</Empty>;
  return (
    <section>
      <h1>Results for “{query}”</h1>
      <ul className="list">
        {depts.map((d) => <li key={d.id}><a className="row" href={href(d.id)}><span>{d.name}</span><span className="muted">Department</span></a></li>)}
        {subjects.map(({ dId, sem, s }) => (
          <li key={`${dId}${sem}${s.id}`}><a className="row" href={href(dId, sem, s.id)}>
            <span>{s.name}</span><span className="muted">{dId.toUpperCase()} · Sem {sem}</span></a></li>
        ))}
      </ul>
    </section>
  );
}
