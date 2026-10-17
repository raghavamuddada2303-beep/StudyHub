import { href } from "../hooks/useRoute.js";
import { Empty } from "./States.jsx";
import UnitAccordion from "./UnitAccordion.jsx";
import DataNotice from "./DataNotice.jsx";

export default function SubjectDetail({ dept, sem, subject, info }) {
  const back = <a className="back" href={href(dept.id, sem)}>‹ Semester {sem} subjects</a>;
  if (!subject) return <section>{back}<Empty title="Subject not found">Check the link or pick a subject from the list.</Empty></section>;
  const units = subject.units ?? [];
  return (
    <section>
      {back}
      <h1>{subject.name}</h1>
      <p className="lead">{dept.name} · Semester {sem}{subject.code ? ` · ${subject.code}` : ""}</p>
      <DataNotice info={info} />
      {units.length === 0
        ? <Empty title="No units added yet">Units for this subject have not been added.</Empty>
        : <ul className="list units">{units.map((u) => <UnitAccordion key={u.number} unit={u} />)}</ul>}
    </section>
  );
}
