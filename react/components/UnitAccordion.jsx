import { useState } from "react";
import ResourceSection from "./ResourceSection.jsx";

export default function UnitAccordion({ unit }) {
  const [open, setOpen] = useState(false);
  const id = `unit-${unit.number}`;
  return (
    <li className="unit">
      <h3>
        <button aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          <span>Unit {unit.number}{unit.title ? `: ${unit.title}` : ""}</span>
          <span aria-hidden="true" className="chev">{open ? "–" : "+"}</span>
        </button>
      </h3>
      {open && <div id={id}><ResourceSection unit={unit} /></div>}
    </li>
  );
}
