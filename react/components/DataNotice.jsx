// Shows how trustworthy a semester's data is, taken from its JSON file.
export default function DataNotice({ info }) {
  if (!info) return null;
  return (
    <p className="notice" role="note">
      <strong>Data status:</strong> {info.note}
    </p>
  );
}
