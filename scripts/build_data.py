#!/usr/bin/env python3
"""Generates react/data/json/<dept>/semester-N.json (72 files), sources.json and DATA_COMPLETION_REPORT.md.
Only facts recorded in SOURCES / COMBO_SOURCES / the transcription files are written. Nothing is inferred."""
import json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "react" / "data" / "json"
DEPTS = [("it","IT"),("cse","CSE"),("ece","ECE"),("mechanical","Mechanical"),("mining","Mining"),
         ("metallurgy","Metallurgy"),("civil","Civil"),("biotechnology","Biotechnology"),("biomedical","Biomedical")]

SOURCES = {
 "S1": dict(title="Scheme and Detailed Syllabus, B.Tech Information Technology (legacy)",
   url="https://nitrr.ac.in/downloads/syllabus/it/IT%20Syllabus%20NIT%20Scheme.pdf",
   version="Cover page: 'applicable for batches admitted from July, 2010 onwards'",
   applicability="IT, Semesters III-VIII (legacy NIT scheme, codes IT 301-IT 8xx)",
   access="OPENED AND READ (Sem III-VII in full; Sem VIII cut off by the reader)",
   currency="UNVERIFIED. Newer CBCS documents exist (S7, S8) and their snippets show different IT subjects, so this is probably superseded for later batches."),
 "S2": dict(title="NIT Raipur 'Scheme and Syllabus' index page", url="https://nitrr.ac.in/syllabus.php",
   version="n/a", applicability="Index of scheme/syllabus links for all programmes",
   access="Seen only as a search snippet; automated fetch is blocked by the site (robots).",
   currency="Unknown"),
 "S3": dict(title="Scheme for First Year (B.Tech/B.Arch), codes like MA10I001MA", url="https://www.nitrr.ac.in/downloads/syl_new/1_Syllabus.pdf",
   version="Not stated in the snippet", applicability="Semesters 1 and 2 (first-year courses; branch/group mapping unverified)",
   access="LOCATED, NOT READABLE: automated fetch blocked; only search snippets seen.", currency="Unknown, but it uses the newer course-code format"),
 "S4": dict(title="CSE 3rd semester scheme and syllabus ('NIT Scheme', codes like CS20313(CS))", url="https://nitrr.ac.in/downloads/syl_new/CSE/3rd%20sem.pdf",
   version="Not stated in the snippet", applicability="CSE Semester III (applicability to current batches unverified)",
   access="LOCATED, NOT READABLE: fetch blocked; snippets only.", currency="Unknown; code format looks older than the first-year scheme"),
 "S4b": dict(title="CSE 7th semester syllabus ('NIT Scheme')", url="https://nitrr.ac.in/downloads/syl_new/CSE/7th%20sem.pdf",
   version="Not stated", applicability="CSE Semester VII", access="LOCATED, NOT READABLE: fetch blocked; snippets only.", currency="Unknown"),
 "S5": dict(title="Biotechnology Semester 4 scheme and syllabus", url="https://nitrr.ac.in/downloads/syl_new/BT/BIOTECH_Sem4.pdf",
   version="Not stated", applicability="Biotechnology Semester IV", access="LOCATED, NOT READABLE: fetch blocked; snippets only.", currency="Unknown"),
 "S6": dict(title="Mechanical Engineering VIth Semester Scheme and Syllabus (CBCS)", url="https://nitrr.ac.in/downloads/syl_new/MECH/new_cbcs/VIth%20Semester%20Scheme%20and%20Syllabus.pdf",
   version="Not stated", applicability="Mechanical Semester VI", access="LOCATED, NOT READABLE: fetch blocked; snippets only.", currency="Unknown"),
 "S7": dict(title="Complete syllabus 6th semester CBCS (dated 02 June 2021 in file name)",
   url="https://nitrr.ac.in/downloads/syl_new/Arch/cbcs/newCBCS/Complete%20syllabus%206th%20semester%20CBCS_02%20June%202021.pdf",
   version="File name dated 02 June 2021", applicability="Multi-branch compilation; IT content seen in snippet; other branches unverified",
   access="LOCATED, NOT READABLE: fetch blocked; snippets only.", currency="Unknown"),
 "S8": dict(title="4th sem Syllabus (CBCS compilation)", url="https://nitrr.ac.in/downloads/syl_new/Arch/cbcs/newCBCS/4th%20sem%20Syllabus.pdf",
   version="Not stated", applicability="Multi-branch compilation; IT-style content seen in snippet; other branches unverified",
   access="LOCATED, NOT READABLE: fetch blocked; snippets only.", currency="Unknown"),
}
COMBO_SOURCES = {}
for d,_ in DEPTS:
    for s in (1,2): COMBO_SOURCES[(d,s)] = ["S3"]
