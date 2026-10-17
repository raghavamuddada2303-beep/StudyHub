import { DEPARTMENTS } from "../data/departments.js";
import { href } from "../hooks/useRoute.js";

export default function DepartmentGrid() {
  return (
    <section>
      <h1>Choose your department</h1>
      <p className="lead">Pick a department, then a semester, to find units, notes and videos.</p>
      <ul className="grid">
        {DEPARTMENTS.map((d) => (
          <li key={d.id}><a className="tile" href={href(d.id)}>{d.name}</a></li>
        ))}
      </ul>
    </section>
  );
}
