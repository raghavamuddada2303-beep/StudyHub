export function Loading({ label = "Loading resources…" }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function Empty({ title, children, action }) {
  return (
    <div className="state empty">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export const Unavailable = ({ what }) => (
  <p className="unavailable">
    <span className="badge">Not available yet</span> {what} has not been added.
  </p>
);
