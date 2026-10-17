import { SEMESTERS } from "../data/departments.js";
import { href } from "../hooks/useRoute.js";

export default function SemesterPicker({ dept }) {
  return (
    <section>
      <a className="back" href="#/">‹ All departments</a>
      <h1>{dept.name}: choose a semester</h1>
      <ul className="grid sems">
        {SEMESTERS.map((s) => (
          <li key={s}><a className="tile" href={href(dept.id, s)}>Semester {s}</a></li>
        ))}
      </ul>
    </section>
  );
}
