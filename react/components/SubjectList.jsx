import { href } from "../hooks/useRoute.js";
import { Empty } from "./States.jsx";
import DataNotice from "./DataNotice.jsx";

export default function SubjectList({ dept, sem, subjects, info }) {
  return (
    <section>
      <a className="back" href={href(dept.id)}>‹ {dept.name} semesters</a>
      <h1>{dept.name}, Semester {sem}</h1>
      <DataNotice info={info} />
      {subjects.length === 0 ? (
        <Empty title="No subjects added yet">
          Subjects for this semester have not been added. They are added from the official NIT Raipur scheme only.
        </Empty>
      ) : (
        <ul className="list">
          {subjects.map((s) => (
            <li key={s.id}>
              <a className="row" href={href(dept.id, sem, s.id)}>
                <span>{s.name}</span>
                {s.code && <span className="muted">{s.code}</span>}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
