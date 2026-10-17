import { useEffect, useState } from "react";

// Loads the data module asynchronously so loading/error states are real.
export function useCurriculum() {
  const [state, setState] = useState({ loading: true, error: false, data: {}, meta: {} });
  useEffect(() => {
    import("../data/curriculum.js")
      .then((m) => setState({ loading: false, error: false, data: m.default, meta: m.meta }))
      .catch(() => setState({ loading: false, error: true, data: {}, meta: {} }));
  }, []);
  return state;
}
