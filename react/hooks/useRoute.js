import { useEffect, useState } from "react";

// Hash routes: #/<dept>/<semester>/<subjectId>
const read = () => window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);

export function useRoute() {
  const [parts, setParts] = useState(read);
  useEffect(() => {
    const onChange = () => setParts(read());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return parts;
}
export const href = (...p) => "#/" + p.join("/");
