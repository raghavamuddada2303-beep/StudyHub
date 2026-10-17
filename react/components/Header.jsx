import { useMemo, useState } from "react";
import { debounce } from "../../js/utils.js";

export default function Header({ onSearch }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const push = useMemo(() => debounce(onSearch, 250), [onSearch]);
  const change = (e) => { setValue(e.target.value); push(e.target.value); };
  const clear = () => { setValue(""); onSearch(""); setOpen(false); };

  return (
    <header className="site-header">
      <div className="container bar">
        <a className="brand" href="#/" onClick={clear}>StudyHub<small>NIT Raipur</small></a>
        <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
        <div id="nav" className={"nav" + (open ? " open" : "")}>
          <a href="#/" onClick={clear}>Departments</a>
          <form role="search" onSubmit={(e) => e.preventDefault()}>
            <label className="sr-only" htmlFor="q">Search departments, subjects and units</label>
            <input id="q" type="search" placeholder="Search subjects or units" value={value} onChange={change} />
          </form>
        </div>
      </div>
    </header>
  );
}