COMBO_SOURCES.update({("cse",3):["S4"],("cse",7):["S4b"],("biotechnology",4):["S5"],("mechanical",6):["S6"],
  ("it",3):["S1"],("it",4):["S1","S8"],("it",5):["S1"],("it",6):["S1","S7"],("it",7):["S1"],("it",8):["S1"]})

def parse(path):
    data, sem, sub = {}, None, None
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.startswith("#"): continue
        if line.startswith("@SEM "): sem = int(line[5:]); data[sem] = []
        elif line.startswith("@SUB "):
            code, name, cr = line[5:].split("|")
            sub = dict(id=re.sub(r"[^a-z0-9]+","-",code.lower()).strip("-"), code=code, name=name, credits=int(cr), units=[]); data[sem].append(sub)
        elif line.startswith("@U "):
            title, topics = line[3:].split("|",1)
            n = len(sub["units"])+1
            res = dict(url=None, match="unavailable", researched=False)
            sub["units"].append(dict(number=n, title=title.strip() or None,
                syllabus=[t.strip() for t in topics.split("||") if t.strip()], syllabus_status="verified_official",
                notes=dict(res), youtube=dict(res)))
    return data

IT = parse(ROOT/"scripts"/"transcriptions"/"it-legacy-2010.txt")
rows = []
for d, label in DEPTS:
    (OUT/d).mkdir(parents=True, exist_ok=True)
    for s in range(1,9):
        subjects = IT.get(s, []) if d == "it" else []
        srcs = COMBO_SOURCES.get((d,s), ["S2"])
        if d=="it" and s in IT:
            status = "legacy_syllabus_verified_resources_not_researched"
            note = ("LEGACY 2010 scheme (S1): syllabus transcribed from the official PDF, but newer CBCS documents exist, so it may NOT match what is taught now. "
                    "Notes/YouTube not yet researched.")
        elif d=="it" and s in (5,6,7,8):
            status = "legacy_source_read_not_transcribed"
            note = "Official legacy PDF (S1) was read for this semester but its subjects have not been transcribed yet; a newer CBCS source may supersede it."
        elif srcs==["S2"]:
            status = "not_started_no_source_located"
            note = "No department/semester syllabus PDF located. Nothing entered."
        else:
            status = "source_located_not_readable"
            note = "A candidate official PDF was located but could not be opened (site blocks automated access). No subjects or units entered."
        doc = dict(department=d, semester=s, status=status, note=note, source_ids=srcs,
                   scheme=("legacy-2010" if subjects else None), subjects=subjects)
        (OUT/d/f"semester-{s}.json").write_text(json.dumps(doc, indent=2, ensure_ascii=False), encoding="utf-8")
        nu = sum(len(x["units"]) for x in subjects)
        rows.append((label, s, status, len(subjects), nu, srcs, note))
(OUT/"sources.json").write_text(json.dumps(SOURCES, indent=2, ensure_ascii=False), encoding="utf-8")

