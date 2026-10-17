import { isHttpUrl } from "../../js/utils.js";
import { Unavailable } from "./States.jsx";

function LinkButton({ url, label, what, match }) {
  return isHttpUrl(url)
    ? <>{match === "partial_match" && <span className="badge">Partial match</span>} <a className="btn" href={url} target="_blank" rel="noopener noreferrer">{label}<span className="sr-only"> (opens in a new tab)</span></a></>
    : <Unavailable what={what} />;
}

// Renders exactly the three required sections for one unit.
export default function UnitResources({ unit }) {
  const topics = Array.isArray(unit.syllabus) ? unit.syllabus.filter(Boolean) : [];
  return (
    <div className="sections">
      <section className="panel" aria-labelledby={`s-${unit.number}`}>
        <h4 id={`s-${unit.number}`}>Syllabus</h4>
        {topics.length ? <ul>{topics.map((t, i) => <li key={i}>{t}</li>)}</ul> : <Unavailable what="The official syllabus for this unit" />}
      </section>
      <section className="panel" aria-labelledby={`n-${unit.number}`}>
        <h4 id={`n-${unit.number}`}>Notes</h4>
        <LinkButton url={unit.notes} label={unit.notesMatch === "search_link" ? "Search notes" : "Open notes"} what="A notes link" match={unit.notesMatch} />
      </section>
      <section className="panel" aria-labelledby={`y-${unit.number}`}>
        <h4 id={`y-${unit.number}`}>YouTube</h4>
        <LinkButton url={unit.youtube} label={unit.youtubeMatch === "search_link" ? "Find videos" : "Watch on YouTube"} what="A video link" match={unit.youtubeMatch} />
      </section>
    </div>
  );
}