L = ["# StudyHub Data Completion Report", "",
 "Generated by `scripts/build_data.py`. Date of research: 17 Oct 2026.", "",
 "## Bottom line", "",
 f"- **Complete department-semesters: 0 of 72.**",
 f"- Department-semesters with any verified subject data: {sum(1 for r in rows if r[3])} (all IT, legacy 2010 scheme).",
 f"- Verified subjects: {sum(r[3] for r in rows)}; verified units: {sum(r[4] for r in rows)} (theory subjects only; labs/electives not entered).",
 "- Verified notes links: **0**. Verified YouTube links: **0**. Resources were **not researched** (not 'searched and none found'). Every unit is marked `unavailable` with `researched: false`.",
 "", "## Why so little is done", "",
 "1. **Most official syllabus PDFs cannot be opened by automated tools.** nitrr.ac.in blocks automated fetches for `/downloads/syl_new/...` (CSE, first year, Biotech, Mechanical, CBCS folders) and for the index page. I could see only short search-engine snippets of them, which are fragments and not enough to record a complete, correct syllabus.",
 "2. **One official PDF was readable**: the legacy IT syllabus (S1). I transcribed Semesters III and IV verbatim. Semesters V-VII were read but not yet transcribed.",
 "3. **Version problem.** NIT Raipur has several generations of schemes (legacy 2010, 'NIT Scheme' CS2xxxx codes, CBCS, and a newer first-year scheme with codes like MA10I001MA; a Chemical syllabus file dated 2026 also exists). Which one applies to a given batch is not stated in anything I could read.",
 "4. **Resource search (notes PDFs, YouTube) was not started.** Verifying links and relevance per unit needs opening each page, which was not done. Nothing was guessed.",
 "5. Search results for 'NIT Raipur' syllabus often returned RGPV, AKTU and VTU syllabi. These are different universities and were **not** used.",
 "", "## Status legend", "",
 "- `legacy_syllabus_verified_resources_not_researched`: official text transcribed, scheme may be superseded, no resources checked.",
 "- `legacy_source_read_not_transcribed`: official legacy text was read, not yet entered.",
 "- `source_located_not_readable`: candidate official PDF URL found, could not be opened.",
 "- `not_started_no_source_located`: no source URL found for this combination.",
 "", "## All 72 department-semester combinations", "",
 "| Dept | Sem | Status | Subjects | Units | Source IDs | Notes / YouTube verified | Missing / limitation |", "|---|---|---|---|---|---|---|---|"]
for lab,s,st,ns,nu,srcs,note in rows:
    L.append(f"| {lab} | {s} | `{st}` | {ns} | {nu} | {', '.join(srcs)} | 0 / 0 | {note} |")
L += ["", "## Source registry", ""]
for k,v in SOURCES.items():
    L += [f"### {k}: {v['title']}", f"- URL: {v['url']}", f"- Version: {v['version']}", f"- Applicability: {v['applicability']}",
          f"- Access: {v['access']}", f"- Currency: {v['currency']}", ""]
L += ["## Data conventions", "",
 "- Files: `react/data/json/<dept>/semester-<n>.json`; registry: `react/data/json/sources.json`.",
 "- Unit resource fields use `{ url, match, researched }`, `match` in `exact_match | partial_match | unavailable`.",
 "- `researched: false` means nobody has looked yet.",
 "- IT Sem III-IV text is copied from S1. Sentences are split with markers only, and original spelling is kept (including typos).",
 "- IT 401 is titled 'Statistical Method & Probability' in the scheme table and 'Probability, Statistics and Queuing Theory' on its syllabus page; the syllabus-page title is used.",
 "", "## Suggested next steps", "",
 "1. Open the official PDFs in a browser (download manually) and put them in `scripts/source-pdfs/`, or paste the text, then add a transcription file per department like `it-legacy-2010.txt`.",
 "2. Ask the department or the academic section which scheme applies to each batch, then mark older schemes as legacy.",
 "3. Research one notes link and one YouTube link per unit and record `match` honestly.",
 "4. Re-run `python3 scripts/build_data.py`; the report regenerates."]
(ROOT/"DATA_COMPLETION_REPORT.md").write_text("\n".join(L)+"\n", encoding="utf-8")
print(len(rows), "combos;", sum(r[3] for r in rows), "subjects;", sum(r[4] for r in rows), "units")
